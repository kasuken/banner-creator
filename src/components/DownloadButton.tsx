import React, { useEffect, useState } from 'react';

interface DownloadButtonProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    /** Bumped by BannerCanvas after every redraw, so the figures below track what was drawn. */
    revision: number;
}

interface ExportInfo {
    width: number;
    height: number;
    bytes: number;
}

const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb < 10 ? kb.toFixed(1) : Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
};

const DownloadButton: React.FC<DownloadButtonProps> = ({ canvasRef, revision }) => {
    // What the next download will hold: the canvas pixels and the encoded PNG size.
    const [exportInfo, setExportInfo] = useState<ExportInfo | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Encoding a PNG is not free and the sliders fire continuously, so wait for a pause.
        let cancelled = false;
        const timer = setTimeout(() => {
            try {
                canvas.toBlob((blob) => {
                    if (cancelled || !blob) return;
                    setExportInfo({ width: canvas.width, height: canvas.height, bytes: blob.size });
                }, 'image/png');
            } catch {
                // A tainted canvas cannot be exported; keep the previous figure rather than guess.
            }
        }, 200);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [canvasRef, revision]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.toBlob((blob) => {
            if (!blob) return;

            // Report the file that was actually produced, not the earlier measurement.
            setExportInfo({ width: canvas.width, height: canvas.height, bytes: blob.size });

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `banner-${Date.now()}.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        }, 'image/png');
    };

    return (
        <div className="mt-5">
            <button
                onClick={handleDownload}
                className="w-full px-6 py-3 bg-copper text-surface font-medium text-sm rounded-md hover:bg-copper-light active:bg-copper-dark transition-colors flex items-center justify-center gap-2.5 group"
            >
                <svg className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PNG
            </button>
            <p className="mt-2.5 text-center text-[11px] font-mono text-cream-muted/60 tabular-nums">
                {exportInfo
                    ? `${exportInfo.width} × ${exportInfo.height} px · ${formatBytes(exportInfo.bytes)}`
                    : 'PNG · measuring…'}
            </p>
        </div>
    );
};

export default DownloadButton;
