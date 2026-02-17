
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

export const YoutubeThumbnail: React.FC = () => {
  const [mode, setMode] = useState<'template' | 'ai'>('template');
  const [text, setText] = useState('UNSTOPPABLE');
  const [subText, setSubText] = useState('Master React in 10 Minutes');
  const [bgColor, setBgColor] = useState('#000000');
  const [accentColor, setAccentColor] = useState('#ff0000');
  const [loading, setLoading] = useState(false);
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [niche, setNiche] = useState('Minimalist Tech');
  
  // Overlay Settings
  const [overlayEnabled, setOverlayEnabled] = useState(true);
  const [overlayColor, setOverlayColor] = useState('#000000');
  const [overlayOpacity, setOverlayOpacity] = useState(0.4);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const drawThumbnail = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const renderLayers = (bgImg?: HTMLImageElement) => {
      // 1. Draw Background
      if (bgImg) {
        // Cover logic for background image
        const scale = Math.max(canvas.width / bgImg.width, canvas.height / bgImg.height);
        const x = (canvas.width / 2) - (bgImg.width / 2) * scale;
        const y = (canvas.height / 2) - (bgImg.height / 2) * scale;
        ctx.drawImage(bgImg, x, y, bgImg.width * scale, bgImg.height * scale);
      } else {
        // Gradient background if no image
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, bgColor);
        grad.addColorStop(1, '#111');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 2. Draw Overlay
      if (overlayEnabled) {
        ctx.fillStyle = overlayColor;
        ctx.globalAlpha = overlayOpacity;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;
      }

      // 3. Draw Text Overlay
      renderOverlay(ctx);
    };

    // Load images asynchronously if needed
    const activeImage = mode === 'ai' ? aiImage : userImage;
    if (activeImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => renderLayers(img);
      img.src = activeImage;
    } else {
      renderLayers();
    }
  };

  const renderOverlay = (ctx: CanvasRenderingContext2D) => {
    const width = 1280;
    const height = 720;

    // Decorative Accent
    ctx.fillStyle = accentColor;
    ctx.fillRect(0, height - 100, 400, 10);

    // Main Text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 120px "Inter", sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 20;
    ctx.textBaseline = 'middle';
    ctx.fillText(text.toUpperCase(), 60, height / 2 + 20);

    // Subtext
    ctx.font = '500 45px "Inter", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.shadowBlur = 0;
    ctx.fillText(subText, 60, height / 2 + 100);
  };

  useEffect(() => {
    drawThumbnail();
  }, [text, subText, bgColor, accentColor, aiImage, userImage, mode, overlayEnabled, overlayColor, overlayOpacity]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserImage(event.target?.result as string);
        setMode('template');
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAIBackground = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ text: `A high quality, dramatic YouTube thumbnail background for a video about ${niche}. Cinematic lighting, no text, minimal distraction, 16:9 aspect ratio.` }],
        config: { imageConfig: { aspectRatio: "16:9" } }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setAiImage(`data:image/png;base64,${part.inlineData.data}`);
          setMode('ai');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (format: 'png' | 'jpeg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.9 : 1.0);
    const link = document.createElement('a');
    link.download = `yt-thumbnail-${Date.now()}.${format}`;
    link.href = dataUrl;
    link.click();
  };

  const resetAll = () => {
    setText('UNSTOPPABLE');
    setSubText('Master React in 10 Minutes');
    setBgColor('#000000');
    setAccentColor('#ff0000');
    setAiImage(null);
    setUserImage(null);
    setMode('template');
    setOverlayOpacity(0.4);
    setOverlayEnabled(true);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex border-b border-[var(--border)]">
        <button onClick={() => setMode('template')} className={`px-6 py-3 text-[11px] uppercase tracking-widest font-bold ${mode === 'template' ? 'border-b-2 border-white text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>Template Mode</button>
        <button onClick={() => setMode('ai')} className={`px-6 py-3 text-[11px] uppercase tracking-widest font-bold ${mode === 'ai' ? 'border-b-2 border-white text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>AI Mode (Gemini)</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-4 space-y-4 overflow-auto pr-2 pb-10">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-6">
            
            {/* Text Settings */}
            <div className="space-y-4 pb-4 border-b border-[var(--border)]/50">
              <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block">Text Settings</label>
              <div>
                <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 block">Headline</label>
                <input value={text} onChange={(e) => setText(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-3 text-sm focus:border-[var(--border-hover)] outline-none" />
              </div>
              <div>
                <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 block">Sub-headline</label>
                <input value={subText} onChange={(e) => setSubText(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-3 text-sm focus:border-[var(--border-hover)] outline-none" />
              </div>
              <div>
                <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 block">Accent Color</label>
                <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-full h-8 bg-[var(--bg-input)] border border-[var(--border)] p-1 cursor-pointer" />
              </div>
            </div>

            {/* Background Settings */}
            <div className="space-y-4 pb-4 border-b border-[var(--border)]/50">
              <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block">Background</label>
              
              {mode === 'template' ? (
                <div className="space-y-4">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 bg-[var(--bg-card)] border border-[var(--border)] text-[10px] font-bold uppercase tracking-widest hover:border-[var(--border-hover)] transition-all flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Upload Background
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                  <div>
                    <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 block">Fallback Solid Color</label>
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-8 bg-[var(--bg-input)] border border-[var(--border)] p-1 cursor-pointer" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 block">Niche Prompt</label>
                    <div className="flex gap-2">
                      <input value={niche} onChange={(e) => setNiche(e.target.value)} className="flex-1 bg-[var(--bg-input)] border border-[var(--border)] p-3 text-sm focus:border-[var(--border-hover)] outline-none" placeholder="e.g. Minimalist Tech" />
                      <button onClick={generateAIBackground} disabled={loading} className="px-4 bg-white text-black text-[10px] font-bold uppercase tracking-widest disabled:opacity-50">
                        {loading ? '...' : 'Gen'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Overlay Settings */}
            <div className="space-y-4 pb-4 border-b border-[var(--border)]/50">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block">Overlay Effect</label>
                <input type="checkbox" checked={overlayEnabled} onChange={(e) => setOverlayEnabled(e.target.checked)} className="accent-white" />
              </div>
              
              {overlayEnabled && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 block">Overlay Color</label>
                      <input type="color" value={overlayColor} onChange={(e) => setOverlayColor(e.target.value)} className="w-full h-8 bg-[var(--bg-input)] border border-[var(--border)] p-1 cursor-pointer" />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase text-[var(--text-muted)] mb-1 block">Opacity {Math.round(overlayOpacity * 100)}%</label>
                      <input type="range" min="0" max="1" step="0.05" value={overlayOpacity} onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))} className="w-full h-1 mt-3 bg-[var(--bg-hover)] appearance-none accent-white cursor-pointer" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Export Section */}
            <div className="space-y-4">
              <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block">Export</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => downloadImage('png')} className="py-2.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all">Download PNG</button>
                <button onClick={() => downloadImage('jpeg')} className="py-2.5 bg-[var(--bg-hover)] text-[var(--text-primary)] text-[10px] font-bold uppercase tracking-widest border border-[var(--border)] hover:bg-[var(--bg-hover)] transition-all">Download JPG</button>
              </div>
              <button onClick={resetAll} className="w-full py-2 border border-[var(--border)] text-[var(--text-muted)] hover:text-red-500 text-[10px] font-bold uppercase tracking-widest transition-colors">Reset All</button>
            </div>

          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col items-center justify-center gap-6">
          <div className="w-full aspect-video bg-[var(--bg-card)] border border-[var(--border)] relative overflow-hidden shadow-2xl">
            <canvas ref={canvasRef} width="1280" height="720" className="w-full h-full" />
          </div>
          <div className="flex items-center gap-6">
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Master Preview: 1280 x 720 (Standard HD)</p>
            { (mode === 'ai' && aiImage) || (mode === 'template' && userImage) ? (
               <span className="text-[9px] bg-[var(--bg-hover)] px-2 py-0.5 text-[var(--text-muted)] font-mono">IMAGE ACTIVE</span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
