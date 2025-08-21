
import { Heart, Clock, Bell, Settings, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { TrackedButton } from "@/components/TrackedButton";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { isAdminMode } from "@/utils/adminMode";

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
  const [showAdminControls, setShowAdminControls] = useState(false);
  const [isSendingTestEmails, setIsSendingTestEmails] = useState(false);
  const { toast } = useToast();

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

  useEffect(() => {
    setShowAdminControls(isAdminMode());
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

  const handleSendTestEmails = async () => {
    setIsSendingTestEmails(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-reminder-emails', {
        body: { forceTestMode: true }
      });

      if (error) {
        console.error('Send test emails error:', error);
        toast({
          title: "Error",
          description: "Failed to send test emails. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Test Emails Sent!",
          description: data?.message || "All eligible test reminder emails have been sent immediately.",
        });
      }
    } catch (error) {
      console.error('Send test emails error:', error);
      toast({
        title: "Error",
        description: "Failed to send test emails. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingTestEmails(false);
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
            Taking action together saves lives
          </p>
        </div>

        {/* Countdown and Email Signup Cards */}
        <div className="grid md:grid-cols-5 gap-4 mb-12 max-w-5xl mx-auto">
          {/* Countdown Card - Takes 3/5 of the width on desktop */}
          <div className="md:col-span-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-4 md:p-6">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-white mb-2">National Fentanyl Prevention & Awareness Day</h2>
              
              {/* Senate Resolution Badge */}
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
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  Get Ready to Act
                </h2>
                {showAdminControls && (
                  <TrackedButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTestSettings(!showTestSettings)}
                    className="text-gray-400 hover:text-white p-1"
                    trackingName="admin_test_settings_toggle"
                    trackingCategory="admin"
                    trackingPage="home_hero"
                  >
                    <Settings className="w-4 h-4" />
                  </TrackedButton>
                )}
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
                 
                 {/* Send Test Emails Button */}
                 <div className="mt-3 pt-3 border-t border-white/20">
                   <TrackedButton
                     type="button"
                     onClick={handleSendTestEmails}
                     disabled={isSendingTestEmails}
                     variant="outline"
                     size="sm"
                     className="w-full text-xs border-white/20 text-white hover:bg-white/10"
                     trackingName="admin_send_test_emails"
                     trackingCategory="admin"
                     trackingPage="home_hero"
                   >
                     {isSendingTestEmails ? "Sending..." : "Send Test Emails Immediately"}
                   </TrackedButton>
                   <p className="text-xs text-gray-400 mt-1 text-center">
                     Sends all eligible test reminder emails now
                   </p>
                 </div>
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
              <TrackedButton 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                trackingName="hero_email_signup"
                trackingCategory="email_signup"
                trackingPage="home_hero"
                trackingData={{ testMode, testDateOffset }}
              >
                {isSubmitting ? "Signing up..." : "Remind Me to Act"}
              </TrackedButton>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
