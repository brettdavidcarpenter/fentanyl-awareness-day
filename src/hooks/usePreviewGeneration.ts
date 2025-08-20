import { useState, useEffect, useCallback, useRef } from 'react';
import html2canvas from 'html2canvas';

interface PreviewGenerationProps {
  formData: any;
  triggerGeneration?: boolean;
}

export const usePreviewGeneration = ({ formData, triggerGeneration = true }: PreviewGenerationProps) => {
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generationTimeoutRef = useRef<NodeJS.Timeout>();
  const lastFormDataRef = useRef<string>('');

  const generatePreviewImage = useCallback(async () => {
    if (!triggerGeneration) return;

    console.log('🎨 Starting preview generation...');
    setIsGenerating(true);
    setError(null);
    
    try {
      // Wait for DOM to update and images to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find the visible post canvas
      const element = document.getElementById('post-canvas');
      if (!element) {
        console.log('❌ Post canvas element not found');
        throw new Error('Post canvas element not found');
      }

      console.log('✅ Found canvas element:', {
        width: element.offsetWidth,
        height: element.offsetHeight,
        children: element.children.length
      });

      // Ensure all images in the canvas are fully loaded
      const images = element.querySelectorAll('img');
      console.log(`🖼️ Found ${images.length} images in canvas`);
      
      await Promise.all(
        Array.from(images).map((img, index) => {
          if (img.complete && img.naturalWidth > 0) {
            console.log(`✅ Image ${index} already loaded`);
            return Promise.resolve();
          }
          
          console.log(`⏳ Waiting for image ${index} to load...`);
          return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              console.log(`⏰ Image ${index} load timeout`);
              resolve(null);
            }, 2000);
            
            img.onload = () => {
              console.log(`✅ Image ${index} loaded successfully`);
              clearTimeout(timeout);
              resolve(null);
            };
            img.onerror = () => {
              console.log(`❌ Image ${index} failed to load`);
              clearTimeout(timeout);
              resolve(null); // Don't reject, just continue
            };
          });
        })
      );

      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        foreignObjectRendering: false,
        logging: false
      });

      const imageUrl = canvas.toDataURL('image/png', 0.95);
      console.log('✅ Preview image generated successfully');
      setPreviewImageUrl(imageUrl);
    } catch (error) {
      console.error('❌ Error generating preview image:', error);
      setError('Failed to generate preview');
    } finally {
      console.log('🏁 Preview generation completed');
      setIsGenerating(false);
    }
  }, [triggerGeneration]);

  // Debounced generation when form data changes
  useEffect(() => {
    if (!triggerGeneration) return;

    const currentFormDataString = JSON.stringify(formData);
    
    // Only regenerate if form data actually changed
    if (currentFormDataString === lastFormDataRef.current) return;
    
    lastFormDataRef.current = currentFormDataString;

    // Clear existing timeout
    if (generationTimeoutRef.current) {
      clearTimeout(generationTimeoutRef.current);
    }

    // Debounce generation by 500ms
    generationTimeoutRef.current = setTimeout(() => {
      generatePreviewImage();
    }, 500);

    return () => {
      if (generationTimeoutRef.current) {
        clearTimeout(generationTimeoutRef.current);
      }
    };
  }, [formData, generatePreviewImage, triggerGeneration]);

  // Initial generation
  useEffect(() => {
    if (triggerGeneration) {
      generatePreviewImage();
    }
  }, [generatePreviewImage, triggerGeneration]);

  return {
    previewImageUrl,
    isGenerating,
    error,
    regeneratePreview: generatePreviewImage
  };
};