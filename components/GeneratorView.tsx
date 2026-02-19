import React, { useState } from 'react';
import { CardData } from '../types';
import { DEFAULT_CARD_DATA, generateCardHTML, CARD_CSS } from '../constants';
import { CardEditor } from './CardEditor';
import { Button } from './Button';
import { Plus, Trash2, Code, Check, Languages, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface GeneratorViewProps {
  cards: CardData[];
  setCards: React.Dispatch<React.SetStateAction<CardData[]>>;
}

export const GeneratorView: React.FC<GeneratorViewProps> = ({ cards, setCards }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [translatingIds, setTranslatingIds] = useState<Set<string>>(new Set());

  const addCard = () => {
    const newId = `card-${Date.now()}`;
    setCards([...cards, { ...DEFAULT_CARD_DATA, id: newId }]);
  };

  const updateCard = (index: number, newData: CardData) => {
    const newCards = [...cards];
    newCards[index] = newData;
    setCards(newCards);
  };

  const removeCard = (index: number) => {
    if (cards.length === 1) return; // Keep at least one
    const newCards = cards.filter((_, i) => i !== index);
    setCards(newCards);
  };

  const copyCardHtml = (card: CardData, index: number) => {
    // Using a random ID suffix for the container helps avoid conflicts if multiple are pasted.
    const uniqueSuffix = Math.floor(Math.random() * 1000);
    const html = generateCardHTML(card, uniqueSuffix);
    
    const fullCode = `<!--CARD-EMBED-START-->${CARD_CSS}\n${html}<!--CARD-EMBED-END-->`;

    navigator.clipboard.writeText(fullCode).then(() => {
      setCopiedId(card.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const translateCard = async (index: number) => {
    const card = cards[index];
    const cardId = card.id;

    if (translatingIds.has(cardId)) return;

    setTranslatingIds(prev => new Set(prev).add(cardId));

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Translate the following website card content to English. Maintain the professional tone and meaning.
      
      Input JSON:
      {
        "description": "${card.description}",
        "linkText": "${card.linkText || ''}",
        "authorRole": "${card.authorRole || ''}"
      }
      
      Return ONLY a raw JSON object with the translated keys that were present.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const translatedText = response.text;
      
      if (translatedText) {
        const translatedJson = JSON.parse(translatedText);
        updateCard(index, {
          ...card,
          description: translatedJson.description || card.description,
          linkText: card.linkText ? (translatedJson.linkText || card.linkText) : undefined,
          authorRole: card.authorRole ? (translatedJson.authorRole || card.authorRole) : undefined
        });
      }
    } catch (error) {
      console.error("Translation error:", error);
      alert("Hubo un error al traducir. Por favor intenta de nuevo.");
    } finally {
      setTranslatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(cardId);
        return newSet;
      });
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Cards Destacadas</h2>
          <p className="text-sm text-gray-500">Crea tarjetas individuales y copia su código HTML para Webflow.</p>
        </div>
        <Button onClick={addCard} icon={<Plus className="w-4 h-4" />}>
          Nueva Tarjeta
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-8 pb-20">
        {cards.map((card, index) => {
          const isTranslating = translatingIds.has(card.id);
          return (
            <div key={card.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
                <span className="font-semibold text-gray-700 text-sm">Tarjeta #{index + 1}</span>
                <div className="flex items-center gap-2">
                   <Button 
                    variant="outline" 
                    onClick={() => translateCard(index)}
                    disabled={isTranslating}
                    className="h-8 px-3 text-xs"
                    icon={isTranslating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Languages className="w-3 h-3" />}
                  >
                    {isTranslating ? 'Traduciendo...' : 'Traducir al Inglés'}
                  </Button>
                  <div className="w-px h-4 bg-gray-300 mx-1"></div>
                  <button 
                    onClick={() => removeCard(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Eliminar tarjeta"
                    disabled={cards.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 divider-x-0 lg:divide-x divide-gray-100">
                {/* Editor Column */}
                <div className="lg:col-span-4 p-6 bg-white">
                  <CardEditor 
                    data={card} 
                    onChange={(newData) => updateCard(index, newData)} 
                  />
                </div>

                {/* Preview Column */}
                <div className="lg:col-span-8 p-6 bg-[#F8F9FC] flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vista Previa</span>
                    <Button 
                      variant="outline" 
                      onClick={() => copyCardHtml(card, index)}
                      className={copiedId === card.id ? "border-green-500 text-green-600 bg-green-50" : ""}
                    >
                      {copiedId === card.id ? <Check className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                      {copiedId === card.id ? 'Copiado' : 'Copiar HTML'}
                    </Button>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center p-4 border border-dashed border-gray-300 rounded-xl bg-white/50 min-h-[300px]">
                    {/* Render the card HTML safely */}
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: CARD_CSS + generateCardHTML(card, index) 
                      }} 
                      className="w-full max-w-[800px]"
                    />
                  </div>
                  <p className="text-xs text-center text-gray-400 mt-4">
                    El código copiado incluye los estilos inline necesarios.
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};