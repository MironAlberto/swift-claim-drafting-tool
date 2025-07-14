
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

  // Aggiorna il contenuto se cambia dall'esterno
  React.useEffect(() => {
    setEditedContent(content);
  }, [content]);

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
            <div key={`removed-${i}`} className="bg-red-100 text-red-800 line-through px-1">
              {originalLine}
            </div>
          );
        } else if (!originalLine && editedLine) {
          // Linea aggiunta
          result.push(
            <div key={`added-${i}`} className="bg-red-100 text-red-600 font-medium px-1">
              {editedLine}
            </div>
          );
        } else {
          // Linea modificata
          result.push(
            <div key={`modified-${i}`} className="bg-red-100 text-red-600 font-medium px-1">
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
    
    return <div className="text-sm font-mono leading-relaxed">{result}</div>;
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
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Anteprima del documento generato. Clicca "Modifica" per personalizzare.
              </p>
              {content !== originalContent && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                  Modifiche rilevate
                </span>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 bg-gray-50 rounded-lg border h-full">
                {highlightDifferences(originalContent, content)}
              </div>
            </div>

            {content !== originalContent && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <strong>Nota:</strong> Le sezioni modificate sono evidenziate in rosso.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
