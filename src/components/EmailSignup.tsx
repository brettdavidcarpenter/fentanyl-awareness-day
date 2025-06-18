
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle, Bell, Heart } from "lucide-react";

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
        <Card className="max-w-lg mx-auto bg-green-900/20 border-green-400/30 p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">You're on the list!</h3>
          <p className="text-green-200 text-lg">
            We'll remind you before August 21, 2025
          </p>
        </Card>
      </section>
    );
  }

  return (
    <section className="py-16">
      <Card className="max-w-2xl mx-auto bg-black/20 backdrop-blur-sm border-white/20 p-8 md:p-12">
        {/* Combined messaging section */}
        <div className="text-center mb-8">
          <Heart className="w-16 h-16 text-blue-300 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Spread awareness.<br />
            <span className="text-blue-200">Save lives.</span>
          </h2>
          
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Join the movement. Help raise awareness about fentanyl.
          </p>
        </div>

        {/* Reminder signup section */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8">
          <div className="text-center mb-6">
            <Bell className="w-12 h-12 text-blue-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              Get Your Reminder
            </h3>
            <p className="text-gray-200 text-lg">
              We'll send you a gentle reminder before<br />
              National Fentanyl Awareness Day
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder-gray-300 focus:border-blue-300 h-14 text-lg"
            />
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-lg rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? "Adding you to the list..." : "Remind me to post on Awareness Day"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white font-semibold text-lg">
              Together we can save lives
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default EmailSignup;
