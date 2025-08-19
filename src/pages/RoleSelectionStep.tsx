import { useNavigate } from "react-router-dom";
import PersonaSelection from "@/components/PersonaSelection";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const RoleSelectionStep = () => {
  const navigate = useNavigate();

  const handlePersonaSelect = (persona: string) => {
    navigate(`/day-of-experience/create?persona=${encodeURIComponent(persona)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-primary">Create Your Post</h1>
            <p className="text-sm text-muted-foreground">Step 1 of 3: Choose your role</p>
          </div>
        </div>

        {/* Persona Selection */}
        <PersonaSelection onPersonaSelect={handlePersonaSelect} />
      </div>
    </div>
  );
};

export default RoleSelectionStep;