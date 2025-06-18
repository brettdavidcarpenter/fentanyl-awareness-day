
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
          <div className="inline-block bg-white text-black px-4 py-2 text-sm font-bold mb-4 rounded">
            FACING FENTANYL
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
