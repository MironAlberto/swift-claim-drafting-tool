import React from 'react';
import { DraftGeneration } from '@/components/DraftGeneration';
import { InteractiveEditor } from '@/components/InteractiveEditor';
import type { AnalysisData, StakeholderTone } from '@/types/claims';

interface GenerationStepProps {
  analysisData: AnalysisData;
  selectedTone: StakeholderTone;
  editedContent: string;
  onDraftGenerated: (draft: string) => void;
  onContentChange: (content: string) => void;
}

export const GenerationStep: React.FC<GenerationStepProps> = ({
  analysisData,
  selectedTone,
  editedContent,
  onDraftGenerated,
  onContentChange
}) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div className="xl:col-span-1">
        <DraftGeneration 
          analysisData={analysisData}
          selectedTone={selectedTone}
          onDraftGenerated={onDraftGenerated}
          editedContent={editedContent}
        />
      </div>
      <div className="xl:col-span-1">
        <InteractiveEditor 
          content={editedContent}
          onContentChange={onContentChange}
        />
      </div>
    </div>
  );
};