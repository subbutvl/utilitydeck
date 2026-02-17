
import React, { useState, useMemo } from 'react';

export const Counter: React.FC = () => {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmed = text.trim();
    return {
      chars: text.length,
      charsNoSpaces: text.replace(/\s/g, '').length,
      words: trimmed === '' ? 0 : trimmed.split(/\s+/).length,
      sentences: trimmed === '' ? 0 : text.split(/[.!?]+/).filter(Boolean).length,
      paragraphs: trimmed === '' ? 0 : text.split(/\n\s*\n/).filter(Boolean).length,
      lines: text === '' ? 0 : text.split('\n').length,
    };
  }, [text]);

  const resetAll = () => {
    setText('');
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">Input Text</label>
          <button onClick={resetAll} className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] hover:text-red-500 font-bold transition-colors">Reset All</button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-[#0d0d0d] border border-[var(--border)] p-6 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-hover)] resize-none rounded-none leading-relaxed font-mono"
          placeholder="Start typing or paste content to analyze..."
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Characters" value={stats.chars} />
        <StatCard label="Chars (no space)" value={stats.charsNoSpaces} />
        <StatCard label="Words" value={stats.words} />
        <StatCard label="Sentences" value={stats.sentences} />
        <StatCard label="Lines" value={stats.lines} />
        <StatCard label="Paragraphs" value={stats.paragraphs} />
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border)] p-4 text-[10px] text-[var(--text-muted)] uppercase tracking-widest text-center font-bold">
        Live Analysis Workspace
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="bg-[var(--bg-card)] border border-[var(--border)] p-4 text-center group hover:border-[var(--border-hover)] transition-colors">
    <div className="text-xl font-light text-[var(--text-primary)] group-hover:scale-110 transition-transform mb-1">{value}</div>
    <div className="text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] font-bold">{label}</div>
  </div>
);
