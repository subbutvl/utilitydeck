
import React, { useState } from 'react';

export const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const formatJson = () => {
    try {
      setError(null);
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const minifyJson = () => {
    try {
      setError(null);
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 flex-1 min-h-0 gap-4">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold">Input</label>
            <button onClick={clearAll} className="text-[9px] uppercase text-[var(--text-muted)] hover:text-red-500 font-bold transition-colors">Clear Input</button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] p-4 font-mono text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-hover)] resize-none rounded-none"
            placeholder="Paste your JSON here..."
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-2">Output</label>
          <div className="flex-1 relative">
            <textarea
              readOnly
              value={output}
              className="w-full h-full bg-[var(--bg-card)] border border-[var(--border)] p-4 font-mono text-xs text-[var(--text-muted)] focus:outline-none resize-none rounded-none"
              placeholder="Formatted output will appear here..."
            />
            {output && (
              <button 
                onClick={copyToClipboard}
                className="absolute top-2 right-2 px-3 py-1 bg-[var(--bg-hover)] border border-[var(--border)] text-[10px] hover:bg-[var(--bg-hover)] transition-colors uppercase tracking-widest"
              >
                Copy
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 py-4">
        <button 
          onClick={formatJson}
          className="px-6 py-2 bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors rounded-none"
        >
          Format Pretty
        </button>
        <button 
          onClick={minifyJson}
          className="px-6 py-2 bg-[var(--bg-card)] border border-[var(--border)] text-xs font-bold hover:bg-[var(--bg-hover)] transition-colors rounded-none"
        >
          Minify
        </button>
        <div className="flex-1"></div>
        {error && <span className="text-red-500 text-[10px] uppercase font-bold">Error: {error}</span>}
      </div>
    </div>
  );
};
