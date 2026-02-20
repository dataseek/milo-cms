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
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-sm font-bold tracking-widest uppercase text-claude-orange mb-2">GENERADOR / TARJETAS DESTACADAS</h2>
          <p className="text-[11px] text-claude-text-secondary uppercase tracking-wider">Módulo de generación de bloques enriquecidos.</p>
        </div>
        <Button onClick={addCard} icon={<Plus className="w-4 h-4" />}>
          NUEVA TARJETA
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-8 pb-20">
        {cards.map((card, index) => {
          const isTranslating = translatingIds.has(card.id);
          return (
            <div key={card.id} className="bg-claude-surface rounded-xl border border-claude-border overflow-hidden">
              <div className="border-b border-claude-border bg-neutral-900/30 px-6 py-3 flex items-center justify-between">
                <span className="font-bold text-claude-orange text-[10px] tracking-widest uppercase flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-claude-orange shadow-[0_0_8px_rgba(217,119,87,0.6)]"></div>
                  NODO_{index + 1}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => translateCard(index)}
                    disabled={isTranslating}
                    className="h-7 px-2 text-[10px]"
                    icon={isTranslating ? <Loader2 className="w-3 h-3 animate-spin text-claude-orange" /> : <Languages className="w-3 h-3 text-claude-orange" />}
                  >
                    {isTranslating ? 'PROCESANDO...' : 'TRADUCIR'}
                  </Button>
                  <div className="w-px h-3 bg-claude-border mx-1"></div>
                  <button
                    onClick={() => removeCard(index)}
                    className="text-claude-orange hover:text-claude-orange/70 transition-colors p-1"
                    title="Eliminar tarjeta"
                    disabled={cards.length === 1}
                  >
                    <Trash2 className="w-4 h-4 text-claude-orange" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 lg:divide-x divide-claude-border">
                {/* Editor Column */}
                <div className="lg:col-span-3 p-6 bg-claude-surface">
                  <CardEditor
                    data={card}
                    onChange={(newData) => updateCard(index, newData)}
                  />
                </div>

                {/* Preview Column */}
                <div className="lg:col-span-9 p-6 bg-claude-bg flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-bold text-claude-text-dim uppercase tracking-widest">VISTA_RESULTADO</span>
                    <Button
                      variant="outline"
                      onClick={() => copyCardHtml(card, index)}
                      className={copiedId === card.id ? "border-white text-white" : ""}
                    >
                      {copiedId === card.id ? <Check className="w-4 h-4" /> : <Code className="w-4 h-4" />}
                      {copiedId === card.id ? 'COPIADO' : 'OBTENER_HTML'}
                    </Button>
                  </div>

                  <div className="flex-1 flex items-center justify-center p-4 border border-claude-border rounded-sm bg-black/20 min-h-[300px]">
                    {/* Render the card HTML safely */}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: CARD_CSS + generateCardHTML(card, index)
                      }}
                      className="w-full max-w-[800px]"
                    />
                  </div>
                  <p className="text-[10px] text-center text-claude-text-dim mt-4 tracking-wider">
                    COMPATIBLE_WITH: WEBFLOW / CMS_RICHTEXT
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