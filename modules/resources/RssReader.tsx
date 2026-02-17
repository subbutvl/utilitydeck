
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
  // Design
  { id: 'smash', name: 'Smashing Magazine', category: 'Design', url: 'https://www.smashingmagazine.com/feed/' },
  { id: 'alist', name: 'A List Apart', category: 'Design', url: 'https://alistapart.com/main/feed/' },
  { id: 'uxcol', name: 'UX Collective', category: 'UX', url: 'https://uxdesign.cc/feed' },
  { id: 'nng', name: 'NNGroup (Nielsen)', category: 'UX', url: 'https://www.nngroup.com/articles/feed/main/' },
  
  // Coding & Dev
  { id: 'devto', name: 'DEV Community', category: 'Coding', url: 'https://dev.to/feed' },
  { id: 'hash', name: 'Hashnode', category: 'Coding', url: 'https://hashnode.com/res/rss.xml' },
  { id: 'csstr', name: 'CSS-Tricks', category: 'Development', url: 'https://css-tricks.com/feed/' },
  { id: 'infoq', name: 'InfoQ', category: 'Development', url: 'https://feed.infoq.com/' },
  
  // AI Tools
  { id: 'openai', name: 'OpenAI Blog', category: 'AI Tools', url: 'https://openai.com/news/rss.xml' },
  { id: 'googleai', name: 'Google AI Blog', category: 'AI Tools', url: 'https://machinelearning.apple.com/rss.xml' },
  { id: 'vergeai', name: 'The Verge (AI)', category: 'AI Tools', url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml' },

  // Tech & Vibe
  { id: 'tc', name: 'TechCrunch', category: 'Technology', url: 'https://techcrunch.com/feed/' },
  { id: 'verge', name: 'The Verge', category: 'Technology', url: 'https://www.theverge.com/rss/index.xml' },
  { id: 'hn', name: 'Hacker News', category: 'Vibe Coding', url: 'https://news.ycombinator.com/rss' },

  // Entertainment
  { id: 'deadline', name: 'Deadline', category: 'Movies', url: 'https://deadline.com/feed/' },
  { id: 'rt', name: 'Rotten Tomatoes', category: 'Movies', url: 'https://www.rottentomatoes.com/trending/rss' },
  { id: 'variety', name: 'Variety (TV)', category: 'TV Shows', url: 'https://variety.com/c/tv/feed/' },
  { id: 'ign', name: 'IGN News', category: 'Games', url: 'https://feeds.feedburner.com/ign/news' },
  { id: 'kotaku', name: 'Kotaku', category: 'Games', url: 'https://kotaku.com/rss' }
];

const CATEGORIES = ['All', 'Design', 'Coding', 'Development', 'AI Tools', 'Vibe Coding', 'Technology', 'UX', 'Movies', 'Games', 'TV Shows'];

