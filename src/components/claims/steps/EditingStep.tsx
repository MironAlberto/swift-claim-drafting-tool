import React from 'react';
import { InteractiveEditor } from '@/components/InteractiveEditor';

interface EditingStepProps {
  content: string;
  onContentChange: (content: string) => void;
}

export const EditingStep: React.FC<EditingStepProps> = ({
  content,
  onContentChange
}) => {
  return (
    <div className="space-y-6">
      <InteractiveEditor 
        content={content}
        onContentChange={onContentChange}
      />
    </div>
  );
};