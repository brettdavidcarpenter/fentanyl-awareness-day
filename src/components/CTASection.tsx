import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Plus, Share2, Copy, CheckCircle, Target, Users } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const CTASection = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Calendar functionality
  const eventDetails = {
    title: "National Fentanyl Prevention and Awareness Day – Take Action",
    description: "Share your story • Honor a loved one • Spread life-saving facts. Visit facingfentanylnow.org/post",
    date: "20250821",
    time: "1200", // 12:00 PM
  };

  const generateGoogleCalendarUrl = () => {
    const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE";
    const params = new URLSearchParams({
      text: eventDetails.title,
      dates: `${eventDetails.date}T${eventDetails.time}00Z/${eventDetails.date}T${eventDetails.time}00Z`,
      details: eventDetails.description,
      sf: "true",
      output: "xml"
    });
    return `${baseUrl}&${params.toString()}`;
  };

  const generateAppleCalendarUrl = () => {
    const startDate = "2025-08-21T12:00:00";
    const endDate = "2025-08-21T13:00:00";
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Facing Fentanyl//EN
BEGIN:VEVENT
DTSTART:${startDate.replace(/[-:]/g, '').replace('T', 'T')}Z
DTEND:${endDate.replace(/[-:]/g, '').replace('T', 'T')}Z
SUMMARY:${eventDetails.title}
DESCRIPTION:${eventDetails.description}
END:VEVENT
END:VCALENDAR`;
    
    return `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
  };

  const handleGoogleCalendar = () => {
    window.open(generateGoogleCalendarUrl(), '_blank');
  };

  const handleAppleCalendar = () => {
    const link = document.createElement('a');
    link.href = generateAppleCalendarUrl();
    link.download = 'fentanyl-prevention-awareness-day.ics';
    link.click();
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

👉 Sign up for a reminder: ${shareUrl}

#FacingFentanyl #FentanylPreventionDay #FentanylAwarenessDay #SaveLives`;

  const twitterText = `💔 August 21: National Fentanyl Prevention & Awareness Day

Join thousands taking action to save lives:
• Share your story
• Honor loved ones lost  
• Spread prevention facts
• Make your voice heard

Sign up for a reminder: ${shareUrl}

#FacingFentanyl #FentanylPreventionDay`;

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
          {/* Enhanced Calendar CTA Card */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8 h-full">
            <div className="text-center mb-8">
              <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">
                Plan to Take Action
              </h3>
              <p className="text-gray-300">
                Mark your calendar for National Fentanyl Prevention & Awareness Day
              </p>
            </div>

            <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-6 mb-6">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={handleGoogleCalendar}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Google Calendar
              </Button>
              <Button
                onClick={handleAppleCalendar}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Apple Calendar
              </Button>
            </div>
          </Card>

          {/* Enhanced Action CTA Card */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8 h-full">
            <div className="text-center mb-8">
              <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">
                Take Action Together
              </h3>
              <p className="text-gray-300">
                Join thousands nationwide making their voices heard to save lives
              </p>
            </div>

            <div className="mb-6">
              {/* Action Message Preview */}
              <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-3">Share This Message:</h4>
                <p className="text-blue-100 text-sm leading-relaxed mb-4">
                  💔 I'm joining the movement for National Fentanyl Prevention and Awareness Day.
                  <br /><br />
                  August 21 is our day to make our voices heard and save lives through action.
                  <br /><br />
                  Here's how YOU can participate:
                  <br />• Share your story or tribute
                  <br />• Post life-saving prevention facts  
                  <br />• Honor someone you've lost
                  <br />• Spread the word to save others
                  <br /><br />
                  Join thousands taking action nationwide. Together we can end this crisis.
                  <br /><br />
                  👉 Sign up for a reminder: {shareUrl}
                  <br /><br />
                  #FacingFentanyl #FentanylPreventionDay #FentanylAwarenessDay #SaveLives
                </p>
                <p className="text-blue-200 text-sm mt-3 font-medium">
                  📋 Message will be copied automatically when you share!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Button
                onClick={handleTwitterShare}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Share on X
              </Button>
              <Button
                onClick={handleFacebookShare}
                className="bg-blue-700 hover:bg-blue-800 text-white"
              >
                Copy & Post to FB
              </Button>
              <Button
                onClick={navigator.share ? handleNativeShare : handleCopyLink}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center gap-2 sm:col-span-2"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {navigator.share ? "Share Message" : (copied ? "Copied!" : "Copy Message")}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Every action matters. Every voice counts. Together we can save lives and end this crisis.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
