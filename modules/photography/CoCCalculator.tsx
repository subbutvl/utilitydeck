
import React, { useState, useMemo } from 'react';

export const CoCCalculator: React.FC = () => {
  const [diagonal, setDiagonal] = useState(43.3); // mm, Full Frame
  const [viewingDist, setViewingDist] = useState(25); // cm
  const [printSize, setPrintSize] = useState(25); // cm

  const results = useMemo(() => {
    // Zeis Formula: D / 1500
    const standardCoC = diagonal / 1500;
    // Strict Formula: D / 1730
    const strictCoC = diagonal / 1730;

    return { standard: standardCoC, strict: strictCoC };
  }, [diagonal]);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-4 bg-[var(--bg-card)] border border-[var(--border)] p-8 space-y-6">
           <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block border-b border-[var(--border)] pb-2">Dimensions</span>
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block">Sensor Diagonal (mm)</label>
                 <input type="number" value={diagonal} onChange={(e) => setDiagonal(parseFloat(e.target.value) || 0)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-3 text-sm text-[var(--text-primary)] focus:border-[var(--border-hover)] outline-none" />
                 <div className="flex flex-wrap gap-2 mt-2">
                    {[
                      { l: 'FF', v: 43.3 }, { l: 'APS-C', v: 28.4 }, { l: 'MFT', v: 21.6 }, { l: '1"', v: 15.9 }
                    ].map(p => (
                      <button key={p.l} onClick={() => setDiagonal(p.v)} className="px-2 py-1 border border-[var(--border)] text-[8px] uppercase font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">{p.l}</button>
                    ))}
                 </div>
              </div>
           </div>
           <button onClick={() => setDiagonal(43.3)} className="w-full py-2 text-[10px] uppercase text-[var(--text-muted)] hover:text-red-500 font-bold transition-colors">Reset Values</button>
        </div>

        <div className="lg:col-span-8 bg-[var(--bg-page)] border border-[var(--border)] p-12 flex flex-col justify-center items-center gap-12 text-center">
           <div className="space-y-4">
              <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-[0.4em]">Zeiss Standard CoC</div>
              <div className="text-7xl font-mono text-[var(--text-primary)]">{results.standard.toFixed(4)}<span className="text-xl">mm</span></div>
              <p className="text-[9px] text-[var(--text-muted)] uppercase italic">Used in most DOF calculators (D/1500)</p>
           </div>
           
           <div className="w-32 h-px bg-[var(--bg-card)]" />
           
           <div className="space-y-4">
              <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-[0.4em]">Strict Criterion</div>
              <div className="text-7xl font-mono text-[var(--text-muted)]">{results.strict.toFixed(4)}<span className="text-xl">mm</span></div>
              <p className="text-[9px] text-[var(--text-muted)] uppercase italic">Higher precision for 4K+ displays (D/1730)</p>
           </div>
        </div>
      </div>
    </div>
  );
};
