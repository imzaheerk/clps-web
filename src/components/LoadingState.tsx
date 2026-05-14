interface LoadingStateProps {
  message?: string;
  size?: "small" | "medium" | "large";
  fullPage?: boolean;
}

const sizeClasses = {
  small: {
    container: "p-8",
    icon: "text-4xl",
    text: "text-lg",
  },
  medium: {
    container: "p-12",
    icon: "text-6xl",
    text: "text-xl",
  },
  large: {
    container: "p-16 sm:p-20",
    icon: "text-7xl",
    text: "text-2xl",
  },
};

export default function LoadingState({
  message = "Loading...",
  size = "medium",
  fullPage = false,
}: LoadingStateProps) {
  const classes = sizeClasses[size];

  return (
    <div className={`relative group ${fullPage ? "flex items-center justify-center min-h-[60vh]" : ""}`}>
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-cyan-500/20 rounded-3xl blur-xl opacity-50"></div>
      <div
        className={`relative backdrop-blur-xl bg-bg-primary/70 rounded-3xl border border-white/10 shadow-2xl text-center ${classes.container}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-sky-500/5 to-cyan-500/5 opacity-50 rounded-3xl"></div>
        <div className="relative">
          <div className="inline-flex p-6 bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-3xl mb-6 shadow-xl">
            <i className={`pi pi-spin pi-spinner ${classes.icon} text-primary`}></i>
          </div>
          <p className={`font-bold text-text-primary ${classes.text}`}>{message}</p>
        </div>
      </div>
    </div>
  );
}
