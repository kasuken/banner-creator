import React from 'react';

interface FontSizeSelectorProps {
    fontSize: number;
    setFontSize: (size: number) => void;
}

const FontSizeSelector: React.FC<FontSizeSelectorProps> = ({ fontSize, setFontSize }) => {
    const pct = ((fontSize - 32) / (160 - 32)) * 100;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <label htmlFor="font-size" className="text-xs font-medium text-cream-dim tracking-wide">
                    Font Size
                </label>
                <span className="text-xs font-mono text-copper tabular-nums">
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
                className="w-full"
                style={{
                    background: `linear-gradient(to right, #c47d5a 0%, #c47d5a ${pct}%, #2a2a2a ${pct}%, #2a2a2a 100%)`
                }}
                aria-valuemin={32}
                aria-valuemax={160}
                aria-valuenow={fontSize}
                aria-valuetext={`${fontSize} pixels`}
                aria-describedby="font-size-range"
            />
            <div id="font-size-range" className="flex justify-between text-[10px] text-cream-muted/50 mt-1 font-mono">
                <span>32</span>
                <span>160</span>
            </div>
        </div>
    );
};

export default FontSizeSelector;
