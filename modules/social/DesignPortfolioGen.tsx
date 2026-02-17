
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

export const DesignPortfolioGen: React.FC = () => {
  const [project, setProject] = useState('');
  const [style, setStyle] = useState('Professional');
  const [output, setOutput] = useState<{description: string, tags: string[]} | null>(null);
  const [loading, setLoading] = useState(false);

  const generatePortfolioData = async () => {
    if (!project) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Create a compelling Dribbble/Behance project description and 10 SEO tags for this project: "${project}". Tone: ${style}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });
      setOutput(JSON.parse(response.text));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full flex flex-col gap-6 pt-4">
      <div className="bg-[var(--bg-card)] border border-[var(--border)] p-8 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-2 block tracking-widest">Project Summary</label>
          <input value={project} onChange={(e) => setProject(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-4 text-sm focus:border-[var(--border-hover)] outline-none" placeholder="e.g. Modern E-commerce Mobile App with Neumorphic elements..." />
        </div>
        <div className="w-full md:w-48">
          <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-2 block tracking-widest">Tone</label>
          <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-4 text-xs uppercase tracking-widest">
            <option>Professional</option>
            <option>Creative / Edgy</option>
            <option>Story-driven</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 self-end">
          <button onClick={generatePortfolioData} disabled={loading} className="px-10 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs transition-all hover:bg-neutral-200">Optimize</button>
          <button onClick={() => {setProject(''); setOutput(null)}} className="text-[10px] uppercase text-[var(--text-muted)] hover:text-red-500 font-bold tracking-widest text-center">Reset</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[400px]">
        <div className="md:col-span-8 bg-[var(--bg-card)] border border-[var(--border)] p-10 relative">
          <h3 className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-6 font-bold">Project Description</h3>
          {output ? (
            <div className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">{output.description}</div>
          ) : (
            <div className="h-full flex items-center justify-center opacity-10 italic text-xs uppercase tracking-[0.5em]">Description Content</div>
          )}
          {output && (
            <button onClick={() => navigator.clipboard.writeText(output.description)} className="absolute top-6 right-6 text-[10px] uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold">Copy</button>
          )}
        </div>

        <div className="md:col-span-4 bg-[#0d0d0d] border border-[var(--border)] p-8 flex flex-col">
          <h3 className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-6 font-bold">Recommended Tags</h3>
          <div className="flex flex-wrap gap-2">
            {output ? (
              output.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border)] text-[11px] text-[var(--text-muted)] font-mono">#{tag}</span>
              ))
            ) : (
              <div className="opacity-10 italic text-[10px] uppercase tracking-widest mt-10 text-center w-full">No tags yet</div>
            )}
          </div>
          {output && (
             <button onClick={() => navigator.clipboard.writeText(output.tags.join(', '))} className="mt-auto py-3 border border-[var(--border)] text-[10px] uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Copy All Tags</button>
          )}
        </div>
      </div>
    </div>
  );
};
