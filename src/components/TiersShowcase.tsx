import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Brain, Activity, Sparkles, TrendingUp,
  Shield, FileText, BookOpen, AlertTriangle,
  Heart, Bell, LineChart, Mic,
  Network, Users, Layers, Stethoscope,
  WifiOff, Languages, Gauge, Accessibility,
  ChevronRight, Trophy,
} from "lucide-react";

type Feature = {
  n: number;
  title: string;
  bullets: string[];
  why: string;
  icon: React.ComponentType<{ className?: string }>;
};

type Tier = {
  id: string;
  level: string;
  name: string;
  tagline: string;
  accent: string; // tailwind gradient classes
  ring: string;
  features: Feature[];
};

const TIERS: Tier[] = [
  {
    id: "tier-1",
    level: "Tier 1",
    name: "Core Intelligence",
    tagline: "The brain of the app",
    accent: "from-primary/20 via-primary/5 to-transparent",
    ring: "ring-primary/30",
    features: [
      {
        n: 1, icon: Brain, title: "Adaptive Pain Intelligence",
        bullets: [
          "Real-time pain level monitoring",
          "Auto-adjusts exercise intensity instantly",
          "Detects pain spikes and halts progression",
          "Learns pain patterns over time",
        ],
        why: "Pain is not static. Plans that ignore fluctuation cause reinjury — most apps ignore this completely.",
      },
      {
        n: 2, icon: Activity, title: "Biomechanical Movement Analysis",
        bullets: [
          "AI pose estimation (MediaPipe / MoveNet)",
          "Joint angle calculation in real time",
          "Deviation detection from ideal form",
          "Compensatory movement pattern recognition",
        ],
        why: "90% of reinjuries come from unconscious compensations. No consumer app catches this.",
      },
      {
        n: 3, icon: Sparkles, title: "Personalized Recovery Algorithm",
        bullets: [
          "Condition-specific protocol libraries",
          "Progressive overload calculation",
          "Plateau detection and plan adjustment",
          "Individual recovery rate modeling",
        ],
        why: "Every body heals differently. Static plans plateau. Dynamic algorithms keep recovery moving.",
      },
      {
        n: 4, icon: TrendingUp, title: "Predictive Recovery Modeling",
        bullets: [
          "ML model trained on recovery datasets",
          "Predicts recovery timeline from inputs",
          "Flags users at risk of non-compliance",
          "Forecasts setback probability",
        ],
        why: "Anticipating problems before they happen separates AI from advice.",
      },
    ],
  },
  {
    id: "tier-2",
    level: "Tier 2",
    name: "Clinical Accuracy",
    tagline: "What makes it medically trustworthy",
    accent: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    ring: "ring-emerald-500/30",
    features: [
      {
        n: 5, icon: BookOpen, title: "Condition-Specific Protocol Engine",
        bullets: [
          "Evidence-based exercise libraries",
          "Protocols for 50+ conditions",
          "ACL, rotator cuff, frozen shoulder, herniated disc, post-surgical, stroke",
          "Sourced from clinical guidelines",
        ],
        why: "Generic exercises aren't just ineffective — they can be dangerous for specific conditions.",
      },
      {
        n: 6, icon: AlertTriangle, title: "Contraindication Detection",
        bullets: [
          "Auto-flags dangerous exercises by condition",
          "Blocks movements that could worsen injury",
          "Alerts when pain pattern needs medical attention",
        ],
        why: "An AI that knows what NOT to prescribe is more valuable than one that endlessly generates.",
      },
      {
        n: 7, icon: FileText, title: "Clinical Documentation Engine",
        bullets: [
          "Auto-generated SOAP notes",
          "Session compliance reports",
          "Progress graphs for therapist review",
          "Exportable PDF reports",
        ],
        why: "Bridges home exercise with clinical care — useful to patients AND professionals.",
      },
      {
        n: 8, icon: Shield, title: "Evidence-Based Exercise Database",
        bullets: [
          "Every exercise linked to clinical research",
          "Dosage recommendations from literature",
          "Outcome tools: VAS, DASH, KOOS, WOMAC",
        ],
        why: "Top 1% apps don't guess — they cite evidence. That's how trust is built.",
      },
    ],
  },
  {
    id: "tier-3",
    level: "Tier 3",
    name: "Human Connection",
    tagline: "What makes users come back",
    accent: "from-pink-500/20 via-pink-500/5 to-transparent",
    ring: "ring-pink-500/30",
    features: [
      {
        n: 9, icon: Heart, title: "Emotional Intelligence Engine",
        bullets: [
          "Detects frustration from slow progress",
          "Adjusts tone based on mood",
          "Celebrates micro-wins automatically",
          "Personalized motivation at the right moment",
        ],
        why: "Recovery dropout is over 65%. Emotional connection is the single biggest predictor of completion.",
      },
      {
        n: 10, icon: Bell, title: "Behavioral Nudge System",
        bullets: [
          "Smart reminders based on user patterns",
          "Streak tracking + loss aversion triggers",
          "Social accountability features",
          "Habit stacking recommendations",
        ],
        why: "Knowing what to do and actually doing it are different problems. Behavioral science closes the gap.",
      },
      {
        n: 11, icon: LineChart, title: "Progress Visualization",
        bullets: [
          "Body maps showing improvement areas",
          "Before/after range-of-motion comparisons",
          "Recovery timeline with milestones",
          "Shareable progress cards",
        ],
        why: "Humans need to SEE progress to believe in it. Invisible progress kills motivation faster than pain.",
      },
      {
        n: 12, icon: Mic, title: "Voice Coaching System",
        bullets: [
          "Real-time audio cues during exercise",
          "Hands-free operation",
          "Tone shifts with detected effort",
          "Multilingual support",
        ],
        why: "You can't read instructions while exercising. Voice coaching removes friction completely.",
      },
    ],
  },
  {
    id: "tier-4",
    level: "Tier 4",
    name: "Advanced Intelligence",
    tagline: "Top 1% territory",
    accent: "from-violet-500/20 via-violet-500/5 to-transparent",
    ring: "ring-violet-500/30",
    features: [
      {
        n: 13, icon: Network, title: "Federated Learning Model",
        bullets: [
          "Learns from all users collectively",
          "Privacy preserved — data stays on device",
          "Recovery patterns improve with scale",
          "Rare condition insights emerge over time",
        ],
        why: "Most AI apps are static. This one gets smarter with every user.",
      },
      {
        n: 14, icon: Users, title: "Digital Twin Technology",
        bullets: [
          "Virtual physical model of the user",
          "Simulates outcomes before prescribing",
          "Predicts which protocol will work best",
          "Updates as user progresses",
        ],
        why: "Instead of trial and error on a real body — simulate first, prescribe with confidence.",
      },
      {
        n: 15, icon: Layers, title: "Multimodal Input Processing",
        bullets: [
          "Text, voice, image, and video input",
          "Analyzes user-uploaded exercise videos",
          "Reads wearable device data",
          "Apple Health & Google Fit integration",
        ],
        why: "Real life is multimodal. Text-only apps miss 80% of available data.",
      },
      {
        n: 16, icon: Stethoscope, title: "Therapist Collaboration Portal",
        bullets: [
          "Therapist dashboard with patient overview",
          "Remote program modification",
          "Secure patient–therapist messaging",
          "Outcome tracking across cohorts",
        ],
        why: "AI should augment therapists, not replace them — make professionals more powerful.",
      },
    ],
  },
  {
    id: "tier-5",
    level: "Tier 5",
    name: "Accessibility & Scale",
    tagline: "What makes it impact millions",
    accent: "from-amber-500/20 via-amber-500/5 to-transparent",
    ring: "ring-amber-500/30",
    features: [
      {
        n: 17, icon: WifiOff, title: "Offline-First Architecture",
        bullets: [
          "Full functionality without internet",
          "Syncs when connection restored",
          "Critical for rural and low-income users",
        ],
        why: "Healthcare access shouldn't depend on bandwidth.",
      },
      {
        n: 18, icon: Languages, title: "Multilingual NLP Engine",
        bullets: [
          "Native support in 20+ languages",
          "Cultural adaptation of exercises",
          "Local medical terminology",
        ],
        why: "Global recovery requires global language support.",
      },
      {
        n: 19, icon: Gauge, title: "Low-Bandwidth Mode",
        bullets: [
          "Optimized for slow connections",
          "Compressed video instructions",
          "Text-first fallback for all features",
        ],
        why: "Performance is a feature — not a luxury.",
      },
      {
        n: 20, icon: Accessibility, title: "Accessibility Compliance",
        bullets: [
          "Screen reader compatible",
          "High contrast mode",
          "Voice-only navigation",
          "Elderly-friendly interface option",
        ],
        why: "If it isn't accessible, it isn't world-class.",
      },
    ],
  },
];

