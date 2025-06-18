
import { Clock } from "lucide-react";
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
        {/* New comprehensive event poster */}
        <div className="mb-12">
          <img 
            src="/lovable-uploads/5c694cf5-3f3a-4dab-b1cf-8db6206ebe8a.png" 
            alt="National Fentanyl Prevention & Awareness Day - Times Square Event" 
            className="mx-auto max-w-full h-auto rounded-lg shadow-2xl"
          />
        </div>

        {/* Countdown */}
        <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-12 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Clock className="w-6 h-6 text-blue-300" />
            <h2 className="text-xl font-semibold text-white">Countdown to Awareness Day</h2>
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
