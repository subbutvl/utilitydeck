
import React, { useState, useEffect, useMemo } from 'react';

interface Resource {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  link: string;
  tags: string[];
}

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1WQZvOZIh4FHyTGKj_ukjYRyksBZpRqith-5by6pRvIU/export?format=csv';

/**
 * Robust CSV Parser for RFC 4180 compliance.
 */
const parseCSV = (text: string): string[][] => {
  const result: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(field);
        field = '';
      } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
        row.push(field);
        result.push(row);
        row = [];
        field = '';
        if (char === '\r') i++;
      } else {
        field += char;
      }
    }
  }

  if (field || row.length > 0) {
    row.push(field);
    result.push(row);
  }

  return result;
};

export const CuratedResources: React.FC = () => {
  const [data, setData] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(SHEET_URL);
        if (!response.ok) throw new Error('Handshake with Cloud Storage failed.');
        const text = await response.text();
        const rows = parseCSV(text);
        const parsed: Resource[] = rows.slice(1)
          .filter(row => row.length >= 2 && row[0].trim())
          .map(row => ({
            name: (row[0] || '').trim(),
            description: (row[1] || '').trim(),
            category: (row[2] || 'Uncategorized').trim(),
            subcategory: (row[3] || '').trim(),
            link: (row[4] || '#').trim(),
            tags: row[5] ? row[5].split(';').map(t => t.trim()).filter(Boolean) : []
          }));
        setData(parsed);
      } catch (err) {
        setError("Synchronization Error: The cloud database could not be reached.");
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
           <p className="text-sm uppercase font-bold text-neutral-500 tracking-[0.3em]">Establishing Cloud Link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="bg-[#111] border border-neutral-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative flex-1 w-full max-w-2xl">
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search verified technical assets..."
            className="w-full bg-black border border-neutral-800 p-4 pl-12 text-base text-white focus:border-indigo-500 outline-none transition-all placeholder:text-neutral-700"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0">
           <div className="flex bg-black border border-neutral-800 p-1">
              <button onClick={() => setViewMode('grid')} className={`p-2.5 transition-all ${viewMode === 'grid' ? 'bg-neutral-800 text-white' : 'text-neutral-600 hover:text-white'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
              </button>
              <button onClick={() => setViewMode('table')} className={`p-2.5 transition-all ${viewMode === 'table' ? 'bg-neutral-800 text-white' : 'text-neutral-600 hover:text-white'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
              </button>
           </div>
           <button onClick={() => { setSearch(''); setActiveCategory('All'); }} className="text-xs uppercase font-bold text-neutral-500 hover:text-white transition-colors tracking-widest">Clear</button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-neutral-800/50">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 border shrink-0 text-xs uppercase font-bold tracking-widest transition-all ${
              activeCategory === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-neutral-900/50 text-neutral-500 border-neutral-800 hover:border-neutral-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-1 pb-24 custom-scrollbar">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item, idx) => (
              <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer" className="group p-8 bg-[#111] border border-neutral-800 hover:border-indigo-500/40 transition-all duration-500 flex flex-col gap-6 relative overflow-hidden">
                <div className="space-y-2">
                  <span className="text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1 border border-indigo-500/20 font-black uppercase tracking-widest">
                    {item.subcategory || item.category}
                  </span>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors tracking-tight leading-tight">{item.name}</h3>
                </div>
                <p className="text-sm text-neutral-400 leading-relaxed line-clamp-4 font-medium italic">
                  {item.description}
                </p>
                <div className="mt-auto pt-6 flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[11px] text-neutral-500 bg-black/50 px-2 py-1 border border-neutral-900 font-mono uppercase tracking-tighter">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-indigo-500/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              </a>
            ))}
          </div>
        ) : (
          <div className="bg-[#111] border border-neutral-800 overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-black border-b border-neutral-800">
                <tr className="text-xs uppercase font-black text-neutral-500 tracking-[0.2em]">
                  <th className="p-6">Handled Asset</th>
                  <th className="p-6">Domain</th>
                  <th className="p-6">Intel Summary</th>
                  <th className="p-6 text-right">Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/30">
                {filteredData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-neutral-900/50 transition-colors group">
                    <td className="p-6 font-bold text-neutral-200 text-base">{item.name}</td>
                    <td className="p-6">
                      <span className="text-xs text-neutral-500 uppercase font-black">{item.category}</span>
                    </td>
                    <td className="p-6 text-sm text-neutral-400 max-w-md italic leading-relaxed">{item.description}</td>
                    <td className="p-6 text-right">
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 text-xs font-bold uppercase tracking-widest border-b border-indigo-500/20 pb-0.5">Launch</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-neutral-900/30 p-4 border border-neutral-800 flex items-center justify-between text-xs text-neutral-600 uppercase tracking-widest font-bold">
        <span>Protocol: REST/CSV • Assets Indexed: {data.length}</span>
        <span>Gateway: Google Sheets Cloud Sync</span>
      </div>
    </div>
  );
};
