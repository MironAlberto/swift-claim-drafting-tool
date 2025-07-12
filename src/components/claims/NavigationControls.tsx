import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ClaimStep } from '@/types/claims';

interface NavigationControlsProps {
  currentStep: ClaimStep;
  canProceed: boolean;
  getCurrentStepIndex: () => number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentStep,
  canProceed,
  getCurrentStepIndex,
  totalSteps,
  onPrevious,
  onNext
}) => {
  const getNextButtonText = () => {
    switch (currentStep) {
      case 'upload': return 'Procedi all\'Analisi';
      case 'analysis': return 'Procedi alla Generazione';
      case 'generation': return 'Procedi alla Modifica';
      case 'editing': return 'Procedi alla Condivisione';
      case 'sharing': return 'Completato';
      default: return 'Avanti';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <Button 
          onClick={onPrevious}
          variant="outline"
          disabled={currentStep === 'upload'}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Indietro</span>
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Step {getCurrentStepIndex() + 1} di {totalSteps}
          </p>
        </div>

        <Button 
          onClick={onNext}
          disabled={!canProceed || currentStep === 'sharing'}
          className="flex items-center space-x-2"
        >
          <span>{getNextButtonText()}</span>
          {currentStep !== 'sharing' && <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>
    </Card>
  );
};