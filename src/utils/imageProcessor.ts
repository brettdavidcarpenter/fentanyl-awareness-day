/**
 * Image processing utilities for optimizing uploaded images
 * Automatically crops square images to 4:5 aspect ratio for better mobile generation
 */

export interface ProcessedImageResult {
  dataUrl: string;
  originalDimensions: { width: number; height: number };
  processedDimensions: { width: number; height: number };
  wasProcessed: boolean;
}

/**
 * Processes an uploaded image file to optimize it for the polaroid frame
 * - Crops square images to 4:5 aspect ratio
 * - Compresses large images for mobile performance
 * - Maintains quality while ensuring consistent generation
 */
export const processUploadedImage = async (file: File): Promise<ProcessedImageResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        const { width: originalWidth, height: originalHeight } = img;
        const aspectRatio = originalWidth / originalHeight;
        
        // Determine if image needs processing (square or near-square)
        const isSquare = aspectRatio >= 0.9 && aspectRatio <= 1.1;
        
        let targetWidth = originalWidth;
        let targetHeight = originalHeight;
        let cropX = 0;
        let cropY = 0;
        let wasProcessed = false;

        if (isSquare) {
          // Crop to 4:5 aspect ratio (0.8)
          const targetAspectRatio = 0.8;
          
          if (aspectRatio > targetAspectRatio) {
            // Image is wider than target - crop width
            targetWidth = originalHeight * targetAspectRatio;
            cropX = (originalWidth - targetWidth) / 2;
            wasProcessed = true;
          } else {
            // Image is taller than target - crop height  
            targetHeight = originalWidth / targetAspectRatio;
            cropY = (originalHeight - targetHeight) / 2;
            wasProcessed = true;
          }
        }

        // Set canvas size - limit max size for mobile performance
        const maxSize = 1080;
        let canvasWidth = targetWidth;
        let canvasHeight = targetHeight;

        if (Math.max(targetWidth, targetHeight) > maxSize) {
          const scaleFactor = maxSize / Math.max(targetWidth, targetHeight);
          canvasWidth = targetWidth * scaleFactor;
          canvasHeight = targetHeight * scaleFactor;
          wasProcessed = true;
        }

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Draw the processed image
        ctx.drawImage(
          img,
          cropX, cropY, targetWidth, targetHeight,  // Source rectangle
          0, 0, canvasWidth, canvasHeight           // Destination rectangle
        );

        // Convert to data URL with quality optimization
        const quality = file.size > 2 * 1024 * 1024 ? 0.8 : 0.9; // Lower quality for large files
        const dataUrl = canvas.toDataURL('image/jpeg', quality);

        resolve({
          dataUrl,
          originalDimensions: { width: originalWidth, height: originalHeight },
          processedDimensions: { width: canvasWidth, height: canvasHeight },
          wasProcessed
        });
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Converts a data URL back to a File object (if needed for form uploads)
 */
export const dataUrlToFile = (dataUrl: string, filename: string = 'processed-image.jpg'): File => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
};