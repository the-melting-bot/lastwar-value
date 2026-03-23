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
                  ? 'text-white ring-2 ring-offset-2'
                  : 'text-slate-500'
              }`}
              style={
                i < currentStep
                  ? { background: 'linear-gradient(135deg, #FF6B00, #FFD700)' }
                  : i === currentStep
                  ? { background: 'linear-gradient(135deg, #FF6B00, #FF8A33)', boxShadow: '0 0 0 2px #0a1628, 0 0 0 4px #FF6B00' }
                  : { background: 'rgba(15, 29, 50, 0.8)', border: '1px solid rgba(255, 107, 0, 0.15)' }
              }
            >
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span
              className={`text-xs mt-1.5 hidden sm:block font-medium ${
                i <= currentStep ? 'text-orange-400' : 'text-slate-600'
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full rounded-full h-2 mt-2" style={{ background: 'rgba(15, 29, 50, 0.8)' }}>
        <div
          className="progress-fill"
          style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
