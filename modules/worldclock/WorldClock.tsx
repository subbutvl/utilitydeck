
import React, { useState, useEffect, useMemo } from 'react';

interface ClockProps {
  timezone: string;
  onRemove?: () => void;
  isMain?: boolean;
  sharedLocations?: string[];
}

const getCountryCode = (tz: string): string | null => {
  const map: Record<string, string> = {
    'America/Chicago': 'us', 'America/New_York': 'us', 'America/Los_Angeles': 'us', 
    'Europe/London': 'gb', 'Europe/Paris': 'fr', 'Asia/Tokyo': 'jp', 'Asia/Kolkata': 'in',
    'UTC': 'un'
  };
  if (map[tz]) return map[tz];
  return 'un';
};

const FlagImage: React.FC<{ code: string | null; className?: string }> = ({ code, className = "w-5 h-3.5" }) => (
  <div className={`${className} bg-neutral-800 flex items-center justify-center text-[8px] border border-neutral-700 shrink-0`}>
    <img src={`https://flagcdn.com/w40/${(code || 'un').toLowerCase()}.png`} className="object-cover w-full h-full" alt="" onError={(e) => (e.target as any).style.display='none'} />
  </div>
);

const TimezoneClock: React.FC<ClockProps> = ({ timezone, onRemove, isMain = false, sharedLocations = [] }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatter = useMemo(() => new Intl.DateTimeFormat('en-US', {
    timeZone: timezone, hour: 'numeric', minute: '2-digit', hour12: true,
  }), [timezone]);

  const parts = formatter.formatToParts(time);
  const hourValue = parts.find(p => p.type === 'hour')?.value || '0';
  const minuteValue = parts.find(p => p.type === 'minute')?.value || '00';
  const amPmValue = parts.find(p => p.type === 'dayPeriod')?.value || '';
  
  const hr24 = parseInt(new Intl.DateTimeFormat('en-US', { timeZone: timezone, hour: '2-digit', hour12: false }).format(time));
  const isNight = hr24 >= 18 || hr24 < 6;

  return (
    <div className={`border border-neutral-800 bg-[#111] group relative flex flex-col transition-all ${isMain ? 'flex-1' : 'w-full md:w-96'}`}>
      <div className="p-8 pb-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
             <FlagImage code={getCountryCode(timezone)} className="w-8 h-5" />
             <div>
                <h3 className="text-sm uppercase font-black tracking-[0.2em] text-neutral-400">{timezone.split('/').pop()?.replace('_', ' ')}</h3>
                <p className="text-xs text-neutral-600 font-mono">{timezone}</p>
             </div>
          </div>
          {onRemove && (
            <button onClick={onRemove} className="text-neutral-700 hover:text-red-500 p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          )}
        </div>

        <div className="flex items-end gap-4">
          <div className="flex items-baseline gap-2">
            <span className={`font-mono leading-none tracking-tighter text-white ${isMain ? 'text-9xl' : 'text-7xl'}`}>
              {hourValue}:{minuteValue}
            </span>
            <span className={`font-black uppercase tracking-widest text-neutral-500 ${isMain ? 'text-2xl' : 'text-base'}`}>
              {amPmValue}
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-900 flex justify-between items-center">
          <span className="text-xs text-neutral-500 font-bold uppercase tracking-widest">
            {new Intl.DateTimeFormat('en-US', { timeZone: timezone, weekday: 'long', month: 'long', day: 'numeric' }).format(time)}
          </span>
          <div className="flex items-center gap-2">
             {isNight ? <span className="text-blue-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2">Night</span> : <span className="text-yellow-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2">Day</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export const WorldClock: React.FC = () => {
  const [pinned, setPinned] = useState<string[]>(['UTC', 'America/New_York', 'Asia/Tokyo', 'Europe/London']);
  const [search, setSearch] = useState('');
  const allTimezones = (Intl as any).supportedValuesOf('timeZone');

  return (
    <div className="h-full flex flex-col gap-8">
      <div className="bg-[#111] border border-neutral-800 p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="relative flex-1 w-full">
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Global Stations (e.g. London, Tokyo)..."
            className="w-full bg-black border border-neutral-800 p-4 pl-12 text-base focus:border-neutral-500 outline-none"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
        </div>
        <div className="text-xs uppercase font-black text-neutral-600 tracking-[0.3em] px-6 border-l border-neutral-800 h-10 flex items-center shrink-0">
          Sync Status: Active
        </div>
      </div>

      <div className="flex-1 overflow-auto space-y-12 pr-2 pb-20 no-scrollbar">
        <section>
          <div className="flex items-center gap-6 mb-6">
            <h2 className="text-xs uppercase tracking-[0.4em] font-black text-neutral-500 whitespace-nowrap">Local Link</h2>
            <div className="h-px w-full bg-neutral-900"></div>
          </div>
          <TimezoneClock timezone={Intl.DateTimeFormat().resolvedOptions().timeZone} isMain />
        </section>

        <section>
          <div className="flex items-center gap-6 mb-6">
            <h2 className="text-xs uppercase tracking-[0.4em] font-black text-neutral-500 whitespace-nowrap">Monitored Matrix</h2>
            <div className="h-px w-full bg-neutral-900"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pinned.map(tz => <TimezoneClock key={tz} timezone={tz} onRemove={() => setPinned(pinned.filter(t => t !== tz))} />)}
          </div>
        </section>
      </div>
    </div>
  );
};
