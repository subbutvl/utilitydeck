import React, { useState, useRef } from "react";
import { CATEGORIES, TOOLS } from "../constants";
import { Category, Tool } from "../types";
import { useTheme } from "../context/ThemeContext";

interface LayoutProps {
  children: React.ReactNode;
  activeToolId: string | null;
  onToolSelect: (id: string) => void;
  onGoHome: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  activeToolId,
  onToolSelect,
  onGoHome
}) => {
  const { theme, toggleTheme } = useTheme();
  const [openCategory, setOpenCategory] = useState<Category | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const getToolsByCategory = (cat: Category) =>
    TOOLS.filter((t) => t.category === cat);

  const handleMouseEnter = (cat: Category) => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenCategory(cat);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setOpenCategory(null);
    }, 150); // 150ms grace period for "sticky" feel
  };

  const handleMenuEnter = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)] select-none">
      {/* Top Bar Navigation */}
      <nav className="h-12 border-b border-[var(--border)] flex items-center px-4 gap-2 z-50 bg-[var(--bg-page)]">
        <div
          onClick={onGoHome}
          className="mr-6 cursor-pointer hover:opacity-80 transition-colors flex items-center gap-2"
        >
          <div className="w-4 h-4 bg-[var(--text-primary)] rounded-none"></div>
          <span className="font-bold tracking-tight text-[16px]">
            UtilityDeck
          </span>
        </div>

        <div className="flex items-center h-full">
          {CATEGORIES.map((cat) => {
            const isSpecial = cat === "Curated Resources";
            return (
              <div
                key={cat}
                className="relative h-full flex items-center"
                onMouseEnter={() => handleMouseEnter(cat)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`px-3 h-full text-[15px] font-medium transition-all ${
                    openCategory === cat
                      ? "bg-[var(--bg-hover)] text-[var(--text-primary)]"
                      : isSpecial
                        ? "text-[var(--accent)] hover:text-[var(--accent-hover)]"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {cat}
                </button>

                {openCategory === cat && (
                  <div
                    onMouseEnter={handleMenuEnter}
                    className={`absolute top-12 left-0 w-64 bg-[var(--bg-card)] border border-[var(--border)] p-1 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150 ${isSpecial ? "border-[var(--accent)]" : ""}`}
                  >
                    <div className="absolute -top-2 left-0 w-full h-2 bg-transparent"></div>

                    {getToolsByCategory(cat).length > 0 ? (
                      <div className="flex flex-col">
                        <div
                          className={`px-3 py-2 text-[12px] uppercase tracking-[0.2em] font-bold border-b border-[var(--border)] mb-1 ${isSpecial ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`}
                        >
                          {isSpecial ? "Premium Assets" : "Available Tools"}
                        </div>
                        {getToolsByCategory(cat).map((tool) => (
                          <button
                            key={tool.id}
                            onClick={() => {
                              onToolSelect(tool.id);
                              setOpenCategory(null);
                            }}
                            className={`w-full text-left px-3 py-2.5 text-[15px] flex items-center gap-3 hover:bg-[var(--bg-hover)] transition-colors ${activeToolId === tool.id ? "bg-[var(--bg-hover)] text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
                          >
                            <span
                              className={`opacity-70 ${activeToolId === tool.id ? "text-[var(--text-primary)]" : ""}`}
                            >
                              {tool.icon}
                            </span>
                            <span className="flex-1 truncate">{tool.name}</span>
                            {activeToolId === tool.id && (
                              <div className="w-1 h-1 bg-[var(--text-primary)] rounded-none"></div>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-3 text-[12px] uppercase tracking-widest text-[var(--text-muted)] italic">
                        No tools developed yet
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex-1"></div>

        <div className="flex items-center gap-4 text-[var(--text-muted)] mr-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors"
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-none bg-green-500 animate-pulse"></div>
            <span className="text-[12px] font-mono opacity-50 uppercase tracking-tighter">
              v1.0.0-BETA
            </span>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-hidden relative">{children}</main>

      <footer className="h-6 border-t border-[var(--border)] bg-[var(--bg-page)] flex items-center px-4 justify-between text-[11px] text-[var(--text-muted)]">
        <div className="flex gap-4">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-none bg-[var(--border)]"></span>
            Ready
          </span>
          <span className="opacity-50">UTF-8</span>
          {activeToolId && (
            <span className="text-[var(--text-muted)] flex items-center gap-1">
              <span className="opacity-30">/</span>
              {TOOLS.find((t) => t.id === activeToolId)?.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="uppercase tracking-widest text-[11px] font-bold">
            System Tray Active
          </span>
          <div className="flex gap-1">
            <div className="w-3 h-3 border border-[var(--border)]"></div>
            <div className="w-3 h-3 border border-[var(--border)]"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
