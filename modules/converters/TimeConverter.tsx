
import React, { useState, useMemo } from 'react';

const UNITS: Record<string, number> = {
  'Nanosecond (ns)': 1e-9,
  'Microsecond (μs)': 1e-6,
  'Millisecond (ms)': 0.001,
  'Second (s)': 1,
  'Minute (min)': 60,
  'Hour (h)': 3600,
  'Day (d)': 86400,
  'Week (wk)': 604800,
  'Month (avg)': 2.628e+6,
  'Year (yr)': 3.154e+7,
  'Decade': 3.154e+8,
  'Century': 3.154e+9
};

export const TimeConverter: React.FC = () => {
  const [value, setValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('Hour (h)');

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
          <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block">Duration Input</label>
          <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-4 text-xl font-mono text-[var(--text-primary)] outline-none" />
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-4 text-sm text-[var(--text-primary)] outline-none">
            {Object.keys(UNITS).map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div className="lg:col-span-8 overflow-y-auto pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.map(r => (
              <div key={r.unit} className="bg-[var(--bg-card)] border border-[var(--border)] p-4 flex justify-between items-center hover:border-[var(--border-hover)] transition-all">
                <div>
                  <div className="text-[9px] uppercase text-[var(--text-muted)] font-bold tracking-widest">{r.unit}</div>
                  <div className="text-sm font-mono text-[var(--text-primary)]">{r.value.toLocaleString(undefined, { maximumFractionDigits: 10 })}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
