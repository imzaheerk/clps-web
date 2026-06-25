import { ReactNode } from "react";
import { Header } from "@/components";
import AppBackground from "./AppBackground";

interface PageLayoutProps {
  children: ReactNode;
  showAuthButtons?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
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
  className = "",
}: PageLayoutProps) {
  return (
    <div className="app-resend min-h-screen flex flex-col relative overflow-hidden">
      <AppBackground />

      <div className="app-resend-content flex flex-col flex-1 min-h-0">
        <Header showAuthButtons={showAuthButtons} />

        <main
          className={`flex-1 ${maxWidthClasses[maxWidth]} w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8 flex flex-col gap-5 sm:gap-6 ${className}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
