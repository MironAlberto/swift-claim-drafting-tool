
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MessageCircle, Copy, Download, FileText, File } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareActionsProps {
  content: string;
  title?: string;
}

export const ShareActions: React.FC<ShareActionsProps> = ({ 
  content, 
  title = "Bozza Sinistro" 
}) => {
  const { toast } = useToast();

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copiato!",
        description: "Il contenuto è stato copiato negli appunti",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile copiare il contenuto",
        variant: "destructive",
      });
    }
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(content);
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoUrl, '_blank');
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(`${title}\n\n${content}`);
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDownloadPDF = () => {
    // Simula il download PDF
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download avviato",
      description: "Il file PDF è stato scaricato",
    });
  };

  const handleDownloadDOCX = () => {
    // Simula il download DOCX
    const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download avviato",
      description: "Il file DOCX è stato scaricato",
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Condividi e Scarica</h3>
      <p className="text-sm text-gray-600 mb-6">
        Scegli come vuoi condividere o salvare il documento generato
      </p>
      
      <div className="space-y-4">
        {/* Azioni di Condivisione */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Condividi</h4>
          <div className="grid grid-cols-1 gap-2">
            <Button 
              onClick={handleSendEmail} 
              variant="outline" 
              className="justify-start"
              size="sm"
            >
              <Mail className="w-4 h-4 mr-2" />
              Invia via Email
            </Button>
            
            <Button 
              onClick={handleSendWhatsApp} 
              variant="outline" 
              className="justify-start"
              size="sm"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Invia su WhatsApp
            </Button>
            
            <Button 
              onClick={handleCopyToClipboard} 
              variant="outline" 
              className="justify-start"
              size="sm"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copia negli Appunti
            </Button>
          </div>
        </div>

        {/* Azioni di Download */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Scarica</h4>
          <div className="grid grid-cols-1 gap-2">
            <Button 
              onClick={handleDownloadPDF} 
              className="justify-start bg-red-600 hover:bg-red-700"
              size="sm"
            >
              <FileText className="w-4 h-4 mr-2" />
              Scarica PDF
            </Button>
            
            <Button 
              onClick={handleDownloadDOCX} 
              className="justify-start bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <File className="w-4 h-4 mr-2" />
              Scarica DOCX
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
