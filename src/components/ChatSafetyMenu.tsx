import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@/components";
import ResendModal from "@/components/ResendModal";
import {
  chatSafetyService,
  REPORT_REASONS,
  type BlockStatus,
  type ReportReason,
} from "@/services/chatSafetyService/chatSafetyService";

interface ChatSafetyMenuProps {
  otherUserId: number;
  otherUserName?: string | null;
  conversationId?: number;
  blockStatus?: BlockStatus | null;
  onBlockStatusChange?: (status: BlockStatus) => void;
  showUnfriend?: boolean;
  onUnfriend?: () => void;
  unfriendLoading?: boolean;
  className?: string;
}

export default function ChatSafetyMenu({
  otherUserId,
  otherUserName,
  conversationId,
  blockStatus: blockStatusProp,
  onBlockStatusChange,
  showUnfriend,
  onUnfriend,
  unfriendLoading,
  className = "",
}: ChatSafetyMenuProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [blockStatus, setBlockStatus] = useState<BlockStatus | null>(blockStatusProp ?? null);
  const [loading, setLoading] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState<ReportReason>("harassment");
  const [reportDetails, setReportDetails] = useState("");
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    if (blockStatusProp) setBlockStatus(blockStatusProp);
  }, [blockStatusProp]);

  const refreshBlockStatus = useCallback(async () => {
    try {
      const status = await chatSafetyService.getBlockStatus(otherUserId);
      setBlockStatus(status);
      onBlockStatusChange?.(status);
      return status;
    } catch {
      return null;
    }
  }, [otherUserId, onBlockStatusChange]);

  useEffect(() => {
    if (!blockStatusProp) {
      refreshBlockStatus();
    }
  }, [blockStatusProp, refreshBlockStatus]);

  const displayName = otherUserName || "this user";

  const handleBlock = async () => {
    setLoading(true);
    try {
      await chatSafetyService.blockUser(otherUserId);
      const status = await refreshBlockStatus();
      if (status) {
        showNotification(`${displayName} has been blocked`, "success");
      }
      setShowBlockModal(false);
      setMenuOpen(false);
    } catch (err: any) {
      showNotification(
        err.response?.data?.error || err.response?.data?.message || "Failed to block user",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async () => {
    setLoading(true);
    try {
      await chatSafetyService.unblockUser(otherUserId);
      const status = await refreshBlockStatus();
      if (status) {
        showNotification(`${displayName} has been unblocked`, "success");
      }
      setMenuOpen(false);
    } catch (err: any) {
      showNotification(
        err.response?.data?.error || err.response?.data?.message || "Failed to unblock user",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async () => {
    setReporting(true);
    try {
      await chatSafetyService.reportUser({
        reportedUserId: otherUserId,
        reason: reportReason,
        details: reportDetails.trim() || undefined,
        conversationId,
      });
      showNotification("Report submitted. Our team will review it.", "success");
      setShowReportModal(false);
      setReportDetails("");
      setMenuOpen(false);
    } catch (err: any) {
      showNotification(
        err.response?.data?.error || err.response?.data?.message || "Failed to submit report",
        "error"
      );
    } finally {
      setReporting(false);
    }
  };

  return (
    <div className={`app-safety-menu ${className}`.trim()}>
      <button
        type="button"
        className="header-app-icon-btn"
        aria-label="Safety options"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
      >
        <i className="pi pi-ellipsis-v" />
      </button>

      {menuOpen ? (
        <>
          <button
            type="button"
            className="app-safety-menu-backdrop"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="app-safety-menu-panel" role="menu">
            <button
              type="button"
              className="app-safety-menu-item"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                navigate(`/profile/${otherUserId}`);
              }}
            >
              <i className="pi pi-user" />
              View profile
            </button>
            {blockStatus?.blockedByMe ? (
              <button
                type="button"
                className="app-safety-menu-item"
                role="menuitem"
                disabled={loading}
                onClick={handleUnblock}
              >
                <i className="pi pi-unlock" />
                Unblock
              </button>
            ) : (
              <button
                type="button"
                className="app-safety-menu-item app-safety-menu-item--danger"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  setShowBlockModal(true);
                }}
              >
                <i className="pi pi-ban" />
                Block user
              </button>
            )}
            <button
              type="button"
              className="app-safety-menu-item app-safety-menu-item--danger"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                setShowReportModal(true);
              }}
            >
              <i className="pi pi-flag" />
              Report user
            </button>
            {showUnfriend && onUnfriend ? (
              <button
                type="button"
                className="app-safety-menu-item app-safety-menu-item--danger"
                role="menuitem"
                disabled={unfriendLoading}
                onClick={() => {
                  setMenuOpen(false);
                  onUnfriend();
                }}
              >
                <i className="pi pi-user-minus" />
                Unfriend
              </button>
            ) : null}
          </div>
        </>
      ) : null}

      <ResendModal
        visible={showBlockModal}
        onHide={() => !loading && setShowBlockModal(false)}
        title="Block user?"
        description={
          <>
            Block <strong>{displayName}</strong>? They won&apos;t be able to message you or send chat
            requests.
          </>
        }
        icon="pi-ban"
        tone="danger"
        footer={
          <div className="resend-modal-actions-row">
            <button
              type="button"
              className="resend-btn resend-btn-secondary"
              onClick={() => setShowBlockModal(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="resend-btn resend-btn-danger"
              onClick={handleBlock}
              disabled={loading}
            >
              {loading ? <i className="pi pi-spin pi-spinner" /> : <i className="pi pi-ban" />}
              Block
            </button>
          </div>
        }
      />

      <ResendModal
        visible={showReportModal}
        onHide={() => !reporting && setShowReportModal(false)}
        title="Report user"
        description={
          <>
            Tell us what happened with <strong>{displayName}</strong>. Reports are reviewed by our
            team.
          </>
        }
        icon="pi-flag"
        tone="danger"
        size="wide"
        footer={
          <div className="resend-modal-actions-row">
            <button
              type="button"
              className="resend-btn resend-btn-secondary"
              onClick={() => setShowReportModal(false)}
              disabled={reporting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="resend-btn resend-btn-danger"
              onClick={handleReport}
              disabled={reporting}
            >
              {reporting ? <i className="pi pi-spin pi-spinner" /> : <i className="pi pi-flag" />}
              Submit report
            </button>
          </div>
        }
      >
        <div className="app-safety-report-form">
          <label className="app-safety-report-label" htmlFor="report-reason">
            Reason
          </label>
          <select
            id="report-reason"
            className="auth-resend-input w-full"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value as ReportReason)}
          >
            {REPORT_REASONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <label className="app-safety-report-label" htmlFor="report-details">
            Details (optional)
          </label>
          <textarea
            id="report-details"
            className="auth-resend-input w-full app-safety-report-textarea"
            rows={4}
            maxLength={2000}
            placeholder="What happened?"
            value={reportDetails}
            onChange={(e) => setReportDetails(e.target.value)}
          />
        </div>
      </ResendModal>
    </div>
  );
}
