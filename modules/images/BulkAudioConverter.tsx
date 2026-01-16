
import React, { useState, useRef } from 'react';

interface QueuedAudio {
  id: string;
  name: string;
  original: string;
  status: 'pending' | 'done';
}

export const BulkAudioConverter: React.FC = () => {
  const [queue, setQueue] = useState<QueuedAudio[]>([]);
  const [targetExt, setTargetExt] = useState('.wav');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newItems: QueuedAudio[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      original: URL.createObjectURL(file),
      status: 'pending'
    }));
    setQueue([...queue, ...newItems]);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="bg-[#111] border border-neutral-800 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2 flex-1 w-full">
           <label className="text-[10px] uppercase font-bold text-neutral-600 tracking-[0.2em]">Output Encoding</label>
           <div className="flex gap-2">
             {['.wav', '.mp3', '.aac', '.m4a'].map(ext => (
               <button 
                key={ext} 
                onClick={() => setTargetExt(ext)}
                className={`px-6 py-2 text-[10px] uppercase font-bold tracking-widest border transition-all ${targetExt === ext ? 'bg-white text-black border-white' : 'bg-black text-neutral-500 border-neutral-800 hover:border-neutral-700'}`}
               >
                 {ext}
               </button>
             ))}
           </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <button onClick={() => fileInputRef.current?.click()} className="flex-1 md:flex-none px-8 py-3 bg-neutral-900 border border-neutral-800 text-[10px] font-bold uppercase tracking-widest text-neutral-300 hover:text-white transition-all">+ Load Audio</button>
          <button disabled className="flex-1 md:flex-none px-8 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest opacity-20 cursor-not-allowed">Convert Batch</button>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" multiple accept="audio/*" />
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 min-h-0">
        <div className="md:col-span-8 bg-neutral-900 border border-neutral-800 overflow-y-auto">
           {queue.length > 0 ? (
             <div className="p-4 space-y-2">
                {queue.map(q => (
                  <div key={q.id} className="bg-black/40 border border-neutral-800 p-4 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <div className="w-8 h-8 bg-neutral-800 flex items-center justify-center border border-neutral-700">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20"/><path d="M6 7v10"/><path d="M18 7v10"/><path d="M2 11v2"/><path d="M22 11v2"/></svg>
                       </div>
                       <div>
                          <p className="text-xs font-mono text-neutral-400">{q.name}</p>
                          <p className="text-[8px] text-neutral-700 uppercase font-bold">PCM 48kHz / 32-bit float</p>
                       </div>
                    </div>
                    <button className="text-[9px] uppercase font-bold text-neutral-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">Remove</button>
                  </div>
                ))}
             </div>
           ) : (
             <div className="h-full flex items-center justify-center opacity-10 uppercase tracking-[0.4em] italic p-20 text-center">
               Audio Workstation Queue Empty
             </div>
           )}
        </div>
        
        <div className="md:col-span-4 bg-[#111] border border-neutral-800 p-8 space-y-6">
           <h3 className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 border-b border-neutral-800 pb-2">Encoding Strategy</h3>
           <div className="space-y-4">
              <div>
                 <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Local Processing</p>
                 <p className="text-xs text-neutral-600 leading-relaxed italic">All files are processed within your browser. We never upload your audio data to any server.</p>
              </div>
              <div className="pt-4 border-t border-neutral-900">
                 <p className="text-[11px] font-bold text-neutral-700 uppercase tracking-widest mb-1">Engine Status</p>
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
                    <span className="text-[10px] text-neutral-500 font-mono uppercase">Optimizing WASM Module</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
