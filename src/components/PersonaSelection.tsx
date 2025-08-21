
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
      title: 'For Families & Friends',
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
                className="w-full h-auto p-4 flex items-start gap-3 text-left whitespace-normal overflow-hidden"
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
    <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
      {personas.map((persona) => {
        const IconComponent = persona.icon;
        return (
          <Card key={persona.id} className="hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer bg-white/95 border-2 hover:border-blue-300">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-br from-slate-100 to-slate-200">
                <IconComponent className={`w-8 h-8 ${persona.color}`} />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 mb-2">{persona.title}</CardTitle>
              <CardDescription className="text-slate-600 text-base leading-relaxed">{persona.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <TrackedButton 
                onClick={() => onPersonaSelect(persona.id)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 text-base shadow-lg hover:shadow-xl transition-all"
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
