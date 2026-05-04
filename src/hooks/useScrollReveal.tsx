import { useEffect, useRef, useState } from "react";

export const useScrollReveal = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
}

export const ScrollReveal = ({ children, className = "", delay = 0, direction = "up" }: ScrollRevealProps) => {
  const { ref, isVisible } = useScrollReveal();

  const directionStyles: Record<string, string> = {
    up: "translate-y-10",
    left: "-translate-x-10",
    right: "translate-x-10",
    scale: "scale-95",
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0 translate-x-0 scale-100" : `opacity-0 ${directionStyles[direction]}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
