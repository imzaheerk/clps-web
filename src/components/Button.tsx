import {
  Button as PrimeButton,
  ButtonProps as PrimeButtonProps,
} from "primereact/button";
import { preventDefaultHandler } from "@/utils/eventHandlers";

export interface ButtonProps extends Omit<PrimeButtonProps, "style"> {
  variant?: "primary" | "secondary" | "outlined" | "text" | "gradient";
  Size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export default function Button({
  variant = "primary",
  Size = "medium",
  fullWidth = false,
  style,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles: React.CSSProperties = {
    borderRadius: Size === "large" ? "var(--radius-md)" : "var(--radius-sm)",
    fontWeight: 600,
    ...style,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: "var(--btn-primary)",
      border: "none",
      color: "white",
    },
    secondary: {
      background: "var(--btn-secondary)",
      border: "none",
      color: "white",
    },
    outlined: {
      background: "transparent",
      borderColor: "var(--border-color)",
      borderWidth: "2px",
      borderStyle: "solid",
      color: "var(--text-primary)",
    },
    text: {
      background: "transparent",
      border: "none",
      color: "var(--text-primary)",
    },
    gradient: {
      background: "linear-gradient(135deg, var(--color-primary) 0%, #06b6d4 100%)",
      border: "none",
      color: "white",
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    small: {
      height: "2.25rem",
      fontSize: "0.875rem",
      padding: "0.5rem 1rem",
    },
    medium: {
      height: "2.75rem",
      fontSize: "1rem",
      padding: "0.75rem 1.5rem",
    },
    large: {
      height: "3.5rem",
      fontSize: "1.125rem",
      padding: "1rem 2rem",
    },
  };

  const combinedStyle: React.CSSProperties = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[Size],
    ...(fullWidth && { width: "100%" }),
  };

  const buttonProps: PrimeButtonProps = {
    ...props,
    style: combinedStyle,
    className: `${className} ${fullWidth ? "w-full" : ""}`.trim(),
    ...(variant === "outlined" && { outlined: true }),
    ...(variant === "text" && { text: true }),
    // Automatically wrap onClick to prevent default behavior
    ...(props.onClick && {
      onClick: preventDefaultHandler(props.onClick),
    }),
  };

  // Note: Button component uses inline styles for dynamic variants (primary, secondary, gradient, etc.)
  // This is necessary because Tailwind doesn't support dynamic class names at runtime

  return <PrimeButton {...buttonProps} />;
}
