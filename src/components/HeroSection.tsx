
import { Heart, Clock, Bell, Settings, Shield, Calendar, Share2, Copy, CheckCircle } from "lucide-react";
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
  const [testMode, setTestMode] = useState(false);
  const [showTestSettings, setShowTestSettings] = useState(false);
  const [testDateOffset, setTestDateOffset] = useState(1);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

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
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('email-signup', {
        body: { 
          email,
          testMode,
          testDateOffsetDays: testDateOffset
        }
      });

      if (error) {
        console.error('Email signup error:', error);
        toast({
          title: "Error",
          description: "Failed to sign up for action reminders. Please try again.",
          variant: "destructive",
        });
      } else {
        const targetDateText = testDateOffset === 0 ? "today" : new Date(Date.now() + (testDateOffset * 24 * 60 * 60 * 1000)).toLocaleDateString();
        toast({
          title: "Success!",
          description: testMode 
            ? `Test mode enabled! Target date set to ${targetDateText}. The cron job will check for reminders every 5 minutes.`
            : "We'll remind you to take action on National Fentanyl Prevention & Awareness Day (August 21). Check your email for a welcome message!",
        });
        setEmail("");
      }
    } catch (error) {
      console.error('Email signup error:', error);
      toast({
        title: "Error",
        description: "Failed to sign up for action reminders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareMessage = `💔 I'm joining the movement to raise awareness about fentanyl and honor those we've lost.

August 21 is National Fentanyl Awareness Day — let's flood social media with stories, tributes, and life-saving facts.

We're planning a nationwide social media takeover — and you can be part of it.

👉 Sign up for a reminder to post:
🔗 ${shareUrl}

#FacingFentanyl #FentanylAwarenessDay #DrugAwareness #EndOverdose #OnePillCanKill`;

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      toast({
        title: "Message copied!",
        description: "The awareness message and link have been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually from your browser's address bar.",
        variant: "destructive",
      });
    }
  };

  const handleTwitterShare = () => {
    const twitterText = `💔 Join the movement to honor lives lost and raise awareness.

We're planning a social media takeover on Aug 21 for #FentanylAwarenessDay. Let's flood every feed with truth and remembrance.

👉 Sign up for a reminder: ${shareUrl}
#FacingFentanyl #EndOverdose #OnePillCanKill`;
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareMessage)}`;
    window.open(facebookUrl, '_blank');
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/5ab9e029-72aa-430b-8ef2-19421717168f.png" 
          alt="Fentanyl Awareness Campaign Collage" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/80"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Timer Bar */}
        <div className="w-full bg-black/60 backdrop-blur-md border-b border-white/20 py-4">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="mb-2">
                <h2 className="text-lg font-semibold text-white mb-1">National Fentanyl Prevention & Awareness Day</h2>
                <a 
                  href="https://www.congress.gov/bill/118th-congress/senate-resolution/323/text"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-gray-300 hover:text-blue-300 transition-colors bg-white/10 px-2 py-1 rounded-full border border-white/20"
                  aria-label="View Senate Resolution 323 on Congress.gov"
                >
                  <Shield className="w-3 h-3" />
                  Senate Resolution 323
                </a>
              </div>
              
              <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-300">{timeLeft.days}</div>
                  <div className="text-gray-300 text-xs">DAYS</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-300">{timeLeft.hours}</div>
                  <div className="text-gray-300 text-xs">HOURS</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-300">{timeLeft.minutes}</div>
                  <div className="text-gray-300 text-xs">MINUTES</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-300">{timeLeft.seconds}</div>
                  <div className="text-gray-300 text-xs">SECONDS</div>
                </div>
              </div>
              
              <div className="text-lg text-blue-200 font-semibold">
                AUGUST 21, 2025
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="container mx-auto px-4">
            {/* Logo and Main Headline */}
            <div className="text-center mb-16">
              <div className="mb-8">
                <img 
                  src="/lovable-uploads/a233bab7-5c2f-40e2-9d21-e61551abee33.png" 
                  alt="Facing Fentanyl Logo" 
                  className="mx-auto h-32 md:h-40 object-contain"
                />
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
                Make a post.<br />
                <span className="text-blue-300">Make an impact.</span>
              </h1>
              
              <p className="text-2xl md:text-3xl text-blue-200 font-semibold mb-4">
                Taking action together saves lives
              </p>
            </div>

            {/* CTA Cards Grid */}
            <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Email Signup Card */}
              <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-white">
                      Get Ready to Act
                    </h2>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTestSettings(!showTestSettings)}
                      className="text-gray-400 hover:text-white p-1"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-gray-300 text-sm">
                    We'll remind you to take action on National Fentanyl Prevention & Awareness Day
                  </p>
                </div>

                {/* Test Mode Settings */}
                {showTestSettings && (
                  <div className="mb-4 p-3 bg-white/10 rounded-lg border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        id="testMode"
                        checked={testMode}
                        onChange={(e) => setTestMode(e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="testMode" className="text-sm text-white">
                        Test Mode (Cron-based)
                      </label>
                    </div>
                    {testMode && (
                      <div className="mt-2">
                        <label className="block text-xs text-gray-300 mb-1">
                          Target date in (days - 0 = same day):
                        </label>
                        <Input
                          type="number"
                          min="0"
                          max="7"
                          value={testDateOffset}
                          onChange={(e) => setTestDateOffset(parseInt(e.target.value) || 0)}
                          className="bg-white/10 border-white/20 text-white text-sm h-8"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Cron job runs every 5 minutes
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
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
                    {isSubmitting ? "Signing up..." : "Remind Me to Act"}
                  </Button>
                </form>
              </div>

              {/* Share the Movement Card */}
              <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <div className="text-center mb-4">
                  <Share2 className="w-12 h-12 mx-auto mb-3 text-blue-300" />
                  <h2 className="text-xl font-bold text-white mb-2">
                    Share the Movement
                  </h2>
                  <p className="text-gray-300 text-sm">
                    Help spread awareness about National Fentanyl Awareness Day
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleTwitterShare}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Share on X/Twitter
                  </Button>
                  <Button
                    onClick={handleFacebookShare}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white"
                  >
                    Share on Facebook
                  </Button>
                  <Button
                    onClick={handleCopyShare}
                    variant="outline"
                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center gap-2"
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy Message"}
                  </Button>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-gray-400 text-xs">
                    Every share brings us closer to ending the fentanyl crisis
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
