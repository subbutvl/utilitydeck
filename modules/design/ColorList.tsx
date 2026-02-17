
import React, { useState, useMemo } from 'react';

const COLORS = [
  { name: 'Absolute Zero', hex: '#0048BA' },
  { name: 'Acid Green', hex: '#B0BF1A' },
  { name: 'Aero', hex: '#7CB9E8' },
  { name: 'African Violet', hex: '#B284BE' },
  { name: 'Air Superiority Blue', hex: '#72A0C1' },
  { name: 'Alice Blue', hex: '#F0F8FF' },
  { name: 'Alizarin Crimson', hex: '#E32636' },
  { name: 'Almond', hex: '#EFDECD' },
  { name: 'Amaranth', hex: '#E52B50' },
  { name: 'Amazon', hex: '#3B7A57' },
  { name: 'Amber', hex: '#FFBF00' },
  { name: 'Amethyst', hex: '#9966CC' },
  { name: 'Anti-Flash White', hex: '#F2F3F4' },
  { name: 'Antique Brass', hex: '#CD9575' },
  { name: 'Antique Bronze', hex: '#665D1E' },
  { name: 'Antique Fuchsia', hex: '#915C83' },
  { name: 'Antique Ruby', hex: '#841B2D' },
  { name: 'Antique White', hex: '#FAEBD7' },
  { name: 'Ao', hex: '#008000' },
  { name: 'Apple Green', hex: '#8DB600' },
  { name: 'Apricot', hex: '#FBCEB1' },
  { name: 'Aqua', hex: '#00FFFF' },
  { name: 'Aquamarine', hex: '#7FFFD4' },
  { name: 'Arctic Lime', hex: '#D0FF14' },
  { name: 'Army Green', hex: '#4B5320' },
  { name: 'Artichoke', hex: '#8F9779' },
  { name: 'Arylide Yellow', hex: '#E9D66B' },
  { name: 'Ash Gray', hex: '#B2BEB5' },
  { name: 'Asparagus', hex: '#87A96B' },
  { name: 'Atomic Tangerine', hex: '#FF9966' },
  { name: 'Auburn', hex: '#A52A2A' },
  { name: 'Aureolin', hex: '#FDEE00' },
  { name: 'Avocado', hex: '#568203' },
  { name: 'Azure', hex: '#007FFF' },
  { name: 'Baby Blue', hex: '#89CFF0' },
  { name: 'Baby Pink', hex: '#F4C2C2' },
  { name: 'Baker-Miller Pink', hex: '#FF91AF' },
  { name: 'Banana Mania', hex: '#FAE7B5' },
  { name: 'Barbie Pink', hex: '#DA1884' },
  { name: 'Barn Red', hex: '#7C0A02' },
  { name: 'Battleship Grey', hex: '#848482' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: "B'Dazzled Blue", hex: '#2E5894' },
  { name: 'Big Dip O’Ruby', hex: '#9C2542' },
  { name: 'Bisque', hex: '#FFE4C4' },
  { name: 'Bistre', hex: '#3D2B1F' },
  { name: 'Bittersweet', hex: '#FE6F5E' },
  { name: 'Black', hex: '#000000' },
  { name: 'Blanched Almond', hex: '#FFEBCD' },
  { name: 'Blast Off Bronze', hex: '#A57164' },
  { name: 'Bleu De France', hex: '#318CE7' },
  { name: 'Blizzard Blue', hex: '#ACE5EE' },
  { name: 'Blood Red', hex: '#660000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Blue Bell', hex: '#A2A2D0' },
  { name: 'Blue Gray', hex: '#6699CC' },
  { name: 'Blue Green', hex: '#0D98BA' },
  { name: 'Blue Sapphire', hex: '#126180' },
  { name: 'Blue Violet', hex: '#8A2BE2' },
  { name: 'Blush', hex: '#DE5D83' },
  { name: 'Bole', hex: '#79443B' },
  { name: 'Bone', hex: '#E3DAC9' },
  { name: 'Bottle Green', hex: '#006A4E' },
  { name: 'Brandeis Blue', hex: '#0070FF' },
  { name: 'Brandy', hex: '#87413F' },
  { name: 'Brick Red', hex: '#CB4154' },
  { name: 'Bright Green', hex: '#66FF00' },
  { name: 'Bright Lilac', hex: '#D891EF' },
  { name: 'Bright Navy Blue', hex: '#1974D2' },
  { name: 'Bright Yellow', hex: '#FFAA1D' },
  { name: 'Brilliant Rose', hex: '#FF55A3' },
  { name: 'Brink Pink', hex: '#FB607F' },
  { name: 'British Racing Green', hex: '#004225' },
  { name: 'Bronze', hex: '#CD7F32' },
  { name: 'Brown', hex: '#964B00' },
  { name: 'Brunswick Green', hex: '#1B4D3E' },
  { name: 'Bubbles', hex: '#E7FEFF' },
  { name: 'Bud Green', hex: '#7BB661' },
  { name: 'Buff', hex: '#F0DC82' },
  { name: 'Burgundy', hex: '#800020' },
  { name: 'Burlywood', hex: '#DEB887' },
  { name: 'Burnished Brown', hex: '#A17A74' },
  { name: 'Burnt Orange', hex: '#CC5500' },
  { name: 'Burnt Sienna', hex: '#E97451' },
  { name: 'Burnt Umber', hex: '#8A3324' },
  { name: 'Byzantine', hex: '#BD33A4' },
  { name: 'Byzantium', hex: '#702963' },
  { name: 'Cadet', hex: '#536872' },
  { name: 'Cadet Blue', hex: '#5F9EA0' },
  { name: 'Cadet Grey', hex: '#91A3B0' },
  { name: 'Cadmium Green', hex: '#006B3C' },
  { name: 'Cadmium Orange', hex: '#ED872D' },
  { name: 'Cadmium Red', hex: '#E30022' },
  { name: 'Cadmium Yellow', hex: '#FFF600' },
  { name: 'Café Au Lait', hex: '#A67B5B' },
  { name: 'Café Noir', hex: '#4B3621' },
  { name: 'Cal Poly Pomona Green', hex: '#1E4D2B' },
  { name: 'Cambridge Blue', hex: '#A3C1AD' },
  { name: 'Camel', hex: '#C19A6B' },
  { name: 'Cameo Pink', hex: '#EFBBCC' },
  { name: 'Canary', hex: '#FFFF99' },
  { name: 'Canary Yellow', hex: '#FFEF00' },
  { name: 'Candy Apple Red', hex: '#FF0800' },
  { name: 'Candy Pink', hex: '#E4717A' },
  { name: 'Capri', hex: '#00BFFF' },
  { name: 'Caput Mortuum', hex: '#592720' },
  { name: 'Cardinal', hex: '#C41E3A' },
  { name: 'Caribbean Green', hex: '#00CC99' },
  { name: 'Carmine', hex: '#960018' },
  { name: 'Carnation Pink', hex: '#FFA6C9' },
  { name: 'Carnelian', hex: '#B31B1B' },
  { name: 'Carolina Blue', hex: '#56A0D3' },
  { name: 'Carrot Orange', hex: '#ED9121' },
  { name: 'Castleton Green', hex: '#00563F' },
  { name: 'Catawba', hex: '#703642' },
  { name: 'Cedar Chest', hex: '#C95A49' },
  { name: 'Celeste', hex: '#B2FFFF' },
  { name: 'Celtic Blue', hex: '#246BCE' },
  { name: 'Cerise', hex: '#DE3163' },
  { name: 'Cerulean', hex: '#007BA7' },
  { name: 'Cerulean Blue', hex: '#2A52BE' },
  { name: 'Cerulean Frost', hex: '#6D9BC3' },
  { name: 'CG Blue', hex: '#007AA5' },
  { name: 'CG Red', hex: '#E03C31' },
  { name: 'Chamoisee', hex: '#A0785A' },
  { name: 'Champagne', hex: '#F7E7CE' },
  { name: 'Charcoal', hex: '#36454F' },
  { name: 'Charleston Green', hex: '#232B2B' },
  { name: 'Charm Pink', hex: '#E68FAC' },
  { name: 'Chartreuse', hex: '#7FFF00' },
  { name: 'Cherry Blossom Pink', hex: '#FFB7C5' },
  { name: 'Chestnut', hex: '#954535' },
  { name: 'Chili Red', hex: '#E23D28' },
  { name: 'China Pink', hex: '#DE6FA1' },
  { name: 'China Rose', hex: '#A8516E' },
  { name: 'Chinese Red', hex: '#AA381E' },
  { name: 'Chinese Violet', hex: '#856088' },
  { name: 'Chocolate', hex: '#7B3F00' },
  { name: 'Chrome Yellow', hex: '#FFA700' },
  { name: 'Cinereous', hex: '#98817B' },
  { name: 'Cinnabar', hex: '#E34234' },
  { name: 'Cinnamon Citrine', hex: '#CD7F32' },
  { name: 'Citrine', hex: '#E4D00A' },
  { name: 'Citron', hex: '#9FA91F' },
  { name: 'Claret', hex: '#7F1734' },
  { name: 'Cobalt Blue', hex: '#0047AB' },
  { name: 'Coconut', hex: '#965A3E' },
  { name: 'Coffee', hex: '#6F4E37' },
  { name: 'Columbia Blue', hex: '#B9D9EB' },
  { name: 'Conditioner', hex: '#FFFFCC' },
  { name: 'Congo Pink', hex: '#F88379' },
  { name: 'Coquelicot', hex: '#FF3800' },
  { name: 'Copper', hex: '#B87333' },
  { name: 'Coral', hex: '#FF7F50' },
  { name: 'Coral Pink', hex: '#F88379' },
  { name: 'Coral Red', hex: '#FF4040' },
  { name: 'Cordovan', hex: '#893F45' },
  { name: 'Corn', hex: '#FBEC5D' },
  { name: 'Cornflower Blue', hex: '#6495ED' },
  { name: 'Cornsilk', hex: '#FFF8DC' },
  { name: 'Cosmic Cobalt', hex: '#2E2D88' },
  { name: 'Cosmic Latte', hex: '#FFF8E7' },
  { name: 'Coyote Brown', hex: '#82774B' },
  { name: 'Cotton Candy', hex: '#FFBCD9' },
  { name: 'Cream', hex: '#FFFDD0' },
  { name: 'Crimson', hex: '#DC143C' },
  { name: 'Cultured', hex: '#F5F5F5' },
  { name: 'Cyan', hex: '#00FFFF' },
  { name: 'Cyber Grape', hex: '#58427C' },
  { name: 'Cyber Yellow', hex: '#FFD300' },
  { name: 'Cyclamen', hex: '#F56FA1' },
  { name: 'Dandelion', hex: '#F0E130' },
  { name: 'Dark Blue', hex: '#00008B' },
  { name: 'Dark Blue-Gray', hex: '#666699' },
  { name: 'Dark Brown', hex: '#654321' },
  { name: 'Dark Byzantium', hex: '#5D3954' },
  { name: 'Dark Candy Apple Red', hex: '#A40000' },
  { name: 'Dark Cerulean', hex: '#08457E' },
  { name: 'Dark Chestnut', hex: '#986960' },
  { name: 'Dark Coral', hex: '#CD5B45' },
  { name: 'Dark Cyan', hex: '#008B8B' },
  { name: 'Dark Electric Blue', hex: '#536878' },
  { name: 'Dark Goldenrod', hex: '#B8860B' },
  { name: 'Dark Gray', hex: '#A9A9A9' },
  { name: 'Dark Green', hex: '#013220' },
  { name: 'Dark Jungle Green', hex: '#1A2421' },
  { name: 'Dark Khaki', hex: '#BDB76B' },
  { name: 'Dark Lava', hex: '#483C32' },
  { name: 'Dark Liver', hex: '#534B4F' },
  { name: 'Dark Magenta', hex: '#8B008B' },
  { name: 'Dark Medium Gray', hex: '#A9A9A9' },
  { name: 'Dark Midnight Blue', hex: '#003366' },
  { name: 'Dark Moss Green', hex: '#4A5D23' },
  { name: 'Dark Olive Green', hex: '#556B2F' },
  { name: 'Dark Orange', hex: '#FF8C00' },
  { name: 'Dark Orchid', hex: '#9932CC' },
  { name: 'Dark Pastel Green', hex: '#03C03C' },
  { name: 'Dark Pink', hex: '#E75480' },
  { name: 'Dark Powder Blue', hex: '#003399' },
  { name: 'Dark Puce', hex: '#4F3A3C' },
  { name: 'Dark Red', hex: '#8B0000' },
  { name: 'Dark Salmon', hex: '#E9967A' },
  { name: 'Dark Sea Green', hex: '#8FBC8F' },
  { name: 'Dark Slate Blue', hex: '#483D8B' },
  { name: 'Dark Slate Gray', hex: '#2F4F4F' },
  { name: 'Dark Spring Green', hex: '#177245' },
  { name: 'Dark Tan', hex: '#918151' },
  { name: 'Dark Turquoise', hex: '#00CED1' },
  { name: 'Dark Violet', hex: '#9400D3' },
  { name: 'Dartmouth Green', hex: '#00693E' },
  { name: 'Davy’s Grey', hex: '#555555' },
  { name: 'Deep Carmine', hex: '#A9203E' },
  { name: 'Deep Carmine Pink', hex: '#EF3038' },
  { name: 'Deep Carrot Orange', hex: '#E9692C' },
  { name: 'Deep Cerise', hex: '#DA3287' },
  { name: 'Deep Champagne', hex: '#FAD6A5' },
  { name: 'Deep Chestnut', hex: '#B94E48' },
  { name: 'Deep Coffee', hex: '#704241' },
  { name: 'Deep Fuchsia', hex: '#C154C1' },
  { name: 'Deep Jungle Green', hex: '#004B49' },
  { name: 'Deep Lemon', hex: '#F5C71A' },
  { name: 'Deep Lilac', hex: '#9955BB' },
  { name: 'Deep Magenta', hex: '#CC00CC' },
  { name: 'Deep Peach', hex: '#FFCBA4' },
  { name: 'Deep Pink', hex: '#FF1493' },
  { name: 'Deep Ruby', hex: '#843F5B' },
  { name: 'Deep Saffron', hex: '#FF9933' },
  { name: 'Deep Sky Blue', hex: '#00BFFF' },
  { name: 'Deep Space Sparkle', hex: '#4A646C' },
  { name: 'Deep Taupe', hex: '#7E5E60' },
  { name: 'Deep Tuscan Red', hex: '#66424D' },
  { name: 'Deer', hex: '#BA8759' },
  { name: 'Denim', hex: '#1560BD' },
  { name: 'Denim Blue', hex: '#2243B6' },
  { name: 'Desaturated Cyan', hex: '#669999' },
  { name: 'Desert', hex: '#C19A6B' },
  { name: 'Desert Sand', hex: '#EDC9AF' },
  { name: 'Desire', hex: '#EA3C53' },
  { name: 'Diamond', hex: '#B9F2FF' },
  { name: 'Dim Gray', hex: '#696969' },
  { name: 'Dingy Dungeon', hex: '#C53151' },
  { name: 'Dirt', hex: '#9B7653' },
  { name: 'Dodger Blue', hex: '#1E90FF' },
  { name: 'Dogwood Rose', hex: '#D71868' },
  { name: 'Drab', hex: '#967117' },
  { name: 'Duke Blue', hex: '#00009C' },
  { name: 'Dust Storm', hex: '#E5CCC9' },
  { name: 'Dutch White', hex: '#EFDFBB' },
  { name: 'Earth Yellow', hex: '#E1A95F' },
  { name: 'Ebony', hex: '#555D50' },
  { name: 'Ecru', hex: '#C2B280' },
  { name: 'Eerie Black', hex: '#1B1B1B' },
  { name: 'Eggplant', hex: '#614051' },
  { name: 'Eggshell', hex: '#F0EAD6' },
  { name: 'Egyptian Blue', hex: '#1034A6' },
  { name: 'Electric Blue', hex: '#7DF9FF' },
  { name: 'Electric Indigo', hex: '#6F00FF' },
  { name: 'Electric Lime', hex: '#CCFF00' },
  { name: 'Electric Purple', hex: '#BF00FF' },
  { name: 'Electric Violet', hex: '#8F00FF' },
  { name: 'Emerald', hex: '#50C878' },
  { name: 'Eminence', hex: '#6C3082' },
  { name: 'English Lavender', hex: '#B48395' },
  { name: 'English Red', hex: '#AB4B52' },
  { name: 'English Vermillion', hex: '#CC474B' },
  { name: 'English Violet', hex: '#563C5C' },
  { name: 'Eton Blue', hex: '#96C8A2' },
  { name: 'Eucalyptus', hex: '#44D7A8' },
  { name: 'Fallow', hex: '#C19A6B' },
  { name: 'Falu Red', hex: '#801818' },
  { name: 'Fandango', hex: '#B53389' },
  { name: 'Fandango Pink', hex: '#DE5285' },
  { name: 'Fashion Fuchsia', hex: '#F400A1' },
  { name: 'Fawn', hex: '#E5AA70' },
  { name: 'Feldgrau', hex: '#4D5D53' },
  { name: 'Feldspar', hex: '#FDD5B1' },
  { name: 'Fern Green', hex: '#4F7942' },
  { name: 'Ferrari Red', hex: '#FF2800' },
  { name: 'Field Drab', hex: '#6C541E' },
  { name: 'Fiery Rose', hex: '#FF5470' },
  { name: 'Firebrick', hex: '#B22222' },
  { name: 'Fire Engine Red', hex: '#CE2029' },
  { name: 'Flame', hex: '#E25822' },
  { name: 'Flamingo Pink', hex: '#FC8EAC' },
  { name: 'Flattery', hex: '#6B4423' },
  { name: 'Flax', hex: '#EEDC82' },
  { name: 'Flirt', hex: '#A2006D' },
  { name: 'Floral White', hex: '#FFFAF0' },
  { name: 'Fluorescent Pink', hex: '#FF1493' },
  { name: 'Forest Green', hex: '#228B22' },
  { name: 'French Beige', hex: '#A67B5B' },
  { name: 'French Bistre', hex: '#856D4D' },
  { name: 'French Blue', hex: '#0072BB' },
  { name: 'French Fuchsia', hex: '#FD3F92' },
  { name: 'French Lilac', hex: '#86608E' },
  { name: 'French Lime', hex: '#9EFD38' },
  { name: 'French Mauve', hex: '#D473D4' },
  { name: 'French Pink', hex: '#FD6C9E' },
  { name: 'French Puce', hex: '#4E1609' },
  { name: 'French Raspberry', hex: '#C72C48' },
  { name: 'French Rose', hex: '#F64A8A' },
  { name: 'French Sky Blue', hex: '#77B5FE' },
  { name: 'French Violet', hex: '#8806CE' },
  { name: 'French Wine', hex: '#AC1E44' },
  { name: 'Fresh Air', hex: '#A6E7FF' },
  { name: 'Fuchsia', hex: '#FF00FF' },
  { name: 'Fuchsia Pink', hex: '#FF77FF' },
  { name: 'Fulvous', hex: '#E48400' },
  { name: 'Fuzzy Wuzzy', hex: '#CC6666' }
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

export const ColorList: React.FC = () => {
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
    return COLORS.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.hex.toLowerCase().includes(search.toLowerCase());
      const matchesFamily = activeFamily === 'All' || getFamily(c.hex) === activeFamily;
      return matchesSearch && matchesFamily;
    });
  }, [search, activeFamily]);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
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
            placeholder="Search colors by name or hex (e.g. 'Azure' or '#FF')..."
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
              key={c.hex}
              onClick={() => handleCopy(c.hex)}
              className="bg-[var(--bg-card)] border border-[var(--border)] p-3 flex flex-col gap-3 transition-all hover:border-[var(--border-hover)] cursor-pointer group relative overflow-hidden"
            >
              <div 
                className="w-full aspect-square border border-white/5 shadow-inner transition-transform group-hover:scale-[1.02]"
                style={{ backgroundColor: c.hex }}
              />
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors block truncate tracking-widest">{c.name}</span>
                <code className="text-[9px] font-mono text-[var(--text-muted)] group-hover:text-[var(--text-muted)]">{c.hex}</code>
              </div>
              
              {copied === c.hex && (
                <div className="absolute inset-0 bg-white flex flex-col items-center justify-center animate-in fade-in duration-200 z-10">
                  <span className="text-black text-[10px] uppercase font-bold tracking-widest">Copied!</span>
                </div>
              )}
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
        Showing {filtered.length} curated colors. Click to copy hex code.
      </div>
    </div>
  );
};
