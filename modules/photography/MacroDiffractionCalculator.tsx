
import React, { useState, useMemo } from 'react';

export const MacroDiffractionCalculator: React.FC = () => {
  const [pixelSize, setPixelSize] = useState(4.5);
  const [magnification, setMagnification] = useState(1);

  const effectiveLimit = useMemo(() => {
    const w = 0.55; // microns (green light)
    const p = pixelSize;
    const m = magnification;
    
    // Standard limit: N = p / (1.22 * w)
    // Macro Effective limit: N_eff = N_nom * (1 + m)
    // We want N_nom where N_eff hits the physics limit.
    const physicsLimit = p / (1.22 * w);
    return physicsLimit / (1 + m);
  }, [pixelSize, magnification]);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-4 bg-[var(--bg-card)] border border-[var(--border)] p-8 space-y-6">
           <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block border-b border-[var(--border)] pb-2">Macro Setup</span>
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest flex justify-between">Pixel Pitch <span>{pixelSize}μm</span></label>
                 <input type="range" min="1" max="12" step="0.1" value={pixelSize} onChange={(e) => setPixelSize(parseFloat(e.target.value))} className="w-full h-1 bg-[var(--bg-card)] appearance-none accent-white cursor-pointer" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest flex justify-between">Magnification <span>{magnification}x</span></label>
                 <input type="range" min="0.1" max="5" step="0.1" value={magnification} onChange={(e) => setMagnification(parseFloat(e.target.value))} className="w-full h-1 bg-[var(--bg-card)] appearance-none accent-white cursor-pointer" />
              </div>
           </div>
        </div>

        <div className="lg:col-span-8 bg-[var(--bg-page)] border border-[var(--border)] p-12 flex flex-col justify-center items-center gap-12 text-center">
           <div className="space-y-4">
              <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-[0.4em]">Effective Diffraction Limit</div>
              <div className="text-[140px] font-mono leading-none text-[var(--text-primary)] tracking-tighter">
                f/{effectiveLimit.toFixed(1)}
              </div>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-[0.2em] max-w-md mx-auto leading-relaxed italic">
                * Nominal aperture displayed. Macro magnification reduces the usable aperture before diffraction artifacts appear.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
