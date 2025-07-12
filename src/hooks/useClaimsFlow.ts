import { useState } from 'react';
import { Upload, Brain, FileText, Edit, Share2 } from 'lucide-react';
import type { ClaimStep, UploadedFile, AnalysisData, StakeholderTone } from '@/types/claims';

export const useClaimsFlow = () => {
  const [currentStep, setCurrentStep] = useState<ClaimStep>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [selectedTone, setSelectedTone] = useState<StakeholderTone>({ 
    type: 'insurance', 
    label: 'Compagnia Assicurativa' 
  });
  const [generatedDraft, setGeneratedDraft] = useState<string>('');
  const [editedContent, setEditedContent] = useState<string>('');

  const steps = [
    { id: 'upload' as const, label: 'Caricamento', icon: Upload, completed: uploadedFiles.length > 0 },
    { id: 'analysis' as const, label: 'Analisi', icon: Brain, completed: analysisData !== null },
    { id: 'generation' as const, label: 'Generazione', icon: FileText, completed: generatedDraft !== '' },
    { id: 'editing' as const, label: 'Modifica', icon: Edit, completed: editedContent !== '' },
    { id: 'sharing' as const, label: 'Tono & Condivisione', icon: Share2, completed: false }
  ];

  const handleFilesUploaded = (files: UploadedFile[]) => {
    setUploadedFiles(files);
  };

  const handleAnalysisComplete = (data: AnalysisData) => {
    setAnalysisData(data);
  };

  const handleDraftGenerated = (draft: string) => {
    setGeneratedDraft(draft);
    setEditedContent(draft);
  };

  const handleToneChange = (tone: StakeholderTone) => {
    setSelectedTone(tone);
  };

  const handleContentEdit = (content: string) => {
    setEditedContent(content);
  };

  const goToNextStep = () => {
    if (currentStep === 'upload' && uploadedFiles.length > 0) {
      setCurrentStep('analysis');
    } else if (currentStep === 'analysis' && analysisData) {
      setCurrentStep('generation');
    } else if (currentStep === 'generation' && generatedDraft) {
      setCurrentStep('editing');
    } else if (currentStep === 'editing' && editedContent) {
      setCurrentStep('sharing');
    }
  };

  const goToPreviousStep = () => {
    if (currentStep === 'sharing') {
      setCurrentStep('editing');
    } else if (currentStep === 'editing') {
      setCurrentStep('generation');
    } else if (currentStep === 'generation') {
      setCurrentStep('analysis');
    } else if (currentStep === 'analysis') {
      setCurrentStep('upload');
    }
  };

  const resetProcess = () => {
    setCurrentStep('upload');
    setUploadedFiles([]);
    setAnalysisData(null);
    setGeneratedDraft('');
    setEditedContent('');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'upload': return uploadedFiles.length > 0;
      case 'analysis': return analysisData !== null;
      case 'generation': return generatedDraft !== '';
      case 'editing': return editedContent !== '';
      case 'sharing': return false;
      default: return false;
    }
  };

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep);
  };

  return {
    // State
    currentStep,
    uploadedFiles,
    analysisData,
    selectedTone,
    generatedDraft,
    editedContent,
    steps,
    
    // Actions
    setCurrentStep,
    handleFilesUploaded,
    handleAnalysisComplete,
    handleDraftGenerated,
    handleToneChange,
    handleContentEdit,
    goToNextStep,
    goToPreviousStep,
    resetProcess,
    
    // Computed
    canProceed,
    getCurrentStepIndex
  };
};