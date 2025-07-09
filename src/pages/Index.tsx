
import HeroSection from "@/components/HeroSection";
import CTASection from "@/components/CTASection";
import ShareSection from "@/components/ShareSection";
import { Shield, Heart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700">
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
        
        {/* What You Can Do Bridging Section */}
        <section className="py-12 text-center relative">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Heart className="w-10 h-10 text-blue-400 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                What you can do
              </h2>
              <p className="text-lg text-blue-200 mb-2">
                Join thousands taking action nationwide
              </p>
              <p className="text-gray-300">
                Every voice matters. Every story saves lives. Choose how you want to make a difference.
              </p>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <CTASection />
        
        {/* Share Section */}
        <ShareSection />
        
        {/* Facing Fentanyl Awareness Image Section */}
        <section className="py-12 text-center border-t border-white/10 mt-8">
          <div className="max-w-4xl mx-auto">
            <img 
              src="/lovable-uploads/dc4d37af-f28d-4f94-8ecc-3b78573ab25b.png" 
              alt="Facing Fentanyl Awareness - Be the Change" 
              className="mx-auto max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </section>
        
        {/* Footer */}
        <footer className="text-center py-12 border-t border-white/10 mt-8">
          <div className="mb-4">
            <img 
              src="/lovable-uploads/a233bab7-5c2f-40e2-9d21-e61551abee33.png" 
              alt="Facing Fentanyl Logo" 
              className="mx-auto h-16 object-contain"
            />
          </div>
          
          {/* Senate Resolution Recognition */}
          <div className="mb-4">
            <a 
              href="https://www.congress.gov/bill/118th-congress/senate-resolution/323/text"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-blue-300 transition-colors text-sm"
              aria-label="View Senate Resolution 323 on Congress.gov"
            >
              <Shield className="w-4 h-4" />
              Recognized by U.S. Senate Resolution 323
            </a>
          </div>
          
          <p className="text-gray-300 text-sm">
            Together we can save lives
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
