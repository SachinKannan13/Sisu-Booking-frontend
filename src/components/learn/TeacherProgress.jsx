import { TEACHER_STEP_LABELS, MODE_COLORS } from '../../constants/learningModes.js';

export default function TeacherProgress({ currentStep = 0 }) {
  const color = MODE_COLORS.teacher;

  return (
    <div className="px-4 py-3 bg-[#fbf9f3] border-b border-[#eceae4]">
      <div className="flex items-center gap-1">
        {TEACHER_STEP_LABELS.map((label, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <div key={label} className="flex-1 flex flex-col items-center gap-1.5 group relative">
              <div
                className="h-1.5 w-full rounded-full transition-all"
                style={{
                  backgroundColor: done || active ? color : '#eceae4',
                  opacity: active ? 1 : done ? 0.6 : 1
                }}
              />
              <span
                className="text-[9px] text-center leading-tight hidden sm:block"
                style={{ color: active ? color : '#8f8a80' }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="sm:hidden text-center text-xs mt-1.5" style={{ color }}>
        Step {currentStep + 1} of 10 — {TEACHER_STEP_LABELS[currentStep]}
      </div>
    </div>
  );
}
