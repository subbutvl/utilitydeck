
import React, { useState, useMemo } from 'react';

export const ContrastChecker: React.FC = () => {
  const [fg, setFg] = useState('#FFFFFF');
  const [bg, setBg] = useState('#111111');

  const getLuminance = (hex: string) => {
    const rgb = hex.replace(/^#/, '').match(/.{2}/g)?.map(x => parseInt(x, 16) / 255) || [0, 0, 0];
    const res = rgb.map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return 0.2126 * res[0] + 0.7152 * res[1] + 0.0722 * res[2];
  };

  const ratio = useMemo(() => {
    const lum1 = getLuminance(fg);
    const lum2 = getLuminance(bg);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }, [fg, bg]);

  const score = (r: number) => {
    return {
      aaNormal: r >= 4.5,
      aaaNormal: r >= 7,
      aaLarge: r >= 3,
      aaaLarge: r >= 4.5
    };
  };

  const results = score(ratio);

  const swapColors = () => {
    setFg(bg);
    setBg(fg);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-6">
            <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block border-b border-[var(--border)] pb-2">Contrast Config</span>
            
            <div className="space-y-4">
              <ColorInput label="Foreground" value={fg} onChange={setFg} />
              <div className="flex justify-center">
                <button 
                  onClick={swapColors}
                  className="p-2 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>
                </button>
              </div>
              <ColorInput label="Background" value={bg} onChange={setBg} />
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-6">
             <div className="text-center py-4">
                <div className="text-4xl font-light text-[var(--text-primary)] mb-2">{ratio.toFixed(2)}:1</div>
                <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold">Contrast Ratio</div>
             </div>

             <div className="space-y-3">
                <ResultRow label="AA Normal Text" pass={results.aaNormal} req="4.5:1" />
                <ResultRow label="AAA Normal Text" pass={results.aaaNormal} req="7.0:1" />
                <ResultRow label="AA Large Text" pass={results.aaLarge} req="3.0:1" />
                <ResultRow label="AAA Large Text" pass={results.aaaLarge} req="4.5:1" />
             </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div 
            className="flex-1 border border-[var(--border)] p-12 flex flex-col gap-10 overflow-auto"
            style={{ backgroundColor: bg }}
          >
            <div className="space-y-4">
              <h2 className="text-5xl font-bold" style={{ color: fg }}>Testing Main Headlines</h2>
              <p className="text-lg leading-relaxed" style={{ color: fg }}>
                The quick brown fox jumps over the lazy dog. Designers use this text to verify the readability 
                of their color choices against various backgrounds. Proper contrast ensures that content is 
                accessible to everyone, including those with visual impairments.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 border border-white/5 flex items-center justify-center font-bold uppercase tracking-widest text-xs" style={{ backgroundColor: fg, color: bg }}>
                Inverted UI Sample
              </div>
              <div className="p-6 border border-white/5 flex items-center justify-center font-bold uppercase tracking-widest text-xs" style={{ color: fg, border: `1px solid ${fg}` }}>
                Outline Button
              </div>
            </div>

            <div className="mt-auto">
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-50" style={{ color: fg }}>Preview Canvas (Live Rendering)</span>
            </div>
          </div>

          <div className="p-4 bg-[var(--bg-card)] border border-[var(--border)] text-[10px] text-[var(--text-muted)] uppercase tracking-widest text-center italic">
            WCAG 2.1 accessibility guidelines recommend a minimum contrast ratio of 4.5:1 for normal text.
          </div>
        </div>
      </div>
    </div>
  );
};

const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div>
    <label className="text-[9px] uppercase text-[var(--text-muted)] mb-2 block tracking-widest">{label}</label>
    <div className="flex gap-2">
      <input 
        type="color" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 bg-transparent border-none p-0 cursor-pointer"
      />
      <input 
        type="text" value={value.toUpperCase()} onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-[var(--bg-input)] border border-[var(--border)] px-3 text-xs font-mono text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-hover)]"
      />
    </div>
  </div>
);

const ResultRow = ({ label, pass, req }: { label: string; pass: boolean; req: string }) => (
  <div className="flex items-center justify-between py-2 border-b border-[var(--border)]/50">
    <div className="flex flex-col">
      <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-tight">{label}</span>
      <span className="text-[8px] text-[var(--text-muted)]">Req: {req}</span>
    </div>
    <div className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border ${pass ? 'border-green-500/30 text-green-500 bg-green-500/5' : 'border-red-500/30 text-red-500 bg-red-500/5'}`}>
      {pass ? 'Pass' : 'Fail'}
    </div>
  </div>
);
