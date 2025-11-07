"use client";
import CheckIcon from "./CheckIcon";

interface ProgressStep {
  label: string;
  bgColor?: "primary-700" | "green-500";
  textColor?: "gray-500" | "green-500";
}

interface ProgressBarProps {
  steps: ProgressStep[];
  className?: string;
}

export default function ProgressBar({
  steps,
  className = "",
}: ProgressBarProps) {
  return (
    <div
      className={`bg-white rounded-[10px] p-6 flex items-center justify-center w-full overflow-x-hidden ${className}`}
    >
      {steps.map((step, index) => (
        <div key={index} className="flex items-center flex-1 min-w-0">
          <div className="flex flex-col items-center gap-0.5 w-12 shrink-0">
            <CheckIcon
              size="md"
              bgColor={step.bgColor || "primary-700"}
              active={true}
            />
            <p
              className={`text-[12px] text-center whitespace-nowrap ${
                step.textColor || "text-gray-500"
              }`}
            >
              {step.label}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 h-px bg-primary-700 mx-2 min-w-0" />
          )}
        </div>
      ))}
    </div>
  );
}
