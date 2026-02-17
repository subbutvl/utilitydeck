
import React, { useState, useMemo } from 'react';

export const AdvancedDoFCalculator: React.FC = () => {
  const [fl, setFl] = useState(85);
  const [apt, setApt] = useState(1.4);
  const [dist, setDist] = useState(3);
  const [coc, setCoc] = useState(0.03);
  const [bgDist, setBgDist] = useState(10); // Background distance in meters

  const stats = useMemo(() => {
    const s = dist * 1000;
    const b = bgDist * 1000;
    const hyperfocal = (fl * fl) / (apt * coc) + fl;
    const near = (hyperfocal * s) / (hyperfocal + (s - fl));
    const far = (hyperfocal * s) / (hyperfocal - (s - fl));
    const total = far > 0 ? far - near : Infinity;

    // Background blur circle diameter calculation
    const blurDiameter = Math.abs(fl * (fl / apt) * (b - s) / (b * (s - fl)));

    return {
      near: near / 1000,
      far: far > 0 ? far / 1000 : Infinity,
      total: total / 1000,
      blurSize: blurDiameter
    };
  }, [fl, apt, dist, coc, bgDist]);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-4 bg-[var(--bg-card)] border border-[var(--border)] p-8 space-y-6 overflow-y-auto">
          <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block border-b border-[var(--border)] pb-2">Optical Bench</span>
          <Control label="Focal Length" value={fl} min={10} max={800} onChange={setFl} unit="mm" />
          <Control label="Aperture" value={apt} min={0.95} max={22} step={0.1} onChange={setApt} unit="f/" />
          <Control label="Focus Distance" value={dist} min={0.5} max={100} step={0.5} onChange={setDist} unit="m" />
          <Control label="Background Dist" value={bgDist} min={dist + 1} max={500} step={1} onChange={setBgDist} unit="m" />
        </div>

        <div className="lg:col-span-8 bg-[var(--bg-page)] border border-[var(--border)] p-12 flex flex-col gap-12 justify-center">
           <div className="grid grid-cols-3 gap-8">
              <AdvancedStat label="Near Limit" val={`${stats.near.toFixed(2)}m`} />
              <AdvancedStat label="Far Limit" val={stats.far === Infinity ? '∞' : `${stats.far.toFixed(2)}m`} />
              <AdvancedStat label="Total DoF" val={stats.total === Infinity ? 'Inf.' : `${stats.total.toFixed(2)}m`} />
           </div>
           
           <div className="bg-[var(--bg-card)] border border-[var(--border)] p-8 flex items-center justify-between">
              <div>
                 <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest mb-1">Bokeh Analysis</div>
                 <div className="text-[11px] text-[var(--text-muted)] uppercase italic">Blur Circle Diameter at {bgDist}m</div>
              </div>
              <div className="text-right">
                 <div className="text-6xl font-mono text-[var(--text-primary)]">{stats.blurSize.toFixed(2)}<span className="text-lg">mm</span></div>
                 <div className="text-[9px] text-blue-500 uppercase font-bold mt-2 tracking-widest">
                   {stats.blurSize > 0.5 ? 'Extreme Softness' : stats.blurSize > 0.1 ? 'Moderate Blur' : 'Near Critical Sharpness'}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const AdvancedStat = ({ label, val }: { label: string; val: string }) => (
  <div className="text-center">
    <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest mb-2">{label}</div>
    <div className="text-2xl font-mono text-[var(--text-primary)]">{val}</div>
  </div>
);

const Control = ({ label, value, min, max, step = 1, onChange, unit }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; unit: string }) => (
  <div className="space-y-2">
    <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest flex justify-between">{label} <span>{value}{unit}</span></label>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full h-1 bg-[var(--bg-card)] appearance-none accent-white cursor-pointer" />
  </div>
);
