
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnhancedFacebookShareProps {
  url: string;
  message: string;
  onFallbackCopy?: () => void;
}

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

const EnhancedFacebookShare = ({ url, message, onFallbackCopy }: EnhancedFacebookShareProps) => {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if we're on mobile or if SDK is already loaded
    if (window.FB) {
      setIsSDKLoaded(true);
      return;
    }

    // Initialize Facebook SDK
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: '1234567890123456', // Placeholder - user will need to replace with real App ID
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
      setIsSDKLoaded(true);
    };

    // Load Facebook SDK script
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleFacebookSDKShare = () => {
    if (!window.FB) {
      handleFallbackShare();
      return;
    }

    setIsSharing(true);
    
    window.FB.ui({
      method: 'share',
      href: url,
      quote: message,
    }, (response: any) => {
      setIsSharing(false);
      if (response && !response.error_message) {
        toast({
          title: "Success!",
          description: "Your post has been shared to Facebook!",
        });
      } else if (response?.error_message) {
        console.log('Facebook share error:', response.error_message);
        handleFallbackShare();
      }
    });
  };

  const handleFallbackShare = async () => {
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

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // On mobile or if SDK fails to load, use fallback method
  const shouldUseFallback = isMobile || !isSDKLoaded;

  const handleShare = () => {
    if (shouldUseFallback) {
      handleFallbackShare();
    } else {
      handleFacebookSDKShare();
    }
  };

  return (
    <Button
      onClick={handleShare}
      disabled={isSharing}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2"
    >
      {copied ? (
        <CheckCircle className="w-4 h-4" />
      ) : shouldUseFallback ? (
        <Copy className="w-4 h-4" />
      ) : (
        <Facebook className="w-4 h-4" />
      )}
      {isSharing 
        ? "Sharing..." 
        : copied 
          ? "Copied!" 
          : shouldUseFallback 
            ? "Copy & Post to FB" 
            : "Share to Facebook"
      }
    </Button>
  );
};

export default EnhancedFacebookShare;
