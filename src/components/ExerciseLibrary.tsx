import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock, Flame, ChevronRight, Dumbbell, X, Play, Pause,
  RotateCcw, CheckCircle, Trophy, Zap, Timer, Star, PartyPopper
} from "lucide-react";

const categories = ["All", "Shoulder", "Knee", "Back", "Hip", "Neck", "Ankle"];

const exercises = [
  { id: 1, name: "Shoulder Flexion Stretch", category: "Shoulder", duration: "8 min", difficulty: "Easy", calories: 40, description: "Gentle overhead stretch to improve range of motion", steps: ["Stand tall with arms at sides", "Slowly raise both arms forward and overhead", "Hold for 15 seconds at the top", "Lower slowly and repeat 10 times"] },
  { id: 2, name: "Quad Strengthening", category: "Knee", duration: "12 min", difficulty: "Medium", calories: 80, description: "Targeted exercises to rebuild quadriceps strength", steps: ["Sit on a chair with feet flat", "Slowly extend one leg straight", "Hold for 5 seconds, squeeze quads", "Lower and repeat 12 times each leg"] },
  { id: 3, name: "Spinal Decompression", category: "Back", duration: "10 min", difficulty: "Easy", calories: 30, description: "Gentle traction exercises to relieve spinal pressure", steps: ["Lie on your back, knees bent", "Hug knees gently to chest", "Rock side to side slowly", "Hold 20 seconds, repeat 5 times"] },
  { id: 4, name: "Hip Flexor Release", category: "Hip", duration: "15 min", difficulty: "Medium", calories: 60, description: "Deep stretching to release tight hip flexors", steps: ["Kneel on one knee, other foot forward", "Push hips gently forward", "Hold stretch for 30 seconds", "Switch sides, repeat 3 times each"] },
  { id: 5, name: "Cervical Mobility", category: "Neck", duration: "6 min", difficulty: "Easy", calories: 20, description: "Gentle neck rotations and stretches for mobility", steps: ["Sit upright, shoulders relaxed", "Slowly turn head to right, hold 10s", "Return to center, then left", "Tilt ear to shoulder each side"] },
  { id: 6, name: "Ankle Stability Circuit", category: "Ankle", duration: "10 min", difficulty: "Hard", calories: 70, description: "Balance and strengthening exercises for ankle rehab", steps: ["Stand on one foot for 30 seconds", "Do 15 calf raises per leg", "Trace the alphabet with your toe", "Resistance band inversion/eversion"] },
];

const difficultyColor: Record<string, string> = {
  Easy: "bg-success/10 text-success",
  Medium: "bg-warning/10 text-warning",
  Hard: "bg-destructive/10 text-destructive",
};

type ScreenState = "exercises" | "session" | "complete";

