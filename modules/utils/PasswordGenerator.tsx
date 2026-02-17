import React, { useState, useEffect, useCallback } from "react";

export const PasswordGenerator: React.FC = () => {
  const [passwords, setPasswords] = useState<string[]>([]);
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(1);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const generateOne = useCallback(() => {
    const uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowers = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let chars = "";
    if (includeUpper) chars += uppers;
    if (includeLower) chars += lowers;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;
    if (chars === "") return "Select an option";
    let result = "";
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
    <div className="max-w-2xl mx-auto w-full flex flex-col gap-6 pt-6">
      <div className="flex flex-col gap-2">
        <div className="max-h-[300px] overflow-y-auto bg-neutral-900 border border-neutral-800 p-6 space-y-3 font-mono text-sm">
          {passwords.map((pw, i) => (
            <div
              key={i}
              className="flex items-center justify-between group hover:bg-neutral-800 p-2 transition-colors"
            >
              <span className="text-white break-all">{pw}</span>
              <button
                onClick={() => navigator.clipboard.writeText(pw)}
                className="opacity-0 group-hover:opacity-100 text-[10px] text-neutral-500 hover:text-white uppercase tracking-widest px-2"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center px-2">
          <button
            onClick={copyAll}
            className="text-[10px] text-neutral-500 hover:text-white uppercase tracking-widest font-bold"
          >
            Copy All ({passwords.length})
          </button>
          <button
            onClick={resetAll}
            className="text-[10px] text-neutral-700 hover:text-red-500 uppercase tracking-widest font-bold"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-neutral-900/50 p-8 border border-neutral-900">
        <div className="space-y-6">
          <div>
            <label className="text-[10px] uppercase text-neutral-500 font-bold mb-4 block tracking-widest">
              Pass Length: {length}
            </label>
            <input
              type="range"
              min="4"
              max="128"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-1 bg-neutral-800 appearance-none cursor-pointer accent-white"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase text-neutral-500 font-bold mb-4 block tracking-widest">
              Quantity: {count}
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full h-1 bg-neutral-800 appearance-none cursor-pointer accent-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={() => setIncludeUpper(!includeUpper)}
              className="w-4 h-4 bg-black border-neutral-700 text-white rounded-none"
            />
            <span className="text-xs text-neutral-400 group-hover:text-neutral-200">
              Uppercase
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={includeLower}
              onChange={() => setIncludeLower(!includeLower)}
              className="w-4 h-4 bg-black border-neutral-700 text-white rounded-none"
            />
            <span className="text-xs text-neutral-400 group-hover:text-neutral-200">
              Lowercase
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={() => setIncludeNumbers(!includeNumbers)}
              className="w-4 h-4 bg-black border-neutral-700 text-white rounded-none"
            />
            <span className="text-xs text-neutral-400 group-hover:text-neutral-200">
              Numbers
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={() => setIncludeSymbols(!includeSymbols)}
              className="w-4 h-4 bg-black border-neutral-700 text-white rounded-none"
            />
            <span className="text-xs text-neutral-400 group-hover:text-neutral-200">
              Symbols
            </span>
          </label>
        </div>
      </div>

      <button
        onClick={generateBulk}
        className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-sm hover:bg-neutral-200 transition-all"
      >
        Secure Re-Generation
      </button>
    </div>
  );
};
