
import React, { useState, useMemo } from 'react';

type FuelUnit = 'MPG (US)' | 'MPG (UK)' | 'Liters / 100km (L/100km)';

export const FuelConverter: React.FC = () => {
  const [value, setValue] = useState<string>('10');
  const [fromUnit, setFromUnit] = useState<FuelUnit>('Liters / 100km (L/100km)');

  const results = useMemo(() => {
    const num = parseFloat(value) || 0;
    let l100 = 0;

    if (num === 0) return [
      { unit: 'MPG (US)', value: 0 },
      { unit: 'MPG (UK)', value: 0 },
      { unit: 'Liters / 100km (L/100km)', value: 0 }
    ];

    if (fromUnit === 'Liters / 100km (L/100km)') l100 = num;
    else if (fromUnit === 'MPG (US)') l100 = 235.215 / num;
    else if (fromUnit === 'MPG (UK)') l100 = 282.481 / num;

    return [
      { unit: 'MPG (US)', value: 235.215 / l100 },
      { unit: 'MPG (UK)', value: 282.481 / l100 },
      { unit: 'Liters / 100km (L/100km)', value: l100 }
    ];
  }, [value, fromUnit]);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-4 bg-[var(--bg-card)] border border-[var(--border)] p-8 space-y-6 h-fit">
          <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block">Fuel Input</label>
          <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-4 text-xl font-mono text-[var(--text-primary)] outline-none" />
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value as FuelUnit)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-4 text-sm text-[var(--text-primary)] outline-none">
            <option value="MPG (US)">MPG (US)</option>
            <option value="MPG (UK)">MPG (UK)</option>
            <option value="Liters / 100km (L/100km)">L/100km</option>
          </select>
        </div>
        <div className="lg:col-span-8 space-y-4 pb-10">
          {results.map(r => (
            <div key={r.unit} className="bg-[var(--bg-card)] border border-[var(--border)] p-6 flex justify-between items-center group hover:border-[var(--border-hover)] transition-all">
              <div>
                <div className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest mb-1">{r.unit}</div>
                <div className="text-3xl font-mono text-[var(--text-primary)]">{isFinite(r.value) ? r.value.toFixed(2) : '---'}</div>
              </div>
              <button onClick={() => navigator.clipboard.writeText(r.value.toFixed(2))} className="px-6 py-2 border border-[var(--border)] text-[10px] uppercase font-bold text-[var(--text-muted)] group-hover:text-[var(--text-primary)]">Copy</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
