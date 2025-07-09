import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrackedButton } from "@/components/TrackedButton";
import { Upload, Zap } from "lucide-react";
import { getTemplatesByPersona } from "@/data/postTemplates";

interface UnifiedPostSelectorProps {
  persona: string;
  onTemplateSelect: (template: any, personalization?: any) => void;
  onCustomPost: (customData: any) => void;
  onBack: () => void;
}

const UnifiedPostSelector = ({ persona, onTemplateSelect, onCustomPost, onBack }: UnifiedPostSelectorProps) => {
  const [selectedOption, setSelectedOption] = useState<'quick' | 'upload' | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [customText, setCustomText] = useState('');

  const templates = getTemplatesByPersona(persona);
  const primaryTemplate = templates[0]; // Use the first template as the primary one

  const personaConfig = {
    family: {
      title: "Share Your Story",
      quickTitle: "Quick Memorial Post",
      quickDescription: "Use our pre-designed template with your loved one's details",
      uploadTitle: "Upload Your Photo", 
      uploadDescription: "Share a personal photo with awareness message"
    },
    law_enforcement: {
      title: "Educate Your Community",
      quickTitle: "Quick Awareness Post",
      quickDescription: "Share official awareness content with your community",
      uploadTitle: "Upload Department Photo",
      uploadDescription: "Share awareness message with your department's image"
    },
    recovery: {
      title: "Share Hope & Resources",
      quickTitle: "Quick Recovery Post",
      quickDescription: "Share hope and recovery resources",
      uploadTitle: "Upload Your Photo",
      uploadDescription: "Share personal recovery story with awareness message"
    }
  };

  const config = personaConfig[persona as keyof typeof personaConfig] || personaConfig.family;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickPost = () => {
    if (primaryTemplate) {
      // For family persona, we might need personalization
      if (persona === 'family') {
        onTemplateSelect(primaryTemplate, { type: 'quick' });
      } else {
        onTemplateSelect(primaryTemplate, { type: 'quick' });
      }
    }
  };

  const handleUploadPost = () => {
    if (uploadedImage) {
      onCustomPost({
        image: uploadedImage,
        text: customText || primaryTemplate?.message || '',
        template: primaryTemplate,
        type: 'upload'
      });
    }
  };

  if (!selectedOption) {
    return (
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 text-white hover:text-gray-300"
        >
          ← Back to personas
        </Button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">{config.title}</h2>
          <p className="text-gray-300">Choose how you'd like to create your post</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Quick Post Option */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedOption('quick')}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-primary/20 rounded-full w-fit">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-lg">{config.quickTitle}</CardTitle>
              <CardDescription>{config.quickDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <TrackedButton 
                className="w-full"
                trackingName={`quick_post_${persona}`}
                trackingCategory="post_creation"
                trackingPage="day_of_experience"
                trackingData={{ persona, postType: 'quick' }}
              >
                Create Quick Post
              </TrackedButton>
            </CardContent>
          </Card>

          {/* Upload Image Option */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedOption('upload')}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-secondary/20 rounded-full w-fit">
                <Upload className="w-8 h-8 text-secondary" />
              </div>
              <CardTitle className="text-lg">{config.uploadTitle}</CardTitle>
              <CardDescription>{config.uploadDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <TrackedButton 
                variant="secondary"
                className="w-full"
                trackingName={`upload_post_${persona}`}
                trackingCategory="post_creation"
                trackingPage="day_of_experience"
                trackingData={{ persona, postType: 'upload' }}
              >
                Upload & Create
              </TrackedButton>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (selectedOption === 'quick') {
    return (
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedOption(null)}
          className="mb-4 text-white hover:text-gray-300"
        >
          ← Back to options
        </Button>

        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-white mb-2">Quick Post Ready</h3>
          <p className="text-gray-300">Your post will include the suggested message and image</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Preview Message</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This message will be provided as a caption you can copy:
            </p>
            <div className="bg-muted p-4 rounded border">
              <p>{primaryTemplate?.message}</p>
            </div>
          </CardContent>
        </Card>

        <TrackedButton 
          onClick={handleQuickPost}
          className="w-full"
          trackingName={`confirm_quick_post_${persona}`}
          trackingCategory="post_creation"
          trackingPage="day_of_experience"
          trackingData={{ persona, templateId: primaryTemplate?.id }}
        >
          Create Quick Post
        </TrackedButton>
      </div>
    );
  }

  if (selectedOption === 'upload') {
    return (
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedOption(null)}
          className="mb-4 text-white hover:text-gray-300"
        >
          ← Back to options
        </Button>

        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-white mb-2">Upload Your Photo</h3>
          <p className="text-gray-300">Add your own image with awareness message</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label htmlFor="image-upload">Choose an image from your device</Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
                {uploadedImage && (
                  <div className="mt-4">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded preview" 
                      className="w-full max-w-xs mx-auto rounded border"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suggested Caption</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label htmlFor="custom-text">Edit the message if needed:</Label>
                <textarea
                  id="custom-text"
                  value={customText || primaryTemplate?.message || ''}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full p-3 border rounded min-h-[100px] bg-background"
                  placeholder="Enter your message..."
                />
              </div>
            </CardContent>
          </Card>

          <TrackedButton 
            onClick={handleUploadPost}
            disabled={!uploadedImage}
            className="w-full"
            trackingName={`confirm_upload_post_${persona}`}
            trackingCategory="post_creation"
            trackingPage="day_of_experience"
            trackingData={{ persona, hasCustomText: !!customText }}
          >
            Create Post with Uploaded Image
          </TrackedButton>
        </div>
      </div>
    );
  }

  return null;
};

export default UnifiedPostSelector;