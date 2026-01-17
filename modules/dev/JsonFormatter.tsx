
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

  const copyToClipboard = () => navigator.clipboard.writeText(output);

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 flex-1 min-h-0 gap-6">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs uppercase text-neutral-500 font-bold tracking-widest">Raw Input</label>
            <button onClick={() => setInput('')} className="text-xs uppercase text-neutral-600 hover:text-red-500 transition-colors">Clear</button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-neutral-900 border border-neutral-800 p-6 font-mono text-sm text-neutral-300 focus:outline-none focus:border-neutral-600 resize-none leading-relaxed"
            placeholder="Paste raw JSON here..."
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs uppercase text-neutral-500 font-bold mb-3 tracking-widest">Formatted Output</label>
          <div className="flex-1 relative">
            <textarea
              readOnly
              value={output}
              className="w-full h-full bg-neutral-950 border border-neutral-800 p-6 font-mono text-sm text-neutral-400 focus:outline-none resize-none leading-relaxed"
              placeholder="Output will be shown here..."
            />
            {output && (
              <button onClick={copyToClipboard} className="absolute top-4 right-4 px-4 py-2 bg-neutral-800 border border-neutral-700 text-xs hover:bg-neutral-700 transition-all uppercase tracking-widest text-white">Copy</button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 py-4 border-t border-neutral-800">
        <button onClick={formatJson} className="px-8 py-3 bg-white text-black text-sm font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all">Pretty Print</button>
        <button onClick={minifyJson} className="px-8 py-3 bg-neutral-900 border border-neutral-800 text-sm font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all">Minify</button>
        <div className="flex-1"></div>
        {error && <span className="text-red-500 text-xs uppercase font-bold tracking-tight">Parser Error: {error}</span>}
      </div>
    </div>
  );
};
