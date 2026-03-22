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
      <div className="flex items-center justify-between mb-2">
        {labels.map((label, i) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                i < currentStep
                  ? 'bg-orange-500 text-white'
                  : i === currentStep
                  ? 'bg-orange-500 text-white ring-2 ring-orange-400 ring-offset-2 ring-offset-gray-900'
                  : 'bg-gray-700 text-gray-400'
              }`}
            >
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span
              className={`text-xs mt-1 hidden sm:block ${
                i <= currentStep ? 'text-orange-400' : 'text-gray-500'
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
        <div
          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
