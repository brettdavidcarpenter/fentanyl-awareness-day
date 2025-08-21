import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Copy, Smartphone } from "lucide-react";
import PostCanvas from "@/components/PostCanvas";
import ShareSection from "@/components/ShareSection";
import { getTemplatesByPersona } from "@/data/postTemplates";
import { useToast } from "@/hooks/use-toast";
import { useNativeCapabilities } from "@/hooks/useNativeCapabilities";
import html2canvas from 'html2canvas';

const PostResultStep = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { capabilities, saveImageToPhotos, copyImageToClipboard, fallbackCopyText } = useNativeCapabilities();
  const [isProcessing, setIsProcessing] = useState(false);
  
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
        const retrievedImage = sessionStorage.getItem('postImage');
        console.log('📷 Retrieved image from sessionStorage:', typeof retrievedImage, retrievedImage ? retrievedImage.substring(0, 50) + '...' : 'null');
        
        // Validate retrieved image data
        if (retrievedImage && typeof retrievedImage === 'string' && retrievedImage.startsWith('data:image/')) {
          uploadedImage = retrievedImage;
          console.log('✅ Valid image data retrieved');
        } else {
          console.log('❌ Invalid image data retrieved, ignoring:', typeof retrievedImage, retrievedImage);
          uploadedImage = null;
        }
      } catch (error) {
        console.error('❌ Failed to retrieve image from sessionStorage:', error);
        uploadedImage = null;
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
    setIsProcessing(true);
    try {
      // Use the post-canvas element for html2canvas
      const element = document.querySelector('#post-canvas') as HTMLElement;
      if (!element) throw new Error('Post canvas element not found');
      
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 3,
        useCORS: true,
        allowTaint: false,
        foreignObjectRendering: false,
        imageTimeout: 15000
      });
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          // Try multiple strategies for mobile copy
          let copySuccess = false;
          
          // Strategy 1: Try native clipboard
          if (capabilities.supportsClipboard) {
            copySuccess = await copyImageToClipboard(blob);
          }
          
          // Strategy 2: Try Web Share API for mobile
          if (!copySuccess && capabilities.isMobile && navigator.share) {
            try {
              const file = new File([blob], 'awareness-post.png', { type: 'image/png' });
              await navigator.share({
                files: [file],
                title: 'Fentanyl Awareness Post',
                text: 'Creating awareness to prevent fentanyl deaths. #FacingFentanyl'
              });
              copySuccess = true;
              toast({
                title: "Shared successfully!",
                description: "Your awareness post has been shared.",
              });
            } catch (error) {
              console.log('Web Share API failed:', error);
            }
          }
          
          if (copySuccess && !navigator.share) {
            toast({
              title: "Copied to clipboard!",
              description: "Your image has been copied and can be pasted anywhere.",
            });
          } else if (!copySuccess) {
            // Strategy 3: Fallback to text copy with better instructions
            const fallbackText = `Create your own awareness post at https://facingfentanylnow.aware-share.com/day-of-experience #FacingFentanyl #NationalFentanylPreventionDay`;
            const textSuccess = await fallbackCopyText(fallbackText);
            
            if (textSuccess) {
              toast({
                title: "Message copied to clipboard",
                description: capabilities.isMobile 
                  ? "Use the 'Save to Photos' button below to save the image, then paste your message in social media."
                  : "Use the 'Download Image' button below to save it, then paste your message in social media.",
                duration: 8000,
              });
            } else {
              toast({
                title: "Copy not supported",
                description: capabilities.isMobile 
                  ? "Use the 'Save to Photos' button below to save the image."
                  : "Use the 'Download Image' button below to save it.",
                variant: "destructive",
                duration: 8000,
              });
            }
          }
        }
        setIsProcessing(false);
      }, 'image/png');
    } catch (error) {
      console.error('Error creating image:', error);
      setIsProcessing(false);
      toast({
        title: "Copy failed",
        description: "Unable to create image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadImage = async () => {
    setIsProcessing(true);
    try {
      // Use the post-canvas element for html2canvas
      const element = document.querySelector('#post-canvas') as HTMLElement;
      if (!element) throw new Error('Post canvas element not found');
      
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 3,
        useCORS: true,
        allowTaint: false,
        foreignObjectRendering: false,
        imageTimeout: 15000
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      
      // Try native photo library save first (mobile only)
      if (capabilities.canSaveToPhotos) {
        const photoSuccess = await saveImageToPhotos(dataUrl);
        
        if (photoSuccess) {
          toast({
            title: "Saved to Photos!",
            description: "Your awareness post has been saved to your photo library.",
          });
          setIsProcessing(false);
          return;
        }
      }
      
      // Fallback to traditional download
      const link = document.createElement('a');
      link.download = 'fentanyl-awareness-post.png';
      link.href = dataUrl;
      
      if (capabilities.isMobile) {
        // For mobile browsers, open in new tab for easier saving
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head><title>Fentanyl Awareness Post</title></head>
              <body style="margin:0;background:#000;text-align:center;padding:20px;">
                <p style="color:white;font-family:Arial;margin-bottom:20px;">Long press the image below and select "Save to Photos"</p>
                <img src="${dataUrl}" style="max-width:100%;height:auto;" alt="Fentanyl Awareness Post"/>
              </body>
            </html>
          `);
        } else {
          link.click();
        }
        
        toast({
          title: "Ready to save",
          description: "Long press the image and select 'Save to Photos' or 'Download Image'.",
          duration: 6000,
        });
      } else {
        link.click();
        toast({
          title: "Download started",
          description: "Your awareness post has been downloaded.",
        });
      }
      
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: "Download failed",
        description: "Unable to download image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
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
            enableLongPress={true}
          />
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Button 
              onClick={handleCopyToClipboard}
              disabled={isProcessing}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 border-0 disabled:opacity-50"
              size="lg"
            >
              <Copy className="mr-2 h-4 w-4" />
              {isProcessing 
                ? (capabilities.isMobile ? "Sharing..." : "Copying...")
                : (capabilities.isMobile ? "Share Post" : "Copy to Clipboard")
              }
            </Button>
            
            <Button 
              onClick={handleDownloadImage}
              disabled={isProcessing}
              className="w-full bg-white text-slate-900 hover:bg-white/90 disabled:opacity-50"
              size="lg"
            >
              {capabilities.canSaveToPhotos ? (
                <Smartphone className="mr-2 h-4 w-4" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {isProcessing 
                ? "Processing..." 
                : capabilities.canSaveToPhotos 
                  ? "Save to Photos" 
                  : "Download Image"
              }
            </Button>
            
            {capabilities.isMobile && !capabilities.canSaveToPhotos && (
              <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                <p className="text-xs text-blue-200 text-center">
                  💡 Tip: Long press the image above to save directly to your photos
                </p>
              </div>
            )}

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