
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import DayOfExperience from "./pages/DayOfExperience";
import RoleSelectionStep from "./pages/RoleSelectionStep";
import PostCreatorStep from "./pages/PostCreatorStep";
import PostResultStep from "./pages/PostResultStep";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import RedirectToExperience from "./components/RedirectToExperience";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Analytics />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RedirectToExperience />} />
          <Route path="/home" element={<Index />} />
          <Route path="/day-of-experience" element={<RoleSelectionStep />} />
          <Route path="/day-of-experience/desktop" element={<DayOfExperience />} />
          <Route path="/day-of-experience/create" element={<PostCreatorStep />} />
          <Route path="/day-of-experience/result" element={<PostResultStep />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
