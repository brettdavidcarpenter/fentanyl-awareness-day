
import { Heart, Clock } from "lucide-react";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2025-08-21T00:00:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="text-center py-12 md:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Hero Call to Action - Now at the top */}
        <div className="bg-black/20 backdrop-blur-sm border border-white/20 rounded-2xl p-8 md:p-12 max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Make a post.<br />
            <span className="text-blue-200">Make an impact.</span>
          </h1>
          
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Spreading awareness can save lives
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <p className="text-white font-semibold text-lg">
              Remind me to post on Awareness Day
            </p>
          </div>
        </div>

        {/* Event branding */}
        <div className="mb-12">
          <div className="mb-8">
            <img 
              src="/lovable-uploads/a233bab7-5c2f-40e2-9d21-e61551abee33.png" 
              alt="Facing Fentanyl Logo" 
              className="mx-auto h-24 md:h-32 object-contain"
            />
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            National Fentanyl<br />
            Prevention &<br />
            <span className="text-blue-300">Awareness Day</span>
          </h2>
          
          <div className="text-xl md:text-2xl text-blue-200 font-semibold mb-4">
            AUGUST 21, 2025
          </div>
        </div>

        {/* Black and white photo collage */}
        <div className="mb-12 opacity-60">
          <img 
            src="/lovable-uploads/c3845ee9-b4b7-4a9a-946b-adeb1c279481.png" 
            alt="Facing Fentanyl NYC Event Photos" 
            className="mx-auto max-w-full h-auto rounded-lg"
          />
        </div>

        {/* Countdown */}
        <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-12 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Clock className="w-6 h-6 text-blue-300" />
            <h3 className="text-xl font-semibold text-white">Countdown to Awareness Day</h3>
          </div>
          
          <div className="grid grid-cols-4 gap-4 md:gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-blue-300">{timeLeft.days}</div>
              <div className="text-gray-300 text-sm md:text-base">DAYS</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-blue-300">{timeLeft.hours}</div>
              <div className="text-gray-300 text-sm md:text-base">HOURS</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-blue-300">{timeLeft.minutes}</div>
              <div className="text-gray-300 text-sm md:text-base">MINUTES</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-blue-300">{timeLeft.seconds}</div>
              <div className="text-gray-300 text-sm md:text-base">SECONDS</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
