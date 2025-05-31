import React from 'react';

interface StepIndicatorProps {
  currentStep: 'upload' | 'sign' | 'download';
}

const steps = [
  { label: 'Upload', key: 'upload' },
  { label: 'Sign', key: 'sign' },
  { label: 'Download', key: 'download' },
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="mt-12">
      <div className="flex items-center justify-center space-x-4 mb-4">
        {steps.map((step, index) => {
          const isActive = currentStep === step.key;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.key}>
              <div className={`flex items-center space-x-2 ${isActive ? 'text-black' : 'text-gray-400'}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    isActive ? 'border-black bg-black text-white' : 'border-gray-300'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="font-medium">{step.label}</span>
              </div>
              {!isLast && <div className="w-8 h-0.5 bg-gray-300"></div>}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;