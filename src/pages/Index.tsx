
import HeroSection from "@/components/HeroSection";
import CTASection from "@/components/CTASection";
import { Shield, Heart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700">
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
        
        {/* What You Can Do Bridging Section */}
        <section className="py-16 md:py-20 text-center relative">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <Heart className="w-12 h-12 text-blue-400 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                What you can do
              </h2>
              <p className="text-xl md:text-2xl text-blue-200 mb-3 font-medium">
                Join thousands taking action nationwide
              </p>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                Every voice matters. Every story saves lives. Choose how you want to make a difference.
              </p>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <CTASection />
        
        {/* Facing Fentanyl Awareness Image Section */}
        <section className="py-16 md:py-20 text-center border-t border-white/10 mt-12">
          <div className="max-w-7xl mx-auto">
            <img 
              src="/lovable-uploads/dc4d37af-f28d-4f94-8ecc-3b78573ab25b.png" 
              alt="Facing Fentanyl Awareness - Be the Change" 
              className="mx-auto max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </section>
        
        {/* Footer */}
        <footer className="text-center py-16 md:py-20 border-t border-white/10 mt-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <img 
                src="/lovable-uploads/a233bab7-5c2f-40e2-9d21-e61551abee33.png" 
                alt="Facing Fentanyl Logo" 
                className="mx-auto h-20 md:h-24 object-contain"
              />
            </div>
            
            {/* Senate Resolution Recognition */}
            <div className="mb-6">
              <a 
                href="https://www.congress.gov/bill/118th-congress/senate-resolution/323/text"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-300 hover:text-blue-300 transition-colors text-base"
                aria-label="View Senate Resolution 323 on Congress.gov"
              >
                <Shield className="w-5 h-5" />
                Recognized by U.S. Senate Resolution 323
              </a>
            </div>
            
            <p className="text-gray-300 text-base">
              Together we can save lives
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
