
import { Clock, Heart, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const HeroSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const targetDate = new Date("2025-08-21T00:00:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call - in production, this would connect to Mailchimp or Firebase
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Email signup:", email);
    setIsSubmitted(true);
    setIsLoading(false);
    
    toast({
      title: "Success!",
      description: "You're on the list. We'll remind you before August 21.",
    });
  };

  return (
    <section className="text-center py-12 md:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Hero Call-to-Action Section */}
        <div className="mb-16">
          <Card className="max-w-2xl mx-auto bg-black/20 backdrop-blur-sm border-white/20 p-8 md:p-12">
            {/* Combined messaging section */}
            <div className="text-center mb-8">
              <Heart className="w-16 h-16 text-blue-300 mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Spread awareness.<br />
                <span className="text-blue-200">Save lives.</span>
              </h1>
              
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Join the movement. Help raise awareness about fentanyl.
              </p>
            </div>

            {/* Email Signup Section */}
            {!isSubmitted ? (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8">
                <div className="text-center mb-6">
                  <Bell className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Get Your Reminder
                  </h2>
                  <p className="text-gray-200 text-lg">
                    We'll send you a gentle reminder before<br />
                    National Fentanyl Awareness Day
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/30 text-white placeholder-gray-300 focus:border-blue-300 h-14 text-lg"
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-lg rounded-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Adding you to the list..." : "Remind me to post on Awareness Day"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-white font-semibold text-lg">
                    Together we can save lives
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-green-900/20 border-green-400/30 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">You're on the list!</h3>
                <p className="text-green-200 text-lg">
                  We'll remind you before August 21, 2025
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Event poster */}
        <div className="mb-12">
          <img 
            src="/lovable-uploads/7345c889-26f4-4523-8705-749f496e4bcf.png" 
            alt="National Fentanyl Prevention & Awareness Day - Times Square Event" 
            className="mx-auto max-w-full h-auto rounded-lg shadow-2xl"
          />
        </div>

        {/* Countdown */}
        <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-12 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Clock className="w-6 h-6 text-blue-300" />
            <h2 className="text-xl font-semibold text-white">Countdown to Awareness Day</h2>
          </div>
          
          <div className="grid grid-cols-4 gap-4 md:gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-blue-300">{timeLeft.days}</div>
              <div className="text-gray-300 text-sm md:text-base">DAYS</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-blue-300">{timeLeft.hours}</div>
              <div className="text-gray-300 text-sm md:text-base">HOURS</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-blue-300">{timeLeft.minutes}</div>
              <div className="text-gray-300 text-sm md:text-base">MINUTES</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-blue-300">{timeLeft.seconds}</div>
              <div className="text-gray-300 text-sm md:text-base">SECONDS</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
