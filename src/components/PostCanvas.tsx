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

  if (isFamilyPost) {
    return (
      <div 
        id="post-canvas" 
        className="relative w-[540px] h-[540px] mx-auto bg-black shadow-lg overflow-hidden"
        style={{ fontSize: '16px' }}
      >
        {/* Top Section - Photo with black frame (60% height) */}
        <div className="w-full h-[324px] bg-black flex items-center justify-center p-6">
          <div className="border-2 border-black bg-black p-2">
            <img 
              src={getImageSrc()}
              alt="Memorial photo"
              className="w-[280px] h-[280px] object-cover"
            />
          </div>
        </div>
        
        {/* Middle Section - Cursive text on black background (30% height) */}
        <div className="w-full h-[162px] bg-black flex items-center justify-center px-6">
          <p className="text-white font-kalam text-2xl italic text-center leading-relaxed">
            {getMessage()}
          </p>
        </div>
        
        {/* Bottom Section - Branding on black background (10% height) */}
        <div className="w-full h-[54px] bg-black flex items-center justify-end px-6">
          <div className="text-right">
            <div className="text-white text-xs font-bold tracking-wider">
              FACING FENTANYL
            </div>
            <div className="text-white text-xs font-medium">
              facingfentanylnow.org
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