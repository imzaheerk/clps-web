import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components";
import DashboardInsights from "@/components/dashboard/DashboardInsights";
import { useSubscription } from "@/hooks/useSubscription";
import { useDashboardStats } from "@/hooks/useDashboardStats";

const FEATURED_TILES = [
  {
    path: "/feed",
    title: "Local feed",
    subtitle: "Announcements & events in one stream",
    icon: "pi-bolt",
    tone: "sky",
    statKey: null,
  },
  {
    path: "/search",
    title: "Discover nearby",
    subtitle: "Find people and businesses in your area",
    icon: "pi-search",
    tone: "sky",
    statKey: null,
  },
  {
    path: "/messaging",
    title: "Messages",
    subtitle: "Continue your conversations",
    icon: "pi-comments",
    tone: "violet",
    statKey: "conversations" as const,
  },
  {
    path: "/announcements",
    title: "Announcements",
    subtitle: "Local updates & news",
    icon: "pi-megaphone",
    tone: "amber",
    statKey: "localAnnouncements" as const,
  },
  {
    path: "/events",
    title: "Local events",
    subtitle: "Meetups & gatherings nearby",
    icon: "pi-calendar",
    tone: "rose",
    statKey: null,
  },
  {
    path: "/business",
    title: "Business",
    subtitle: "Your listings",
    icon: "pi-briefcase",
    tone: "emerald",
    statKey: "myBusinesses" as const,
  },
] as const;

const QUICK_LINKS = [
  { path: "/messaging/requests", label: "Chat requests", icon: "pi-user-plus", statKey: "pendingChatRequests" as const },
  { path: "/number-reveal-requests", label: "Number reveal", icon: "pi-eye", statKey: "pendingNumberReveal" as const },
  { path: "/profile", label: "Profile", icon: "pi-user", statKey: null },
  { path: "/notifications", label: "Notifications", icon: "pi-bell", statKey: "unreadNotifications" as const },
  { path: "/invite", label: "Invite neighbors", icon: "pi-users", statKey: null },
  { path: "/subscription", label: "Subscription", icon: "pi-credit-card", statKey: null },
  { path: "/plans", label: "Plans", icon: "pi-star", statKey: null },
] as const;

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { subscription } = useSubscription(user?.id ?? null, !!user?.id);
  const { stats, loading, refresh } = useDashboardStats(user?.id ?? null, user?.pincode);

  const isPremium =
    subscription?.status === "active" &&
    subscription?.plan &&
    !subscription.plan.isDefault &&
    subscription.plan.price > 0;

  const firstName = user?.name?.split(" ")[0] || "there";
  const initials = (user?.name || "U")[0].toUpperCase();
  const location = [user?.city, user?.state].filter(Boolean).join(", ") || "Set your location";
  const visibility = user?.isActive !== false ? "Discoverable" : "Hidden";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const getStat = (key: (typeof FEATURED_TILES)[number]["statKey"]) => {
    if (!key) return null;
    const value = stats[key];
    return value > 0 ? value : null;
  };

  return (
    <PageLayout maxWidth="xl" className="app-dash-page">
      <section className="app-dash-spotlight">
        <div className="app-dash-spotlight-mesh" aria-hidden="true" />
        <div className="app-dash-spotlight-rays" aria-hidden="true" />

        <div className="app-dash-spotlight-inner">
          <div className="app-dash-spotlight-left">
            <div className="app-dash-avatar" aria-hidden="true">
              <span>{initials}</span>
            </div>
            <div className="app-dash-spotlight-copy">
              <time className="app-dash-spotlight-date" dateTime={new Date().toISOString().slice(0, 10)}>
                {today}
              </time>
              <h1 className="app-dash-spotlight-title">
                Welcome back, <span className="auth-resend-accent">{firstName}</span>
              </h1>
              <p className="app-dash-spotlight-lead">
                Your command center for local connections, messages, and privacy.
              </p>
            </div>
          </div>

          <div className="app-dash-spotlight-right">
            <div className="app-dash-status-row">
              <span className="app-dash-status-pill">
                <i className="pi pi-map-marker" />
                {location}
              </span>
              <span className="app-dash-status-pill">
                <i className="pi pi-eye" />
                {visibility}
              </span>
              <span
                className={`app-dash-status-pill ${
                  isPremium ? "app-dash-status-pill--premium" : ""
                }`}
              >
                <i className={`pi ${isPremium ? "pi-star-fill" : "pi-circle"}`} />
                {isPremium ? subscription?.plan?.name || "Premium" : "Free plan"}
              </span>
            </div>

            <div className="app-dash-spotlight-actions">
              <button
                type="button"
                className="resend-btn resend-btn-primary app-dash-spotlight-cta"
                onClick={() => navigate("/search")}
              >
                <i className="pi pi-compass" />
                Explore nearby
              </button>
              {!isPremium ? (
                <button
                  type="button"
                  className="app-dash-spotlight-secondary"
                  onClick={() => navigate("/plans")}
                >
                  <i className="pi pi-star" />
                  Upgrade plan
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <DashboardInsights stats={stats} loading={loading} onRefresh={refresh} />

      <div className="app-dash-layout">
        <section className="app-dash-bento" aria-label="Quick actions">
          {FEATURED_TILES.map((tile, index) => {
            const badge = getStat(tile.statKey);
            return (
              <button
                key={tile.path}
                type="button"
                className={`app-dash-tile app-dash-tile--${tile.tone}${
                  index === 0 ? " app-dash-tile--hero" : ""
                }`}
                onClick={() => navigate(tile.path)}
              >
                <span className="app-dash-tile-orb" aria-hidden="true" />
                <span className="app-dash-tile-grid" aria-hidden="true" />
                {badge ? <span className="app-dash-tile-badge">{badge}</span> : null}
                <span className="app-dash-tile-icon">
                  <i className={`pi ${tile.icon}`} />
                </span>
                <span className="app-dash-tile-copy">
                  <span className="app-dash-tile-title">{tile.title}</span>
                  <span className="app-dash-tile-subtitle">{tile.subtitle}</span>
                </span>
                <span className="app-dash-tile-go">
                  Open
                  <i className="pi pi-arrow-right" />
                </span>
              </button>
            );
          })}
        </section>

        <aside className="app-dash-aside">
          <div className="app-dash-aside-head">
            <h2 className="app-dash-aside-title">More tools</h2>
            <p className="app-dash-aside-copy">Account, privacy, and billing</p>
          </div>
          <div className="app-dash-aside-grid">
            {QUICK_LINKS.map((link) => {
              const badge = link.statKey ? stats[link.statKey] : 0;
              return (
                <button
                  key={link.path}
                  type="button"
                  className="app-dash-mini"
                  onClick={() => navigate(link.path)}
                >
                  <span className="app-dash-mini-icon">
                    <i className={`pi ${link.icon}`} />
                    {badge > 0 ? <span className="app-dash-mini-badge">{badge}</span> : null}
                  </span>
                  <span className="app-dash-mini-label">{link.label}</span>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </PageLayout>
  );
}
