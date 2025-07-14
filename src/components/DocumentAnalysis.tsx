
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, CheckCircle, Loader2, FileText } from 'lucide-react';
import type { UploadedFile, AnalysisData } from '@/types/claims';

interface DocumentAnalysisProps {
  files: UploadedFile[];
  onAnalysisComplete: (data: AnalysisData) => void;
}

export const DocumentAnalysis: React.FC<DocumentAnalysisProps> = ({ files, onAnalysisComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  useEffect(() => {
    startAnalysis();
  }, [files]);

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simula l'analisi progressiva
    const steps = [
      { progress: 20, message: 'Lettura documenti...' },
      { progress: 40, message: 'Estrazione dati anagrafici...' },
      { progress: 60, message: 'Analisi descrizione sinistro...' },
      { progress: 80, message: 'Identificazione quadro normativo...' },
      { progress: 100, message: 'Calcolo stima risarcimento...' }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalysisProgress(step.progress);
    }

    // Simula i dati estratti
    const simulatedData: AnalysisData = {
      personalData: {
        firstName: 'Mario',
        lastName: 'Rossi',
        policyNumber: 'POL123456789',
        claimDate: '15/01/2024',
        openingDate: new Date().toLocaleDateString('it-IT')
      },
      claimDescription: `Sinistro stradale - Tamponamento tra due veicoli avvenuto in centro urbano con danni materiali. Il veicolo assicurato ha subito danni alla carrozzeria posteriore e necessita riparazioni per ripristinare le condizioni originali.`,
      legalFramework: `Ramo: RC Auto (Responsabilità Civile Autoveicoli)

Normativa Civile:
- Art. 2043 C.C. (Risarcimento per fatto illecito)
- Art. 2054 C.C. (Circolazione di veicoli)
- Art. 1218 C.C. (Responsabilità del debitore)

Normativa Assicurativa:
- D.Lgs. 209/2005 (Codice delle Assicurazioni Private)
- Art. 148-152 CAP (Liquidazione sinistri RCA)
- Regolamento IVASS n. 24/2016

Normativa Generale:
- D.Lgs. 285/1992 (Codice della Strada)
- Art. 193-196 CdS (Obblighi in caso di incidente)`,
      estimatedCompensation: `Stima preliminare danni materiali: €2.800
- Riparazione carrozzeria: €2.200
- Sostituzione specchietto: €180
- Verniciatura: €420

Eventuale risarcimento danni fisici da valutare in base a certificazione medica.`
    };

    setAnalysisData(simulatedData);
    setIsAnalyzing(false);
    onAnalysisComplete(simulatedData);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Brain className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-800">Analisi Automatica</h2>
      </div>

      {isAnalyzing ? (
        <div className="space-y-6">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium text-blue-600">Analisi in corso...</p>
            <p className="text-sm text-gray-600 mt-2">
              Elaborazione di {files.length} documento{files.length > 1 ? 'i' : ''}
            </p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">{analysisProgress}% completato</p>
          </div>
        </div>
      ) : analysisData ? (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-green-600 mb-4">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Analisi completata con successo</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Dati Anagrafici
                </h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Nome:</span> {analysisData.personalData.firstName}</p>
                  <p><span className="font-medium">Cognome:</span> {analysisData.personalData.lastName}</p>
                  <p><span className="font-medium">N. Polizza:</span> {analysisData.personalData.policyNumber}</p>
                  <p><span className="font-medium">Data del sinistro:</span> {analysisData.personalData.claimDate}</p>
                  <p><span className="font-medium">Data apertura sinistro:</span> {analysisData.personalData.openingDate}</p>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Stima Risarcimento</h3>
                <div className="text-sm text-green-700 whitespace-pre-line">
                  {analysisData.estimatedCompensation}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">Descrizione Sinistro</h3>
                <p className="text-sm text-orange-700">{analysisData.claimDescription}</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Quadro Giuridico</h3>
                <p className="text-sm text-purple-700">{analysisData.legalFramework}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  );
};
