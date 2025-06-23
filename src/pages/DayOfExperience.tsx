
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Settings } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { isEventWindowActive, getDaysUntilEvent, getDaysUntilAwarenessDay, isDemoMode } from '@/utils/eventWindow';
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

  const [eventActive, setEventActive] = useState(false);
  const [demoActive, setDemoActive] = useState(false);
  const [daysUntilEvent, setDaysUntilEvent] = useState(0);
  const [daysUntilAwareness, setDaysUntilAwareness] = useState(0);

  useEffect(() => {
    const demo = isDemoMode();
    const event = isEventWindowActive();
    setDemoActive(demo);
    setEventActive(event);
    setDaysUntilEvent(getDaysUntilEvent());
    setDaysUntilAwareness(getDaysUntilAwarenessDay());
  }, []);

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

  // Event window check - only restrict if not in demo mode
  if (!eventActive && !demoActive) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button variant="outline" onClick={() => navigate('/')} className="text-white border-white hover:bg-white hover:text-black">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Coming Soon Message */}
          <div className="text-center text-white max-w-3xl mx-auto">
            <Calendar className="w-16 h-16 mx-auto mb-6 text-blue-300" />
            <h1 className="text-4xl font-bold mb-6">Fentanyl Awareness Day Experience</h1>
            <p className="text-xl mb-8">
              This special page will be available during Fentanyl Prevention Week
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="w-5 h-5" />
                <h2 className="text-2xl font-semibold">Countdown</h2>
              </div>
              
              {daysUntilEvent > 0 ? (
                <div>
                  <p className="text-3xl font-bold mb-2">{daysUntilEvent} days</p>
                  <p className="text-lg">until the Day of Experience opens</p>
                  <p className="text-sm opacity-75 mt-2">August 14-28, 2025</p>
                </div>
              ) : (
                <div>
                  <p className="text-3xl font-bold mb-2">{daysUntilAwareness} days</p>
                  <p className="text-lg">until Fentanyl Awareness Day</p>
                  <p className="text-sm opacity-75 mt-2">August 21, 2025</p>
                </div>
              )}
            </div>

            <div className="space-y-4 text-left">
              <h3 className="text-2xl font-semibold text-center">What to Expect:</h3>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                  <h4 className="font-semibold mb-2">Share Stories</h4>
                  <p className="text-sm">Honor loved ones and share powerful stories that save lives</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                  <h4 className="font-semibold mb-2">Create Posts</h4>
                  <p className="text-sm">Generate social media content to raise awareness</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                  <h4 className="font-semibold mb-2">Make Impact</h4>
                  <p className="text-sm">Join thousands amplifying the message of prevention</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => navigate('/')} className="text-white border-white hover:bg-white hover:text-black">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-4">
            {demoActive && (
              <div className="flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-300 px-3 py-1 rounded-full text-sm">
                <Settings className="w-3 h-3" />
                Demo Mode
              </div>
            )}
            
            {currentStep !== 'persona' && (
              <Button variant="outline" onClick={resetToStart} className="text-white border-white hover:bg-white hover:text-black">
                Start Over
              </Button>
            )}
          </div>
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
            <div>
              <TemplateSelector
                persona={selectedPersona}
                onTemplateSelect={handleTemplateSelect}
                onBack={() => setCurrentStep('persona')}
              />
              
              <div className="text-center mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep('custom')}
                  className="text-white border-white hover:bg-white hover:text-black"
                >
                  Create Your Own Post Instead
                </Button>
              </div>
            </div>
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
