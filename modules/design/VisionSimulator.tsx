
import React, { useState, useRef } from 'react';

type Deficiency = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

interface DeficiencyInfo {
  id: Deficiency;
  name: string;
  desc: string;
  affected: string;
  tips: string[];
}

export const VisionSimulator: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [activeDeficiency, setActiveDeficiency] = useState<Deficiency>('normal');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const deficiencies: DeficiencyInfo[] = [
    { 
      id: 'normal', 
      name: 'Normal Vision', 
      desc: 'Baseline vision for reference.',
      affected: 'None',
      tips: ['Ensure your design follows standard accessibility best practices.', 'Check contrast ratios regularly.']
    },
    { 
      id: 'protanopia', 
      name: 'Protanopia', 
      desc: 'Red-blindness (Long-wavelength cones are missing).',
      affected: 'Red appears as black. Certain shades of orange and green appear as yellow.',
      tips: [
        'Avoid using red as the only indicator for errors.',
        'Use distinct icons alongside colors to convey status.',
        'Distinguish elements with varying saturation or brightness.'
      ]
    },
    { 
      id: 'deuteranopia', 
      name: 'Deuteranopia', 
      desc: 'Green-blindness (Medium-wavelength cones are missing).',
      affected: 'Difficulty distinguishing between red and green. Greens appear beige.',
      tips: [
        'Ensure critical UI elements are not distinguished by red/green alone.',
        'Test your color palette against common CVD simulations.',
        'Use patterns or textures in charts instead of just colors.'
      ]
    },
    { 
      id: 'tritanopia', 
      name: 'Tritanopia', 
      desc: 'Blue-blindness (Short-wavelength cones are missing).',
      affected: 'Blue appears green. Yellow appears violet or light gray.',
      tips: [
        'Avoid relying on blue/yellow contrast for navigation items.',
        'Ensure primary call-to-action buttons have high luminance contrast.',
        'Limit the use of blue/green gradients for critical data visualization.'
      ]
    },
    { 
      id: 'achromatopsia', 
      name: 'Achromatopsia', 
      desc: 'Total color blindness (Monochromacy).',
      affected: 'Only differences in brightness (luminance) are perceived.',
      tips: [
        'Prioritize high-contrast ratios between background and foreground.',
        'Use clear typography and layout hierarchy.',
        'Iconography must be self-explanatory without color context.'
      ]
    }
  ];

  const activeInfo = deficiencies.find(d => d.id === activeDeficiency)!;

  return (
    <div className="h-full flex flex-col gap-6">
      {/* SVG Filters for deficiency simulation */}
      <svg className="hidden">
        <defs>
          <filter id="protanopia">
            <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0" />
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0" />
          </filter>
          <filter id="tritanopia">
            <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0 0, 0.433, 0.567, 0, 0 0, 0.475, 0.525, 0, 0 0, 0, 0, 1, 0" />
          </filter>
          <filter id="achromatopsia">
            <feColorMatrix type="matrix" values="0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0, 0, 0, 1, 0" />
          </filter>
        </defs>
      </svg>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 pb-10">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-6">
            <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block border-b border-[var(--border)] pb-2">Simulation Settings</span>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 bg-[var(--bg-card)] border border-[var(--border)] text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Upload Test Image
            </button>
            <input type="file" ref={fileInputRef} onChange={handleUpload} accept="image/*" className="hidden" />

            <div className="space-y-1">
              {deficiencies.map(d => (
                <button
                  key={d.id}
                  onClick={() => setActiveDeficiency(d.id)}
                  className={`w-full text-left p-4 border transition-all ${activeDeficiency === d.id ? 'bg-white text-black border-white' : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border)]'}`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-1">{d.name}</div>
                  <div className={`text-[9px] italic leading-tight ${activeDeficiency === d.id ? 'text-black/60' : 'text-[var(--text-muted)]'}`}>{d.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-4">
            <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block border-b border-[var(--border)] pb-2">Diagnostic Info</span>
            
            <div>
              <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 block">Affected Range</label>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed italic">{activeInfo.affected}</p>
            </div>

            <div>
              <label className="text-[9px] uppercase text-[var(--text-muted)] mb-2 block">Designer Tips</label>
              <ul className="space-y-2">
                {activeInfo.tips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-[var(--text-muted)] flex gap-2">
                    <span className="text-[var(--text-primary)]">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 text-xs text-[var(--text-muted)] italic leading-relaxed">
            * This tool uses SVG color matrix filters to simulate how different color vision deficiencies perceive the uploaded visual content.
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col bg-[var(--bg-page)] border border-[var(--border)] relative overflow-hidden">
          {image ? (
            <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
              <img 
                src={image} 
                alt="Simulation preview" 
                className="max-w-full max-h-full object-contain shadow-2xl"
                style={{ filter: activeDeficiency === 'normal' ? 'none' : `url(#${activeDeficiency})` }}
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-[var(--text-muted)]">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
               <span className="text-[10px] uppercase tracking-widest font-bold">Upload an image to start simulation</span>
            </div>
          )}
          
          <div className="absolute top-4 left-4 text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold italic z-10">
            Preview: {activeDeficiency.toUpperCase()}
          </div>
          
          {image && (
            <button 
              onClick={() => setImage(null)}
              className="absolute top-4 right-4 text-[10px] uppercase text-[var(--text-muted)] hover:text-red-500 font-bold z-10"
            >
              Clear Image
            </button>
          )}

          {/* Color strip for visual reference */}
          <div className="h-2 flex w-full">
            {['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF', '#000000'].map(c => (
              <div key={c} className="flex-1" style={{ backgroundColor: c, filter: activeDeficiency === 'normal' ? 'none' : `url(#${activeDeficiency})` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
