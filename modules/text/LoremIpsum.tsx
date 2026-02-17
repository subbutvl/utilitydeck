
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const STANDARD_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'curabitur', 'vel', 'hendrerit', 'libero', 'eleifend', 'blandit', 'nunc', 'ornare', 'odio', 'ut', 'orci', 'gravida', 'imperdiet', 'nullam', 'purus', 'lacinia', 'a', 'pretium', 'quis', 'congue', 'praesent', 'sagittis', 'laoreet', 'auctor', 'mauris', 'non', 'velit', 'eros', 'dictum', 'proin', 'accumsan', 'sapien', 'nec', 'massa', 'volutpat', 'venenatis', 'sed', 'eu', 'molestie', 'lacus', 'quisque', 'porttitor', 'ligula', 'dui', 'mollis', 'tempus', 'at', 'magna', 'vestibulum', 'ante', 'faucibus', 'primis', 'luctus', 'et', 'ultrices', 'posuere', 'cubilia', 'curae', 'vivamus', 'dignissim', 'egestas', 'est', 'falsis'
];

type LoremType = 'paragraphs' | 'sentences' | 'words' | 'ordered list' | 'unordered list';

export const LoremIpsum: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'standard' | 'ai'>('standard');
  const [output, setOutput] = useState('');
  const [count, setCount] = useState(3);
  const [type, setType] = useState<LoremType>('paragraphs');
  const [aiTheme, setAiTheme] = useState('');
  const [loading, setLoading] = useState(false);

  const generateStandard = () => {
    let result = '';
    
    const generateSentence = (minWords = 8, maxWords = 12) => {
      const wordCount = minWords + Math.floor(Math.random() * (maxWords - minWords));
      const words = [];
      for (let j = 0; j < wordCount; j++) {
        words.push(STANDARD_WORDS[Math.floor(Math.random() * STANDARD_WORDS.length)]);
      }
      let sentence = words.join(' ');
      return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
    };

    if (type === 'words') {
      const words = [];
      for (let i = 0; i < count; i++) {
        words.push(STANDARD_WORDS[Math.floor(Math.random() * STANDARD_WORDS.length)]);
      }
      result = words.join(' ');
    } else if (type === 'sentences') {
      const sentences = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence(10, 20));
      }
      result = sentences.join(' ');
    } else if (type === 'unordered list') {
      const items = [];
      for (let i = 0; i < count; i++) {
        items.push(`• ${generateSentence(5, 10)}`);
      }
      result = items.join('\n');
    } else if (type === 'ordered list') {
      const items = [];
      for (let i = 0; i < count; i++) {
        items.push(`${i + 1}. ${generateSentence(5, 10)}`);
      }
      result = items.join('\n');
    } else {
      const paragraphs = [];
      for (let i = 0; i < count; i++) {
        const sentenceCount = 4 + Math.floor(Math.random() * 4);
        const sentences = [];
        for (let s = 0; s < sentenceCount; s++) {
          sentences.push(generateSentence());
        }
        paragraphs.push(sentences.join(' '));
      }
      result = paragraphs.join('\n\n');
    }
    setOutput(result);
  };

  const generateAI = async () => {
    if (!aiTheme) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a list of ${count} ${type} of placeholder text themed around "${aiTheme}". The text should be suitable for design mockups. Do not include any titles or metadata, just the body text. If it is a list, format it as a plain text list.`,
      });
      setOutput(response.text || '');
    } catch (err) {
      console.error(err);
      setOutput('Failed to generate AI content. Ensure your theme is valid.');
    } finally {
      setLoading(false);
    }
  };

  const resetGenerator = () => {
    setOutput('');
    setCount(3);
    setType('paragraphs');
    setAiTheme('');
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex border-b border-[var(--border)]">
        <button
          onClick={() => setActiveMode('standard')}
          className={`px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 ${activeMode === 'standard' ? 'border-white text-[var(--text-primary)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
        >
          Standard
        </button>
        <button
          onClick={() => setActiveMode('ai')}
          className={`px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 ${activeMode === 'ai' ? 'border-white text-[var(--text-primary)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
        >
          AI Theme Engine
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-6">
            <div>
              <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-3 block tracking-widest">Quantity</label>
              <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  value={count}
                  min="1"
                  max="100"
                  onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border)] p-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-hover)] rounded-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-3 block tracking-widest">Type</label>
              <div className="grid grid-cols-2 gap-1">
                {(['paragraphs', 'sentences', 'words', 'unordered list', 'ordered list'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`py-2 text-[10px] uppercase border tracking-tighter ${type === t ? 'bg-white text-black border-white' : 'bg-transparent text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border-hover)]'} ${t === 'paragraphs' ? 'col-span-2' : ''}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {activeMode === 'ai' && (
              <div>
                <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-3 block tracking-widest">Theme / Vibe</label>
                <input 
                  type="text"
                  placeholder="e.g. Cyberpunk Noir, Space Exploration..."
                  value={aiTheme}
                  onChange={(e) => setAiTheme(e.target.value)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border)] p-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-hover)] rounded-none"
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <button
                onClick={activeMode === 'standard' ? generateStandard : generateAI}
                disabled={loading}
                className={`w-full py-3 bg-neutral-200 text-black text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-all rounded-none ${loading ? 'opacity-50' : ''}`}
              >
                {loading ? 'Generating...' : 'Generate Text'}
              </button>
              <button 
                onClick={resetGenerator}
                className="w-full py-2 text-[var(--text-muted)] hover:text-red-500 text-[10px] uppercase tracking-[0.2em] font-bold transition-colors"
              >
                Reset Generator
              </button>
            </div>
          </div>
          
          <div className="text-[10px] text-[var(--text-muted)] italic px-2">
            {activeMode === 'standard' 
              ? '* Traditional Latin placeholder text.' 
              : '* AI generates content based on your chosen thematic keywords.'}
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">Output</span>
            {output && (
              <button 
                onClick={() => navigator.clipboard.writeText(output)}
                className="text-[10px] uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Copy All
              </button>
            )}
          </div>
          <div className="flex-1 bg-[#0d0d0d] border border-[var(--border)] p-6 overflow-auto font-sans leading-relaxed text-[var(--text-muted)] select-text">
            {output ? (
              <div className="whitespace-pre-wrap">{output}</div>
            ) : (
              <div className="h-full flex items-center justify-center opacity-20 italic text-xs uppercase tracking-widest">
                Generated content will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
