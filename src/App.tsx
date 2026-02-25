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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-5xl font-black mb-2 text-gray-900 tracking-tighter">GRADIENT CRAFT</h1>
        <p className="text-gray-500 mb-12 font-medium">Professional gradient generation and color stepping tool.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Section */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Configuration</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Gradient Type</label>
                  <div className="flex gap-2">
                    {['linear', 'radial'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setGradientType(type as any)}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${
                          gradientType === type 
                            ? 'bg-gray-900 text-white shadow-lg' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {type.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {gradientType === 'linear' ? (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Angle / Direction</label>
                    <input
                      type="text"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-sm font-mono focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all"
                      value={direction}
                      onChange={(e) => setDirection(e.target.value)}
                      placeholder="e.g., 90deg, to right"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Shape</label>
                      <select
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
                        value={radialShape}
                        onChange={(e) => setRadialShape(e.target.value as any)}
                      >
                        <option value="circle">Circle</option>
                        <option value="ellipse">Ellipse</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Extent</label>
                      <input
                        type="text"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
                        value={radialExtent}
                        onChange={(e) => setRadialExtent(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Gradient Steps ({steps})</label>
                  <input
                    type="range"
                    min="2"
                    max="24"
                    value={steps}
                    onChange={(e) => setSteps(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-2">
                    <span>2 STEPS</span>
                    <span>24 STEPS</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Color Stops</h2>
              <div className="space-y-3">
                {colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-200 shadow-sm shrink-0">
                      <input
                        type="color"
                        className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                        value={chroma.valid(color) ? chroma(color).hex() : '#000000'}
                        onChange={(e) => updateColor(index, e.target.value)}
                      />
                    </div>
                    <input
                      type="text"
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm font-mono focus:ring-2 focus:ring-gray-900 focus:outline-none"
                      value={color}
                      onChange={(e) => updateColor(index, e.target.value)}
                    />
                    {colors.length > 2 && (
                      <button
                        onClick={() => removeColor(index)}
                        className="p-3 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addColor}
                  className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-sm font-bold text-gray-400 hover:border-gray-900 hover:text-gray-900 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  ADD STOP
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 sticky top-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Output</h2>
              
              <div
                className="w-full aspect-video rounded-2xl shadow-inner border border-gray-100 mb-8"
                style={{ background: cssGradient }}
              ></div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-4">Color Steps</label>
                  <div className="flex flex-wrap gap-2">
                    {steppedColors.map((color, i) => (
                      <div key={i} className="group relative">
                        <div 
                          className="w-10 h-10 rounded-lg shadow-sm border border-white cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          onClick={() => navigator.clipboard.writeText(color)}
                        />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-mono rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                          {color.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">CSS Code</label>
                  <div className="relative group">
                    <pre className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {cssGradient}
                    </pre>
                    <button
                      onClick={() => navigator.clipboard.writeText(cssGradient)}
                      className="absolute top-3 right-3 p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all text-gray-400 hover:text-gray-900"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

