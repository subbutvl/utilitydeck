import React from "react";
import { CATEGORIES, TOOLS } from "../constants";
import { Category, Tool } from "../types";

interface HomeProps {
  onToolSelect: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ onToolSelect }) => {
  const getToolsByCategory = (cat: Category) =>
    TOOLS.filter((t) => t.category === cat);

  return (
    <div className="h-full overflow-auto scroll-smooth dots-grid">
      <div className="max-w-7xl mx-auto p-8 space-y-16">
        {/* Simple Header */}
        <header className="border-b border-[var(--border)] pb-10">
          <h1 className="text-4xl font-bold tracking-tighter text-[var(--text-primary)] mb-2">
            UtilityDeck - The All-In-One Digital Toolkit
          </h1>
          <p className="text-[var(--text-muted)] text-sm max-w-xl leading-relaxed">
            UtilityDeck is your free online command center. Access a complete
            suite of tools for image manipulation, video conversion, text
            formatting, and developer utilities. No installs, just results.
          </p>
        </header>

        <div className="space-y-16 pb-20">
          {CATEGORIES.map((cat) => {
            const catTools = getToolsByCategory(cat);
            if (catTools.length === 0) return null;

            return (
              <div key={cat} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-[11px] uppercase tracking-[0.4em] text-[var(--text-muted)] font-bold whitespace-nowrap">
                    {cat}
                  </h2>
                  <div className="h-[1px] flex-1 bg-[var(--border)]"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catTools.map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => onToolSelect(tool.id)}
                      className="group p-6 bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] cursor-pointer transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-[var(--bg-hover)] border border-[var(--border)] text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                          {tool.icon}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1 tracking-wide uppercase">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2 italic">
                        {tool.description}
                      </p>

                      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--text-primary)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
