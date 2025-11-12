import React from 'react';

interface TextEditorProps {
    text: string;
    setText: (text: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ text, setText }) => {
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    return (
        <div className="w-full max-w-2xl mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
                Banner Text:
            </label>
            <textarea
                value={text}
                onChange={handleChange}
                placeholder="Enter your banner text here..."
                className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
    );
};

export default TextEditor;