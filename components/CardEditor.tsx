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
      <div className="bg-gray-100 p-1 rounded-lg flex">
        <button
          onClick={() => handleTypeChange('featured')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md flex items-center justify-center gap-2 transition-all ${
            data.type === 'featured'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          Destacado
        </button>
        <button
          onClick={() => handleTypeChange('testimonial')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md flex items-center justify-center gap-2 transition-all ${
            data.type === 'testimonial'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          Comentario
        </button>
      </div>

      {data.type === 'featured' && (
        <>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
              <Type className="w-3 h-3" /> Etiqueta (Tag)
            </label>
            <input
              type="text"
              value={data.tag || ''}
              onChange={(e) => handleChange('tag', e.target.value)}
              className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              placeholder="Ej. DEMO"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
              <AlignLeft className="w-3 h-3" /> Descripción
            </label>
            <textarea
              value={data.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={5}
              placeholder="Texto descriptivo de la tarjeta"
              className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Texto del Enlace</label>
              <input
                type="text"
                value={data.linkText || ''}
                onChange={(e) => handleChange('linkText', e.target.value)}
                className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                  <LinkIcon className="w-3 h-3" /> URL del Enlace
              </label>
              <input
                type="text"
                value={data.url || ''}
                onChange={(e) => handleChange('url', e.target.value)}
                className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
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
            <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
              <AlignLeft className="w-3 h-3" /> Comentario / Cita
            </label>
            <textarea
              value={data.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={6}
              placeholder="“El comentario del cliente...”"
              className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                 <User className="w-3 h-3" /> Nombre
              </label>
              <input
                type="text"
                value={data.authorName || ''}
                onChange={(e) => handleChange('authorName', e.target.value)}
                placeholder="Ej. Paolo Boni"
                className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                  <Briefcase className="w-3 h-3" /> Cargo
              </label>
              <input
                type="text"
                value={data.authorRole || ''}
                onChange={(e) => handleChange('authorRole', e.target.value)}
                placeholder="Ej. CEO de Inconcert"
                className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </>
      )}

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
          <ImageIcon className="w-3 h-3" /> {data.type === 'testimonial' ? 'URL del Avatar (Foto)' : 'URL de la Imagen'}
        </label>
        <input
          type="text"
          value={data.imageUrl}
          onChange={(e) => handleChange('imageUrl', e.target.value)}
          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
        />
      </div>
    </div>
  );
};