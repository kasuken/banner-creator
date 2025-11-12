import React from 'react';

const fonts = [
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Helvetica', value: 'Helvetica, sans-serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Times New Roman', value: '"Times New Roman", Times, serif' },
    { name: 'Courier New', value: '"Courier New", Courier, monospace' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
    { name: 'Impact', value: 'Impact, sans-serif' },
    { name: 'Comic Sans MS', value: '"Comic Sans MS", cursive' },
];

interface FontSelectorProps {
    selectedFont: string;
    setFont: (font: string) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({ selectedFont, setFont }) => {
    return (
        <div className="w-full">
            <label htmlFor="font-select" className="block mb-2 text-sm font-medium text-gray-700">
                Font Family
            </label>
            <div className="relative">
                <select
                    id="font-select"
                    value={selectedFont}
                    onChange={(e) => setFont(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl p-3 pr-10 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all appearance-none bg-white cursor-pointer text-base font-medium"
                >
                    {fonts.map((font) => (
                        <option key={font.value} value={font.value}>
                            {font.name}
                        </option>
                    ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
};

export default FontSelector;