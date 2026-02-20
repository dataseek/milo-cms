import React, { useState, useRef } from 'react';
import { processDocxFile } from '../services/docxService';
import { Button } from './Button';
import { Upload, RefreshCw, FileText, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { CardData } from '../types';
import { DEFAULT_IMAGE_URL } from '../constants';
import Editor from '@monaco-editor/react';

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
      <div className="lg:col-span-3 flex flex-col gap-6">
        <div className="bg-claude-surface p-6 rounded-xl border border-claude-border">
          <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4 text-claude-orange flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-claude-orange h-animate-pulse"></div>
            PROCESADOR_DOCX
          </h2>
          <p className="text-claude-text-secondary text-[11px] leading-relaxed mb-6">
            Sube un documento para convertirlo a HTML limpio (Rich Text).
            Se conservan negritas, enlaces y encabezados.
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
            className="border border-dashed border-claude-border rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-claude-orange/60 hover:bg-claude-orange/5 transition-all group mb-4"
          >
            {isProcessing ? (
              <RefreshCw className="w-6 h-6 text-claude-orange animate-spin mb-3" />
            ) : (
              <div className="w-10 h-10 bg-claude-orange/10 text-claude-orange border border-claude-orange/40 rounded-xl flex items-center justify-center mb-3 group-hover:bg-claude-orange group-hover:text-claude-bg transition-colors">
                <Upload className="w-5 h-5" />
              </div>
            )}
            <span className="text-[10px] uppercase font-bold tracking-widest text-claude-orange/80 group-hover:text-claude-orange">
              {isProcessing ? 'Procesando...' : 'SUBIR_ARCHIVO'}
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
                  <div className="flex items-center justify-center gap-2 w-full">
                    <RefreshCw className="w-4 h-4 animate-spin text-claude-bg" />
                    <span>ANALIZANDO_DOCUMENTO...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 w-full">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold">GENERAR CARDS</span>
                  </div>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="lg:col-span-9 flex flex-col h-full bg-claude-bg rounded-sm border border-claude-border overflow-hidden">
        <div className="border-b border-claude-border px-4 py-2 flex items-center justify-between bg-claude-surface">
          <div className="flex bg-claude-bg p-1 rounded-sm border border-claude-border">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'preview' ? 'bg-claude-orange/20 text-claude-orange border border-claude-orange/40' : 'text-claude-text-dim hover:text-claude-text-secondary'}`}
            >
              VISTA_PREVIA
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${viewMode === 'code' ? 'bg-claude-orange/20 text-claude-orange border border-claude-orange/40' : 'text-claude-text-dim hover:text-claude-text-secondary'}`}
            >
              CÓDIGO
            </button>
          </div>
          <div className="text-[10px] text-claude-text-dim font-bold tabular-nums">
            {htmlContent ? `${(htmlContent.length / 1024).toFixed(1)} KB` : '0.0 KB'}
          </div>
        </div>

        <div className={`flex-1 overflow-auto relative transition-colors duration-500 ${htmlContent ? 'bg-white' : 'bg-neutral-900/50'}`}>
          {!htmlContent ? (
            <div className="absolute inset-0 flex items-center justify-center text-claude-text-dim flex-col gap-4">
              <div className="w-12 h-12 rounded-sm bg-claude-surface border border-claude-border flex items-center justify-center">
                <FileText className="w-6 h-6 text-claude-text-dim" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest">Esperando archivo...</p>
            </div>
          ) : (
            <>
              {viewMode === 'preview' ? (
                <div className="p-8 lg:p-12 max-w-3xl mx-auto preview-content text-claude-text-primary">
                  <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </div>
              ) : (
                <div className="h-full">
                  <Editor
                    height="100%"
                    defaultLanguage="html"
                    value={htmlContent}
                    theme="vs-dark"
                    onChange={(value) => setHtmlContent(value || '')}
                    options={{
                      readOnly: false,
                      minimap: { enabled: false },
                      fontSize: 12,
                      fontFamily: "'JetBrains Mono', monospace",
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      padding: { top: 20, bottom: 20 },
                      wordWrap: 'on'
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};