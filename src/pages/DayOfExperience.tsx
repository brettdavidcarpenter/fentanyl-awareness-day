
import { useState, useCallback } from 'react';
import { TrackedButton } from "@/components/TrackedButton";
import { useToast } from "@/hooks/use-toast";
import LivePostForm from "@/components/LivePostForm";
import PostCanvas from '@/components/PostCanvas';
import ShareSection from '@/components/ShareSection';

import { usePostGeneration } from '@/hooks/usePostGeneration';
import { getTemplatesByPersona } from "@/data/postTemplates";

const DayOfExperience = () => {
  const { toast } = useToast();
  const { createPost, isGenerating } = usePostGeneration();
  const [formData, setFormData] = useState<any>({
    persona: 'family',
    template: getTemplatesByPersona('family')[0],
    customText: '',
    personalization: { name: '', relationship: '' },
    uploadedImage: null,
    isCustomizing: false
  });
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');

  const handleFormChange = useCallback((newData: any) => {
    setFormData(newData);
  }, []);

  const handleGeneratePost = async () => {
    const imageUrl = await createPost({
      persona: formData.persona,
      postType: formData.uploadedImage ? 'custom' : 'prepopulated',
      template: formData.template?.id,
      customText: formData.customText,
      personalization: formData.personalization
    });
    
    if (imageUrl) {
      setGeneratedImageUrl(imageUrl);
      toast({
        title: "Post Generated!",
        description: "Your post is ready to share"
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

        {/* Split Screen Layout */}
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
                onClick={handleGeneratePost}
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                trackingName="generate_post_live"
                trackingCategory="post_creation"
                trackingPage="day_of_experience"
                trackingData={{ 
                  persona: formData.persona, 
                  hasCustomText: !!formData.customText,
                  hasUploadedImage: !!formData.uploadedImage
                }}
              >
                {isGenerating ? 'Generating...' : 'Generate Final Post'}
              </TrackedButton>

              <TrackedButton
                onClick={() => {
                  const socialCaption = "Join the fight against fentanyl. Every voice matters in raising awareness and saving lives. #FacingFentanyl #FentanylAwareness #NationalFentanylPreventionDay\n\nCreate your own awareness post at https://facingfentanylnow.aware-share.com/day-of-experience";
                  navigator.clipboard.writeText(socialCaption);
                  toast({
                    title: "Caption Copied!",
                    description: "Paste this into your social media post"
                  });
                }}
                variant="outline"
                className="w-full text-white border-white hover:bg-white hover:text-black"
                trackingName="copy_caption_live"
                trackingCategory="post_creation"
                trackingPage="day_of_experience"
              >
                Copy Caption
              </TrackedButton>
            </div>
          </div>

          {/* Right Side - Live Preview */}
          <div className="lg:col-span-3">
            <div className="sticky top-8 space-y-6">
              {/* Live Preview Header */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Live Preview</h2>
                <p className="text-blue-100">
                  Your changes appear instantly below
                </p>
              </div>

              {/* Post Preview */}
              <div className="flex justify-center">
                <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
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
                <h3 className="text-lg font-semibold text-white mb-3">Please use the following hashtags to spread awareness</h3>
                <div className="bg-gray-800 p-4 rounded border text-sm text-gray-100">
                  Join the fight against fentanyl. Every voice matters in raising awareness and saving lives. #FacingFentanyl #FentanylAwareness #NationalFentanylPreventionDay
                  
                  Create your own awareness post at https://facingfentanylnow.aware-share.com/day-of-experience
                </div>
              </div>


              {/* Share the Tool */}
              <ShareSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayOfExperience;
