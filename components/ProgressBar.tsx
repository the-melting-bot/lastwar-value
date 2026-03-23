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
                  ? 'text-[#0B1426]'
                  : i === currentStep
                  ? 'text-[#0B1426] ring-2 ring-offset-2 ring-[#FFD700] ring-offset-[#0B1426]'
                  : 'text-white/30'
              }`}
              style={
                i < currentStep
                  ? { background: 'linear-gradient(135deg, #F59E0B, #FFD700)' }
                  : i === currentStep
                  ? { background: 'linear-gradient(135deg, #F59E0B, #FFD700)' }
                  : { background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)' }
              }
            >
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span
              className={`text-xs mt-1.5 hidden sm:block font-medium ${
                i <= currentStep ? 'text-[#FFD700]' : 'text-white/30'
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full rounded-full h-2 mt-2" style={{ background: 'rgba(255, 255, 255, 0.06)' }}>
        <div
          className="progress-fill"
          style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
