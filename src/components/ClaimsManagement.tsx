import React from 'react';
import { useClaimsFlow } from '@/hooks/useClaimsFlow';
import { StepProgress } from '@/components/claims/StepProgress';
import { NavigationControls } from '@/components/claims/NavigationControls';
import { UploadStep } from '@/components/claims/steps/UploadStep';
import { AnalysisStep } from '@/components/claims/steps/AnalysisStep';
import { GenerationStep } from '@/components/claims/steps/GenerationStep';

import { SharingStep } from '@/components/claims/steps/SharingStep';

export const ClaimsManagement = () => {
  const {
    currentStep,
    uploadedFiles,
    analysisData,
    selectedTone,
    generatedDraft,
    editedContent,
    steps,
    setCurrentStep,
    handleFilesUploaded,
    handleAnalysisComplete,
    handleDraftGenerated,
    handleToneChange,
    handleContentEdit,
    handleRegenerateDraft,
    goToNextStep,
    goToPreviousStep,
    resetProcess,
    canProceed,
    getCurrentStepIndex
  } = useClaimsFlow();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'upload':
        return <UploadStep onFilesUploaded={handleFilesUploaded} />;
      
      case 'analysis':
        if (uploadedFiles.length === 0) return null;
        return (
          <AnalysisStep
            files={uploadedFiles}
            onAnalysisComplete={handleAnalysisComplete}
          />
        );
      
      case 'generation':
        if (!analysisData) return null;
        return (
          <GenerationStep
            analysisData={analysisData}
            selectedTone={selectedTone}
            editedContent={editedContent}
            onDraftGenerated={handleDraftGenerated}
            onContentChange={handleContentEdit}
          />
        );
      
      case 'sharing':
        if (!editedContent) return null;
        return (
          <SharingStep
            editedContent={editedContent}
            selectedTone={selectedTone}
            onToneChange={handleToneChange}
            onResetProcess={resetProcess}
            onRegenerateDraft={handleRegenerateDraft}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <StepProgress
        steps={steps}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
        getCurrentStepIndex={getCurrentStepIndex}
      />

      <div className="min-h-[600px]">
        {renderCurrentStep()}
      </div>

      <NavigationControls
        currentStep={currentStep}
        canProceed={canProceed()}
        getCurrentStepIndex={getCurrentStepIndex}
        totalSteps={steps.length}
        onPrevious={goToPreviousStep}
        onNext={goToNextStep}
      />
    </div>
  );
};