import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Button } from './components/Button';
import { GeneratedGallery } from './components/GeneratedGallery';
import { generateNewLook, detectGender } from './services/geminiService';
import { Gender, GeneratedImage } from './types';
import { STYLE_OPTIONS } from './constants';

// Helper to resize image to manageable size for API and Browser performance
const resizeImage = (base64Str: string, maxWidth = 1024): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        // Compress to JPEG 0.8 to reduce payload size significantly
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      } else {
        resolve(base64Str); // Fallback
      }
    };
    img.onerror = () => resolve(base64Str); // Fallback
  });
};

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<Gender>(Gender.MALE);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = async (base64: string) => {
    try {
      // Resize immediately on selection to keep app responsive
      const resized = await resizeImage(base64);
      setOriginalImage(resized);
      setGeneratedImages([]);
      setError(null);
      setProgress(0);
    } catch (e) {
      console.error("Error processing image", e);
      setOriginalImage(base64);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImages([]);
    setError(null);
    setProgress(0);
  };

  const handleGenerateGrid = async () => {
    if (!originalImage) return;

    setLoading(true);
    setError(null);
    setGeneratedImages([]);
    setProgress(0);

    try {
      // Step 1: Detect Gender (Silent)
      let currentGender = Gender.MALE;
      try {
        currentGender = await detectGender(originalImage);
        setSelectedGender(currentGender);
      } catch (err) {
        console.error("Gender detection failed, defaulting to Male", err);
        // Fallback to Male (default)
      }

      // Step 2: Generate Images using the detected gender
      const availableStyles = STYLE_OPTIONS.filter(opt => opt.gender === currentGender);
      let completedCount = 0;
      
      // Process in batches to avoid freezing the browser with too many parallel requests
      const BATCH_SIZE = 3;
      
      for (let i = 0; i < availableStyles.length; i += BATCH_SIZE) {
        const batch = availableStyles.slice(i, i + BATCH_SIZE);
        
        await Promise.allSettled(batch.map(async (styleOption) => {
          try {
            const generatedUrl = await generateNewLook(originalImage, currentGender, styleOption.value);
            
            const newImage: GeneratedImage = {
              id: `img-${Date.now()}-${styleOption.id}`,
              url: generatedUrl,
              style: styleOption.label,
              timestamp: Date.now()
            };

            setGeneratedImages(prev => {
              const newList = [...prev, newImage];
              return newList.sort((a, b) => {
                const indexA = availableStyles.findIndex(s => s.label === a.style);
                const indexB = availableStyles.findIndex(s => s.label === b.style);
                return indexA - indexB;
              });
            });
          } catch (err) {
            console.error(`Failed to generate ${styleOption.label}`, err);
          } finally {
            completedCount++;
            setProgress(Math.round((completedCount / availableStyles.length) * 100));
          }
        }));
      }
    } catch (err) {
      setError("Something went wrong during generation. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-dark pointer-events-none" />
      
      <main className="relative max-w-7xl mx-auto px-4 py-8 lg:py-12 flex flex-col items-center">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
            <span className="text-white">Style</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">AI</span>
            <span className="text-white"> Studio</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Upload a selfie to instantly generate a <span className="text-white font-bold">9-Grid Fashion Collection</span>.
            <br/>
            Features <span className="text-primary font-bold">Centered Composition</span> & <span className="text-secondary font-bold">Trendy Outfits</span>.
          </p>
        </header>

        <div className="w-full grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Upload & Controls */}
          <div className="lg:col-span-4 space-y-8 sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto lg:pr-2 custom-scrollbar">
            <div className="bg-card p-6 rounded-3xl border border-white/5 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-white flex items-center gap-2">
                   <span className="bg-primary w-2 h-8 rounded-full"></span>
                   Step 1: Upload
                 </h2>
              </div>
              <ImageUploader 
                currentImage={originalImage} 
                onImageSelect={handleImageSelect}
                onReset={handleReset}
              />
              
              {originalImage && (
                <div className="mt-8 animate-fade-in space-y-6">
                   <Button 
                     onClick={handleGenerateGrid}
                     isLoading={loading}
                     disabled={loading}
                     className="w-full py-4 text-lg shadow-xl"
                     variant="primary"
                   >
                     {loading ? `Designing... ${progress}%` : '✨ Generate Fashion 9-Grid'}
                   </Button>
                   
                   {loading && (
                     <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                       <div 
                         className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                         style={{ width: `${progress}%` }}
                       />
                     </div>
                   )}
                </div>
              )}
            </div>
            
            {/* Instructions / Tips */}
            <div className="bg-slate-800/30 p-6 rounded-3xl border border-white/5">
               <h3 className="font-bold text-white mb-2">How it works</h3>
               <ul className="text-slate-400 text-sm space-y-2 list-disc list-inside">
                 <li>Upload a clear selfie showing your face.</li>
                 <li>AI extracts your avatar.</li>
                 <li>Generates 9 distinctive outfits.</li>
                 <li>Centers you perfectly in every shot.</li>
               </ul>
            </div>
          </div>

          {/* Right Column: Results Gallery */}
          <div className="lg:col-span-8 w-full">
             <div className="min-h-[600px] bg-card/30 rounded-3xl border border-dashed border-slate-700/50 p-6 lg:p-8 flex flex-col">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                   <span className="w-3 h-3 rounded-full bg-primary"></span>
                   Fashion Gallery
                </h2>
                
                {generatedImages.length > 0 ? (
                  <GeneratedGallery images={generatedImages} />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500 opacity-60">
                    {loading ? (
                      <div className="text-center">
                        <div className="text-6xl mb-4 animate-bounce">📸</div>
                        <p>AI is conducting your photoshoot...</p>
                        <p className="text-sm mt-2 text-slate-400">Trying on different outfits & centering shots...</p>
                      </div>
                    ) : (
                      <div className="text-center">
                         <svg className="w-20 h-20 mx-auto mb-4 stroke-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                         </svg>
                         <p className="text-lg">Your fashion looks will appear here</p>
                      </div>
                    )}
                  </div>
                )}
             </div>

             {/* Error Message */}
             {error && (
               <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 text-center animate-fade-in">
                 {error}
               </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;