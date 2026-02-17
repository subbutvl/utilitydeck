import React, { useState, useEffect } from "react";
import { TOOLS, CATEGORIES } from "./constants";
import { Tool } from "./types";
import Layout from "./components/Layout";
import Home from "./pages/Home";

const App: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState<string | null>(null);

  const activeTool = TOOLS.find((t) => t.id === activeToolId);

  // Desktop notification simulation
  const notify = (title: string, body: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body });
    }
  };

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const handleToolSelect = (id: string) => {
    setActiveToolId(id);
  };

  const handleGoHome = () => {
    setActiveToolId(null);
  };

  return (
    <Layout
      activeToolId={activeToolId}
      onToolSelect={handleToolSelect}
      onGoHome={handleGoHome}
    >
      {!activeTool ? (
        <Home onToolSelect={handleToolSelect} />
      ) : (
        <div className="h-full flex flex-col p-6 animate-in fade-in duration-300 dots-grid">
          <div className="mb-6 border-b border-[var(--border)] pb-6">
            <nav className="flex items-center gap-2 text-[14px] uppercase tracking-widest mb-4 text-[var(--text-muted)] font-medium">
              <button
                onClick={handleGoHome}
                className="hover:text-[var(--text-primary)] transition-colors"
              >
                Workspace
              </button>
              <span className="opacity-20">/</span>
              <button
                onClick={handleGoHome}
                className="hover:text-[var(--text-primary)] transition-colors"
              >
                {activeTool.category}
              </button>
              <span className="opacity-20">/</span>
              <span className="text-[var(--text-primary)]">
                {activeTool.name}
              </span>
            </nav>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)]">
                  {activeTool.icon}
                </div>
                <div>
                  <h1 className="text-xl font-medium text-[var(--text-primary)]">
                    {activeTool.name}
                  </h1>
                  <p className="text-sm text-[var(--text-muted)] mt-0.5">
                    {activeTool.description}
                  </p>
                </div>
              </div>

              <button
                onClick={handleGoHome}
                className="px-4 py-2 border border-[var(--border)] text-[11px] uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Exit Tool
              </button>
            </div>
          </div>

          {/* Tool Workspace */}
          <div className="flex-1 overflow-auto dots-grid">
            <activeTool.component />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
