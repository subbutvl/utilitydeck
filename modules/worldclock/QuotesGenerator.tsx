import React, { useState, useEffect } from "react";
import { GoogleGenAI, Type } from "@google/genai";

interface Quote {
  text: string;
  author: string;
}

export const QuotesGenerator: React.FC = () => {
  const [primary, setPrimary] = useState<Quote | null>(null);
  const [secondary, setSecondary] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"public" | "ai">("public");
  const [theme, setTheme] = useState("Philosophy & Life");
  const [error, setError] = useState<string | null>(null);

  const fetchPublicQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetching from the Public Quotes API
      const response = await fetch(
        "https://api.freeapi.app/api/v1/public/quotes?page=1&limit=10"
      );
      const result = await response.json();

      if (result.success && result.data && result.data.data) {
        const rawQuotes = result.data.data;
        const mappedQuotes = rawQuotes
          .map((q: any) => ({
            text: q.content,
            author: q.author
          }))
          .sort(() => 0.5 - Math.random());

        setPrimary(mappedQuotes[0]);
        setSecondary(mappedQuotes.slice(1, 4));
      } else {
        throw new Error("Invalid API response structure");
      }
    } catch (err) {
      console.error("Public API Error:", err);
      setError("Failed to reach the Global Wisdom Feed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAIQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate 4 inspiring and unique quotes about "${theme}". Return a JSON array of objects, each with 'text' and 'author' keys. Ensure the author is a real person or 'Unknown'.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                author: { type: Type.STRING }
              },
              required: ["text", "author"]
            }
          }
        }
      });

      const data = JSON.parse(response.text);
      setPrimary(data[0]);
      setSecondary(data.slice(1, 4));
    } catch (err) {
      console.error("AI Generation failed:", err);
      setError("AI Synthesizer is currently busy. Switching to Global Feed.");
      setMode("public");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (mode === "ai") fetchAIQuotes();
    else fetchPublicQuotes();
  };

  useEffect(() => {
    handleRefresh();
  }, [mode]);

  return (
    <div className="h-full flex flex-col gap-8">
      {mode === "static" && (
        <div className="bg-indigo-900/20 border border-indigo-500/20 px-4 py-2 text-[10px] text-indigo-300 uppercase font-bold tracking-widest text-center animate-in fade-in slide-in-from-top-1">
          Currently viewing curated static content. Real-time dynamic API
          integration is coming soon.
        </div>
      )}

      <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="flex border border-[var(--border)] p-1 bg-[var(--bg-input)]">
            <button
              onClick={() => setMode("static")}
              className={`px-4 py-1.5 text-[10px] uppercase font-bold tracking-widest transition-all ${mode === "static" ? "bg-[var(--bg-hover)] text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
            >
              Global Feed
            </button>
            <button
              onClick={() => setMode("ai")}
              className={`px-4 py-1.5 text-[10px] uppercase font-bold tracking-widest transition-all ${mode === "ai" ? "bg-[var(--bg-hover)] text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
            >
              AI Lab
            </button>
          </div>

          {mode === "ai" && (
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Quote theme (e.g. Courage)..."
              className="bg-[var(--bg-input)] border border-[var(--border)] p-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--border-hover)] w-48"
            />
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={refresh}
            disabled={loading}
            className="px-8 py-2.5 bg-white text-black text-[11px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all disabled:opacity-30"
          >
            {loading ? "Fetching..." : "Generate New"}
          </button>
          <button
            onClick={resetAll}
            className="text-[10px] uppercase font-bold text-[var(--text-muted)] hover:text-red-500 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto pr-1">
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
          {primaryQuote ? (
            <section className="relative py-20 px-12 bg-[#0d0d0d] border border-[var(--border)] text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="absolute top-8 left-12 text-8xl font-serif text-[var(--text-muted)] leading-none pointer-events-none">
                “
              </div>
              <blockquote className="relative z-10">
                <p className="text-3xl md:text-5xl font-light text-[var(--text-primary)] leading-tight tracking-tight mb-8">
                  {primaryQuote.text}
                </p>
                <cite className="text-[11px] uppercase tracking-[0.4em] font-bold text-[var(--text-muted)] not-italic">
                  — {primaryQuote.author}
                </cite>
              </blockquote>
              <div className="absolute bottom-8 right-12 text-8xl font-serif text-[var(--text-muted)] leading-none rotate-180 pointer-events-none">
                “
              </div>
            </section>
          ) : null}

          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-[0.3em] whitespace-nowrap">
                Further Reflections
              </h2>
              <div className="h-px w-full bg-[var(--bg-card)]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {secondaryQuotes.length > 0
                ? secondaryQuotes.map((q, i) => (
                    <div
                      key={i}
                      className="p-8 bg-[var(--bg-card)] border border-[var(--border)] group hover:border-[var(--border-hover)] transition-all flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
                      style={{ animationDelay: `${i * 150}ms` }}
                    >
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed italic">
                        "{q.text}"
                      </p>
                      <p className="text-[9px] uppercase font-bold tracking-widest text-[var(--text-muted)] mt-auto border-t border-[var(--border)] pt-4">
                        {q.author}
                      </p>
                    </div>
                  ))
                : Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-40 border border-[var(--border)] bg-[var(--bg-card)]/50 animate-pulse"
                    />
                  ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
