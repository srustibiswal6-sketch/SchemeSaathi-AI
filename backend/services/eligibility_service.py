from typing import Any, Dict, List
from database.models import CitizenProfileDB, EligibilityRuleDB


def parse_target_value(value_str: str) -> Any:
    """Safely parse a string value into its appropriate Python type without eval()."""
    cleaned = value_str.strip()
    if cleaned.lower() == "true":
        return True
    if cleaned.lower() == "false":
        return False

    # Try integer
    try:
        return int(cleaned)
    except ValueError:
        pass

    # Try float
    try:
        return float(cleaned)
    except ValueError:
        pass

    # Default to string
    return cleaned


def compare_values(actual: Any, operator: str, required: Any) -> bool:
    """
    Deterministically compare actual and required values using explicit operators.
    Zero use of eval() or dynamic execution.
    """
    # Boolean comparison
    if isinstance(required, bool):
        actual_bool = bool(actual)
        if operator == "==":
            return actual_bool == required
        elif operator == "!=":
            return actual_bool != required
        return False

    # Numeric comparison
    if isinstance(required, (int, float)) and isinstance(actual, (int, float)):
        if operator == "==":
            return actual == required
        elif operator == "!=":
            return actual != required
        elif operator == ">":
            return actual > required
        elif operator == ">=":
            return actual >= required
        elif operator == "<":
            return actual < required
        elif operator == "<=":
            return actual <= required
        return False

    # String comparison (case-insensitive for text attributes like state, occupation, etc.)
    str_actual = str(actual).strip().lower()
    str_required = str(required).strip().lower()

    if operator == "==":
        return str_actual == str_required
    elif operator == "!=":
        return str_actual != str_required
    elif operator == ">":
        return str_actual > str_required
    elif operator == ">=":
        return str_actual >= str_required
    elif operator == "<":
        return str_actual < str_required
    elif operator == "<=":
        return str_actual <= str_required

    return False


def evaluate_eligibility(profile: CitizenProfileDB, rules: List[EligibilityRuleDB]) -> Dict[str, Any]:
    """
    Deterministic rule evaluation engine for a citizen profile against a scheme's rules.

    Returns:
        dict with keys:
            - eligible: bool
            - matched_rules: list
            - failed_rules: list
            - missing_information: list
            - summary: str
    """
    matched_rules: List[Dict[str, Any]] = []
    failed_rules: List[Dict[str, Any]] = []
    missing_information: List[Dict[str, Any]] = []

    for rule in rules:
        field_name = rule.field.strip()
        target_val = parse_target_value(rule.value)

        # Safely extract attribute from profile model or dict
        if hasattr(profile, field_name):
            actual_val = getattr(profile, field_name)
        elif isinstance(profile, dict) and field_name in profile:
            actual_val = profile[field_name]
        else:
            actual_val = None

        if actual_val is None:
            missing_information.append({
                "field": field_name,
                "operator": rule.operator,
                "required": target_val,
                "reason": f"Profile is missing value for '{field_name}'"
            })
            continue

        # For numeric rules, attempt to cast actual value if it came in as a numeric string
        normalized_actual = actual_val
        if isinstance(target_val, (int, float)) and not isinstance(actual_val, (int, float, bool)):
            try:
                normalized_actual = float(actual_val)
            except (ValueError, TypeError):
                missing_information.append({
                    "field": field_name,
                    "operator": rule.operator,
                    "required": target_val,
                    "reason": f"Value for '{field_name}' ({actual_val}) cannot be compared numerically"
                })
                continue

        # Evaluate comparison
        passed = compare_values(normalized_actual, rule.operator, target_val)

        rule_result = {
            "field": field_name,
            "operator": rule.operator,
            "required": target_val,
            "actual": actual_val
        }

        if passed:
            matched_rules.append(rule_result)
        else:
            failed_rules.append(rule_result)

    # Determine final eligibility
    # Must have 0 failed rules, 0 missing required info, and at least matched all required rules
    is_eligible = (len(failed_rules) == 0 and len(missing_information) == 0)

    # Generate explainable summary
    if is_eligible:
        if len(matched_rules) == 0:
            summary = "Eligible: No special restrictions apply to this scheme."
        else:
            summary = f"Eligible: Citizen satisfied all {len(matched_rules)} eligibility criteria."
    elif len(failed_rules) > 0:
        fail_desc = ", ".join([f"{f['field']} must be {f['operator']} {f['required']} (current: {f['actual']})" for f in failed_rules])
        summary = f"Not eligible: Failed criteria: {fail_desc}."
    else:
        missing_fields = ", ".join([m["field"] for m in missing_information])
        summary = f"Information needed: Missing {missing_fields} to complete eligibility verification."

    return {
        "eligible": is_eligible,
        "matched_rules": matched_rules,
        "failed_rules": failed_rules,
        "missing_information": missing_information,
        "summary": summary
    }
