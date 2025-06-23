
import HeroSection from "@/components/HeroSection";
import CTASection from "@/components/CTASection";
import { Shield, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { isEventWindowActive, getDaysUntilEvent } from "@/utils/eventWindow";
import { useEffect, useState } from "react";

const Index = () => {
  const [eventActive, setEventActive] = useState(false);
  const [daysUntil, setDaysUntil] = useState(0);

  useEffect(() => {
    setEventActive(isEventWindowActive());
    setDaysUntil(getDaysUntilEvent());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700">
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
        
        {/* Day of Experience Section - Always Visible */}
        <div className="text-center py-16 border-t border-white/10">
          <div className="max-w-2xl mx-auto">
            {eventActive ? (
              <>
                <Calendar className="w-16 h-16 mx-auto mb-6 text-green-400" />
                <h2 className="text-3xl font-bold text-white mb-4">
                  Fentanyl Awareness Day Experience
                </h2>
                <p className="text-xl text-blue-100 mb-8">
                  Create and share powerful posts to amplify awareness and save lives
                </p>
                <Link to="/day-of-experience">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                    Create Your Post Now
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Clock className="w-16 h-16 mx-auto mb-6 text-blue-300" />
                <h2 className="text-3xl font-bold text-white mb-4">
                  Fentanyl Awareness Day Experience
                </h2>
                <p className="text-xl text-blue-100 mb-4">
                  Preview the experience that will be available during Fentanyl Prevention Week
                </p>
                {daysUntil > 0 && (
                  <p className="text-lg text-white/80 mb-6">
                    Full experience opens in {daysUntil} days (August 14-28, 2025)
                  </p>
                )}
                <Link to="/day-of-experience">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Preview Experience
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
        
        <CTASection />
        
        {/* Footer */}
        <footer className="text-center py-12 border-t border-white/10 mt-16">
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
