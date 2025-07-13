
import { TrackedButton } from "@/components/TrackedButton";
import { Card } from "@/components/ui/card";
import { MessageCircle, Copy } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ShareSection = () => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareUrl = "https://facingfentanylnow.aware-share.com/day-of-experience";
  
  const textMessage = `Hey! I found this tool to create Fentanyl Awareness posts. Check it out: ${shareUrl}`;

  const handleTextToFriend = () => {
    // Try SMS link first
    const smsUrl = `sms:?body=${encodeURIComponent(textMessage)}`;
    
    // Attempt to open SMS app
    const link = document.createElement('a');
    link.href = smsUrl;
    link.click();
    
    // Fallback: show toast with copy option after a brief delay
    setTimeout(() => {
      toast({
        title: "Message ready to send!",
        description: "If SMS didn't open, the message is copied to your clipboard to paste in any messaging app.",
      });
    }, 1000);
    
    // Also copy to clipboard as fallback
    handleCopyMessage();
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(textMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <section className="py-16">
      <Card className="max-w-4xl mx-auto bg-white/5 backdrop-blur-sm border-white/10 p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold text-white mb-2">
            Help Others Create Posts Too
          </h3>
          <p className="text-gray-300">
            Share this tool with a friend so they can create their own awareness post
          </p>
        </div>

        <div className="text-center">
          <TrackedButton
            onClick={handleTextToFriend}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg font-semibold flex items-center justify-center gap-3 mx-auto"
            trackingName="text_to_friend"
            trackingCategory="social_share"
            trackingPage="day_of_experience"
          >
            <MessageCircle className="w-5 h-5" />
            Text to a Friend
          </TrackedButton>
        </div>
      </Card>
    </section>
  );
};

export default ShareSection;
