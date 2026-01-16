
import React, { useState, useRef } from 'react';
import { CATEGORIES, TOOLS } from '../constants';
import { Category, Tool } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeToolId: string | null;
  onToolSelect: (id: string) => void;
  onGoHome: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeToolId, onToolSelect, onGoHome }) => {
  const [openCategory, setOpenCategory] = useState<Category | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const getToolsByCategory = (cat: Category) => TOOLS.filter(t => t.category === cat);

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
    <div className="h-screen w-screen flex flex-col bg-[#0a0a0a] text-neutral-200 select-none">
      {/* Top Bar Navigation */}
      <nav className="h-12 border-b border-neutral-800 flex items-center px-4 gap-2 z-50 bg-[#0a0a0a]">
        <div 
          onClick={onGoHome}
          className="mr-6 cursor-pointer hover:text-white transition-colors flex items-center gap-2"
        >
          <div className="w-4 h-4 bg-white rounded-none"></div>
          <span className="font-bold tracking-tight text-[14px]">SWISS KNIFE</span>
        </div>

        <div className="flex items-center h-full">
          {CATEGORIES.map((cat) => {
            const isSpecial = cat === 'Curated Resources';
            return (
              <div 
                key={cat}
                className="relative h-full flex items-center"
                onMouseEnter={() => handleMouseEnter(cat)}
                onMouseLeave={handleMouseLeave}
              >
                <button className={`px-3 h-full text-[13px] font-medium transition-all ${
                  openCategory === cat 
                    ? 'bg-neutral-900 text-white' 
                    : isSpecial ? 'text-indigo-400 hover:text-indigo-300' : 'text-neutral-400 hover:text-white'
                }`}>
                  {cat}
                </button>
                
                {openCategory === cat && (
                  <div 
                    onMouseEnter={handleMenuEnter}
                    className={`absolute top-12 left-0 w-64 bg-[#111111] border border-neutral-800 p-1 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150 ${isSpecial ? 'border-indigo-500/30' : ''}`}
                  >
                    {/* Invisible bridge to prevent mouse-out gaps */}
                    <div className="absolute -top-2 left-0 w-full h-2 bg-transparent"></div>
                    
                    {getToolsByCategory(cat).length > 0 ? (
                      <div className="flex flex-col">
                        <div className={`px-3 py-2 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-neutral-800 mb-1 ${isSpecial ? 'text-indigo-400' : 'text-neutral-600'}`}>
                          {isSpecial ? 'Premium Assets' : 'Available Tools'}
                        </div>
                        {getToolsByCategory(cat).map(tool => (
                          <button
                            key={tool.id}
                            onClick={() => {
                              onToolSelect(tool.id);
                              setOpenCategory(null);
                            }}
                            className={`w-full text-left px-3 py-2.5 text-[13px] flex items-center gap-3 hover:bg-neutral-800 transition-colors ${activeToolId === tool.id ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
                          >
                            <span className={`opacity-70 ${activeToolId === tool.id ? 'text-white' : ''}`}>{tool.icon}</span>
                            <span className="flex-1 truncate">{tool.name}</span>
                            {activeToolId === tool.id && (
                              <div className="w-1 h-1 bg-white rounded-none"></div>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-3 text-[10px] uppercase tracking-widest text-neutral-600 italic">No tools developed yet</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex-1"></div>

        <div className="flex items-center gap-4 text-neutral-500 mr-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-none bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-mono opacity-50 uppercase tracking-tighter">v1.0.0-BETA</span>
            </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>

      {/* Status Bar / Tray Simulation */}
      <footer className="h-6 border-t border-neutral-800 bg-[#070707] flex items-center px-4 justify-between text-[11px] text-neutral-600">
        <div className="flex gap-4">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-none bg-neutral-800"></span>
            Ready
          </span>
          <span className="opacity-50">UTF-8</span>
          {activeToolId && (
            <span className="text-neutral-500 flex items-center gap-1">
              <span className="opacity-30">/</span>
              {TOOLS.find(t => t.id === activeToolId)?.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="uppercase tracking-widest text-[9px] font-bold">System Tray Active</span>
          <div className="flex gap-1">
             <div className="w-3 h-3 border border-neutral-800"></div>
             <div className="w-3 h-3 border border-neutral-800"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
