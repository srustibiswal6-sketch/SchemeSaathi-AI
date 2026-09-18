import json
import os
import sys

# Ensure backend root is on sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_ROOT = os.path.dirname(CURRENT_DIR)
if BACKEND_ROOT not in sys.path:
    sys.path.insert(0, BACKEND_ROOT)

from database.database import Base, SessionLocal, engine
from database.models import EligibilityRuleDB, SchemeDB, SchemeSourceDB


def seed_database():
    print("Ensuring database tables exist...")
    Base.metadata.create_all(bind=engine)

    json_path = os.path.join(BACKEND_ROOT, "data", "schemes.json")
    if not os.path.exists(json_path):
        print(f"Error: Seed file not found at {json_path}")
        return

    with open(json_path, "r", encoding="utf-8") as f:
        schemes_data = json.load(f)

    db = SessionLocal()
    try:
        seeded_count = 0
        updated_count = 0

        for item in schemes_data:
            scheme_name = item["name"]
            existing = db.query(SchemeDB).filter(SchemeDB.name == scheme_name).first()

            if existing:
                # Update attributes
                existing.description = item["description"]
                existing.ministry = item["ministry"]
                existing.category = item["category"]
                existing.benefits = item["benefits"]
                existing.application_url = item.get("application_url")
                existing.active = item.get("active", True)

                # Clear old rules and sources for clean idempotent refresh
                db.query(EligibilityRuleDB).filter(EligibilityRuleDB.scheme_id == existing.id).delete()
                db.query(SchemeSourceDB).filter(SchemeSourceDB.scheme_id == existing.id).delete()
                target_scheme = existing
                updated_count += 1
            else:
                target_scheme = SchemeDB(
                    name=scheme_name,
                    description=item["description"],
                    ministry=item["ministry"],
                    category=item["category"],
                    benefits=item["benefits"],
                    application_url=item.get("application_url"),
                    active=item.get("active", True)
                )
                db.add(target_scheme)
                db.flush()  # to obtain target_scheme.id
                seeded_count += 1

            # Insert eligibility rules
            for rule in item.get("rules", []):
                rule_record = EligibilityRuleDB(
                    scheme_id=target_scheme.id,
                    field=rule["field"],
                    operator=rule["operator"],
                    value=str(rule["value"])
                )
                db.add(rule_record)

            # Insert scheme sources
            for source in item.get("sources", []):
                source_record = SchemeSourceDB(
                    scheme_id=target_scheme.id,
                    source_name=source["source_name"],
                    source_url=source["source_url"],
                    last_verified=source.get("last_verified")
                )
                db.add(source_record)

        db.commit()
        print(f"Seeding completed successfully: {seeded_count} new schemes added, {updated_count} updated.")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
