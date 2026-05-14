import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: "none" | "sm" | "md" | "lg";
  variant?: "default" | "elevated" | "subtle";
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8 sm:p-10",
};

const variantClasses = {
  default: "bg-bg-primary/70 border-white/10",
  elevated: "bg-bg-primary/80 border-white/20",
  subtle: "bg-bg-primary/60 border-white/10",
};

export default function GlassCard({
  children,
  className = "",
  hover = false,
  onClick,
  padding = "md",
  variant = "default",
}: GlassCardProps) {
  const isClickable = onClick !== undefined;

  return (
    <div className={`relative group ${className}`}>
      {hover && (
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-cyan-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      )}
      <div
        className={`relative backdrop-blur-xl ${variantClasses[variant]} rounded-2xl border shadow-xl ${
          hover ? "hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" : ""
        } ${isClickable ? "cursor-pointer" : ""} ${paddingClasses[padding]}`}
        onClick={onClick}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-sky-500/5 to-cyan-500/5 opacity-50 rounded-2xl"></div>
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
