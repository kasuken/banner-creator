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
            <label className="block mb-2 text-sm font-medium text-gray-700">
                Your Text
            </label>
            <textarea
                value={text}
                onChange={handleChange}
                placeholder="Type your banner text here...\nPress Enter for new lines"
                className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-lg"
            />
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Tip: Use Enter for line breaks
                </span>
                <span className={charCount > 100 ? 'text-amber-600 font-medium' : ''}>
                    {charCount} characters
                </span>
            </div>
        </div>
    );
};

export default TextEditor;