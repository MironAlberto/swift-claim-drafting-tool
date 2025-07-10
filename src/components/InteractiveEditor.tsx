
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save, RotateCcw, Type } from 'lucide-react';

interface InteractiveEditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

export const InteractiveEditor: React.FC<InteractiveEditorProps> = ({ 
  content, 
  onContentChange 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [originalContent] = useState(content);

  const handleSave = () => {
    onContentChange(editedContent);
    setIsEditing(false);
  };

  const handleReset = () => {
    setEditedContent(originalContent);
    onContentChange(originalContent);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(content);
  };

  return (
    <Card className="p-6 h-full min-h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Type className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-slate-800">Editor Interattivo</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Salva
              </Button>
              <Button onClick={handleReset} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Ripristina
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit} size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Modifica
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {isEditing ? (
          <div className="space-y-4 flex-1 flex flex-col">
            <p className="text-sm text-gray-600">
              Modifica liberamente il contenuto del documento.
            </p>
            
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="flex-1 min-h-96 font-mono text-sm resize-none"
              placeholder="Inserisci il contenuto del documento..."
            />
            
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Caratteri: {editedContent.length}</span>
              <span>Righe: {editedContent.split('\n').length}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4 flex-1 flex flex-col">
            <p className="text-sm text-gray-600">
              Anteprima del documento generato. Clicca "Modifica" per personalizzare.
            </p>
            
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 bg-gray-50 rounded-lg border h-full">
                <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 h-full">
                  {content}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
