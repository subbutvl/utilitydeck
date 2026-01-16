
import React, { useState, useMemo } from 'react';

export const DiffractionCalculator: React.FC = () => {
  const [pixelSize, setPixelSize] = useState(4.5); // microns
  const [wavelength, setWavelength] = useState(550); // nm (green light)

  const limit = useMemo(() => {
    // Airy Disk Radius = 1.22 * wavelength * N
    // Limit reached when Airy disk diameter > 2 * pixel size
    const w = wavelength / 1000; // to microns
    const p = pixelSize;
    // N_limit = p / (1.22 * w)
    return p / (1.22 * w);
  }, [pixelSize, wavelength]);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-4 bg-[#111] border border-neutral-800 p-8 space-y-6">
           <span className="text-[10px] uppercase text-neutral-500 font-bold tracking-widest block border-b border-neutral-800 pb-2">Sensor Physics</span>
           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] uppercase text-neutral-600 font-bold tracking-widest flex justify-between">Pixel Pitch <span>{pixelSize}μm</span></label>
                 <input type="range" min="1" max="12" step="0.1" value={pixelSize} onChange={(e) => setPixelSize(parseFloat(e.target.value))} className="w-full h-1 bg-neutral-900 appearance-none accent-white cursor-pointer" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] uppercase text-neutral-600 font-bold tracking-widest flex justify-between">Light Spectrum <span>{wavelength}nm</span></label>
                 <input type="range" min="400" max="700" step="10" value={wavelength} onChange={(e) => setWavelength(parseInt(e.target.value))} className="w-full h-1 bg-neutral-900 appearance-none accent-white cursor-pointer" />
                 <div className="flex justify-between text-[8px] text-neutral-700 font-bold uppercase mt-1"><span>Blue</span><span>Green</span><span>Red</span></div>
              </div>
           </div>
           <button onClick={() => {setPixelSize(4.5); setWavelength(550);}} className="w-full py-2 text-[10px] uppercase text-neutral-700 hover:text-red-500 font-bold">Default Config</button>
        </div>

        <div className="lg:col-span-8 bg-[#0a0a0a] border border-neutral-800 p-12 flex flex-col justify-center items-center gap-12 text-center">
           <div className="space-y-4">
              <div className="text-[10px] uppercase font-bold text-neutral-600 tracking-[0.4em]">Diffraction Limit (f-stop)</div>
              <div className="text-[140px] font-mono leading-none text-white tracking-tighter">
                f/{limit.toFixed(1)}
              </div>
              <p className="text-xs text-neutral-500 uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed">
                Beyond this aperture, optical diffraction will begin to degrade your system's resolution potential.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
