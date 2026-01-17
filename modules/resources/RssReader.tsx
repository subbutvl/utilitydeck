
import React, { useState, useEffect, useMemo } from 'react';

interface RssItem {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  sourceName?: string;
}

interface Feed {
  id: string;
  name: string;
  category: string;
  url: string;
}

const FEEDS: Feed[] = [
  { id: 'smash', name: 'Smashing Magazine', category: 'Design', url: 'https://www.smashingmagazine.com/feed/' },
  { id: 'devto', name: 'DEV Community', category: 'Coding', url: 'https://dev.to/feed' },
  { id: 'verge', name: 'The Verge', category: 'Technology', url: 'https://www.theverge.com/rss/index.xml' },
  { id: 'hn', name: 'Hacker News', category: 'Vibe Coding', url: 'https://news.ycombinator.com/rss' }
];

const CATEGORIES = ['All', 'Design', 'Coding', 'Technology', 'UX', 'Movies', 'Games'];

export const RssReader: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [items, setItems] = useState<RssItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RssItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryFeeds = async (cat: string) => {
    setLoading(true);
    setError(null);
    const targetFeeds = cat === 'All' ? FEEDS : FEEDS.filter(f => f.category === cat);
    try {
      const allPromises = targetFeeds.map(async (feed) => {
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`);
        const data = await response.json();
        if (data.status === 'ok') {
          return data.items.map((item: any) => ({ ...item, sourceName: feed.name }));
        }
        return [];
      });
      const results = await Promise.all(allPromises);
      const flattened = results.flat().sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
      setItems(flattened);
    } catch (err) {
      setError("Intelligence hub connection failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryFeeds(activeCategory);
  }, [activeCategory]);

  return (
    <div className="h-full flex flex-col gap-6 relative">
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-neutral-800/50 shrink-0">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 border shrink-0 text-xs uppercase font-bold tracking-widest transition-all ${
              activeCategory === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-neutral-900 text-neutral-500 border-neutral-800 hover:border-neutral-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-1 pb-20 custom-scrollbar">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center py-40">
             <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 animate-spin mb-4" />
             <span className="text-sm uppercase font-bold text-neutral-500 tracking-[0.3em]">Syncing Feed Matrix...</span>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item, idx) => (
              <div key={idx} onClick={() => setSelectedItem(item)} className="group bg-[#111] border border-neutral-800 p-8 flex flex-col gap-5 cursor-pointer hover:border-indigo-500/50 transition-all duration-300">
                <div className="flex justify-between items-start">
                   <span className="text-xs px-2 py-1 bg-neutral-900 border border-neutral-800 text-indigo-400 font-bold uppercase tracking-tighter">
                     {item.sourceName}
                   </span>
                   <span className="text-xs font-mono text-neutral-600">
                     {new Date(item.pubDate).toLocaleDateString()}
                   </span>
                </div>
                <h3 className="text-lg font-bold text-neutral-200 group-hover:text-indigo-400 transition-colors leading-snug line-clamp-2">
                  {item.title}
                </h3>
                <div className="text-sm text-neutral-500 line-clamp-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.description.replace(/<[^>]*>?/gm, '') }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center opacity-10 uppercase tracking-[0.5em] py-40">Void Stream</div>
        )}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setSelectedItem(null)} />
           <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0a0a0a] border border-neutral-800 flex flex-col shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-neutral-800 flex justify-between items-center">
                 <h2 className="text-sm px-3 py-1 bg-neutral-900 text-indigo-400 font-bold uppercase tracking-widest">{selectedItem.sourceName}</h2>
                 <button onClick={() => setSelectedItem(null)} className="text-neutral-500 hover:text-white p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                 </button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar">
                 <div className="space-y-4">
                    <div className="text-xs uppercase font-bold text-neutral-600 tracking-widest">{new Date(selectedItem.pubDate).toUTCString()}</div>
                    <h2 className="text-4xl font-bold text-white leading-tight tracking-tight">{selectedItem.title}</h2>
                 </div>
                 <div className="prose prose-invert max-w-none text-base text-neutral-300 leading-relaxed font-light">
                    <div dangerouslySetInnerHTML={{ __html: selectedItem.content || selectedItem.description }} />
                 </div>
                 <div className="pt-12 flex gap-6">
                    <a href={selectedItem.link} target="_blank" rel="noopener noreferrer" className="px-10 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all">Visit Full Source</a>
                    <button onClick={() => navigator.clipboard.writeText(selectedItem.link)} className="px-10 py-4 border border-neutral-800 text-xs text-neutral-400 font-bold uppercase tracking-widest hover:text-white transition-all">Copy Link</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
