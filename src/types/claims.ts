export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content?: string;
}

export interface AnalysisData {
  personalData: {
    name: string;
    policyNumber: string;
    date: string;
  };
  claimDescription: string;
  legalFramework: string;
  estimatedCompensation: string;
}

export interface StakeholderTone {
  type: 'insurance' | 'liquidator' | 'client' | 'other';
  label: string;
}

export type ClaimStep = 'upload' | 'analysis' | 'generation' | 'editing' | 'sharing';