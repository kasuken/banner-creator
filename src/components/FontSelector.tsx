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
        <div className="w-full max-w-2xl mb-4">
            <label htmlFor="font-select" className="block mb-2 text-sm font-medium text-gray-700">
                Select Font:
            </label>
            <select
                id="font-select"
                value={selectedFont}
                onChange={(e) => setFont(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                {fonts.map((font) => (
                    <option key={font.value} value={font.value}>
                        {font.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FontSelector;