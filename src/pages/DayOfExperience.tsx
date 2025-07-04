
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import PersonaSelection from '@/components/PersonaSelection';
import TemplateSelector from '@/components/TemplateSelector';
import CustomPostCreator from '@/components/CustomPostCreator';
import PostCanvas from '@/components/PostCanvas';
import SocialShare from '@/components/SocialShare';
import { usePostGeneration } from '@/hooks/usePostGeneration';

const DayOfExperience = () => {
  const navigate = useNavigate();
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
      message: customPostData.text,
      imagePath: customPostData.image
    });
    setCurrentStep('preview');
    generatePost({
      message: customPostData.text,
      imagePath: customPostData.image
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
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => navigate('/')} className="text-white border-white hover:bg-white hover:text-black">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          {currentStep !== 'persona' && (
            <Button variant="outline" onClick={resetToStart} className="text-white border-white hover:bg-white hover:text-black">
              Start Over
            </Button>
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

          {currentStep === 'templates' && (
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

                {isGenerating && (
                  <p className="text-white mb-4">Generating your post...</p>
                )}

                {generatedImageUrl && (
                  <SocialShare
                    imageUrl={generatedImageUrl}
                    message={selectedTemplate?.message || customData?.text || ''}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayOfExperience;
