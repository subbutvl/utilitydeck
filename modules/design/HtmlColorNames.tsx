
import React, { useState, useMemo } from 'react';

const HTML_COLORS = [
  { name: 'AliceBlue', hex: '#F0F8FF' }, { name: 'AntiqueWhite', hex: '#FAEBD7' }, { name: 'Aqua', hex: '#00FFFF' },
  { name: 'Aquamarine', hex: '#7FFFD4' }, { name: 'Azure', hex: '#F0FFFF' }, { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Bisque', hex: '#FFE4C4' }, { name: 'Black', hex: '#000000' }, { name: 'BlanchedAlmond', hex: '#FFEBCD' },
  { name: 'Blue', hex: '#0000FF' }, { name: 'BlueViolet', hex: '#8A2BE2' }, { name: 'Brown', hex: '#A52A2A' },
  { name: 'BurlyWood', hex: '#DEB887' }, { name: 'CadetBlue', hex: '#5F9EA0' }, { name: 'Chartreuse', hex: '#7FFF00' },
  { name: 'Chocolate', hex: '#D2691E' }, { name: 'Coral', hex: '#FF7F50' }, { name: 'CornflowerBlue', hex: '#6495ED' },
  { name: 'Cornsilk', hex: '#FFF8DC' }, { name: 'Crimson', hex: '#DC143C' }, { name: 'Cyan', hex: '#00FFFF' },
  { name: 'DarkBlue', hex: '#00008B' }, { name: 'DarkCyan', hex: '#008B8B' }, { name: 'DarkGoldenRod', hex: '#B8860B' },
  { name: 'DarkGray', hex: '#A9A9A9' }, { name: 'DarkGrey', hex: '#A9A9A9' }, { name: 'DarkGreen', hex: '#006400' },
  { name: 'DarkKhaki', hex: '#BDB76B' }, { name: 'DarkMagenta', hex: '#8B008B' }, { name: 'DarkOliveGreen', hex: '#556B2F' },
  { name: 'DarkOrange', hex: '#FF8C00' }, { name: 'DarkOrchid', hex: '#9932CC' }, { name: 'DarkRed', hex: '#8B0000' },
  { name: 'DarkSalmon', hex: '#E9967A' }, { name: 'DarkSeaGreen', hex: '#8FBC8F' }, { name: 'DarkSlateBlue', hex: '#483D8B' },
  { name: 'DarkSlateGray', hex: '#2F4F4F' }, { name: 'DarkSlateGrey', hex: '#2F4F4F' }, { name: 'DarkTurquoise', hex: '#00CED1' },
  { name: 'DarkViolet', hex: '#9400D3' }, { name: 'DeepPink', hex: '#FF1493' }, { name: 'DeepSkyBlue', hex: '#00BFFF' },
  { name: 'DimGray', hex: '#696969' }, { name: 'DimGrey', hex: '#696969' }, { name: 'DodgerBlue', hex: '#1E90FF' },
  { name: 'FireBrick', hex: '#B22222' }, { name: 'FloralWhite', hex: '#FFFAF0' }, { name: 'ForestGreen', hex: '#228B22' },
  { name: 'Fuchsia', hex: '#FF00FF' }, { name: 'Gainsboro', hex: '#DCDCDC' }, { name: 'GhostWhite', hex: '#F8F8FF' },
  { name: 'Gold', hex: '#FFD700' }, { name: 'GoldenRod', hex: '#DAA520' }, { name: 'Gray', hex: '#808080' },
  { name: 'Grey', hex: '#808080' }, { name: 'Green', hex: '#008000' }, { name: 'GreenYellow', hex: '#ADFF2F' },
  { name: 'HoneyDew', hex: '#F0FFF0' }, { name: 'HotPink', hex: '#FF69B4' }, { name: 'IndianRed', hex: '#CD5C5C' },
  { name: 'Indigo', hex: '#4B0082' }, { name: 'Ivory', hex: '#FFFFF0' }, { name: 'Khaki', hex: '#F0E68C' },
  { name: 'Lavender', hex: '#E6E6FA' }, { name: 'LavenderBlush', hex: '#FFF0F5' }, { name: 'LawnGreen', hex: '#7CFC00' },
  { name: 'LemonChiffon', hex: '#FFFACD' }, { name: 'LightBlue', hex: '#ADD8E6' }, { name: 'LightCoral', hex: '#F08080' },
  { name: 'LightCyan', hex: '#E0FFFF' }, { name: 'LightGoldenRodYellow', hex: '#FAFAD2' }, { name: 'LightGray', hex: '#D3D3D3' },
  { name: 'LightGrey', hex: '#D3D3D3' }, { name: 'LightGreen', hex: '#90EE90' }, { name: 'LightPink', hex: '#FFB6C1' },
  { name: 'LightSalmon', hex: '#FFA07A' }, { name: 'LightSeaGreen', hex: '#20B2AA' }, { name: 'LightSkyBlue', hex: '#87CEFA' },
  { name: 'LightSlateGray', hex: '#778899' }, { name: 'LightSlateGrey', hex: '#778899' }, { name: 'LightSteelBlue', hex: '#B0C4DE' },
  { name: 'LightYellow', hex: '#FFFFE0' }, { name: 'Lime', hex: '#00FF00' }, { name: 'LimeGreen', hex: '#32CD32' },
  { name: 'Linen', hex: '#FAF0E6' }, { name: 'Magenta', hex: '#FF00FF' }, { name: 'Maroon', hex: '#800000' },
  { name: 'MediumAquaMarine', hex: '#66CDAA' }, { name: 'MediumBlue', hex: '#0000CD' }, { name: 'MediumOrchid', hex: '#BA55D3' },
  { name: 'MediumPurple', hex: '#9370DB' }, { name: 'MediumSeaGreen', hex: '#3CB371' }, { name: 'MediumSlateBlue', hex: '#7B68EE' },
  { name: 'MediumSpringGreen', hex: '#00FA9A' }, { name: 'MediumTurquoise', hex: '#48D1CC' }, { name: 'MediumVioletRed', hex: '#C71585' },
  { name: 'MidnightBlue', hex: '#191970' }, { name: 'MintCream', hex: '#F5FFFA' }, { name: 'MistyRose', hex: '#FFE4E1' },
  { name: 'Moccasin', hex: '#FFE4B5' }, { name: 'NavajoWhite', hex: '#FFDEAD' }, { name: 'Navy', hex: '#000080' },
  { name: 'OldLace', hex: '#FDF5E6' }, { name: 'Olive', hex: '#808000' }, { name: 'OliveDrab', hex: '#6B8E23' },
  { name: 'Orange', hex: '#FFA500' }, { name: 'OrangeRed', hex: '#FF4500' }, { name: 'Orchid', hex: '#DA70D6' },
  { name: 'PaleGoldenRod', hex: '#EEE8AA' }, { name: 'PaleGreen', hex: '#98FB98' }, { name: 'PaleTurquoise', hex: '#AFEEEE' },
  { name: 'PaleVioletRed', hex: '#DB7093' }, { name: 'PapayaWhip', hex: '#FFEFD5' }, { name: 'PeachPuff', hex: '#FFDAB9' },
  { name: 'Peru', hex: '#CD853F' }, { name: 'Pink', hex: '#FFC0CB' }, { name: 'Plum', hex: '#DDA0DD' },
  { name: 'PowderBlue', hex: '#B0E0E6' }, { name: 'Purple', hex: '#800080' }, { name: 'RebeccaPurple', hex: '#663399' },
  { name: 'Red', hex: '#FF0000' }, { name: 'RosyBrown', hex: '#BC8F8F' }, { name: 'RoyalBlue', hex: '#4169E1' },
  { name: 'SaddleBrown', hex: '#8B4513' }, { name: 'Salmon', hex: '#FA8072' }, { name: 'SandyBrown', hex: '#F4A460' },
  { name: 'SeaGreen', hex: '#2E8B57' }, { name: 'SeaShell', hex: '#FFF5EE' }, { name: 'Sienna', hex: '#A0522D' },
  { name: 'Silver', hex: '#C0C0C0' }, { name: 'SkyBlue', hex: '#87CEEB' }, { name: 'SlateBlue', hex: '#6A5ACD' },
  { name: 'SlateGray', hex: '#708090' }, { name: 'SlateGrey', hex: '#708090' }, { name: 'Snow', hex: '#FFFAFA' },
  { name: 'SpringGreen', hex: '#00FF7F' }, { name: 'SteelBlue', hex: '#4682B4' }, { name: 'Tan', hex: '#D2B48C' },
  { name: 'Teal', hex: '#008080' }, { name: 'Thistle', hex: '#D8BFD8' }, { name: 'Tomato', hex: '#FF6347' },
  { name: 'Turquoise', hex: '#40E0D0' }, { name: 'Violet', hex: '#EE82EE' }, { name: 'Wheat', hex: '#F5DEB3' },
  { name: 'White', hex: '#FFFFFF' }, { name: 'WhiteSmoke', hex: '#F5F5F5' }, { name: 'Yellow', hex: '#FFFF00' },
  { name: 'YellowGreen', hex: '#9ACD32' }
];

type ColorFamily = 'All' | 'Red' | 'Orange' | 'Yellow' | 'Green' | 'Blue' | 'Purple' | 'Pink' | 'Brown' | 'Gray' | 'White';

const FAMILIES: { name: ColorFamily; color: string }[] = [
  { name: 'All', color: '#555' },
  { name: 'Red', color: '#ff4444' },
  { name: 'Orange', color: '#ffbb33' },
  { name: 'Yellow', color: '#ffea00' },
  { name: 'Green', color: '#00c851' },
  { name: 'Blue', color: '#33b5e5' },
  { name: 'Purple', color: '#aa66cc' },
  { name: 'Pink', color: '#ff80ab' },
  { name: 'Brown', color: '#795548' },
  { name: 'Gray', color: '#9e9e9e' },
  { name: 'White', color: '#ffffff' },
];

export const HtmlColorNames: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeFamily, setActiveFamily] = useState<ColorFamily>('All');
  const [copied, setCopied] = useState<string | null>(null);

  const getFamily = (hex: string): ColorFamily => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }

    const hue = h * 360;
    const sat = s * 100;
    const lum = l * 100;

    if (lum > 95) return 'White';
    if (sat < 12 || lum < 15) return 'Gray';
    if (hue < 20 || hue >= 340) return (lum < 30 || (hue < 20 && lum < 40)) ? 'Brown' : 'Red';
    if (hue < 45) return (lum < 40) ? 'Brown' : 'Orange';
    if (hue < 75) return 'Yellow';
    if (hue < 160) return 'Green';
    if (hue < 260) return 'Blue';
    if (hue < 300) return 'Purple';
    if (hue < 340) return 'Pink';
    return 'Gray';
  };

  const filtered = useMemo(() => {
    return HTML_COLORS.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.hex.toLowerCase().includes(search.toLowerCase());
      const matchesFamily = activeFamily === 'All' || getFamily(c.hex) === activeFamily;
      return matchesSearch && matchesFamily;
    });
  }, [search, activeFamily]);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {/* Color Family Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-[var(--border)]/50">
          {FAMILIES.map(f => (
            <button
              key={f.name}
              onClick={() => setActiveFamily(f.name)}
              className={`flex items-center gap-2 px-3 py-1.5 border transition-all shrink-0 text-[10px] uppercase font-bold tracking-widest ${
                activeFamily === f.name ? 'bg-white text-black border-white' : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border-hover)]'
              }`}
            >
              <div className="w-2 h-2" style={{ backgroundColor: f.color }}></div>
              {f.name}
            </button>
          ))}
        </div>

        <div className="relative">
          <input 
            type="text" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search W3C color names (e.g. 'Steel' or 'Cyan')..."
            className="w-full bg-[var(--bg-card)] border border-[var(--border)] p-4 text-sm text-[var(--text-primary)] focus:border-[var(--border-hover)] outline-none transition-colors"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto pr-1">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 pb-12">
          {filtered.map(c => (
            <div 
              key={c.name}
              className="bg-[var(--bg-card)] border border-[var(--border)] p-3 flex flex-col gap-3 group hover:border-[var(--border-hover)] transition-all cursor-pointer relative"
              onClick={() => handleCopy(c.name)}
            >
              <div 
                className="w-full aspect-square border border-white/5 shadow-inner"
                style={{ backgroundColor: c.hex }}
              />
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors block truncate tracking-widest">{c.name}</span>
                <code className="text-[9px] font-mono text-[var(--text-muted)] group-hover:text-[var(--text-muted)]">{c.hex}</code>
              </div>
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex flex-col gap-1 items-end">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleCopy(c.name); }}
                  className="text-[8px] bg-[var(--bg-input)]/60 px-1.5 py-0.5 text-[var(--text-primary)]/50 hover:text-[var(--text-primary)] uppercase font-bold tracking-tighter backdrop-blur-sm"
                >
                  Name
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleCopy(c.hex); }}
                  className="text-[8px] bg-[var(--bg-input)]/60 px-1.5 py-0.5 text-[var(--text-primary)]/50 hover:text-[var(--text-primary)] uppercase font-bold tracking-tighter backdrop-blur-sm"
                >
                  Hex
                </button>
              </div>

              {copied === c.name || copied === c.hex ? (
                <div className="absolute inset-0 bg-white flex flex-col items-center justify-center animate-in fade-in duration-200 z-10">
                  <span className="text-black text-[10px] uppercase font-bold tracking-widest">Copied!</span>
                </div>
              ) : null}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-[var(--border)] opacity-30 italic text-xs uppercase tracking-widest">
              No matching colors in this category
            </div>
          )}
        </div>
      </div>

      <div className="bg-[var(--bg-card)]/30 p-3 border border-[var(--border)] text-[10px] text-[var(--text-muted)] uppercase tracking-widest text-center font-bold">
        Found {filtered.length} colors. Reference for W3C standardized names.
      </div>
    </div>
  );
};
