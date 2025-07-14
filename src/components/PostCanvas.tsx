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
  const isPortrait = imageDimensions ? imageDimensions.height > imageDimensions.width : false;
  const isSquare = imageDimensions ? Math.abs(imageDimensions.width - imageDimensions.height) < 50 : false;
  
  // Dynamic height calculation for better aspect ratio handling
  const getImageAreaHeight = () => {
    if (!imageDimensions) return hasCustomText ? '360px' : '428px';
    
    if (isSquare) return hasCustomText ? '360px' : '428px';
    if (isPortrait) return hasCustomText ? '380px' : '448px';
    return hasCustomText ? '340px' : '408px'; // landscape
  };

  // Better object fit strategy based on image type
  const getObjectFit = () => {
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
      {/* Polaroid-style inner container */}
      <div className="w-full h-full bg-white flex flex-col">
        {/* Image section with polaroid frame */}
        <div 
          className="relative w-full bg-gray-100 p-4 pb-2"
          style={{ height: getImageAreaHeight() }}
        >
          <div className="w-full h-full bg-white shadow-inner">
            <img 
              src={getImageSrc()}
              alt="Post image"
              className={`w-full h-full ${getObjectFit()}`}
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
        
        {/* Polaroid bottom section */}
        <div className="w-full h-20 bg-white flex flex-col justify-center px-4">
          {hasCustomText ? (
            <p className="text-gray-800 text-sm font-medium text-center leading-tight">
              {customText}
            </p>
          ) : (
            <div className="flex items-center justify-between">
              <div className="text-gray-600 text-xs">
                facingfentanylnow.org
              </div>
              <img 
                src="/lovable-uploads/070b7c42-c1ba-4a5e-a936-88454e322deb.png"
                alt="Facing Fentanyl Logo"
                className="h-6 w-auto"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCanvas;