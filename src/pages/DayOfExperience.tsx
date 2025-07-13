
import { useState, useCallback } from 'react';
import { TrackedButton } from "@/components/TrackedButton";
import { useToast } from "@/hooks/use-toast";
import LivePostForm from "@/components/LivePostForm";
import PostCanvas from '@/components/PostCanvas';

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
                  navigator.clipboard.writeText(getCurrentMessage());
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

              {/* Caption Preview */}
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-3">Caption Preview</h3>
                <div className="bg-gray-800 p-4 rounded border text-sm text-gray-100">
                  {getCurrentMessage()}
                </div>
              </div>


              {/* Share the Tool */}
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-4">
                  💫 Help Others Create Posts Too
                </h3>
                <p className="text-blue-100 mb-4">
                  Share this tool so others can create their own awareness posts
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <TrackedButton
                    onClick={() => {
                      const shareText = "Create your own Fentanyl Awareness Day post and help save lives.";
                      const shareUrl = window.location.origin + "/day-of-experience";
                      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm"
                    trackingName="share_tool_twitter"
                    trackingCategory="tool_sharing"
                    trackingPage="day_of_experience"
                  >
                    Share on X
                  </TrackedButton>
                  
                  <TrackedButton
                    onClick={() => {
                      const shareText = "Create your own Fentanyl Awareness Day post and help save lives.";
                      const shareUrl = window.location.origin + "/day-of-experience";
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    trackingName="share_tool_facebook"
                    trackingCategory="tool_sharing"
                    trackingPage="day_of_experience"
                  >
                    Share on Facebook
                  </TrackedButton>
                  
                  <TrackedButton
                    onClick={async () => {
                      const shareText = `Create your own Fentanyl Awareness Day post: ${window.location.origin}/day-of-experience`;
                      try {
                        await navigator.clipboard.writeText(shareText);
                        toast({
                          title: "Link Copied!",
                          description: "Share this with friends"
                        });
                      } catch (err) {
                        console.error('Copy failed:', err);
                      }
                    }}
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-black text-sm"
                    trackingName="copy_tool_link"
                    trackingCategory="tool_sharing"
                    trackingPage="day_of_experience"
                  >
                    Copy Link
                  </TrackedButton>
                  
                  <TrackedButton
                    onClick={async () => {
                      if (navigator.share) {
                        try {
                          await navigator.share({
                            title: 'Fentanyl Awareness Post Creator',
                            text: 'Create your own Fentanyl Awareness Day post and help save lives.',
                            url: window.location.origin + '/day-of-experience'
                          });
                        } catch (err) {
                          console.log('Share canceled');
                        }
                      }
                    }}
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-black text-sm"
                    trackingName="native_share_tool"
                    trackingCategory="tool_sharing"
                    trackingPage="day_of_experience"
                  >
                    Share
                  </TrackedButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayOfExperience;
