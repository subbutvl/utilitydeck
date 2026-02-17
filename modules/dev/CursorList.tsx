
import React, { useState } from 'react';

const CURSORS = [
  'auto', 'default', 'none', 'context-menu', 'help', 'pointer', 'progress', 'wait',
  'cell', 'crosshair', 'text', 'vertical-text', 'alias', 'copy', 'move', 'no-drop',
  'not-allowed', 'grab', 'grabbing', 'all-scroll', 'col-resize', 'row-resize',
  'n-resize', 'e-resize', 's-resize', 'w-resize', 'ne-resize', 'nw-resize',
  'se-resize', 'sw-resize', 'ew-resize', 'ns-resize', 'nesw-resize', 'nwse-resize',
  'zoom-in', 'zoom-out'
];

export const CursorList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = CURSORS.filter(c => c.toLowerCase().includes(search.toLowerCase()));

  const handleCopy = (c: string) => {
    const code = `cursor: ${c};`;
    navigator.clipboard.writeText(code);
    setCopied(c);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Search Header */}
      <div className="relative">
        <input 
          type="text" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search cursor types (e.g. pointer, wait)..."
          className="w-full bg-[var(--bg-card)] border border-[var(--border)] p-4 text-sm text-[var(--text-primary)] focus:border-[var(--border-hover)] outline-none transition-colors"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
      </div>

      {/* Cursor Grid */}
      <div className="flex-1 overflow-auto pr-1">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 pb-10">
          {filtered.map(c => (
            <div 
              key={c}
              onClick={() => handleCopy(c)}
              className="bg-[var(--bg-card)] border border-[var(--border)] p-6 flex flex-col items-center justify-center gap-4 transition-all hover:border-[var(--border-hover)] group cursor-pointer relative overflow-hidden"
              style={{ cursor: c }}
            >
              {/* Icon / Preview */}
              <div className="w-10 h-10 flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border)] group-hover:scale-110 transition-transform duration-300">
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-muted)]"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="m13 13 6 6"/></svg>
              </div>

              {/* Info */}
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors block mb-1 tracking-widest">{c}</span>
                <code className="text-[9px] font-mono text-[var(--text-muted)] group-hover:text-[var(--text-muted)]">cursor: {c};</code>
              </div>
              
              {/* Copied Feedback Overlay */}
              {copied === c && (
                <div className="absolute inset-0 bg-white flex flex-col items-center justify-center animate-in fade-in duration-200 z-10">
                  <span className="text-black text-[10px] uppercase font-bold tracking-widest">Copied!</span>
                  <span className="text-black/50 text-[8px] font-mono mt-1">cursor: {c};</span>
                </div>
              )}
              
              {/* Hover Indicator Icon */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-muted)]"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-[var(--border)] opacity-30 italic text-xs uppercase tracking-widest">
              No matching cursors found
            </div>
          )}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="bg-[var(--bg-card)]/30 p-3 border border-[var(--border)] text-[10px] text-[var(--text-muted)] uppercase tracking-widest text-center font-bold">
        Click any card to copy its CSS property to your clipboard
      </div>
    </div>
  );
};
