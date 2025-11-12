import React from 'react';

interface BlurSliderProps {
    blurAmount: number;
    setBlurAmount: (blur: number) => void;
}

const BlurSlider: React.FC<BlurSliderProps> = ({ blurAmount, setBlurAmount }) => {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-3">
                <label htmlFor="blur-amount" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Blur Intensity
                </label>
                <span className="text-sm font-bold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">
                    {blurAmount}px
                </span>
            </div>
            <input
                id="blur-amount"
                type="range"
                min="0"
                max="20"
                step="1"
                value={blurAmount}
                onChange={(e) => setBlurAmount(Number(e.target.value))}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                style={{
                    background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${(blurAmount / 20) * 100}%, #cffafe ${(blurAmount / 20) * 100}%, #cffafe 100%)`
                }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Sharp (0px)</span>
                <span>Maximum (20px)</span>
            </div>
        </div>
    );
};

export default BlurSlider;
