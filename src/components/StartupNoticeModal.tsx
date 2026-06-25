import ResendModal from "./ResendModal";

interface StartupNoticeModalProps {
  visible: boolean;
  onHide: () => void;
}

const statusItems = [
  {
    tone: "success" as const,
    label: "Available now",
    detail: "Landing page and core local discovery flows",
  },
  {
    tone: "pending" as const,
    label: "In progress",
    detail: "More features and polish rolling out soon",
  },
];

export default function StartupNoticeModal({ visible, onHide }: StartupNoticeModalProps) {
  return (
    <ResendModal
      visible={visible}
      onHide={onHide}
      badge="Early access"
      title="Checknown is in active development"
      description="You can explore the landing page and preview what we're building. Some areas may change as we ship updates."
      icon="pi-wrench"
      dismissOnOverlay={false}
      footer={
        <button type="button" className="resend-btn resend-btn-primary w-full sm:w-auto" onClick={onHide}>
          Continue exploring
        </button>
      }
    >
      <div className="startup-notice-panel">
        {statusItems.map((item) => (
          <div key={item.label} className="startup-notice-row">
            <span className={`resend-list-status resend-list-status--${item.tone}`} />
            <div>
              <p className="startup-notice-row-label">{item.label}</p>
              <p className="startup-notice-row-detail">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </ResendModal>
  );
}
