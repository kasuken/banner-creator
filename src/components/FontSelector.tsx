import React from 'react';
import { FONTS } from '../../shared/presets';

interface FontSelectorProps {
    selectedFont: string;
    setFont: (font: string) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({ selectedFont, setFont }) => {
    return (
        <div className="w-full">
            <label htmlFor="font-select" className="block mb-2 text-xs font-medium text-cream-dim tracking-wide">
                Font Family
            </label>
            <div className="relative">
                <select
                    id="font-select"
                    value={selectedFont}
                    onChange={(e) => setFont(e.target.value)}
                    className="w-full bg-surface-overlay border border-surface-border rounded-md p-2.5 pr-9 text-cream text-sm focus:border-copper focus:ring-1 focus:ring-copper/30 transition-colors appearance-none cursor-pointer font-body"
                >
                    {FONTS.map((font) => (
                        <option key={font.value} value={font.value}>
                            {font.name}
                        </option>
                    ))}
                </select>
                <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
};

export default FontSelector;