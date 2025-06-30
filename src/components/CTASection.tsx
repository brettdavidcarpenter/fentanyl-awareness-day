import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Plus, Share2, Copy, CheckCircle, Target, Users, Bell, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const CTASection = () => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [showTestSettings, setShowTestSettings] = useState(false);
  const [testDateOffset, setTestDateOffset] = useState(1);
  const [isMessageExpanded, setIsMessageExpanded] = useState(false);
  const { toast } = useToast();

  // Calendar functionality
  const eventDetails = {
    title: "National Fentanyl Prevention and Awareness Day – Take Action",
    description: "Share your story • Honor a loved one • Spread life-saving facts. Visit facingfentanylnow.org/post",
    date: "20250821",
    time: "1200", // 12:00 PM
  };

  // Email signup functionality
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

  // Share functionality with updated templates and URL
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

  // Condensed message for collapsed state
  const condensedMessage = `💔 I'm joining the movement for National Fentanyl Prevention and Awareness Day.

August 21 is our day to make our voices heard and save lives through action...`;

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleFacebookShare = async () => {
    try {
      // First, copy the Facebook text to clipboard
      await navigator.clipboard.writeText(facebookText);
      
      // Show success toast with instructions
      toast({
        title: "Message copied to clipboard!",
        description: "Opening Facebook - paste the copied message in your post.",
        duration: 5000,
      });
      
      // Then open Facebook sharer with just the URL
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
      window.open(facebookUrl, '_blank');
      
    } catch (err) {
      // Fallback if clipboard fails
      toast({
        title: "Facebook sharing",
        description: "Opening Facebook - please copy and paste the message from the preview below.",
        variant: "destructive",
        duration: 5000,
      });
      
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
      window.open(facebookUrl, '_blank');
    }
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
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Enhanced Email Reminder CTA Card */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8 flex flex-col">
            <div className="text-center mb-8">
              <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">
                Plan to Take Action
              </h3>
              <p className="text-gray-300">
                Mark your calendar for National Fentanyl Prevention & Awareness Day
              </p>
            </div>

            <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-6 mb-6 flex-grow">
              <h4 className="text-white font-semibold mb-3">{eventDetails.title}</h4>
              <p className="text-blue-200 text-sm mb-3">📅 August 21, 2025</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <span className="text-blue-300">•</span> Share your story or tribute
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <span className="text-blue-300">•</span> Honor someone you've lost
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <span className="text-blue-300">•</span> Spread life-saving facts
                </div>
              </div>
              
              <p className="text-blue-200 text-sm font-medium">
                Make your voice heard. Save lives through action.
              </p>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-semibold">Get Your Reminder</h4>
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
            
            <form onSubmit={handleEmailSubmit} className="space-y-3 mt-auto">
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
          </Card>

          {/* Enhanced Pre-Event Sharing CTA Card - Restructured Layout */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8 flex flex-col">
            <div className="text-center mb-8">
              <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">
                Spread the Word About the Upcoming Event
              </h3>
              <p className="text-gray-300">
                Help build momentum by inviting your friends and network to join the movement
              </p>
            </div>

            <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-6 mb-6 flex-grow">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-semibold">Share This Message:</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMessageExpanded(!isMessageExpanded)}
                  className="text-blue-300 hover:text-white p-1"
                >
                  {isMessageExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </div>
              
              <p className="text-blue-100 text-sm leading-relaxed mb-4">
                {isMessageExpanded ? facebookText : condensedMessage}
              </p>
              
              {!isMessageExpanded && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMessageExpanded(true)}
                  className="text-blue-300 hover:text-white text-xs p-0"
                >
                  Show full message...
                </Button>
              )}
              
              <p className="text-blue-200 text-sm font-medium">
                Build awareness now. Every invitation helps grow the movement before August 21st.
              </p>
            </div>

            <div className="mb-3">
              <h4 className="text-white font-semibold mb-2">Share with Your Network</h4>
              <p className="text-gray-300 text-sm">
                Every post helps create momentum
              </p>
            </div>

            <div className="space-y-3 mt-auto">
              <Button
                onClick={navigator.share ? handleNativeShare : handleCopyLink}
                variant="outline"
                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center gap-2"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Message"}
              </Button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={handleTwitterShare}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Share on X
                </Button>
                <Button
                  onClick={handleFacebookShare}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Copy & Post to FB
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
