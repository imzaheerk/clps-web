import { Dialog } from "primereact/dialog";

export interface PrivacyPolicyModalProps {
  visible: boolean;
  onHide: () => void;
}

export default function PrivacyPolicyModal({ visible, onHide }: PrivacyPolicyModalProps) {
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-xl">
            <i className="pi pi-shield text-primary text-xl"></i>
          </div>
          <span className="text-xl font-bold text-text-primary">Privacy Policy</span>
        </div>
      }
      modal
      className="w-11/12 sm:w-[90%] md:w-2/3 lg:w-1/2"
      style={{ maxHeight: "90vh" }}
      contentStyle={{ maxHeight: "65vh", overflowY: "auto" }}
    >
      <div className="py-2 text-text-primary space-y-4">
        <p className="text-text-secondary text-sm">
          By using our service, you agree to how we collect, use, and protect your information. Here are the key points:
        </p>
        <ul className="space-y-3 list-none pl-0">
          <li className="flex gap-3">
            <i className="pi pi-check-circle text-primary mt-0.5 shrink-0"></i>
            <span><strong>Data we collect:</strong> Name, mobile number, location (country, state, city, pincode, area), and your number visibility preference.</span>
          </li>
          <li className="flex gap-3">
            <i className="pi pi-check-circle text-primary mt-0.5 shrink-0"></i>
            <span><strong>How we use it:</strong> To create and manage your account, show you relevant local services, and allow other users to find or contact you according to your visibility settings.</span>
          </li>
          <li className="flex gap-3">
            <i className="pi pi-check-circle text-primary mt-0.5 shrink-0"></i>
            <span><strong>Your number visibility:</strong> You choose whether your number is fully visible or masked; we respect this setting across the platform.</span>
          </li>
          <li className="flex gap-3">
            <i className="pi pi-check-circle text-primary mt-0.5 shrink-0"></i>
            <span><strong>Security:</strong> We use secure practices and do not share your personal data with third parties for marketing without your consent.</span>
          </li>
          <li className="flex gap-3">
            <i className="pi pi-check-circle text-primary mt-0.5 shrink-0"></i>
            <span><strong>Your rights:</strong> You can update your profile, change visibility, or request account deletion at any time.</span>
          </li>
          <li className="flex gap-3">
            <i className="pi pi-check-circle text-primary mt-0.5 shrink-0"></i>
            <span><strong>Updates:</strong> We may update this policy; we will notify you of significant changes via the app or your registered contact.</span>
          </li>
        </ul>
        <p className="text-text-secondary text-sm pt-2 border-t border-white/10">
          If you have questions about your privacy, contact us through the app or our support channels.
        </p>
      </div>
    </Dialog>
  );
}
