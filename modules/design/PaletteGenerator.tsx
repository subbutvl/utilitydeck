
import React, { useState, useCallback, useEffect } from 'react';

interface Color {
  hex: string;
  locked: boolean;
}

export const PaletteGenerator: React.FC = () => {
  const [colors, setColors] = useState<Color[]>([
    { hex: '#111111', locked: false },
    { hex: '#333333', locked: false },
    { hex: '#555555', locked: false },
    { hex: '#777777', locked: false },
    { hex: '#999999', locked: false },
  ]);

  const generateRandomHex = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
  };

  const randomize = useCallback(() => {
    setColors(prev => prev.map(c => c.locked ? c : { ...c, hex: generateRandomHex() }));
  }, []);

  useEffect(() => {
    randomize();
  }, [randomize]);

  const toggleLock = (index: number) => {
    const newColors = [...colors];
    newColors[index].locked = !newColors[index].locked;
    setColors(newColors);
  };

  const updateColor = (index: number, hex: string) => {
    const newColors = [...colors];
    newColors[index].hex = hex.toUpperCase();
    setColors(newColors);
  };

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
  };

  const copyPalette = () => {
    navigator.clipboard.writeText(colors.map(c => c.hex).join(', '));
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex-1 flex gap-2 min-h-0">
        {colors.map((c, i) => (
          <div 
            key={i} 
            className="flex-1 flex flex-col transition-all duration-500 relative group overflow-hidden border border-[var(--border)]"
            style={{ backgroundColor: c.hex }}
          >
            <div className="flex-1"></div>
            <div className="bg-[var(--bg-input)]/40 backdrop-blur-md p-6 flex flex-col items-center gap-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => toggleLock(i)}
                className={`p-2 rounded-full transition-colors ${c.locked ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]/40 hover:text-[var(--text-primary)]'}`}
              >
                {c.locked ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
                )}
              </button>
              
              <div className="flex flex-col items-center gap-2">
                <input 
                  type="text" 
                  value={c.hex} 
                  onChange={(e) => updateColor(i, e.target.value)}
                  className="bg-transparent text-[var(--text-primary)] font-mono text-center text-sm border-none focus:ring-0 w-24 uppercase"
                />
                <button 
                  onClick={() => copyColor(c.hex)}
                  className="text-[10px] uppercase text-[var(--text-primary)]/60 hover:text-[var(--text-primary)] tracking-widest font-bold"
                >
                  Copy
                </button>
              </div>
            </div>
            {/* Visual hex indicator always visible at bottom when not hovered */}
            <div className="absolute bottom-6 left-0 right-0 text-center font-mono font-bold text-[var(--text-primary)] group-hover:opacity-0 transition-opacity drop-shadow-md">
              {c.hex}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between py-4 border-t border-[var(--border)]">
        <div className="flex gap-4">
          <button 
            onClick={randomize}
            className="px-8 py-3 bg-white text-black text-[11px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors"
          >
            Generate New
          </button>
          <button 
            onClick={copyPalette}
            className="px-6 py-3 border border-[var(--border)] text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] font-bold uppercase tracking-widest transition-all"
          >
            Copy Palette
          </button>
        </div>
        <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">
          Press Space to Randomize
        </div>
      </div>
    </div>
  );
};
