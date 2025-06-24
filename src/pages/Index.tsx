
import HeroSection from "@/components/HeroSection";
import CTASection from "@/components/CTASection";
import { Shield, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700">
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
        <CTASection />
        
        {/* Low-key Day of Experience Preview Section - Moved to Bottom */}
        <div className="text-center py-12 border-t border-white/10 mt-8">
          <div className="max-w-xl mx-auto">
            <Calendar className="w-8 h-8 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              Preview the Day of Experience
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Get a sneak peek at the post creation tool that will become available the week of August 21st
            </p>
            <Link to="/day-of-experience">
              <Button 
                variant="outline" 
                className="bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
              >
                Preview Tool
              </Button>
            </Link>
          </div>
        </div>
        
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
