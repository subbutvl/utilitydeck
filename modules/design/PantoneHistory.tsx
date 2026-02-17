import React, { useState } from "react";

interface PantoneColor {
  year: string;
  name: string;
  code: string;
  hex: string;
  isTrend?: boolean;
}

const PANTONE_YEARS: PantoneColor[] = [
  // Future & Recent (Official)
  {
    year: "2026",
    name: "Eco-Digital Teal",
    code: "18-4537",
    hex: "#008B8B",
    isTrend: true
  }, // Placeholder as requested
  { year: "2025", name: "Mocha Mousse", code: "17-1230", hex: "#A47864" },
  { year: "2024", name: "Peach Fuzz", code: "13-1023", hex: "#FFBE98" },
  { year: "2023", name: "Viva Magenta", code: "18-1750", hex: "#BE3455" },
  { year: "2022", name: "Very Peri", code: "17-3938", hex: "#6667AB" },
  { year: "2021", name: "Ultimate Gray", code: "17-5104", hex: "#939597" },
  { year: "2021", name: "Illuminating", code: "13-0647", hex: "#F5DF4D" },
  { year: "2020", name: "Classic Blue", code: "19-4052", hex: "#0F4C81" },
  { year: "2019", name: "Living Coral", code: "16-1546", hex: "#FF6F61" },
  { year: "2018", name: "Ultra Violet", code: "18-3838", hex: "#5F4B8B" },
  { year: "2017", name: "Greenery", code: "15-0343", hex: "#88B04B" },
  { year: "2016", name: "Rose Quartz", code: "13-1520", hex: "#F7CAC9" },
  { year: "2016", name: "Serenity", code: "15-3919", hex: "#92A8D1" },
  { year: "2015", name: "Marsala", code: "18-1438", hex: "#955251" },
  { year: "2014", name: "Radiant Orchid", code: "18-3224", hex: "#B163A3" },
  { year: "2013", name: "Emerald", code: "17-5641", hex: "#009473" },
  { year: "2012", name: "Tangerine Tango", code: "17-1463", hex: "#DD4124" },
  { year: "2011", name: "Honeysuckle", code: "18-2120", hex: "#D65076" },
  { year: "2010", name: "Turquoise", code: "15-5519", hex: "#45B1E8" },
  { year: "2009", name: "Mimosa", code: "14-0848", hex: "#EFC050" },
  { year: "2008", name: "Blue Iris", code: "18-3943", hex: "#5B5EA6" },
  { year: "2007", name: "Chili Pepper", code: "19-1557", hex: "#9B2335" },
  { year: "2006", name: "Sand Dollar", code: "13-1106", hex: "#DECDBE" },
  { year: "2005", name: "Blue Turquoise", code: "15-5217", hex: "#53B0AE" },
  { year: "2004", name: "Tigerlily", code: "17-1456", hex: "#E2583E" },
  { year: "2003", name: "Aqua Sky", code: "14-4811", hex: "#7BC4C4" },
  { year: "2002", name: "True Red", code: "19-1664", hex: "#BF1932" },
  { year: "2001", name: "Fuchsia Rose", code: "17-2031", hex: "#C74375" },
  { year: "2000", name: "Cerulean Blue", code: "15-4020", hex: "#9BB7D4" },

  // Historical Trends (Pre-COTY Era)
  {
    year: "1999",
    name: "Millennium Blue",
    code: "18-4039",
    hex: "#007BA7",
    isTrend: true
  },
  {
    year: "1998",
    name: "Digital Grape",
    code: "19-3730",
    hex: "#663399",
    isTrend: true
  },
  {
    year: "1997",
    name: "Solar Flare",
    code: "14-0951",
    hex: "#FFCC00",
    isTrend: true
  },
  {
    year: "1996",
    name: "Cargo Green",
    code: "18-0523",
    hex: "#4B5320",
    isTrend: true
  },
  {
    year: "1995",
    name: "Velvet Plum",
    code: "19-3518",
    hex: "#614051",
    isTrend: true
  },
  {
    year: "1994",
    name: "Roasted Coffee",
    code: "19-1015",
    hex: "#4B3621",
    isTrend: true
  },
  {
    year: "1993",
    name: "Teal Lagoon",
    code: "17-5024",
    hex: "#008080",
    isTrend: true
  },
  {
    year: "1992",
    name: "Sunset Terracotta",
    code: "16-1526",
    hex: "#E2725B",
    isTrend: true
  },
  {
    year: "1991",
    name: "Dusty Rose",
    code: "17-1718",
    hex: "#DCAE96",
    isTrend: true
  },
  {
    year: "1990",
    name: "Slate Gray",
    code: "16-3916",
    hex: "#708090",
    isTrend: true
  },
  {
    year: "1989",
    name: "Electric Pink",
    code: "18-2043",
    hex: "#FF6EC7",
    isTrend: true
  },
  {
    year: "1988",
    name: "Ultra Blue",
    code: "19-4055",
    hex: "#4169E1",
    isTrend: true
  },
  {
    year: "1987",
    name: "Peach Pearl",
    code: "12-1006",
    hex: "#FFDAB9",
    isTrend: true
  },
  {
    year: "1986",
    name: "Mint Frost",
    code: "13-0116",
    hex: "#98FF98",
    isTrend: true
  },
  {
    year: "1985",
    name: "Rich Mauve",
    code: "18-3211",
    hex: "#E0B0FF",
    isTrend: true
  },
  {
    year: "1984",
    name: "Acid Lemon",
    code: "13-0640",
    hex: "#F5FB3D",
    isTrend: true
  },
  {
    year: "1983",
    name: "Dynasty Red",
    code: "19-1763",
    hex: "#DC143C",
    isTrend: true
  },
  {
    year: "1982",
    name: "Steel Blue",
    code: "17-4027",
    hex: "#4682B4",
    isTrend: true
  },
  {
    year: "1981",
    name: "Golden Marigold",
    code: "15-1164",
    hex: "#FFA700",
    isTrend: true
  },
  {
    year: "1980",
    name: "Burnt Orange",
    code: "18-1448",
    hex: "#CC5500",
    isTrend: true
  },
  {
    year: "1979",
    name: "Earth Green",
    code: "18-0130",
    hex: "#6B8E23",
    isTrend: true
  },
  {
    year: "1978",
    name: "Harvest Gold",
    code: "16-0948",
    hex: "#DAA520",
    isTrend: true
  },
  {
    year: "1977",
    name: "Cognac",
    code: "18-1421",
    hex: "#9A463D",
    isTrend: true
  },
  {
    year: "1976",
    name: "Avocado Green",
    code: "18-0430",
    hex: "#568203",
    isTrend: true
  }
];

