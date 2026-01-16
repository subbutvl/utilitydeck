
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: { day: string; temp: number; icon: string }[];
}

const CONDITION_MAP: Record<string, string> = {
  'Sunny': 'Clear sky with full visibility.',
  'Cloudy': 'Overcast conditions with diffused light.',
  'Rainy': 'Precipitation expected throughout the day.',
  'Partly Cloudy': 'Intermittent sun and cloud cover.',
  'Stormy': 'High-intensity wind and rain likely.'
};

export const WeatherForecaster: React.FC = () => {
  const [cityInput, setCityInput] = useState('Tirunelveli');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const fetchWeather = async (city: string) => {
    setLoading(true);
    setTimeout(() => {
      const mockData: WeatherData = {
        city: city.charAt(0).toUpperCase() + city.slice(1),
        temp: 22 + Math.floor(Math.random() * 10),
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
        humidity: 45 + Math.floor(Math.random() * 20),
        windSpeed: 10 + Math.floor(Math.random() * 15),
        forecast: [
          { day: 'Mon', temp: 24, icon: '☀️' },
          { day: 'Tue', temp: 22, icon: '⛅' },
          { day: 'Wed', temp: 21, icon: '☁️' },
          { day: 'Thu', temp: 19, icon: '🌧️' },
          { day: 'Fri', temp: 25, icon: '☀️' }
        ]
      };
      setWeather(mockData);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchWeather('Tirunelveli');
  }, []);

  const generateAiAdvice = async () => {
    if (!weather) return;
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Current weather in ${weather.city} is ${weather.temp}°C and ${weather.condition}. 
      Give a 2-sentence advice for a traveler regarding what to wear and any precautions to take. Keep it practical and minimalist.`;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      setAiAdvice(response.text || "Advice unavailable.");
    } catch (err) {
      setAiAdvice("AI advisor failed to respond.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const resetAll = () => {
    setCityInput('Tirunelveli');
    setAiAdvice(null);
    fetchWeather('Tirunelveli');
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="bg-indigo-900/20 border border-indigo-500/20 px-4 py-2 text-[10px] text-indigo-300 uppercase font-bold tracking-widest text-center">
        Currently using mock weather data. Real-time dynamic API integration is coming soon.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#111] border border-neutral-800 p-8 space-y-6">
            <div className="flex justify-between items-center mb-2">
               <span className="text-[10px] uppercase text-neutral-500 font-bold tracking-widest">Region Search</span>
               <button onClick={resetAll} className="text-[10px] uppercase text-neutral-700 hover:text-red-500 font-bold">Reset</button>
            </div>
            
            <div className="flex gap-2">
              <input 
                type="text" 
                value={cityInput} 
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="Enter city name..."
                className="flex-1 bg-black border border-neutral-800 p-3 text-sm text-white focus:border-neutral-500 outline-none"
              />
              <button 
                onClick={() => fetchWeather(cityInput)}
                className="px-4 py-3 bg-white text-black font-bold uppercase text-[10px] tracking-widest"
              >
                Find
              </button>
            </div>

            <div className="pt-4 border-t border-neutral-900">
               <label className="text-[10px] uppercase text-neutral-600 mb-4 block tracking-widest flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                 AI Weather Advisor
               </label>
               {aiAdvice ? (
                 <div className="bg-neutral-950 p-4 border border-neutral-900 animate-in fade-in duration-300">
                    <p className="text-xs text-neutral-400 leading-relaxed italic">"{aiAdvice}"</p>
                    <button onClick={() => setAiAdvice(null)} className="mt-3 text-[9px] uppercase text-neutral-700 hover:text-white font-bold">Clear Advice</button>
                 </div>
               ) : (
                 <button 
                  onClick={generateAiAdvice}
                  disabled={isAiLoading || !weather}
                  className="w-full py-3 bg-neutral-800 border border-neutral-700 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white hover:border-neutral-500 transition-all flex items-center justify-center gap-2"
                 >
                   {isAiLoading ? 'Analyzing Climate...' : 'Get Travel Advice'}
                 </button>
               )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center">
               <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 animate-spin mb-4" />
               <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-neutral-600">Syncing Atmosphere...</span>
            </div>
          ) : weather ? (
            <div className="flex-1 flex flex-col gap-6">
              <div className="bg-[#0d0d0d] border border-neutral-800 p-12 flex flex-col items-center justify-center relative overflow-hidden group">
                 <div className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-700 italic">Global Station Monitor</div>
                 <div className="text-center z-10">
                    <h2 className="text-2xl font-light text-neutral-400 uppercase tracking-[0.4em] mb-4">{weather.city}</h2>
                    <div className="text-[100px] font-mono leading-none text-white transition-transform duration-500 group-hover:scale-110">
                      {weather.temp}<span className="text-4xl align-top">°C</span>
                    </div>
                    <p className="text-lg text-neutral-500 uppercase tracking-[0.2em] mt-4 font-medium">{weather.condition}</p>
                 </div>
                 
                 <div className="mt-12 grid grid-cols-2 gap-12 w-full max-w-sm">
                    <div className="text-center border-r border-neutral-900">
                       <p className="text-[10px] uppercase text-neutral-600 font-bold tracking-widest mb-1">Humidity</p>
                       <p className="text-xl font-mono text-neutral-300">{weather.humidity}%</p>
                    </div>
                    <div className="text-center">
                       <p className="text-[10px] uppercase text-neutral-600 font-bold tracking-widest mb-1">Wind Speed</p>
                       <p className="text-xl font-mono text-neutral-300">{weather.windSpeed} <span className="text-[10px]">km/h</span></p>
                    </div>
                 </div>
              </div>

              <div className="bg-[#111] border border-neutral-800 p-8">
                 <h3 className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 mb-8 border-b border-neutral-900 pb-2">5-Day Outlook</h3>
                 <div className="grid grid-cols-5 gap-4">
                    {weather.forecast.map((f, i) => (
                      <div key={i} className="bg-black/40 border border-neutral-900 p-4 text-center group hover:border-neutral-600 transition-all cursor-default">
                        <p className="text-[10px] font-bold text-neutral-600 uppercase mb-2 tracking-widest">{f.day}</p>
                        <div className="text-2xl mb-2 grayscale group-hover:grayscale-0 transition-all">{f.icon}</div>
                        <p className="text-lg font-mono text-neutral-300">{f.temp}°</p>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
