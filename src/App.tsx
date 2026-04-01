import React, { useState, useRef } from 'react';
import BannerCanvas from './components/BannerCanvas';
import TextEditor from './components/TextEditor';
import FontSelector from './components/FontSelector';
import FontSizeSelector from './components/FontSizeSelector';
import FontColorSelector from './components/FontColorSelector';
import AspectRatioSelector, { AspectRatio } from './components/AspectRatioSelector';
import BlurSlider from './components/BlurSlider';
import ImageSearch from './components/ImageSearch';
import ImageFitSelector from './components/ImageFitSelector';
import DownloadButton from './components/DownloadButton';
import type { ImageFitMode } from './types';

const App: React.FC = () => {
  const [text, setText] = useState('Create Beautiful Banners');
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
    const [fontSize, setFontSize] = useState(72);
    const [fontColor, setFontColor] = useState('#ffffff');
    const [textStrokeColor, setTextStrokeColor] = useState('#000000');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('blog-1000:420');
    const [blurAmount, setBlurAmount] = useState(8);
    const [imageFit, setImageFit] = useState<ImageFitMode>('cover');
  const [backgroundImage, setBackgroundImage] = useState('https://plus.unsplash.com/premium_photo-1661873863027-51b409f112f5?q=80&w=1428&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="min-h-screen font-body" lang="en">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-5 focus:py-2.5 focus:bg-copper focus:text-surface focus:rounded-md focus:font-medium"
      >
        Skip to main content
      </a>
      
      {/* Header — thin, confident, no gradients */}
      <header className="border-b border-surface-border sticky top-0 z-50 bg-surface/90 backdrop-blur-xl" role="banner">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-sm bg-copper flex items-center justify-center" aria-hidden="true">
              <svg className="w-4 h-4 text-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="font-display text-xl text-cream tracking-tight">
              Banner Creator
            </h1>
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-[1440px] mx-auto px-6 lg:px-10 py-8" role="main">
        <div className="grid lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr] gap-8">
          
          {/* Left Column — Controls panel */}
          <section 
            aria-label="Banner customization controls" 
            className="space-y-1 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto studio-scroll lg:pr-2"
          >
            {/* Text */}
            <details className="group section-reveal" open style={{animationDelay: '0ms'}}>
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-surface-raised/50 transition-colors rounded-lg">
                <h2 className="text-xs font-medium uppercase tracking-widest text-cream-muted">Content</h2>
                <svg className="w-4 h-4 text-cream-muted transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </summary>
              <div className="px-4 pb-5 pt-2">
                <TextEditor text={text} setText={setText} />
              </div>
            </details>

            <div className="h-px bg-surface-border mx-4" role="separator" />

            {/* Format */}
            <details className="group section-reveal" open style={{animationDelay: '60ms'}}>
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-surface-raised/50 transition-colors rounded-lg">
                <h2 className="text-xs font-medium uppercase tracking-widest text-cream-muted">Format</h2>
                <svg className="w-4 h-4 text-cream-muted transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </summary>
              <div className="px-4 pb-5 pt-2">
                <AspectRatioSelector aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} />
              </div>
            </details>

            <div className="h-px bg-surface-border mx-4" role="separator" />

            {/* Typography */}
            <details className="group section-reveal" open style={{animationDelay: '120ms'}}>
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-surface-raised/50 transition-colors rounded-lg">
                <h2 className="text-xs font-medium uppercase tracking-widest text-cream-muted">Typography</h2>
                <svg className="w-4 h-4 text-cream-muted transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </summary>
              <div className="px-4 pb-5 pt-2 space-y-5">
                <FontSelector selectedFont={fontFamily} setFont={setFontFamily} />
                <FontSizeSelector fontSize={fontSize} setFontSize={setFontSize} />
                <FontColorSelector 
                  fontColor={fontColor} 
                  setFontColor={setFontColor}
                  textStrokeColor={textStrokeColor}
                  setTextStrokeColor={setTextStrokeColor}
                />
              </div>
            </details>

            <div className="h-px bg-surface-border mx-4" role="separator" />

            {/* Background */}
            <details className="group section-reveal" open style={{animationDelay: '180ms'}}>
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-surface-raised/50 transition-colors rounded-lg">
                <h2 className="text-xs font-medium uppercase tracking-widest text-cream-muted">Background</h2>
                <svg className="w-4 h-4 text-cream-muted transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </summary>
              <div className="px-4 pb-5 pt-2 space-y-4">
                <ImageSearch setBackgroundImage={setBackgroundImage} />
                {backgroundImage && (
                  <>
                    <ImageFitSelector imageFit={imageFit} setImageFit={setImageFit} />
                    <BlurSlider blurAmount={blurAmount} setBlurAmount={setBlurAmount} />
                  </>
                )}
              </div>
            </details>
          </section>

          {/* Right Column — Canvas + Download */}
          <section aria-labelledby="preview-heading" className="lg:sticky lg:top-20 h-fit section-reveal" style={{animationDelay: '100ms'}}>
            <div className="flex items-center justify-between mb-4">
              <h2 id="preview-heading" className="text-xs font-medium uppercase tracking-widest text-cream-muted">Preview</h2>
              <div className="flex items-center gap-2 text-[11px] text-cream-muted/60 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-copper inline-block" aria-hidden="true" />
                Live
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden border border-surface-border bg-surface-raised">
              <BannerCanvas
                ref={canvasRef}
                text={text}
                fontFamily={fontFamily}
                fontSize={fontSize}
                fontColor={fontColor}
                textStrokeColor={textStrokeColor}
                aspectRatio={aspectRatio}
                blurAmount={blurAmount}
                imageFit={imageFit}
                backgroundImage={backgroundImage}
              />
            </div>
            
            <DownloadButton canvasRef={canvasRef} />

            {/* Visitor Badge */}
            <div className="mt-8 flex justify-center opacity-40 hover:opacity-70 transition-opacity">
              <img 
                src="https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fkasuken.github.io%2Fbanner-creator%2F&countColor=%23263759" 
                alt="Visitor count badge"
                className="rounded"
              />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 mt-16" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Images powered by <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 font-medium">Unsplash</a>
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/kasuken/banner-creator" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="View source code on GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">View on GitHub</span>
              </a>
              <p className="text-xs text-gray-500">
                Made with ❤️ for creators everywhere
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;