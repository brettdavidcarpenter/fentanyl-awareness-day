import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Plus, Share2, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const CTASection = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Calendar functionality
  const eventDetails = {
    title: "Fentanyl Awareness Day – Post & Share",
    description: "Create your tribute or awareness post at facingfentanylnow.org/post",
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
    link.download = 'fentanyl-awareness-day.ics';
    link.click();
  };

  // Share functionality with updated templates and URL
  const shareUrl = "https://facingfentanylnow.aware-share.com/";
  const imageUrl = "/lovable-uploads/1a0ca659-f08d-4edc-b523-0f49ea25567a.png";
  
  const facebookText = `💔 I'm joining the movement to raise awareness about fentanyl and honor those we've lost.

August 21 is National Fentanyl Awareness Day — let's flood social media with stories, tributes, and life-saving facts.

We're planning a nationwide social media takeover — and you can be part of it.

👉 Sign up for a reminder to post:
🔗 ${shareUrl}

#FacingFentanyl #FentanylAwarenessDay #DrugAwareness #EndOverdose #OnePillCanKill`;

  const twitterText = `💔 Join the movement to honor lives lost and raise awareness.

We're planning a social media takeover on Aug 21 for #FentanylAwarenessDay. Let's flood every feed with truth and remembrance.

👉 Sign up for a reminder: ${shareUrl}
#FacingFentanyl #EndOverdose #OnePillCanKill`;

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
        title: "Text copied to clipboard!",
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

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Facing Fentanyl - National Fentanyl Awareness Day",
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
          {/* Calendar CTA Card */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8 h-full">
            <div className="text-center mb-8">
              <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">
                Add to Calendar
              </h3>
              <p className="text-gray-300">
                Set a reminder for National Fentanyl Awareness Day
              </p>
            </div>

            <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-6 mb-6">
              <h4 className="text-white font-semibold mb-2">{eventDetails.title}</h4>
              <p className="text-blue-200 text-sm mb-1">📅 August 21, 2025</p>
              <p className="text-gray-300 text-sm">{eventDetails.description}</p>
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

          {/* Enhanced Share CTA Card */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8 h-full">
            <div className="text-center mb-8">
              <Share2 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">
                Invite Others to Join
              </h3>
              <p className="text-gray-300">
                It only takes a minute – every voice matters in this fight.
              </p>
            </div>

            <div className="mb-6">
              {/* Message Preview - now full width and blue themed */}
              <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-3">Facebook Preview:</h4>
                <p className="text-blue-100 text-sm leading-relaxed mb-3">
                  💔 I'm joining the movement to raise awareness about fentanyl and honor those we've lost.
                  <br /><br />
                  August 21 is National Fentanyl Awareness Day — let's flood social media with stories, tributes, and life-saving facts.
                  <br /><br />
                  We're planning a nationwide social media takeover — and you can be part of it.
                  <br /><br />
                  👉 Sign up for a reminder to post:
                  <br />
                  🔗 {shareUrl}
                  <br /><br />
                  #FacingFentanyl #FentanylAwarenessDay #DrugAwareness #EndOverdose #OnePillCanKill
                </p>
                <p className="text-blue-200 text-sm mt-3 font-medium">
                  📋 Text will be copied automatically when you share!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
                Copy & Paste to FB
              </Button>
              <Button
                onClick={navigator.share ? handleNativeShare : handleCopyLink}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center gap-2"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {navigator.share ? "Share Link" : (copied ? "Copied!" : "Copy Message")}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Together we can save lives. Every share brings us closer to ending the fentanyl crisis.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
