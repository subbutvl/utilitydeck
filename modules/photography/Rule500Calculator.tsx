
import React, { useState, useMemo } from 'react';

export const Rule500Calculator: React.FC = () => {
  const [focalLength, setFocalLength] = useState('24');
  const [cropFactor, setCropFactor] = useState('1.0');

  const maxExposure = useMemo(() => {
    const fl = parseFloat(focalLength) || 0;
    const cf = parseFloat(cropFactor) || 1;
    if (fl <= 0) return 0;
    return 500 / (fl * cf);
  }, [focalLength, cropFactor]);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-4 bg-[var(--bg-card)] border border-[var(--border)] p-8 space-y-6">
          <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block border-b border-[var(--border)] pb-2">Optics</span>
          
          <div className="space-y-6">
             <div className="space-y-2">
                <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest flex justify-between">Focal Length <span>{focalLength}mm</span></label>
                <input type="range" min="8" max="600" value={focalLength} onChange={(e) => setFocalLength(e.target.value)} className="w-full h-1 bg-[var(--bg-card)] appearance-none accent-white cursor-pointer" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">Sensor Crop Factor</label>
                <select value={cropFactor} onChange={(e) => setCropFactor(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-3 text-sm text-[var(--text-primary)] outline-none">
                  <option value="1.0">Full Frame (1.0x)</option>
                  <option value="1.5">APS-C Nikon/Sony (1.5x)</option>
                  <option value="1.6">APS-C Canon (1.6x)</option>
                  <option value="2.0">Micro Four Thirds (2.0x)</option>
                </select>
             </div>
          </div>
          <button onClick={() => { setFocalLength('24'); setCropFactor('1.0'); }} className="w-full py-2 text-[10px] uppercase text-[var(--text-muted)] hover:text-red-500 font-bold transition-colors">Clear Settings</button>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex-1 bg-[var(--bg-page)] border border-[var(--border)] p-12 flex flex-col items-center justify-center relative overflow-hidden group">
             <div className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--text-muted)] italic">Exposure Limit</div>
             
             <div className="text-center space-y-4">
                <div className="text-[120px] font-mono leading-none text-[var(--text-primary)] tracking-tighter">
                   {maxExposure.toFixed(1)}<span className="text-3xl align-top">s</span>
                </div>
                <p className="text-sm text-[var(--text-muted)] uppercase tracking-[0.4em] font-medium">Recommended Shutter Speed</p>
             </div>
             
             <div className="absolute bottom-12 w-full max-w-sm h-1 bg-[var(--bg-card)]">
                <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${Math.min(100, (maxExposure / 60) * 100)}%` }} />
             </div>
          </div>
          
          <div className="bg-[var(--bg-card)]/30 p-4 border border-[var(--border)] text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold text-center">
             The "500 Rule" is a classic formula used by astrophotographers to estimate the maximum exposure time for pinpoint stars without streaks.
          </div>
        </div>
      </div>
    </div>
  );
};
