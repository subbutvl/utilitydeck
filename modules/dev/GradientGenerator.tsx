
import React, { useState } from 'react';

interface Stop {
  color: string;
  position: number;
}

type GradientType = 'linear' | 'radial' | 'conic';
type ColorFormat = 'hex' | 'rgba' | 'hsl' | 'oklch';

// Color Conversion Helpers
const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;
  return { r, g, b };
};

const hexToRgba = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, 1)`;
};

const hexToHsl = (hex: string) => {
  let { r, g, b } = hexToRgb(hex);
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;
  if (max === min) h = s = 0;
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

/**
 * Accurate HEX to OKLCH conversion
 * Based on the OKLab color space algorithm by Björn Ottosson
 */
const hexToOklch = (hex: string) => {
  const { r, g, b } = hexToRgb(hex);
  
  // Linearize sRGB
  const lin = (c: number) => c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92;
  const rl = lin(r / 255);
  const gl = lin(g / 255);
  const bl = lin(b / 255);

  // Oklab conversion
  const l_ = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl;
  const m_ = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl;
  const s_ = 0.0883024619 * rl + 0.2817188501 * gl + 0.6299787005 * bl;

  const l = Math.cbrt(l_);
  const m = Math.cbrt(m_);
  const s = Math.cbrt(s_);

  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
  const b_ = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;

  const C = Math.sqrt(a * a + b_ * b_);
  const H = (Math.atan2(b_, a) * 180) / Math.PI;

  return `oklch(${(L * 100).toFixed(2)}% ${C.toFixed(3)} ${((H + 360) % 360).toFixed(2)})`;
};

export const GradientGenerator: React.FC = () => {
  const [type, setType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState(135);
  const [position, setPosition] = useState('center');
  const [colorFormat, setColorFormat] = useState<ColorFormat>('hex');
  const [stops, setStops] = useState<Stop[]>([
    { color: '#111111', position: 0 },
    { color: '#444444', position: 100 }
  ]);

  const convertColor = (hex: string) => {
    switch (colorFormat) {
      case 'rgba': return hexToRgba(hex);
      case 'hsl': return hexToHsl(hex);
      case 'oklch': return hexToOklch(hex);
      default: return hex;
    }
  };

  // String for code output (formatted)
  const stopsString = stops.map(s => `${convertColor(s.color)} ${s.position}%`).join(', ');
  
  // String for visual preview (always HEX for stability)
  const previewStopsString = stops.map(s => `${s.color} ${s.position}%`).join(', ');

  let cssOutput = '';
  let previewCss = '';

  if (type === 'linear') {
    cssOutput = `linear-gradient(${angle}deg, ${stopsString})`;
    previewCss = `linear-gradient(${angle}deg, ${previewStopsString})`;
  } else if (type === 'radial') {
    cssOutput = `radial-gradient(circle at ${position}, ${stopsString})`;
    previewCss = `radial-gradient(circle at ${position}, ${previewStopsString})`;
  } else if (type === 'conic') {
    cssOutput = `conic-gradient(from ${angle}deg at ${position}, ${stopsString})`;
    previewCss = `conic-gradient(from ${angle}deg at ${position}, ${previewStopsString})`;
  }

  const updateStop = (idx: number, key: keyof Stop, value: any) => {
    const newStops = [...stops];
    newStops[idx] = { ...newStops[idx], [key]: value };
    setStops(newStops.sort((a, b) => a.position - b.position));
  };

  const addStop = () => {
    const lastPos = stops[stops.length - 1].position;
    const newPos = Math.min(100, lastPos + 10);
    setStops([...stops, { color: '#ffffff', position: newPos }].sort((a, b) => a.position - b.position));
  };

  const removeStop = (idx: number) => {
    if (stops.length > 2) setStops(stops.filter((_, i) => i !== idx));
  };

  const applyPreset = (preset: Stop[], pType: GradientType = 'linear') => {
    setStops(preset);
    setType(pType);
  };

  const handleDirClick = (dir: string, deg: number) => {
    setPosition(dir);
    setAngle(deg);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-4 space-y-6 overflow-y-auto pr-2 pb-10">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-6">
            
            {/* Type Toggle */}
            <div>
              <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-3 block tracking-widest">Gradient Type</label>
              <div className="flex border border-[var(--border)] p-1 mb-4">
                {(['linear', 'radial', 'conic'] as GradientType[]).map(t => (
                  <button 
                    key={t}
                    onClick={() => setType(t)} 
                    className={`flex-1 py-1.5 text-[10px] uppercase font-bold tracking-widest transition-colors ${type === t ? 'bg-white text-black' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Direction Presets Grid */}
            <div>
              <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-3 block tracking-widest">Direction / Position</label>
              <div className="grid grid-cols-3 gap-1 w-32 mx-auto">
                {[
                  { pos: 'top left', deg: 315, icon: '↖' },
                  { pos: 'top', deg: 0, icon: '↑' },
                  { pos: 'top right', deg: 45, icon: '↗' },
                  { pos: 'left', deg: 270, icon: '←' },
                  { pos: 'center', deg: 0, icon: '•' },
                  { pos: 'right', deg: 90, icon: '→' },
                  { pos: 'bottom left', deg: 225, icon: '↙' },
                  { pos: 'bottom', deg: 180, icon: '↓' },
                  { pos: 'bottom right', deg: 135, icon: '↘' },
                ].map((d, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleDirClick(d.pos, d.deg)}
                    className={`aspect-square border border-[var(--border)] flex items-center justify-center text-lg hover:border-[var(--border-hover)] transition-colors ${position === d.pos ? 'bg-[var(--bg-hover)] text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}
                  >
                    {d.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Angle Slider */}
            {(type === 'linear' || type === 'conic') && (
              <div>
                <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 flex justify-between">Rotation <span>{angle}°</span></label>
                <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(parseInt(e.target.value))} className="w-full h-1 bg-[var(--bg-hover)] appearance-none accent-white cursor-pointer" />
              </div>
            )}

            {/* Stops Management */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">Color Stops</label>
                <button onClick={addStop} className="text-[10px] uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)]">+ Add</button>
              </div>
              <div className="space-y-4">
                {stops.map((s, idx) => (
                  <div key={idx} className="bg-[var(--bg-input)]/40 border border-[var(--border)] p-3 rounded-none">
                    <div className="flex items-center gap-3 mb-2">
                      <input type="color" value={s.color} onChange={(e) => updateStop(idx, 'color', e.target.value)} className="w-8 h-8 bg-transparent cursor-pointer rounded-none border-none p-0" />
                      <input 
                        type="text" 
                        value={s.color} 
                        onChange={(e) => updateStop(idx, 'color', e.target.value)} 
                        className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] px-2 py-1 text-[10px] font-mono uppercase text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-hover)]"
                        placeholder="#FFFFFF"
                      />
                      <button onClick={() => removeStop(idx)} className="text-[var(--text-muted)] hover:text-red-500 text-lg leading-none">×</button>
                    </div>
                    <div className="flex items-center gap-4">
                      <input type="range" min="0" max="100" value={s.position} onChange={(e) => updateStop(idx, 'position', parseInt(e.target.value))} className="flex-1 h-0.5 bg-[var(--bg-hover)] appearance-none accent-white" />
                      <span className="text-[9px] font-mono text-[var(--text-muted)] w-8 text-right">{s.position}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Presets */}
            <div className="pt-6 border-t border-[var(--border)]">
               <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-4 block tracking-widest">Presets</label>
               <div className="grid grid-cols-2 gap-2">
                 <button onClick={() => applyPreset([{color:'#4facfe', position:0}, {color:'#00f2fe', position:100}])} className="h-8 border border-[var(--border)]" style={{background: 'linear-gradient(90deg, #4facfe, #00f2fe)'}}></button>
                 <button onClick={() => applyPreset([{color:'#fa709a', position:0}, {color:'#fee140', position:100}])} className="h-8 border border-[var(--border)]" style={{background: 'linear-gradient(90deg, #fa709a, #fee140)'}}></button>
                 <button onClick={() => applyPreset([{color:'#09203f', position:0}, {color:'#537895', position:100}])} className="h-8 border border-[var(--border)]" style={{background: 'linear-gradient(90deg, #09203f, #537895)'}}></button>
                 <button onClick={() => applyPreset([{color:'#111', position:0}, {color:'#444', position:100}])} className="h-8 border border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-center text-[9px] uppercase font-bold tracking-widest text-[var(--text-muted)]">RESET</button>
               </div>
            </div>
          </div>
        </div>

        {/* Preview and Export */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div 
            className="flex-1 border border-[var(--border)] relative group overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" 
            style={{ background: previewCss }}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-[var(--bg-input)]/40 transition-opacity">
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-[var(--text-primary)]">Gradient Canvas</span>
            </div>
          </div>
          
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  {(['hex', 'rgba', 'hsl', 'oklch'] as ColorFormat[]).map(f => (
                    <button 
                      key={f} 
                      onClick={() => setColorFormat(f)}
                      className={`text-[10px] uppercase font-bold tracking-widest transition-colors ${colorFormat === f ? 'text-[var(--text-primary)] underline underline-offset-4' : 'text-[var(--text-muted)] hover:text-[var(--text-muted)]'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => navigator.clipboard.writeText(`background: ${cssOutput};`)} 
                  className="text-[10px] uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  Copy Code
                </button>
             </div>
             <code className="block text-xs text-[var(--text-muted)] font-mono break-all leading-relaxed bg-[var(--bg-input)]/50 p-4 border border-[var(--border)] max-h-32 overflow-y-auto">
               background: {cssOutput};
             </code>
          </div>
        </div>
      </div>
    </div>
  );
};
