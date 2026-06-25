import { getDashboardDayLabels, type DashboardStats } from "@/hooks/useDashboardStats";
import { ANNOUNCEMENT_CATEGORIES } from "@/services/announcementService/announcementService";

const DONUT_COLORS = {
  messages: "#8b5cf6",
  alerts: "#f59e0b",
  requests: "#0ea5e9",
  local: "#10b981",
} as const;

function buildDonutGradient(stats: DashboardStats) {
  const segments = [
    { value: stats.conversations, color: DONUT_COLORS.messages },
    { value: stats.unreadNotifications, color: DONUT_COLORS.alerts },
    { value: stats.pendingChatRequests, color: DONUT_COLORS.requests },
    {
      value: stats.localAnnouncements + stats.myBusinesses,
      color: DONUT_COLORS.local,
    },
  ].filter((segment) => segment.value > 0);

  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  if (total === 0) {
    return "conic-gradient(rgba(82, 82, 91, 0.45) 0% 100%)";
  }

  let cursor = 0;
  const stops = segments.map((segment) => {
    const start = cursor;
    cursor += (segment.value / total) * 100;
    return `${segment.color} ${start}% ${cursor}%`;
  });

  return `conic-gradient(${stops.join(", ")})`;
}

interface DashboardInsightsProps {
  stats: DashboardStats;
  loading: boolean;
  onRefresh: () => void;
}

export default function DashboardInsights({ stats, loading, onRefresh }: DashboardInsightsProps) {
  const dayLabels = getDashboardDayLabels();
  const maxWeekly = Math.max(...stats.weeklyActivity, 1);
  const donutTotal =
    stats.conversations +
    stats.unreadNotifications +
    stats.pendingChatRequests +
    stats.localAnnouncements +
    stats.myBusinesses;

  const lastSync = stats.lastUpdated.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <section className="app-dash-insights" aria-label="Live activity overview">
      <div className="app-dash-insights-head">
        <div>
          <div className="app-dash-live-tag">
            <span className="app-dash-live-dot" aria-hidden="true" />
            Live overview
          </div>
          <h2 className="app-dash-insights-title">Your network at a glance</h2>
        </div>
        <button
          type="button"
          className="app-dash-refresh"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Refresh dashboard stats"
        >
          <i className={`pi ${loading ? "pi-spin pi-spinner" : "pi-refresh"}`} />
          Updated {lastSync}
        </button>
      </div>

      <div className="app-dash-insights-grid">
        <article className="app-dash-insight-card app-dash-insight-card--donut">
          <p className="app-dash-insight-kicker">Activity mix</p>
          <div className="app-dash-donut-wrap">
            <div
              className="app-dash-donut"
              style={{ background: buildDonutGradient(stats) }}
              aria-hidden="true"
            />
            <div className="app-dash-donut-center">
              <span className="app-dash-donut-value">{loading ? "—" : donutTotal}</span>
              <span className="app-dash-donut-label">signals</span>
            </div>
          </div>
          <ul className="app-dash-legend">
            <li>
              <span className="app-dash-legend-dot" style={{ background: DONUT_COLORS.messages }} />
              Messages
              <strong>{stats.conversations}</strong>
            </li>
            <li>
              <span className="app-dash-legend-dot" style={{ background: DONUT_COLORS.alerts }} />
              Alerts
              <strong>{stats.unreadNotifications}</strong>
            </li>
            <li>
              <span className="app-dash-legend-dot" style={{ background: DONUT_COLORS.requests }} />
              Requests
              <strong>{stats.pendingChatRequests}</strong>
            </li>
            <li>
              <span className="app-dash-legend-dot" style={{ background: DONUT_COLORS.local }} />
              Local
              <strong>{stats.localAnnouncements + stats.myBusinesses}</strong>
            </li>
          </ul>
        </article>

        <article className="app-dash-insight-card app-dash-insight-card--chart">
          <p className="app-dash-insight-kicker">7-day pulse</p>
          <p className="app-dash-insight-heading">Activity trend</p>
          <div className="app-dash-bars" role="img" aria-label="Activity over the last seven days">
            {stats.weeklyActivity.map((value, index) => (
              <div key={dayLabels[index]} className="app-dash-bar-col">
                <div className="app-dash-bar-track">
                  <div
                    className="app-dash-bar-fill"
                    style={{ height: `${Math.max(8, (value / maxWeekly) * 100)}%` }}
                  />
                </div>
                <span className="app-dash-bar-label">{dayLabels[index]}</span>
                <span className="app-dash-bar-value">{value}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="app-dash-insight-card app-dash-insight-card--feed">
          <p className="app-dash-insight-kicker">Real-time feed</p>
          <p className="app-dash-insight-heading">Latest movement</p>
          <ul className="app-dash-feed">
            {loading ? (
              <li className="app-dash-feed-empty">Syncing your activity…</li>
            ) : stats.recentActivity.length === 0 ? (
              <li className="app-dash-feed-empty">
                No recent activity yet. Explore nearby to start building your network.
              </li>
            ) : (
              stats.recentActivity.map((item) => (
                <li key={item.id} className={`app-dash-feed-item app-dash-feed-item--${item.tone}`}>
                  <span className="app-dash-feed-icon" aria-hidden="true" />
                  <div className="app-dash-feed-copy">
                    <span className="app-dash-feed-label">{item.label}</span>
                    <span className="app-dash-feed-detail">{item.detail}</span>
                  </div>
                  <time className="app-dash-feed-time">{item.time}</time>
                </li>
              ))
            )}
          </ul>
        </article>
      </div>

      {stats.announcementCategoryCounts ? (
        <div className="app-dash-category-row">
          <p className="app-dash-category-row-label">Nearby announcements by topic</p>
          <div className="app-dash-category-chips">
            {ANNOUNCEMENT_CATEGORIES.map((cat) => {
              const count = stats.announcementCategoryCounts?.[cat.value] ?? 0;
              if (count === 0) return null;
              return (
                <span
                  key={cat.value}
                  className={`app-announcement-category app-announcement-category--${cat.value}`}
                >
                  {cat.label} · {count}
                </span>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="app-dash-metrics">
        <div className="app-dash-metric">
          <span className="app-dash-metric-value">{stats.conversations}</span>
          <span className="app-dash-metric-label">Active chats</span>
        </div>
        <div className="app-dash-metric">
          <span className="app-dash-metric-value">{stats.unreadNotifications}</span>
          <span className="app-dash-metric-label">Unread alerts</span>
        </div>
        <div className="app-dash-metric">
          <span className="app-dash-metric-value">{stats.pendingChatRequests}</span>
          <span className="app-dash-metric-label">Open requests</span>
        </div>
        <div className="app-dash-metric">
          <span className="app-dash-metric-value">{stats.localAnnouncements}</span>
          <span className="app-dash-metric-label">Nearby posts</span>
        </div>
        <div className="app-dash-metric">
          <span className="app-dash-metric-value">{stats.pendingNumberReveal}</span>
          <span className="app-dash-metric-label">Privacy queue</span>
        </div>
      </div>
    </section>
  );
}
