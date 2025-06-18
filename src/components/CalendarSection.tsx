import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Plus } from "lucide-react";

const CalendarSection = () => {
  const eventDetails = {
    title: "Fentanyl Awareness Day – Post & Share",
    description: "Create your tribute or awareness post at facingfentanylnow.org/post",
    date: "20250821",
    time: "1200", // 12:00 PM
  };

  const generateGoogleCalendarUrl = () => {
    const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE";
    const params = new URLSearchParams({
      text: eventDetails.title,
      dates: `${eventDetails.date}T${eventDetails.time}00Z/${eventDetails.date}T${eventDetails.time}00Z`,
      details: eventDetails.description,
      sf: "true",
      output: "xml"
    });
    return `${baseUrl}&${params.toString()}`;
  };

  const generateAppleCalendarUrl = () => {
    const startDate = "2025-08-21T12:00:00";
    const endDate = "2025-08-21T13:00:00";
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Facing Fentanyl//EN
BEGIN:VEVENT
DTSTART:${startDate.replace(/[-:]/g, '').replace('T', 'T')}Z
DTEND:${endDate.replace(/[-:]/g, '').replace('T', 'T')}Z
SUMMARY:${eventDetails.title}
DESCRIPTION:${eventDetails.description}
END:VEVENT
END:VCALENDAR`;
    
    return `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
  };

  const handleGoogleCalendar = () => {
    window.open(generateGoogleCalendarUrl(), '_blank');
  };

  const handleAppleCalendar = () => {
    const link = document.createElement('a');
    link.href = generateAppleCalendarUrl();
    link.download = 'fentanyl-awareness-day.ics';
    link.click();
  };

  return (
    <section className="py-16">
      <Card className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm border-white/10 p-10 shadow-2xl">
        <div className="text-center mb-10">
          <Calendar className="w-16 h-16 text-blue-400 mx-auto mb-6" />
          <h3 className="text-3xl font-semibold text-white mb-4">
            Add to Calendar
          </h3>
          <p className="text-gray-300 text-lg">
            Set a reminder for National Fentanyl Awareness Day
          </p>
        </div>

        <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-6 mb-8">
          <h4 className="text-white font-semibold mb-2 text-lg">{eventDetails.title}</h4>
          <p className="text-blue-200 text-base mb-1">📅 August 21, 2025</p>
          <p className="text-gray-300 text-base">{eventDetails.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Button
            onClick={handleGoogleCalendar}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center gap-3 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5" />
            Google Calendar
          </Button>
          <Button
            onClick={handleAppleCalendar}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex items-center gap-3 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            <Plus className="w-5 h-5" />
            Apple Calendar
          </Button>
        </div>
      </Card>
    </section>
  );
};

export default CalendarSection;
