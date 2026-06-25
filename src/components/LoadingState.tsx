interface LoadingStateProps {
  message?: string;
  className?: string;
}

export default function LoadingState({
  message = "Loading…",
  className = "",
}: LoadingStateProps) {
  return (
    <div className={`app-panel app-loading-state ${className}`.trim()}>
      <i className="pi pi-spin pi-spinner app-loading-state-spinner" />
      <p className="app-loading-state-text">{message}</p>
    </div>
  );
}
