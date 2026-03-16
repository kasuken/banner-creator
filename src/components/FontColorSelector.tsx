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

    const ColorRow = ({ 
        label, 
        id, 
        value, 
        onChange, 
        ariaGroupLabel 
    }: { 
        label: string; 
        id: string; 
        value: string; 
        onChange: (v: string) => void; 
        ariaGroupLabel: string;
    }) => (
        <div>
            <label htmlFor={id} className="block mb-2 text-xs font-medium text-cream-dim tracking-wide">
                {label}
            </label>
            <div className="flex items-center gap-2.5">
                <div className="flex gap-1" role="group" aria-label={ariaGroupLabel}>
                    {presetColors.map((color) => (
                        <button
                            key={color.value}
                            onClick={() => onChange(color.value)}
                            className={`w-6 h-6 rounded-sm border transition-all ${
                                value === color.value
                                    ? 'border-copper ring-1 ring-copper/40 scale-110'
                                    : 'border-surface-border hover:border-cream-muted/30'
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                            aria-label={`Select ${color.name}`}
                            aria-pressed={value === color.value}
                        />
                    ))}
                </div>
                <div className="h-5 w-px bg-surface-border" aria-hidden="true" />
                <input
                    id={id}
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-6 h-6 rounded-sm cursor-pointer border border-surface-border bg-transparent"
                    aria-label={`Custom ${label.toLowerCase()}`}
                />
                <span className="text-[10px] font-mono text-cream-muted/50 tracking-wider">
                    {value.toUpperCase()}
                </span>
            </div>
        </div>
    );

    return (
        <div className="w-full space-y-4">
            <ColorRow 
                label="Text Color" 
                id="text-color-custom" 
                value={fontColor} 
                onChange={setFontColor}
                ariaGroupLabel="Preset text colors"
            />
            <ColorRow 
                label="Border Color" 
                id="border-color-custom" 
                value={textStrokeColor} 
                onChange={setTextStrokeColor}
                ariaGroupLabel="Preset border colors"
            />
        </div>
    );
};

export default FontColorSelector;
