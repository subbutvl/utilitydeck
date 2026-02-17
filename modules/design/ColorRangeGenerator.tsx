
import React, { useState, useMemo } from 'react';

type GenerationMode = 'shades' | 'tints' | 'tones' | 'tints-shades';

export const ColorRangeGenerator: React.FC = () => {
  const [baseColors, setBaseColors] = useState<string[]>(['#4FACFE']);
  const [steps, setSteps] = useState(11); // Default to odd number for better tints-shades symmetry
  const [mode, setMode] = useState<GenerationMode>('tints-shades');

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    return { r, g, b };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  };

  const generateRandomHex = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
  };

  const generateRange = (base: string) => {
    const { r, g, b } = hexToRgb(base);
    const result = [];

    for (let i = 0; i < steps; i++) {
      const factor = i / (steps - 1);
      let nr, ng, nb;

      if (mode === 'shades') {
        // Base to Black
        nr = Math.round(r * (1 - factor));
        ng = Math.round(g * (1 - factor));
        nb = Math.round(b * (1 - factor));
      } else if (mode === 'tints') {
        // Base to White
        nr = Math.round(r + (255 - r) * factor);
        ng = Math.round(g + (255 - g) * factor);
        nb = Math.round(b + (255 - b) * factor);
      } else if (mode === 'tones') {
        // Base to Gray
        nr = Math.round(r + (128 - r) * factor);
        ng = Math.round(g + (128 - g) * factor);
        nb = Math.round(b + (128 - b) * factor);
      } else if (mode === 'tints-shades') {
        // Black to Base to White
        const mid = (steps - 1) / 2;
        if (i < mid) {
          // Part 1: Black to Base (Shades)
          const ratio = i / mid;
          nr = Math.round(r * ratio);
          ng = Math.round(g * ratio);
          nb = Math.round(b * ratio);
        } else if (i === mid) {
          // Midpoint: Exact Base
          nr = r; ng = g; nb = b;
        } else {
          // Part 2: Base to White (Tints)
          const ratio = (i - mid) / (steps - 1 - mid);
          nr = Math.round(r + (255 - r) * ratio);
          ng = Math.round(g + (255 - g) * ratio);
          nb = Math.round(b + (255 - b) * ratio);
        }
      }

      result.push(rgbToHex(nr!, ng!, nb!));
    }
    return result;
  };

  const allRanges = useMemo(() => {
    return baseColors.map(color => ({
      base: color,
      range: generateRange(color)
    }));
  }, [baseColors, steps, mode]);

  const addColor = () => {
    setBaseColors([...baseColors, generateRandomHex()]);
  };

  const removeColor = (index: number) => {
    if (baseColors.length > 1) {
      setBaseColors(baseColors.filter((_, i) => i !== index));
    }
  };

  const updateBaseColor = (index: number, value: string) => {
    const next = [...baseColors];
    next[index] = value;
    setBaseColors(next);
  };

  const copyJson = () => {
    const data = allRanges.map(r => ({
      base: r.base,
      mode: mode,
      steps: steps,
      colors: r.range
    }));
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 pb-10">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-6">
            <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block border-b border-[var(--border)] pb-2">Global Settings</span>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="text-[10px] uppercase text-[var(--text-muted)] mb-2 block tracking-widest">Generation Mode</label>
                <div className="grid grid-cols-2 gap-1 border border-[var(--border)] p-1">
                  {(['shades', 'tints', 'tones', 'tints-shades'] as const).map(m => (
                    <button 
                      key={m}
                      onClick={() => setMode(m)}
                      className={`py-2 text-[10px] uppercase font-bold tracking-tight transition-all ${mode === m ? 'bg-white text-black' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                    >
                      {m.replace('-', ' & ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 flex justify-between tracking-widest">Steps (Precision) <span>{steps}</span></label>
                <input 
                  type="range" min="3" max="25" step={mode === 'tints-shades' ? 2 : 1} value={steps}
                  onChange={(e) => setSteps(parseInt(e.target.value))}
                  className="w-full h-1 bg-[var(--bg-hover)] appearance-none accent-white cursor-pointer"
                />
                <p className="text-[8px] text-[var(--text-muted)] mt-1 uppercase italic">* Tints & Shades requires odd steps for center alignment.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border)]">
               <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">Base Anchors</span>
                  <button onClick={addColor} className="text-[10px] uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold transition-colors">+ Add Color</button>
               </div>
               
               <div className="space-y-3">
                  {baseColors.map((color, idx) => (
                    <div key={idx} className="flex gap-2 items-center group">
                      <input 
                        type="color" 
                        value={color} 
                        onChange={(e) => updateBaseColor(idx, e.target.value)}
                        className="w-10 h-10 bg-transparent border-none p-0 cursor-pointer shrink-0"
                      />
                      <input 
                        type="text" 
                        value={color.toUpperCase()}
                        onChange={(e) => updateBaseColor(idx, e.target.value)}
                        className="flex-1 bg-[var(--bg-input)] border border-[var(--border)] px-3 py-2 text-xs font-mono text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-hover)] uppercase"
                      />
                      <button 
                        onClick={() => removeColor(idx)}
                        className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
                        disabled={baseColors.length === 1}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-4">
            <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block mb-2 border-b border-[var(--border)] pb-2">Designer Tips</span>
            <div className="space-y-4">
               <div>
                  <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Tints & Shades</p>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed italic">The "Full Spectrum" approach. Anchors your base in the center, providing a complete range from shadow to highlight.</p>
               </div>
               <div>
                  <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Accessibility</p>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed italic">Use the far ends of the range for text/background contrast. Inner steps are better for borders and disabled states.</p>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex-1 border border-[var(--border)] flex flex-col p-8 bg-[var(--bg-page)] overflow-y-auto relative">
            <div className="mb-8 flex items-center justify-between">
               <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.3em] font-bold italic">Output Visualization</span>
               <div className="flex items-center gap-4">
                 <button onClick={copyJson} className="text-[10px] uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold transition-colors flex items-center gap-2 bg-[var(--bg-card)] px-3 py-1.5 border border-[var(--border)] hover:border-[var(--border-hover)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    Copy JSON
                 </button>
                 <div className="flex gap-2">
                   <div className="w-2 h-2 bg-[var(--bg-input)] border border-white/20"></div>
                   <div className="w-2 h-2 bg-white border border-white/20"></div>
                 </div>
               </div>
            </div>
            
            <div className="space-y-12 min-h-full pb-20">
              {allRanges.map((r, rowIdx) => (
                <div key={rowIdx} className="space-y-3 animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest font-bold">Base: {r.base}</span>
                    <span className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-widest">{mode} distribution</span>
                  </div>
                  <div className="flex h-24 w-full border border-white/5 bg-[var(--bg-card)] shadow-2xl overflow-hidden">
                    {r.range.map((hex, i) => {
                      const isBase = mode === 'tints-shades' ? i === (steps - 1) / 2 : (i === 0);
                      return (
                        <div 
                          key={i} 
                          className={`flex-1 h-full cursor-pointer group relative overflow-hidden transition-all hover:flex-[2.5] ${isBase ? 'ring-inset ring-2 ring-white/20 z-10' : ''}`}
                          style={{ backgroundColor: hex }}
                          onClick={() => navigator.clipboard.writeText(hex)}
                        >
                          <div className={`absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--bg-input)]/30 backdrop-blur-[2px] ${parseInt(hex.slice(1), 16) > 0xffffff / 1.5 ? 'text-black' : 'text-[var(--text-primary)]'}`}>
                            <span className="text-[9px] font-mono font-bold">{hex}</span>
                            <span className="text-[7px] uppercase font-bold tracking-tighter mt-1">Copy</span>
                          </div>
                          
                          {isBase && (
                            <div className="absolute top-2 left-0 right-0 text-center">
                               <div className="inline-block px-1.5 py-0.5 bg-[var(--bg-input)]/20 text-[7px] uppercase font-bold text-[var(--text-primary)] tracking-widest backdrop-blur-sm">Source</div>
                            </div>
                          )}
                          
                          {(i === 0 || i === steps - 1) && (
                             <div className={`absolute bottom-1 left-1 right-1 text-center text-[8px] font-mono opacity-30 ${parseInt(hex.slice(1), 16) > 0xffffff / 1.5 ? 'text-black' : 'text-[var(--text-primary)]'}`}>
                                {i === 0 ? 'START' : 'END'}
                             </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
