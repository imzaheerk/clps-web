import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

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

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

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
