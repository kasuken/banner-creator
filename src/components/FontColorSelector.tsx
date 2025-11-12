import React from 'react';

interface FontColorSelectorProps {
    fontColor: string;
    setFontColor: (color: string) => void;
    textStrokeColor: string;
    setTextStrokeColor: (color: string) => void;
}

const FontColorSelector: React.FC<FontColorSelectorProps> = ({ 
    fontColor, 
    setFontColor, 
    textStrokeColor, 
    setTextStrokeColor 
}) => {
    const presetColors = [
        { name: 'White', value: '#ffffff' },
        { name: 'Black', value: '#000000' },
        { name: 'Red', value: '#ef4444' },
        { name: 'Orange', value: '#f97316' },
        { name: 'Yellow', value: '#eab308' },
        { name: 'Green', value: '#22c55e' },
        { name: 'Blue', value: '#3b82f6' },
        { name: 'Purple', value: '#a855f7' },
        { name: 'Pink', value: '#ec4899' },
        { name: 'Gray', value: '#6b7280' },
    ];

    return (
        <div className="w-full space-y-4">
            {/* Text Fill Color */}
            <div>
                <label htmlFor="text-color-custom" className="block mb-2 text-sm font-medium text-gray-700">
                    Text Color
                </label>
                
                {/* Preset Colors */}
                <div className="grid grid-cols-5 gap-2 mb-3" role="group" aria-label="Preset text colors">
                    {presetColors.map((color) => (
                        <button
                            key={color.value}
                            onClick={() => setFontColor(color.value)}
                            className={`relative w-full h-10 rounded-lg border-2 transition-all ${
                                fontColor === color.value
                                    ? 'border-pink-500 ring-2 ring-pink-200'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                            aria-label={`Select ${color.name} text color`}
                            aria-pressed={fontColor === color.value}
                        >
                            {fontColor === color.value && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg
                                        className="w-5 h-5 drop-shadow-lg"
                                        fill={color.value === '#ffffff' ? '#000000' : '#ffffff'}
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Custom Color Picker */}
                <div className="flex items-center gap-3">
                    <label htmlFor="text-color-custom" className="flex items-center gap-2 flex-1 cursor-pointer">
                        <input
                            id="text-color-custom"
                            type="color"
                            value={fontColor}
                            onChange={(e) => setFontColor(e.target.value)}
                            className="w-12 h-10 rounded-lg cursor-pointer border-2 border-gray-200"
                            aria-label="Custom text color"
                        />
                        <span className="text-sm text-gray-600">Custom</span>
                    </label>
                    <div className="px-3 py-2 bg-gray-100 rounded-lg font-mono text-xs text-gray-700" aria-live="polite" aria-atomic="true">
                        {fontColor.toUpperCase()}
                    </div>
                </div>
            </div>

            {/* Text Border Color */}
            <div>
                <label htmlFor="border-color-custom" className="block mb-2 text-sm font-medium text-gray-700">
                    Border Color
                </label>
                
                {/* Preset Colors */}
                <div className="grid grid-cols-5 gap-2 mb-3" role="group" aria-label="Preset border colors">
                    {presetColors.map((color) => (
                        <button
                            key={color.value}
                            onClick={() => setTextStrokeColor(color.value)}
                            className={`relative w-full h-10 rounded-lg border-2 transition-all ${
                                textStrokeColor === color.value
                                    ? 'border-pink-500 ring-2 ring-pink-200'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                            aria-label={`Select ${color.name} border color`}
                            aria-pressed={textStrokeColor === color.value}
                        >
                            {textStrokeColor === color.value && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <svg
                                        className="w-5 h-5 drop-shadow-lg"
                                        fill={color.value === '#ffffff' ? '#000000' : '#ffffff'}
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Custom Color Picker */}
                <div className="flex items-center gap-3">
                    <label htmlFor="border-color-custom" className="flex items-center gap-2 flex-1 cursor-pointer">
                        <input
                            id="border-color-custom"
                            type="color"
                            value={textStrokeColor}
                            onChange={(e) => setTextStrokeColor(e.target.value)}
                            className="w-12 h-10 rounded-lg cursor-pointer border-2 border-gray-200"
                            aria-label="Custom border color"
                        />
                        <span className="text-sm text-gray-600">Custom</span>
                    </label>
                    <div className="px-3 py-2 bg-gray-100 rounded-lg font-mono text-xs text-gray-700" aria-live="polite" aria-atomic="true">
                        {textStrokeColor.toUpperCase()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FontColorSelector;
