import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="theme-pill" role="group" aria-label="Theme">
      <button
        type="button"
        onClick={() => isDark && toggleTheme()}
        aria-label="Light mode"
        aria-pressed={!isDark}
        className={!isDark ? "active" : ""}
      >
        <i className="pi pi-sun text-base" />
      </button>
      <button
        type="button"
        onClick={() => !isDark && toggleTheme()}
        aria-label="Dark mode"
        aria-pressed={isDark}
        className={isDark ? "active" : ""}
      >
        <i className="pi pi-moon text-base" />
      </button>
    </div>
  );
}
