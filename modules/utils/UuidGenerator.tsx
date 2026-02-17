
import React, { useState, useEffect, useCallback } from 'react';

type UuidVersion = 'v1' | 'v4' | 'numeric';

export const UuidGenerator: React.FC = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [version, setVersion] = useState<UuidVersion>('v4');
  const [count, setCount] = useState(5);
  const [useHyphens, setUseHyphens] = useState(true);
  const [useUppercase, setUseUppercase] = useState(false);

  const generateV4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const generateV1 = () => {
    // Simplified V1 simulation
    const now = Date.now();
    const timeLow = (now & 0xffffffff).toString(16).padStart(8, '0');
    const timeMid = ((now >> 32) & 0xffff).toString(16).padStart(4, '0');
    const timeHi = (((now >> 48) & 0x0fff) | 0x1000).toString(16).padStart(4, '0');
    const clockSeq = ((Math.random() * 0x3fff) | 0x8000).toString(16).padStart(4, '0');
    const node = Math.floor(Math.random() * 0xffffffffffff).toString(16).padStart(12, '0');
    return `${timeLow}-${timeMid}-${timeHi}-${clockSeq}-${node}`;
  };

  const generateNumeric = (length = 32) => {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  };

  const generateBatch = useCallback(() => {
    const results = [];
    for (let i = 0; i < count; i++) {
      let id = '';
      if (version === 'v4') id = generateV4();
      else if (version === 'v1') id = generateV1();
      else if (version === 'numeric') id = generateNumeric(32);

      if (!useHyphens && version !== 'numeric') {
        id = id.replace(/-/g, '');
      }
      
      if (useUppercase) {
        id = id.toUpperCase();
      } else {
        id = id.toLowerCase();
      }
      
      results.push(id);
    }
    setUuids(results);
  }, [count, version, useHyphens, useUppercase]);

  useEffect(() => {
    generateBatch();
  }, [generateBatch]);

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
  };

  const resetAll = () => {
    setVersion('v4');
    setCount(5);
    setUseHyphens(true);
    setUseUppercase(false);
  };

  return (
    <div className="max-w-3xl mx-auto w-full flex flex-col gap-6 pt-4">
      <div className="flex flex-col gap-2">
        <div className="max-h-[400px] overflow-y-auto bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-2 font-mono text-sm shadow-inner">
          {uuids.map((id, i) => (
            <div key={i} className="flex items-center justify-between group hover:bg-[var(--bg-hover)] p-2 border-b border-[var(--border)]/50 last:border-0 transition-colors">
              <span className="text-[var(--text-primary)] break-all">{id}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(id)}
                className="opacity-0 group-hover:opacity-100 text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] uppercase tracking-widest px-2 font-bold"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center px-2 mt-2">
          <button 
            onClick={copyAll}
            className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] uppercase tracking-widest font-bold flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            Copy All Results ({uuids.length})
          </button>
          <button 
            onClick={resetAll}
            className="text-[10px] text-[var(--text-muted)] hover:text-red-500 uppercase tracking-widest font-bold"
          >
            Reset Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[var(--bg-card)]/30 p-8 border border-[var(--border)]">
        <div className="space-y-6">
          <div>
            <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-4 block tracking-widest">Version</label>
            <div className="flex bg-[var(--bg-input)] border border-[var(--border)] p-1">
              {(['v1', 'v4', 'numeric'] as UuidVersion[]).map(v => (
                <button
                  key={v}
                  onClick={() => setVersion(v)}
                  className={`flex-1 py-1.5 text-[10px] uppercase tracking-widest transition-all ${version === v ? 'bg-[var(--bg-hover)] text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-4 block tracking-widest">Batch Size: {count}</label>
            <input 
              type="range" min="1" max="100" value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full h-1 bg-[var(--bg-hover)] appearance-none cursor-pointer accent-white"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={useHyphens} 
              disabled={version === 'numeric'}
              onChange={() => setUseHyphens(!useHyphens)} 
              className="w-4 h-4 bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)] rounded-none focus:ring-0 disabled:opacity-20" 
            />
            <span className={`text-xs ${version === 'numeric' ? 'text-[var(--text-muted)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'} transition-colors`}>Include Hyphens</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={useUppercase} 
              onChange={() => setUseUppercase(!useUppercase)} 
              className="w-4 h-4 bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)] rounded-none focus:ring-0" 
            />
            <span className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">Uppercase Results</span>
          </label>
        </div>
      </div>

      <button 
        onClick={generateBatch}
        className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-neutral-200 transition-colors"
      >
        Regenerate Batch
      </button>
    </div>
  );
};
