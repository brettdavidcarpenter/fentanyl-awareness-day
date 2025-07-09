import { TrackedButton } from "@/components/TrackedButton";
import { Card } from "@/components/ui/card";
import { Calendar, Plus, Share2, Copy, CheckCircle, Target, Users, Bell, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import EnhancedFacebookShare from "./EnhancedFacebookShare";
import { isAdminMode } from "@/utils/adminMode";

const CTASection = () => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [showTestSettings, setShowTestSettings] = useState(false);
  const [testDateOffset, setTestDateOffset] = useState(1);
  const [isMessageExpanded, setIsMessageExpanded] = useState(false);
  const [showAdminControls, setShowAdminControls] = useState(false);
  const { toast } = useToast();

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
      // Calculate test target date if in test mode
      let testTargetDate = null;
      if (testMode) {
        const now = new Date();
        testTargetDate = new Date(now.getTime() + (testDateOffset * 24 * 60 * 60 * 1000));
      }

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

  const eventDetails = {
    title: "National Fentanyl Prevention and Awareness Day – Take Action",
    description: "Share your story • Honor a loved one • Spread life-saving facts. Visit facingfentanylnow.org/post",
    date: "20250821",
    time: "1200", // 12:00 PM
  };

  const shareUrl = "https://facingfentanylnow.aware-share.com/";
  const imageUrl = "/lovable-uploads/1a0ca659-f08d-4edc-b523-0f49ea25567a.png";
  
  const facebookText = `💔 I'm joining the movement for National Fentanyl Prevention and Awareness Day.

August 21 is our day to make our voices heard and save lives through action.

Here's how YOU can participate:
• Share your story or tribute
• Post life-saving prevention facts  
• Honor someone you've lost
• Spread the word to save others

Join thousands taking action nationwide. Together we can end this crisis.

👉 Sign up for a reminder: https://facingfentanylnow.aware-share.com/

#FacingFentanyl #NationalFentanylPreventionandAwarenessDay`;

  const twitterText = `💔 I'm joining the movement for National Fentanyl Prevention and Awareness Day.

August 21 is our day to raise awareness & post life-saving prevention facts. 

👉 Sign up for a reminder: https://facingfentanylnow.aware-share.com/

#FacingFentanyl #NationalFentanylPreventionandAwarenessDay`;

  const condensedMessage = `💔 I'm joining the movement for National Fentanyl Prevention and Awareness Day.

August 21 is our day to make our voices heard and save lives through action...`;

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${facebookText}\n\n${shareUrl}`);
      setCopied(true);
      toast({
        title: "Action message copied!",
        description: "The participation message and link have been copied to your clipboard.",
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

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Facing Fentanyl - National Fentanyl Prevention and Awareness Day",
          text: twitterText,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <section className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Enhanced Email Reminder CTA Card */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8 md:p-10 lg:p-12 flex flex-col">
            <div className="text-center mb-10">
              <Target className="w-14 h-14 text-blue-400 mx-auto mb-6" />
              <h3 className="text-3xl md:text-4xl font-semibold text-white mb-4">
                Plan to Take Action
              </h3>
              <p className="text-lg md:text-xl text-gray-300">
                Mark your calendar for National Fentanyl Prevention & Awareness Day
              </p>
            </div>

            <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-6 md:p-8 mb-8 flex-grow">
              <h4 className="text-white font-semibold mb-4 text-lg md:text-xl">{eventDetails.title}</h4>
              <p className="text-blue-200 text-base md:text-lg mb-4">📅 August 21, 2025</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-300 text-base md:text-lg">
                  <span className="text-blue-300 text-xl">•</span> Share your story or tribute
                </div>
                <div className="flex items-center gap-3 text-gray-300 text-base md:text-lg">
                  <span className="text-blue-300 text-xl">•</span> Honor someone you've lost
                </div>
                <div className="flex items-center gap-3 text-gray-300 text-base md:text-lg">
                  <span className="text-blue-300 text-xl">•</span> Spread life-saving facts
                </div>
              </div>
              
              <p className="text-blue-200 text-base md:text-lg font-medium">
                Make your voice heard. Save lives through action.
              </p>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-semibold text-lg md:text-xl">Get Your Reminder</h4>
                {showAdminControls && (
                  <TrackedButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTestSettings(!showTestSettings)}
                    className="text-gray-400 hover:text-white p-1"
                    trackingName="admin_test_settings_toggle"
                    trackingCategory="admin_controls"
                    trackingPage="home_cta"
                  >
                    <Settings className="w-4 h-4" />
                  </TrackedButton>
                )}
              </div>
              <p className="text-gray-300 text-base">
                We'll remind you to take action on National Fentanyl Prevention & Awareness Day
              </p>
            </div>

            {/* Test Mode Settings */}
            {showTestSettings && (
              <div className="mb-6 p-4 bg-white/10 rounded-lg border border-white/20">
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
            
            <form onSubmit={handleEmailSubmit} className="space-y-4 mt-auto">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 text-base"
                required
              />
              <TrackedButton
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base"
                trackingName="cta_email_signup"
                trackingCategory="email_signup"
                trackingPage="home_cta"
                trackingData={{ testMode, testDateOffset }}
              >
                {isSubmitting ? "Signing up..." : "Remind Me to Act"}
              </TrackedButton>
              <p className="text-xs text-gray-400 text-center">
                By signing up, you agree to our{" "}
                <a 
                  href="/privacy-policy" 
                  className="text-blue-300 hover:text-blue-200 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </p>
            </form>
          </Card>

          {/* Enhanced Pre-Event Sharing CTA Card */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8 md:p-10 lg:p-12 flex flex-col">
            <div className="text-center mb-10">
              <Users className="w-14 h-14 text-blue-400 mx-auto mb-6" />
              <h3 className="text-3xl md:text-4xl font-semibold text-white mb-4">
                Spread the Word About the Upcoming Event
              </h3>
              <p className="text-lg md:text-xl text-gray-300">
                Help build momentum by inviting your friends and network to join the movement
              </p>
            </div>

            <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-6 md:p-8 mb-8 flex-grow">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold text-lg md:text-xl">Share This Message:</h4>
                <TrackedButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMessageExpanded(!isMessageExpanded)}
                  className="text-blue-300 hover:text-white p-1"
                  trackingName="expand_share_message"
                  trackingCategory="ui_interaction"
                  trackingPage="home_cta"
                >
                  {isMessageExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </TrackedButton>
              </div>
              
              <p className="text-blue-100 text-sm md:text-base leading-relaxed mb-6">
                {isMessageExpanded ? facebookText : condensedMessage}
              </p>
              
              {!isMessageExpanded && (
                <TrackedButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMessageExpanded(true)}
                  className="text-blue-300 hover:text-white text-sm p-0"
                  trackingName="show_full_message"
                  trackingCategory="ui_interaction"
                  trackingPage="home_cta"
                >
                  Show full message...
                </TrackedButton>
              )}
              
              <p className="text-blue-200 text-base md:text-lg font-medium">
                Build awareness now. Every invitation helps grow the movement before August 21st.
              </p>
            </div>

            <div className="mb-4">
              <h4 className="text-white font-semibold mb-3 text-lg md:text-xl">Share with Your Network</h4>
              <p className="text-gray-300 text-base">
                Every post helps create momentum
              </p>
            </div>

            <div className="space-y-4 mt-auto">
              <TrackedButton
                onClick={navigator.share ? handleNativeShare : handleCopyLink}
                variant="outline"
                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center gap-2 py-3 text-base"
                trackingName="copy_message_cta"
                trackingCategory="social_share"
                trackingPage="home_cta"
                trackingData={{ hasNativeShare: !!navigator.share }}
              >
                {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? "Copied!" : "Copy Message"}
              </TrackedButton>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TrackedButton
                  onClick={handleTwitterShare}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base"
                  trackingName="share_twitter_cta"
                  trackingCategory="social_share"
                  trackingPage="home_cta"
                >
                  Share on X
                </TrackedButton>
                <EnhancedFacebookShare
                  url={shareUrl}
                  message={facebookText}
                  onFallbackCopy={() => setCopied(true)}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
