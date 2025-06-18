
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ShareSection = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareUrl = window.location.href;
  const shareText = "Join me in spreading awareness about fentanyl. Together, we can save lives. 💙";

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share this link with others to help spread awareness.",
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
          title: "Facing Fentanyl - Spread Awareness. Save Lives.",
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed
        console.log("Share cancelled");
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <section className="py-16">
      <Card className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm border-white/10 p-8">
        <div className="text-center mb-8">
          <Share2 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-white mb-2">
            Invite Others to Join
          </h3>
          <p className="text-gray-300">
            It only takes a minute – every voice matters in this fight.
          </p>
        </div>

        <div className="bg-orange-900/30 border border-orange-500/30 rounded-xl p-6 mb-6">
          <p className="text-white font-medium text-center">
            "{shareText}"
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
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
            Share on Facebook
          </Button>
          <Button
            onClick={navigator.share ? handleNativeShare : handleCopyLink}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center gap-2"
          >
            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {navigator.share ? "Share Link" : (copied ? "Copied!" : "Copy Link")}
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Help us reach more people. Share this page with your network.
          </p>
        </div>
      </Card>
    </section>
  );
};

export default ShareSection;
