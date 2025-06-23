
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
      className="relative w-[540px] h-[540px] mx-auto bg-white shadow-lg"
      style={{ fontSize: '16px' }}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${getImageSrc()})` }}
      />
      
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <div className="text-white">
          <p className="text-lg leading-relaxed mb-4 font-medium">
            {getMessage()}
          </p>
          
          {/* Watermark */}
          <div className="text-sm opacity-90 border-t border-white/20 pt-4">
            <p>Created at FacingFentanylNow.org/day-of-experience</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCanvas;