export const RssReader: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [items, setItems] = useState<RssItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RssItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryFeeds = async (cat: string) => {
    setLoading(true);
    setError(null);
    setItems([]);
    
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
      setError("Intelligence hub connection failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryFeeds(activeCategory);
  }, [activeCategory]);

  return (
    <div className="h-full flex flex-col gap-6 relative">
      {/* Category Navigator */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-[var(--border)]/50 shrink-0">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 border shrink-0 text-[10px] uppercase font-bold tracking-widest transition-all ${
              activeCategory === cat ? 'bg-indigo-600 text-[var(--text-primary)] border-indigo-600' : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border-hover)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Stream */}
      <div className="flex-1 overflow-y-auto pr-1 pb-20 custom-scrollbar">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 py-40">
             <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
             <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-[0.3em] animate-pulse">Syncing Feed Matrix...</span>
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center opacity-40 py-40 text-center">
            <svg className="mb-4" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 16h.01"/><path d="M12 8v4"/><path d="M3 3h18v18H3z"/></svg>
            <p className="text-xs uppercase font-bold tracking-widest">{error}</p>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, idx) => (
              <div 
                key={item.guid || idx}
                onClick={() => setSelectedItem(item)}
                className="group bg-[var(--bg-card)] border border-[var(--border)] p-6 flex flex-col gap-4 cursor-pointer hover:border-indigo-500/50 transition-all duration-300 relative overflow-hidden"
              >
                <div className="flex justify-between items-start">
                   <span className="text-[9px] px-1.5 py-0.5 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)] font-bold uppercase tracking-tighter">
                     {item.sourceName}
                   </span>
                   <span className="text-[9px] font-mono text-[var(--text-muted)]">
                     {new Date(item.pubDate).toLocaleDateString()}
                   </span>
                </div>
                
                <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-indigo-400 transition-colors leading-relaxed line-clamp-2">
                  {item.title}
                </h3>

                <div className="text-xs text-[var(--text-muted)] line-clamp-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.description.replace(/<[^>]*>?/gm, '') }} />

                <div className="mt-auto pt-4 border-t border-[var(--border)] flex justify-between items-center">
                   <span className="text-[9px] uppercase font-bold text-[var(--text-muted)] tracking-widest">Read Summary</span>
                   <svg className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18 6-6-6-6"/><path d="M3 12h18"/></svg>
                </div>
                
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 p-1 opacity-10 group-hover:opacity-100 transition-opacity">
                   <div className="w-1.5 h-1.5 bg-indigo-500"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-10 uppercase tracking-[0.5em] py-40">
             Void Stream: No Active Data
          </div>
        )}
      </div>

      {/* Reader Overlay */}
      {selectedItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10 animate-in fade-in zoom-in-95 duration-200">
           <div className="absolute inset-0 bg-[var(--bg-input)]/90 backdrop-blur-md" onClick={() => setSelectedItem(null)} />
           
           <div className="relative w-full max-w-3xl max-h-[80vh] bg-[var(--bg-page)] border border-[var(--border)] flex flex-col shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-[var(--border)] flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] px-2 py-1 bg-[var(--bg-card)] text-indigo-400 border border-indigo-500/20 font-bold uppercase tracking-widest">
                       {selectedItem.sourceName}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">/ NEWS DATA /</span>
                 </div>
                 <button onClick={() => setSelectedItem(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                 <div className="space-y-4">
                    <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest">{new Date(selectedItem.pubDate).toUTCString()}</div>
                    <h2 className="text-3xl font-bold text-[var(--text-primary)] leading-tight tracking-tight">{selectedItem.title}</h2>
                    {selectedItem.author && <div className="text-xs text-[var(--text-muted)] italic">By {selectedItem.author}</div>}
                 </div>

                 <div className="prose prose-invert max-w-none text-[var(--text-primary)] leading-loose text-sm font-light">
                    <div dangerouslySetInnerHTML={{ __html: selectedItem.content || selectedItem.description }} />
                 </div>

                 <div className="pt-10 flex gap-4">
                    <a 
                      href={selectedItem.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="px-8 py-3 bg-white text-black text-[11px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors"
                    >
                      Visit Full Source
                    </a>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(selectedItem.link);
                        // Optional notification would go here
                      }}
                      className="px-6 py-3 border border-[var(--border)] text-[11px] text-[var(--text-muted)] font-bold uppercase tracking-widest hover:text-[var(--text-primary)] transition-colors"
                    >
                      Copy Link
                    </button>
                 </div>
              </div>
              
              <div className="p-4 bg-[var(--bg-card)] border-t border-[var(--border)] text-[9px] text-[var(--text-muted)] uppercase tracking-widest font-bold text-center">
                INTERNAL READER ACTIVE • SOURCE: {selectedItem.link}
              </div>
           </div>
        </div>
      )}

      {/* Global Status Footer */}
      <div className="bg-[var(--bg-card)]/30 p-3 border border-[var(--border)] text-[9px] text-[var(--text-muted)] uppercase tracking-widest font-bold text-center flex justify-center items-center gap-4">
        <span>Matrix Version: 1.2.0-LIVE</span>
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
        <span>RSS API Status: Healthy</span>
      </div>
    </div>
  );
};
