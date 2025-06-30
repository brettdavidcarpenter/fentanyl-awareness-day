
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnhancedFacebookShareProps {
  url: string;
  message: string;
  onFallbackCopy?: () => void;
}

const EnhancedFacebookShare = ({ url, message, onFallbackCopy }: EnhancedFacebookShareProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleFacebookShare = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      
      toast({
        title: "Message copied to clipboard!",
        description: "Opening Facebook - paste the copied message in your post.",
        duration: 5000,
      });
      
      setTimeout(() => setCopied(false), 3000);
      
      // Open Facebook sharer
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(facebookUrl, '_blank');
      
      if (onFallbackCopy) {
        onFallbackCopy();
      }
    } catch (err) {
      toast({
        title: "Facebook sharing",
        description: "Opening Facebook - please copy and paste the message manually.",
        variant: "destructive",
        duration: 5000,
      });
      
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(facebookUrl, '_blank');
    }
  };

  return (
    <Button
      onClick={handleFacebookShare}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2"
    >
      {copied ? (
        <CheckCircle className="w-4 h-4" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
      {copied ? "Copied!" : "Share on FB"}
    </Button>
  );
};

export default EnhancedFacebookShare;
