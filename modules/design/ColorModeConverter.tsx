
import React, { useState, useMemo } from 'react';

// Color conversion math helpers
const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;
  return { r, g, b };
};

const rgbToXyzD65 = (r: number, g: number, b: number) => {
  let [rv, gv, bv] = [r / 255, g / 255, b / 255].map(v => 
    v > 0.04045 ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92
  );
  return {
    x: (rv * 0.4124564 + gv * 0.3575761 + bv * 0.1804375) * 100,
    y: (rv * 0.2126729 + gv * 0.7151522 + bv * 0.0721750) * 100,
    z: (rv * 0.0193339 + gv * 0.1191920 + bv * 0.9503041) * 100
  };
};

const xyzToLab = (x: number, y: number, z: number) => {
  // Illuminant D65
  const Xn = 95.047, Yn = 100.0, Zn = 108.883;
  const [xf, yf, zf] = [x / Xn, y / Yn, z / Zn].map(v => 
    v > 0.008856 ? Math.pow(v, 1/3) : (7.787 * v) + (16 / 116)
  );
  return {
    l: (116 * yf) - 16,
    a: 500 * (xf - yf),
    b: 200 * (yf - zf)
  };
};

const labToLch = (l: number, a: number, b: number) => ({
  l,
  c: Math.sqrt(a * a + b * b),
  h: (Math.atan2(b, a) * 180 / Math.PI + 360) % 360
});

const rgbToOklab = (r: number, g: number, b: number) => {
  let [rv, gv, bv] = [r / 255, g / 255, b / 255].map(v => 
    v > 0.04045 ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92
  );
  const l = 0.4122214708 * rv + 0.5363325363 * gv + 0.0514459929 * bv;
  const m = 0.2119034982 * rv + 0.6806995451 * gv + 0.1073969566 * bv;
  const s = 0.0883024619 * rv + 0.2817188501 * gv + 0.6299787005 * bv;
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  return {
    l: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
  };
};

