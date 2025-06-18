
import HeroSection from "@/components/HeroSection";
import EmailSignup from "@/components/EmailSignup";
import CalendarSection from "@/components/CalendarSection";
import ShareSection from "@/components/ShareSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
        <EmailSignup />
        <CalendarSection />
        <ShareSection />
      </div>
    </div>
  );
};

export default Index;
