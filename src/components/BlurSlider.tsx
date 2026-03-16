import React from 'react';

interface BlurSliderProps {
    blurAmount: number;
    setBlurAmount: (blur: number) => void;
}

const BlurSlider: React.FC<BlurSliderProps> = ({ blurAmount, setBlurAmount }) => {
    const pct = (blurAmount / 20) * 100;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <label htmlFor="blur-amount" className="text-xs font-medium text-cream-dim tracking-wide">
                    Blur Intensity
                </label>
                <span className="text-xs font-mono text-copper tabular-nums">
                    {blurAmount}
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
                className="w-full"
                style={{
                    background: `linear-gradient(to right, #c47d5a 0%, #c47d5a ${pct}%, #2a2a2a ${pct}%, #2a2a2a 100%)`
                }}
                aria-valuemin={0}
                aria-valuemax={20}
                aria-valuenow={blurAmount}
                aria-valuetext={`${blurAmount} blur`}
                aria-describedby="blur-range"
            />
            <div id="blur-range" className="flex justify-between text-[10px] text-cream-muted/50 mt-1 font-mono">
                <span>Sharp</span>
                <span>Max</span>
            </div>
        </div>
    );
};

export default BlurSlider;
