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
  
  // iPhone-optimized height calculation with extra space for uploaded images
  const getImageAreaHeight = () => {
    // For uploaded images, reduce image area slightly to accommodate larger bottom section
    const baseHeight = customImage ? (hasCustomText ? '340px' : '408px') : (hasCustomText ? '360px' : '428px');
    
    if (!imageDimensions) return baseHeight;
    
    // For uploaded images, use slightly smaller heights
    if (customImage) {
      // iPhone landscape (4:3) - optimize for this common ratio
      if (isIPhoneLandscape) return hasCustomText ? '360px' : '428px';
      
      // iPhone portrait (3:4) - most common iPhone photo orientation
      if (isIPhonePortrait) return hasCustomText ? '380px' : '448px';
      
      // Square images
      if (isSquare) return hasCustomText ? '340px' : '408px';
      
      // Very wide landscape
      if (isWideLandscape) return hasCustomText ? '300px' : '368px';
      
      // Very tall portrait
      if (isWidePortrait) return hasCustomText ? '400px' : '468px';
      
      // Default fallback for uploaded images
      return hasCustomText ? '340px' : '408px';
    }
    
    // Original heights for template images
    // iPhone landscape (4:3) - optimize for this common ratio
    if (isIPhoneLandscape) return hasCustomText ? '380px' : '448px';
    
    // iPhone portrait (3:4) - most common iPhone photo orientation
    if (isIPhonePortrait) return hasCustomText ? '400px' : '468px';
    
    // Square images
    if (isSquare) return hasCustomText ? '360px' : '428px';
    
    // Very wide landscape
    if (isWideLandscape) return hasCustomText ? '320px' : '388px';
    
    // Very tall portrait
    if (isWidePortrait) return hasCustomText ? '420px' : '488px';
    
    // Default fallback
    return hasCustomText ? '360px' : '428px';
  };

  // Better object fit strategy based on image type
  const getObjectFit = () => {
    // For custom uploaded images, always use object-contain to preserve proportions
    if (customImage) return 'object-contain';
    
    // For template images, use the existing logic
    if (!imageDimensions) return 'object-contain';
    
    const aspectRatio = imageDimensions.width / imageDimensions.height;
    // Use cover for images close to square or landscape, contain for extreme ratios
    return aspectRatio > 0.5 && aspectRatio < 2 ? 'object-cover' : 'object-contain';
  };

  return (
    <div 
      id="post-canvas" 
      className="relative w-[540px] h-[540px] mx-auto bg-white p-6 shadow-2xl"
      style={{ 
        fontSize: '16px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.2)'
      }}
    >
      {/* Polaroid-style inner container with black background */}
      <div className="w-full h-full bg-black flex flex-col border-8 border-white">
        {/* Image section with polaroid frame */}
        <div 
          className="relative w-full bg-black p-4 pb-2"
          style={{ height: getImageAreaHeight() }}
        >
          <div className="w-full h-full bg-white shadow-inner border-2 border-white relative">
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
        <div className={`w-full bg-black flex ${customImage ? 'items-center justify-between h-28 px-6 py-3' : 'items-end h-20 px-4'}`}>
          {/* Text area - constrained to left 60% when custom image, centered otherwise */}
          <div className={customImage ? "flex-1 max-w-[60%] pr-4" : "flex-1"}>
            <p 
              className={`text-white font-dancing text-lg leading-relaxed transform -rotate-2 ${customImage ? 'text-left' : 'text-center'}`}
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
            >
              {getMessage()}
            </p>
          </div>
          
          {/* Logo area - positioned and aligned to right edge for uploaded images only */}
          {customImage && (
            <div className="flex flex-col items-center justify-center">
              <img
                src="/lovable-uploads/a233bab7-5c2f-40e2-9d21-e61551abee33.png"
                alt="Facing Fentanyl Logo"
                className="w-20 h-auto mb-2"
              />
              <div 
                className="text-white font-semibold text-center"
                style={{ 
                  fontSize: '12px',
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