
import HeroSection from "@/components/HeroSection";
import EmailSignup from "@/components/EmailSignup";
import CalendarSection from "@/components/CalendarSection";
import ShareSection from "@/components/ShareSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
        <EmailSignup />
        <CalendarSection />
        <ShareSection />
        
        {/* Footer */}
        <footer className="text-center py-12 border-t border-white/10 mt-16">
          <div className="mb-4">
            <img 
              src="/lovable-uploads/02c9439c-bc1e-4d30-83a5-8ed0e49fab85.png" 
              alt="Facing Fentanyl Logo" 
              className="mx-auto h-16 object-contain"
            />
          </div>
          <p className="text-gray-400 text-sm">
            Together we can save lives
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
