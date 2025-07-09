
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Wand2, CheckCircle, Loader2 } from 'lucide-react';

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

interface DraftGenerationProps {
  analysisData: AnalysisData;
  selectedTone: StakeholderTone;
  onDraftGenerated: (draft: string) => void;
}

export const DraftGeneration: React.FC<DraftGenerationProps> = ({ 
  analysisData, 
  selectedTone, 
  onDraftGenerated 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<string>('');

  useEffect(() => {
    generateDraft();
  }, [selectedTone]);

  const generateDraft = async () => {
    setIsGenerating(true);
    
    // Simula la generazione
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const draft = generateDraftContent(analysisData, selectedTone);
    setGeneratedDraft(draft);
    setIsGenerating(false);
    onDraftGenerated(draft);
  };

  const generateDraftContent = (data: AnalysisData, tone: StakeholderTone): string => {
    const templates = {
      insurance: `
RELAZIONE SINISTRO - COMPAGNIA ASSICURATIVA

1. DATI IDENTIFICATIVI DEL CONTRATTO
- Contraente: ${data.personalData.name}
- Numero Polizza: ${data.personalData.policyNumber}
- Data Sinistro: ${data.personalData.date}

2. RICOSTRUZIONE DELL'EVENTO
${data.claimDescription}

3. QUADRO NORMATIVO DI RIFERIMENTO
${data.legalFramework}

4. VALUTAZIONE ECONOMICA DEL DANNO
${data.estimatedCompensation}

5. CONCLUSIONI
Il sinistro appare compatibile con le condizioni di polizza e si ritiene fondato il diritto al risarcimento nei termini sopra specificati, salvo ulteriori verifiche tecniche da effettuarsi in sede di perizia.

Allegati: Documentazione fotografica, verbali, certificazioni mediche.
      `,
      liquidator: `
PERIZIA TECNICA - LIQUIDAZIONE SINISTRO

DATI TECNICI:
• Assicurato: ${data.personalData.name}
• Polizza n.: ${data.personalData.policyNumber}
• Evento: ${data.personalData.date}

MODALITÀ DEL SINISTRO:
${data.claimDescription}

RIFERIMENTI NORMATIVI:
${data.legalFramework}

QUANTIFICAZIONE DANNI:
${data.estimatedCompensation}

PROCEDURE OPERATIVE:
1. Sopralluogo effettuato secondo protocollo standard
2. Documentazione fotografica acquisita
3. Preventivi richiesti presso officine autorizzate
4. Verifica compatibilità dinamica dell'urto

RACCOMANDAZIONI:
Si consiglia liquidazione secondo stima, previa verifica documentale completa.
      `,
      client: `
Gentile ${data.personalData.name},

La informiamo che abbiamo ricevuto e analizzato la documentazione relativa al sinistro del ${data.personalData.date} riguardante la Sua polizza n. ${data.personalData.policyNumber}.

COSA È SUCCESSO:
${data.claimDescription}

I SUOI DIRITTI:
Secondo la legge e le condizioni della Sua polizza assicurativa, Lei ha diritto al risarcimento dei danni subiti. La normativa di riferimento tutela i Suoi interessi come assicurato.

STIMA DEL RISARCIMENTO:
${data.estimatedCompensation}

PROSSIMI PASSI:
Il nostro ufficio si occuperà di tutte le pratiche necessarie. La terremo aggiornata sull'evolversi della situazione e La contatteremo per eventuali chiarimenti.

Cordiali saluti,
Ufficio Sinistri
      `,
      other: `
RAPPORTO SINISTRO

Intestatario: ${data.personalData.name}
Polizza: ${data.personalData.policyNumber}
Data: ${data.personalData.date}

DESCRIZIONE DELL'EVENTO:
${data.claimDescription}

ASPETTI LEGALI:
${data.legalFramework}

VALUTAZIONE ECONOMICA:
${data.estimatedCompensation}

Il presente rapporto fornisce una sintesi completa del caso e può essere utilizzato per ulteriori valutazioni tecniche o legali secondo necessità.
      `
    };

    return templates[tone.type] || templates.other;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Wand2 className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-slate-800">Generazione Bozza</h2>
      </div>

      {isGenerating ? (
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-purple-600">Generazione in corso...</p>
          <p className="text-sm text-gray-600 mt-2">
            Adattamento per: {selectedTone.label}
          </p>
        </div>
      ) : generatedDraft ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-green-600 mb-4">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Bozza generata per: {selectedTone.label}</span>
          </div>

          <div className="max-h-96 overflow-y-auto">
            <div className="p-4 bg-gray-50 rounded-lg border">
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">
                {generatedDraft}
              </pre>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={generateDraft} variant="outline">
              <Wand2 className="w-4 h-4 mr-2" />
              Rigenera Bozza
            </Button>
          </div>
        </div>
      ) : null}
    </Card>
  );
};
