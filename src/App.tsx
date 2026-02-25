/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';

export default function App() {
  const [colors, setColors] = useState<string[]>(['#FF0000', '#0000FF']);
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [direction, setDirection] = useState<string>('90deg');
  const [radialShape, setRadialShape] = useState<'circle' | 'ellipse'>('ellipse');
  const [radialExtent, setRadialExtent] = useState<string>('farthest-corner');
  const [cssGradient, setCssGradient] = useState<string>('');

  const generateCssGradient = useCallback(() => {
    const colorStops = colors.join(', ');
    if (gradientType === 'linear') {
      setCssGradient(`linear-gradient(${direction}, ${colorStops})`);
    } else {
      setCssGradient(`radial-gradient(${radialShape} ${radialExtent} at center, ${colorStops})`);
    }
  }, [colors, gradientType, direction, radialShape, radialExtent]);

  useEffect(() => {
    generateCssGradient();
  }, [generateCssGradient]);

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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Gradient Maker</h1>

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl mb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Gradient Type:</label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={gradientType}
            onChange={(e) => setGradientType(e.target.value as 'linear' | 'radial')}
          >
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
          </select>
        </div>

        {gradientType === 'linear' && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Direction:</label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              placeholder="e.g., 90deg, to right, to bottom left"
            />
          </div>
        )}

        {gradientType === 'radial' && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Shape:</label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={radialShape}
                onChange={(e) => setRadialShape(e.target.value as 'circle' | 'ellipse')}
              >
                <option value="circle">Circle</option>
                <option value="ellipse">Ellipse</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Extent:</label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={radialExtent}
                onChange={(e) => setRadialExtent(e.target.value)}
                placeholder="e.g., closest-corner, farthest-side"
              />
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Colors:</label>
          {colors.map((color, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="color"
                className="mr-2"
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
              />
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
                placeholder="#RRGGBB, rgb(R,G,B), hsl(H,S,L)"
              />
              {colors.length > 1 && (
                <button
                  className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => removeColor(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={addColor}
          >
            Add Color
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Preview</h2>
        <div
          className="w-full h-48 rounded-md mb-4"
          style={{ background: cssGradient }}
        ></div>
        <h2 className="text-2xl font-bold mb-4">CSS Output</h2>
        <textarea
          className="w-full p-3 border rounded-md bg-gray-50 font-mono text-sm resize-none"
          rows={4}
          readOnly
          value={cssGradient}
        ></textarea>
        <button
          className="mt-4 bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => navigator.clipboard.writeText(cssGradient)}
        >
          Copy CSS
        </button>
      </div>
    </div>
  );
}
