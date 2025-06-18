
const PhotoSection = () => {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Join the Movement
          </h3>
          <p className="text-lg text-gray-300">
            Thousands gathered in Times Square for National Fentanyl Awareness Day
          </p>
        </div>
        
        {/* Black and white photo collage */}
        <div className="opacity-80 rounded-xl overflow-hidden">
          <img 
            src="/lovable-uploads/c3845ee9-b4b7-4a9a-946b-adeb1c279481.png" 
            alt="Facing Fentanyl NYC Event Photos" 
            className="mx-auto max-w-full h-auto"
          />
        </div>
        
        <div className="mt-8 bg-black/20 backdrop-blur-sm border border-white/20 rounded-xl p-6 max-w-2xl mx-auto">
          <p className="text-white font-semibold text-lg">
            Be part of something bigger. Your voice matters.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PhotoSection;
