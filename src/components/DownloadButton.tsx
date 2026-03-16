import React from 'react';

interface DownloadButtonProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ canvasRef }) => {
    const handleDownload = () => {
        if (canvasRef.current) {
            canvasRef.current.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = `banner-${Date.now()}.png`;
                    link.href = url;
                    link.click();
                    URL.revokeObjectURL(url);
                }
            }, 'image/png');
        }
    };

    return (
        <button
            onClick={handleDownload}
            className="w-full mt-5 px-6 py-3 bg-copper text-surface font-medium text-sm rounded-md hover:bg-copper-light active:bg-copper-dark transition-colors flex items-center justify-center gap-2.5 group"
        >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PNG
        </button>
    );
};

export default DownloadButton;