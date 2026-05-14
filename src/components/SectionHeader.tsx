import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  action,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="h-1.5 w-16 bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 rounded-full shadow-lg shadow-primary/50"></div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-text-primary bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">
            {title}
          </h2>
          {subtitle && (
            <p className="text-text-secondary text-sm mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