export const PantoneHistory: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <div className="space-y-1">
          <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--text-muted)]">
            Chronological Archive (1976—2026)
          </h2>
          <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest font-medium">
            50 Years of Color Theory
          </p>
        </div>
        <div className="text-[10px] text-[var(--text-muted)] italic">
          Click swatch to copy hex
        </div>
      </div>

      <div className="flex-1 overflow-auto pr-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-12">
          {PANTONE_YEARS.map((color, idx) => (
            <div
              key={`${color.year}-${idx}`}
              onClick={() => handleCopy(color.hex)}
              className="bg-[var(--bg-card)] border border-[var(--border)] p-4 group hover:border-[var(--border-hover)] cursor-pointer transition-all relative overflow-hidden flex flex-col gap-4"
            >
              <div
                className="w-full h-32 border border-white/5 transition-transform group-hover:scale-[1.01] relative"
                style={{ backgroundColor: color.hex }}
              >
                {color.isTrend && (
                  <div className="absolute top-2 left-2 bg-[var(--bg-input)]/60 backdrop-blur-sm px-2 py-0.5 text-[7px] uppercase font-bold text-[var(--text-primary)]/70 tracking-widest">
                    {color.year === "2026" ? "Placeholder" : "Trend"}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <span
                    className={`text-[10px] font-bold tracking-widest ${color.year === "2026" ? "text-green-500" : "text-[var(--text-muted)]"}`}
                  >
                    {color.year}
                  </span>
                  <span className="text-[9px] font-mono text-[var(--text-muted)]">
                    {color.code}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-[var(--text-primary)] tracking-tight truncate">
                  {color.name}
                </h3>
                <code className="text-[10px] font-mono text-[var(--text-muted)] group-hover:text-[var(--text-muted)]">
                  {color.hex}
                </code>
              </div>

              {copied === color.hex && (
                <div className="absolute inset-0 bg-white flex flex-col items-center justify-center animate-in fade-in duration-200 z-10">
                  <span className="text-black text-[10px] uppercase font-bold tracking-widest">
                    Hex Copied
                  </span>
                  <span className="text-black/50 text-[12px] font-mono mt-1">
                    {color.hex}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[var(--bg-card)]/30 p-3 border border-[var(--border)] flex items-center justify-between">
        <span className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-widest">
          * Official selections from 2000-2025. Historical trends for 1976-1999.
        </span>
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-[var(--bg-hover)]"></div>
          <div className="w-2 h-2 bg-[var(--border)]"></div>
        </div>
      </div>
    </div>
  );
};
