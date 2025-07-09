
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

  return (
    <div 
      id="post-canvas" 
      className="relative w-[540px] h-[540px] mx-auto bg-white shadow-lg overflow-hidden"
      style={{ fontSize: '16px' }}
    >
      {/* Top Section - User Photo (60% height) */}
      <div className="relative w-full h-[324px] overflow-hidden">
        <img 
          src={getImageSrc()}
          alt="Memorial photo"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Middle Section - Black background with cursive message (20% height) */}
      <div className="w-full h-[108px] bg-black flex items-center justify-center px-6">
        <p className="text-white font-kalam text-lg text-center leading-tight">
          {getMessage()}
        </p>
      </div>
      
      {/* Bottom Section - Blue gradient with branding (20% height) */}
      <div className="w-full h-[108px] bg-gradient-to-r from-blue-800 to-blue-600 flex items-center justify-between px-6">
        <div className="flex items-center">
          <div className="text-white">
            <div className="text-lg font-bold tracking-wide">FACING FENTANYL</div>
            <div className="text-sm opacity-90">FacingFentanylNow.org/day-of-experience</div>
          </div>
        </div>
        
        {/* Logo placeholder - you can replace this with actual logo */}
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default PostCanvas;
