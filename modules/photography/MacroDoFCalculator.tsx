
import React, { useState, useMemo } from 'react';

export const MacroDoFCalculator: React.FC = () => {
  const [magnification, setMagnification] = useState(1); // 1.0x (1:1)
  const [aperture, setAperture] = useState(8);
  const [coc, setCoc] = useState(0.03);

  const dof = useMemo(() => {
    // Formula: 2 * C * N * (1 + m) / (m^2)
    // where C = coc, N = aperture, m = magnification
    const m = magnification;
    const n = aperture;
    const c = coc;

    const total = (2 * c * n * (1 + (m / 1))) / (m * m);
    return total; // in mm
  }, [magnification, aperture, coc]);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-4 bg-[var(--bg-card)] border border-[var(--border)] p-8 space-y-6">
           <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block border-b border-[var(--border)] pb-2">Macro Settings</span>
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest flex justify-between">Magnification <span>{magnification}x (1:{1/magnification})</span></label>
                 <input type="range" min="0.1" max="10" step="0.1" value={magnification} onChange={(e) => setMagnification(parseFloat(e.target.value))} className="w-full h-1 bg-[var(--bg-card)] appearance-none accent-white cursor-pointer" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest flex justify-between">Aperture <span>f/{aperture}</span></label>
                 <input type="range" min="1.4" max="32" step="0.5" value={aperture} onChange={(e) => setAperture(parseFloat(e.target.value))} className="w-full h-1 bg-[var(--bg-card)] appearance-none accent-white cursor-pointer" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block">Sensor Circle of Confusion</label>
                <select value={coc} onChange={(e) => setCoc(parseFloat(e.target.value))} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-3 text-sm text-[var(--text-primary)] outline-none">
                  <option value="0.03">Full Frame (0.03mm)</option>
                  <option value="0.02">APS-C (0.02mm)</option>
                  <option value="0.015">MFT (0.015mm)</option>
                </select>
             </div>
           </div>
           <button onClick={() => {setMagnification(1); setAperture(8); setCoc(0.03);}} className="w-full py-2 text-[10px] uppercase text-[var(--text-muted)] hover:text-red-500 font-bold">Reset Macro</button>
        </div>

        <div className="lg:col-span-8 flex flex-col justify-center items-center p-12 bg-[var(--bg-page)] border border-[var(--border)]">
           <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-[0.4em] mb-8 italic">Total Macro Depth</div>
           <div className="text-8xl font-mono text-[var(--text-primary)] mb-4">
             {dof.toFixed(3)}<span className="text-2xl">mm</span>
           </div>
           <div className="w-48 h-1 bg-[var(--bg-card)] overflow-hidden mt-8">
              <div className="h-full bg-red-500 animate-pulse" style={{ width: `${Math.min(100, (dof / 5) * 100)}%` }} />
           </div>
           <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold mt-12 max-w-xs text-center leading-relaxed">
             Macro DoF becomes razor thin as magnification increases. Focus stacking is often required above 1.0x.
           </p>
        </div>
      </div>
    </div>
  );
};
