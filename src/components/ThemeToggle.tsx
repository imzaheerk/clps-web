import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
      className={`theme-orb ${isDark ? "dark" : "light"}`}
    >
      <span className="theme-orb-glow" aria-hidden="true" />
      <span className="theme-orb-icon" aria-hidden="true">
        <i className={`pi ${isDark ? "pi-moon" : "pi-sun"} text-sm`} />
      </span>
    </button>
  );
}
