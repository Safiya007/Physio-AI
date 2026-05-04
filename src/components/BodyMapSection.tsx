import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import bodyMap from "@/assets/body-map.png";

const bodyParts = [
  { id: "neck", label: "Neck", top: "12%", left: "50%", exercises: 5, description: "Cervical spine mobility and pain relief" },
  { id: "shoulder", label: "Shoulder", top: "22%", left: "35%", exercises: 8, description: "Rotator cuff and shoulder joint recovery" },
  { id: "shoulder-r", label: "Shoulder", top: "22%", left: "65%", exercises: 8, description: "Rotator cuff and shoulder joint recovery" },
  { id: "back", label: "Back", top: "35%", left: "50%", exercises: 12, description: "Spinal health and core stabilization" },
  { id: "hip", label: "Hip", top: "48%", left: "42%", exercises: 7, description: "Hip flexor and joint mobility exercises" },
  { id: "hip-r", label: "Hip", top: "48%", left: "58%", exercises: 7, description: "Hip flexor and joint mobility exercises" },
  { id: "knee", label: "Knee", top: "68%", left: "43%", exercises: 10, description: "Knee stabilization and strengthening" },
  { id: "knee-r", label: "Knee", top: "68%", left: "57%", exercises: 10, description: "Knee stabilization and strengthening" },
  { id: "ankle", label: "Ankle", top: "88%", left: "44%", exercises: 6, description: "Ankle stability and balance training" },
];

const BodyMapSection = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const activePart = bodyParts.find((p) => p.id === selected);

  return (
    <section id="body-map" className="py-24 bg-secondary/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 space-y-3">
          <Badge variant="outline" className="border-primary/30 text-primary font-medium px-4 py-1">
            <MapPin className="h-3 w-3 mr-1" /> Interactive Body Map
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
            Target Your Recovery Area
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Click on any body area to discover tailored exercises for that region.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-5xl mx-auto">
          {/* Body image with hotspots */}
          <div className="relative w-72 sm:w-80 flex-shrink-0">
            <img src={bodyMap} alt="Interactive body map" className="w-full animate-float" loading="lazy" width={800} height={1024} />
            {bodyParts.map((part) => (
              <button
                key={part.id}
                onClick={() => setSelected(selected === part.id ? null : part.id)}
                className={`absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-300 ${
                  selected === part.id
                    ? "bg-primary border-primary scale-125 glow"
                    : "bg-primary/40 border-primary/60 hover:bg-primary hover:scale-110"
                }`}
                style={{ top: part.top, left: part.left }}
                aria-label={`Select ${part.label}`}
              >
                <span className="absolute inset-0 rounded-full animate-ping bg-primary/30" />
              </button>
            ))}
          </div>

          {/* Info panel */}
          <div className="flex-1 w-full">
            {activePart ? (
              <div className="bg-card rounded-xl border border-border p-8 shadow-card animate-fade-in">
                <h3 className="text-2xl font-bold font-heading text-card-foreground mb-2">{activePart.label}</h3>
                <p className="text-muted-foreground mb-4">{activePart.description}</p>
                <div className="flex items-center gap-2 mb-6">
                  <Badge variant="secondary">{activePart.exercises} exercises available</Badge>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { type: "Mobility", count: 3 },
                    { type: "Strength", count: 4 },
                    { type: "Flexibility", count: 2 },
                    { type: "Pain Relief", count: 3 },
                  ].map(({ type, count }) => (
                    <a
                      key={type}
                      href="#exercises"
                      className="rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-accent/50 transition-all cursor-pointer"
                    >
                      <div className="font-medium text-card-foreground text-sm">{type}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {count} exercises
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-card/50 rounded-xl border border-dashed border-border p-12 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Select a body area on the map to see available exercises</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BodyMapSection;
