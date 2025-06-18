
import HeroSection from "@/components/HeroSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700">
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
        <CTASection />
        
        {/* Footer - Updated layout */}
        <footer className="py-12 border-t border-white/10 mt-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/a233bab7-5c2f-40e2-9d21-e61551abee33.png" 
                alt="Facing Fentanyl Logo" 
                className="h-12 object-contain mr-4"
              />
              <p className="text-gray-300 text-sm">
                Together we can save lives
              </p>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-lg md:text-xl">
                NATIONAL FENTANYL
              </div>
              <div className="text-white font-bold text-lg md:text-xl">
                PREVENTION AND
              </div>
              <div className="text-white font-bold text-lg md:text-xl">
                AWARENESS DAY
              </div>
              <div className="text-blue-300 font-bold text-xl md:text-2xl mt-1">
                AUGUST 21
              </div>  
              <div className="text-blue-300 font-bold text-xl md:text-2xl">
                2025
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
