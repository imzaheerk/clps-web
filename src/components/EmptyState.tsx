import Button from "./Button";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: string;
  };
  size?: "small" | "medium" | "large";
  className?: string;
}

const sizeClasses = {
  small: {
    container: "p-8",
    icon: "text-4xl",
    title: "text-xl",
    description: "text-sm",
  },
  medium: {
    container: "p-12 sm:p-16",
    icon: "text-6xl sm:text-7xl",
    title: "text-2xl",
    description: "text-base",
  },
  large: {
    container: "p-16 sm:p-20",
    icon: "text-7xl sm:text-8xl",
    title: "text-3xl",
    description: "text-lg",
  },
};

export default function EmptyState({
  icon,
  title,
  description,
  action,
  size = "medium",
  className = "",
}: EmptyStateProps) {
  const classes = sizeClasses[size];

  return (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50"></div>
      <div
        className={`relative backdrop-blur-xl bg-bg-primary/70 rounded-3xl border border-white/10 shadow-2xl text-center ${classes.container}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-sky-500/5 to-cyan-500/5 opacity-50 rounded-3xl"></div>
        <div className="relative">
          <div className="inline-flex p-6 bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-3xl mb-6">
            <i className={`${icon} ${classes.icon} text-primary`}></i>
          </div>
          <h3
            className={`font-black text-text-primary mb-3 bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent ${classes.title}`}
          >
            {title}
          </h3>
          <p className={`text-text-secondary m-0 mb-6 ${classes.description}`}>{description}</p>
          {action && (
            <Button
              label={action.label}
              icon={action.icon}
              onClick={action.onClick}
              variant="gradient"
              Size="large"
            />
          )}
        </div>
      </div>
    </div>
  );
}
