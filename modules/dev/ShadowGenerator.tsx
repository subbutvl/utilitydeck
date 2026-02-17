
import React, { useState } from 'react';

interface Shadow {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string; // HEX format
  opacity: number; // 0 to 1
  inset: boolean;
}

export const ShadowGenerator: React.FC = () => {
  const [shadows, setShadows] = useState<Shadow[]>([
    { x: 10, y: 10, blur: 20, spread: 0, color: '#000000', opacity: 0.5, inset: false }
  ]);
  
  // Box properties
  const [borderRadius, setBorderRadius] = useState(0);
  const [boxColor, setBoxColor] = useState('#ffffff');
  
  // Preview canvas properties
  const [previewBg, setPreviewBg] = useState<'dark' | 'light'>('dark');

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const shadowCss = shadows
    .map(s => `${s.inset ? 'inset ' : ''}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${hexToRgba(s.color, s.opacity)}`)
    .join(', ');

  const cssString = `box-shadow: ${shadowCss};\nborder-radius: ${borderRadius}px;\nbackground-color: ${boxColor};`;

  const addShadow = () => {
    setShadows([...shadows, { x: 5, y: 5, blur: 10, spread: 0, color: '#000000', opacity: 0.2, inset: false }]);
  };

  const removeShadow = (index: number) => {
    if (shadows.length > 1) {
      setShadows(shadows.filter((_, i) => i !== index));
    }
  };

  const updateShadow = (index: number, key: keyof Shadow, value: any) => {
    const newShadows = [...shadows];
    newShadows[index] = { ...newShadows[index], [key]: value };
    setShadows(newShadows);
  };

  const applyPreset = (type: string) => {
    switch (type) {
      case 'soft':
        setShadows([{ x: 0, y: 10, blur: 25, spread: -5, color: '#000000', opacity: 0.3, inset: false }]);
        break;
      case 'sharp':
        setShadows([{ x: 5, y: 5, blur: 0, spread: 0, color: '#000000', opacity: 1, inset: false }]);
        break;
      case 'neumorphic':
        setShadows([
          { x: 10, y: 10, blur: 20, spread: 0, color: '#000000', opacity: 0.2, inset: false },
          { x: -10, y: -10, blur: 20, spread: 0, color: '#ffffff', opacity: 0.05, inset: false }
        ]);
        break;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssString);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto pr-2">
          {/* Top Controls / Presets */}
          <div className="flex gap-2 mb-2">
            <button onClick={() => applyPreset('soft')} className="flex-1 py-1.5 border border-[var(--border)] text-[10px] uppercase font-bold tracking-widest hover:bg-[var(--bg-hover)] transition-colors">Soft</button>
            <button onClick={() => applyPreset('sharp')} className="flex-1 py-1.5 border border-[var(--border)] text-[10px] uppercase font-bold tracking-widest hover:bg-[var(--bg-hover)] transition-colors">Sharp</button>
            <button onClick={() => applyPreset('neumorphic')} className="flex-1 py-1.5 border border-[var(--border)] text-[10px] uppercase font-bold tracking-widest hover:bg-[var(--bg-hover)] transition-colors">Neumorphic</button>
          </div>

          {/* Box Properties Section */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-4 space-y-4">
            <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block mb-2 border-b border-[var(--border)] pb-2">Box Properties</span>
            <div className="grid grid-cols-2 gap-4">
              <Control 
                label="Border Radius" 
                value={borderRadius} 
                min={0} 
                max={100} 
                onChange={setBorderRadius} 
              />
              <div>
                <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 block">Box Color</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={boxColor} 
                    onChange={(e) => setBoxColor(e.target.value)} 
                    className="w-10 h-8 bg-[var(--bg-input)] border border-[var(--border)] p-1 cursor-pointer"
                  />
                  <input 
                    type="text" 
                    value={boxColor.toUpperCase()} 
                    onChange={(e) => setBoxColor(e.target.value)}
                    className="flex-1 bg-[var(--bg-input)] border border-[var(--border)] p-2 text-[10px] text-[var(--text-muted)] outline-none uppercase font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Shadow Layers */}
          {shadows.map((s, idx) => (
            <div key={idx} className="bg-[var(--bg-card)] border border-[var(--border)] p-4 space-y-4 relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">Shadow Layer #{idx + 1}</span>
                <button onClick={() => removeShadow(idx)} className="text-[var(--text-muted)] hover:text-red-500 text-[10px]">Remove</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Control label="X Offset" value={s.x} min={-100} max={100} onChange={(v) => updateShadow(idx, 'x', v)} />
                <Control label="Y Offset" value={s.y} min={-100} max={100} onChange={(v) => updateShadow(idx, 'y', v)} />
                <Control label="Blur" value={s.blur} min={0} max={100} onChange={(v) => updateShadow(idx, 'blur', v)} />
                <Control label="Spread" value={s.spread} min={-50} max={50} onChange={(v) => updateShadow(idx, 'spread', v)} />
              </div>
              <div className="grid grid-cols-2 gap-4 items-end">
                <div>
                  <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 block">Color (HEX)</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={s.color} 
                      onChange={(e) => updateShadow(idx, 'color', e.target.value)} 
                      className="w-10 h-8 bg-[var(--bg-input)] border border-[var(--border)] p-1 cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={s.color.toUpperCase()} 
                      onChange={(e) => updateShadow(idx, 'color', e.target.value)}
                      className="flex-1 bg-[var(--bg-input)] border border-[var(--border)] p-2 text-[10px] text-[var(--text-muted)] outline-none uppercase font-mono"
                    />
                  </div>
                </div>
                <div>
                  <Control 
                    label="Opacity" 
                    value={Math.round(s.opacity * 100)} 
                    min={0} 
                    max={100} 
                    onChange={(v) => updateShadow(idx, 'opacity', v / 100)} 
                    unit="%"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={s.inset} onChange={(e) => updateShadow(idx, 'inset', e.target.checked)} className="accent-white" />
                  <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold">Inset Shadow</span>
                </label>
              </div>
            </div>
          ))}
          
          <button onClick={addShadow} className="w-full py-3 border border-dashed border-[var(--border)] text-[10px] uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">+ Add Shadow Layer</button>
        </div>

        {/* Preview and Output */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className={`flex-1 border border-[var(--border)] flex items-center justify-center p-20 relative overflow-hidden transition-colors duration-300 ${previewBg === 'dark' ? 'bg-[var(--bg-page)]' : 'bg-[#f5f5f5]'}`}>
            {/* Background Toggle */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] p-1">
              <button 
                onClick={() => setPreviewBg('dark')} 
                className={`px-3 py-1 text-[9px] uppercase font-bold tracking-widest transition-all ${previewBg === 'dark' ? 'bg-white text-black' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
              >
                Dark
              </button>
              <button 
                onClick={() => setPreviewBg('light')} 
                className={`px-3 py-1 text-[9px] uppercase font-bold tracking-widest transition-all ${previewBg === 'light' ? 'bg-[var(--bg-input)] text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-black'}`}
              >
                Light
              </button>
            </div>
            
            <div 
              className="w-48 h-48 transition-all duration-300" 
              style={{ 
                boxShadow: shadowCss, 
                borderRadius: `${borderRadius}px`, 
                backgroundColor: boxColor 
              }}
            ></div>
            <div className="absolute top-4 left-4 text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold italic">Preview Canvas</div>
          </div>
          
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 relative">
             <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">Generated CSS</span>
                <button onClick={copyToClipboard} className="text-[10px] uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold transition-colors">Copy All CSS</button>
             </div>
             <code className="block text-xs text-[var(--text-muted)] font-mono whitespace-pre break-all leading-relaxed bg-[var(--bg-input)]/50 p-4 border border-[var(--border)]">
               {cssString}
             </code>
          </div>
        </div>
      </div>
    </div>
  );
};

const Control = ({ label, value, min, max, onChange, unit = 'px' }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; unit?: string }) => (
  <div className="w-full">
    <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 flex justify-between">
      {label} <span>{value}{unit}</span>
    </label>
    <input 
      type="range" min={min} max={max} value={value} 
      onChange={(e) => onChange(parseInt(e.target.value))} 
      className="w-full h-1 bg-[var(--bg-hover)] appearance-none accent-white cursor-pointer"
    />
  </div>
);
