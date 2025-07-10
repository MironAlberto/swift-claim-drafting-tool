
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Wrench, User, Users } from 'lucide-react';

interface StakeholderTone {
  type: 'insurance' | 'liquidator' | 'client' | 'other';
  label: string;
}

interface TonePersonalizationProps {
  selectedTone: StakeholderTone;
  onToneChange: (tone: StakeholderTone) => void;
}

export const TonePersonalization: React.FC<TonePersonalizationProps> = ({ 
  selectedTone, 
  onToneChange 
}) => {
  const tones = [
    {
      type: 'insurance' as const,
      label: 'Compagnia Assicurativa',
      description: 'Linguaggio formale e tecnico-legale',
      icon: Building2
    },
    {
      type: 'liquidator' as const,
      label: 'Liquidatore/Perito',
      description: 'Terminologia tecnico-operativa',
      icon: Wrench
    },
    {
      type: 'client' as const,
      label: 'Cliente Finale',
      description: 'Linguaggio chiaro e comprensibile',
      icon: User
    },
    {
      type: 'other' as const,
      label: 'Altri Stakeholder',
      description: 'Equilibrio tra chiarezza e tecnicismi',
      icon: Users
    }
  ];

  return (
    <Card className="p-4 scale-90 origin-top">
      <h3 className="text-base font-semibold mb-3">Personalizzazione Tono</h3>
      <p className="text-xs text-gray-600 mb-4">
        Seleziona il destinatario per adattare il linguaggio
      </p>
      
      <div className="space-y-2">
        {tones.map((tone) => {
          const Icon = tone.icon;
          const isSelected = selectedTone?.type === tone.type;
          
          return (
            <Button
              key={tone.type}
              variant={isSelected ? "default" : "outline"}
              className={`w-full text-left justify-start p-3 h-auto text-sm ${
                isSelected ? 'bg-blue-600 hover:bg-blue-700' : ''
              }`}
              onClick={() => onToneChange({ type: tone.type, label: tone.label })}
            >
              <div className="flex items-start space-x-2">
                <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium text-sm">{tone.label}</div>
                  <div className={`text-xs mt-0.5 ${
                    isSelected ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {tone.description}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};
