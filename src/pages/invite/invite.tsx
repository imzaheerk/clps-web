import { useAuth } from "@/contexts/AuthContext";
import {
  PageLayout,
  PageHeader,
  LoadingState,
  EmptyState,
  Button,
} from "@/components";
import { useReferral } from "@/hooks/useReferral";

function statusLabel(status: string) {
  switch (status) {
    case "completed":
      return "Joined";
    case "rewarded":
      return "Rewarded";
    default:
      return "Pending";
  }
}

export default function InviteNeighbors() {
  const { user } = useAuth();
  const {
    stats,
    referrals,
    inviteLink,
    pendingRewards,
    loading,
    generating,
    claiming,
    ensureCode,
    copyToClipboard,
    shareWhatsApp,
    claimAllRewards,
  } = useReferral(user?.id ?? null);

  const code = stats?.referralCode;

  if (loading && !stats) {
    return (
      <PageLayout maxWidth="lg">
        <PageHeader
          icon="pi pi-users"
          title="Invite neighbors"
          description="Grow your local network and earn rewards"
        />
        <LoadingState message="Loading your invite hub…" />
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="lg" className="app-invite-page">
      <PageHeader
        icon="pi pi-users"
        title="Invite neighbors"
        description="Share Checknown with people in your area — you both earn premium days when they join."
      />

      {pendingRewards?.hasPendingReward ? (
        <section className="app-invite-reward-banner">
          <div className="app-invite-reward-banner-copy">
            <i className="pi pi-gift" />
            <div>
              <strong>
                {pendingRewards.totalPendingDays} premium day
                {pendingRewards.totalPendingDays === 1 ? "" : "s"} ready to claim
              </strong>
              <p>Someone joined using your invite link.</p>
            </div>
          </div>
          <Button
            label="Claim reward"
            icon="pi pi-check"
            onClick={claimAllRewards}
            loading={claiming}
            variant="primary"
            Size="large"
            className="auth-resend-btn-primary shrink-0"
          />
        </section>
      ) : null}

      <div className="app-invite-grid">
        <section className="app-panel app-invite-card">
          <div className="app-panel-head">
            <h2 className="app-panel-title">
              <i className="pi pi-link" />
              Your invite link
            </h2>
            <p className="app-panel-copy">
              Send this to friends, neighbors, or local groups. When they sign up, you both get
              bonus premium time.
            </p>
          </div>

          {code ? (
            <div className="app-invite-code-block">
              <div className="app-invite-code-row">
                <span className="app-invite-code-label">Code</span>
                <code className="app-invite-code-value">{code}</code>
                <button
                  type="button"
                  className="app-invite-copy-btn"
                  onClick={() => copyToClipboard(code, "Invite code")}
                  aria-label="Copy invite code"
                >
                  <i className="pi pi-copy" />
                </button>
              </div>
              {inviteLink ? (
                <div className="app-invite-code-row app-invite-code-row--link">
                  <span className="app-invite-code-label">Link</span>
                  <span className="app-invite-link-value">{inviteLink}</span>
                  <button
                    type="button"
                    className="app-invite-copy-btn"
                    onClick={() => copyToClipboard(inviteLink, "Invite link")}
                    aria-label="Copy invite link"
                  >
                    <i className="pi pi-copy" />
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="app-invite-empty-code">
              <p className="app-panel-copy">Generate a personal code to start inviting people nearby.</p>
              <Button
                label={generating ? "Generating…" : "Generate invite code"}
                icon="pi pi-plus"
                onClick={ensureCode}
                loading={generating}
                variant="primary"
                Size="large"
                className="auth-resend-btn-primary"
              />
            </div>
          )}

          {code ? (
            <div className="app-invite-actions">
              <Button
                label="Copy link"
                icon="pi pi-copy"
                onClick={() => inviteLink && copyToClipboard(inviteLink, "Invite link")}
                variant="outlined"
                Size="large"
                className="auth-resend-btn-outlined flex-1"
              />
              <Button
                label="Share on WhatsApp"
                icon="pi pi-whatsapp"
                onClick={shareWhatsApp}
                variant="primary"
                Size="large"
                className="auth-resend-btn-primary flex-1"
              />
            </div>
          ) : null}
        </section>

        <section className="app-panel app-invite-stats">
          <div className="app-panel-head">
            <h2 className="app-panel-title">
              <i className="pi pi-chart-bar" />
              Your impact
            </h2>
          </div>
          <div className="app-invite-stat-grid">
            <div className="app-invite-stat">
              <span className="app-invite-stat-value">{stats?.totalReferrals ?? 0}</span>
              <span className="app-invite-stat-label">Invites sent</span>
            </div>
            <div className="app-invite-stat">
              <span className="app-invite-stat-value">{stats?.completedReferrals ?? 0}</span>
              <span className="app-invite-stat-label">Joined</span>
            </div>
            <div className="app-invite-stat">
              <span className="app-invite-stat-value">{stats?.pendingReferrals ?? 0}</span>
              <span className="app-invite-stat-label">Pending</span>
            </div>
            <div className="app-invite-stat app-invite-stat--accent">
              <span className="app-invite-stat-value">{stats?.totalRewardsEarned ?? 0}</span>
              <span className="app-invite-stat-label">Rewards earned</span>
            </div>
          </div>
        </section>
      </div>

      <section className="app-panel app-invite-history">
        <div className="app-panel-head">
          <h2 className="app-panel-title">
            <i className="pi pi-history" />
            Invite history
          </h2>
          <p className="app-panel-copy">People who used your link to sign up.</p>
        </div>

        {referrals.length === 0 ? (
          <EmptyState
            icon="pi pi-inbox"
            title="No invites yet"
            description="Share your link to see who joins from your neighborhood."
          />
        ) : (
          <ul className="app-invite-list">
            {referrals.map((item) => (
              <li key={item.id} className="app-invite-list-item">
                <div className="app-invite-list-main">
                  <span className="app-invite-list-name">
                    {item.referredUser?.name ?? "Waiting to sign up"}
                  </span>
                  <span className="app-invite-list-meta">
                    {item.completedAt
                      ? new Date(item.completedAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Link shared"}
                  </span>
                </div>
                <span className={`app-invite-status app-invite-status--${item.status}`}>
                  {statusLabel(item.status)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="app-panel app-invite-how">
        <div className="app-panel-head">
          <h2 className="app-panel-title">
            <i className="pi pi-info-circle" />
            How it works
          </h2>
        </div>
        <ol className="app-invite-steps">
          <li>
            <strong>Share your link</strong> — WhatsApp, SMS, or social.
          </li>
          <li>
            <strong>They sign up</strong> — using your code on the signup page.
          </li>
          <li>
            <strong>You both win</strong> — premium days added when they complete registration.
          </li>
        </ol>
      </section>
    </PageLayout>
  );
}
