import React, { useRef } from 'react';

interface ImageUploaderProps {
  currentImage: string | null;
  onImageSelect: (base64: string) => void;
  onReset: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ currentImage, onImageSelect, onReset }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (currentImage) {
    return (
      <div className="relative w-full max-w-md mx-auto aspect-square rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/10 group">
        <img src={currentImage} alt="Original" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button 
            onClick={onReset}
            className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            Change Photo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full max-w-md mx-auto aspect-[4/5] sm:aspect-square border-2 border-dashed border-slate-600 rounded-2xl flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:border-primary hover:bg-slate-800/30 transition-all group"
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-primary/20">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Upload your photo</h3>
      <p className="text-slate-400 text-sm mb-6">Drag & drop or tap to upload a selfie</p>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      <div className="bg-slate-800 px-4 py-2 rounded-lg text-xs text-slate-400">
        Supports JPG, PNG, WEBP
      </div>
    </div>
  );
};