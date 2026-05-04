import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Activity } from "lucide-react";

const navItems = [
  { label: "Videos", href: "#videos" },
  { label: "Exercises", href: "#exercises" },
  { label: "Posture", href: "#posture" },
  { label: "AI Assistant", href: "#ai-assistant" },
  { label: "Progress", href: "#progress" },
  { label: "Tiers", href: "#tiers" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          PhysioAI
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <a href="#ai-assistant">Log In</a>
          </Button>
          <Button variant="default" size="sm" className="rounded-full" asChild>
            <a href="#exercises">Get Started</a>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 space-y-3 animate-fade-in">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" size="sm" asChild>
              <a href="#ai-assistant" onClick={() => setOpen(false)}>Log In</a>
            </Button>
            <Button variant="default" size="sm" className="rounded-full" asChild>
              <a href="#exercises" onClick={() => setOpen(false)}>Get Started</a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
