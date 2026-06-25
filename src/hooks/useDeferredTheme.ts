import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

/** Matches theme crossfade duration in theme-transitions.css */
export const THEME_CANVAS_FADE_MS = 340;

/**
 * Delays 3D scene rebuild until the UI theme fade completes,
 * so WebGL canvases don't snap between palettes.
 */
export function useDeferredTheme() {
  const { theme } = useTheme();
  const [renderTheme, setRenderTheme] = useState(theme);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (theme === renderTheme) return;

    setOpacity(0);
    const timer = window.setTimeout(() => {
      setRenderTheme(theme);
      requestAnimationFrame(() => setOpacity(1));
    }, THEME_CANVAS_FADE_MS);

    return () => clearTimeout(timer);
  }, [theme, renderTheme]);

  return { renderTheme, opacity };
}
