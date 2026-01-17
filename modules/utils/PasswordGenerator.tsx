
import React, { useState, useEffect, useCallback } from 'react';

export const PasswordGenerator: React.FC = () => {
  const [passwords, setPasswords] = useState<string[]>([]);
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(1);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const generateOne = useCallback(() => {
    const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowers = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    let chars = '';
    if (includeUpper) chars += uppers;
    if (includeLower) chars += lowers;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;
    if (chars === '') return 'Select an option';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  const generateBulk = useCallback(() => {
    const results = [];
    for (let i = 0; i < count; i++) {
      results.push(generateOne());
    }
    setPasswords(results);
  }, [count, generateOne]);

  useEffect(() => {
    generateBulk();
  }, [generateBulk]);

  return (
    <div className="max-w-3xl mx-auto w-full flex flex-col gap-8 pt-6">
      <div className="flex flex-col gap-4">
        <div className="max-h-[350px] overflow-y-auto bg-neutral-950 border border-neutral-800 p-8 space-y-4 font-mono text-base shadow-inner">
          {passwords.map((pw, i) => (
            <div key={i} className="flex items-center justify-between group hover:bg-neutral-900 p-3 transition-colors border-b border-neutral-900 last:border-0">
              <span className="text-white break-all tracking-wider">{pw}</span>
              <button onClick={() => navigator.clipboard.writeText(pw)} className="opacity-0 group-hover:opacity-100 text-xs text-neutral-500 hover:text-white uppercase tracking-widest font-black px-3">Copy</button>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center px-2">
          <button onClick={() => navigator.clipboard.writeText(passwords.join('\n'))} className="text-xs text-neutral-500 hover:text-white uppercase font-bold tracking-[0.2em]">Copy All Batch</button>
          <button onClick={() => {setLength(16); setIncludeSymbols(true); generateBulk();}} className="text-xs text-neutral-700 hover:text-red-500 uppercase font-bold tracking-[0.2em]">Reset Settings</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-neutral-900/40 p-10 border border-neutral-800">
        <div className="space-y-8">
          <div>
            <label className="text-xs uppercase text-neutral-500 font-bold mb-4 block tracking-[0.2em]">Key Length: <span className="text-white font-mono ml-2">{length}</span></label>
            <input type="range" min="4" max="128" value={length} onChange={(e) => setLength(parseInt(e.target.value))} className="w-full h-1.5 bg-neutral-800 appearance-none cursor-pointer accent-white" />
          </div>
          <div>
            <label className="text-xs uppercase text-neutral-500 font-bold mb-4 block tracking-[0.2em]">Quantity: <span className="text-white font-mono ml-2">{count}</span></label>
            <input type="range" min="1" max="50" value={count} onChange={(e) => setCount(parseInt(e.target.value))} className="w-full h-1.5 bg-neutral-800 appearance-none cursor-pointer accent-white" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 items-center">
          {[
            { label: 'Upper', val: includeUpper, set: setIncludeUpper },
            { label: 'Lower', val: includeLower, set: setIncludeLower },
            { label: 'Numbers', val: includeNumbers, set: setIncludeNumbers },
            { label: 'Symbols', val: includeSymbols, set: setIncludeSymbols },
          ].map(opt => (
            <label key={opt.label} className="flex items-center gap-4 cursor-pointer group">
              <input type="checkbox" checked={opt.val} onChange={() => opt.set(!opt.val)} className="w-5 h-5 bg-black border-neutral-700 text-white focus:ring-0" />
              <span className="text-sm font-bold text-neutral-500 group-hover:text-white uppercase tracking-widest">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button onClick={generateBulk} className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-sm hover:bg-neutral-200 transition-all">Secure Re-Generation</button>
    </div>
  );
};
