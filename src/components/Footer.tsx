import { Activity } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground py-12">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 font-heading text-lg font-bold text-primary-foreground">
          <Activity className="h-5 w-5 text-primary" />
          PhysioAI
        </div>
        <div className="flex gap-6 text-sm text-primary-foreground/50">
          <a href="#" className="hover:text-primary-foreground/80 transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary-foreground/80 transition-colors">Terms</a>
          <a href="#" className="hover:text-primary-foreground/80 transition-colors">Support</a>
        </div>
        <p className="text-xs text-primary-foreground/40">© 2026 PhysioAI. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
