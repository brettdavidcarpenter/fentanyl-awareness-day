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
    console.log('🔍 PostResultStep - Initializing with search params');
    console.log('🔗 All search params:', Object.fromEntries(searchParams));
    
    const persona = searchParams.get("persona");
    const templateId = searchParams.get("templateId");
    const customText = searchParams.get("customText");
    const personalizationName = searchParams.get("personalizationName");
    const personalizationRelationship = searchParams.get("personalizationRelationship");
    const hasImage = searchParams.get("hasImage") === 'true';
    
    console.log('📝 Parsed params:', {
      persona,
      templateId,
      customText,
      personalizationName,
      personalizationRelationship,
      hasImage
    });
    
    if (!persona) {
      console.error('❌ No persona found in URL params');
      return {};
    }
    
    if (!templateId) {
      console.error('❌ No templateId found in URL params');
      return { persona };
    }
    
    const templates = getTemplatesByPersona(persona);
    console.log('📋 Available templates for persona:', templates.length);
    
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      console.error('❌ Template not found for ID:', templateId);
      console.log('📋 Available template IDs:', templates.map(t => t.id));
      return { persona, template: templates[0] };
    }
    
    console.log('✅ Template found:', template.id);
    
    let uploadedImage;
    if (hasImage) {
      try {
        uploadedImage = sessionStorage.getItem('postImage');
        console.log('📷 Retrieved image from sessionStorage:', uploadedImage ? 'Success' : 'Failed');
      } catch (error) {
        console.error('❌ Failed to retrieve image from sessionStorage:', error);
      }
    }
    
    const decodedCustomText = customText ? decodeURIComponent(customText) : '';
    const decodedPersonalizationName = personalizationName ? decodeURIComponent(personalizationName) : '';
    const decodedPersonalizationRelationship = personalizationRelationship ? decodeURIComponent(personalizationRelationship) : '';
    
    const result = {
      persona,
      template,
      customText: decodedCustomText,
      personalization: { 
        name: decodedPersonalizationName, 
        relationship: decodedPersonalizationRelationship 
      },
      uploadedImage
    };
    
    console.log('✅ Final formData:', result);
    return result;
  });

  useEffect(() => {
    console.log('🔄 PostResultStep useEffect - checking formData.persona:', formData.persona);
    
    if (!formData.persona) {
      console.log('❌ No persona found, redirecting to day-of-experience');
      setTimeout(() => {
        navigate('/day-of-experience');
      }, 100); // Small delay to ensure state is settled
    } else {
      console.log('✅ Persona found, staying on result page');
    }
  }, [formData.persona, navigate]);

  const getCurrentMessage = () => {
    if (!formData.persona || !formData.template) return '';
    
    // Type assertion since we've checked for existence above
    const data = formData as {
      persona: string;
      template: any;
      customText?: string;
      personalization?: { name?: string; relationship?: string };
    };
    
    if (data.customText) return data.customText;
    if (data.template?.message) {
      let message = data.template.message;
      if (data.personalization?.name) {
        message = message.replace(/\[NAME\]/g, data.personalization.name);
      }
      if (data.personalization?.relationship) {
        message = message.replace(/\[RELATIONSHIP\]/g, data.personalization.relationship);
      }
      return message;
    }
    return '';
  };

  const getCurrentImage = () => {
    if (!formData.persona || !formData.template) return '';
    
    // Type assertion since we've checked for existence above
    const data = formData as {
      uploadedImage?: string;
      template: { imagePath?: string };
    };
    
    return data.uploadedImage || data.template?.imagePath;
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

  if (!formData.persona || !formData.template) {
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
              template={(formData as any).template}
              personalization={(formData as any).personalization || { name: '', relationship: '' }}
              customText={(formData as any).customText || ''}
              customImage={(formData as any).uploadedImage}
              postType={(formData as any).uploadedImage ? 'upload' : 'quick'}
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

            {/* Hashtag Callout */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white text-center">Help Us By Using the Following Hashtags</h3>
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-center">
                <p className="text-sm text-white leading-relaxed">
                  "Create your own awareness post at https://facingfentanylnow.aware-share.com/day-of-experience #FacingFentanyl #NationalFentanylPreventionDay"
                </p>
              </div>
            </div>
            
            <ShareSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostResultStep;