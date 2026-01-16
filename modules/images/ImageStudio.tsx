
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";

// Fix: Added missing IconSparkles component
const IconSparkles = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;

interface StudioState {
  image: string | null;
  aspectRatio: string;
  watermarkType: 'text' | 'image' | 'none';
  watermarkText: string;
  watermarkImg: string | null;
  watermarkScale: number;
  watermarkOpacity: number;
  watermarkFilter: string;
  zoom: number;
  watermarkPos: { x: number; y: number };
}

const INITIAL_STATE: StudioState = {
  image: null,
  aspectRatio: 'original',
  watermarkType: 'none',
  watermarkText: 'SWISS KNIFE',
  watermarkImg: null,
  watermarkScale: 0.2,
  watermarkOpacity: 0.5,
  watermarkPos: { x: 80, y: 80 },
  watermarkFilter: 'none',
  zoom: 1
};

export const ImageStudio: React.FC = () => {
  const [state, setState] = useState<StudioState>(INITIAL_STATE);
  const [history, setHistory] = useState<StudioState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const watermarkInputRef = useRef<HTMLInputElement>(null);

  const saveToHistory = useCallback((newState: StudioState) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    if (newHistory.length > 20) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const updateState = (update: Partial<StudioState>, skipHistory = false) => {
    const newState = { ...state, ...update };
    setState(newState);
    if (!skipHistory) saveToHistory(newState);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setState(prev);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setState(next);
    }
  };

  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !state.image) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mainImg = new Image();
    mainImg.src = state.image;
    await new Promise(r => mainImg.onload = r);

    // Handle Aspect Ratio
    let targetWidth = mainImg.width;
    let targetHeight = mainImg.height;

    if (state.aspectRatio !== 'original') {
      const [w, h] = state.aspectRatio.split(':').map(Number);
      const ratio = w / h;
      if (mainImg.width / mainImg.height > ratio) {
        targetWidth = mainImg.height * ratio;
      } else {
        targetHeight = mainImg.width / ratio;
      }
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    ctx.drawImage(mainImg, (mainImg.width - targetWidth) / 2, (mainImg.height - targetHeight) / 2, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);

    // Apply Watermark
    if (state.watermarkType !== 'none') {
      ctx.globalAlpha = state.watermarkOpacity;
      ctx.filter = state.watermarkFilter === 'invert' ? 'invert(1)' : state.watermarkFilter === 'grayscale' ? 'grayscale(1)' : 'none';
      
      const posX = (state.watermarkPos.x / 100) * targetWidth;
      const posY = (state.watermarkPos.y / 100) * targetHeight;

      if (state.watermarkType === 'text') {
        ctx.font = `bold ${Math.round(targetWidth * 0.05 * state.watermarkScale * 5)}px Inter`;
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(state.watermarkText, posX, posY);
      } else if (state.watermarkType === 'image' && state.watermarkImg) {
        const wmImg = new Image();
        wmImg.src = state.watermarkImg;
        await new Promise(r => wmImg.onload = r);
        const wmW = targetWidth * state.watermarkScale;
        const wmH = (wmImg.height / wmImg.width) * wmW;
        ctx.drawImage(wmImg, posX - wmW / 2, posY - wmH / 2, wmW, wmH);
      }
      ctx.globalAlpha = 1;
      ctx.filter = 'none';
    }
  }, [state]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleMainUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => updateState({ image: ev.target?.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleWatermarkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => updateState({ watermarkImg: ev.target?.result as string, watermarkType: 'image' });
      reader.readAsDataURL(file);
    }
  };

  const handleAiEdit = async () => {
    if (!state.image || !aiPrompt) return;
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = state.image.split(',')[1];
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: 'image/png' } },
            { text: `Modify this image based on: ${aiPrompt}. Maintain resolution. Return only the edited image part.` }
          ]
        }
      });
      
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          updateState({ image: `data:image/png;base64,${part.inlineData.data}` });
          setAiPrompt('');
          break;
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `swissknife-studio-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-4 overflow-y-auto pr-2 pb-10">
          <div className="bg-[#111] border border-neutral-800 p-6 space-y-6">
             <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Workspace Controls</span>
                <div className="flex gap-2">
                   <button onClick={undo} disabled={historyIndex <= 0} className="p-1 hover:text-white disabled:opacity-20 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-15 9 9 0 0 0-6 2.3L3 13"/></svg>
                   </button>
                   <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-1 hover:text-white disabled:opacity-20 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-15 9 9 0 0 1 6 2.3L21 13"/></svg>
                   </button>
                </div>
             </div>

             {!state.image ? (
               <button onClick={() => fileInputRef.current?.click()} className="w-full py-10 border-2 border-dashed border-neutral-800 text-[11px] uppercase tracking-widest font-bold text-neutral-600 hover:border-neutral-500 hover:text-white transition-all">Upload Main Image</button>
             ) : (
               <div className="space-y-6">
                  <div>
                    <label className="text-[9px] uppercase text-neutral-600 mb-2 block tracking-widest">Aspect Ratio</label>
                    <div className="grid grid-cols-3 gap-1">
                       {['original', '1:1', '16:9', '9:16', '4:3', '3:2'].map(r => (
                         <button key={r} onClick={() => updateState({ aspectRatio: r })} className={`py-1.5 text-[9px] uppercase border transition-all ${state.aspectRatio === r ? 'bg-white text-black border-white' : 'bg-black text-neutral-500 border-neutral-800'}`}>{r}</button>
                       ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase text-neutral-600 mb-2 block tracking-widest">Watermark Type</label>
                    <div className="flex border border-neutral-800 p-1">
                       {(['none', 'text', 'image'] as const).map(t => (
                         <button key={t} onClick={() => updateState({ watermarkType: t })} className={`flex-1 py-1 text-[9px] uppercase font-bold tracking-widest transition-all ${state.watermarkType === t ? 'bg-neutral-800 text-white' : 'text-neutral-600'}`}>{t}</button>
                       ))}
                    </div>
                  </div>

                  {state.watermarkType === 'text' && (
                    <input value={state.watermarkText} onChange={(e) => updateState({ watermarkText: e.target.value })} className="w-full bg-black border border-neutral-800 p-2 text-xs text-white outline-none focus:border-neutral-600" placeholder="Custom text..." />
                  )}

                  {state.watermarkType === 'image' && (
                    <button onClick={() => watermarkInputRef.current?.click()} className="w-full py-2 bg-neutral-900 border border-neutral-800 text-[10px] uppercase font-bold text-neutral-400">Upload Logo</button>
                  )}

                  {state.watermarkType !== 'none' && (
                    <div className="space-y-4">
                       <Control label="Scale" value={Math.round(state.watermarkScale * 100)} onChange={(v) => updateState({ watermarkScale: v / 100 })} min={5} max={100} unit="%" />
                       <Control label="Opacity" value={Math.round(state.watermarkOpacity * 100)} onChange={(v) => updateState({ watermarkOpacity: v / 100 })} min={0} max={100} unit="%" />
                       <div className="grid grid-cols-2 gap-4">
                          <Control label="Pos X" value={state.watermarkPos.x} onChange={(v) => updateState({ watermarkPos: { ...state.watermarkPos, x: v } })} min={0} max={100} unit="%" />
                          <Control label="Pos Y" value={state.watermarkPos.y} onChange={(v) => updateState({ watermarkPos: { ...state.watermarkPos, y: v } })} min={0} max={100} unit="%" />
                       </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-neutral-900">
                    <label className="text-[10px] uppercase font-bold text-neutral-500 mb-2 block flex items-center gap-2"><IconSparkles /> AI Magic Edit</label>
                    <div className="flex gap-2">
                       <input value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="e.g. Remove background" className="flex-1 bg-black border border-neutral-800 p-2 text-xs text-white outline-none" />
                       <button onClick={handleAiEdit} disabled={isAiLoading || !aiPrompt} className="px-4 bg-white text-black font-bold uppercase text-[10px] tracking-widest disabled:opacity-20">{isAiLoading ? '...' : 'Go'}</button>
                    </div>
                  </div>

                  <button onClick={exportImage} className="w-full py-3 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-neutral-200 transition-colors">Export Studio Result</button>
                  <button onClick={() => updateState(INITIAL_STATE)} className="w-full py-2 text-[10px] uppercase text-neutral-700 hover:text-red-500 font-bold transition-colors">Reset Session</button>
               </div>
             )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleMainUpload} className="hidden" accept="image/*" />
          <input type="file" ref={watermarkInputRef} onChange={handleWatermarkUpload} className="hidden" accept="image/*" />
        </div>

        {/* Preview */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex-1 bg-neutral-900 border border-neutral-800 relative overflow-hidden flex items-center justify-center p-8 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
             <div className="absolute top-4 left-4 text-[10px] uppercase font-bold text-neutral-600 tracking-widest z-10 italic">Studio View</div>
             <div className="max-w-full max-h-full transition-transform duration-200" style={{ transform: `scale(${state.zoom})` }}>
                <canvas ref={canvasRef} className="shadow-2xl max-w-full max-h-full" />
             </div>
             
             {state.image && (
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-[#111] border border-neutral-800 p-1">
                   <button onClick={() => updateState({ zoom: Math.max(0.1, state.zoom - 0.1) }, true)} className="p-2 hover:bg-neutral-800 text-neutral-500 border border-neutral-800">-</button>
                   <span className="text-[10px] font-mono w-10 text-center">{Math.round(state.zoom * 100)}%</span>
                   <button onClick={() => updateState({ zoom: Math.min(5, state.zoom + 0.1) }, true)} className="p-2 hover:bg-neutral-800 text-neutral-500 border border-neutral-800">+</button>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Control = ({ label, value, min, max, unit = 'px', onChange }: { label: string; value: number; min: number; max: number; unit?: string; onChange: (v: number) => void }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[8px] uppercase font-bold text-neutral-500 tracking-widest">
       <span>{label}</span>
       <span>{value}{unit}</span>
    </div>
    <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(parseInt(e.target.value))} className="w-full h-1 bg-neutral-900 appearance-none accent-white cursor-pointer" />
  </div>
);
