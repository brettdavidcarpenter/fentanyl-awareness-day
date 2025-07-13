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

  const isFamilyPost = template?.postType === 'family-template' || template?.postType === 'family-custom';
  const qrCodeUrl = window.location.origin + '/day-of-experience';

  // For family templates with default image or upload posts without custom image
  if ((isFamilyPost && !customImage) || (postType === 'upload' && !customImage)) {
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
  }

  return (
    <div 
      id="post-canvas" 
      className="relative w-[540px] h-[540px] mx-auto bg-black shadow-lg overflow-hidden"
      style={{ fontSize: '16px' }}
    >
      {/* QR Code - Top Right */}
      <div className="absolute top-4 right-4 bg-white p-2 rounded z-10">
        <QRCodeSVG value={qrCodeUrl} size={48} />
      </div>
      
      {/* Top Section - User Photo (65% height) */}
      <div className="relative w-full h-[351px] overflow-hidden">
        <img 
          src={getImageSrc()}
          alt="Memorial photo"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Black divider line */}
      <div className="w-full h-[2px] bg-black"></div>
      
      {/* Middle Section - Black background with message (25% height) */}
      <div className="w-full h-[133px] bg-black flex items-center justify-center px-8">
        <p className="text-white text-xl leading-relaxed text-center max-w-[480px]">
          {getMessage()}
        </p>
      </div>
      
      {/* Bottom Section - Blue gradient with branding (10% height) */}
      <div className="w-full h-[54px] bg-gradient-to-b from-blue-900 to-blue-600 flex items-center justify-between px-6">
        <div className="text-white text-xs font-medium">
          facingfentanylnow.org
        </div>
        
        {/* Logo */}
        <div className="text-white text-xs font-bold tracking-wider border border-white/30 px-2 py-1">
          FACING FENTANYL
        </div>
      </div>
    </div>
  );
};

export default PostCanvas;