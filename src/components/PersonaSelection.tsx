
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrackedButton } from "@/components/TrackedButton";
import { Heart, Shield, Users } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PersonaSelectionProps {
  onPersonaSelect: (persona: string) => void;
}

const PersonaSelection = ({ onPersonaSelect }: PersonaSelectionProps) => {
  const isMobile = useIsMobile();
  
  const personas = [
    {
      id: 'family',
      title: 'Families & Friends',
      shortTitle: 'Family',
      description: 'Honor loved ones and share stories that save lives',
      icon: Heart,
      color: 'text-red-500'
    },
    {
      id: 'law_enforcement',
      title: 'Law Enforcement & Government',
      shortTitle: 'Law Enforcement',
      description: 'Educate communities and protect those you serve',
      icon: Shield,
      color: 'text-blue-500'
    },
    {
      id: 'recovery',
      title: 'Recovery Orgs',
      shortTitle: 'Recovery',
      description: 'Share hope and resources for healing',
      icon: Users,
      color: 'text-green-500'
    }
  ];

  if (isMobile) {
    return (
      <div className="px-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Choose Your Role</h3>
        <div className="space-y-3">
          {personas.map((persona) => {
            const IconComponent = persona.icon;
            return (
              <TrackedButton
                key={persona.id}
                onClick={() => onPersonaSelect(persona.id)}
                variant="outline"
                className="w-full h-auto p-4 flex items-start gap-3 text-left"
                trackingName={`persona_select_${persona.id}`}
                trackingCategory="persona_selection"
                trackingPage="day_of_experience"
                trackingData={{ personaId: persona.id, personaTitle: persona.title }}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <IconComponent className={`w-5 h-5 ${persona.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm leading-tight mb-1">{persona.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed break-words">{persona.description}</p>
                </div>
              </TrackedButton>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {personas.map((persona) => {
        const IconComponent = persona.icon;
        return (
          <Card key={persona.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4">
                <IconComponent className={`w-12 h-12 ${persona.color}`} />
              </div>
              <CardTitle className="text-lg">{persona.title}</CardTitle>
              <CardDescription>{persona.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <TrackedButton 
                onClick={() => onPersonaSelect(persona.id)}
                className="w-full"
                trackingName={`persona_select_${persona.id}`}
                trackingCategory="persona_selection"
                trackingPage="day_of_experience"
                trackingData={{ personaId: persona.id, personaTitle: persona.title }}
              >
                Create Post
              </TrackedButton>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PersonaSelection;
