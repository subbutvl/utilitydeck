
import React, { useState, useMemo } from 'react';

type PatternType = 
  | 'polka' | 'lines-h' | 'lines-v' | 'grid' | 'diagonal' 
  | 'triangles' | 'zigzag' | 'concentric-circles' 
  | 'concentric-rects' | 'checkerboard';

type BlendMode = 
  | 'normal' | 'multiply' | 'screen' | 'overlay' 
  | 'darken' | 'lighten' | 'color-dodge' | 'saturation' | 'luminosity';

type MaskType = 'none' | 'inside-out' | 'outside-in';

export const PatternsGenerator: React.FC = () => {
  const [type, setType] = useState<PatternType>('polka');
  const [bgColor, setBgColor] = useState('#0a0a0a');
  const [patternColor, setPatternColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState(0.1);
  const [size, setSize] = useState(40);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [blendMode, setBlendMode] = useState<BlendMode>('normal');
  
  // Masking State
  const [maskType, setMaskType] = useState<MaskType>('none');
  const [maskSpread, setMaskSpread] = useState(80);

  // Preview Canvas Background
  const [previewBg, setPreviewBg] = useState<'dark' | 'light'>('dark');

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const patternStyle = useMemo(() => {
    const pColor = hexToRgba(patternColor, opacity);
    const s = size;
    const sw = strokeWidth;

    let backgroundImage = '';
    let backgroundSize = `${s}px ${s}px`;

    switch (type) {
      case 'polka':
        backgroundImage = `radial-gradient(${pColor} ${sw}px, transparent ${sw}px)`;
        break;
      case 'lines-h':
        backgroundImage = `linear-gradient(0deg, ${pColor} ${sw}px, transparent ${sw}px)`;
        break;
      case 'lines-v':
        backgroundImage = `linear-gradient(90deg, ${pColor} ${sw}px, transparent ${sw}px)`;
        break;
      case 'grid':
        backgroundImage = `linear-gradient(90deg, ${pColor} ${sw}px, transparent ${sw}px), linear-gradient(0deg, ${pColor} ${sw}px, transparent ${sw}px)`;
        break;
      case 'diagonal':
        backgroundImage = `linear-gradient(45deg, ${pColor} 25%, transparent 25%, transparent 50%, ${pColor} 50%, ${pColor} 75%, transparent 75%, transparent)`;
        backgroundSize = `${s}px ${s}px`;
        break;
      case 'triangles':
        backgroundImage = `conic-gradient(from 0deg at 50% 50%, ${pColor} 0deg 120deg, transparent 120deg 360deg)`;
        break;
      case 'zigzag':
        backgroundImage = `linear-gradient(135deg, ${pColor} 25%, transparent 25%), linear-gradient(225deg, ${pColor} 25%, transparent 25%), linear-gradient(45deg, ${pColor} 25%, transparent 25%), linear-gradient(315deg, ${pColor} 25%, transparent 25%)`;
        backgroundSize = `${s}px ${s}px`;
        break;
      case 'concentric-circles':
        backgroundImage = `repeating-radial-gradient(circle, ${pColor}, ${pColor} ${sw}px, transparent ${sw}px, transparent ${sw * 2}px)`;
        break;
      case 'concentric-rects':
        backgroundImage = `repeating-conic-gradient(from 0deg at 50% 50%, ${pColor} 0deg 90deg, transparent 90deg 180deg)`;
        backgroundSize = `${s}px ${s}px`;
        break;
      case 'checkerboard':
        backgroundImage = `linear-gradient(45deg, ${pColor} 25%, transparent 25%), linear-gradient(-45deg, ${pColor} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${pColor} 75%), linear-gradient(-45deg, transparent 75%, ${pColor} 75%)`;
        backgroundSize = `${s}px ${s}px`;
        break;
    }

    const style: any = {
      backgroundColor: bgColor,
      backgroundImage,
      backgroundSize,
      backgroundBlendMode: blendMode,
    };

    if (maskType === 'inside-out') {
      const mask = `radial-gradient(circle, black 0%, transparent ${maskSpread}%)`;
      style.maskImage = mask;
      style.webkitMaskImage = mask;
    } else if (maskType === 'outside-in') {
      const mask = `radial-gradient(circle, transparent 0%, black ${maskSpread}%)`;
      style.maskImage = mask;
      style.webkitMaskImage = mask;
    }

    return style;
  }, [type, bgColor, patternColor, opacity, size, strokeWidth, blendMode, maskType, maskSpread]);

  const cssString = useMemo(() => {
    let base = `background-color: ${bgColor};\nbackground-image: ${patternStyle.backgroundImage};\nbackground-size: ${patternStyle.backgroundSize};\nbackground-blend-mode: ${blendMode};`;
    
    if (maskType !== 'none') {
      const maskVal = maskType === 'inside-out' 
        ? `radial-gradient(circle, black 0%, transparent ${maskSpread}%)`
        : `radial-gradient(circle, transparent 0%, black ${maskSpread}%)`;
      base += `\n-webkit-mask-image: ${maskVal};\nmask-image: ${maskVal};`;
    }
    
    return base;
  }, [bgColor, patternStyle, blendMode, maskType, maskSpread]);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Controls Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 pb-10">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-6">
            <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block border-b border-[var(--border)] pb-2">Pattern Geometry</span>
            
            <div className="grid grid-cols-2 gap-1">
              {[
                { id: 'polka', label: 'Polka Dots' },
                { id: 'lines-h', label: 'Horiz. Lines' },
                { id: 'lines-v', label: 'Vert. Lines' },
                { id: 'grid', label: 'Square Grid' },
                { id: 'diagonal', label: 'Diagonals' },
                { id: 'triangles', label: 'Triangles' },
                { id: 'zigzag', label: 'Zig Zag' },
                { id: 'checkerboard', label: 'Checkerboard' },
                { id: 'concentric-circles', label: 'Conc. Circles' },
                { id: 'concentric-rects', label: 'Conc. Rects' },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setType(p.id as PatternType)}
                  className={`py-2 px-3 text-[10px] text-left uppercase font-bold tracking-tight border transition-all ${type === p.id ? 'bg-white text-black border-white' : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border)]'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-[var(--border)] space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] uppercase text-[var(--text-muted)] mb-2 block tracking-widest">Base Color</label>
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 bg-transparent border border-[var(--border)] p-1 cursor-pointer" />
                </div>
                <div>
                  <label className="text-[9px] uppercase text-[var(--text-muted)] mb-2 block tracking-widest">Pattern Color</label>
                  <input type="color" value={patternColor} onChange={(e) => setPatternColor(e.target.value)} className="w-full h-10 bg-transparent border border-[var(--border)] p-1 cursor-pointer" />
                </div>
              </div>

              <div>
                <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 flex justify-between tracking-widest">Tile Size <span>{size}px</span></label>
                <input type="range" min="10" max="200" value={size} onChange={(e) => setSize(parseInt(e.target.value))} className="w-full h-1 bg-[var(--bg-hover)] appearance-none accent-white cursor-pointer" />
              </div>

              <div>
                <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 flex justify-between tracking-widest">Stroke / Weight <span>{strokeWidth}px</span></label>
                <input type="range" min="1" max="50" value={strokeWidth} onChange={(e) => setStrokeWidth(parseInt(e.target.value))} className="w-full h-1 bg-[var(--bg-hover)] appearance-none accent-white cursor-pointer" />
              </div>

              <div>
                <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 flex justify-between tracking-widest">Pattern Opacity <span>{Math.round(opacity * 100)}%</span></label>
                <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} className="w-full h-1 bg-[var(--bg-hover)] appearance-none accent-white cursor-pointer" />
              </div>

              <div>
                <label className="text-[10px] uppercase text-[var(--text-muted)] mb-2 block tracking-widest">Blend Mode</label>
                <select 
                  value={blendMode} 
                  onChange={(e) => setBlendMode(e.target.value as BlendMode)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-2 text-[10px] text-[var(--text-muted)] uppercase outline-none"
                >
                  {['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'saturation', 'luminosity'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Masking Controls */}
            <div className="pt-4 border-t border-[var(--border)] space-y-6">
              <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block mb-2">Masking Effects</span>
              
              <div className="flex gap-1 p-1 bg-[var(--bg-input)] border border-[var(--border)]">
                {(['none', 'inside-out', 'outside-in'] as MaskType[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setMaskType(m)}
                    className={`flex-1 py-1.5 text-[9px] uppercase font-bold tracking-tighter transition-all ${maskType === m ? 'bg-[var(--bg-hover)] text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-muted)]'}`}
                  >
                    {m.replace('-', ' ')}
                  </button>
                ))}
              </div>

              {maskType !== 'none' && (
                <div>
                  <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 flex justify-between tracking-widest">Mask Spread <span>{maskSpread}%</span></label>
                  <input type="range" min="0" max="100" value={maskSpread} onChange={(e) => setMaskSpread(parseInt(e.target.value))} className="w-full h-1 bg-[var(--bg-hover)] appearance-none accent-white cursor-pointer" />
                </div>
              )}
            </div>

            <button 
              onClick={() => {
                setType('polka'); setBgColor('#0a0a0a'); setPatternColor('#ffffff'); setOpacity(0.1); setSize(40); setStrokeWidth(2); setBlendMode('normal'); setMaskType('none'); setMaskSpread(80);
              }}
              className="w-full py-2 text-[10px] uppercase text-[var(--text-muted)] hover:text-red-500 font-bold transition-colors"
            >
              Reset Configuration
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div 
            className={`flex-1 border border-[var(--border)] relative shadow-2xl transition-all duration-300 overflow-hidden ${previewBg === 'dark' ? 'bg-[var(--bg-input)]' : 'bg-white'}`}
          >
            {/* Background Switcher */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] p-1 z-20">
              <button 
                onClick={() => setPreviewBg('dark')} 
                className={`px-3 py-1 text-[9px] uppercase font-bold tracking-widest transition-all ${previewBg === 'dark' ? 'bg-[var(--bg-hover)] text-[var(--text-primary)] border border-[var(--border)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent'}`}
              >
                Dark
              </button>
              <button 
                onClick={() => setPreviewBg('light')} 
                className={`px-3 py-1 text-[9px] uppercase font-bold tracking-widest transition-all ${previewBg === 'light' ? 'bg-neutral-200 text-black border border-white' : 'text-[var(--text-muted)] hover:text-black border border-transparent'}`}
              >
                Light
              </button>
            </div>

            <div 
              className="absolute inset-0 transition-all duration-300"
              style={{ ...patternStyle, backgroundColor: previewBg === 'dark' ? '#000000' : '#ffffff' }}
            />
            <div className="absolute top-4 left-4 bg-[var(--bg-input)]/40 backdrop-blur-md border border-white/5 px-3 py-1.5 text-[9px] uppercase font-bold tracking-widest text-[var(--text-primary)]/50 z-10">
              Live Pattern Preview
            </div>
            {maskType !== 'none' && (
              <div className="absolute bottom-4 left-4 text-[8px] uppercase font-bold text-[var(--text-muted)] tracking-widest z-10">
                Alpha Mask Active: {maskType} ({maskSpread}%)
              </div>
            )}
          </div>
          
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">Pattern CSS Output</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(cssString)}
                  className="px-4 py-1.5 border border-[var(--border)] text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  Copy Style Bundle
                </button>
             </div>
             <code className="block text-[11px] text-[var(--text-muted)] font-mono whitespace-pre-wrap bg-[var(--bg-input)]/50 p-4 border border-[var(--border)] leading-relaxed overflow-x-auto max-h-40 scroll-smooth">
               {cssString}
             </code>
          </div>
        </div>
      </div>
    </div>
  );
};
