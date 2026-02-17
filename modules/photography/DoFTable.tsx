
import React, { useState } from 'react';

const APERTURES = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];
const DISTANCES = [0.5, 1, 1.5, 2, 3, 5, 10, 20];

export const DoFTable: React.FC = () => {
  const [focalLength, setFocalLength] = useState(35);
  const [coc, setCoc] = useState(0.03);

  const calcDoF = (f: number, a: number, d: number) => {
    const s = d * 1000;
    const c = coc;
    const hyperfocal = (f * f) / (a * c) + f;
    const near = (hyperfocal * s) / (hyperfocal + (s - f));
    const far = (hyperfocal * s) / (hyperfocal - (s - f));
    if (far <= 0) return '∞';
    return ((far - near) / 1000).toFixed(2) + 'm';
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex gap-8">
           <div className="space-y-2">
              <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block">Focal Length: {focalLength}mm</label>
              <input type="range" min="14" max="200" value={focalLength} onChange={(e) => setFocalLength(parseInt(e.target.value))} className="w-48 h-1 bg-[var(--bg-card)] appearance-none accent-white cursor-pointer" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block">Circle of Confusion</label>
              <select value={coc} onChange={(e) => setCoc(parseFloat(e.target.value))} className="bg-[var(--bg-input)] border border-[var(--border)] p-1 text-[10px] text-[var(--text-muted)] outline-none">
                 <option value="0.03">0.030mm (FF)</option>
                 <option value="0.02">0.020mm (APS-C)</option>
              </select>
           </div>
        </div>
        <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-[0.2em] italic">Reference Grid System</div>
      </div>

      <div className="flex-1 bg-[var(--bg-page)] border border-[var(--border)] overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[var(--bg-card)]">
              <th className="p-4 border border-[var(--border)] text-[10px] uppercase text-[var(--text-muted)] font-bold">Dist \ Apt</th>
              {APERTURES.map(a => <th key={a} className="p-4 border border-[var(--border)] text-[10px] text-[var(--text-primary)] font-bold font-mono">f/{a}</th>)}
            </tr>
          </thead>
          <tbody>
            {DISTANCES.map(d => (
              <tr key={d} className="group">
                <td className="p-4 border border-[var(--border)] text-[10px] font-bold text-[var(--text-muted)] bg-[var(--bg-card)]/50">{d}m</td>
                {APERTURES.map(a => (
                  <td key={a} className="p-4 border border-[var(--border)] text-center text-[11px] font-mono text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                    {calcDoF(focalLength, a, d)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
