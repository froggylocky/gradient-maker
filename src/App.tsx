/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import chroma from 'chroma-js';

export default function App() {
  const [colors, setColors] = useState<string[]>(['#FF0000', '#0000FF']);
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [direction, setDirection] = useState<string>('90deg');
  const [radialShape, setRadialShape] = useState<'circle' | 'ellipse'>('ellipse');
  const [radialExtent, setRadialExtent] = useState<string>('farthest-corner');
  const [cssGradient, setCssGradient] = useState<string>('');
  const [steps, setSteps] = useState<number>(5);
  const [steppedColors, setSteppedColors] = useState<string[]>([]);

  const generateCssGradient = useCallback(() => {
    const colorStops = colors.join(', ');
    if (gradientType === 'linear') {
      setCssGradient(`linear-gradient(${direction}, ${colorStops})`);
    } else {
      setCssGradient(`radial-gradient(${radialShape} ${radialExtent} at center, ${colorStops})`);
    }
  }, [colors, gradientType, direction, radialShape, radialExtent]);

  const generateSteppedColors = useCallback(() => {
    try {
      const scale = chroma.scale(colors).mode('lch').colors(steps);
      setSteppedColors(scale);
    } catch (e) {
      console.error("Error generating steps:", e);
    }
  }, [colors, steps]);

  useEffect(() => {
    generateCssGradient();
    generateSteppedColors();
  }, [generateCssGradient, generateSteppedColors]);

  const addColor = () => {
    setColors([...colors, '#CCCCCC']);
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const updateColor = (index: number, value: string) => {
    const newColors = [...colors];
    newColors[index] = value;
    setColors(newColors);
  };

  const bgStart = chroma.valid(colors[0]) ? chroma(colors[0]).alpha(0.05).css() : '#f9fafb';
  const bgEnd = chroma.valid(colors[colors.length - 1]) ? chroma(colors[colors.length - 1]).alpha(0.05).css() : '#f9fafb';
  const accentColor = chroma.valid(colors[0]) ? chroma(colors[0]).css() : '#000';

  return (
    <div 
      className="min-h-screen flex flex-col items-center py-12 px-4 transition-all duration-700 ease-in-out"
      style={{ 
        background: `linear-gradient(135deg, ${bgStart}, ${bgEnd})`,
      }}
    >
      <div className="w-full max-w-4xl">
        <div className="flex flex-col items-center mb-12">
          {/* Logo with Gradient - Using a more robust mask implementation */}
          <div className="relative w-full max-w-[500px] h-32 mb-6 group">
            <div 
              className="absolute inset-0 transition-opacity duration-500"
              style={{ 
                background: cssGradient,
                WebkitMaskImage: `url(https://u.cubeupload.com/froglock/logoGradientmaker.png)`,
                maskImage: `url(https://u.cubeupload.com/froglock/logoGradientmaker.png)`,
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
              }}
            />
            {/* Fallback if mask fails or image is loading */}
            <img 
              src="https://u.cubeupload.com/froglock/logoGradientmaker.png" 
              alt="Gradient Maker Logo" 
              className="opacity-0 pointer-events-none w-full h-full object-contain"
              onLoad={(e) => {
                const target = e.target as HTMLImageElement;
                target.parentElement?.firstElementChild?.classList.remove('opacity-0');
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                console.error("Logo failed to load");
              }}
            />
          </div>
          <p className="text-gray-400 font-medium tracking-tight text-center max-w-md">
            Professional gradient generation and color stepping tool.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Controls Section */}
          <div className="space-y-8">
            <div 
              className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/20 border transition-all duration-500"
              style={{ borderColor: chroma(accentColor).alpha(0.1).css() }}
            >
              <h2 
                className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 gradient-text"
                style={{ backgroundImage: cssGradient }}
              >
                Configuration
              </h2>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Gradient Type</label>
                  <div className="flex gap-2 p-1.5 bg-gray-100/50 rounded-2xl">
                    {['linear', 'radial'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setGradientType(type as any)}
                        className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black transition-all duration-300 ${
                          gradientType === type 
                            ? 'bg-white text-gray-900 shadow-md' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {type.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {gradientType === 'linear' ? (
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Angle / Direction</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-sm font-mono focus:ring-2 focus:outline-none transition-all"
                      style={{ '--tw-ring-color': accentColor } as any}
                      value={direction}
                      onChange={(e) => setDirection(e.target.value)}
                      placeholder="e.g., 90deg, to right"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Shape</label>
                      <select
                        className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:outline-none appearance-none"
                        style={{ '--tw-ring-color': accentColor } as any}
                        value={radialShape}
                        onChange={(e) => setRadialShape(e.target.value as any)}
                      >
                        <option value="circle">Circle</option>
                        <option value="ellipse">Ellipse</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Extent</label>
                      <input
                        type="text"
                        className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:outline-none"
                        style={{ '--tw-ring-color': accentColor } as any}
                        value={radialExtent}
                        onChange={(e) => setRadialExtent(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Gradient Steps</label>
                    <span className="text-xs font-black text-gray-900">{steps}</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="24"
                    value={steps}
                    onChange={(e) => setSteps(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                    style={{ accentColor: accentColor }}
                  />
                </div>
              </div>
            </div>

            <div 
              className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/20 border transition-all duration-500"
              style={{ borderColor: chroma(accentColor).alpha(0.1).css() }}
            >
              <h2 
                className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 gradient-text"
                style={{ backgroundImage: cssGradient }}
              >
                Color Stops
              </h2>
              <div className="space-y-5">
                {colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-4 group">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-4 border-white shadow-xl shrink-0 transition-transform group-hover:scale-105">
                      <input
                        type="color"
                        className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                        value={chroma.valid(color) ? chroma(color).hex() : '#000000'}
                        onChange={(e) => updateColor(index, e.target.value)}
                      />
                    </div>
                    <input
                      type="text"
                      className="flex-1 bg-white border border-gray-100 rounded-2xl py-4 px-6 text-sm font-mono focus:ring-2 focus:outline-none transition-all"
                      style={{ '--tw-ring-color': accentColor } as any}
                      value={color}
                      onChange={(e) => updateColor(index, e.target.value)}
                    />
                    {colors.length > 2 && (
                      <button
                        onClick={() => removeColor(index)}
                        className="p-3 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addColor}
                  className="w-full py-6 border-2 border-dashed border-gray-200 rounded-2xl text-[10px] font-black text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all flex items-center justify-center gap-3 tracking-[0.2em]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  ADD NEW STOP
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-8">
            <div 
              className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/20 border sticky top-8 transition-all duration-500"
              style={{ borderColor: chroma(accentColor).alpha(0.1).css() }}
            >
              <h2 
                className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 gradient-text"
                style={{ backgroundImage: cssGradient }}
              >
                Live Preview
              </h2>
              
              <div
                className="w-full aspect-square rounded-[2rem] shadow-2xl border-8 border-white mb-10 overflow-hidden transition-all duration-500"
                style={{ background: cssGradient }}
              ></div>

              <div className="space-y-10">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-6 tracking-widest">Generated Steps (Click to Copy)</label>
                  <div className="flex flex-wrap gap-4">
                    {steppedColors.map((color, i) => (
                      <button 
                        key={i} 
                        className="group relative focus:outline-none"
                        onClick={() => navigator.clipboard.writeText(color)}
                      >
                        <div 
                          className="w-12 h-12 rounded-2xl shadow-lg border-4 border-white cursor-pointer hover:scale-110 active:scale-90 transition-all duration-300"
                          style={{ backgroundColor: color }}
                        />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-3 py-2 bg-gray-900 text-white text-[10px] font-black rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-10 shadow-2xl">
                          {color.toUpperCase()}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">CSS Output</label>
                  <div className="relative group">
                    <pre className="w-full p-8 bg-white border border-gray-100 rounded-3xl font-mono text-[11px] text-gray-400 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                      {cssGradient}
                    </pre>
                    <button
                      onClick={() => navigator.clipboard.writeText(cssGradient)}
                      className="absolute top-5 right-5 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all text-gray-400 hover:text-gray-900"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



