import React, { useState } from 'react';
import { Wand2, FileText, Layers } from 'lucide-react';
import { ConverterView } from './components/ConverterView';
import { GeneratorView } from './components/GeneratorView';
import { CardData } from './types';
import { DEFAULT_CARD_DATA } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'converter' | 'generator'>('converter');
  // Lifted state: Cards are now managed here so Converter can populate them
  const [cards, setCards] = useState<CardData[]>([
    { ...DEFAULT_CARD_DATA, id: 'card-1' }
  ]);

  const handleSwitchToGenerator = () => {
    setActiveTab('generator');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-gray-900 font-sans selection:bg-blue-100 flex flex-col">
      
      {/* Global Preview Styles for Converter */}
      <style>{`
        .preview-content a, .preview-content a * { text-decoration: underline !important; color: #2c52fd !important; }
        .preview-content h1 { font-size: 2rem; font-weight: 800; margin-top: 1.5em; margin-bottom: 0.75em; line-height: 1.2; color: #111; }
        .preview-content h2 { font-size: 1.5rem; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; color: #111; }
        .preview-content h3 { font-size: 1.35rem; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; color: #111; }
        .preview-content h4 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5em; margin-bottom: 0.5em; color: #111; }
        .preview-content h5 { font-size: 1.1rem; font-weight: 600; margin-top: 1.25em; margin-bottom: 0.5em; color: #111; }
        .preview-content h6 { font-size: 1rem; font-weight: 600; margin-top: 1.25em; margin-bottom: 0.5em; text-transform: uppercase; color: #666; }
        .preview-content p { margin-bottom: 1em; line-height: 1.6; }
        .preview-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1em; }
        .preview-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1em; }
        .preview-content li { margin-bottom: 0.5em; padding-left: 0.5rem; }
        .preview-content strong, .preview-content b { font-weight: 700; color: #000; }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Wand2 className="text-white w-5 h-5" />
            </div>
            <h1 className="font-bold text-lg md:text-xl tracking-tight text-gray-900 flex flex-wrap items-center gap-1">
              Milo: <span className="text-blue-600">Contenidos CMS</span>
            </h1>
          </div>
          
          <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('converter')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'converter' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Conversor DOCX</span>
              <span className="sm:hidden">Conversor</span>
            </button>
            <button
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'generator' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Cards Destacadas</span>
              <span className="sm:hidden">Cards</span>
              <span className="ml-1 bg-gray-200 text-gray-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {cards.length}
              </span>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* We use display styles instead of conditional rendering to persist state between tabs */}
        <div style={{ display: activeTab === 'converter' ? 'block' : 'none' }}>
          <ConverterView 
            setCards={setCards} 
            onSwitchTab={handleSwitchToGenerator} 
          />
        </div>
        <div style={{ display: activeTab === 'generator' ? 'block' : 'none' }}>
          <GeneratorView 
            cards={cards} 
            setCards={setCards} 
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-medium text-gray-400">
            Creado por Sergio Rodriguez
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;