import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import LivePostForm from "@/components/LivePostForm";
import PostCanvas from "@/components/PostCanvas";
import { getTemplatesByPersona } from "@/data/postTemplates";
import { usePreviewGeneration } from "@/hooks/usePreviewGeneration";
import { debounce } from "@/utils/debounce";

const PostCreatorStep = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const persona = searchParams.get("persona");
  
  const [formData, setFormData] = useState(() => {
    if (!persona) return {};
    
    const templates = getTemplatesByPersona(persona);
    const defaultTemplate = templates[0];
    return {
      persona,
      template: defaultTemplate,
      customText: defaultTemplate?.message || '',
      personalization: { name: '', relationship: '' },
      uploadedImage: null
    };
  });

  useEffect(() => {
    if (!persona) {
      navigate('/day-of-experience');
    }
  }, [persona, navigate]);

  const [shouldRegeneratePreview, setShouldRegeneratePreview] = useState(true);
  const [buttonEnabled, setButtonEnabled] = useState(true);
  const debounceRegenerateRef = useRef<(() => void) | null>(null);

  // Initialize debounced function
  useEffect(() => {
    debounceRegenerateRef.current = debounce(() => {
      setShouldRegeneratePreview(true);
    }, 500);
  }, []);

  const handleFormChange = useCallback((newData: any) => {
    setFormData(newData);
    
    // Trigger immediate regeneration for image uploads or immediate for other changes with debounce
    if (newData.uploadedImage !== formData.uploadedImage) {
      // Immediate regeneration for image changes
      setShouldRegeneratePreview(true);
    } else {
      // Debounced regeneration for text changes
      if (debounceRegenerateRef.current) {
        debounceRegenerateRef.current();
      }
    }
  }, [formData.uploadedImage]);

  // Use the preview generation hook
  const { previewImageUrl, isGenerating, error } = usePreviewGeneration({
    formData,
    triggerGeneration: shouldRegeneratePreview
  });

  // Debug logging for button issues
  useEffect(() => {
    console.log('🔄 Preview Generation State:', { 
      isGenerating, 
      buttonEnabled, 
      hasPreview: !!previewImageUrl,
      formDataKeys: Object.keys(formData),
      uploadedImage: !!formData.uploadedImage 
    });
  }, [isGenerating, buttonEnabled, previewImageUrl, formData]);

  // Reset regeneration flag after each generation
  useEffect(() => {
    if (!isGenerating) {
      setShouldRegeneratePreview(false);
    }
  }, [isGenerating]);

  const handleContinueToShare = () => {
    console.log('🚀 Button clicked - starting handleContinueToShare');
    console.log('📊 Current formData:', formData);
    console.log('🎮 Button enabled state:', buttonEnabled);
    console.log('⚡ Is generating preview:', isGenerating);
    
    if (!buttonEnabled) {
      console.log('❌ Button not enabled, stopping');
      return;
    }

    setButtonEnabled(false);
    
    // Ensure we have required data
    if (!formData.persona) {
      console.error('❌ Missing persona, cannot continue');
      setButtonEnabled(true);
      return;
    }

    if (!formData.template?.id) {
      console.error('❌ Missing template ID, cannot continue');
      setButtonEnabled(true);
      return;
    }

    const params = new URLSearchParams({
      persona: formData.persona,
      templateId: formData.template.id,
      ...(formData.customText && { customText: encodeURIComponent(formData.customText) }),
      ...(formData.personalization?.name && { personalizationName: encodeURIComponent(formData.personalization.name) }),
      ...(formData.personalization?.relationship && { personalizationRelationship: encodeURIComponent(formData.personalization.relationship) }),
      ...(formData.uploadedImage && { hasImage: 'true' })
    });

    if (formData.uploadedImage) {
      console.log('💾 Storing image in sessionStorage', typeof formData.uploadedImage, formData.uploadedImage.substring(0, 50));
      try {
        // Validate image data before storing
        if (typeof formData.uploadedImage === 'string' && formData.uploadedImage.startsWith('data:image/')) {
          sessionStorage.setItem('postImage', formData.uploadedImage);
          console.log('✅ Valid image stored successfully');
        } else {
          console.error('❌ Invalid image data, not storing:', typeof formData.uploadedImage, formData.uploadedImage);
        }
      } catch (error) {
        console.error('❌ Failed to store image:', error);
      }
    }

    console.log('🔗 Navigating with params:', params.toString());
    
    try {
      navigate(`/day-of-experience/result?${params.toString()}`);
      console.log('✅ Navigation initiated');
    } catch (error) {
      console.error('❌ Navigation failed:', error);
      setButtonEnabled(true);
    }

    // Re-enable button after navigation attempt with longer timeout
    setTimeout(() => {
      console.log('🔄 Re-enabling button after timeout');
      setButtonEnabled(true);
    }, 5000);
  };

  const handleDownload = async () => {
    if (!previewImageUrl) return;
    
    const link = document.createElement('a');
    link.href = previewImageUrl;
    link.download = 'fentanyl-awareness-post.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!persona) {
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
            onClick={() => navigate("/day-of-experience")}
            className="p-2 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Create Your Post</h1>
            <p className="text-sm text-blue-200">Step 2 of 3: Customize your content</p>
          </div>
        </div>

        {/* Main Content - Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto pb-24">
          {/* Form Section - Order 2 on mobile, 1 on desktop */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <div className="max-w-md mx-auto space-y-6">
              <LivePostForm
                onFormChange={handleFormChange}
                initialData={formData}
                showOnlyCustomization={true}
              />
              
              {/* Continue to Share Button - Isolated from preview generation */}
              <Button 
                onClick={handleContinueToShare}
                onTouchStart={(e) => console.log('📱 Touch start on button', e.type)}
                onTouchEnd={(e) => console.log('📱 Touch end on button', e.type)}
                disabled={!buttonEnabled}
                className="w-full bg-white text-slate-900 hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-2xl relative z-50"
                style={{ pointerEvents: buttonEnabled ? 'auto' : 'none' }}
                size="lg"
              >
                <Share2 className="h-4 w-4" />
                {buttonEnabled ? 'Continue to Share' : 'Processing...'}
              </Button>
            </div>
          </div>

          {/* Live Preview Section - Order 1 on mobile, 2 on desktop */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-8 lg:h-fit order-1 lg:order-2">
            <div className="space-y-4">
              {/* Preview Header */}
              <div className="text-center lg:text-left">
                <h2 className="text-xl font-semibold text-white mb-2">Live Preview</h2>
                <p className="text-sm text-blue-200">
                  {isGenerating ? "Updating preview..." : "Your post updates in real-time"}
                </p>
              </div>

              {/* Preview Canvas - consistent with result page */}
              <div className="bg-white/10 border border-white/20 rounded-lg p-4 relative overflow-hidden">
                <div className="transition-opacity duration-300" style={{ opacity: isGenerating ? 0.8 : 1 }}>
                  <PostCanvas
                    template={formData.template}
                    personalization={formData.personalization}
                    customText={formData.customText}
                    customImage={formData.uploadedImage}
                    postType={formData.uploadedImage ? 'upload' : 'quick'}
                  />
                </div>

                {/* Loading Overlay */}
                {isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg z-10">
                    <div className="bg-white/90 px-4 py-2 rounded-md shadow-lg">
                      <p className="text-sm text-slate-700">Generating image...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-md p-3">
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCreatorStep;