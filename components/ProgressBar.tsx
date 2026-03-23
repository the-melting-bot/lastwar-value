'use client';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export default function ProgressBar({
  currentStep,
  totalSteps,
  labels,
}: ProgressBarProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-3">
        {labels.map((label, i) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                i < currentStep
                  ? 'text-white'
                  : i === currentStep
                  ? 'text-white ring-2 ring-offset-2 ring-[#FF6B00] ring-offset-white'
                  : 'text-[#9CA3AF]'
              }`}
              style={
                i < currentStep
                  ? { background: 'linear-gradient(135deg, #FF6B00, #FFB800)' }
                  : i === currentStep
                  ? { background: 'linear-gradient(135deg, #FF6B00, #FF8A33)' }
                  : { background: '#F3F4F6', border: '1.5px solid #D1D5DB' }
              }
            >
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span
              className={`text-xs mt-1.5 hidden sm:block font-medium ${
                i <= currentStep ? 'text-[#FF6B00]' : 'text-[#9CA3AF]'
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full rounded-full h-2 mt-2 bg-[#F3F4F6]">
        <div
          className="progress-fill"
          style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
