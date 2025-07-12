import React from 'react';
import { DocumentAnalysis } from '@/components/DocumentAnalysis';
import type { UploadedFile, AnalysisData } from '@/types/claims';

interface AnalysisStepProps {
  files: UploadedFile[];
  onAnalysisComplete: (data: AnalysisData) => void;
}

export const AnalysisStep: React.FC<AnalysisStepProps> = ({ 
  files, 
  onAnalysisComplete 
}) => {
  return (
    <div className="space-y-6">
      <DocumentAnalysis 
        files={files} 
        onAnalysisComplete={onAnalysisComplete}
      />
    </div>
  );
};