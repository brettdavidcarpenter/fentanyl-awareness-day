
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TrackedButton } from "@/components/TrackedButton";
import { Upload, Heart, Shield, Users } from "lucide-react";
import { getTemplatesByPersona } from "@/data/postTemplates";

interface LivePostFormProps {
  onFormChange: (data: any) => void;
  initialData?: any;
}

const LivePostForm = ({ onFormChange, initialData }: LivePostFormProps) => {
  const [selectedPersona, setSelectedPersona] = useState('family');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [customText, setCustomText] = useState('');
  const [personalization, setPersonalization] = useState({
    name: '',
    relationship: ''
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const personas = [
    { id: 'family', title: 'Families & Friends', icon: Heart, color: 'text-red-500' },
    { id: 'law_enforcement', title: 'Law Enforcement', icon: Shield, color: 'text-blue-500' },
    { id: 'recovery', title: 'Recovery Orgs', icon: Users, color: 'text-green-500' }
  ];

  // Initialize with default template
  useEffect(() => {
    const templates = getTemplatesByPersona(selectedPersona);
    if (templates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(templates[0]);
    }
  }, [selectedPersona, selectedTemplate]);

  // Update parent component whenever form changes
  useEffect(() => {
    const currentTemplate = selectedTemplate || getTemplatesByPersona(selectedPersona)[0];
    
    onFormChange({
      persona: selectedPersona,
      template: currentTemplate,
      customText: customText || currentTemplate?.message || '',
      personalization,
      uploadedImage,
      isCustomizing: !!customText || !!personalization.name || !!uploadedImage
    });
  }, [selectedPersona, selectedTemplate, customText, personalization, uploadedImage, onFormChange]);

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

  const templates = getTemplatesByPersona(selectedPersona);
  const currentTemplate = selectedTemplate || templates[0];

  return (
    <div className="space-y-6">
      {/* Persona Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Choose Your Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {personas.map((persona) => {
              const IconComponent = persona.icon;
              return (
                <Button
                  key={persona.id}
                  variant={selectedPersona === persona.id ? "default" : "outline"}
                  onClick={() => {
                    setSelectedPersona(persona.id);
                    setSelectedTemplate(null); // Reset template when persona changes
                  }}
                  className="flex items-center justify-start gap-2 h-auto p-3"
                >
                  <IconComponent className={`w-4 h-4 ${persona.color}`} />
                  <span className="text-sm">{persona.title}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>



      {/* Custom Message */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Customize Your Message</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="custom-message">Your Message (optional)</Label>
            <Textarea
              id="custom-message"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder={currentTemplate?.message || "Enter your custom message..."}
              className="min-h-[100px] resize-none"
              maxLength={280}
            />
            <div className="text-xs text-muted-foreground text-right">
              {customText.length}/280 characters
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upload Your Photo (optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {uploadedImage ? (
                <div className="space-y-2">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded preview" 
                    className="w-24 h-24 mx-auto rounded object-cover"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUploadedImage(null)}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">
                    Click to upload your own image
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LivePostForm;
