
import React, { useState } from 'react';

const APERTURES = [2.8, 4, 5.6, 8, 11, 16, 22];
const FOCALS = [14, 18, 24, 35, 50, 85, 105, 135];

export const HyperfocalTable: React.FC = () => {
  const [coc, setCoc] = useState(0.03);

  const calcHyperfocal = (f: number, a: number) => {
    const h = (f * f) / (a * coc) + f;
    return (h / 1000).toFixed(2) + 'm';
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">CoC Setting:</label>
            <div className="flex gap-1 border border-[var(--border)] p-1">
               {[0.03, 0.02, 0.015].map(c => (
                 <button key={c} onClick={() => setCoc(c)} className={`px-3 py-1 text-[9px] uppercase font-bold tracking-tighter transition-all ${coc === c ? 'bg-[var(--bg-hover)] text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-muted)]'}`}>{c}mm</button>
               ))}
            </div>
         </div>
         <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">Critical Sharpness Matrix</span>
      </div>

      <div className="flex-1 bg-[#0d0d0d] border border-[var(--border)] overflow-auto">
         <table className="w-full border-collapse">
            <thead>
               <tr className="bg-[var(--bg-input)]">
                  <th className="p-4 border border-[var(--border)] text-[10px] text-[var(--text-muted)] uppercase font-bold">Focal \ Aperture</th>
                  {APERTURES.map(a => <th key={a} className="p-4 border border-[var(--border)] text-[10px] font-mono text-[var(--text-primary)] font-bold">f/{a}</th>)}
               </tr>
            </thead>
            <tbody>
               {FOCALS.map(f => (
                  <tr key={f} className="hover:bg-[var(--bg-card)] transition-colors">
                     <td className="p-4 border border-[var(--border)] text-[10px] font-bold text-[var(--text-muted)] bg-[var(--bg-input)]/40">{f}mm</td>
                     {APERTURES.map(a => (
                        <td key={a} className="p-4 border border-[var(--border)] text-center font-mono text-[11px] text-[var(--text-muted)]">
                           {calcHyperfocal(f, a)}
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
