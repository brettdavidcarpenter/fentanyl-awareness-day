
import HeroSection from "@/components/HeroSection";
import EmailSignup from "@/components/EmailSignup";
import CalendarSection from "@/components/CalendarSection";
import ShareSection from "@/components/ShareSection";
import PhotoSection from "@/components/PhotoSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700">
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
        <EmailSignup />
        <PhotoSection />
        <CalendarSection />
        <ShareSection />
        
        {/* Footer */}
        <footer className="text-center py-12 border-t border-white/10 mt-16">
          <div className="mb-4">
            <img 
              src="/lovable-uploads/a233bab7-5c2f-40e2-9d21-e61551abee33.png" 
              alt="Facing Fentanyl Logo" 
              className="mx-auto h-16 object-contain"
            />
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
