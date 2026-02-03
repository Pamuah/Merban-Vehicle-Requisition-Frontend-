import { FiCheck } from "react-icons/fi";

interface Step {
  title: string;
  step: number;
}

interface StepperProps {
  currentStep: number;
  steps: Step[];
}

export default function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="flex flex-col gap-4 relative">
      {/* Vertical Line */}
      <div className="absolute left-3.5 top-0 w-0.5 h-full bg-gray-200" />

      {steps.map((item, index) => {
        const isCompleted = item.step < currentStep;
        const isActive = item.step === currentStep;

        return (
          <div key={index} className="relative flex items-start gap-3">
            {/* Step Icon */}
            <div className="relative z-10">
              {isCompleted ? (
                <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white text-sm">
                  <FiCheck size={16} />
                </div>
              ) : isActive ? (
                <div className="w-7 h-7 rounded-full border-2 border-green-600 flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full" />
                </div>
              )}
            </div>

            {/* Step Text */}
            <div className="pt-0.5">
              <p className="text-xs text-gray-500 uppercase mb-0.5">
                Step {item.step}
              </p>
              <p
                className={`text-sm font-medium ${
                  isCompleted || isActive ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {item.title}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
