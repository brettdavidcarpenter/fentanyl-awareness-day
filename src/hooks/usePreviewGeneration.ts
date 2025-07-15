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

    setIsGenerating(true);
    setError(null);
    
    try {
      // Wait a bit for DOM to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const element = document.getElementById('hidden-post-canvas');
      if (!element) {
        throw new Error('Hidden canvas element not found');
      }

      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
        useCORS: true
      });

      const imageUrl = canvas.toDataURL('image/png', 0.95);
      setPreviewImageUrl(imageUrl);
    } catch (error) {
      console.error('Error generating preview image:', error);
      setError('Failed to generate preview');
    } finally {
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