import React from 'react';
import { CardData, CardType } from '../types';
import { DEFAULT_IMAGE_URL, DEFAULT_AVATAR_URL } from '../constants';
import { Image as ImageIcon, Link as LinkIcon, Type, AlignLeft, CornerDownLeft, Star, User, Briefcase, LayoutTemplate } from 'lucide-react';

interface CardEditorProps {
  data: CardData;
  onChange: (newData: CardData) => void;
}

export const CardEditor: React.FC<CardEditorProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof CardData, value: string | boolean) => {
    onChange({ ...data, [field]: value });
  };

  const handleTypeChange = (type: CardType) => {
    // Determine appropriate default image when switching types if current is default
    let newImage = data.imageUrl;

    // Simple logic for image swapping if it looks like a default
    if (type === 'testimonial' && data.imageUrl.includes('kpi-cobranza')) {
      newImage = DEFAULT_AVATAR_URL;
    } else if (type === 'featured' && data.imageUrl.includes('paolo.webp')) {
      newImage = DEFAULT_IMAGE_URL;
    }

    onChange({ ...data, type, imageUrl: newImage });
  };

  return (
    <div className="space-y-5">
      {/* Type Selector */}
      <div className="bg-claude-bg p-1 rounded-xl flex border border-claude-border">
        <button
          onClick={() => handleTypeChange('featured')}
          className={`flex-1 py-1 px-3 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all ${data.type === 'featured'
            ? 'bg-claude-orange/20 text-claude-orange border border-claude-orange/40 shadow-[0_0_15px_rgba(217,119,87,0.1)]'
            : 'text-claude-text-dim hover:text-claude-text-secondary'
            }`}
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          DESTACADO
        </button>
        <button
          onClick={() => handleTypeChange('testimonial')}
          className={`flex-1 py-1 px-3 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all ${data.type === 'testimonial'
            ? 'bg-claude-orange/20 text-claude-orange border border-claude-orange/40 shadow-[0_0_15px_rgba(217,119,87,0.1)]'
            : 'text-claude-text-dim hover:text-claude-text-secondary'
            }`}
        >
          <Star className="w-3.5 h-3.5" />
          TESTIMONIO
        </button>
      </div>

      {data.type === 'featured' && (
        <>
          <div>
            <label className="block text-[10px] font-bold text-claude-orange mb-1.5 flex items-center gap-1 uppercase tracking-widest">
              <Type className="w-3 h-3" /> ETIQUETA_TAG
            </label>
            <input
              type="text"
              value={data.tag || ''}
              onChange={(e) => handleChange('tag', e.target.value)}
              className="w-full px-3 py-2 text-xs text-claude-text-primary bg-claude-bg border border-claude-border rounded-sm focus:outline-none focus:border-claude-text-secondary transition-colors"
              placeholder="Ej. DEMO"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-claude-orange mb-1.5 flex items-center gap-1 uppercase tracking-widest">
              <AlignLeft className="w-3 h-3" /> DESCRIPCIÓN
            </label>
            <textarea
              value={data.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              placeholder="Texto descriptivo de la tarjeta"
              className="w-full px-3 py-2 text-xs text-claude-text-primary bg-claude-bg border border-claude-border rounded-sm focus:outline-none focus:border-claude-text-secondary transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-claude-orange mb-1.5 uppercase tracking-widest">TEXTO_ENLACE</label>
              <input
                type="text"
                value={data.linkText || ''}
                onChange={(e) => handleChange('linkText', e.target.value)}
                className="w-full px-2 py-1.5 text-xs text-claude-text-primary bg-claude-bg border border-claude-border rounded-sm focus:outline-none focus:border-claude-text-secondary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-claude-orange mb-1.5 flex items-center gap-1 uppercase tracking-widest">
                <LinkIcon className="w-3 h-3" /> URL_ENLACE
              </label>
              <input
                type="text"
                value={data.url || ''}
                onChange={(e) => handleChange('url', e.target.value)}
                className="w-full px-2 py-1.5 text-xs text-claude-text-primary bg-claude-bg border border-claude-border rounded-sm focus:outline-none focus:border-claude-text-secondary transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 px-1">
              <input
                type="checkbox"
                id={`newline-${data.id}`}
                checked={data.linkOnNewLine}
                onChange={(e) => handleChange('linkOnNewLine', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
              />
              <label htmlFor={`newline-${data.id}`} className="text-xs font-medium text-gray-700 select-none cursor-pointer flex items-center gap-1">
                <CornerDownLeft className="w-3 h-3 text-gray-500" />
                Mostrar enlace en nueva línea
              </label>
            </div>
          </div>
        </>
      )}

      {data.type === 'testimonial' && (
        <>
          <div>
            <label className="block text-[10px] font-bold text-claude-orange mb-1.5 flex items-center gap-1 uppercase tracking-widest">
              <AlignLeft className="w-3 h-3" /> CONTENIDO_CITA
            </label>
            <textarea
              value={data.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              placeholder="“El comentario del cliente...”"
              className="w-full px-3 py-2 text-xs text-claude-text-primary bg-claude-bg border border-claude-border rounded-sm focus:outline-none focus:border-claude-text-secondary transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-claude-orange mb-1.5 flex items-center gap-1 uppercase tracking-widest">
                <User className="w-3 h-3" /> NOMBRE_AUTOR
              </label>
              <input
                type="text"
                value={data.authorName || ''}
                onChange={(e) => handleChange('authorName', e.target.value)}
                placeholder="Ej. Paolo Boni"
                className="w-full px-2 py-1.5 text-xs text-claude-text-primary bg-claude-bg border border-claude-border rounded-sm focus:outline-none focus:border-claude-text-secondary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-claude-orange mb-1.5 flex items-center gap-1 uppercase tracking-widest">
                <Briefcase className="w-3 h-3" /> CARGO_AUTOR
              </label>
              <input
                type="text"
                value={data.authorRole || ''}
                onChange={(e) => handleChange('authorRole', e.target.value)}
                placeholder="Ej. CEO de Inconcert"
                className="w-full px-2 py-1.5 text-xs text-claude-text-primary bg-claude-bg border border-claude-border rounded-sm focus:outline-none focus:border-claude-text-secondary transition-colors"
              />
            </div>
          </div>
        </>
      )}

      <div>
        <label className="block text-[10px] font-bold text-claude-orange mb-1.5 flex items-center gap-1 uppercase tracking-widest">
          <ImageIcon className="w-3 h-3" /> {data.type === 'testimonial' ? 'URL_AVATAR' : 'URL_IMAGEN'}
        </label>
        <input
          type="text"
          value={data.imageUrl}
          onChange={(e) => handleChange('imageUrl', e.target.value)}
          className="w-full px-2 py-1.5 text-xs text-claude-text-primary bg-claude-bg border border-claude-border rounded-sm focus:outline-none focus:border-claude-text-secondary transition-colors"
        />
      </div>
    </div>
  );
};