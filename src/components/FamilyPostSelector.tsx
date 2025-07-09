import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Heart } from 'lucide-react';

interface FamilyPostSelectorProps {
  onTemplateSelect: (template: any, personalizationData?: any) => void;
  onCustomPost: (customPostData: any) => void;
}

const FamilyPostSelector = ({ onTemplateSelect, onCustomPost }: FamilyPostSelectorProps) => {
  const [selectedOption, setSelectedOption] = useState<'template' | 'custom' | null>(null);
  const [name, setName] = useState('');
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCustomImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTemplatePost = () => {
    if (!name.trim()) return;
    
    const template = {
      id: 'family-template',
      title: 'In Memory Template',
      message: `Today I honor ${name}. Your light continues to inspire change.`,
      imagePath: '/lovable-uploads/c3845ee9-b4b7-4a9a-946b-adeb1c279481.png',
      customizable: true,
      postType: 'family-template'
    };

    onTemplateSelect(template, { name });
  };

  const handleCustomPost = () => {
    if (!name.trim() || !customImage) return;

    const customPostData = {
      persona: 'family',
      customText: `Today I honor ${name}. Your light continues to inspire change.`,
      customImage: imagePreview,
      postType: 'family-custom'
    };

    onCustomPost(customPostData);
  };

  if (selectedOption === 'template') {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedOption(null)}
          className="mb-4"
        >
          ← Back to options
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Honor with Our Image
            </CardTitle>
            <CardDescription>
              Create a memorial post using our provided image
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Preview of template */}
            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src="/lovable-uploads/c3845ee9-b4b7-4a9a-946b-adeb1c279481.png"
                alt="Template preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 text-center">
                <p className="text-sm font-kalam italic text-gray-700">
                  "Today I honor [Name]. Your light continues to inspire change."
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name of loved one</Label>
              <Input
                id="name"
                placeholder="Enter the name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleTemplatePost}
              disabled={!name.trim()}
              className="w-full"
            >
              Create Memorial Post
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedOption === 'custom') {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedOption(null)}
          className="mb-4"
        >
          ← Back to options
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Your Photo
            </CardTitle>
            <CardDescription>
              Create a memorial post with your own photo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="photo">Upload Photo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {imagePreview ? (
                  <div className="space-y-2">
                    <img 
                      src={imagePreview} 
                      alt="Uploaded preview" 
                      className="w-full h-32 object-cover rounded"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setCustomImage(null);
                        setImagePreview(null);
                      }}
                    >
                      Change Photo
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload a photo</p>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-name">Name of loved one</Label>
              <Input
                id="custom-name"
                placeholder="Enter the name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleCustomPost}
              disabled={!name.trim() || !customImage}
              className="w-full"
            >
              Create Memorial Post
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Create Your Memorial Post</h2>
        <p className="text-gray-600">Choose how you'd like to honor your loved one</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Option 1: Use Template */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedOption('template')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Honor with Our Image
            </CardTitle>
            <CardDescription>
              Use our provided image with personalized text
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
              <img 
                src="/lovable-uploads/c3845ee9-b4b7-4a9a-946b-adeb1c279481.png"
                alt="Template option"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-gray-600 italic">
              "Today I honor [Name]. Your light continues to inspire change."
            </p>
            <Button className="w-full mt-4">Choose This Option</Button>
          </CardContent>
        </Card>

        {/* Option 2: Upload Custom Photo */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedOption('custom')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Your Photo
            </CardTitle>
            <CardDescription>
              Share your own photo with personalized text
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Upload className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Your photo will appear here</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 italic">
              "Today I honor [Name]. Your light continues to inspire change."
            </p>
            <Button className="w-full mt-4">Choose This Option</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FamilyPostSelector;