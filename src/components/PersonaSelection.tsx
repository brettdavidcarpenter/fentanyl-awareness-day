
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Users } from "lucide-react";

interface PersonaSelectionProps {
  onPersonaSelect: (persona: string) => void;
}

const PersonaSelection = ({ onPersonaSelect }: PersonaSelectionProps) => {
  const personas = [
    {
      id: 'family',
      title: 'Families & Friends',
      description: 'Honor loved ones and share stories that save lives',
      icon: Heart,
      color: 'text-red-500'
    },
    {
      id: 'law_enforcement',
      title: 'Law Enforcement & Government',
      description: 'Educate communities and protect those you serve',
      icon: Shield,
      color: 'text-blue-500'
    },
    {
      id: 'recovery',
      title: 'Recovery Orgs',
      description: 'Share hope and resources for healing',
      icon: Users,
      color: 'text-green-500'
    }
  ];

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
              <Button 
                onClick={() => onPersonaSelect(persona.id)}
                className="w-full"
              >
                Create Post
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PersonaSelection;
