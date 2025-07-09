
import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Image, FileCheck, X, Loader2 } from 'lucide-react';
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
        // Simula il contenuto estratto dal file
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

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <Image className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
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
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FileCheck className="w-5 h-5 mr-2 text-green-600" />
              Documenti Caricati ({files.length})
            </h3>
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="text-red-500 hover:text-red-700"
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
