
import React, { useState } from 'react';

export const WhitespaceRemover: React.FC = () => {
  const [text, setText] = useState('');

  const cleanWhitespace = () => {
    const cleaned = text
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .replace(/^\s+|\s+$/gm, '');
    setText(cleaned);
  };

  const removeAllSpaces = () => {
    setText(text.replace(/\s+/g, ''));
  };

  const removeLineBreaks = () => {
    setText(text.replace(/(\r\n|\n|\r)/gm, ' '));
  };

  const resetAll = () => {
    setText('');
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">Dirty Text</label>
          <button onClick={resetAll} className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] hover:text-red-500 font-bold transition-colors">Reset All</button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-[#0d0d0d] border border-[var(--border)] p-6 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-hover)] resize-none rounded-none leading-relaxed"
          placeholder="Paste text with messy spaces or line breaks..."
        />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <button 
          onClick={cleanWhitespace}
          className="px-6 py-2.5 bg-white text-black text-[11px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors rounded-none"
        >
          Fix Extra Spaces
        </button>
        <button 
          onClick={removeLineBreaks}
          className="px-6 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] text-[11px] font-bold uppercase tracking-widest hover:border-[var(--border-hover)] transition-colors rounded-none"
        >
          One Line Only
        </button>
        <button 
          onClick={removeAllSpaces}
          className="px-6 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] text-[11px] font-bold uppercase tracking-widest hover:border-[var(--border-hover)] transition-colors rounded-none"
        >
          Strip All Spaces
        </button>
        <div className="flex-1"></div>
        <button 
          onClick={() => navigator.clipboard.writeText(text)}
          className="px-6 py-2.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-[11px] uppercase tracking-widest transition-colors"
        >
          Copy Result
        </button>
      </div>

      <div className="text-[10px] text-[var(--text-muted)] font-mono italic">
        * "Fix Extra Spaces" normalizes multiple spaces into one and clears trailing whitespaces per line.
      </div>
    </div>
  );
};
