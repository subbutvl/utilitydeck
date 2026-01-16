
import React, { useState, useRef, useEffect } from 'react';

type PaperType = 'plain' | 'lined' | 'grid';
type InkColor = 'blue' | 'black' | 'red';
type HandFont = 'homemade' | 'caveat' | 'shadows' | 'indie';
type EditorMode = 'plain' | 'rich';

export const HandwritingConverter: React.FC = () => {
  const [editorMode, setEditorMode] = useState<EditorMode>('rich');
  const [plainText, setPlainText] = useState('My dearest friend,\n\nDigital screens often feel cold and impersonal. Sometimes, a handwritten note is the only way to truly convey emotion and sincerity.\n\nBest regards,\nSwissKnife Kit');
  const [richText, setRichText] = useState('<div>My dearest friend,</div><div><br></div><div>Digital screens often feel <b>cold and impersonal</b>. Sometimes, a <i>handwritten note</i> is the only way to truly convey emotion and sincerity.</div><div><br></div><div>Best regards,</div><div>SwissKnife Kit</div>');
  
  const [paper, setPaper] = useState<PaperType>('lined');
  const [ink, setInk] = useState<InkColor>('blue');
  const [font, setFont] = useState<HandFont>('homemade');
  const [fontSize, setFontSize] = useState(18);

  const richEditorRef = useRef<HTMLDivElement>(null);

  const inkColors = {
    blue: '#1e3a8a',
    black: '#171717',
    red: '#991b1b'
  };

  const fonts = {
    homemade: "'Homemade Apple', cursive",
    caveat: "'Caveat', cursive",
    shadows: "'Shadows Into Light', cursive",
    indie: "'Indie Flower', cursive"
  };

  const toggleMode = (mode: EditorMode) => {
    if (mode === 'plain' && editorMode === 'rich') {
      const temp = document.createElement('div');
      temp.innerHTML = richText;
      setPlainText(temp.innerText);
    } else if (mode === 'rich' && editorMode === 'plain') {
      const html = plainText.split('\n').map(line => `<div>${line || '<br>'}</div>`).join('');
      setRichText(html);
    }
    setEditorMode(mode);
  };

  const handleCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (richEditorRef.current) {
      setRichText(richEditorRef.current.innerHTML);
    }
  };

  const handleRichInput = () => {
    if (richEditorRef.current) {
      setRichText(richEditorRef.current.innerHTML);
    }
  };

  const resetAll = () => {
    setPlainText('');
    setRichText('');
    setPaper('lined');
    setInk('blue');
    setFont('homemade');
    setFontSize(18);
    if (richEditorRef.current) {
      richEditorRef.current.innerHTML = '';
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-1">
          <div className="bg-[#111] border border-neutral-800 p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <label className="text-[10px] uppercase text-neutral-600 font-bold tracking-widest">Editor</label>
                  <button onClick={resetAll} className="text-[10px] uppercase text-neutral-700 hover:text-red-500 font-bold tracking-widest transition-colors">Reset All</button>
                </div>
                <div className="flex bg-neutral-900 border border-neutral-800 p-0.5">
                  <button 
                    onClick={() => toggleMode('plain')}
                    className={`px-3 py-1 text-[9px] uppercase tracking-tighter transition-colors ${editorMode === 'plain' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                  >
                    Plain
                  </button>
                  <button 
                    onClick={() => toggleMode('rich')}
                    className={`px-3 py-1 text-[9px] uppercase tracking-tighter transition-colors ${editorMode === 'rich' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                  >
                    Rich
                  </button>
                </div>
              </div>

              {editorMode === 'rich' && (
                <div className="flex gap-1 mb-2 border-b border-neutral-800 pb-2">
                  <button onClick={() => handleCommand('bold')} className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors" title="Bold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
                  </button>
                  <button onClick={() => handleCommand('italic')} className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors" title="Italic">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
                  </button>
                  <button onClick={() => handleCommand('underline')} className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors" title="Underline">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
                  </button>
                </div>
              )}

              <div className="relative">
                {editorMode === 'plain' ? (
                  <textarea
                    value={plainText}
                    onChange={(e) => setPlainText(e.target.value)}
                    className="w-full h-48 bg-neutral-950 border border-neutral-800 p-4 text-xs text-neutral-300 focus:outline-none focus:border-neutral-600 resize-none rounded-none leading-relaxed font-mono"
                    placeholder="Enter text to write..."
                  />
                ) : (
                  <div
                    ref={richEditorRef}
                    contentEditable
                    onInput={handleRichInput}
                    dangerouslySetInnerHTML={{ __html: richText }}
                    className="w-full h-48 bg-neutral-950 border border-neutral-800 p-4 text-xs text-neutral-300 focus:outline-none focus:border-neutral-600 overflow-y-auto rounded-none leading-relaxed prose prose-invert max-w-none"
                    style={{ minHeight: '12rem' }}
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase text-neutral-500 font-bold mb-2 block tracking-widest">Paper</label>
                <select 
                  value={paper} 
                  onChange={(e) => setPaper(e.target.value as PaperType)}
                  className="w-full bg-neutral-950 border border-neutral-800 p-2 text-[11px] text-white focus:outline-none"
                >
                  <option value="plain">Plain White</option>
                  <option value="lined">Lined Paper</option>
                  <option value="grid">Grid/Graph</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase text-neutral-500 font-bold mb-2 block tracking-widest">Ink Color</label>
                <div className="flex gap-2">
                  {(['blue', 'black', 'red'] as InkColor[]).map(c => (
                    <button 
                      key={c}
                      onClick={() => setInk(c)}
                      className={`w-6 h-6 border transition-all ${ink === c ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: inkColors[c] }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase text-neutral-500 font-bold mb-2 block tracking-widest">Style</label>
              <select 
                value={font} 
                onChange={(e) => setFont(e.target.value as HandFont)}
                className="w-full bg-neutral-950 border border-neutral-800 p-2 text-[11px] text-white focus:outline-none"
              >
                <option value="homemade">Classic Cursive (Homemade)</option>
                <option value="caveat">Quick Sketch (Caveat)</option>
                <option value="shadows">Neat Print (Shadows)</option>
                <option value="indie">Friendly Casual (Indie)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase text-neutral-500 font-bold mb-2 block tracking-widest">Font Size: {fontSize}px</label>
              <input 
                type="range" min="12" max="42" value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full h-1 bg-neutral-800 appearance-none accent-white"
              />
            </div>
          </div>
          
          <button 
            onClick={() => window.print()}
            className="w-full py-3 border border-neutral-800 text-[11px] uppercase tracking-widest text-neutral-400 hover:text-white hover:border-neutral-600 transition-all flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
            Export to PDF / Print
          </button>
        </div>

        <div className="lg:col-span-8 flex flex-col relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase text-neutral-600 font-bold tracking-widest">Page Preview</span>
            <span className="text-[9px] text-neutral-500 font-mono italic">Style variations based on editor input</span>
          </div>
          
          <div 
            id="print-area"
            className={`flex-1 overflow-auto p-12 transition-all duration-500 shadow-inner relative`}
            style={{ 
              backgroundColor: '#fffcf5',
              backgroundImage: 
                paper === 'lined' 
                  ? 'linear-gradient(#94a3b8 1px, transparent 1px)' 
                  : paper === 'grid' 
                    ? 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)' 
                    : 'none',
              backgroundSize: paper === 'lined' ? '100% 1.8rem' : paper === 'grid' ? '1.8rem 1.8rem' : 'auto',
              lineHeight: '1.8rem'
            }}
          >
            {paper === 'lined' && (
              <div className="absolute left-[3rem] top-0 h-full w-[2px] bg-red-200" />
            )}

            <div 
              className={`relative z-10 select-text transition-all duration-300 handwriting-canvas ${editorMode === 'plain' ? 'whitespace-pre-wrap' : ''}`}
              style={{ 
                fontFamily: fonts[font], 
                color: inkColors[ink],
                fontSize: `${fontSize}px`,
                paddingLeft: paper === 'lined' ? '3.5rem' : '0',
                marginTop: paper === 'lined' ? '0.4rem' : '0',
              }}
              dangerouslySetInnerHTML={editorMode === 'rich' ? { __html: richText } : undefined}
            >
              {editorMode === 'plain' ? plainText : null}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Homemade+Apple&family=Caveat:wght@400;700&family=Shadows+Into+Light&family=Indie+Flower&display=swap');
        
        .handwriting-canvas b, .handwriting-canvas strong {
          font-weight: 700;
          filter: drop-shadow(0.5px 0.5px 0.5px currentColor);
        }
        
        .handwriting-canvas i, .handwriting-canvas em {
          font-style: italic;
          transform: skewX(-5deg);
          display: inline-block;
        }

        .handwriting-canvas u {
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 4px;
        }

        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }
        }
      `}</style>
    </div>
  );
};
