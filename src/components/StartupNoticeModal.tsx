import { Dialog } from "primereact/dialog";

interface StartupNoticeModalProps {
  visible: boolean;
  onHide: () => void;
}

export default function StartupNoticeModal({
  visible,
  onHide,
}: StartupNoticeModalProps) {
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 bg-gradient-to-br from-primary/30 to-cyan-500/30 rounded-xl">
            <i className="pi pi-sparkles text-primary text-xl"></i>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-text-secondary mb-0.5">
              Preview Notice
            </p>
            <span className="text-xl font-bold text-text-primary">
              Product In Development
            </span>
          </div>
        </div>
      }
      modal
      closable={false}
      dismissableMask={false}
      className="w-11/12 sm:w-[90%] md:w-[34rem]"
    >
      <div className="py-1 text-text-primary">
        <div className="rounded-xl border border-white/10 bg-bg-primary/30 p-4 space-y-3">
          <p className="text-text-secondary text-sm leading-relaxed">
            Checknown is currently in active development. Explore the landing
            page to see available features.
          </p>
          <div className="space-y-2">
            <p className="text-xs text-text-secondary flex items-center gap-2">
              <i className="pi pi-check-circle text-primary" />
              Local discovery and core flows are available.
            </p>
            <p className="text-xs text-text-secondary flex items-center gap-2">
              <i className="pi pi-bolt text-emerald-400" />
              More improvements are coming soon.
            </p>
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={onHide}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-cyan-500 text-white font-medium hover:opacity-90 transition-opacity shadow-lg"
          >
            Continue
          </button>
        </div>
      </div>
    </Dialog>
  );
}
