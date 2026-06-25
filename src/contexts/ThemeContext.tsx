import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_TRANSITION_MS = 450;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function runThemeTransition(apply: () => void) {
  if (prefersReducedMotion()) {
    apply();
    return;
  }

  if (typeof document.startViewTransition === "function") {
    document.startViewTransition(apply);
    return;
  }

  document.documentElement.classList.add("theme-transition");
  apply();
  window.setTimeout(() => {
    document.documentElement.classList.remove("theme-transition");
  }, THEME_TRANSITION_MS);
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("checknown-theme") as Theme;
    return savedTheme || "dark";
  });

  useEffect(() => {
    localStorage.setItem("checknown-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);

    const swapTheme = async () => {
      const links = Array.from(
        document.querySelectorAll('link[rel="stylesheet"]')
      ) as HTMLLinkElement[];

      const themeLink = links.find(
        (link) =>
          link.href.includes("lara-light-blue") ||
          link.href.includes("lara-dark-blue")
      );

      if (themeLink) {
        try {
          const themeModule =
            theme === "dark"
              ? await import(
                  "primereact/resources/themes/lara-dark-blue/theme.css?url"
                )
              : await import(
                  "primereact/resources/themes/lara-light-blue/theme.css?url"
                );

          themeLink.href = themeModule.default;
        } catch (error) {
          console.error("Failed to load theme:", error);
        }
      }
    };

    swapTheme();
  }, [theme]);

  const toggleTheme = useCallback(() => {
    runThemeTransition(() => {
      setTheme((prev) => (prev === "light" ? "dark" : "light"));
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
