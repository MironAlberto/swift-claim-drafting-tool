
import React, { useState } from 'react';
import { DocumentUpload } from './DocumentUpload';
import { DocumentAnalysis } from './DocumentAnalysis';
import { DraftGeneration } from './DraftGeneration';
import { TonePersonalization } from './TonePersonalization';
import { InteractiveEditor } from './InteractiveEditor';
import { ShareActions } from './ShareActions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Brain, Edit, Share2, ChevronRight, ChevronLeft } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content?: string;
}

interface AnalysisData {
  personalData: {
    name: string;
    policyNumber: string;
    date: string;
  };
  claimDescription: string;
  legalFramework: string;
  estimatedCompensation: string;
}

interface StakeholderTone {
  type: 'insurance' | 'liquidator' | 'client' | 'other';
  label: string;
}

export const ClaimsManagement = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'analysis' | 'generation' | 'editing' | 'sharing'>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [selectedTone, setSelectedTone] = useState<StakeholderTone>({ type: 'insurance', label: 'Compagnia Assicurativa' });
  const [generatedDraft, setGeneratedDraft] = useState<string>('');
  const [editedContent, setEditedContent] = useState<string>('');

  const steps = [
    { id: 'upload', label: 'Caricamento', icon: Upload, completed: uploadedFiles.length > 0 },
    { id: 'analysis', label: 'Analisi', icon: Brain, completed: analysisData !== null },
    { id: 'generation', label: 'Generazione', icon: FileText, completed: generatedDraft !== '' },
    { id: 'editing', label: 'Modifica', icon: Edit, completed: editedContent !== '' },
    { id: 'sharing', label: 'Tono & Condivisione', icon: Share2, completed: false }
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

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Progress Steps */}
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
                      setCurrentStep(step.id as any);
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

      {/* Step Content */}
      <div className="min-h-[600px]">
        {currentStep === 'upload' && (
          <div className="space-y-6">
            <DocumentUpload onFilesUploaded={handleFilesUploaded} />
          </div>
        )}

        {currentStep === 'analysis' && uploadedFiles.length > 0 && (
          <div className="space-y-6">
            <DocumentAnalysis 
              files={uploadedFiles} 
              onAnalysisComplete={handleAnalysisComplete}
            />
          </div>
        )}

        {currentStep === 'generation' && analysisData && (
          <div className="space-y-6">
            <DraftGeneration 
              analysisData={analysisData}
              selectedTone={selectedTone}
              onDraftGenerated={handleDraftGenerated}
              editedContent={editedContent}
            />
          </div>
        )}

        {currentStep === 'editing' && generatedDraft && (
          <div className="space-y-6">
            <InteractiveEditor 
              content={editedContent}
              onContentChange={handleContentEdit}
            />
          </div>
        )}

        {currentStep === 'sharing' && editedContent && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Anteprima Finale</h2>
                <div className="prose max-w-none bg-gray-50 p-6 rounded-lg">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {editedContent}
                  </pre>
                </div>
              </Card>
            </div>
            <div className="xl:col-span-1 space-y-6">
              <TonePersonalization 
                selectedTone={selectedTone}
                onToneChange={handleToneChange}
              />
              
              <ShareActions 
                content={editedContent}
                title="Bozza Sinistro"
              />
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Altre Azioni</h3>
                <div className="space-y-3">
                  <Button 
                    onClick={resetProcess} 
                    variant="outline" 
                    className="w-full"
                  >
                    Nuovo Sinistro
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <Button 
            onClick={goToPreviousStep}
            variant="outline"
            disabled={currentStep === 'upload'}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Indietro</span>
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Step {getCurrentStepIndex() + 1} di {steps.length}
            </p>
          </div>

          <Button 
            onClick={goToNextStep}
            disabled={!canProceed() || currentStep === 'sharing'}
            className="flex items-center space-x-2"
          >
            <span>
              {currentStep === 'upload' && 'Procedi all\'Analisi'}
              {currentStep === 'analysis' && 'Procedi alla Generazione'}
              {currentStep === 'generation' && 'Procedi alla Modifica'}
              {currentStep === 'editing' && 'Procedi alla Condivisione'}
              {currentStep === 'sharing' && 'Completato'}
            </span>
            {currentStep !== 'sharing' && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </Card>
    </div>
  );
};
