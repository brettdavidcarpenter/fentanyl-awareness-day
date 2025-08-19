import { useNavigate, Link } from "react-router-dom";
import PersonaSelection from "@/components/PersonaSelection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Heart, Users, ArrowRight, TrendingUp, Globe } from "lucide-react";

const RoleSelectionStep = () => {
  const navigate = useNavigate();

  const handlePersonaSelect = (persona: string) => {
    navigate(`/day-of-experience/create?persona=${encodeURIComponent(persona)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          {/* Logo/Brand */}
          <div className="mb-6">
            <img 
              src="/lovable-uploads/02c9439c-bc1e-4d30-83a5-8ed0e49fab85.png" 
              alt="Facing Fentanyl Logo" 
              className="h-16 mx-auto mb-4"
            />
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Make a post. Make an impact.
          </h1>
          
          {/* Tagline */}
          <p className="text-xl text-muted-foreground mb-6">
            Taking action together saves lives
          </p>
          
          {/* Urgency Message */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
            <p className="text-primary font-semibold">
              Don't wait. Create your post today.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Ready to make a difference? Choose your role and create your post in under 2 minutes
            </p>
          </div>
        </div>

        {/* Crisis Context Section */}
        <div className="mb-12">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-6">
                <TrendingUp className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Every 7 Minutes</h3>
                <p className="text-sm text-muted-foreground">
                  Someone dies from a fentanyl overdose in America
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <Globe className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Leading Cause</h3>
                <p className="text-sm text-muted-foreground">
                  #1 cause of death for Americans aged 18-45
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <Heart className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Your Voice</h3>
                <p className="text-sm text-muted-foreground">
                  Can save lives through awareness and action
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Every voice matters. Every story saves lives.
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands taking action nationwide. Your post could be the one that saves a life.
          </p>
        </div>

        {/* Enhanced Role Selection */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-primary mb-2">Choose Your Role</h3>
            <p className="text-muted-foreground">
              Select the role that best describes you to get personalized content
            </p>
          </div>
          <PersonaSelection onPersonaSelect={handlePersonaSelect} />
        </div>

        {/* Senate Resolution Badge */}
        <div className="flex justify-center mb-8">
          <div className="bg-card border rounded-lg p-4 flex items-center gap-3 max-w-md">
            <Shield className="w-6 h-6 text-blue-600" />
            <div className="text-sm">
              <p className="font-semibold">Recognized by Senate Resolution 323</p>
              <p className="text-muted-foreground">Supporting National Fentanyl Awareness Day</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="text-center pt-8 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/home" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Learn more about our mission
            </Link>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <Link 
              to="/privacy-policy"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            © 2024 Facing Fentanyl Now. Taking action together saves lives.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionStep;