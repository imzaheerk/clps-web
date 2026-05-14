import { ReactNode } from "react";

interface PageHeaderProps {
  icon: string;
  title: string;
  description?: string;
  action?: ReactNode;
  variant?: "centered" | "left";
  className?: string;
}

export default function PageHeader({
  icon,
  title,
  description,
  action,
  variant = "left",
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-1 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
      <div
        className={`relative backdrop-blur-xl bg-bg-primary/60 rounded-3xl p-6 sm:p-8 ${
          variant === "centered" ? "text-center" : ""
        } border border-white/10 shadow-2xl`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-sky-500/10 to-cyan-500/10 opacity-50"></div>
        <div
          className={`relative flex flex-col ${
            variant === "centered"
              ? "items-center"
              : "sm:flex-row sm:items-center sm:justify-between"
          } gap-6`}
        >
          <div className={`flex items-center gap-4 ${variant === "centered" ? "flex-col" : ""}`}>
            <div className={`p-3 bg-gradient-to-br from-primary to-cyan-600 rounded-2xl shadow-lg ${
              variant === "centered" ? "p-4" : ""
            }`}>
              <i className={`${icon} text-white ${variant === "centered" ? "text-3xl" : "text-2xl"}`}></i>
            </div>
            <div className={variant === "centered" ? "text-center" : ""}>
              <h1 className={`font-black text-text-primary mb-2 bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent ${
                variant === "centered" 
                  ? "text-4xl sm:text-5xl lg:text-6xl" 
                  : "text-3xl sm:text-4xl lg:text-5xl"
              }`}>
                {title}
              </h1>
              {description && (
                <p className={`text-text-secondary ${variant === "centered" ? "text-lg sm:text-xl" : "text-base"}`}>
                  {description}
                </p>
              )}
            </div>
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      </div>
    </div>
  );
}
