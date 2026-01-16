
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
        <div className="lg:col-span-4 bg-[#111] border border-neutral-800 p-8 space-y-6">
           <span className="text-[10px] uppercase text-neutral-500 font-bold tracking-widest block border-b border-neutral-800 pb-2">Dimensions</span>
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] uppercase text-neutral-600 font-bold tracking-widest block">Sensor Diagonal (mm)</label>
                 <input type="number" value={diagonal} onChange={(e) => setDiagonal(parseFloat(e.target.value) || 0)} className="w-full bg-black border border-neutral-800 p-3 text-sm text-white focus:border-neutral-600 outline-none" />
                 <div className="flex flex-wrap gap-2 mt-2">
                    {[
                      { l: 'FF', v: 43.3 }, { l: 'APS-C', v: 28.4 }, { l: 'MFT', v: 21.6 }, { l: '1"', v: 15.9 }
                    ].map(p => (
                      <button key={p.l} onClick={() => setDiagonal(p.v)} className="px-2 py-1 border border-neutral-900 text-[8px] uppercase font-bold text-neutral-700 hover:text-white transition-colors">{p.l}</button>
                    ))}
                 </div>
              </div>
           </div>
           <button onClick={() => setDiagonal(43.3)} className="w-full py-2 text-[10px] uppercase text-neutral-700 hover:text-red-500 font-bold transition-colors">Reset Values</button>
        </div>

        <div className="lg:col-span-8 bg-[#0a0a0a] border border-neutral-800 p-12 flex flex-col justify-center items-center gap-12 text-center">
           <div className="space-y-4">
              <div className="text-[10px] uppercase font-bold text-neutral-600 tracking-[0.4em]">Zeiss Standard CoC</div>
              <div className="text-7xl font-mono text-white">{results.standard.toFixed(4)}<span className="text-xl">mm</span></div>
              <p className="text-[9px] text-neutral-700 uppercase italic">Used in most DOF calculators (D/1500)</p>
           </div>
           
           <div className="w-32 h-px bg-neutral-900" />
           
           <div className="space-y-4">
              <div className="text-[10px] uppercase font-bold text-neutral-600 tracking-[0.4em]">Strict Criterion</div>
              <div className="text-7xl font-mono text-neutral-400">{results.strict.toFixed(4)}<span className="text-xl">mm</span></div>
              <p className="text-[9px] text-neutral-700 uppercase italic">Higher precision for 4K+ displays (D/1730)</p>
           </div>
        </div>
      </div>
    </div>
  );
};
