import ResendModal from "./ResendModal";

export interface PrivacyPolicyModalProps {
  visible: boolean;
  onHide: () => void;
}

export default function PrivacyPolicyModal({ visible, onHide }: PrivacyPolicyModalProps) {
  return (
    <ResendModal
      visible={visible}
      onHide={onHide}
      badge="Legal"
      title="Privacy Policy"
      description="How we collect, use, and protect your information."
      icon="pi-shield"
      footer={
        <div className="resend-modal-actions-row">
          <button type="button" className="resend-btn resend-btn-primary w-full sm:w-auto" onClick={onHide}>
            I understand
          </button>
        </div>
      }
    >
      <div className="resend-modal-scroll">
        <p className="resend-modal-copy">
          By using Checknown, you agree to how we handle your data. Here are the essentials:
        </p>
        <ul className="resend-modal-list">
          <li>
            <strong>Data we collect:</strong> Name, mobile number, location fields, and your number
            visibility preference.
          </li>
          <li>
            <strong>How we use it:</strong> To manage your account, show relevant local connections,
            and honor your visibility settings.
          </li>
          <li>
            <strong>Your number visibility:</strong> Fully visible or masked — we respect your
            choice across the platform.
          </li>
          <li>
            <strong>Security:</strong> We use secure practices and do not sell your data for
            marketing without consent.
          </li>
          <li>
            <strong>Your rights:</strong> Update your profile, change visibility, or request deletion
            at any time.
          </li>
        </ul>
      </div>
    </ResendModal>
  );
}
