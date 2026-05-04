import { Button } from "@/components/ui/button";
import { Play, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-physio.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-hero">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="AI-powered physiotherapy rehabilitation"
          className="w-full h-full object-cover opacity-30"
          width={1920}
          height={1024}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/70 to-transparent" />
      </div>

      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />

      <div className="container relative z-10 mx-auto px-6 py-20">
        <div className="max-w-2xl space-y-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary-foreground/80">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium">AI-Powered Rehabilitation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-primary-foreground">
            Your Personal
            <span className="block text-gradient-primary">Physio Simulator</span>
          </h1>

          <p className="text-lg text-primary-foreground/70 max-w-lg leading-relaxed">
            Experience VR-guided exercises with real-time AI feedback. Recover faster with personalized rehabilitation programs tailored to your needs.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button variant="hero" size="lg" className="rounded-full px-8 text-base" asChild>
              <a href="#exercises">Start Rehabilitation</a>
            </Button>
            <Button variant="heroOutline" size="lg" className="rounded-full px-8 text-base text-primary-foreground/80 border-primary-foreground/20 hover:bg-primary-foreground/10" asChild>
              <a href="#videos"><Play className="h-4 w-4 mr-1" /> Watch Demo</a>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-4">
            {[
              { value: "10K+", label: "Patients Helped" },
              { value: "95%", label: "Recovery Rate" },
              { value: "50+", label: "Exercise Programs" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-primary-foreground">{stat.value}</div>
                <div className="text-sm text-primary-foreground/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
