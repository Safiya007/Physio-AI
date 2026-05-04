import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Quote, ChevronLeft, ChevronRight, Heart } from "lucide-react";

const quotes = [
  {
    text: "The human body is the best picture of the human soul.",
    author: "Ludwig Wittgenstein",
    role: "Philosopher",
  },
  {
    text: "Healing is a matter of time, but it is sometimes also a matter of opportunity.",
    author: "Hippocrates",
    role: "Father of Medicine",
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn",
    role: "Motivational Speaker",
  },
  {
    text: "Movement is a medicine for creating change in a person's physical, emotional, and mental states.",
    author: "Carol Welch",
    role: "Movement Therapist",
  },
  {
    text: "The greatest wealth is health.",
    author: "Virgil",
    role: "Roman Poet",
  },
  {
    text: "Recovery is not a race. You don't have to feel guilty if it takes you longer than you thought.",
    author: "Anonymous",
    role: "Wellness Wisdom",
  },
];

const QuotesSection = () => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const navigate = (dir: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((prev) => (prev + dir + quotes.length) % quotes.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  useEffect(() => {
    const timer = setInterval(() => navigate(1), 6000);
    return () => clearInterval(timer);
  }, [isAnimating]);

  const quote = quotes[current];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12 space-y-3">
          <Badge variant="outline" className="border-primary/30 text-primary font-medium px-4 py-1">
            <Heart className="h-3 w-3 mr-1" /> Inspiration
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
            Words That Heal
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Quote card */}
          <div className="relative bg-card rounded-2xl border border-border p-10 sm:p-14 shadow-card text-center">
            {/* Big decorative quote mark */}
            <Quote className="h-16 w-16 text-primary/10 mx-auto mb-6" />

            <div key={current} className="animate-fade-in">
              <blockquote className="text-xl sm:text-2xl font-heading font-semibold text-card-foreground leading-relaxed mb-8">
                "{quote.text}"
              </blockquote>

              <div className="flex items-center justify-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {quote.author.charAt(0)}
                  </span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-card-foreground text-sm">{quote.author}</div>
                  <div className="text-xs text-muted-foreground">{quote.role}</div>
                </div>
              </div>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={() => navigate(-1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-secondary hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Previous quote"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate(1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-secondary hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Next quote"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {quotes.map((_, i) => (
              <button
                key={i}
                onClick={() => { setIsAnimating(true); setCurrent(i); setTimeout(() => setIsAnimating(false), 600); }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/30"
                }`}
                aria-label={`Go to quote ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuotesSection;
