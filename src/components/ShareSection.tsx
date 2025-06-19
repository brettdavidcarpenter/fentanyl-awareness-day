
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ShareSection = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareUrl = window.location.href;
  const imageUrl = `${window.location.origin}/lovable-uploads/02c9439c-bc1e-4d30-83a5-8ed0e49fab85.png`;
  
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
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(imageUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(facebookText)}`;
    window.open(facebookUrl, '_blank');
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
      <Card className="max-w-4xl mx-auto bg-white/5 backdrop-blur-sm border-white/10 p-8">
        <div className="text-center mb-8">
          <Share2 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-white mb-2">
            Share the Movement
          </h3>
          <p className="text-gray-300">
            Help us reach more people with this powerful message
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Image Preview */}
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/02c9439c-bc1e-4d30-83a5-8ed0e49fab85.png" 
              alt="Times Square Fentanyl Awareness Display" 
              className="rounded-lg shadow-lg max-w-full h-auto"
            />
          </div>

          {/* Message Preview */}
          <div className="bg-orange-900/30 border border-orange-500/30 rounded-xl p-6">
            <h4 className="text-white font-semibold mb-3">Facebook Message Preview:</h4>
            <p className="text-gray-200 text-sm whitespace-pre-line leading-relaxed">
              💔 I'm joining the movement to raise awareness about fentanyl and honor those we've lost.
              
              August 21 is National Fentanyl Awareness Day — let's flood social media with stories, tributes, and life-saving facts.
              
              👉 Sign up for a reminder to post
              
              #FacingFentanyl #FentanylAwarenessDay
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Button
            onClick={handleTwitterShare}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Share on X/Twitter
          </Button>
          <Button
            onClick={handleFacebookShare}
            className="bg-blue-700 hover:bg-blue-800 text-white"
          >
            Share on Facebook
          </Button>
          <Button
            onClick={navigator.share ? handleNativeShare : handleCopyLink}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center gap-2"
          >
            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {navigator.share ? "Share Message" : (copied ? "Copied!" : "Copy Message")}
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Together we can save lives. Every share brings us closer to ending the fentanyl crisis.
          </p>
        </div>
      </Card>
    </section>
  );
};

export default ShareSection;
