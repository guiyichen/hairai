import React, { useState } from 'react';
import { GeneratedImage } from '../types';

interface GeneratedGalleryProps {
  images: GeneratedImage[];
}

export const GeneratedGallery: React.FC<GeneratedGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  if (images.length === 0) return null;

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `hair-ai-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async (img: GeneratedImage) => {
    if (navigator.share) {
      try {
        // Convert base64 to blob for sharing
        const res = await fetch(img.url);
        const blob = await res.blob();
        const file = new File([blob], 'hair-ai-style.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'My New HairAI Look',
          text: `Check out my new ${img.style} look created with HairAI Studio!`,
          files: [file]
        });
      } catch (err) {
        console.log('Error sharing:', err);
        // Fallback or ignore cancel
      }
    } else {
      // Fallback: Copy to clipboard or just alert
      alert("Sharing is not supported on this browser/device. Please download the image to share manually!");
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in pb-12">
        {images.map((img, index) => (
          <div 
            key={img.id} 
            className="group relative aspect-square bg-slate-900 rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-primary/50 transition-all hover:scale-[1.02] shadow-lg"
            onClick={() => setSelectedImage(img)}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <img 
              src={img.url} 
              alt={img.style} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              <span className="text-white font-medium text-sm truncate">{img.style}</span>
              <span className="text-primary text-xs">Click to Share</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Overlay */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedImage(null)}>
          <div className="bg-card w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="p-4 flex justify-between items-center border-b border-white/5">
              <h3 className="text-lg font-bold text-white">{selectedImage.style}</h3>
              <button onClick={() => setSelectedImage(null)} className="text-slate-400 hover:text-white p-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Image */}
            <div className="relative aspect-square bg-black">
              <img src={selectedImage.url} alt={selectedImage.style} className="w-full h-full object-contain" />
            </div>

            {/* Actions */}
            <div className="p-6 bg-slate-900">
               <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleDownload(selectedImage.url)}
                    className="flex items-center justify-center gap-2 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Save Image
                  </button>
                  <button 
                    onClick={() => handleShare(selectedImage)}
                    className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:opacity-90 transition-opacity font-medium shadow-lg shadow-primary/20"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
               </div>
               <p className="text-center text-slate-500 text-xs mt-4">
                 Tap Share to post to your favorite social apps like WeChat, WhatsApp, or Instagram.
               </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};