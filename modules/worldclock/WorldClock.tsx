import React, { useState, useEffect, useMemo } from "react";

interface ClockProps {
  timezone: string;
  onRemove?: () => void;
  isMain?: boolean;
  sharedLocations?: string[];
}

const getCountryCode = (tz: string): string | null => {
  const map: Record<string, string> = {
    "America/Chicago": "us",
    "America/New_York": "us",
    "America/Los_Angeles": "us",
    "Europe/London": "gb",
    "Europe/Paris": "fr",
    "Asia/Tokyo": "jp",
    "Asia/Kolkata": "in",
    UTC: "un"
  };
  if (map[tz]) return map[tz];
  return "un";
};

const FlagImage: React.FC<{ code: string | null; className?: string }> = ({
  code,
  className = "w-4 h-3"
}) => {
  if (!code || code === "un") {
    return (
      <div
        className={`${className} bg-[var(--bg-hover)] flex items-center justify-center text-[8px] border border-[var(--border)] shrink-0`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="8"
          height="8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </div>
    );
  }

  // Generic EU flag for Europe prefix fallback
  const finalCode = code === "eu" ? "eu" : code.toLowerCase();

  return (
    <img
      src={`https://flagcdn.com/w40/${finalCode}.png`}
      srcSet={`https://flagcdn.com/w80/${finalCode}.png 2x`}
      className={`${className} object-cover border border-white/10 shrink-0 shadow-sm`}
      alt={code}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
};

const TimezoneClock: React.FC<ClockProps> = ({
  timezone,
  onRemove,
  isMain = false,
  sharedLocations = []
}) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      }),
    [timezone]
  );

  const parts = formatter.formatToParts(time);
  const hourValue = parts.find((p) => p.type === "hour")?.value || "0";
  const minuteValue = parts.find((p) => p.type === "minute")?.value || "00";
  const amPmValue = parts.find((p) => p.type === "dayPeriod")?.value || "";

  const hr24 = parseInt(
    new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      hour12: false
    }).format(time)
  );
  const isNight = hr24 >= 18 || hr24 < 6;

  return (
    <div
      className={`border border-[var(--border)] bg-[var(--bg-card)] group relative flex flex-col transition-all duration-300 ${isMain ? "flex-1" : "w-full md:w-80"}`}
    >
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <FlagImage code={getCountryCode(timezone)} className="w-6 h-4.5" />
            <div>
              <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--text-muted)]">
                {timezone.split("/").pop()?.replace("_", " ")}
              </h3>
              <p className="text-[9px] text-[var(--text-muted)] font-mono">
                {timezone}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {onRemove && (
              <button
                onClick={onRemove}
                className="text-[var(--text-muted)] hover:text-red-500 transition-colors"
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
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-end gap-3">
          <div className="flex items-baseline gap-1">
            <span
              className={`font-mono leading-none tracking-tighter text-[var(--text-primary)] ${isMain ? "text-7xl" : "text-5xl"}`}
            >
              {hourValue}:{minuteValue}
            </span>
            <span
              className={`font-bold uppercase tracking-widest text-[var(--text-muted)] ml-1 ${isMain ? "text-xl" : "text-sm"}`}
            >
              {amPmValue}
            </span>
          </div>

          <div className="flex flex-col gap-1 pb-1">
            <div className="flex items-center gap-2">
              {isNight ? (
                <span className="text-blue-400">
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
                </span>
              ) : (
                <span className="text-yellow-500">
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
                </span>
              )}
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)]">
                {isNight ? "Night" : "Day"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--border)] flex justify-between items-center">
          <span className="text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-tight">
            {dateFormatter.format(time)}
          </span>
        </div>
      </div>

      {/* Shared Regions Footer */}
      {!isMain && cleanedLocations.length > 0 && (
        <div className="bg-[#090909] border-t border-[var(--border)] p-4">
          <div className="text-[8px] uppercase font-bold text-[var(--text-muted)] tracking-widest mb-3 flex items-center gap-2">
            <div className="w-1 h-1 bg-[var(--bg-hover)]"></div>
            Regional Neighbors
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-3">
            {cleanedLocations.map((loc, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 group/loc transition-all cursor-default"
              >
                <FlagImage
                  code={loc.code}
                  className="w-4 h-3 shadow-sm grayscale group-hover/loc:grayscale-0 transition-all"
                />
                <span className="text-[12px] text-[var(--text-muted)] group-hover/loc:text-[var(--text-primary)] transition-colors whitespace-nowrap">
                  {loc.name}
                </span>
              </div>
            ))}
            {sharedLocations.length > 15 && (
              <span className="text-[10px] text-[var(--text-muted)] italic self-center">
                +{sharedLocations.length - 15} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const WorldClock: React.FC = () => {
  const [pinned, setPinned] = useState<string[]>([
    "UTC",
    "America/New_York",
    "Asia/Tokyo",
    "Europe/London"
  ]);
  const [search, setSearch] = useState("");
  const allTimezones = (Intl as any).supportedValuesOf("timeZone");

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Search Header */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Global Regions (e.g. Chicago, London, Tokyo)..."
            className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-3 pl-11 text-sm focus:border-[var(--border-hover)] outline-none transition-colors"
          />
          {search && (
            <div className="absolute top-full left-0 w-full bg-[var(--bg-card)] border border-[var(--border)] mt-1 z-50 shadow-2xl">
              <div className="p-2 border-b border-[var(--border)] bg-[var(--bg-card)] text-[9px] uppercase font-bold text-[var(--text-muted)] tracking-widest">
                Select IANA Location
              </div>
              {filtered.map((tz: string) => (
                <button
                  key={tz}
                  onClick={() => addTz(tz)}
                  className="w-full text-left p-3 text-xs hover:bg-[var(--bg-hover)] border-b border-[var(--border)] last:border-0 transition-colors flex justify-between items-center"
                >
                  <span className="flex items-center gap-3">
                    <FlagImage code={getCountryCode(tz)} />
                    {tz}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] opacity-0 hover:opacity-100">
                    + Add
                  </span>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="p-6 text-center space-y-2">
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">
                    No match found
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] italic">
                    Try a major hub like{" "}
                    <span className="text-[var(--text-primary)]">
                      "Chicago"
                    </span>{" "}
                    for Oklahoma time.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-widest px-4 border-l border-[var(--border)] h-8 flex items-center shrink-0">
          System: {defaultTz}
        </div>
      </div>

      <div className="flex-1 overflow-auto space-y-12 pr-2 pb-20 no-scrollbar">
        <section>
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--text-muted)] whitespace-nowrap">
              Local Station
            </h2>
            <div className="h-[1px] w-full bg-[var(--bg-card)]"></div>
          </div>
          <div className="flex">
            <TimezoneClock timezone={defaultTz} isMain />
          </div>
          <TimezoneClock
            timezone={Intl.DateTimeFormat().resolvedOptions().timeZone}
            isMain
          />
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 flex-1">
              <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--text-muted)] whitespace-nowrap">
                Monitored Zones
              </h2>
              <div className="h-[1px] w-full bg-[var(--bg-card)]"></div>
            </div>
            <span className="text-[10px] text-[var(--text-muted)] italic font-mono ml-4">
              {pinned.length} active
            </span>
          </div>
          <div className="flex flex-wrap gap-4">
            {pinned.map((tz) => (
              <TimezoneClock
                key={tz}
                timezone={tz}
                onRemove={() => removeTz(tz)}
                sharedLocations={getSharedZones(tz)}
              />
            ))}
            {pinned.length === 0 && (
              <div className="w-full h-32 border border-dashed border-[var(--border)] flex items-center justify-center opacity-30 italic text-xs uppercase tracking-widest">
                No active monitors.
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="bg-[var(--bg-card)]/30 p-3 border border-[var(--border)] text-[10px] text-[var(--text-muted)] uppercase tracking-[0.2em] font-bold text-center">
        * "Regional Neighbors" lists other major cities sharing the exact
        current time.
      </div>
    </div>
  );
};
