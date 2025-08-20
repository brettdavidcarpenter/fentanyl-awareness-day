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
    return {
      persona,
      template: templates[0],
      customText: '',
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

  // Reset regeneration flag after each generation
  useEffect(() => {
    if (!isGenerating) {
      setShouldRegeneratePreview(false);
    }
  }, [isGenerating]);

  const handleContinueToShare = () => {
    // Pass form data via URL params for the result page
    const params = new URLSearchParams({
      persona: formData.persona || '',
      templateId: formData.template?.id || '',
      customText: formData.customText || '',
      personalizationName: formData.personalization?.name || '',
      personalizationRelationship: formData.personalization?.relationship || '',
    });
    
    if (formData.uploadedImage) {
      params.set('hasImage', 'true');
      // Store image in sessionStorage for the result page
      sessionStorage.setItem('postImage', formData.uploadedImage);
    }
    
    navigate(`/day-of-experience/result?${params.toString()}`);
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
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Form Section */}
          <div className="w-full lg:w-1/2">
            <div className="max-w-md mx-auto">
              <LivePostForm
                onFormChange={handleFormChange}
                initialData={formData}
                showOnlyCustomization={true}
              />
            </div>
          </div>

          {/* Live Preview Section */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-8 lg:h-fit">
            <div className="space-y-6">
              {/* Preview Header */}
              <div className="text-center lg:text-left">
                <h2 className="text-xl font-semibold text-white mb-2">Live Preview</h2>
                <p className="text-sm text-blue-200">
                  {isGenerating ? "Updating preview..." : "Your post updates in real-time"}
                </p>
              </div>

              {/* Preview Canvas */}
              <div className="relative">
                {/* Single Canvas for both preview and generation */}
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
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
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

              {/* Action Button */}
              <div className="max-w-md mx-auto">
                <Button 
                  onClick={handleContinueToShare}
                  className="w-full bg-white text-slate-900 hover:bg-white/90 flex items-center justify-center gap-2"
                  size="lg"
                >
                  <Share2 className="h-4 w-4" />
                  Continue to Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCreatorStep;