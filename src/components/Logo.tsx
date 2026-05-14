interface LogoProps {
  size?: "small" | "large";
  showText?: boolean;
}

/** Icon: two people linked – “find & connect” / Checknown */
function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle
        cx="20"
        cy="20"
        r="17"
        stroke="currentColor"
        strokeWidth="2.25"
        fill="none"
        className="opacity-90"
      />
      {/* Two people (heads) + link */}
      <circle cx="14" cy="18" r="5" fill="currentColor" className="opacity-95" />
      <circle cx="26" cy="18" r="5" fill="currentColor" className="opacity-95" />
      <path
        d="M19 20h2"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        className="opacity-100"
      />
    </svg>
  );
}

export default function Logo({ size = "small", showText = true }: LogoProps) {
  const isLarge = size === "large";

  return (
    <div
      className={`flex items-center min-w-0 ${
        isLarge ? "flex-col justify-center gap-5" : "flex-row justify-start gap-2 sm:gap-3"
      }`}
    >
      <div
        className={`
          flex items-center justify-center text-white
          rounded-2xl
          bg-gradient-to-br from-sky-500 via-primary to-cyan-500
          shadow-lg
          ring-2 ring-white/20 ring-offset-2 ring-offset-[var(--bg-primary,transparent)]
          transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]
          ${isLarge ? "w-[120px] h-[120px] rounded-[28px] shadow-[0_20px_50px_-12px_rgba(14,165,233,0.4)]" : "w-11 h-11 shrink-0 shadow-[0_8px_20px_-4px_rgba(14,165,233,0.35)]"}
        `}
      >
        <LogoMark
          className={
            isLarge
              ? "w-[64px] h-[64px]"
              : "w-6 h-6"
          }
        />
      </div>
      {showText && (
        <h1
          className={`
            font-extrabold tracking-tight m-0 min-w-0 truncate
            bg-gradient-to-r from-sky-600 via-primary to-cyan-500
            bg-clip-text text-transparent
            drop-shadow-sm
            ${isLarge ? "text-5xl sm:text-6xl" : "text-lg sm:text-xl md:text-2xl"}
            ${!isLarge ? "hidden sm:block" : ""}
          `}
        >
          Checknown
        </h1>
      )}
    </div>
  );
}
