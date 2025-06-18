
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle } from "lucide-react";

const EmailSignup = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call - in production, this would connect to Mailchimp or Firebase
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Email signup:", email);
    setIsSubmitted(true);
    setIsLoading(false);
    
    toast({
      title: "Success!",
      description: "You're on the list. We'll remind you before August 21.",
    });
  };

  if (isSubmitted) {
    return (
      <section className="py-16">
        <Card className="max-w-md mx-auto bg-green-900/30 border-green-500/30 p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-white mb-2">You're on the list!</h3>
          <p className="text-green-200">
            We'll remind you before August 21.
          </p>
        </Card>
      </section>
    );
  }

  return (
    <section className="py-16">
      <Card className="max-w-md mx-auto bg-white/5 backdrop-blur-sm border-white/10 p-8">
        <div className="text-center mb-6">
          <Mail className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-white mb-2">
            Get Your Reminder
          </h3>
          <p className="text-gray-300">
            We'll send you a gentle reminder before National Fentanyl Awareness Day.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-400"
          />
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
            disabled={isLoading}
          >
            {isLoading ? "Adding you to the list..." : "Remind me to post on Awareness Day"}
          </Button>
        </form>
      </Card>
    </section>
  );
};

export default EmailSignup;