const LEVELS = [
  { level: "Level 1", name: "Good", desc: "Has exercises and tracking" },
  { level: "Level 2", name: "Great", desc: "Personalizes based on inputs" },
  { level: "Level 3", name: "Excellent", desc: "Adapts in real time to user response" },
  { level: "Level 4", name: "World-Class", desc: "Predicts problems, connects clinical care, emotionally engages, and gets smarter with every user" },
];

const TiersShowcase = () => {
  const [activeTier, setActiveTier] = useState<string>(TIERS[0].id);
  const [openFeature, setOpenFeature] = useState<number | null>(null);
  const tier = TIERS.find((t) => t.id === activeTier)!;

  return (
    <section id="tiers" className="py-24 bg-background relative overflow-hidden">
      {/* ambient backdrop */}
      <div className={`absolute inset-0 bg-gradient-to-b ${tier.accent} pointer-events-none transition-all duration-700`} />

      <div className="container mx-auto px-6 relative">
        <div className="text-center mb-12 space-y-3">
          <Badge variant="outline" className="border-primary/30 text-primary font-medium px-4 py-1">
            <Trophy className="h-3 w-3 mr-1" /> The Top 1% Framework
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold font-heading text-foreground">
            Five tiers. Twenty features. <br className="hidden sm:block" />
            <span className="text-primary">One world-class platform.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Most rehab apps stop at exercises and tracking. PhysioAI is engineered across five intelligence layers
            — from real-time pain adaptation to therapist collaboration.
          </p>
        </div>

        {/* Tier tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TIERS.map((t) => (
            <button
              key={t.id}
              onClick={() => { setActiveTier(t.id); setOpenFeature(null); }}
              className={`group relative rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                t.id === activeTier
                  ? `bg-foreground text-background border-foreground shadow-lg`
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
              }`}
            >
              <span className="opacity-60 mr-1">{t.level}</span> {t.name}
            </button>
          ))}
        </div>

        {/* Active tier header */}
        <div className="max-w-2xl mx-auto text-center mb-8 animate-fade-in" key={tier.id}>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{tier.level}</div>
          <h3 className="text-2xl sm:text-3xl font-bold font-heading text-foreground">{tier.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{tier.tagline}</p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
          {tier.features.map((f) => {
            const isOpen = openFeature === f.n;
            const Icon = f.icon;
            return (
              <button
                key={f.n}
                onClick={() => setOpenFeature(isOpen ? null : f.n)}
                className={`group text-left bg-card rounded-2xl border border-border p-6 shadow-card transition-all duration-300 hover:shadow-hover hover:-translate-y-0.5 ring-1 ring-transparent hover:${tier.ring} ${
                  isOpen ? `ring-2 ${tier.ring}` : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br ${tier.accent} flex items-center justify-center border border-border`}>
                    <Icon className="h-6 w-6 text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-mono text-muted-foreground">#{String(f.n).padStart(2, "0")}</div>
                      <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`} />
                    </div>
                    <h4 className="font-heading font-semibold text-card-foreground text-lg mt-1">{f.title}</h4>

                    <ul className="mt-3 space-y-1.5">
                      {f.bullets.map((b) => (
                        <li key={b} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-primary mt-1">—</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    <div
                      className={`grid transition-all duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="rounded-lg bg-secondary/60 border border-border p-3">
                          <div className="text-[10px] uppercase tracking-wider text-primary font-bold mb-1">
                            Why it matters
                          </div>
                          <p className="text-sm text-secondary-foreground leading-relaxed">{f.why}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* The framework ladder */}
        <div className="max-w-4xl mx-auto mt-20">
          <div className="text-center mb-8">
            <Badge variant="outline" className="border-primary/30 text-primary font-medium px-4 py-1">
              <Trophy className="h-3 w-3 mr-1" /> The Framework
            </Badge>
            <h3 className="text-2xl sm:text-3xl font-bold font-heading text-foreground mt-3">
              PhysioAI lives at <span className="text-primary">Level 4</span>
            </h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {LEVELS.map((l, i) => {
              const isTop = i === LEVELS.length - 1;
              return (
                <div
                  key={l.level}
                  className={`relative rounded-2xl p-5 border transition-all ${
                    isTop
                      ? "bg-foreground text-background border-foreground shadow-xl scale-[1.03]"
                      : "bg-card border-border text-card-foreground"
                  }`}
                >
                  <div className={`text-xs font-mono ${isTop ? "text-background/60" : "text-muted-foreground"}`}>
                    {l.level}
                  </div>
                  <div className="font-heading font-bold text-xl mt-1">{l.name}</div>
                  <p className={`text-sm mt-2 leading-snug ${isTop ? "text-background/80" : "text-muted-foreground"}`}>
                    {l.desc}
                  </p>
                  {isTop && (
                    <div className="absolute -top-3 right-4 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
                      You are here
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TiersShowcase;
