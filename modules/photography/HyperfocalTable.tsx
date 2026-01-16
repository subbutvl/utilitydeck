
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
      <div className="bg-[#111] border border-neutral-800 p-6 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <label className="text-[10px] uppercase text-neutral-600 font-bold tracking-widest">CoC Setting:</label>
            <div className="flex gap-1 border border-neutral-800 p-1">
               {[0.03, 0.02, 0.015].map(c => (
                 <button key={c} onClick={() => setCoc(c)} className={`px-3 py-1 text-[9px] uppercase font-bold tracking-tighter transition-all ${coc === c ? 'bg-neutral-800 text-white' : 'text-neutral-600 hover:text-neutral-400'}`}>{c}mm</button>
               ))}
            </div>
         </div>
         <span className="text-[10px] uppercase text-neutral-700 font-bold tracking-widest">Critical Sharpness Matrix</span>
      </div>

      <div className="flex-1 bg-[#0d0d0d] border border-neutral-800 overflow-auto">
         <table className="w-full border-collapse">
            <thead>
               <tr className="bg-black">
                  <th className="p-4 border border-neutral-800 text-[10px] text-neutral-600 uppercase font-bold">Focal \ Aperture</th>
                  {APERTURES.map(a => <th key={a} className="p-4 border border-neutral-800 text-[10px] font-mono text-white font-bold">f/{a}</th>)}
               </tr>
            </thead>
            <tbody>
               {FOCALS.map(f => (
                  <tr key={f} className="hover:bg-neutral-900 transition-colors">
                     <td className="p-4 border border-neutral-800 text-[10px] font-bold text-neutral-500 bg-black/40">{f}mm</td>
                     {APERTURES.map(a => (
                        <td key={a} className="p-4 border border-neutral-800 text-center font-mono text-[11px] text-neutral-400">
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
