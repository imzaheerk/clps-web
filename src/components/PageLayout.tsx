import { ReactNode } from "react";
import { Header, NetworkBackground } from "@/components";

interface PageLayoutProps {
  children: ReactNode;
  showAuthButtons?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  showAnimatedBackground?: boolean;
  className?: string;
}

const maxWidthClasses = {
  sm: "max-w-[800px]",
  md: "max-w-[1000px]",
  lg: "max-w-[1200px]",
  xl: "max-w-[1400px]",
  "2xl": "max-w-[1600px]",
  full: "max-w-full",
};

export default function PageLayout({
  children,
  showAuthButtons = false,
  maxWidth = "lg",
  showAnimatedBackground = true,
  className = "",
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-secondary via-bg-secondary to-bg-tertiary flex flex-col relative overflow-hidden">
      {/* Network Background */}
      <NetworkBackground />

      {/* Animated background elements */}
      {showAnimatedBackground && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
      )}

      {/* Header */}
      <Header showAuthButtons={showAuthButtons} />

      {/* Main Content */}
      <div
        className={`flex-1 ${maxWidthClasses[maxWidth]} w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8 sm:gap-10 relative z-10 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
