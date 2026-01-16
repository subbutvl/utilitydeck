
import React, { useState, useRef } from 'react';

export const SvgStudio: React.FC = () => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setSvgContent(ev.target?.result as string);
      reader.readAsText(file);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-4 space-y-6 overflow-y-auto pr-2">
          <div className="bg-[#111] border border-neutral-800 p-8 space-y-6">
            <span className="text-[10px] uppercase text-neutral-500 font-bold tracking-widest block border-b border-neutral-800 pb-2">Asset Source</span>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-10 border-2 border-dashed border-neutral-800 text-[11px] uppercase tracking-widest font-bold text-neutral-600 hover:border-neutral-500 hover:text-white transition-all flex flex-col items-center justify-center gap-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Drop or Click to Upload SVG
            </button>
            <input type="file" ref={fileInputRef} onChange={handleUpload} accept=".svg" className="hidden" />
            
            {svgContent && (
              <div className="space-y-4">
                 <button onClick={() => navigator.clipboard.writeText(svgContent)} className="w-full py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest">Copy SVG Code</button>
                 <button onClick={() => setSvgContent(null)} className="w-full py-2 text-[10px] uppercase text-neutral-700 hover:text-red-500 font-bold">Clear Editor</button>
              </div>
            )}
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-4">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <h3 className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest">Development Session</h3>
             </div>
             <p className="text-xs text-neutral-600 leading-relaxed italic">
               Advanced path editing, optimization, and animation controls are currently under development. 
               Target release: Q4 2025.
             </p>
          </div>
        </div>

        <div className="lg:col-span-8 grid grid-rows-2 gap-6 h-full min-h-0">
          <div className="bg-[#0a0a0a] border border-neutral-800 relative overflow-hidden flex items-center justify-center p-12 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
             <div className="absolute top-4 left-4 text-[10px] uppercase font-bold text-neutral-700 tracking-widest italic">Visual Rendering</div>
             {svgContent ? (
               <div className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: svgContent }} />
             ) : (
               <div className="text-neutral-800 uppercase tracking-[0.5em] font-light text-2xl">Awaiting Asset</div>
             )}
          </div>
          
          <div className="bg-[#111] border border-neutral-800 flex flex-col min-h-0 overflow-hidden">
             <div className="px-6 py-3 border-b border-neutral-800 flex items-center justify-between">
                <span className="text-[10px] uppercase text-neutral-500 font-bold tracking-widest">Raw Source</span>
                <span className="text-[9px] font-mono text-neutral-700 uppercase">XML / SVG Data</span>
             </div>
             <div className="flex-1 overflow-auto p-6">
                {svgContent ? (
                  <code className="text-xs text-neutral-400 font-mono whitespace-pre">{svgContent}</code>
                ) : (
                  <div className="h-full flex items-center justify-center italic text-neutral-800 text-xs">No data source loaded</div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
