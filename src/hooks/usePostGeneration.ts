
import { useState } from 'react';
import html2canvas from 'html2canvas';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getMobileInfo, getMobileOptimizedCanvasOptions } from '@/utils/mobileDetection';

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

  const generatePostImage = async (elementId: string, retryCount = 0): Promise<string | null> => {
    const mobileInfo = getMobileInfo();
    const maxRetries = mobileInfo.isMobile ? 3 : 1;
    
    try {
      const element = document.getElementById(elementId);
      if (!element) throw new Error('Post element not found');

      console.log('📱 Generating post image - Mobile info:', mobileInfo);

      // Wait for images to load on mobile
      if (mobileInfo.isMobile) {
        const images = element.querySelectorAll('img');
        await Promise.all(Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
            setTimeout(resolve, 3000); // Timeout after 3s
          });
        }));
        
        // Additional delay for mobile rendering
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const canvasOptions = getMobileOptimizedCanvasOptions(mobileInfo);
      console.log('🎨 Canvas options:', canvasOptions);

      const canvas = await html2canvas(element, canvasOptions);
      const dataUrl = canvas.toDataURL('image/png');
      
      console.log('✅ Successfully generated image');
      return dataUrl;
    } catch (error) {
      console.error(`❌ Error generating post image (attempt ${retryCount + 1}):`, error);
      
      if (retryCount < maxRetries) {
        console.log(`🔄 Retrying image generation (${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return generatePostImage(elementId, retryCount + 1);
      }
      
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
