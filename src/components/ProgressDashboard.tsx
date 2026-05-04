import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Calendar, Target, Award, Activity } from "lucide-react";

const weeklyData = [
  { day: "Mon", completed: 3, height: "60%" },
  { day: "Tue", completed: 5, height: "100%" },
  { day: "Wed", completed: 2, height: "40%" },
  { day: "Thu", completed: 4, height: "80%" },
  { day: "Fri", completed: 3, height: "60%" },
  { day: "Sat", completed: 1, height: "20%" },
  { day: "Sun", completed: 0, height: "4%" },
];

const milestones = [
  { label: "Range of Motion", progress: 78, target: "90°", icon: Target },
  { label: "Strength Level", progress: 62, target: "Level 5", icon: TrendingUp },
  { label: "Pain Reduction", progress: 85, target: "Minimal", icon: Award },
];

const ProgressDashboard = () => {
  return (
    <section id="progress" className="py-24 bg-secondary/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 space-y-3">
          <Badge variant="outline" className="border-primary/30 text-primary font-medium px-4 py-1">
            <Activity className="h-3 w-3 mr-1" /> Progress Tracking
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
            Your Recovery Journey
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Track your rehabilitation progress with detailed metrics and visual insights.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 max-w-5xl mx-auto">
          {/* Stats cards */}
          <div className="space-y-4">
            {[
              { icon: Calendar, label: "Sessions Completed", value: "24", sub: "This month" },
              { icon: TrendingUp, label: "Improvement", value: "+34%", sub: "vs last month" },
              { icon: Award, label: "Streak", value: "7 days", sub: "Personal best!" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card rounded-xl border border-border p-5 shadow-card flex items-center gap-4 hover:shadow-hover transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label} · {stat.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Weekly activity */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-card">
            <h3 className="font-heading font-semibold text-card-foreground mb-6">Weekly Activity</h3>
            <div className="flex items-end justify-between gap-2 h-40">
              {weeklyData.map((d) => (
                <div key={d.day} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full max-w-[32px] bg-secondary rounded-t-md relative" style={{ height: "100%" }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-md transition-all duration-500"
                      style={{ height: d.height }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-card">
            <h3 className="font-heading font-semibold text-card-foreground mb-6">Recovery Milestones</h3>
            <div className="space-y-6">
              {milestones.map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <m.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-card-foreground">{m.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{m.progress}% → {m.target}</span>
                  </div>
                  <Progress value={m.progress} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgressDashboard;
