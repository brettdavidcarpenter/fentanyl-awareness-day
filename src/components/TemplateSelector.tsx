
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PostTemplate, getTemplatesByPersona } from '@/data/postTemplates';

interface TemplateSelectorProps {
  persona: string;
  onTemplateSelect: (template: PostTemplate, personalization?: any) => void;
  onBack: () => void;
}

const TemplateSelector = ({ persona, onTemplateSelect, onBack }: TemplateSelectorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<PostTemplate | null>(null);
  const [personalization, setPersonalization] = useState({
    name: '',
    relationship: ''
  });

  const templates = getTemplatesByPersona(persona);
  const personaTitle = persona === 'family' ? 'Family Posts' : 
                     persona === 'law_enforcement' ? 'Law Enforcement Posts' : 
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
          <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
            ← Back to Templates
          </Button>
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
              <Button onClick={handleCustomizeSubmit} disabled={!personalization.name}>
                Create Post
              </Button>
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Button variant="outline" onClick={onBack}>
          ← Back to Persona Selection
        </Button>
      </div>
      
      <h2 className="text-2xl font-bold text-center mb-8 text-white">{personaTitle}</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
              <Button 
                onClick={() => handleTemplateClick(template)}
                className="w-full"
              >
                {template.customizable ? 'Customize' : 'Use Template'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
