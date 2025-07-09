import { QRCodeSVG } from 'qrcode.react';

interface PostCanvasProps {
  template: any;
  personalization?: any;
  customText?: string;
  customImage?: string;
}

const PostCanvas = ({ template, personalization, customText, customImage }: PostCanvasProps) => {
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

  if (isFamilyPost) {
    return (
      <div 
        id="post-canvas" 
        className="relative w-[540px] h-[540px] mx-auto shadow-lg overflow-hidden bg-gradient-to-r from-black to-blue-900"
        style={{ fontSize: '16px' }}
      >
        {/* Central Black Frame containing all content */}
        <div className="w-full h-full flex items-center justify-center p-12 relative">
          {/* Logo - Bottom Right of entire post */}
          <div className="absolute bottom-4 right-4">
            <img 
              src="/lovable-uploads/070b7c42-c1ba-4a5e-a936-88454e322deb.png"
              alt="Facing Fentanyl Logo"
              className="h-12 w-auto"
            />
          </div>
          
          <div className="bg-black p-8 shadow-2xl flex flex-col items-center justify-between min-h-[420px]">
            
            {/* Photo Section */}
            <div className="flex items-center justify-center mb-8">
              <img 
                src={getImageSrc()}
                alt="Memorial photo"
                className="max-w-[280px] max-h-[280px] w-auto h-auto object-cover"
              />
            </div>
            
            {/* Bottom Section - Text and QR Code aligned */}
            <div className="flex items-end justify-between w-full px-4">
              {/* Left side - Cursive text */}
              <div className="flex-1">
                <p className="text-white font-dancing text-2xl font-bold leading-tight text-left transform -rotate-12">
                  share the message<br />save a life
                </p>
              </div>
              
              {/* Right side - QR Code */}
              <div className="flex items-end">
                <div className="bg-white p-2 rounded">
                  <QRCodeSVG value={qrCodeUrl} size={48} />
                </div>
              </div>
            </div>
            
          </div>
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
      {/* Logo - Bottom Right of entire post */}
      <div className="absolute bottom-4 right-4 z-10">
        <img 
          src="/lovable-uploads/070b7c42-c1ba-4a5e-a936-88454e322deb.png"
          alt="Facing Fentanyl Logo"
          className="h-12 w-auto"
        />
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
        
        {/* QR Code where logo used to be */}
        <div className="bg-white p-1 rounded">
          <QRCodeSVG value={qrCodeUrl} size={36} />
        </div>
      </div>
    </div>
  );
};

export default PostCanvas;