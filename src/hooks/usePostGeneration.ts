
import { useState } from 'react';
import html2canvas from 'html2canvas';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PostData {
  persona: string;
  postType: 'prepopulated' | 'custom';
  template?: string;
  customText?: string;
  customImage?: File;
  personalization?: {
    name?: string;
    relationship?: string;
  };
}

export const usePostGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePostImage = async (elementId: string): Promise<string | null> => {
    try {
      const element = document.getElementById(elementId);
      if (!element) throw new Error('Post element not found');

      const canvas = await html2canvas(element, {
        scale: 1,
        backgroundColor: '#ffffff'
      });

      return canvas.toDataURL('image/png', 0.95);
    } catch (error) {
      console.error('Error generating post image:', error);
      return null;
    }
  };

  const saveAnalytics = async (postData: PostData) => {
    try {
      await supabase.from('day_of_experience_posts').insert({
        persona_type: postData.persona,
        post_type: postData.postType,
        template_used: postData.template || null
      });
    } catch (error) {
      console.error('Error saving analytics:', error);
    }
  };

  const createPost = async (postData: PostData): Promise<string | null> => {
    setIsGenerating(true);
    try {
      const imageUrl = await generatePostImage('post-canvas');
      if (imageUrl) {
        await saveAnalytics(postData);
        toast({
          title: "Post Created!",
          description: "Your post is ready to share on social media."
        });
      }
      return imageUrl;
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    createPost,
    isGenerating
  };
};
