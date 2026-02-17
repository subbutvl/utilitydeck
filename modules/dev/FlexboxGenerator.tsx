
import React, { useState } from 'react';

export const FlexboxGenerator: React.FC = () => {
  const [itemsCount, setItemsCount] = useState(4);
  const [direction, setDirection] = useState<'row' | 'row-reverse' | 'column' | 'column-reverse'>('row');
  const [justify, setJustify] = useState('flex-start');
  const [align, setAlign] = useState('stretch');
  const [wrap, setWrap] = useState('nowrap');
  const [gap, setGap] = useState(16);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction,
    justifyContent: justify,
    alignItems: align,
    flexWrap: wrap as any,
    gap: `${gap}px`,
  };

  const copyCSS = () => {
    const css = `.container {\n  display: flex;\n  flex-direction: ${direction};\n  justify-content: ${justify};\n  align-items: ${align};\n  flex-wrap: ${wrap};\n  gap: ${gap}px;\n}`;
    navigator.clipboard.writeText(css);
  };

  const resetAll = () => {
    setItemsCount(4);
    setDirection('row');
    setJustify('flex-start');
    setAlign('stretch');
    setWrap('nowrap');
    setGap(16);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-4 space-y-4 overflow-y-auto pr-2">
          {/* Advanced Generator Note */}
          <div className="bg-[var(--bg-card)]/50 border border-dashed border-[var(--border)] p-4 mb-2">
            <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block mb-1">Notice</span>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed italic">
              An Advanced Flexbox Generator is coming soon. It will be a separate tool to support deep customization levels.
            </p>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-6">
            <h3 className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest border-b border-[var(--border)] pb-2">Flex Container</h3>
            
            <SelectControl label="Direction" value={direction} options={['row', 'row-reverse', 'column', 'column-reverse']} onChange={setDirection} />
            <SelectControl label="Justify Content" value={justify} options={['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly']} onChange={setJustify} />
            <SelectControl label="Align Items" value={align} options={['stretch', 'flex-start', 'flex-end', 'center', 'baseline']} onChange={setAlign} />
            <SelectControl label="Flex Wrap" value={wrap} options={['nowrap', 'wrap', 'wrap-reverse']} onChange={setWrap} />
            
            <div>
              <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 flex justify-between">Gap <span>{gap}px</span></label>
              <input type="range" min="0" max="64" value={gap} onChange={(e) => setGap(parseInt(e.target.value))} className="w-full h-1 bg-[var(--bg-hover)] appearance-none accent-white" />
            </div>

            <div className="pt-4 border-t border-[var(--border)]">
               <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-3 block tracking-widest">Mock Items</label>
               <input type="number" value={itemsCount} onChange={(e) => setItemsCount(Math.max(1, parseInt(e.target.value) || 1))} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-2 text-xs text-[var(--text-primary)]" />
            </div>

            <div className="flex gap-2">
               <button onClick={copyCSS} className="flex-1 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest">Copy CSS</button>
               <button onClick={resetAll} className="px-4 py-3 border border-[var(--border)] text-[10px] uppercase text-[var(--text-muted)] hover:text-red-500 transition-colors">Reset</button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-[var(--bg-card)] border border-[var(--border)] p-8 flex flex-col">
          <div className="flex-1 bg-[var(--bg-input)] border border-[var(--border)] overflow-auto relative p-4" style={containerStyle}>
             {Array.from({ length: itemsCount }).map((_, idx) => (
               <div key={idx} className="min-w-[60px] min-h-[60px] p-4 bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[10px] font-mono text-[var(--text-muted)]">
                 Item {idx + 1}
               </div>
             ))}
             <div className="absolute top-2 left-2 text-[8px] uppercase tracking-widest text-[var(--text-muted)] font-bold pointer-events-none">Visual Preview</div>
          </div>
          
          <div className="mt-4 bg-[var(--bg-card)] border border-[var(--border)] p-4">
             <code className="text-[11px] font-mono text-[var(--text-muted)]">
               display: flex;<br/>
               flex-direction: {direction};<br/>
               justify-content: {justify};<br/>
               align-items: {align};<br/>
               flex-wrap: {wrap};<br/>
               gap: {gap}px;
             </code>
          </div>
        </div>
      </div>
    </div>
  );
};

const SelectControl = ({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: any) => void }) => (
  <div>
    <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 block">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-2 text-xs text-[var(--text-muted)] outline-none">
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);
