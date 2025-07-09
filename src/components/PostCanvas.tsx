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

  // For family templates or upload posts - just show image with logo
  if (isFamilyPost || postType === 'upload') {
    return (
      <div 
        id="post-canvas" 
        className="relative w-[540px] h-[540px] mx-auto shadow-lg overflow-hidden"
        style={{ fontSize: '16px' }}
      >
        {/* Just the image without QR code */}
        <img 
          src={getImageSrc()}
          alt="Post image"
          className="w-full h-full object-cover"
        />
        
        {/* Logo moved to bottom right without white background */}
        <div className="absolute bottom-4 right-4">
          <img 
            src="/lovable-uploads/070b7c42-c1ba-4a5e-a936-88454e322deb.png"
            alt="Facing Fentanyl Logo"
            className="h-8 w-auto"
          />
        </div>
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
      
      {/* Middle Section - Black background with cursive message (25% height) */}
      <div className="w-full h-[135px] bg-black flex items-center justify-start px-8">
        <p className="text-white font-kalam text-2xl leading-relaxed italic transform -rotate-2">
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