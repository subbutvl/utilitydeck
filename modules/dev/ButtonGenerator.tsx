
import React, { useState } from 'react';

type ButtonMode = 'solid' | 'gradient' | 'outline' | 'ghost';

interface GradientState {
  from: string;
  to: string;
  angle: number;
}

export const ButtonGenerator: React.FC = () => {
  const [text, setText] = useState('ACTION BUTTON');
  const [mode, setMode] = useState<ButtonMode>('solid');
  const [bg, setBg] = useState('#ffffff');
  const [color, setColor] = useState('#000000');
  const [px, setPx] = useState(24);
  const [py, setPy] = useState(12);
  const [borderWidth, setBorderWidth] = useState(1);
  const [borderColor, setBorderColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(12);
  const [tracking, setTracking] = useState(0.2);
  const [borderRadius, setBorderRadius] = useState(0);
  
  const [gradient, setGradient] = useState<GradientState>({
    from: '#00f2fe',
    to: '#4facfe',
    angle: 45
  });

  const [previewBg, setPreviewBg] = useState<'dark' | 'light'>('dark');

  const getButtonStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {
      color: color,
      padding: `${py}px ${px}px`,
      border: `${borderWidth}px solid ${borderColor}`,
      fontSize: `${fontSize}px`,
      letterSpacing: `${tracking}em`,
      fontWeight: 'bold',
      cursor: 'pointer',
      borderRadius: `${borderRadius}px`,
      transition: 'all 0.2s ease',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    };

    if (mode === 'gradient') {
      style.backgroundImage = `linear-gradient(${gradient.angle}deg, ${gradient.from}, ${gradient.to})`;
      style.border = borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : 'none';
    } else if (mode === 'ghost') {
      style.backgroundColor = 'transparent';
      style.border = 'none';
    } else if (mode === 'outline') {
      style.backgroundColor = 'transparent';
    } else {
      style.backgroundColor = bg;
    }

    return style;
  };

  const getCssString = () => {
    let backgroundRule = '';
    if (mode === 'gradient') {
      backgroundRule = `background: linear-gradient(${gradient.angle}deg, ${gradient.from}, ${gradient.to});`;
    } else if (mode === 'ghost' || mode === 'outline') {
      backgroundRule = `background: transparent;`;
    } else {
      backgroundRule = `background-color: ${bg};`;
    }

    return `button {\n  ${backgroundRule}\n  color: ${color};\n  padding: ${py}px ${px}px;\n  border: ${borderWidth}px solid ${borderColor};\n  border-radius: ${borderRadius}px;\n  font-size: ${fontSize}px;\n  letter-spacing: ${tracking}em;\n  font-weight: bold;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}`;
  };

  const applyPreset = (p: string) => {
    switch (p) {
      case 'brutal':
        setMode('solid'); setBg('#ffffff'); setColor('#000000'); setBorderWidth(2); setBorderColor('#000000'); setBorderRadius(0); setFontSize(14);
        break;
      case 'minimal':
        setMode('outline'); setColor('#ffffff'); setBorderWidth(1); setBorderColor('#444444'); setBorderRadius(0); setFontSize(11);
        break;
      case 'neon':
        setMode('gradient'); setGradient({from: '#ff0080', to: '#7928ca', angle: 45}); setColor('#ffffff'); setBorderWidth(0); setBorderRadius(0);
        break;
      case 'glass':
        setMode('solid'); setBg('rgba(255,255,255,0.1)'); setColor('#ffffff'); setBorderWidth(1); setBorderColor('rgba(255,255,255,0.2)'); setBorderRadius(4);
        break;
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-5 space-y-4 overflow-y-auto pr-2 pb-10">
           
           {/* Mode Toggles */}
           <div className="flex border border-[var(--border)] p-1 bg-[var(--bg-card)]">
              {(['solid', 'gradient', 'outline', 'ghost'] as ButtonMode[]).map(m => (
                <button 
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-1.5 text-[10px] uppercase font-bold tracking-widest transition-all ${mode === m ? 'bg-white text-black' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                >
                  {m}
                </button>
              ))}
           </div>

           {/* Presets Row */}
           <div className="grid grid-cols-4 gap-2">
              <button onClick={() => applyPreset('brutal')} className="py-2 border border-[var(--border)] text-[9px] uppercase font-bold hover:bg-[var(--bg-hover)] transition-colors">Brutal</button>
              <button onClick={() => applyPreset('minimal')} className="py-2 border border-[var(--border)] text-[9px] uppercase font-bold hover:bg-[var(--bg-hover)] transition-colors">Minimal</button>
              <button onClick={() => applyPreset('neon')} className="py-2 border border-[var(--border)] text-[9px] uppercase font-bold hover:bg-[var(--bg-hover)] transition-colors">Neon</button>
              <button onClick={() => applyPreset('glass')} className="py-2 border border-[var(--border)] text-[9px] uppercase font-bold hover:bg-[var(--bg-hover)] transition-colors">Glass</button>
           </div>

           <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-6">
              <div>
                <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-2 block tracking-widest">Label</label>
                <input value={text} onChange={(e) => setText(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-3 text-sm text-[var(--text-primary)] focus:border-[var(--border-hover)] outline-none" />
              </div>

              {mode === 'gradient' ? (
                <div className="grid grid-cols-2 gap-4">
                  <ColorControl label="From" value={gradient.from} onChange={(v) => setGradient({...gradient, from: v})} />
                  <ColorControl label="To" value={gradient.to} onChange={(v) => setGradient({...gradient, to: v})} />
                  <div className="col-span-2">
                    <RangeControl label="Angle" value={gradient.angle} min={0} max={360} onChange={(v) => setGradient({...gradient, angle: v})} unit="°" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <ColorControl label="Background" value={bg} onChange={setBg} />
                  <ColorControl label="Text Color" value={color} onChange={setColor} />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <RangeControl label="Padding X" value={px} min={0} max={100} onChange={setPx} />
                <RangeControl label="Padding Y" value={py} min={0} max={100} onChange={setPy} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <RangeControl label="Border Width" value={borderWidth} min={0} max={20} onChange={setBorderWidth} />
                <ColorControl label="Border Color" value={borderColor} onChange={setBorderColor} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <RangeControl label="Radius" value={borderRadius} min={0} max={50} onChange={setBorderRadius} />
                </div>
                <div className="col-span-1">
                  <RangeControl label="Size" value={fontSize} min={8} max={48} onChange={setFontSize} />
                </div>
                <div className="col-span-1">
                  <RangeControl label="Tracking" value={tracking} min={-0.1} max={1} step={0.01} onChange={setTracking} unit="em" />
                </div>
              </div>

              <button 
                onClick={() => {
                  setMode('solid'); setText('ACTION BUTTON'); setBg('#ffffff'); setColor('#000000'); setPx(24); setPy(12); setBorderWidth(1); setBorderColor('#ffffff'); setFontSize(12); setTracking(0.2); setBorderRadius(0);
                }} 
                className="w-full py-2 text-[10px] uppercase text-[var(--text-muted)] hover:text-red-500 font-bold transition-colors"
              >
                Reset Designer
              </button>
           </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className={`flex-1 border border-[var(--border)] flex items-center justify-center p-20 relative transition-colors duration-300 ${previewBg === 'dark' ? 'bg-[var(--bg-page)]' : 'bg-[#f5f5f5]'}`}>
             {/* Background Toggle Switch */}
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
             
             <div className="absolute top-4 left-4 text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold italic">Preview Canvas</div>

             <button style={getButtonStyle()}>{text}</button>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6">
             <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">Button CSS</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(getCssString())} 
                  className="text-[10px] uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  Copy Code
                </button>
             </div>
             <code className="block text-[11px] text-[var(--text-muted)] font-mono whitespace-pre bg-[var(--bg-input)]/50 p-4 border border-[var(--border)] overflow-x-auto">
               {getCssString()}
             </code>
          </div>
        </div>
      </div>
    </div>
  );
};

const ColorControl = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div>
    <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 block">{label}</label>
    <div className="flex gap-2">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-8 h-8 bg-[var(--bg-input)] border border-[var(--border)] p-1 cursor-pointer" />
      <input type="text" value={value.toUpperCase()} onChange={(e) => onChange(e.target.value)} className="flex-1 bg-[var(--bg-input)] border border-[var(--border)] px-2 text-[10px] text-[var(--text-muted)] font-mono outline-none uppercase" />
    </div>
  </div>
);

const RangeControl = ({ label, value, min, max, step = 1, onChange, unit = 'px' }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; unit?: string }) => (
  <div>
    <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 flex justify-between">{label} <span>{value}{unit}</span></label>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full h-1 bg-[var(--bg-hover)] appearance-none accent-white cursor-pointer" />
  </div>
);
