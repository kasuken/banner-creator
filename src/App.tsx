import React, { useState, useRef } from 'react';
import BannerCanvas from './components/BannerCanvas';
import TextEditor from './components/TextEditor';
import FontSelector from './components/FontSelector';
import FontSizeSelector from './components/FontSizeSelector';
import FontColorSelector from './components/FontColorSelector';
import AspectRatioSelector, { AspectRatio } from './components/AspectRatioSelector';
import BlurSlider from './components/BlurSlider';
import ImageSearch from './components/ImageSearch';
import DownloadButton from './components/DownloadButton';

const App: React.FC = () => {
  const [text, setText] = useState('Create Beautiful Banners');
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
    const [fontSize, setFontSize] = useState(72);
    const [fontColor, setFontColor] = useState('#ffffff');
    const [textStrokeColor, setTextStrokeColor] = useState('#000000');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('blog-1000:420');
    const [blurAmount, setBlurAmount] = useState(8);
  const [backgroundImage, setBackgroundImage] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" lang="en">
      {/* Skip to main content link for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-indigo-600 focus:text-white focus:rounded-lg focus:shadow-xl"
      >
        Skip to main content
      </a>
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg" aria-hidden="true">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Banner Creator
                </h1>
                <p className="text-sm text-gray-600">Professional banners in seconds</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-medium shadow-sm">
                Free
              </span>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <section aria-label="Banner customization controls" className="space-y-6">
            {/* Text Section */}
            <section aria-labelledby="content-heading" className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                <h2 id="content-heading" className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Content
                </h2>
              </div>
              <div className="p-6">
                <TextEditor text={text} setText={setText} />
              </div>
            </section>

            {/* Format Section */}
            <section aria-labelledby="format-heading" className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
                <h2 id="format-heading" className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  Format & Size
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <AspectRatioSelector aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} />
              </div>
            </section>

            {/* Typography Section */}
            <section aria-labelledby="typography-heading" className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-rose-600 px-6 py-4">
                <h2 id="typography-heading" className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  Typography
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <FontSelector selectedFont={fontFamily} setFont={setFontFamily} />
                <FontSizeSelector fontSize={fontSize} setFontSize={setFontSize} />
                <FontColorSelector 
                  fontColor={fontColor} 
                  setFontColor={setFontColor}
                  textStrokeColor={textStrokeColor}
                  setTextStrokeColor={setTextStrokeColor}
                />
              </div>
            </section>

            {/* Background Section */}
            <section aria-labelledby="background-heading" className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4">
                <h2 id="background-heading" className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Background
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <ImageSearch setBackgroundImage={setBackgroundImage} />
                {backgroundImage && (
                  <BlurSlider blurAmount={blurAmount} setBlurAmount={setBlurAmount} />
                )}
              </div>
            </section>
          </section>

          {/* Right Column - Preview */}
          <section aria-labelledby="preview-heading" className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                <h2 id="preview-heading" className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Live Preview
                </h2>
              </div>
              <div className="p-6">
                <BannerCanvas
                  ref={canvasRef}
                  text={text}
                  fontFamily={fontFamily}
                  fontSize={fontSize}
                  fontColor={fontColor}
                  textStrokeColor={textStrokeColor}
                  aspectRatio={aspectRatio}
                  blurAmount={blurAmount}
                  backgroundImage={backgroundImage}
                />
                <DownloadButton canvasRef={canvasRef} />
              </div>
            </div>

            {/* Quick Tips */}
            <aside aria-labelledby="tips-heading" className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
              <h3 id="tips-heading" className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Quick Tips
              </h3>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>Use <kbd className="px-1.5 py-0.5 bg-white rounded text-xs border border-amber-300">Enter</kbd> for line breaks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>Search for high-quality images on Unsplash</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>Adjust blur for better text readability</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>Choose the right format for your platform</span>
                </li>
              </ul>
            </aside>
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
            <p className="text-xs text-gray-500">
              Made with ❤️ for creators everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;