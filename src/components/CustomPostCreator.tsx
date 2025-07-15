
import { useState } from 'react';
import { TrackedButton } from "@/components/TrackedButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { familyTemplates } from '@/data/postTemplates';

interface CustomPostCreatorProps {
  onCreatePost: (customData: { text: string; image?: string }) => void;
  onBack: () => void;
}

const CustomPostCreator = ({ onCreatePost, onBack }: CustomPostCreatorProps) => {
  const [customText, setCustomText] = useState('');
  const [selectedFallbackImage, setSelectedFallbackImage] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string>('');

  const fallbackImages = familyTemplates.map(t => t.imagePath);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        setSelectedFallbackImage(''); // Clear fallback selection
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const imageToUse = uploadedImage || selectedFallbackImage || fallbackImages[0];
    onCreatePost({
      text: customText || 'Standing together on Fentanyl Awareness Day. #FacingFentanyl #FentanylAwarenessDay',
      image: imageToUse
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <TrackedButton 
          variant="outline" 
          onClick={onBack}
          trackingName="custom_back_to_templates"
          trackingCategory="navigation"
          trackingPage="day_of_experience"
        >
          ← Back
        </TrackedButton>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Your Own Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Custom Text */}
          <div>
            <Label htmlFor="custom-text">Your Message</Label>
            <Textarea
              id="custom-text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Share your message for Fentanyl Awareness Day..."
              className="min-h-[100px]"
              maxLength={120}
            />
            <div className={`text-xs mt-1 flex items-center justify-between ${
              (() => {
                const count = customText.length;
                if (count <= 96) return 'text-green-600';
                if (count <= 108) return 'text-orange-500';
                return 'text-red-500 font-medium';
              })()
            }`}>
              <span className="text-muted-foreground">
                {(() => {
                  const count = customText.length;
                  if (count > 108) return '⚠️ Character limit reached';
                  if (count > 96) return '⚠️ Approaching limit';
                  return 'Good length for polaroid';
                })()}
              </span>
              <span>{customText.length}/120</span>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label>Upload Your Image (optional)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-2">
                Upload a photo or choose from our images below
              </p>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="max-w-xs mx-auto"
              />
            </div>
          </div>

          {/* Fallback Images */}
          {!uploadedImage && (
            <div>
              <Label>Or Choose from Our Images</Label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {fallbackImages.map((imagePath, index) => (
                  <div 
                    key={index}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                      selectedFallbackImage === imagePath 
                        ? 'border-blue-500' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedFallbackImage(imagePath)}
                  >
                    <img 
                      src={imagePath} 
                      alt={`Option ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview */}
          {(uploadedImage || selectedFallbackImage) && (
            <div>
              <Label>Preview</Label>
              <div className="border rounded-lg p-4 bg-gray-50">
                <img 
                  src={uploadedImage || selectedFallbackImage} 
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded mx-auto mb-2"
                />
                <p className="text-sm text-center">
                  {customText || 'Standing together on Fentanyl Awareness Day. #FacingFentanyl #FentanylAwarenessDay'}
                </p>
              </div>
            </div>
          )}

          <TrackedButton 
            onClick={handleSubmit} 
            className="w-full"
            trackingName="custom_post_create"
            trackingCategory="custom_creation"
            trackingPage="day_of_experience"
            trackingData={{ 
              hasCustomText: !!customText,
              hasUploadedImage: !!uploadedImage,
              hasFallbackImage: !!selectedFallbackImage,
              textLength: customText.length
            }}
          >
            Create Post
          </TrackedButton>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomPostCreator;
