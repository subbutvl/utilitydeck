
import React, { useState, useMemo } from 'react';

export const BionicReading: React.FC = () => {
  const [input, setInput] = useState('');
  const [fixation, setFixation] = useState(60); // Percentage of word to bold
  const [saccade, setSaccade] = useState(1);   // Every X words

  const bionicText = useMemo(() => {
    if (!input) return null;

    return input.split(/\s+/).map((word, index) => {
      if (index % saccade !== 0) return word + ' ';

      const cleanWord = word.replace(/[^\w]/g, '');
      const punctuation = word.slice(cleanWord.length);
      
      const boldLen = Math.ceil(word.length * (fixation / 100));
      const boldPart = word.slice(0, boldLen);
      const normalPart = word.slice(boldLen);

      return (
        <span key={index} className="inline-block mr-1">
          <strong className="text-[var(--text-primary)] font-bold">{boldPart}</strong>
          <span className="text-[var(--text-muted)]">{normalPart}</span>
        </span>
      );
    });
  }, [input, fixation, saccade]);

  const resetAll = () => {
    setInput('');
    setFixation(60);
    setSaccade(1);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">Input Text</label>
            <button 
              onClick={resetAll}
              className="text-[10px] uppercase text-[var(--text-muted)] hover:text-red-500 font-bold transition-colors"
            >
              Reset All
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-[#0d0d0d] border border-[var(--border)] p-6 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-hover)] resize-none rounded-none leading-relaxed"
            placeholder="Paste your text to convert into Bionic Reading format..."
          />
        </div>

        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">Bionic Preview</label>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <span className="text-[9px] uppercase text-[var(--text-muted)] font-bold">Fixation</span>
                 <input 
                  type="range" min="10" max="90" value={fixation} 
                  onChange={(e) => setFixation(parseInt(e.target.value))}
                  className="w-16 h-1 bg-[var(--bg-hover)] appearance-none accent-white"
                 />
               </div>
               <div className="flex items-center gap-2">
                 <span className="text-[9px] uppercase text-[var(--text-muted)] font-bold">Saccade</span>
                 <select 
                  value={saccade} 
                  onChange={(e) => setSaccade(parseInt(e.target.value))}
                  className="bg-transparent text-[10px] text-[var(--text-muted)] border-none focus:ring-0"
                 >
                   <option value="1">1 (All)</option>
                   <option value="2">2 (Every other)</option>
                   <option value="3">3</option>
                 </select>
               </div>
            </div>
          </div>
          <div className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] p-8 overflow-auto leading-loose text-lg">
            {bionicText ? (
              <div className="select-text">{bionicText}</div>
            ) : (
              <div className="h-full flex items-center justify-center opacity-20 italic text-xs uppercase tracking-widest">
                Formatted text will appear here
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-[var(--bg-card)]/30 p-4 border border-[var(--border)] text-[10px] text-[var(--text-muted)] uppercase tracking-widest text-center">
        Bionic Reading facilitates the reading process by guiding the eyes through text with artificial fixation points.
      </div>
    </div>
  );
};
