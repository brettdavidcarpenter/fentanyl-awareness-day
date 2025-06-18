
import { Heart } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="text-center py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-8">
          <div className="bg-blue-600/20 p-4 rounded-full border border-blue-500/30">
            <Heart className="w-12 h-12 text-blue-400" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Spread awareness.<br />
          <span className="text-blue-400">Save lives.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          Join the movement. Help raise awareness about fentanyl.
        </p>
        
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            National Fentanyl Awareness Day
          </h2>
          <p className="text-gray-300 text-lg mb-6">
            August 21, 2025
          </p>
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-6">
            <p className="text-white font-medium">
              Together, we can make a difference. Every voice matters in the fight against fentanyl.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
