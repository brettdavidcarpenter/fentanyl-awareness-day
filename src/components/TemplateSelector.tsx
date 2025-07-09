
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrackedButton } from "@/components/TrackedButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { PostTemplate, getTemplatesByPersona } from '@/data/postTemplates';

interface TemplateSelectorProps {
  persona: string;
  onTemplateSelect: (template: PostTemplate, personalization?: any) => void;
  onCreateCustom: () => void;
  onBack: () => void;
}

const TemplateSelector = ({ persona, onTemplateSelect, onCreateCustom, onBack }: TemplateSelectorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<PostTemplate | null>(null);
  const [personalization, setPersonalization] = useState({
    name: '',
    relationship: ''
  });

  const templates = getTemplatesByPersona(persona);
  const personaTitle = persona === 'family' ? 'Families & Friends Posts' : 
                     persona === 'law_enforcement' ? 'Law Enforcement & Government Posts' : 
                     'Recovery Organization Posts';

  const handleTemplateClick = (template: PostTemplate) => {
    if (template.customizable) {
      setSelectedTemplate(template);
    } else {
      onTemplateSelect(template);
    }
  };

  const handleCustomizeSubmit = () => {
    if (selectedTemplate) {
      onTemplateSelect(selectedTemplate, personalization);
    }
  };

  if (selectedTemplate) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <TrackedButton 
            variant="outline" 
            onClick={() => setSelectedTemplate(null)}
            trackingName="template_back_to_list"
            trackingCategory="navigation"
            trackingPage="day_of_experience"
            trackingData={{ templateId: selectedTemplate.id, persona }}
          >
            ← Back to Templates
          </TrackedButton>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Personalize Your Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={personalization.name}
                onChange={(e) => setPersonalization(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter the name"
              />
            </div>
            
            <div>
              <Label htmlFor="relationship">Relationship (optional)</Label>
              <Input
                id="relationship"
                value={personalization.relationship}
                onChange={(e) => setPersonalization(prev => ({ ...prev, relationship: e.target.value }))}
                placeholder="e.g., son, daughter, brother, sister"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Preview:</h4>
              <p className="text-sm text-gray-700">
                {selectedTemplate.message
                  .replace('[Name]', personalization.name || '[Name]')
                  .replace('[relationship]', personalization.relationship || '[relationship]')}
              </p>
            </div>

            <div className="flex gap-2">
              <TrackedButton 
                onClick={handleCustomizeSubmit} 
                disabled={!personalization.name}
                trackingName={`template_customize_submit_${selectedTemplate.id}`}
                trackingCategory="template_customization"
                trackingPage="day_of_experience"
                trackingData={{ 
                  templateId: selectedTemplate.id, 
                  persona, 
                  hasName: !!personalization.name,
                  hasRelationship: !!personalization.relationship
                }}
              >
                Create Post
              </TrackedButton>
              <TrackedButton 
                variant="outline" 
                onClick={() => setSelectedTemplate(null)}
                trackingName="template_customize_cancel"
                trackingCategory="template_customization"
                trackingPage="day_of_experience"
                trackingData={{ templateId: selectedTemplate.id, persona }}
              >
                Cancel
              </TrackedButton>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <TrackedButton 
          variant="outline" 
          onClick={onBack}
          trackingName="template_back_to_persona"
          trackingCategory="navigation"
          trackingPage="day_of_experience"
          trackingData={{ persona }}
        >
          ← Back to Persona Selection
        </TrackedButton>
      </div>
      
      <h2 className="text-2xl font-bold text-center mb-8 text-white">{personaTitle}</h2>
      
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Template cards */}
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <img 
                src={template.imagePath} 
                alt={template.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <CardTitle className="text-lg">{template.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {template.message}
              </p>
              <TrackedButton 
                onClick={() => handleTemplateClick(template)}
                className="w-full"
                trackingName={`template_select_${template.id}`}
                trackingCategory="template_selection"
                trackingPage="day_of_experience"
                trackingData={{ 
                  templateId: template.id, 
                  persona, 
                  customizable: template.customizable,
                  templateTitle: template.title
                }}
              >
                {template.customizable ? 'Customize' : 'Use Template'}
              </TrackedButton>
            </CardContent>
          </Card>
        ))}
        
        {/* Create Your Own card */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg mb-4 flex items-center justify-center">
              <Upload className="w-12 h-12 text-blue-500" />
            </div>
            <CardTitle className="text-lg">Create Your Own</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Upload your own image and write a custom message
            </p>
            <TrackedButton 
              onClick={onCreateCustom}
              className="w-full"
              variant="outline"
              trackingName="create_custom_post"
              trackingCategory="custom_creation"
              trackingPage="day_of_experience"
              trackingData={{ persona }}
            >
              Start Creating
            </TrackedButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TemplateSelector;
