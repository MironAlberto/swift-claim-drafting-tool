import React from 'react';
import { Card } from '@/components/ui/card';
import type { ClaimStep } from '@/types/claims';

interface Step {
  id: ClaimStep;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  completed: boolean;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: ClaimStep;
  onStepClick: (step: ClaimStep) => void;
  getCurrentStepIndex: () => number;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  currentStep,
  onStepClick,
  getCurrentStepIndex
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = step.completed;
          const isPast = index < getCurrentStepIndex();
          
          return (
            <div key={step.id} className="flex items-center">
              <div 
                className={`flex items-center space-x-3 cursor-pointer transition-all duration-200 ${
                  isActive ? 'text-blue-600 scale-110' : 
                  isCompleted || isPast ? 'text-green-600' : 'text-gray-400'
                }`}
                onClick={() => {
                  if (isPast || isCompleted) {
                    onStepClick(step.id);
                  }
                }}
              >
                <div className={`p-4 rounded-full transition-all duration-200 ${
                  isActive ? 'bg-blue-100 text-blue-600 shadow-lg' : 
                  isCompleted || isPast ? 'bg-green-100 text-green-600' : 'bg-gray-100'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-medium text-lg">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-20 h-px mx-6 transition-all duration-300 ${
                  index < getCurrentStepIndex() ? 'bg-green-400' : 'bg-gray-300'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};