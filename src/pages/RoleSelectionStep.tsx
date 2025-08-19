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
    <div className="min-h-screen bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700">
      <div className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <img 
              src="/lovable-uploads/368a6524-5175-45a5-ae1c-b08fdd48989f.png" 
              alt="Facing Fentanyl Logo" 
              className="h-20 mx-auto mb-4"
            />
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Make a post. Make an impact.
          </h1>
          
          {/* Tagline */}
          <p className="text-xl text-blue-200 mb-6">
            Choose your role and create your post in under 2 minutes
          </p>
          
          {/* Senate Badge */}
          <div className="mb-8">
            <a 
              href="https://www.congress.gov/bill/118th-congress/senate-resolution/323/text"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm bg-white/10 border border-white/20 rounded-lg px-4 py-3"
              aria-label="View Senate Resolution 323 on Congress.gov"
            >
              <Shield className="w-5 h-5" />
              <div>
                <p className="font-semibold">Recognized by Senate Resolution 323</p>
                <p className="text-xs opacity-80">Supporting National Fentanyl Awareness Day</p>
              </div>
            </a>
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


        {/* Enhanced Role Selection */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Choose Your Role</h3>
            <p className="text-blue-200">
              Select the role that best describes you to get personalized content
            </p>
          </div>
          <PersonaSelection onPersonaSelect={handlePersonaSelect} />
        </div>


        {/* Footer Navigation */}
        <div className="text-center pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/home" 
              className="text-sm text-blue-200 hover:text-white transition-colors"
            >
              Learn more about our mission
            </Link>
            <span className="hidden sm:inline text-blue-200">•</span>
            <Link 
              to="/privacy-policy"
              className="text-sm text-blue-200 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
          <p className="text-xs text-blue-200 mt-4">
            © 2024 Facing Fentanyl Now. Taking action together saves lives.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionStep;