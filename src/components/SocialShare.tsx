
import { TrackedButton } from "@/components/TrackedButton";
import { Facebook, Twitter, Instagram, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  imageUrl: string;
  message: string;
  isGenerating?: boolean;
}

const SocialShare = ({ imageUrl, message, isGenerating = false }: SocialShareProps) => {
  const { toast } = useToast();

  const shareText = `${message} #FacingFentanyl #FentanylAwarenessDay`;
  const shareUrl = 'https://facingfentanylnow.org/day-of-experience';

  const downloadImage = () => {
    const link = document.createElement('a');
    link.download = 'fentanyl-awareness-post.png';
    link.href = imageUrl;
    link.click();
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      toast({
        title: "Copied!",
        description: "Post text copied to clipboard"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Fentanyl Awareness Day',
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-center">
        {isGenerating ? "Preparing Your Post..." : "Share Your Post"}
      </h3>
      
      {isGenerating && (
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">Your post will be ready to share in a moment!</p>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <TrackedButton 
          onClick={shareToTwitter} 
          className="flex items-center gap-2"
          disabled={isGenerating || !imageUrl}
          trackingName="post_share_twitter"
          trackingCategory="post_sharing"
          trackingPage="day_of_experience"
          trackingData={{ postType: 'generated', shareMethod: 'twitter' }}
        >
          <Twitter className="w-4 h-4" />
          Twitter/X
        </TrackedButton>
        
        <TrackedButton 
          onClick={shareToFacebook} 
          className="flex items-center gap-2"
          disabled={isGenerating || !imageUrl}
          trackingName="post_share_facebook"
          trackingCategory="post_sharing"
          trackingPage="day_of_experience"
          trackingData={{ postType: 'generated', shareMethod: 'facebook' }}
        >
          <Facebook className="w-4 h-4" />
          Facebook
        </TrackedButton>
        
        <TrackedButton 
          onClick={downloadImage} 
          variant="outline" 
          className="flex items-center gap-2"
          disabled={isGenerating || !imageUrl}
          trackingName="post_download_image"
          trackingCategory="post_sharing"
          trackingPage="day_of_experience"
          trackingData={{ postType: 'generated', shareMethod: 'download' }}
        >
          <Download className="w-4 h-4" />
          Download
        </TrackedButton>
        
        <TrackedButton 
          onClick={shareNative} 
          variant="outline" 
          className="flex items-center gap-2"
          disabled={isGenerating}
          trackingName="post_native_share"
          trackingCategory="post_sharing"
          trackingPage="day_of_experience"
          trackingData={{ postType: 'generated', shareMethod: 'native' }}
        >
          <Share2 className="w-4 h-4" />
          Share
        </TrackedButton>
      </div>
      
      <div className="text-xs text-gray-500 text-center space-y-1">
        <p><strong>Instagram:</strong> Save image and post manually</p>
        <p><strong>WhatsApp:</strong> Download and share the image directly</p>
        {imageUrl && <p className="text-green-600">✓ Your post is ready to share!</p>}
      </div>
    </div>
  );
};

export default SocialShare;
