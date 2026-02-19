import React, { useState, useRef } from 'react';
import { processDocxFile } from '../services/docxService';
import { Button } from './Button';
import { Upload, RefreshCw, FileText, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { CardData } from '../types';
import { DEFAULT_IMAGE_URL } from '../constants';

interface ConverterViewProps {
  setCards: React.Dispatch<React.SetStateAction<CardData[]>>;
  onSwitchTab: () => void;
}

export const ConverterView: React.FC<ConverterViewProps> = ({ setCards, onSwitchTab }) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setHtmlContent('');

    try {
      const resultHtml = await processDocxFile(file);
      setHtmlContent(resultHtml);
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Error al procesar el archivo DOCX.");
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const copyToClipboard = async () => {
    if (!htmlContent) return;
    try {
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      const text = tempDiv.innerText;
      const textBlob = new Blob([text], { type: 'text/plain' });

      await navigator.clipboard.write([
        new ClipboardItem({ 'text/html': htmlBlob, 'text/plain': textBlob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      navigator.clipboard.writeText(htmlContent).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const extractCardsWithAI = async () => {
    if (!htmlContent) return;

    setIsExtracting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Analyze the following HTML content derived from a DOCX file.
        
        Your task is to identify content blocks intended to be "Cards".
        There are two types of cards:
        
        1. "Featured" (DESTACADO): Marked by keywords like "DESTACADO" or "Destacado".
           Schema: { type: "featured", tag, description, linkText, url, imageUrl }
           
        2. "Testimonial" (COMENTARIO): Marked by keywords like "COMENTARIO", "TESTIMONIO", or quoted text with a person's name.
           Schema: { type: "testimonial", description (the quote), authorName, authorRole, imageUrl (avatar) }
        
        For each potential card found, extract the data.

        Return a JSON ARRAY of objects. Each object should have a "type" field ("featured" or "testimonial") and the relevant fields.

        HTML CONTENT:
        ${htmlContent.substring(0, 25000)} 
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          responseMimeType: 'application/json' 
        }
      });

      const jsonText = response.text;
      if (jsonText) {
        const extractedData = JSON.parse(jsonText);
        
        if (Array.isArray(extractedData) && extractedData.length > 0) {
          const newCards: CardData[] = extractedData.map((item: any, index: number) => ({
            id: `extracted-${Date.now()}-${index}`,
            type: item.type === 'testimonial' ? 'testimonial' : 'featured',
            // Common
            description: item.description || '',
            imageUrl: item.imageUrl || (item.type === 'testimonial' ? 'https://cdn.prod.website-files.com/66d052db781718d42caceaaa/691dd22a1dae0c4af657a499_paolo.webp' : DEFAULT_IMAGE_URL),
            
            // Featured
            tag: item.tag || 'DEMO',
            linkText: item.linkText || 'Ver más',
            url: item.url || '#',
            linkOnNewLine: true,

            // Testimonial
            authorName: item.authorName || '',
            authorRole: item.authorRole || ''
          }));
          
          setCards(newCards);
          onSwitchTab(); // Automatically switch to generator tab
        } else {
          alert("No se detectaron tarjetas con el formato esperado.");
        }
      }

    } catch (error) {
      console.error("AI Extraction error:", error);
      alert("Error al extraer tarjetas con IA.");
    } finally {
      setIsExtracting(false);
    }
  };

  const triggerUpload = () => fileInputRef.current?.click();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-10rem)]">
      {/* Sidebar */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Conversor DOCX</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Sube un documento para convertirlo a HTML limpio (Rich Text). 
            Se conservan negritas, enlaces y encabezados. Se eliminan metadatos SEO.
          </p>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".docx"
            className="hidden"
          />
          
          <div 
            onClick={triggerUpload}
            className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group mb-4"
          >
            {isProcessing ? (
               <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-3" />
            ) : (
               <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                 <Upload className="w-6 h-6" />
               </div>
            )}
            <span className="text-sm font-medium text-gray-700">
              {isProcessing ? 'Procesando...' : 'Subir DOCX'}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              variant="primary" 
              onClick={copyToClipboard} 
              disabled={!htmlContent}
              className={`w-full ${copied ? "bg-green-600 hover:bg-green-700" : ""}`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? '¡Copiado!' : 'Copiar Contenido'}
            </Button>

            {htmlContent && (
              <Button 
                variant="secondary"
                onClick={extractCardsWithAI}
                disabled={isExtracting}
                className="w-full relative overflow-hidden group"
              >
                {isExtracting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Analizando documento...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    Generar Cards con IA
                    <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="lg:col-span-8 flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-gray-50/50">
          <div className="flex bg-gray-200/50 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'preview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Vista Previa
            </button>
            <button 
              onClick={() => setViewMode('code')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'code' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Código HTML
            </button>
          </div>
          <div className="text-xs text-gray-400 font-medium">
             {htmlContent ? `${(htmlContent.length / 1024).toFixed(1)} KB` : 'Vacío'}
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-white relative">
          {!htmlContent ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300 flex-col gap-4">
               <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-200" />
               </div>
               <p>Sube un archivo para ver el resultado</p>
            </div>
          ) : (
            <>
              {viewMode === 'preview' ? (
                 <div className="p-8 lg:p-12 max-w-3xl mx-auto preview-content text-gray-800">
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                 </div>
              ) : (
                <div className="p-0 h-full">
                  <pre className="p-6 text-xs font-mono text-gray-600 bg-gray-50 h-full overflow-auto leading-relaxed">
                    {htmlContent}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};