
import React, { useState, useMemo } from 'react';

const UNITS: Record<string, number> = {
  'Milligram (mg)': 1e-6,
  'Gram (g)': 0.001,
  'Kilogram (kg)': 1,
  'Metric Ton (t)': 1000,
  'Ounce (oz)': 0.0283495,
  'Pound (lb)': 0.453592,
  'Stone (st)': 6.35029,
  'US Ton': 907.185,
  'Imperial Ton': 1016.05,
  'Carat (ct)': 0.0002,
  'Petagram (Pg)': 1e12,
  'Exagram (Eg)': 1e15
};

export const WeightConverter: React.FC = () => {
  const [value, setValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('Kilogram (kg)');

  const results = useMemo(() => {
    const num = parseFloat(value) || 0;
    const baseValue = num * UNITS[fromUnit];
    return Object.keys(UNITS).map(unit => ({
      unit,
      value: baseValue / UNITS[unit]
    }));
  }, [value, fromUnit]);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-4 bg-[var(--bg-card)] border border-[var(--border)] p-8 space-y-6 h-fit">
          <div>
            <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-3 block tracking-widest">Mass Input</label>
            <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-4 text-xl font-mono text-[var(--text-primary)] focus:border-[var(--border-hover)] outline-none" />
          </div>
          <div>
            <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-3 block tracking-widest">Source Unit</label>
            <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-4 text-sm text-[var(--text-primary)] outline-none">
              {Object.keys(UNITS).map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <button onClick={() => setValue('0')} className="w-full py-2 text-[10px] uppercase text-[var(--text-muted)] hover:text-red-500 font-bold">Reset</button>
        </div>
        <div className="lg:col-span-8 overflow-y-auto pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.map(r => (
              <div key={r.unit} className="bg-[var(--bg-card)] border border-[var(--border)] p-4 hover:border-[var(--border-hover)] transition-all flex items-center justify-between">
                <div>
                  <div className="text-[9px] uppercase text-[var(--text-muted)] font-bold tracking-widest mb-1">{r.unit}</div>
                  <div className="text-sm font-mono text-[var(--text-primary)]">
                    {r.value.toLocaleString(undefined, { maximumFractionDigits: 10 })}
                  </div>
                </div>
                <button onClick={() => navigator.clipboard.writeText(r.value.toString())} className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] uppercase font-bold">Copy</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
