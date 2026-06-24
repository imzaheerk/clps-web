import { Link } from "react-router-dom";

export type BrandMarkSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "display";

interface BrandMarkProps {
  size?: BrandMarkSize;
  showTm?: boolean;
  className?: string;
  to?: string;
  onClick?: () => void;
}

export default function BrandMark({
  size = "sm",
  showTm = true,
  className = "",
  to,
  onClick,
}: BrandMarkProps) {
  const mark = (
    <span
      className={`brand-mark brand-mark--${size} ${className}`.trim()}
      aria-label="Checknown"
    >
      <span className="brand-mark-core">
        <span className="brand-mark-check">
          <span className="brand-mark-c-wrap" aria-hidden="true">
            <span className="brand-mark-c">C</span>
          </span>
          <span className="brand-mark-heck">heck</span>
        </span>
        <span className="brand-mark-own">nown</span>
      </span>
      {showTm ? (
        <sup className="brand-mark-tm" aria-hidden="true">
          ™
        </sup>
      ) : null}
    </span>
  );

  if (to) {
    return (
      <Link to={to} className="brand-mark-link" onClick={onClick}>
        {mark}
      </Link>
    );
  }

  return mark;
}
