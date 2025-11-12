import React from 'react';

interface FontSizeSelectorProps {
    fontSize: number;
    setFontSize: (size: number) => void;
}

const FontSizeSelector: React.FC<FontSizeSelectorProps> = ({ fontSize, setFontSize }) => {
    return (
        <div className="w-full max-w-2xl mb-4">
            <label htmlFor="font-size" className="block mb-2 text-sm font-medium text-gray-700">
                Font Size: {fontSize}px
            </label>
            <input
                id="font-size"
                type="range"
                min="32"
                max="160"
                step="2"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Small (24px)</span>
                <span>Large (120px)</span>
            </div>
        </div>
    );
};

export default FontSizeSelector;
