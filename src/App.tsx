import React, { useState, useRef } from 'react';
import BannerCanvas from './components/BannerCanvas';
import TextEditor from './components/TextEditor';
import FontSelector from './components/FontSelector';
import FontSizeSelector from './components/FontSizeSelector';
import AspectRatioSelector, { AspectRatio } from './components/AspectRatioSelector';
import BlurSlider from './components/BlurSlider';
import ImageSearch from './components/ImageSearch';
import DownloadButton from './components/DownloadButton';

const App: React.FC = () => {
  const [text, setText] = useState('Your Banner Text');
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
  const [fontSize, setFontSize] = useState(82);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('blog-1000:420');
  const [blurAmount, setBlurAmount] = useState(8);
  const [backgroundImage, setBackgroundImage] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Banner Creator</h1>
          <p className="text-gray-600">Create stunning blog posts and socials</p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col items-center">
            <TextEditor text={text} setText={setText} />
            <AspectRatioSelector aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} />
            <FontSelector selectedFont={fontFamily} setFont={setFontFamily} />
            <FontSizeSelector fontSize={fontSize} setFontSize={setFontSize} />
            <ImageSearch setBackgroundImage={setBackgroundImage} />
            <BlurSlider blurAmount={blurAmount} setBlurAmount={setBlurAmount} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Preview</h2>
          <div className="flex flex-col items-center">
            <BannerCanvas
              ref={canvasRef}
              text={text}
              fontFamily={fontFamily}
              fontSize={fontSize}
              aspectRatio={aspectRatio}
              blurAmount={blurAmount}
              backgroundImage={backgroundImage}
            />
            <DownloadButton canvasRef={canvasRef} />
          </div>
        </div>

        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Images provided by Unsplash</p>
        </footer>
      </div>
    </div>
  );
};

export default App;