
import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
];

// Mock rates for a standard conversion (Non-AI Version)
const MOCK_RATES: Record<string, number> = {
  'USD': 1, 'EUR': 0.92, 'GBP': 0.79, 'JPY': 150.12, 'INR': 82.95,
  'AUD': 1.53, 'CAD': 1.35, 'CHF': 0.88, 'CNY': 7.19, 'SGD': 1.34
};

export const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<string>('100');
  const [fromCurr, setFromCurr] = useState('USD');
  const [toCurr, setToCurr] = useState('INR');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const convertedValue = useMemo(() => {
    const num = parseFloat(amount) || 0;
    const baseValue = num / MOCK_RATES[fromCurr];
    return baseValue * MOCK_RATES[toCurr];
  }, [amount, fromCurr, toCurr]);

  const swapCurrencies = () => {
    setFromCurr(toCurr);
    setToCurr(fromCurr);
  };

  const generateAiInsights = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Based on current world events, provide a 3-sentence market sentiment summary for the ${fromCurr} to ${toCurr} exchange rate. Include potential volatility factors.`;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      setAiAnalysis(response.text || "Insights currently unavailable.");
    } catch (err) {
      setAiAnalysis("AI analysis failed to load.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const resetAll = () => {
    setAmount('100');
    setFromCurr('USD');
    setToCurr('INR');
    setAiAnalysis(null);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Left: Standard Calculator */}
        <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto pr-2 pb-10">
          <div className="bg-[#111] border border-neutral-800 p-8 space-y-8">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <span className="text-[10px] uppercase text-neutral-500 font-bold tracking-widest">Exchange Calculator</span>
              <button onClick={resetAll} className="text-[10px] uppercase text-neutral-700 hover:text-red-500 font-bold">Reset All</button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase text-neutral-600 mb-3 block tracking-widest">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 font-mono">
                    {CURRENCIES.find(c => c.code === fromCurr)?.symbol}
                  </span>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-black border border-neutral-800 p-4 pl-10 text-xl font-mono text-white focus:border-neutral-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-2">
                <div className="md:col-span-5">
                  <label className="text-[9px] uppercase text-neutral-600 mb-1 block">From</label>
                  <select value={fromCurr} onChange={(e) => setFromCurr(e.target.value)} className="w-full bg-black border border-neutral-800 p-3 text-sm text-neutral-300 outline-none">
                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                  </select>
                </div>
                
                <div className="md:col-span-1 flex justify-center pt-5">
                  <button onClick={swapCurrencies} className="p-2 border border-neutral-800 text-neutral-600 hover:text-white transition-all rounded-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>
                  </button>
                </div>

                <div className="md:col-span-5">
                  <label className="text-[9px] uppercase text-neutral-600 mb-1 block">To</label>
                  <select value={toCurr} onChange={(e) => setToCurr(e.target.value)} className="w-full bg-black border border-neutral-800 p-3 text-sm text-neutral-300 outline-none">
                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-neutral-800 text-center">
              <div className="text-[10px] uppercase text-neutral-600 font-bold tracking-[0.2em] mb-4">Conversion Result</div>
              <div className="text-4xl font-mono text-white mb-2">
                {CURRENCIES.find(c => c.code === toCurr)?.symbol} {convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </div>
              <p className="text-[9px] text-neutral-700 uppercase font-bold tracking-widest">
                1 {fromCurr} = {(MOCK_RATES[toCurr] / MOCK_RATES[fromCurr]).toFixed(4)} {toCurr}
              </p>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-6 space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-neutral-500 font-bold tracking-widest flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                  AI Market Sentiment
                </span>
                <span className="text-[8px] bg-white/10 px-1.5 py-0.5 text-white/40 border border-white/10 uppercase font-bold">Powered by Gemini</span>
             </div>
             
             {aiAnalysis ? (
               <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                  <p className="text-xs text-neutral-400 leading-relaxed italic border-l-2 border-neutral-700 pl-4">"{aiAnalysis}"</p>
                  <button onClick={() => setAiAnalysis(null)} className="mt-4 text-[9px] uppercase text-neutral-600 hover:text-white font-bold transition-colors">Clear Insight</button>
               </div>
             ) : (
               <button 
                onClick={generateAiInsights}
                disabled={isAiLoading}
                className="w-full py-3 bg-neutral-800 border border-neutral-700 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white hover:border-neutral-500 transition-all flex items-center justify-center gap-2"
               >
                 {isAiLoading ? 'Synthesizing Data...' : 'Generate Market Insights'}
               </button>
             )}
          </div>
        </div>

        {/* Right: Cross-Rate Table */}
        <div className="lg:col-span-7 flex flex-col gap-4 overflow-y-auto pb-10 pr-1">
          <div className="bg-[#111] border border-neutral-800 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black border-b border-neutral-800">
                  <th className="p-4 text-[10px] uppercase text-neutral-600 font-bold tracking-widest">Base Rate: 1 {fromCurr}</th>
                  <th className="p-4 text-[10px] uppercase text-neutral-600 font-bold tracking-widest text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/30">
                {CURRENCIES.filter(c => c.code !== fromCurr).map(c => {
                  const rate = MOCK_RATES[c.code] / MOCK_RATES[fromCurr];
                  return (
                    <tr key={c.code} className="hover:bg-neutral-900 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-neutral-800 flex items-center justify-center font-bold text-xs text-neutral-500 border border-neutral-700">
                          {c.code}
                        </div>
                        <div>
                          <p className="text-xs text-neutral-300 font-medium">{c.name}</p>
                          <p className="text-[9px] text-neutral-600 font-mono">{c.symbol} Standard Unit</p>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="text-sm font-mono text-neutral-200">{rate.toFixed(4)}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-neutral-900/30 border border-neutral-800 text-[9px] text-neutral-700 uppercase tracking-widest font-bold italic text-center">
            * Rates are for demonstration and may not reflect real-time high-precision market data.
          </div>
        </div>
      </div>
    </div>
  );
};
