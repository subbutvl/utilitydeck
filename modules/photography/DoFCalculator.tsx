
import React, { useState, useMemo } from 'react';

export const DoFCalculator: React.FC = () => {
  const [focalLength, setFocalLength] = useState(50);
  const [aperture, setAperture] = useState(2.8);
  const [distance, setDistance] = useState(2); // meters
  const [sensor, setSensor] = useState(0.03); // Full Frame CoC approx 0.03mm

  const result = useMemo(() => {
    const f = focalLength;
    const a = aperture;
    const s = distance * 1000; // to mm
    const c = sensor;

    const hyperfocal = (f * f) / (a * c) + f;
    const near = (hyperfocal * s) / (hyperfocal + (s - f));
    const far = (hyperfocal * s) / (hyperfocal - (s - f));

    const total = far > 0 ? far - near : Infinity;

    return {
      hyperfocal: hyperfocal / 1000,
      near: near / 1000,
      far: far > 0 ? far / 1000 : Infinity,
      total: total / 1000
    };
  }, [focalLength, aperture, distance, sensor]);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-4 bg-[#111] border border-neutral-800 p-8 space-y-6">
          <span className="text-[10px] uppercase text-neutral-500 font-bold tracking-widest block border-b border-neutral-800 pb-2">Inputs</span>
          
          <div className="space-y-6">
             <Control label="Focal Length (mm)" value={focalLength} min={8} max={600} onChange={setFocalLength} />
             <Control label="Aperture (f/)" value={aperture} min={1} max={32} step={0.1} onChange={setAperture} />
             <Control label="Focus Distance (m)" value={distance} min={0.3} max={50} step={0.1} onChange={setDistance} />
             
             <div className="space-y-2">
                <label className="text-[10px] uppercase text-neutral-600 font-bold tracking-widest block">Sensor / CoC Preset</label>
                <select value={sensor} onChange={(e) => setSensor(parseFloat(e.target.value))} className="w-full bg-black border border-neutral-800 p-3 text-sm text-neutral-300 outline-none">
                  <option value="0.03">Full Frame (0.030mm)</option>
                  <option value="0.02">APS-C (0.020mm)</option>
                  <option value="0.015">Micro 4/3 (0.015mm)</option>
                </select>
             </div>
          </div>
          <button onClick={() => {setFocalLength(50); setAperture(2.8); setDistance(2); setSensor(0.03);}} className="w-full py-2 text-[10px] uppercase text-neutral-700 hover:text-red-500 font-bold">Reset Optics</button>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex-1 bg-[#0a0a0a] border border-neutral-800 p-12 overflow-y-auto">
             <div className="grid grid-cols-2 gap-8 h-full items-center">
                <ResultItem label="Total Depth of Field" value={result.total === Infinity ? 'Infinite' : `${result.total.toFixed(2)}m`} highlight />
                <ResultItem label="Hyperfocal Distance" value={`${result.hyperfocal.toFixed(2)}m`} />
                <ResultItem label="Near Limit" value={`${result.near.toFixed(2)}m`} />
                <ResultItem label="Far Limit" value={result.far === Infinity ? '∞' : `${result.far.toFixed(2)}m`} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Control = ({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void }) => (
  <div className="space-y-2">
    <label className="text-[10px] uppercase text-neutral-600 font-bold tracking-widest flex justify-between">{label} <span>{value}</span></label>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full h-1 bg-neutral-900 appearance-none accent-white cursor-pointer" />
  </div>
);

const ResultItem = ({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) => (
  <div className={`p-8 border border-neutral-800 flex flex-col items-center justify-center text-center ${highlight ? 'bg-white/5 border-white/10' : ''}`}>
    <div className="text-[10px] uppercase font-bold text-neutral-600 tracking-widest mb-4">{label}</div>
    <div className={`font-mono leading-none ${highlight ? 'text-white text-6xl' : 'text-neutral-400 text-4xl'}`}>{value}</div>
  </div>
);
