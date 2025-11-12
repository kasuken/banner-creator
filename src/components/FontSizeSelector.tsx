import React from 'react';

interface FontSizeSelectorProps {
    fontSize: number;
    setFontSize: (size: number) => void;
}

const FontSizeSelector: React.FC<FontSizeSelectorProps> = ({ fontSize, setFontSize }) => {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-3">
                <label htmlFor="font-size" className="text-sm font-medium text-gray-700">
                    Font Size
                </label>
                <span className="text-sm font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
                    {fontSize}px
                </span>
            </div>
            <input
                id="font-size"
                type="range"
                min="32"
                max="160"
                step="2"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-pink-200 to-rose-200 rounded-lg appearance-none cursor-pointer accent-pink-600 slider"
                style={{
                    background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${((fontSize - 32) / (160 - 32)) * 100}%, #fce7f3 ${((fontSize - 32) / (160 - 32)) * 100}%, #fce7f3 100%)`
                }}
                aria-valuemin={32}
                aria-valuemax={160}
                aria-valuenow={fontSize}
                aria-valuetext={`${fontSize} pixels`}
                aria-describedby="font-size-range"
            />
            <div id="font-size-range" className="flex justify-between text-xs text-gray-500 mt-2">
                <span>32px</span>
                <span>160px</span>
            </div>
        </div>
    );
};

export default FontSizeSelector;
