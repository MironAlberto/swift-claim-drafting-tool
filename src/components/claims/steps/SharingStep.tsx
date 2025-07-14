import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TonePersonalization } from '@/components/TonePersonalization';
import { ShareActions } from '@/components/ShareActions';
import type { StakeholderTone } from '@/types/claims';

interface SharingStepProps {
  editedContent: string;
  selectedTone: StakeholderTone;
  onToneChange: (tone: StakeholderTone) => void;
  onResetProcess: () => void;
  onRegenerateDraft?: (tone: StakeholderTone) => void;
}

export const SharingStep: React.FC<SharingStepProps> = ({
  editedContent,
  selectedTone,
  onToneChange,
  onResetProcess,
  onRegenerateDraft
}) => {
  const handleToneChange = (tone: StakeholderTone) => {
    onToneChange(tone);
    if (onRegenerateDraft) {
      onRegenerateDraft(tone);
    }
  };
  return (
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
              onClick={onResetProcess} 
              variant="outline" 
              className="w-full"
            >
              Nuovo Sinistro
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};