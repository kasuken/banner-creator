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
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
            Download Banner
        </button>
    );
};

export default DownloadButton;