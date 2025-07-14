import { QRCodeSVG } from 'qrcode.react';

interface PostCanvasProps {
  template: any;
  personalization?: any;
  customText?: string;
  customImage?: string;
  postType?: 'quick' | 'upload';
  showTextOnImage?: boolean;
}

const PostCanvas = ({ template, personalization, customText, customImage, postType = 'quick', showTextOnImage = true }: PostCanvasProps) => {
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

  // Unified layout for all post types
  const hasCustomText = customText && customText.trim() !== '';
  const imageHeight = hasCustomText ? '400px' : '540px';
  const textHeight = hasCustomText ? '140px' : '0px';

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
        <div className="relative w-full flex-1 bg-gray-100 p-4 pb-2">
          <div className="w-full h-full bg-white shadow-inner">
            <img 
              src={getImageSrc()}
              alt="Post image"
              className="w-full h-full object-contain"
            />
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