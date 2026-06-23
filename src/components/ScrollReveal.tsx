import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

export type ScrollRevealVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom"
  | "fade"
  | "pop-up"
  | "blur-up"
  | "flip-up"
  | "elastic";

export interface ScrollRevealProps {
  children: ReactNode;
  variant?: ScrollRevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
  as?: ElementType;
  once?: boolean;
  immediate?: boolean;
  /** Gentle floating motion after reveal */
  float?: boolean;
  threshold?: number;
  rootMargin?: string;
}

const VARIANT_DEFAULT_DURATION: Record<ScrollRevealVariant, number> = {
  "fade-up": 900,
  "fade-down": 900,
  "fade-left": 1000,
  "fade-right": 1000,
  zoom: 950,
  fade: 800,
  "pop-up": 1000,
  "blur-up": 1100,
  "flip-up": 1050,
  elastic: 1200,
};

export default function ScrollReveal({
  children,
  variant = "pop-up",
  delay = 0,
  duration,
  className = "",
  as: Component = "div",
  once = true,
  immediate = false,
  float = false,
  threshold = 0.1,
  rootMargin = "0px 0px -5% 0px",
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const resolvedDuration = duration ?? VARIANT_DEFAULT_DURATION[variant];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setReducedMotion(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setActive(true);
      return;
    }

    if (immediate) {
      const timer = window.setTimeout(() => setActive(true), delay);
      return () => window.clearTimeout(timer);
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setActive(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [immediate, once, threshold, rootMargin, delay, reducedMotion]);

  const style: CSSProperties = reducedMotion
    ? {}
    : {
        ["--sr-delay" as string]: `${delay}ms`,
        ["--sr-duration" as string]: `${resolvedDuration}ms`,
      };

  const classes = [
    "scroll-reveal",
    `scroll-reveal-${variant}`,
    active ? "scroll-reveal-active" : "",
    active && float && !reducedMotion ? "scroll-reveal-float" : "",
    reducedMotion ? "scroll-reveal-reduced" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component ref={ref} className={classes} style={style}>
      {children}
    </Component>
  );
}
