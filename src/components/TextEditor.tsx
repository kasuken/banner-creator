import React from 'react';

interface TextEditorProps {
    text: string;
    setText: (text: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ text, setText }) => {
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    const charCount = text.length;

    return (
        <div className="w-full">
            <label htmlFor="banner-text" className="block mb-2 text-xs font-medium text-cream-dim tracking-wide">
                Your Text
            </label>
            <textarea
                id="banner-text"
                value={text}
                onChange={handleChange}
                placeholder="Type your banner text here..."
                className="w-full h-28 p-3 bg-surface-overlay border border-surface-border rounded-md text-cream placeholder:text-cream-muted/40 focus:border-copper focus:ring-1 focus:ring-copper/30 transition-colors resize-none text-sm leading-relaxed font-body"
                aria-describedby="text-char-count"
            />
            <div className="flex justify-between items-center mt-1.5 text-[11px] text-cream-muted">
                <span className="font-mono opacity-60">Enter for line breaks</span>
                <span id="text-char-count" className={charCount > 100 ? 'text-copper font-medium' : 'opacity-60'} aria-live="polite">
                    {charCount}
                </span>
            </div>
        </div>
    );
};

export default TextEditor;