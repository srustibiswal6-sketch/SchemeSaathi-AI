import React from 'react';

export default function ProgressBar({
  type = 'fraction', // 'stepper' or 'fraction'
  currentStep = 1,
  totalSteps = 2,
  steps = [],
  value = 0,
  max = 100,
  label = '',
  color = 'primary'
}) {
  if (type === 'stepper') {
    return (
      <div className="stepper-container" aria-label={`Step ${currentStep} of ${totalSteps}`}>
        <div className="stepper-header">
          <span className="stepper-badge">Step {currentStep} of {totalSteps}</span>
          {steps[currentStep - 1] && (
            <span className="stepper-title">{steps[currentStep - 1]}</span>
          )}
        </div>
        <div className="stepper-track">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNum = index + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            return (
              <div
                key={stepNum}
                className={`stepper-segment ${
                  isCompleted ? 'segment-completed' : isCurrent ? 'segment-current' : 'segment-pending'
                }`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // Fraction or Percentage bar
  const percentage = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;

  return (
    <div className="progress-bar-wrapper">
      {label && (
        <div className="progress-label-row">
          <span className="progress-label-text">{label}</span>
          <span className="progress-percentage-text">{percentage}% Ready</span>
        </div>
      )}
      <div className="progress-track" role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax={max}>
        <div
          className={`progress-fill progress-${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
