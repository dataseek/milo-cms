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
    <div className="min-h-screen bg-claude-bg text-claude-text-primary font-mono flex flex-col">

      {/* Global Preview Styles for Converter */}
      <style>{`
        .preview-content { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
        .preview-content ::selection { background-color: rgba(217, 119, 87, 0.2); color: inherit; }
        .preview-content a, .preview-content a * { text-decoration: underline !important; color: #3b82f6 !important; }
        .preview-content h1 { font-size: 2rem; font-weight: 800; margin-top: 1.5em; margin-bottom: 0.75em; line-height: 1.2; color: #111; }
        .preview-content h2 { font-size: 1.5rem; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; color: #111; }
        .preview-content h3 { font-size: 1.35rem; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.5em; color: #111; }
        .preview-content h4 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5em; margin-bottom: 0.5em; color: #111; }
        .preview-content h5 { font-size: 1.1rem; font-weight: 600; margin-top: 1.25em; margin-bottom: 0.5em; color: #111; }
        .preview-content h6 { font-size: 1rem; font-weight: 600; margin-top: 1.25em; margin-bottom: 0.5em; text-transform: uppercase; color: #666; }
        .preview-content p { margin-bottom: 1em; line-height: 1.6; color: #333; }
        .preview-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1em; }
        .preview-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1em; }
        .preview-content li { margin-bottom: 0.5em; padding-left: 0.5rem; color: #333; }
        .preview-content strong, .preview-content b { font-weight: 700; color: #000; }
      `}</style>

      {/* Header */}
      <header className="bg-claude-bg border-b border-claude-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 border border-claude-orange/60 rounded-lg flex items-center justify-center bg-claude-orange/10">
              <Wand2 className="text-claude-orange w-5 h-5" />
            </div>
            <h1 className="font-bold text-lg md:text-xl tracking-tight text-claude-text-primary flex flex-wrap items-center gap-1">
              MILO_<span className="text-claude-orange">CMS</span>
            </h1>
          </div>

          <nav className="flex gap-1 bg-claude-surface p-1 rounded-xl border border-claude-border">
            <button
              onClick={() => setActiveTab('converter')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all tracking-widest ${activeTab === 'converter'
                ? 'bg-claude-orange/20 text-claude-orange border border-claude-orange/40'
                : 'text-claude-text-dim hover:text-claude-text-secondary'
                }`}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">CONVERSOR</span>
              <span className="sm:hidden">DOCX</span>
            </button>
            <button
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all tracking-widest ${activeTab === 'generator'
                ? 'bg-claude-orange/20 text-claude-orange border border-claude-orange/40'
                : 'text-claude-text-dim hover:text-claude-text-secondary'
                }`}
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">TARJETAS</span>
              <span className="sm:hidden">CARDS</span>
              <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-md border font-bold ${activeTab === 'generator'
                ? 'bg-claude-orange text-claude-bg border-claude-orange'
                : 'bg-claude-bg text-claude-text-dim border-claude-border'
                }`}>
                {cards.length}
              </span>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 py-6 flex-1 w-full overflow-hidden">
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
      <footer className="bg-claude-bg border-t border-claude-border py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[10px] font-bold tracking-widest uppercase text-claude-text-dim/60">
            MILO - CMS / DEVELOPED BY SERGIO RODRIGUEZ
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;