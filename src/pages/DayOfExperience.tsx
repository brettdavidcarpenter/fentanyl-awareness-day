
import { useState, useCallback, useRef } from 'react';
import html2canvas from 'html2canvas';
import { TrackedButton } from "@/components/TrackedButton";
import { useToast } from "@/hooks/use-toast";
import { usePreviewGeneration } from "@/hooks/usePreviewGeneration";
import { useIsMobile } from "@/hooks/use-mobile";
import LivePostForm from "@/components/LivePostForm";
import PersonaSelection from "@/components/PersonaSelection";
import PostCanvas from '@/components/PostCanvas';
import ShareSection from '@/components/ShareSection';

import { getTemplatesByPersona } from "@/data/postTemplates";

const DayOfExperience = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const postCanvasRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<any>({
    persona: 'family',
    template: getTemplatesByPersona('family')[0],
    customText: '',
    personalization: { name: '', relationship: '' },
    uploadedImage: null,
    isCustomizing: false
  });
  
  // Use the preview generation hook
  const { previewImageUrl, isGenerating, error } = usePreviewGeneration({ formData });

  const handleFormChange = useCallback((newData: any) => {
    setFormData(newData);
  }, []);

  const handlePersonaSelect = useCallback((persona: string) => {
    const templates = getTemplatesByPersona(persona);
    setFormData(prev => ({
      ...prev,
      persona,
      template: templates[0],
      customText: '',
      personalization: { name: '', relationship: '' }
    }));
  }, []);

  const handleDownloadImage = async () => {
    try {
      // Use the preview image URL if available, otherwise generate new one
      let imageUrl = previewImageUrl;
      
      if (!imageUrl) {
        const element = document.getElementById('hidden-post-canvas');
        if (!element) throw new Error('Canvas element not found');
        
        const canvas = await html2canvas(element, {
          backgroundColor: null,
          scale: 2,
          useCORS: true
        });
        
        imageUrl = canvas.toDataURL('image/png', 0.95);
      }
      
      const link = document.createElement('a');
      link.download = 'fentanyl-awareness-post.png';
      link.href = imageUrl;
      link.click();
      
      toast({
        title: "Image Downloaded!",
        description: "Your post image has been saved to your device"
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading your image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getCurrentMessage = () => {
    if (formData.customText) return formData.customText;
    
    let message = formData.template?.message || '';
    if (formData.personalization?.name && formData.personalization?.relationship) {
      message = message
        .replace('[Name]', formData.personalization.name)
        .replace('[relationship]', formData.personalization.relationship);
    }
    return message;
  };

  const getCurrentImage = () => {
    return formData.uploadedImage || formData.template?.imagePath;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Create Your Fentanyl Awareness Post
          </h1>
          <p className="text-xl text-blue-100">
            Customize your message and see it come to life instantly
          </p>
        </div>

        {/* Layout: Mobile vs Desktop */}
        {isMobile ? (
          /* Mobile Layout */
          <div className="space-y-6 max-w-md mx-auto">
            {/* Persona Selection */}
            <PersonaSelection 
              onPersonaSelect={handlePersonaSelect}
            />
            
            {/* Final Image Preview */}
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-2">Final Image Preview</h2>
              <p className="text-blue-100 text-sm">
                This is exactly what will be downloaded
              </p>
            </div>

            <div className="flex justify-center">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                {isGenerating ? (
                  <div className="w-[280px] h-[280px] bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-gray-600 text-sm">Generating...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="w-[280px] h-[280px] bg-red-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-red-600 text-sm mb-1">Preview failed</p>
                      <p className="text-xs text-gray-500">Download will still work</p>
                    </div>
                  </div>
                ) : previewImageUrl ? (
                  <img 
                    src={previewImageUrl} 
                    alt="Final post preview" 
                    className="w-[280px] h-[280px] object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-[280px] h-[280px] bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600 text-sm">Loading preview...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Hashtags */}
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-3 text-center">Help Us By Using the Following Hashtags</h3>
              <div className="bg-gray-800 p-3 rounded border text-xs text-gray-100">
                Create your own awareness post at https://facingfentanylnow.aware-share.com/day-of-experience #FacingFentanyl #FentanylAwareness #NationalFentanylPreventionDay
              </div>
            </div>

            {/* Rest of Form */}
            <LivePostForm 
              onFormChange={handleFormChange}
              initialData={formData}
              showOnlyCustomization={true}
            />
            
            {/* Download Button */}
            <TrackedButton
              onClick={handleDownloadImage}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              trackingName="download_post_image"
              trackingCategory="post_creation"
              trackingPage="day_of_experience"
              trackingData={{ 
                persona: formData.persona, 
                hasCustomText: !!formData.customText,
                hasUploadedImage: !!formData.uploadedImage
              }}
            >
              Download Image
            </TrackedButton>

            {/* Share Section */}
            <ShareSection />

            {/* Hidden Canvas for Generation */}
            <div className="absolute -left-[9999px] top-0 pointer-events-none">
              <div id="hidden-post-canvas">
                <PostCanvas
                  template={{
                    ...formData.template,
                    message: getCurrentMessage(),
                    imagePath: getCurrentImage()
                  }}
                  personalization={formData.personalization}
                  customText={formData.customText}
                  customImage={formData.uploadedImage}
                  postType={formData.uploadedImage ? 'upload' : 'quick'}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Desktop Layout */
          <div className="grid lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
            {/* Left Side - Form Controls */}
            <div className="lg:col-span-2 space-y-6">
              <LivePostForm 
                onFormChange={handleFormChange}
                initialData={formData}
              />
              
              {/* Action Buttons */}
              <div className="space-y-4">
                <TrackedButton
                  onClick={handleDownloadImage}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  trackingName="download_post_image"
                  trackingCategory="post_creation"
                  trackingPage="day_of_experience"
                  trackingData={{ 
                    persona: formData.persona, 
                    hasCustomText: !!formData.customText,
                    hasUploadedImage: !!formData.uploadedImage
                  }}
                >
                  Download Image
                </TrackedButton>
              </div>
            </div>

            {/* Right Side - Live Preview */}
            <div className="lg:col-span-3">
              <div className="sticky top-8 space-y-6">
                {/* Final Image Preview Header */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">Final Image Preview</h2>
                  <p className="text-blue-100">
                    This is exactly what will be downloaded
                  </p>
                </div>

                {/* Post Preview - Generated Image */}
                <div className="flex justify-center">
                  <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                    {isGenerating ? (
                      <div className="w-[540px] h-[540px] bg-gray-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                          <p className="text-gray-600">Generating preview...</p>
                        </div>
                      </div>
                    ) : error ? (
                      <div className="w-[540px] h-[540px] bg-red-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-red-600 mb-2">Preview generation failed</p>
                          <p className="text-sm text-gray-500">The download function will still work</p>
                        </div>
                      </div>
                    ) : previewImageUrl ? (
                      <img 
                        src={previewImageUrl} 
                        alt="Final post preview" 
                        className="w-[540px] h-[540px] object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-[540px] h-[540px] bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-600">Loading preview...</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hidden Canvas for Generation */}
                <div className="absolute -left-[9999px] top-0 pointer-events-none">
                  <div id="hidden-post-canvas">
                    <PostCanvas
                      template={{
                        ...formData.template,
                        message: getCurrentMessage(),
                        imagePath: getCurrentImage()
                      }}
                      personalization={formData.personalization}
                      customText={formData.customText}
                      customImage={formData.uploadedImage}
                      postType={formData.uploadedImage ? 'upload' : 'quick'}
                    />
                  </div>
                </div>

                {/* Social Media Caption */}
                <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-white mb-3 text-center">Help Us By Using the Following Hashtags</h3>
                  <div className="bg-gray-800 p-4 rounded border text-sm text-gray-100">
                    Create your own awareness post at https://facingfentanylnow.aware-share.com/day-of-experience #FacingFentanyl #FentanylAwareness #NationalFentanylPreventionDay
                  </div>
                </div>

                {/* Share the Tool */}
                <ShareSection />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayOfExperience;
