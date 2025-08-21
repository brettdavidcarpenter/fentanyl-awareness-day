
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrackedButton } from "@/components/TrackedButton";
import { Download } from "lucide-react";
import { getTemplatesByPersona } from "@/data/postTemplates";
import { usePreviewGeneration } from "@/hooks/usePreviewGeneration";
import { useIsMobile } from "@/hooks/use-mobile";
import LivePostForm from "@/components/LivePostForm";
import PersonaSelection from "@/components/PersonaSelection";
import PostCanvas from '@/components/PostCanvas';
import ShareSection from '@/components/ShareSection';
import html2canvas from 'html2canvas';

const DayOfExperience = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { previewImageUrl, isGenerating, error } = usePreviewGeneration({ 
    formData: {
      persona: 'family',
      template: getTemplatesByPersona('family')[0],
      customText: '',
      personalization: { name: '', relationship: '' },
      uploadedImage: null,
      isCustomizing: false
    }
  });

  // Redirect mobile users to the new multi-step flow
  useEffect(() => {
    if (isMobile) {
      navigate('/day-of-experience');
    }
  }, [isMobile, navigate]);

  const [formData, setFormData] = useState<any>({
    persona: 'family',
    template: getTemplatesByPersona('family')[0],
    customText: '',
    personalization: { name: '', relationship: '' },
    uploadedImage: null,
    isCustomizing: false
  });

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
    } catch (error) {
      console.error('Error downloading image:', error);
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

  // Show loading or nothing while redirecting mobile users
  if (isMobile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-primary">Day of Experience</h1>
          <p className="text-lg text-muted-foreground">Create your awareness post for National Fentanyl Awareness Day</p>
        </div>
        
        {/* Desktop Layout */}
        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <PersonaSelection onPersonaSelect={handlePersonaSelect} />
            
            {formData.persona && (
              <LivePostForm
                onFormChange={handleFormChange}
                initialData={formData}
              />
            )}
          </div>
          
          {/* Right Column - Preview and Actions */}
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
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
              <TrackedButton
                onClick={handleDownloadImage}
                className="w-full"
                trackingCategory="download"
                trackingName="download-desktop"
                trackingPage="day-of-experience"
                trackingData={{ 
                  persona: formData.persona, 
                  hasCustomText: !!formData.customText,
                  hasUploadedImage: !!formData.uploadedImage 
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Image
              </TrackedButton>
              
              <ShareSection />
            </div>
          </div>
        </div>
        
        {/* Hidden canvas for image generation */}
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <PostCanvas
            template={formData.template}
            personalization={formData.personalization}
            customText={formData.customText}
            customImage={formData.uploadedImage}
            postType={formData.uploadedImage ? 'upload' : 'quick'}
          />
        </div>
      </div>
    </div>
  );
};

export default DayOfExperience;
