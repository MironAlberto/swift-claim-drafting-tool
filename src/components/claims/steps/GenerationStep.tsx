import React from 'react';
import { DraftGeneration } from '@/components/DraftGeneration';
import type { AnalysisData, StakeholderTone } from '@/types/claims';

interface GenerationStepProps {
  analysisData: AnalysisData;
  selectedTone: StakeholderTone;
  editedContent: string;
  onDraftGenerated: (draft: string) => void;
}

export const GenerationStep: React.FC<GenerationStepProps> = ({
  analysisData,
  selectedTone,
  editedContent,
  onDraftGenerated
}) => {
  return (
    <div className="space-y-6">
      <DraftGeneration 
        analysisData={analysisData}
        selectedTone={selectedTone}
        onDraftGenerated={onDraftGenerated}
        editedContent={editedContent}
      />
    </div>
  );
};