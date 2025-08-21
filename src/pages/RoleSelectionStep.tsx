import { useNavigate, Link } from "react-router-dom";
import PersonaSelection from "@/components/PersonaSelection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Heart, Users, ArrowRight, TrendingUp, Globe, Clock, MessageCircle, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { TrackedButton } from "@/components/TrackedButton";
import { useToast } from "@/hooks/use-toast";

const RoleSelectionStep = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Countdown timer logic
  useEffect(() => {
    // Set target to 12:00 PM ET on August 21, 2025
    const targetDate = new Date("2025-08-21T12:00:00-04:00").getTime();
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

  const handlePersonaSelect = (persona: string) => {
    navigate(`/day-of-experience/create?persona=${encodeURIComponent(persona)}`);
  };

  // Share functionality
  const shareUrl = "https://facingfentanylnow.aware-share.com/day-of-experience";
  const textMessage = `Hey! I found this tool to create Fentanyl Awareness posts. Check it out: ${shareUrl}`;

  const handleTextToFriend = () => {
    const smsUrl = `sms:?body=${encodeURIComponent(textMessage)}`;
    const link = document.createElement('a');
    link.href = smsUrl;
    link.click();
    
    setTimeout(() => {
      toast({
        title: "Message ready to send!",
        description: "If SMS didn't open, the message is copied to your clipboard to paste in any messaging app.",
      });
    }, 1000);
    
    handleCopyMessage();
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(textMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700">
      <div className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <img 
              src="/lovable-uploads/368a6524-5175-45a5-ae1c-b08fdd48989f.png" 
              alt="Facing Fentanyl Logo" 
              className="h-20 mx-auto mb-4"
            />
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Share your Story
          </h1>
          
          {/* Tagline */}
          <p className="text-xl text-blue-200 mb-6">
            Create a social media post to raise awareness
          </p>
          
        </div>



        {/* Countdown Timer */}
        <div className="mb-8">
          <Card className="max-w-4xl mx-auto bg-black/30 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="text-center mb-3">
                <h2 className="text-lg font-semibold text-white mb-1">National Fentanyl Prevention & Awareness Day</h2>
                <p className="text-blue-200 text-xs">Let's make our voices heard louder than ever</p>
              </div>
              
              <div className="max-w-md mx-auto grid grid-cols-4 gap-2 mb-3">
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-blue-300">{timeLeft.days}</div>
                  <div className="text-gray-300 text-xs">DAYS</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-blue-300">{timeLeft.hours}</div>
                  <div className="text-gray-300 text-xs">HOURS</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-blue-300">{timeLeft.minutes}</div>
                  <div className="text-gray-300 text-xs">MINUTES</div>
                </div>
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold text-blue-300">{timeLeft.seconds}</div>
                  <div className="text-gray-300 text-xs">SECONDS</div>
                </div>
              </div>
              
              <div className="text-center text-base md:text-lg text-blue-200 font-semibold">
                AUGUST 21, 2025
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Role Selection */}
        <div className="mb-12">
          <PersonaSelection onPersonaSelect={handlePersonaSelect} />
        </div>

        {/* Help Others Create Posts Section - Made less prominent */}
        <div className="mb-8">
          <Card className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium text-white mb-1">
                  Help Others Create Posts Too
                </h3>
                <p className="text-gray-400 text-sm">
                  Share this tool with friends
                </p>
              </div>

              <div className="text-center">
                <TrackedButton
                  onClick={handleTextToFriend}
                  variant="outline"
                  className="bg-transparent border-white/20 text-white hover:bg-white/10 px-6 py-2 text-sm font-medium flex items-center justify-center gap-2 mx-auto"
                  trackingName="text_to_friend"
                  trackingCategory="social_share"
                  trackingPage="role_selection"
                >
                  <MessageCircle className="w-4 h-4" />
                  Text to a Friend
                </TrackedButton>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Senate Resolution Badge */}
        <div className="flex justify-center mb-8">
          <a 
            href="https://www.congress.gov/bill/118th-congress/senate-resolution/323/text"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-blue-200 hover:text-white transition-colors text-sm bg-white/10 border border-white/20 rounded-lg px-4 py-3 cursor-pointer"
            aria-label="View Senate Resolution 323 on Congress.gov"
            onClick={(e) => {
              console.log('Senate badge clicked');
              // Let the default behavior handle the navigation
            }}
          >
            <Shield className="w-5 h-5" />
            <div>
              <p className="font-semibold">Recognized by Senate Resolution 323</p>
              <p className="text-xs opacity-80">Supporting National Fentanyl Awareness Day</p>
            </div>
          </a>
        </div>

        {/* Footer Navigation */}
        <div className="text-center pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://facingfentanylnow.org/" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-200 hover:text-white transition-colors"
            >
              Learn more about our mission
            </a>
            <span className="hidden sm:inline text-blue-200">•</span>
            <Link 
              to="/privacy-policy"
              className="text-sm text-blue-200 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
          <p className="text-xs text-blue-200 mt-4">
            © 2024 Facing Fentanyl Now. Taking action together saves lives.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionStep;