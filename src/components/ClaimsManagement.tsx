
import React, { useState } from 'react';
import { DocumentUpload } from './DocumentUpload';
import { DocumentAnalysis } from './DocumentAnalysis';
import { DraftGeneration } from './DraftGeneration';
import { TonePersonalization } from './TonePersonalization';
import { InteractiveEditor } from './InteractiveEditor';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Brain, Edit, Download } from 'lucide-react';

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
  const [currentStep, setCurrentStep] = useState<'upload' | 'analysis' | 'generation' | 'editing'>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [selectedTone, setSelectedTone] = useState<StakeholderTone>({ type: 'insurance', label: 'Compagnia Assicurativa' });
  const [generatedDraft, setGeneratedDraft] = useState<string>('');
  const [editedContent, setEditedContent] = useState<string>('');

  const steps = [
    { id: 'upload', label: 'Caricamento', icon: Upload, completed: uploadedFiles.length > 0 },
    { id: 'analysis', label: 'Analisi', icon: Brain, completed: analysisData !== null },
    { id: 'generation', label: 'Generazione', icon: FileText, completed: generatedDraft !== '' },
    { id: 'editing', label: 'Modifica', icon: Edit, completed: editedContent !== '' }
  ];

  const handleFilesUploaded = (files: UploadedFile[]) => {
    setUploadedFiles(files);
    if (files.length > 0) {
      setCurrentStep('analysis');
    }
  };

  const handleAnalysisComplete = (data: AnalysisData) => {
    setAnalysisData(data);
    setCurrentStep('generation');
  };

  const handleDraftGenerated = (draft: string) => {
    setGeneratedDraft(draft);
    setEditedContent(draft);
    setCurrentStep('editing');
  };

  const handleToneChange = (tone: StakeholderTone) => {
    setSelectedTone(tone);
  };

  const handleContentEdit = (content: string) => {
    setEditedContent(content);
  };

  const handleExport = () => {
    // Simula l'esportazione in PDF
    const blob = new Blob([editedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bozza-sinistro-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetProcess = () => {
    setCurrentStep('upload');
    setUploadedFiles([]);
    setAnalysisData(null);
    setGeneratedDraft('');
    setEditedContent('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Progress Steps */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = step.completed;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-3 ${
                  isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <div className={`p-3 rounded-full ${
                    isActive ? 'bg-blue-100 text-blue-600' : 
                    isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-px mx-4 ${
                    steps[index + 1].completed ? 'bg-green-300' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Upload and Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {currentStep === 'upload' && (
            <DocumentUpload onFilesUploaded={handleFilesUploaded} />
          )}
          
          {currentStep === 'analysis' && uploadedFiles.length > 0 && (
            <DocumentAnalysis 
              files={uploadedFiles} 
              onAnalysisComplete={handleAnalysisComplete}
            />
          )}
          
          {(currentStep === 'generation' || currentStep === 'editing') && analysisData && (
            <DraftGeneration 
              analysisData={analysisData}
              selectedTone={selectedTone}
              onDraftGenerated={handleDraftGenerated}
            />
          )}
          
          {currentStep === 'editing' && generatedDraft && (
            <InteractiveEditor 
              content={editedContent}
              onContentChange={handleContentEdit}
            />
          )}
        </div>

        {/* Right Column - Settings and Actions */}
        <div className="space-y-6">
          <TonePersonalization 
            selectedTone={selectedTone}
            onToneChange={handleToneChange}
          />
          
          {currentStep === 'editing' && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Azioni</h3>
              <div className="space-y-3">
                <Button 
                  onClick={handleExport} 
                  className="w-full"
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Esporta PDF
                </Button>
                <Button 
                  onClick={resetProcess} 
                  variant="outline" 
                  className="w-full"
                >
                  Nuovo Sinistro
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
