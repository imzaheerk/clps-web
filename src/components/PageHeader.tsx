import { ReactNode } from "react";

interface PageHeaderProps {
  icon: string;
  title: string;
  description?: string;
  action?: ReactNode;
  variant?: "centered" | "left";
  className?: string;
}

export default function PageHeader({
  icon,
  title,
  description,
  action,
  variant = "left",
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`app-page-header ${variant === "centered" ? "app-page-header--centered" : ""} ${className}`.trim()}>
      <div className="app-page-header-main">
        <span className="app-page-header-icon">
          <i className={icon} />
        </span>
        <div>
          <h1 className="app-page-header-title">{title}</h1>
          {description ? <p className="app-page-header-lead">{description}</p> : null}
        </div>
      </div>
      {action ? <div className="app-page-header-action">{action}</div> : null}
    </div>
  );
}
