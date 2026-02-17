
import React, { useState, useMemo } from 'react';

export const TimelapseCalculator: React.FC = () => {
  const [eventHours, setEventHours] = useState('2');
  const [intervalSec, setIntervalSec] = useState('5');
  const [frameRate, setFrameRate] = useState('24');

  const stats = useMemo(() => {
    const hours = parseFloat(eventHours) || 0;
    const interval = parseFloat(intervalSec) || 0;
    const fps = parseFloat(frameRate) || 1;

    if (interval <= 0) return null;

    const totalSeconds = hours * 3600;
    const framesCount = totalSeconds / interval;
    const clipSeconds = framesCount / fps;
    const storageMB = framesCount * 25; // Average 25MB per RAW file

    return {
      frames: Math.floor(framesCount),
      clipLength: clipSeconds,
      storage: storageMB / 1024 // to GB
    };
  }, [eventHours, intervalSec, frameRate]);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-4 bg-[var(--bg-card)] border border-[var(--border)] p-8 space-y-6">
          <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block border-b border-[var(--border)] pb-2">Parameters</span>
          
          <div className="space-y-6">
             <div className="space-y-2">
                <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest flex justify-between">Event Duration <span>{eventHours}h</span></label>
                <input type="range" min="0.5" max="24" step="0.5" value={eventHours} onChange={(e) => setEventHours(e.target.value)} className="w-full h-1 bg-[var(--bg-card)] appearance-none accent-white cursor-pointer" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest flex justify-between">Interval <span>{intervalSec}s</span></label>
                <input type="range" min="1" max="60" value={intervalSec} onChange={(e) => setIntervalSec(e.target.value)} className="w-full h-1 bg-[var(--bg-card)] appearance-none accent-white cursor-pointer" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block">Output Frame Rate (FPS)</label>
                <select value={frameRate} onChange={(e) => setFrameRate(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-3 text-sm text-[var(--text-primary)] outline-none">
                  <option value="24">24 FPS (Cinematic)</option>
                  <option value="30">30 FPS (Standard)</option>
                  <option value="60">60 FPS (High Motion)</option>
                </select>
             </div>
          </div>
          
          <button onClick={() => { setEventHours('2'); setIntervalSec('5'); setFrameRate('24'); }} className="w-full py-2 text-[10px] uppercase text-[var(--text-muted)] hover:text-red-500 font-bold transition-colors">Reset Settings</button>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex-1 bg-[var(--bg-page)] border border-[var(--border)] p-12 flex flex-col items-center justify-center relative overflow-hidden group">
             <div className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--text-muted)] italic">Production Outcome</div>
             
             {stats ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-4xl text-center">
                   <div className="space-y-2">
                      <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest">Frames Required</div>
                      <div className="text-5xl font-mono text-[var(--text-primary)]">{stats.frames.toLocaleString()}</div>
                   </div>
                   <div className="space-y-2">
                      <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest">Clip Length</div>
                      <div className="text-5xl font-mono text-[var(--text-primary)]">
                        {Math.floor(stats.clipLength / 60)}m {Math.floor(stats.clipLength % 60)}s
                      </div>
                   </div>
                   <div className="space-y-2">
                      <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest">Est. Storage (RAW)</div>
                      <div className="text-5xl font-mono text-[var(--text-primary)]">{stats.storage.toFixed(1)} <span className="text-lg">GB</span></div>
                   </div>
                </div>
             ) : (
                <div className="text-[var(--text-muted)] uppercase tracking-[0.5em] font-light text-2xl">Awaiting Config</div>
             )}
          </div>
          
          <div className="p-4 bg-[var(--bg-card)]/30 border border-[var(--border)] text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold text-center">
             * Storage estimates are based on 25MB average per RAW image file.
          </div>
        </div>
      </div>
    </div>
  );
};