const rgbToHsl = (r: number, g: number, b: number) => {
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
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const rgbToHwb = (r: number, g: number, b: number) => {
  const { h } = rgbToHsl(r, g, b);
  const w = (1 / 255) * Math.min(r, g, b);
  const bk = 1 - (1 / 255) * Math.max(r, g, b);
  return { h, w: Math.round(w * 100), b: Math.round(bk * 100) };
};

export const ColorModeConverter: React.FC = () => {
  const [hex, setHex] = useState('#4FACFE');
  const [alpha, setAlpha] = useState(1);

  const conversions = useMemo(() => {
    const rgb = hexToRgb(hex);
    const xyz65 = rgbToXyzD65(rgb.r, rgb.g, rgb.b);
    const lab = xyzToLab(xyz65.x, xyz65.y, xyz65.z);
    const lch = labToLch(lab.l, lab.a, lab.b);
    const oklab = rgbToOklab(rgb.r, rgb.g, rgb.b);
    const oklch = { l: oklab.l, c: Math.sqrt(oklab.a ** 2 + oklab.b ** 2), h: (Math.atan2(oklab.b, oklab.a) * 180 / Math.PI + 360) % 360 };
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const hwb = rgbToHwb(rgb.r, rgb.g, rgb.b);

    const aStr = alpha === 1 ? '' : ` / ${alpha}`;
    const aComma = alpha === 1 ? '' : `, ${alpha}`;

    return [
      { id: 'hex', label: 'HEX', value: hex.toUpperCase() + (alpha < 1 ? Math.round(alpha * 255).toString(16).padStart(2, '0').toUpperCase() : '') },
      { id: 'rgb', label: 'RGB', value: `rgb(${rgb.r} ${rgb.g} ${rgb.b}${aStr})` },
      { id: 'hsl', label: 'HSL', value: `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%${aStr})` },
      { id: 'hwb', label: 'HWB', value: `hwb(${hwb.h} ${hwb.w}% ${hwb.b}%${aStr})` },
      { id: 'lab', label: 'LAB', value: `lab(${lab.l.toFixed(2)} ${lab.a.toFixed(2)} ${lab.b.toFixed(2)}${aStr})` },
      { id: 'lch', label: 'LCH', value: `lch(${lch.l.toFixed(2)} ${lch.c.toFixed(2)} ${lch.h.toFixed(2)}${aStr})` },
      { id: 'oklab', label: 'OKLAB', value: `oklab(${oklab.l.toFixed(4)} ${oklab.a.toFixed(4)} ${oklab.b.toFixed(4)}${aStr})` },
      { id: 'oklch', label: 'OKLCH', value: `oklch(${oklch.l.toFixed(4)} ${oklch.c.toFixed(4)} ${oklch.h.toFixed(2)}${aStr})` },
      { id: 'xyz65', label: 'XYZ-D65', value: `color(xyz-d65 ${(xyz65.x/100).toFixed(4)} ${(xyz65.y/100).toFixed(4)} ${(xyz65.z/100).toFixed(4)}${aStr})` },
      { id: 'p3', label: 'Display-P3', value: `color(display-p3 ${(rgb.r/255).toFixed(4)} ${(rgb.g/255).toFixed(4)} ${(rgb.b/255).toFixed(4)}${aStr})` },
    ];
  }, [hex, alpha]);

  const definitions = [
    { name: 'HEX/RGB', desc: 'The industry standard based on the sRGB color space. Digital screens primary format.' },
    { name: 'HSL', desc: 'Hue, Saturation, Lightness. Intuitive for humans to adjust brightness and color intensity.' },
    { name: 'HWB', desc: 'Hue, Whiteness, Blackness. Similar to how humans mix paint; adding white or black to a pure hue.' },
    { name: 'LAB', desc: 'Perceptually uniform color space. L is lightness, A/B are color opponents. Covers all perceivable colors.' },
    { name: 'LCH', desc: 'The cylindrical version of LAB. Easier to understand hue (angles) while maintaining perceptual uniformity.' },
    { name: 'OKLAB/LCH', desc: 'A modern fix for LAB. Smoother gradients and more accurate blue-to-purple transitions without hue shifts.' },
    { name: 'Display-P3', desc: 'A wide-gamut color space used in modern Apple displays. Offers ~25% more color than sRGB.' },
    { name: 'XYZ', desc: 'The mathematical foundation of all color science. Represents the response of human eye receptors.' }
  ];

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0 overflow-hidden">
        {/* Left: Inputs */}
        <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto pr-2">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-8 space-y-8">
            <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block border-b border-[var(--border)] pb-2">Configuration</span>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase text-[var(--text-muted)] mb-3 block tracking-widest">Base Color</label>
                <div className="flex gap-4 items-center">
                  <input 
                    type="color" value={hex} onChange={(e) => setHex(e.target.value.toUpperCase())}
                    className="w-16 h-16 bg-transparent border-none p-0 cursor-pointer"
                  />
                  <div className="flex-1 space-y-2">
                    <input 
                      type="text" value={hex} onChange={(e) => setHex(e.target.value.toUpperCase())}
                      className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-3 text-sm font-mono text-[var(--text-primary)] focus:border-[var(--border-hover)] uppercase"
                    />
                    <div className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-widest">Enter Hex (e.g. #FFFFFF)</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase text-[var(--text-muted)] mb-3 block tracking-widest flex justify-between">Alpha Channel <span>{Math.round(alpha * 100)}%</span></label>
                <input 
                  type="range" min="0" max="1" step="0.01" value={alpha}
                  onChange={(e) => setAlpha(parseFloat(e.target.value))}
                  className="w-full h-1 bg-[var(--bg-hover)] appearance-none accent-white cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border)] flex flex-col items-center gap-4">
              <div 
                className="w-full h-24 border border-white/10 shadow-2xl relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"
              >
                <div 
                   className="absolute inset-0"
                   style={{ backgroundColor: `rgba(${hexToRgb(hex).r}, ${hexToRgb(hex).g}, ${hexToRgb(hex).b}, ${alpha})` }}
                />
              </div>
              <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">Live Preview</span>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-4">
            <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block border-b border-[var(--border)] pb-2">Glossary</span>
            <div className="grid grid-cols-1 gap-4">
              {definitions.map(d => (
                <div key={d.name}>
                  <div className="text-[10px] font-bold text-[var(--text-muted)] mb-1">{d.name}</div>
                  <div className="text-xs text-[var(--text-muted)] leading-relaxed">{d.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-7 flex flex-col gap-4 overflow-y-auto pr-1 pb-10">
          <div className="grid grid-cols-1 gap-3">
            {conversions.map(m => (
              <div key={m.id} className="bg-[var(--bg-card)] border border-[var(--border)] p-5 group hover:border-[var(--border-hover)] transition-all flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest mb-1">{m.label}</div>
                  <code className="text-xs text-[var(--text-primary)] font-mono break-all">{m.value}</code>
                </div>
                <button 
                  onClick={() => navigator.clipboard.writeText(m.value)}
                  className="px-4 py-2 border border-[var(--border)] text-[9px] uppercase font-bold tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all shrink-0"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 text-[10px] text-[var(--text-muted)] uppercase tracking-widest leading-relaxed mt-4 italic">
            * Most modern formats like OKLCH are supported in Evergreen browsers (Chrome 111+, Safari 16.4+, Firefox 113+).
          </div>
        </div>
      </div>
    </div>
  );
};
