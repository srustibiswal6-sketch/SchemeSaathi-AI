import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import ProgressBar from '../components/ProgressBar';
import { 
  User, 
  IndianRupee, 
  CheckSquare, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi NCT',
  'Jammu & Kashmir', 'Ladakh'
];

export default function Profile() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ ...profile });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    const ageNum = Number(formData.age);

    if (!formData.age || isNaN(ageNum)) {
      newErrors.age = 'Please enter a valid age in years.';
    } else if (ageNum < 1 || ageNum > 120) {
      newErrors.age = 'Age must be between 1 and 120.';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select your gender.';
    }

    if (!formData.state) {
      newErrors.state = 'Please select your state of residence.';
    }

    if (!formData.district?.trim()) {
      newErrors.district = 'Please enter your district.';
    }

    if (!formData.areaType) {
      newErrors.areaType = 'Please choose Rural or Urban.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    const incomeNum = Number(formData.annualIncome);

    if (formData.annualIncome === '' || isNaN(incomeNum)) {
      newErrors.annualIncome = 'Please enter annual family income (enter 0 if no taxable income).';
    } else if (incomeNum < 0) {
      newErrors.annualIncome = 'Income cannot be negative.';
    }

    if (!formData.occupation?.trim()) {
      newErrors.occupation = 'Please specify your primary occupation or student status.';
    }

    if (!formData.employmentStatus) {
      newErrors.employmentStatus = 'Please select your employment status.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      updateProfile(formData);
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep2()) {
      updateProfile(formData);
      navigate('/schemes');
    }
  };

  return (
    <div className="page-profile-container">
      <div className="profile-card-wrapper">
        <div className="profile-header">
          <span className="profile-eyebrow">CITIZEN ELIGIBILITY PROFILE</span>
          <h1 className="profile-main-title">Tell us about yourself</h1>
          <p className="profile-subtitle">
            Answer a few questions so we can find schemes relevant to you. Your answers stay on your device.
          </p>

          <div className="profile-progress-bar">
            <ProgressBar
              type="stepper"
              currentStep={currentStep}
              totalSteps={2}
              steps={['Personal Information', 'Economic & Additional Information']}
            />
          </div>
        </div>

        {/* STEP 1: Personal Information */}
        {currentStep === 1 && (
          <form onSubmit={handleNext} className="profile-form">
            <div className="form-section-title">
              <User className="w-5 h-5 text-sky-700 mr-2" />
              <h3>Personal Information</h3>
            </div>

            <div className="form-grid">
              {/* Age */}
              <div className="form-group">
                <label htmlFor="age" className="form-label required">
                  Age (in years)
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g. 22"
                  min="1"
                  max="120"
                  className={`form-input ${errors.age ? 'input-error' : ''}`}
                />
                {errors.age && (
                  <span className="form-error-msg">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.age}
                  </span>
                )}
              </div>

              {/* Gender */}
              <div className="form-group">
                <label htmlFor="gender" className="form-label required">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`form-select ${errors.gender ? 'input-error' : ''}`}
                >
                  <option value="">Select Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Transgender">Transgender</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <span className="form-error-msg">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.gender}
                  </span>
                )}
              </div>

              {/* State */}
              <div className="form-group">
                <label htmlFor="state" className="form-label required">
                  State / UT of Residence
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`form-select ${errors.state ? 'input-error' : ''}`}
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <span className="form-error-msg">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.state}
                  </span>
                )}
              </div>

              {/* District */}
              <div className="form-group">
                <label htmlFor="district" className="form-label required">
                  District
                </label>
                <input
                  type="text"
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="e.g. Khordha, Pune, Varanasi"
                  className={`form-input ${errors.district ? 'input-error' : ''}`}
                />
                {errors.district && (
                  <span className="form-error-msg">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.district}
                  </span>
                )}
              </div>

              {/* Area Type */}
              <div className="form-group full-width">
                <label className="form-label required">Area / Locality Type</label>
                <div className="radio-button-group">
                  <label className={`radio-card ${formData.areaType === 'Rural' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="areaType"
                      value="Rural"
                      checked={formData.areaType === 'Rural'}
                      onChange={handleChange}
                    />
                    <div className="radio-card-content">
                      <span className="radio-card-title">Rural (Village / Gram Panchayat)</span>
                      <span className="radio-card-sub">Agricultural lands, panchayat jurisdictions</span>
                    </div>
                  </label>

                  <label className={`radio-card ${formData.areaType === 'Urban' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="areaType"
                      value="Urban"
                      checked={formData.areaType === 'Urban'}
                      onChange={handleChange}
                    />
                    <div className="radio-card-content">
                      <span className="radio-card-title">Urban (Town / City / Municipality)</span>
                      <span className="radio-card-sub">Municipal corporation, cantonment, metro zones</span>
                    </div>
                  </label>
                </div>
                {errors.areaType && (
                  <span className="form-error-msg">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.areaType}
                  </span>
                )}
              </div>
            </div>

            <div className="form-actions-row">
              <div></div>
              <button type="submit" className="btn btn-primary btn-step-action">
                <span>Continue to Step 2</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Economic & Additional Information */}
        {currentStep === 2 && (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section-title">
              <IndianRupee className="w-5 h-5 text-amber-700 mr-2" />
              <h3>Economic Information</h3>
            </div>

            <div className="form-grid">
              {/* Annual Income */}
              <div className="form-group">
                <label htmlFor="annualIncome" className="form-label required">
                  Annual Family Income (in ₹ INR)
                </label>
                <div className="input-currency-wrapper">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    id="annualIncome"
                    name="annualIncome"
                    value={formData.annualIncome}
                    onChange={handleChange}
                    placeholder="e.g. 180000"
                    min="0"
                    className={`form-input input-with-currency ${errors.annualIncome ? 'input-error' : ''}`}
                  />
                </div>
                <span className="input-hint">Combined pre-tax income of all family members.</span>
                {errors.annualIncome && (
                  <span className="form-error-msg">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.annualIncome}
                  </span>
                )}
              </div>

              {/* Employment Status */}
              <div className="form-group">
                <label htmlFor="employmentStatus" className="form-label required">
                  Employment Status
                </label>
                <select
                  id="employmentStatus"
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={handleChange}
                  className={`form-select ${errors.employmentStatus ? 'input-error' : ''}`}
                >
                  <option value="">Select Status</option>
                  <option value="Student">Student</option>
                  <option value="Employed">Employed (Salaried)</option>
                  <option value="Self-Employed">Self-Employed / Small Business</option>
                  <option value="Farmer">Farmer / Agriculture</option>
                  <option value="Unemployed">Unemployed / Seeking Work</option>
                  <option value="Homemaker">Homemaker</option>
                  <option value="Retired">Retired</option>
                </select>
                {errors.employmentStatus && (
                  <span className="form-error-msg">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.employmentStatus}
                  </span>
                )}
              </div>

              {/* Occupation */}
              <div className="form-group full-width">
                <label htmlFor="occupation" className="form-label required">
                  Primary Occupation / Field of Study
                </label>
                <input
                  type="text"
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="e.g. Higher Education Student, Small Shop Owner, Paddy Farmer"
                  className={`form-input ${errors.occupation ? 'input-error' : ''}`}
                />
                {errors.occupation && (
                  <span className="form-error-msg">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.occupation}
                  </span>
                )}
              </div>
            </div>

            {/* Additional Information Checkboxes */}
            <div className="form-section-title mt-6">
              <CheckSquare className="w-5 h-5 text-emerald-700 mr-2" />
              <h3>Additional Information</h3>
            </div>
            <p className="section-instruction">Select all criteria that apply to you for specialized category schemes:</p>

            <div className="checkbox-toggle-grid">
              <label className={`toggle-checkbox-card ${formData.isStudent ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  name="isStudent"
                  checked={formData.isStudent}
                  onChange={handleChange}
                />
                <div className="toggle-card-body">
                  <span className="toggle-card-title">Currently a Student</span>
                  <span className="toggle-card-desc">Enrolled in school, college, diploma, or degree</span>
                </div>
              </label>

              <label className={`toggle-checkbox-card ${formData.isFarmer ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  name="isFarmer"
                  checked={formData.isFarmer}
                  onChange={handleChange}
                />
                <div className="toggle-card-body">
                  <span className="toggle-card-title">Farmer / Agricultural Worker</span>
                  <span className="toggle-card-desc">Own cultivable land or work in farm cultivation</span>
                </div>
              </label>

              <label className={`toggle-checkbox-card ${formData.isBusinessOwner ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  name="isBusinessOwner"
                  checked={formData.isBusinessOwner}
                  onChange={handleChange}
                />
                <div className="toggle-card-body">
                  <span className="toggle-card-title">Micro-Business Owner / Artisan</span>
                  <span className="toggle-card-desc">Own shop, trading stall, craft, or small venture</span>
                </div>
              </label>

              <label className={`toggle-checkbox-card ${formData.isDisability ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  name="isDisability"
                  checked={formData.isDisability}
                  onChange={handleChange}
                />
                <div className="toggle-card-body">
                  <span className="toggle-card-title">Person with Disability (Divyangjan)</span>
                  <span className="toggle-card-desc">Possessing UDID card or benchmark disability certificate</span>
                </div>
              </label>

              <label className={`toggle-checkbox-card ${formData.isSenior ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  name="isSenior"
                  checked={formData.isSenior}
                  onChange={handleChange}
                />
                <div className="toggle-card-body">
                  <span className="toggle-card-title">Senior Citizen</span>
                  <span className="toggle-card-desc">Aged 60 years or above</span>
                </div>
              </label>

              <label className={`toggle-checkbox-card ${formData.isWoman ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  name="isWoman"
                  checked={formData.isWoman}
                  onChange={handleChange}
                />
                <div className="toggle-card-body">
                  <span className="toggle-card-title">Woman Applicant / Homemaker</span>
                  <span className="toggle-card-desc">Eligible for women-targeted welfare & entrepreneurship</span>
                </div>
              </label>
            </div>

            <div className="form-actions-row">
              <button
                type="button"
                onClick={handleBack}
                className="btn btn-secondary btn-step-back"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span>Back to Step 1</span>
              </button>

              <button type="submit" className="btn btn-primary btn-step-action">
                <span>Find My Schemes</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </form>
        )}

        <div className="profile-privacy-note">
          <ShieldCheck className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
          <span>
            Data is stored locally on your device for criteria evaluation. No personal information is submitted to third parties.
          </span>
        </div>
      </div>
    </div>
  );
}