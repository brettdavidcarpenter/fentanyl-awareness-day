import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from 'react';

interface PostCanvasProps {
  template: any;
  personalization?: any;
  customText?: string;
  customImage?: string;
  postType?: 'quick' | 'upload';
  showTextOnImage?: boolean;
}

const PostCanvas = ({ template, personalization, customText, customImage, postType = 'quick', showTextOnImage = true }: PostCanvasProps) => {
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const getMessage = () => {
    if (customText) return customText;
    
    let message = template.message;
    if (personalization) {
      message = message
        .replace('[Name]', personalization.name || '')
        .replace('[relationship]', personalization.relationship || '');
    }
    return message;
  };

  const getImageSrc = () => {
    if (customImage) return customImage;
    return template.imagePath;
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight
    });
    setImageLoaded(true);
  };

  // Calculate dynamic sizing based on image aspect ratio
  const hasCustomText = customText && customText.trim() !== '';
  const aspectRatio = imageDimensions ? imageDimensions.width / imageDimensions.height : 1;
  
  // iPhone-optimized aspect ratio detection
  const isIPhoneLandscape = aspectRatio >= 1.25 && aspectRatio <= 1.4; // ~4:3 ratio
  const isIPhonePortrait = aspectRatio >= 0.7 && aspectRatio <= 0.8; // ~3:4 ratio
  const isSquare = Math.abs(aspectRatio - 1) < 0.1;
  const isWidePortrait = aspectRatio < 0.7; // Very tall images
  const isWideLandscape = aspectRatio > 1.4; // Very wide images
  
  // Mobile-optimized height calculation
  const getImageAreaHeight = () => {
    // Use flex-1 for responsive height instead of fixed pixels on mobile
    return 'auto';
  };

  // Better object fit strategy based on image type
  const getObjectFit = () => {
    if (!imageDimensions) return 'object-contain';
    
    // For uploaded images, use cover to fill the frame better and reduce white space
    if (customImage) {
      // Use cover for most cases to minimize white space
      if (isSquare || isIPhoneLandscape || isIPhonePortrait) {
        return 'object-cover';
      }
      // Only use contain for extreme ratios
      return 'object-contain';
    }
    
    // For template images, use the existing logic
    return aspectRatio > 0.5 && aspectRatio < 2 ? 'object-cover' : 'object-contain';
  };

  return (
    <div 
      id="post-canvas" 
      className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[400px] mx-auto bg-white p-2 sm:p-3 lg:p-4 shadow-2xl"
      style={{ 
        fontSize: '16px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.2)',
        maxHeight: '90%',
        aspectRatio: 'auto'
      }}
    >
      {/* Polaroid-style inner container with black background */}
      <div className="w-full bg-black flex flex-col border-4 sm:border-6 lg:border-8 border-white">
        {/* Image section with polaroid frame - constrained height */}
        <div className="relative w-full bg-black p-2 sm:p-3 lg:p-4 pb-1 sm:pb-2 flex-shrink-0" style={{ height: '200px' }}>
          <div className="w-full h-full bg-white shadow-inner border-2 border-white relative overflow-hidden">
            <img 
              src={getImageSrc()}
              alt="Post image"
              className={`w-full h-full ${getObjectFit()}`}
              style={{ objectPosition: 'center' }}
              onLoad={handleImageLoad}
              onError={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="text-gray-400 text-sm">Loading...</div>
              </div>
            )}
            
          </div>
        </div>
        
        {/* Polaroid bottom section with flex layout for text and logo */}
        <div className={`w-full bg-black flex flex-shrink-0 ${customImage ? 'items-center justify-between h-12 sm:h-16 lg:h-20 px-2 sm:px-3 lg:px-4 py-1 sm:py-2' : 'items-end h-10 sm:h-12 lg:h-16 px-2 sm:px-3 lg:px-4'}`}>
          {/* Text area - constrained to left 60% when custom image, centered otherwise */}
          <div className={customImage ? "flex-1 max-w-[70%] pr-1 sm:pr-2" : "flex-1"}>
            <p 
              className={`text-white font-dancing text-sm sm:text-base lg:text-lg leading-tight sm:leading-relaxed transform -rotate-2 ${customImage ? 'text-left' : 'text-center'}`}
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
            >
              {getMessage()}
            </p>
          </div>
          
          {/* Logo area - positioned and aligned to right edge for uploaded images only */}
          {customImage && (
            <div className="flex flex-col items-center justify-end gap-0">
              <img
                src="/lovable-uploads/a233bab7-5c2f-40e2-9d21-e61551abee33.png"
                alt="Facing Fentanyl Logo"
                className="w-12 sm:w-16 lg:w-20 h-auto mb-0 block"
              />
              <div 
                className="text-white font-normal text-center -mt-1 sm:-mt-2 lg:-mt-3 mb-0 block text-xs sm:text-sm lg:text-base"
                style={{ 
                  fontSize: '8px',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                }}
              >
                facingfentanylnow.org
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCanvas;