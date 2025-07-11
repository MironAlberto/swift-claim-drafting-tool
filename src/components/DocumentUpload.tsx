
import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Image, FileCheck, X, Loader2, Plus, RefreshCw } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content?: string;
}

interface DocumentUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ onFilesUploaded }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsProcessing(true);
    
    const processedFiles: UploadedFile[] = await Promise.all(
      acceptedFiles.map(async (file) => {
        const content = await readFileContent(file);
        return {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          content
        };
      })
    );

    const newFiles = [...files, ...processedFiles];
    setFiles(newFiles);
    onFilesUploaded(newFiles);
    setIsProcessing(false);
  }, [files, onFilesUploaded]);

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(`Contenuto estratto da ${file.name}: ${getSimulatedContent(file.type)}`);
      };
      reader.readAsText(file);
    });
  };

  const getSimulatedContent = (fileType: string): string => {
    if (fileType.includes('image')) {
      return 'Immagine del danno al veicolo, targa ABC123, danno lato destro anteriore';
    } else if (fileType.includes('pdf')) {
      return 'Modulo FNOL compilato - Sinistro del 15/01/2024, Contraente: Mario Rossi, Polizza: POL123456';
    } else {
      return 'Documento medico - Certificato di prognosi 7 giorni, Paziente: Mario Rossi';
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    }
  });

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    onFilesUploaded(updatedFiles);
  };

  const replaceAllFiles = () => {
    setFiles([]);
    onFilesUploaded([]);
  };

  const handleAddMoreFiles = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = '.pdf,.doc,.docx,.txt,.png,.jpg,.jpeg';
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        const fileArray = Array.from(target.files);
        onDrop(fileArray);
      }
    };
    fileInput.click();
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <Image className="w-5 h-5 text-blue-600" />;
    if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-600" />;
    if (type.includes('word')) return <FileText className="w-5 h-5 text-blue-800" />;
    return <FileText className="w-5 h-5 text-gray-600" />;
  };

  const getFileTypeLabel = (type: string) => {
    if (type.includes('image')) return 'Immagine';
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('word')) return 'Word';
    if (type.includes('text')) return 'Testo';
    return 'Documento';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Caricamento Documenti
          </h2>
          <p className="text-slate-600">
            Trascina qui tutti i documenti relativi al sinistro
          </p>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          <input {...getInputProps()} />
          
          {isProcessing ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <p className="text-blue-600 font-medium">Elaborazione documenti...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <Upload className="w-12 h-12 text-gray-400" />
              {isDragActive ? (
                <p className="text-blue-600 font-medium">Rilascia i file qui...</p>
              ) : (
                <>
                  <p className="text-gray-600">
                    Trascina i file qui o <span className="text-blue-600 font-medium">clicca per selezionare</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Supportati: PDF, DOC, DOCX, TXT, JPG, PNG (max 10MB)
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {files.length > 0 && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <FileCheck className="w-5 h-5 mr-2 text-green-600" />
                Documenti Caricati ({files.length})
              </h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddMoreFiles}
                  className="flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Aggiungi Altri
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={replaceAllFiles}
                  className="flex items-center text-orange-600 hover:text-orange-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sostituisci Tutti
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    {getFileIcon(file.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 truncate max-w-xs">
                        {file.name}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                          {getFileTypeLabel(file.type)}
                        </span>
                        <span>{formatFileSize(file.size)}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
