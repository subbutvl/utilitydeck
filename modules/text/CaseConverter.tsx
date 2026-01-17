
import React, { useState } from 'react';

export const CaseConverter: React.FC = () => {
  const [text, setText] = useState('');

  const transform = (type: 'upper' | 'lower' | 'title' | 'sentence' | 'mixed' | 'inverse') => {
    if (!text) return;
    switch (type) {
      case 'upper': setText(text.toUpperCase()); break;
      case 'lower': setText(text.toLowerCase()); break;
      case 'title': setText(text.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')); break;
      case 'sentence': setText(text.toLowerCase().replace(/(^\w|\.\s+\w)/gm, s => s.toUpperCase())); break;
      case 'mixed': setText(text.split('').map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join('')); break;
      case 'inverse': setText(text.split('').map(char => char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()).join('')); break;
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs uppercase text-neutral-500 font-bold tracking-widest">Workspace</label>
          <button onClick={() => setText('')} className="text-xs uppercase text-neutral-600 hover:text-red-500 font-bold transition-colors">Reset</button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-[#111] border border-neutral-800 p-8 text-base text-neutral-300 focus:outline-none focus:border-neutral-600 resize-none leading-relaxed transition-all"
          placeholder="Enter content to transform..."
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {['UPPER', 'lower', 'Title', 'Sentence', 'MiXeD', 'iNVERSE'].map((label, i) => (
          <button 
            key={label}
            onClick={() => transform(['upper', 'lower', 'title', 'sentence', 'mixed', 'inverse'][i] as any)}
            className="py-3.5 border border-neutral-800 hover:border-neutral-500 hover:bg-neutral-900 text-xs font-bold uppercase tracking-widest transition-all"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center text-xs text-neutral-600 font-bold uppercase tracking-widest">
        <div className="flex gap-10">
          <span>Characters: <span className="text-white font-mono">{text.length}</span></span>
          <span>Words: <span className="text-white font-mono">{text.trim() === '' ? 0 : text.trim().split(/\s+/).length}</span></span>
        </div>
        <button onClick={() => navigator.clipboard.writeText(text)} className="bg-neutral-900 px-6 py-3 border border-neutral-800 text-neutral-400 hover:text-white transition-all uppercase tracking-widest">Copy Final Text</button>
      </div>
    </div>
  );
};
