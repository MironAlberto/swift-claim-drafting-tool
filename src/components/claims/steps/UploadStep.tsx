import React from 'react';
import { DocumentUpload } from '@/components/DocumentUpload';
import type { UploadedFile } from '@/types/claims';

interface UploadStepProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
}

export const UploadStep: React.FC<UploadStepProps> = ({ onFilesUploaded }) => {
  return (
    <div className="space-y-6">
      <DocumentUpload onFilesUploaded={onFilesUploaded} />
    </div>
  );
};