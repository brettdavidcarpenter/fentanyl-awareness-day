import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Copy } from "lucide-react";
import PostCanvas from "@/components/PostCanvas";
import ShareSection from "@/components/ShareSection";
import { getTemplatesByPersona } from "@/data/postTemplates";
import { useToast } from "@/hooks/use-toast";
import html2canvas from 'html2canvas';

const PostResultStep = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState(() => {
    const persona = searchParams.get("persona");
    const templateId = searchParams.get("templateId");
    const customText = searchParams.get("customText");
    const personalizationName = searchParams.get("personalizationName");
    const personalizationRelationship = searchParams.get("personalizationRelationship");
    const hasImage = searchParams.get("hasImage") === 'true';
    
    if (!persona) return {};
    
    const templates = getTemplatesByPersona(persona);
    const template = templates.find(t => t.id === templateId) || templates[0];
    
    const uploadedImage = hasImage ? sessionStorage.getItem('postImage') : undefined;
    
    return {
      persona,
      template,
      customText: customText || '',
      personalization: { 
        name: personalizationName || '', 
        relationship: personalizationRelationship || '' 
      },
      uploadedImage
    };
  });

  useEffect(() => {
    if (!formData.persona) {
      navigate('/day-of-experience');
    }
  }, [formData.persona, navigate]);

  const getCurrentMessage = () => {
    if (formData.customText) return formData.customText;
    if (formData.template?.message) {
      let message = formData.template.message;
      if (formData.personalization?.name) {
        message = message.replace(/\[NAME\]/g, formData.personalization.name);
      }
      if (formData.personalization?.relationship) {
        message = message.replace(/\[RELATIONSHIP\]/g, formData.personalization.relationship);
      }
      return message;
    }
    return '';
  };

  const getCurrentImage = () => {
    return formData.uploadedImage || formData.template?.imagePath;
  };

  const handleCopyToClipboard = async () => {
    try {
      const element = document.getElementById('post-canvas');
      if (!element) throw new Error('Canvas element not found');
      
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
        useCORS: true
      });
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            toast({
              title: "Copied to clipboard!",
              description: "Your image has been copied and can be pasted anywhere.",
            });
          } catch (error) {
            console.error('Error copying to clipboard:', error);
            toast({
              title: "Copy failed",
              description: "Unable to copy image. Try downloading instead.",
              variant: "destructive",
            });
          }
        }
      }, 'image/png', 0.95);
    } catch (error) {
      console.error('Error creating image:', error);
      toast({
        title: "Copy failed",
        description: "Unable to create image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadImage = async () => {
    try {
      const element = document.getElementById('post-canvas');
      if (!element) throw new Error('Canvas element not found');
      
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
        useCORS: true
      });
      
      const link = document.createElement('a');
      link.download = 'fentanyl-awareness-post.png';
      link.href = canvas.toDataURL('image/png', 0.95);
      link.click();
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  if (!formData.persona) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/day-of-experience/create?" + new URLSearchParams({
              persona: formData.persona
            }).toString())}
            className="p-2 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Your Post is Ready!</h1>
            <p className="text-sm text-blue-200">Step 3 of 3: Share your message</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-md mx-auto space-y-6">
          {/* Preview */}
          <div className="bg-white/10 border border-white/20 rounded-lg p-4">
            <PostCanvas
              template={formData.template}
              personalization={formData.personalization}
              customText={formData.customText}
              customImage={formData.uploadedImage}
              postType={formData.uploadedImage ? 'upload' : 'quick'}
            />
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Button 
              onClick={handleCopyToClipboard}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 border-0"
              size="lg"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy to Clipboard
            </Button>
            
            <Button 
              onClick={handleDownloadImage}
              className="w-full bg-white text-slate-900 hover:bg-white/90"
              size="lg"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Image
            </Button>
            
            <ShareSection />
          </div>

          {/* Hashtag Callout */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center space-y-2">
            <h3 className="text-sm font-semibold text-white">Help Us By Using the Following Hashtags</h3>
            <p className="text-xs text-blue-200">
              Create your own awareness post at{" "}
              <a 
                href="https://facingfentanylnow.aware-share.com/day-of-experience" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white underline hover:text-blue-100"
              >
                https://facingfentanylnow.aware-share.com/day-of-experience
              </a>
            </p>
            <p className="text-sm text-white font-medium">
              #FacingFentanyl #FentanylAwareness #NationalFentanylPreventionDay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostResultStep;