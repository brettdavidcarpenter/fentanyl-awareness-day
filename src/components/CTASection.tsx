
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

  // Calendar functionality
  const eventDetails = {
    title: "National Fentanyl Prevention and Awareness Day – Take Action",
    description: "Share your story • Honor a loved one • Spread life-saving facts. Visit facingfentanylnow.org/post",
    date: "20250821",
    time: "1200", // 12:00 PM
  };

  // Secondary email signup functionality
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
    <section className="py-6">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Compact horizontal action strips */}
        <div className="space-y-3">
          
          {/* Add to Calendar Strip */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-400" />
                <div>
                  <h3 className="text-base font-semibold text-white">Add to Your Calendar</h3>
                  <p className="text-gray-300 text-sm">Never miss the action day - August 21, 2025</p>
                </div>
              </div>
              <div className="flex gap-2">
                <TrackedButton
                  onClick={() => {
                    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.date}T${eventDetails.time}00Z/${eventDetails.date}T${eventDetails.time}00Z&details=${encodeURIComponent(eventDetails.description)}`;
                    window.open(googleUrl, '_blank');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  trackingName="add_google_calendar"
                  trackingCategory="calendar"
                  trackingPage="home_cta"
                >
                  Google Calendar
                </TrackedButton>
                <TrackedButton
                  onClick={() => {
                    const appleUrl = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${shareUrl}
DTSTART:${eventDetails.date}T${eventDetails.time}00Z
SUMMARY:${eventDetails.title}
DESCRIPTION:${eventDetails.description}
END:VEVENT
END:VCALENDAR`;
                    const element = document.createElement('a');
                    element.setAttribute('href', appleUrl);
                    element.setAttribute('download', 'fentanyl-awareness-day.ics');
                    element.click();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  trackingName="add_apple_calendar"
                  trackingCategory="calendar"
                  trackingPage="home_cta"
                >
                  Apple Calendar
                </TrackedButton>
              </div>
            </div>
          </Card>

          {/* Share the Word Strip with Message Preview */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-400" />
                <div>
                  <h3 className="text-base font-semibold text-white">Spread the Word Now</h3>
                  <p className="text-gray-300 text-sm">Help build momentum by inviting your network</p>
                </div>
              </div>
              <div className="flex gap-2">
                <TrackedButton
                  onClick={handleNativeShare}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  trackingName="copy_message_cta"
                  trackingCategory="social_share"
                  trackingPage="home_cta"
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Message"}
                </TrackedButton>
                <TrackedButton
                  onClick={handleTwitterShare}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
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
            
            {/* Message Preview Section */}
            <div className="mt-3 border-t border-white/10 pt-3">
              <TrackedButton
                onClick={() => setIsMessageExpanded(!isMessageExpanded)}
                variant="ghost"
                className="w-full text-left p-2 hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
                trackingName="message_preview_toggle"
                trackingCategory="social_share"
                trackingPage="home_cta"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">Preview message</span>
                  {isMessageExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </TrackedButton>
              
              {isMessageExpanded ? (
                <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10">
                  <pre className="text-sm text-gray-200 whitespace-pre-wrap font-sans leading-relaxed">
                    {facebookText}
                  </pre>
                </div>
              ) : (
                <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-sm text-gray-300 italic">
                    {condensedMessage}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Secondary Email Signup Strip */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-blue-400" />
                <div>
                  <h3 className="text-base font-semibold text-white">Backup Reminder</h3>
                  <p className="text-gray-300 text-sm">Add another email for extra security</p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
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
                <form onSubmit={handleEmailSubmit} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Another email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 w-64"
                    required
                  />
                  <TrackedButton
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    trackingName="cta_secondary_email_signup"
                    trackingCategory="email_signup"
                    trackingPage="home_cta"
                    trackingData={{ testMode, testDateOffset }}
                  >
                    {isSubmitting ? "Adding..." : "Add Reminder"}
                  </TrackedButton>
                </form>
              </div>
            </div>
            
            {/* Test Mode Settings */}
            {showTestSettings && (
              <div className="mt-3 p-3 bg-white/10 rounded-lg border border-white/20">
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
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
