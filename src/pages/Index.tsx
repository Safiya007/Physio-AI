import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ExerciseLibrary from "@/components/ExerciseLibrary";
import VideoShowcase from "@/components/VideoShowcase";
import QuotesSection from "@/components/QuotesSection";
import BodyMapSection from "@/components/BodyMapSection";
import AIAssistant from "@/components/AIAssistant";
import PostureTracker from "@/components/PostureTracker";
import ProgressDashboard from "@/components/ProgressDashboard";
import TiersShowcase from "@/components/TiersShowcase";
import Footer from "@/components/Footer";
import { ScrollReveal } from "@/hooks/useScrollReveal";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />

      <ScrollReveal>
        <VideoShowcase />
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <QuotesSection />
      </ScrollReveal>

      <ScrollReveal>
        <ExerciseLibrary />
      </ScrollReveal>

      <ScrollReveal direction="left">
        <BodyMapSection />
      </ScrollReveal>

      <ScrollReveal direction="scale">
        <PostureTracker />
      </ScrollReveal>

      <ScrollReveal direction="right">
        <AIAssistant />
      </ScrollReveal>

      <ScrollReveal>
        <ProgressDashboard />
      </ScrollReveal>

      <ScrollReveal direction="scale">
        <TiersShowcase />
      </ScrollReveal>

      <Footer />
    </div>
  );
};

export default Index;
