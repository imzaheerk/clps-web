interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: string;
  };
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`app-panel app-empty-state text-center py-12 sm:py-14 ${className}`.trim()}>
      <i className={`${icon} app-empty-state-icon`} />
      <h3 className="app-empty-state-title">{title}</h3>
      <p className="app-empty-state-desc">{description}</p>
      {action ? (
        <button type="button" className="resend-btn resend-btn-primary" onClick={action.onClick}>
          {action.icon ? <i className={action.icon} /> : null}
          {action.label}
        </button>
      ) : null}
    </div>
  );
}