const ExerciseLibrary = () => {
  const [active, setActive] = useState("All");
  const [activeExercise, setActiveExercise] = useState<typeof exercises[0] | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const [screen, setScreen] = useState<ScreenState>("exercises");
  const [confettiPieces, setConfettiPieces] = useState<Array<{ id: number; x: number; delay: number; color: string; size: number }>>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const filtered = active === "All" ? exercises : exercises.filter((e) => e.category === active);

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => setTimer((p) => p + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning]);

  const startExercise = (ex: typeof exercises[0]) => {
    setActiveExercise(ex);
    setCurrentStep(0);
    setIsRunning(false);
    setTimer(0);
    setScreen("session");
  };

  const completeExercise = () => {
    setIsRunning(false);
    setScreen("complete");
    // Generate confetti
    const colors = [
      "hsl(174, 72%, 40%)", "hsl(38, 92%, 50%)", "hsl(152, 60%, 42%)",
      "hsl(205, 85%, 55%)", "hsl(0, 84%, 60%)", "hsl(280, 65%, 60%)"
    ];
    setConfettiPieces(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
      }))
    );
  };

  const closeExercise = () => {
    setActiveExercise(null);
    setCurrentStep(0);
    setIsRunning(false);
    setTimer(0);
    setScreen("exercises");
    setConfettiPieces([]);
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const caloriesBurned = activeExercise
    ? Math.round((timer / 60) * (activeExercise.calories / parseInt(activeExercise.duration)))
    : 0;

  return (
    <section id="exercises" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 space-y-3">
          <Badge variant="outline" className="border-primary/30 text-primary font-medium px-4 py-1">
            <Dumbbell className="h-3 w-3 mr-1" /> Exercise Library
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
            Guided Rehabilitation Exercises
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            AI-curated exercise programs designed by physiotherapy experts for optimal recovery.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                active === cat
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Exercise cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ex, i) => (
            <div
              key={ex.id}
              className="group bg-card rounded-xl border border-border p-6 shadow-card hover:shadow-hover transition-all duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <Badge className={difficultyColor[ex.difficulty]}>{ex.difficulty}</Badge>
                <span className="text-xs text-muted-foreground">{ex.category}</span>
              </div>
              <h3 className="font-heading font-semibold text-lg text-card-foreground mb-2">{ex.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{ex.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{ex.duration}</span>
                <span className="flex items-center gap-1"><Flame className="h-3.5 w-3.5" />{ex.calories} cal</span>
              </div>
              <Button
                variant="outline"
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                onClick={() => startExercise(ex)}
              >
                Start Exercise <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Exercise Session Modal */}
      {activeExercise && screen === "session" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/70 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="bg-primary p-6 relative">
              <button
                onClick={closeExercise}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/30 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              <Badge className={`${difficultyColor[activeExercise.difficulty]} mb-3`}>{activeExercise.difficulty}</Badge>
              <h3 className="text-xl font-heading font-bold text-primary-foreground">{activeExercise.name}</h3>
              <p className="text-sm text-primary-foreground/70 mt-1">{activeExercise.category} · {activeExercise.duration}</p>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-center gap-6 py-6 border-b border-border">
              <div className="text-4xl font-mono font-bold text-card-foreground">{formatTime(timer)}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                </button>
                <button
                  onClick={() => { setTimer(0); setIsRunning(false); }}
                  className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground hover:bg-accent transition-colors"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Steps */}
            <div className="p-6 space-y-3 max-h-64 overflow-y-auto">
              <h4 className="font-heading font-semibold text-card-foreground text-sm mb-3">Exercise Steps</h4>
              {activeExercise.steps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all ${
                    i === currentStep
                      ? "bg-primary/10 border border-primary/30"
                      : i < currentStep
                      ? "bg-accent/50 opacity-60"
                      : "hover:bg-secondary"
                  }`}
                >
                  <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < currentStep
                      ? "bg-success text-success-foreground"
                      : i === currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {i < currentStep ? <CheckCircle className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className="text-sm text-card-foreground">{step}</span>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="p-6 pt-3 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                disabled={currentStep === 0}
                onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
              >
                Previous
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  if (currentStep < activeExercise.steps.length - 1) {
                    setCurrentStep((p) => p + 1);
                  } else {
                    completeExercise();
                  }
                }}
              >
                {currentStep === activeExercise.steps.length - 1 ? "Complete ✓" : "Next Step"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ===== COMPLETION SUMMARY SCREEN ===== */}
      {activeExercise && screen === "complete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/70 backdrop-blur-sm p-4">
          {/* Confetti */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confettiPieces.map((p) => (
              <div
                key={p.id}
                className="absolute animate-confetti-fall"
                style={{
                  left: `${p.x}%`,
                  animationDelay: `${p.delay}s`,
                  width: p.size,
                  height: p.size * 1.4,
                  backgroundColor: p.color,
                  borderRadius: p.size > 8 ? "50%" : "2px",
                  top: -20,
                }}
              />
            ))}
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md overflow-hidden animate-scale-in relative z-10">
            {/* Trophy header */}
            <div className="relative bg-gradient-to-br from-primary to-primary/80 p-8 text-center overflow-hidden">
              {/* Animated rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full border-2 border-primary-foreground/10 animate-ping-slow" />
                <div className="absolute w-56 h-56 rounded-full border border-primary-foreground/5 animate-ping-slower" />
              </div>

              <div className="relative">
                <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-primary-foreground/20 flex items-center justify-center animate-bounce-in">
                  <Trophy className="h-10 w-10 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-heading font-extrabold text-primary-foreground animate-slide-up-delay">
                  Congratulations! 🎉
                </h2>
                <p className="text-primary-foreground/70 text-sm mt-2 animate-slide-up-delay-2">
                  You completed <span className="font-semibold text-primary-foreground">{activeExercise.name}</span>
                </p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 rounded-xl bg-secondary animate-stat-pop" style={{ animationDelay: "0.3s" }}>
                  <div className="h-10 w-10 rounded-full bg-info/10 flex items-center justify-center mx-auto mb-2">
                    <Timer className="h-5 w-5 text-info" />
                  </div>
                  <div className="text-xl font-bold text-card-foreground font-mono">{formatTime(timer)}</div>
                  <div className="text-xs text-muted-foreground mt-1">Time Spent</div>
                </div>

                <div className="text-center p-4 rounded-xl bg-secondary animate-stat-pop" style={{ animationDelay: "0.5s" }}>
                  <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-2">
                    <Flame className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="text-xl font-bold text-card-foreground font-mono">{caloriesBurned}</div>
                  <div className="text-xs text-muted-foreground mt-1">Calories</div>
                </div>

                <div className="text-center p-4 rounded-xl bg-secondary animate-stat-pop" style={{ animationDelay: "0.7s" }}>
                  <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2">
                    <Zap className="h-5 w-5 text-success" />
                  </div>
                  <div className="text-xl font-bold text-card-foreground font-mono">{activeExercise.steps.length}/{activeExercise.steps.length}</div>
                  <div className="text-xs text-muted-foreground mt-1">Steps Done</div>
                </div>
              </div>

              {/* Rating stars */}
              <div className="text-center mb-6 animate-slide-up-delay-2">
                <p className="text-sm text-muted-foreground mb-2">Performance Rating</p>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 animate-star-pop ${star <= 4 ? "text-warning fill-warning" : "text-muted"}`}
                      style={{ animationDelay: `${0.8 + star * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>

              {/* Motivational message */}
              <div className="bg-accent/50 rounded-xl p-4 mb-6 text-center animate-fade-in" style={{ animationDelay: "1.5s", animationFillMode: "both" }}>
                <PartyPopper className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-accent-foreground">
                  "Every rep brings you closer to recovery. Keep going!"
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={closeExercise}>
                  Back to Library
                </Button>
                <Button className="flex-1" onClick={() => { startExercise(activeExercise); }}>
                  Repeat Exercise
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ExerciseLibrary;
