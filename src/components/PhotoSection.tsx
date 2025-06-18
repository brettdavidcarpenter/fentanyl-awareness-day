
const PhotoSection = () => {
  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto text-center">
        {/* Smaller credibility badge style */}
        <div className="inline-block bg-white/5 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-6 shadow-2xl">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              Join the Movement
            </h3>
            <p className="text-sm text-gray-300">
              Thousands gathered in Times Square
            </p>
          </div>
          
          {/* Smaller photo collage with frame */}
          <div className="relative rounded-lg overflow-hidden border-2 border-white/30 shadow-lg max-w-md mx-auto">
            <img 
              src="/lovable-uploads/c3845ee9-b4b7-4a9a-946b-adeb1c279481.png" 
              alt="Facing Fentanyl NYC Event Photos" 
              className="w-full h-auto opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          
          <div className="mt-4">
            <p className="text-white font-medium text-sm">
              Be part of something bigger
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoSection;
