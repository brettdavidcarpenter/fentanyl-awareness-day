import { Heart, Clock, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const HeroSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // ... keep existing code (useEffect for countdown timer)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('email_signups')
        .insert([{ email }]);

      if (error) {
        // Handle duplicate email case
        if (error.code === '23505') {
          toast({
            title: "Already signed up!",
            description: "This email is already registered for reminders.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Success!",
          description: "We'll remind you to post on Fentanyl Awareness Day (August 21).",
        });
      }
      
      setEmail("");
    } catch (error) {
      console.error('Error signing up:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="text-center py-12 md:py-20">
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
          
          <p className="text-2xl md:text-3xl text-blue-200 font-semibold mb-4">
            Spreading awareness can save lives
          </p>
        </div>

        {/* Countdown and Email Signup Cards - Above Photo */}
        <div className="grid md:grid-cols-5 gap-4 mb-12 max-w-5xl mx-auto">
          {/* Countdown Card - Takes 3/5 of the width on desktop */}
          <div className="md:col-span-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-4 md:p-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-300" />
              <h2 className="text-lg font-semibold text-white">Countdown to Awareness Day</h2>
            </div>
            
            <div className="grid grid-cols-4 gap-2 md:gap-4">
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-bold text-blue-300">{timeLeft.days}</div>
                <div className="text-gray-300 text-xs md:text-sm">DAYS</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-bold text-blue-300">{timeLeft.hours}</div>
                <div className="text-gray-300 text-xs md:text-sm">HOURS</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-bold text-blue-300">{timeLeft.minutes}</div>
                <div className="text-gray-300 text-xs md:text-sm">MINUTES</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-bold text-blue-300">{timeLeft.seconds}</div>
                <div className="text-gray-300 text-xs md:text-sm">SECONDS</div>
              </div>
            </div>
            
            <div className="text-lg md:text-xl text-blue-200 font-semibold mt-3">
              AUGUST 21, 2025
            </div>
          </div>

          {/* Email Signup Card - Takes 2/5 of the width on desktop */}
          <div className="md:col-span-2 bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-4 md:p-6">
            <div className="mb-3">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                Get Reminded
              </h2>
              <p className="text-gray-300 text-sm">
                We'll remind you to post on Awareness Day
              </p>
            </div>
            
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                required
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                {isSubmitting ? "Signing up..." : "Remind Me"}
              </Button>
            </form>
          </div>
        </div>

        {/* Black and white photo collage - Now positioned below the cards */}
        <div className="mb-8 opacity-60">
          <img src="/lovable-uploads/c3845ee9-b4b7-4a9a-946b-adeb1c279481.png" alt="Facing Fentanyl NYC Event Photos" className="mx-auto max-w-full h-auto rounded-lg" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
