import { Heart, Clock, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
const HeroSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    toast
  } = useToast();
  useEffect(() => {
    const targetDate = new Date("2025-08-21T00:00:00").getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(difference % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)),
          minutes: Math.floor(difference % (1000 * 60 * 60) / (1000 * 60)),
          seconds: Math.floor(difference % (1000 * 60) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Success!",
      description: "We'll remind you to post on Fentanyl Awareness Day (August 21)."
    });
    setEmail("");
    setIsSubmitting(false);
  };
  return <section className="text-center py-12 md:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Main branding */}
        <div className="mb-12">
          <div className="mb-8">
            <img src="/lovable-uploads/a233bab7-5c2f-40e2-9d21-e61551abee33.png" alt="Facing Fentanyl Logo" className="mx-auto h-32 md:h-40 object-contain" />
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
            Make a post.<br />
            <span className="text-blue-300">Make an impact.</span>
          </h1>
          
          

          {/* Floating countdown timer beneath subtitle */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4 md:gap-6 mb-2">
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold text-blue-300">{timeLeft.days}</div>
                <div className="text-gray-300 text-xs">DAYS</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold text-blue-300">{timeLeft.hours}</div>
                <div className="text-gray-300 text-xs">HOURS</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold text-blue-300">{timeLeft.minutes}</div>
                <div className="text-gray-300 text-xs">MINUTES</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold text-blue-300">{timeLeft.seconds}</div>
                <div className="text-gray-300 text-xs">SECONDS</div>
              </div>
            </div>
            
            <div className="text-sm md:text-base text-blue-200 font-medium">
              AUGUST 21, 2025
            </div>
          </div>
        </div>

        {/* Email Signup Card - Now full width */}
        <div className="max-w-md mx-auto mb-12">
          <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Remind Me</h2>
              <p className="text-gray-300 text-sm">Spreading awareness saves lives. We'll remind you to post on National Fentanyl Awareness Day.</p>
            </div>
            
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <Input type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-gray-400" required />
              <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                {isSubmitting ? "Signing up..." : "Remind Me"}
              </Button>
            </form>
          </div>
        </div>

        {/* Black and white photo collage - Reduced bottom margin */}
        <div className="mb-4 opacity-60">
          <img src="/lovable-uploads/c3845ee9-b4b7-4a9a-946b-adeb1c279481.png" alt="Facing Fentanyl NYC Event Photos" className="mx-auto max-w-full h-auto rounded-lg" />
        </div>
      </div>
    </section>;
};
export default HeroSection;