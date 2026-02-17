
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
      <div className="bg-indigo-900/20 border border-indigo-500/20 px-4 py-2 text-[10px] text-indigo-300 uppercase font-bold tracking-widest text-center">
        Currently using mock exchange rates. Real-time dynamic API integration is coming soon.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-5 flex flex-col gap-6 overflow-y-auto pr-2 pb-10">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-8 space-y-8">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
              <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">Exchange Calculator</span>
              <button onClick={resetAll} className="text-[10px] uppercase text-[var(--text-muted)] hover:text-red-500 font-bold">Reset</button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase text-[var(--text-muted)] mb-3 block tracking-widest">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-mono">
                    {CURRENCIES.find(c => c.code === fromCurr)?.symbol}
                  </span>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-4 pl-10 text-xl font-mono text-[var(--text-primary)] focus:border-[var(--border-hover)] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-2">
                <div className="md:col-span-5">
                  <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 block">From</label>
                  <select value={fromCurr} onChange={(e) => setFromCurr(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-3 text-sm text-[var(--text-primary)] outline-none">
                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                  </select>
                </div>
                
                <div className="md:col-span-1 flex justify-center pt-5">
                  <button onClick={swapCurrencies} className="p-2 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all rounded-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>
                  </button>
                </div>

                <div className="md:col-span-5">
                  <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 block">To</label>
                  <select value={toCurr} onChange={(e) => setToCurr(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-3 text-sm text-[var(--text-primary)] outline-none">
                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-[var(--border)] text-center">
              <div className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-[0.2em] mb-4">Conversion Result</div>
              <div className="text-4xl font-mono text-[var(--text-primary)] mb-2">
                {CURRENCIES.find(c => c.code === toCurr)?.symbol} {convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </div>
              <p className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-widest">
                1 {fromCurr} = {(MOCK_RATES[toCurr] / MOCK_RATES[fromCurr]).toFixed(4)} {toCurr}
              </p>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                  AI Market Sentiment
                </span>
                <span className="text-[8px] bg-white/10 px-1.5 py-0.5 text-[var(--text-primary)]/40 border border-white/10 uppercase font-bold">Powered by Gemini</span>
             </div>
             
             {aiAnalysis ? (
               <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed italic border-l-2 border-[var(--border)] pl-4">"{aiAnalysis}"</p>
                  <button onClick={() => setAiAnalysis(null)} className="mt-4 text-[9px] uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold transition-colors">Clear Insight</button>
               </div>
             ) : (
               <button 
                onClick={generateAiInsights}
                disabled={isAiLoading}
                className="w-full py-3 bg-[var(--bg-hover)] border border-[var(--border)] text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all flex items-center justify-center gap-2"
               >
                 {isAiLoading ? 'Synthesizing Data...' : 'Generate Market Insights'}
               </button>
             )}
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-4 overflow-y-auto pb-10 pr-1">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--bg-input)] border-b border-[var(--border)]">
                  <th className="p-4 text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">Base Rate: 1 {fromCurr}</th>
                  <th className="p-4 text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/30">
                {CURRENCIES.filter(c => c.code !== fromCurr).map(c => {
                  const rate = MOCK_RATES[c.code] / MOCK_RATES[fromCurr];
                  return (
                    <tr key={c.code} className="hover:bg-[var(--bg-card)] transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-8 h-8 bg-[var(--bg-hover)] flex items-center justify-center font-bold text-xs text-[var(--text-muted)] border border-[var(--border)]">
                          {c.code}
                        </div>
                        <div>
                          <p className="text-xs text-[var(--text-primary)] font-medium">{c.name}</p>
                          <p className="text-[9px] text-[var(--text-muted)] font-mono">{c.symbol} Standard Unit</p>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="text-sm font-mono text-[var(--text-primary)]">{rate.toFixed(4)}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
