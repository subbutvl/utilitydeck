
import React, { useState, useMemo } from 'react';

type DelimiterType = 'comma' | 'space' | 'newline' | 'pipe' | 'custom';
type OutputFormat = 'list' | 'array' | 'json' | 'joined';

export const StringSplitter: React.FC = () => {
  const [input, setInput] = useState('');
  const [delimiterType, setDelimiterType] = useState<DelimiterType>('comma');
  const [customDelimiter, setCustomDelimiter] = useState('');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('list');
  const [joinDelimiter, setJoinDelimiter] = useState(', ');
  
  // Options
  const [trimSegments, setTrimSegments] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [quoteType, setQuoteType] = useState<'none' | 'single' | 'double'>('none');

  const result = useMemo(() => {
    if (!input) return '';

    let activeDelimiter: string | RegExp = ',';
    switch (delimiterType) {
      case 'space': activeDelimiter = /\s+/; break;
      case 'newline': activeDelimiter = /\r?\n/; break;
      case 'pipe': activeDelimiter = '|'; break;
      case 'custom': activeDelimiter = customDelimiter || ','; break;
      default: activeDelimiter = ',';
    }

    let segments = input.split(activeDelimiter);

    if (trimSegments) {
      segments = segments.map(s => s.trim());
    }

    if (removeEmpty) {
      segments = segments.filter(s => s.length > 0);
    }

    const applyQuotes = (s: string) => {
      if (quoteType === 'single') return `'${s}'`;
      if (quoteType === 'double') return `"${s}"`;
      return s;
    };

    const processedSegments = segments.map(applyQuotes);

    switch (outputFormat) {
      case 'array':
        return `[${processedSegments.join(', ')}]`;
      case 'json':
        return JSON.stringify(processedSegments, null, 2);
      case 'joined':
        return processedSegments.join(joinDelimiter);
      case 'list':
      default:
        return processedSegments.join('\n');
    }
  }, [input, delimiterType, customDelimiter, outputFormat, trimSegments, removeEmpty, quoteType, joinDelimiter]);

  const copyResult = () => {
    navigator.clipboard.writeText(result);
  };

  const resetAll = () => {
    setInput('');
    setCustomDelimiter('');
    setDelimiterType('comma');
    setOutputFormat('list');
    setTrimSegments(true);
    setRemoveEmpty(true);
    setQuoteType('none');
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left: Input & Config */}
        <div className="lg:col-span-7 flex flex-col gap-6 overflow-auto pr-2">
          <div className="flex flex-col flex-1 min-h-[200px]">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">Input Text</label>
              <button onClick={resetAll} className="text-[10px] uppercase text-[var(--text-muted)] hover:text-red-500 font-bold transition-colors">Reset All</button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-[#0d0d0d] border border-[var(--border)] p-4 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-hover)] resize-none rounded-none leading-relaxed font-mono"
              placeholder="Enter text to split..."
            />
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-6">
            <div>
              <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-3 block tracking-widest">Delimiter Configuration</label>
              <div className="flex flex-wrap gap-2">
                {(['comma', 'space', 'newline', 'pipe', 'custom'] as DelimiterType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setDelimiterType(type)}
                    className={`px-4 py-2 text-[11px] uppercase tracking-wider transition-all border ${
                      delimiterType === type 
                      ? 'bg-white text-black border-white' 
                      : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border-hover)]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {delimiterType === 'custom' && (
                <input
                  type="text"
                  value={customDelimiter}
                  onChange={(e) => setCustomDelimiter(e.target.value)}
                  placeholder="Enter custom delimiter (e.g. ; or :)"
                  className="w-full mt-3 bg-[var(--bg-card)] border border-[var(--border)] p-2 text-xs focus:outline-none focus:border-[var(--border-hover)] rounded-none text-[var(--text-primary)]"
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold block tracking-widest">Processing</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={trimSegments} 
                      onChange={() => setTrimSegments(!trimSegments)}
                      className="w-4 h-4 bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)] rounded-none focus:ring-0" 
                    />
                    <span className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-primary)]">Trim whitespace</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={removeEmpty} 
                      onChange={() => setRemoveEmpty(!removeEmpty)}
                      className="w-4 h-4 bg-[var(--bg-input)] border-[var(--border)] text-[var(--text-primary)] rounded-none focus:ring-0" 
                    />
                    <span className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-primary)]">Omit empty results</span>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold block tracking-widest">Quoting</label>
                <div className="flex gap-2">
                  {(['none', 'single', 'double'] as const).map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuoteType(q)}
                      className={`flex-1 py-1.5 text-[10px] uppercase border ${
                        quoteType === q 
                        ? 'bg-neutral-200 text-black border-neutral-200' 
                        : 'bg-transparent text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border-hover)]'
                      }`}
                    >
                      {q === 'none' ? 'None' : q === 'single' ? "' '" : '" "'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">Output Format</label>
            <div className="flex gap-2">
              {(['list', 'array', 'json', 'joined'] as OutputFormat[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setOutputFormat(f)}
                  className={`px-2 py-1 text-[9px] uppercase tracking-widest border transition-colors ${
                    outputFormat === f ? 'bg-[var(--bg-hover)] text-[var(--text-primary)] border-[var(--border)]' : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-muted)]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 relative">
            <textarea
              readOnly
              value={result}
              className="w-full h-full bg-[var(--bg-card)] border border-[var(--border)] p-4 font-mono text-xs text-[var(--text-muted)] focus:outline-none resize-none rounded-none"
              placeholder="Split results will appear here..."
            />
            {result && (
              <button 
                onClick={copyResult}
                className="absolute top-3 right-3 px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all uppercase tracking-widest"
              >
                Copy
              </button>
            )}
          </div>

          {outputFormat === 'joined' && (
            <div className="flex items-center gap-3 p-3 bg-[var(--bg-card)]/30 border border-[var(--border)]">
              <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold shrink-0">Join With:</span>
              <input
                type="text"
                value={joinDelimiter}
                onChange={(e) => setJoinDelimiter(e.target.value)}
                className="bg-transparent border-b border-[var(--border)] focus:border-[var(--border-hover)] outline-none text-xs text-[var(--text-muted)] w-full px-1"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
