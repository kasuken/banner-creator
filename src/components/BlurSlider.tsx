import React from 'react';

interface BlurSliderProps {
    blurAmount: number;
    setBlurAmount: (blur: number) => void;
}

const BlurSlider: React.FC<BlurSliderProps> = ({ blurAmount, setBlurAmount }) => {
    return (
        <div className="w-full max-w-2xl mb-4">
            <label htmlFor="blur-amount" className="block mb-2 text-sm font-medium text-gray-700">
                Background Blur: {blurAmount}
            </label>
            <input
                id="blur-amount"
                type="range"
                min="0"
                max="20"
                step="1"
                value={blurAmount}
                onChange={(e) => setBlurAmount(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>No Blur (0)</span>
                <span>Maximum (20)</span>
            </div>
        </div>
    );
};

export default BlurSlider;
