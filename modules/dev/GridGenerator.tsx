
import React, { useState } from 'react';

export const GridGenerator: React.FC = () => {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(3);
  const [colGap, setColGap] = useState(16);
  const [rowGap, setRowGap] = useState(16);

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    columnGap: `${colGap}px`,
    rowGap: `${rowGap}px`,
    height: '100%'
  };

  const copyCSS = () => {
    const css = `.grid-container {\n  display: grid;\n  grid-template-columns: repeat(${cols}, 1fr);\n  grid-template-rows: repeat(${rows}, 1fr);\n  column-gap: ${colGap}px;\n  row-gap: ${rowGap}px;\n}`;
    navigator.clipboard.writeText(css);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-4 space-y-4">
          {/* Advanced Generator Note */}
          <div className="bg-[var(--bg-card)]/50 border border-dashed border-[var(--border)] p-4 mb-2">
            <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block mb-1">Notice</span>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed italic">
              An Advanced Grid Generator is coming soon. It will be a separate tool due to the level of customization it supports.
            </p>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-6">
            <h3 className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest border-b border-[var(--border)] pb-2">Grid Configuration</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <GridControl label="Columns" value={cols} min={1} max={12} onChange={setCols} />
              <GridControl label="Rows" value={rows} min={1} max={12} onChange={setRows} />
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 flex justify-between">Column Gap <span>{colGap}px</span></label>
                <input type="range" min="0" max="100" value={colGap} onChange={(e) => setColGap(parseInt(e.target.value))} className="w-full h-1 bg-[var(--bg-hover)] appearance-none accent-white" />
              </div>
              <div>
                <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 flex justify-between">Row Gap <span>{rowGap}px</span></label>
                <input type="range" min="0" max="100" value={rowGap} onChange={(e) => setRowGap(parseInt(e.target.value))} className="w-full h-1 bg-[var(--bg-hover)] appearance-none accent-white" />
              </div>
            </div>

            <button onClick={copyCSS} className="w-full py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest">Copy Grid CSS</button>
            <button onClick={() => {setCols(3); setRows(3); setColGap(16); setRowGap(16);}} className="w-full py-2 text-[10px] uppercase text-[var(--text-muted)] hover:text-red-500 font-bold">Reset</button>
          </div>
        </div>

        <div className="lg:col-span-8 bg-[var(--bg-card)] border border-[var(--border)] p-8 flex flex-col">
          <div className="flex-1 bg-[var(--bg-input)] border border-[var(--border)] p-4 overflow-auto" style={gridStyle}>
             {Array.from({ length: cols * rows }).map((_, idx) => (
               <div key={idx} className="bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[10px] font-mono text-[var(--text-muted)] hover:border-[var(--border-hover)] transition-colors">
                 {idx + 1}
               </div>
             ))}
          </div>
          
          <div className="mt-4 bg-[var(--bg-card)] border border-[var(--border)] p-4">
            <code className="text-[11px] font-mono text-[var(--text-muted)] whitespace-pre">
{`display: grid;
grid-template-columns: repeat(${cols}, 1fr);
grid-template-rows: repeat(${rows}, 1fr);
column-gap: ${colGap}px;
row-gap: ${rowGap}px;`}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

const GridControl = ({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) => (
  <div>
    <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 block">{label}</label>
    <input type="number" min={min} max={max} value={value} onChange={(e) => onChange(parseInt(e.target.value) || 1)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-2 text-xs text-[var(--text-primary)]" />
  </div>
);
