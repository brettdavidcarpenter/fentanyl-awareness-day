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
      className="relative w-[540px] h-[540px] mx-auto shadow-lg overflow-hidden bg-black"
      style={{ fontSize: '16px' }}
    >
      {/* Image section */}
      <div className="relative w-full overflow-hidden" style={{ height: imageHeight }}>
        <img 
          src={getImageSrc()}
          alt="Post image"
          className="w-full h-full object-cover"
        />
        
        {/* Logo overlay on image */}
        <div className="absolute bottom-4 right-4">
          <img 
            src="/lovable-uploads/070b7c42-c1ba-4a5e-a936-88454e322deb.png"
            alt="Facing Fentanyl Logo"
            className="h-8 w-auto"
          />
        </div>
      </div>
      
      {/* Text section with divider - only show if custom text exists */}
      {hasCustomText && (
        <>
          {/* Black divider line */}
          <div className="w-full h-[2px] bg-black"></div>
          
          {/* Text area */}
          <div className="w-full bg-black flex items-center justify-center px-6" style={{ height: textHeight }}>
            <p className="text-white text-lg font-medium text-center leading-relaxed max-w-[480px]">
              {customText}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default PostCanvas;