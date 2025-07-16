import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import LivePostForm from "@/components/LivePostForm";
import { getTemplatesByPersona } from "@/data/postTemplates";

const PostCreatorStep = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const persona = searchParams.get("persona");
  
  const [formData, setFormData] = useState(() => {
    if (!persona) return {};
    
    const templates = getTemplatesByPersona(persona);
    return {
      persona,
      template: templates[0],
      customText: '',
      personalization: { name: '', relationship: '' },
      uploadedImage: null
    };
  });

  useEffect(() => {
    if (!persona) {
      navigate('/day-of-experience');
    }
  }, [persona, navigate]);

  const handleFormChange = useCallback((newData: any) => {
    setFormData(newData);
  }, []);

  const handleGenerate = () => {
    // Pass form data via URL params for the result page
    const params = new URLSearchParams({
      persona: formData.persona || '',
      templateId: formData.template?.id || '',
      customText: formData.customText || '',
      personalizationName: formData.personalization?.name || '',
      personalizationRelationship: formData.personalization?.relationship || '',
    });
    
    if (formData.uploadedImage) {
      params.set('hasImage', 'true');
      // Store image in sessionStorage for the result page
      sessionStorage.setItem('postImage', formData.uploadedImage);
    }
    
    navigate(`/day-of-experience/result?${params.toString()}`);
  };

  if (!persona) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/day-of-experience")}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-primary">Create Your Post</h1>
            <p className="text-sm text-muted-foreground">Step 2 of 3: Customize your content</p>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-md mx-auto space-y-6">
          <LivePostForm
            onFormChange={handleFormChange}
            initialData={formData}
            showOnlyCustomization={true}
          />
          
          <Button 
            onClick={handleGenerate}
            className="w-full"
            size="lg"
          >
            Generate Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostCreatorStep;