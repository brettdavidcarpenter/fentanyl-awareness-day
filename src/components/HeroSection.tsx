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
        {/* Main branding */}
        <div className="mb-12">
          <div className="mb-8">
            <img 
              src="/lovable-uploads/02c9439c-bc1e-4d30-83a5-8ed0e49fab85.png" 
              alt="Facing Fentanyl Logo" 
              className="mx-auto h-24 md:h-32 object-contain"
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
            National Fentanyl<br />
            Prevention &<br />
            <span className="text-blue-400">Awareness Day</span>
          </h1>
          
          <div className="text-2xl md:text-3xl text-blue-300 font-semibold mb-4">
            AUGUST 21, 2025
          </div>
        </div>

        {/* Countdown */}
        <div className="bg-black/40 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 mb-12 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Clock className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Countdown to Awareness Day</h2>
          </div>
          
          <div className="grid grid-cols-4 gap-4 md:gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-blue-400">{timeLeft.days}</div>
              <div className="text-gray-300 text-sm md:text-base">DAYS</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-blue-400">{timeLeft.hours}</div>
              <div className="text-gray-300 text-sm md:text-base">HOURS</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-blue-400">{timeLeft.minutes}</div>
              <div className="text-gray-300 text-sm md:text-base">MINUTES</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-blue-400">{timeLeft.seconds}</div>
              <div className="text-gray-300 text-sm md:text-base">SECONDS</div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 md:p-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Spread awareness.<br />
            <span className="text-blue-400">Save lives.</span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Join the movement. Help raise awareness about fentanyl.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <p className="text-white font-semibold text-lg">
              Together we can save lives
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
