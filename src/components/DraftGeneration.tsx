import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Wand2, CheckCircle, Loader2 } from 'lucide-react';
import type { AnalysisData, StakeholderTone } from '@/types/claims';

interface DraftGenerationProps {
  analysisData: AnalysisData;
  selectedTone: StakeholderTone;
  onDraftGenerated: (draft: string) => void;
  editedContent?: string; // Contenuto modificato dall'editor
}

export const DraftGeneration: React.FC<DraftGenerationProps> = ({ 
  analysisData, 
  selectedTone, 
  onDraftGenerated,
  editedContent
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [originalDraft, setOriginalDraft] = useState<string>('');
  const [generatedDraft, setGeneratedDraft] = useState<string>('');

  useEffect(() => {
    generateDraft();
  }, [selectedTone]);

  const generateDraft = async () => {
    setIsGenerating(true);
    
    // Simula la generazione
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const draft = generateDraftContent(analysisData, selectedTone);
    setOriginalDraft(draft);
    setGeneratedDraft(draft);
    setIsGenerating(false);
    onDraftGenerated(draft);
  };

  const generateDraftContent = (data: AnalysisData, tone: StakeholderTone): string => {
    const templates = {
      insurance: `
RELAZIONE SINISTRO - COMPAGNIA ASSICURATIVA

1. DATI IDENTIFICATIVI DEL CONTRATTO
- Contraente: ${data.personalData.firstName} ${data.personalData.lastName}
- Numero Polizza: ${data.personalData.policyNumber}
- Data Sinistro: ${data.personalData.claimDate}
- Data Apertura Sinistro: ${data.personalData.openingDate}

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
• Assicurato: ${data.personalData.firstName} ${data.personalData.lastName}
• Polizza n.: ${data.personalData.policyNumber}
• Evento: ${data.personalData.claimDate}
• Apertura: ${data.personalData.openingDate}

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
Gentile ${data.personalData.firstName} ${data.personalData.lastName},

La informiamo che abbiamo ricevuto e analizzato la documentazione relativa al sinistro del ${data.personalData.claimDate} riguardante la Sua polizza n. ${data.personalData.policyNumber}.

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

Intestatario: ${data.personalData.firstName} ${data.personalData.lastName}
Polizza: ${data.personalData.policyNumber}
Data Sinistro: ${data.personalData.claimDate}
Data Apertura: ${data.personalData.openingDate}

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

  // Funzione per evidenziare le differenze
  const highlightDifferences = (original: string, edited: string) => {
    if (!edited || original === edited) {
      return <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{original}</pre>;
    }

    const originalLines = original.split('\n');
    const editedLines = edited.split('\n');
    const maxLines = Math.max(originalLines.length, editedLines.length);
    
    const result = [];
    
    for (let i = 0; i < maxLines; i++) {
      const originalLine = originalLines[i] || '';
      const editedLine = editedLines[i] || '';
      
      if (originalLine !== editedLine) {
        if (originalLine && !editedLine) {
          // Linea rimossa
          result.push(
            <div key={`removed-${i}`} className="bg-red-100 text-red-800 line-through">
              {originalLine}
            </div>
          );
        } else if (!originalLine && editedLine) {
          // Linea aggiunta
          result.push(
            <div key={`added-${i}`} className="bg-red-100 text-red-600 font-medium">
              {editedLine}
            </div>
          );
        } else {
          // Linea modificata
          result.push(
            <div key={`modified-${i}`} className="bg-red-100 text-red-600 font-medium">
              {editedLine}
            </div>
          );
        }
      } else {
        // Linea invariata
        result.push(
          <div key={`unchanged-${i}`} className="text-gray-800">
            {originalLine}
          </div>
        );
      }
    }
    
    return <div className="text-sm font-mono">{result}</div>;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Wand2 className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-slate-800">Generazione Bozza</h2>
        {editedContent && editedContent !== originalDraft && (
          <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full">
            Modifiche rilevate
          </span>
        )}
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
              {highlightDifferences(originalDraft, editedContent || originalDraft)}
            </div>
          </div>

          {editedContent && editedContent !== originalDraft && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Le modifiche apportate nell'editor sono evidenziate in rosso. 
                Il contenuto originale rimane visibile per confronto.
              </p>
            </div>
          )}

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
