
import { useState } from 'react';
import { TrackedButton } from "@/components/TrackedButton";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import PersonaSelection from '@/components/PersonaSelection';
import TemplateSelector from '@/components/TemplateSelector';
import CustomPostCreator from '@/components/CustomPostCreator';
import FamilyPostSelector from '@/components/FamilyPostSelector';
import PostCanvas from '@/components/PostCanvas';
import SocialShare from '@/components/SocialShare';
import { usePostGeneration } from '@/hooks/usePostGeneration';

const DayOfExperience = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'persona' | 'templates' | 'custom' | 'preview'>('persona');
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [personalization, setPersonalization] = useState<any>(null);
  const [customData, setCustomData] = useState<any>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  const { createPost, isGenerating } = usePostGeneration();

  const handlePersonaSelect = (persona: string) => {
    setSelectedPersona(persona);
    setCurrentStep('templates');
  };

  const handleTemplateSelect = (template: any, personalizationData?: any) => {
    setSelectedTemplate(template);
    setPersonalization(personalizationData);
    setCurrentStep('preview');
    generatePost(template, personalizationData);
  };

  const handleCreateCustom = () => {
    setCurrentStep('custom');
  };

  const handleCustomPost = (customPostData: any) => {
    setCustomData(customPostData);
    setSelectedTemplate({
      message: customPostData.customText || customPostData.text,
      imagePath: customPostData.customImage || customPostData.image,
      postType: customPostData.postType || 'custom'
    });
    setCurrentStep('preview');
    generatePost({
      message: customPostData.customText || customPostData.text,
      imagePath: customPostData.customImage || customPostData.image,
      postType: customPostData.postType || 'custom'
    });
  };

  const generatePost = async (template: any, personalizationData?: any) => {
    // Wait for the next render cycle to ensure PostCanvas is rendered
    setTimeout(async () => {
      const imageUrl = await createPost({
        persona: selectedPersona,
        postType: customData ? 'custom' : 'prepopulated',
        template: template.id,
        customText: customData?.text,
        personalization: personalizationData
      });
      
      if (imageUrl) {
        setGeneratedImageUrl(imageUrl);
      }
    }, 100);
  };

  const resetToStart = () => {
    setCurrentStep('persona');
    setSelectedPersona('');
    setSelectedTemplate(null);
    setPersonalization(null);
    setCustomData(null);
    setGeneratedImageUrl('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-end mb-8">
          {currentStep !== 'persona' && (
            <TrackedButton 
              onClick={resetToStart} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              trackingName="navigation_start_over"
              trackingCategory="navigation"
              trackingPage="day_of_experience"
              trackingData={{ currentStep, selectedPersona }}
            >
              Start Over
            </TrackedButton>
          )}
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Fentanyl Awareness Day Experience
          </h1>
          <p className="text-xl text-blue-100">
            Create meaningful posts to share your story and save lives
          </p>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {currentStep === 'persona' && (
            <PersonaSelection onPersonaSelect={handlePersonaSelect} />
          )}

          {currentStep === 'templates' && selectedPersona === 'family' && (
            <FamilyPostSelector
              onTemplateSelect={handleTemplateSelect}
              onCustomPost={handleCustomPost}
            />
          )}

          {currentStep === 'templates' && selectedPersona !== 'family' && (
            <TemplateSelector
              persona={selectedPersona}
              onTemplateSelect={handleTemplateSelect}
              onCreateCustom={handleCreateCustom}
              onBack={() => setCurrentStep('persona')}
            />
          )}

          {currentStep === 'custom' && (
            <CustomPostCreator
              onCreatePost={handleCustomPost}
              onBack={() => setCurrentStep('templates')}
            />
          )}

          {currentStep === 'preview' && (
            <div className="space-y-8">
              {/* Hidden canvas for image generation */}
              <div className="hidden">
                <PostCanvas
                  template={selectedTemplate}
                  personalization={personalization}
                  customText={customData?.text}
                  customImage={customData?.image}
                />
              </div>

              {/* Visible preview */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-6">Your Post is Ready!</h2>
                
                <div className="flex justify-center mb-8">
                  <PostCanvas
                    template={selectedTemplate}
                    personalization={personalization}
                    customText={customData?.text}
                    customImage={customData?.image}
                  />
                </div>

                {/* Progress indicator */}
                {isGenerating && (
                  <div className="mb-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p className="text-white">Creating your post...</p>
                  </div>
                )}

                {/* Social sharing - show even while generating */}
                <div className="mb-8">
                  <SocialShare
                    imageUrl={generatedImageUrl}
                    message={selectedTemplate?.message || customData?.text || ''}
                    isGenerating={isGenerating}
                  />
                </div>

                {/* Share the Day of Experience section */}
                <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-4">
                    💫 Help Others Create Their Posts Too
                  </h3>
                  <p className="text-blue-100 mb-4">
                    Share this tool with friends and family so they can create their own awareness posts
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TrackedButton
                      onClick={() => {
                        const shareText = "Create your own Fentanyl Awareness Day post and help save lives. Every share makes a difference.";
                        const shareUrl = window.location.origin + "/day-of-experience";
                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      trackingName="share_tool_twitter"
                      trackingCategory="tool_sharing"
                      trackingPage="day_of_experience"
                    >
                      Share Tool on Twitter/X
                    </TrackedButton>
                    
                    <TrackedButton
                      onClick={() => {
                        const shareText = "Create your own Fentanyl Awareness Day post and help save lives. Every share makes a difference.";
                        const shareUrl = window.location.origin + "/day-of-experience";
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      trackingName="share_tool_facebook"
                      trackingCategory="tool_sharing"
                      trackingPage="day_of_experience"
                    >
                      Share Tool on Facebook
                    </TrackedButton>
                    
                    <TrackedButton
                      onClick={async () => {
                        const shareText = `Create your own Fentanyl Awareness Day post and help save lives. Every share makes a difference.\n\n${window.location.origin}/day-of-experience`;
                        try {
                          await navigator.clipboard.writeText(shareText);
                          toast({
                            title: "Link Copied!",
                            description: "Share this with friends so they can create their own posts"
                          });
                        } catch (err) {
                          console.error('Failed to copy:', err);
                          toast({
                            title: "Copy Failed",
                            description: "Please copy the link manually",
                            variant: "destructive"
                          });
                        }
                      }}
                      variant="outline"
                      className="text-white border-white hover:bg-white hover:text-black"
                      trackingName="copy_tool_link"
                      trackingCategory="tool_sharing"
                      trackingPage="day_of_experience"
                    >
                      Copy Link to Share
                    </TrackedButton>
                    
                    <TrackedButton
                      onClick={async () => {
                        if (navigator.share) {
                          try {
                            await navigator.share({
                              title: 'Fentanyl Awareness Day Post Creator',
                              text: 'Create your own Fentanyl Awareness Day post and help save lives. Every share makes a difference.',
                              url: window.location.origin + '/day-of-experience'
                            });
                          } catch (err) {
                            console.log('Share canceled');
                          }
                        }
                      }}
                      variant="outline"
                      className="text-white border-white hover:bg-white hover:text-black"
                      trackingName="native_share_tool"
                      trackingCategory="tool_sharing"
                      trackingPage="day_of_experience"
                    >
                      Share with Friends
                    </TrackedButton>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayOfExperience;
