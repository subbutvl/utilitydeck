
import React, { useState, useEffect, useMemo } from 'react';

interface Resource {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  link: string;
  tags: string[];
}

export const CuratedResources: React.FC = () => {
  const [data, setData] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('./data.csv');
        const text = await response.text();
        
        // Simple CSV Parser (handles basic quoting)
        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const parsed: Resource[] = lines.slice(1).map(line => {
          // Splitting logic that handles commas inside quotes (simple version)
          const regex = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
          const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
          const cleanValues = values.map(v => v.replace(/^"|"$/g, '').trim());
          
          return {
            name: cleanValues[0] || 'Unknown',
            description: cleanValues[1] || '',
            category: cleanValues[2] || 'Uncategorized',
            subcategory: cleanValues[3] || '',
            link: cleanValues[4] || '#',
            tags: cleanValues[5] ? cleanValues[5].split(';').map(t => t.trim()) : []
          };
        });

        setData(parsed);
      } catch (err) {
        console.error("Failed to load CSV:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(data.map(d => d.category));
    return ['All', ...Array.from(set)].sort();
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(search.toLowerCase()) || 
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      
      const matchesCat = activeCategory === 'All' || item.category === activeCategory;
      
      return matchesSearch && matchesCat;
    });
  }, [data, search, activeCategory]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
           <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 animate-spin mx-auto" />
           <p className="text-[10px] uppercase font-bold text-neutral-600 tracking-[0.3em]">Parsing Database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Search and Global Controls */}
      <div className="bg-[#111] border border-neutral-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative flex-1 w-full max-w-xl">
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources, tags, or tools..."
            className="w-full bg-black border border-neutral-800 p-3 pl-11 text-sm text-white focus:border-indigo-500 outline-none transition-all"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
           <div className="flex border border-neutral-800 p-1 bg-black">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-all ${viewMode === 'grid' ? 'bg-neutral-800 text-white' : 'text-neutral-600 hover:text-white'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={`p-2 transition-all ${viewMode === 'table' ? 'bg-neutral-800 text-white' : 'text-neutral-600 hover:text-white'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
              </button>
           </div>
           <button 
            onClick={() => { setSearch(''); setActiveCategory('All'); }}
            className="text-[10px] uppercase font-bold text-neutral-600 hover:text-red-500 transition-colors"
           >
             Reset Filters
           </button>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-neutral-800/50">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 border shrink-0 text-[10px] uppercase font-bold tracking-widest transition-all ${
              activeCategory === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-neutral-900 text-neutral-500 border-neutral-800 hover:border-neutral-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content View */}
      <div className="flex-1 overflow-y-auto pr-1 pb-20">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((item, idx) => (
              <a 
                key={idx} 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group p-6 bg-[#111] border border-neutral-800 hover:border-indigo-500/50 transition-all duration-300 flex flex-col gap-4 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 border border-indigo-500/20 font-bold uppercase tracking-tighter">
                      {item.subcategory || item.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">{item.name}</h3>
                </div>

                <p className="text-xs text-neutral-500 leading-relaxed line-clamp-3">
                  {item.description}
                </p>

                <div className="mt-auto pt-4 flex flex-wrap gap-1.5">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[9px] text-neutral-600 bg-neutral-900 px-1.5 py-0.5 border border-neutral-800 font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="bg-[#111] border border-neutral-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-black border-b border-neutral-800">
                <tr className="text-[10px] uppercase font-bold text-neutral-600 tracking-widest">
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {filteredData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-neutral-900 transition-colors group">
                    <td className="p-4 font-bold text-neutral-200 text-sm">{item.name}</td>
                    <td className="p-4">
                      <span className="text-[10px] text-neutral-500 uppercase">{item.category}</span>
                    </td>
                    <td className="p-4 text-xs text-neutral-500 max-w-xs truncate">{item.description}</td>
                    <td className="p-4 text-right">
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 text-[10px] font-bold uppercase tracking-widest">Visit</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredData.length === 0 && (
          <div className="py-20 text-center border border-dashed border-neutral-800 opacity-20 italic text-xl uppercase tracking-[0.5em]">
            No Resources Found
          </div>
        )}
      </div>

      <div className="bg-neutral-900/30 p-3 border border-neutral-800 text-[9px] text-neutral-700 uppercase tracking-widest font-bold text-center">
        Database version: 2025.04.1 • Source: local system data.csv
      </div>
    </div>
  );
};
