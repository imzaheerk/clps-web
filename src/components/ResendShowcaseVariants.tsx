import { useState } from "react";

export function ResendDualPanelShowcase({
  leftTitle,
  leftBadge,
  leftTarget,
  statusItems,
  events,
}: {
  leftTitle: string;
  leftBadge: string;
  leftTarget: string;
  statusItems: Array<{
    label: string;
    status: string;
    tone?: "success" | "info" | "violet";
  }>;
  events: Array<{
    type: "delivered" | "clicked" | "viewed";
    title: string;
    detail: string;
    time: string;
    pills?: string[];
  }>;
}) {
  return (
    <div className="resend-dual-panel">
      <div className="resend-dual-panel-card">
        <div className="resend-dual-toolbar">
          <span className="resend-pill resend-pill--success">{leftBadge}</span>
          <span className="resend-dual-toolbar-target">
            {leftTarget}
            <i className="pi pi-chevron-down text-[10px] opacity-60" />
          </span>
          <span className="resend-dual-toolbar-action">
            <i className="pi pi-cog text-xs" />
            Manage
          </span>
        </div>
        <div className="resend-dual-panel-head">{leftTitle}</div>
        <div className="resend-status-list">
          {statusItems.map((item) => (
            <div key={item.label} className="resend-status-row">
              <span className={`resend-list-status resend-list-status--${item.tone ?? "success"}`} />
              <span className="resend-status-label">{item.label}</span>
              <span className="resend-status-value">{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="resend-dual-panel-card">
        <div className="resend-timeline">
          {events.map((event) => (
            <div key={`${event.title}-${event.time}`} className="resend-timeline-item">
              <div className="resend-timeline-rail" aria-hidden="true">
                <span
                  className={`resend-timeline-icon resend-timeline-icon--${event.type}`}
                >
                  <i
                    className={`pi ${
                      event.type === "clicked"
                        ? "pi-arrow-right"
                        : event.type === "viewed"
                          ? "pi-eye"
                          : "pi-check"
                    } text-[10px]`}
                  />
                </span>
              </div>
              <div className="resend-timeline-body">
                <div className="resend-timeline-top">
                  <span className={`resend-pill resend-pill--${event.type}`}>{event.title}</span>
                  <span className="resend-timeline-time">{event.time}</span>
                </div>
                <p className="resend-timeline-detail">{event.detail}</p>
                {event.pills && event.pills.length > 0 && (
                  <div className="resend-timeline-pills">
                    {event.pills.map((pill) => (
                      <span key={pill} className="resend-data-pill">
                        {pill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ResendTabShowcase({
  tabs,
}: {
  tabs: Array<{
    id: string;
    label: string;
    icon: string;
    panelTitle: string;
    items: Array<{ label: string; detail: string }>;
  }>;
}) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");

  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  return (
    <div className="resend-tab-showcase">
      <div className="resend-tab-row" role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`resend-tab-chip ${isActive ? "is-active" : ""}`}
              onClick={() => setActiveId(tab.id)}
            >
              <span className="resend-tab-chip-icon">
                <i className={`pi ${tab.icon}`} />
              </span>
              <span className="resend-tab-chip-label">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="resend-tab-panel">
        <div key={activeTab.id} className="resend-tab-panel-content">
          <div className="resend-tab-panel-chrome">
            <div className="resend-showcase-dots" aria-hidden="true">
              <span className="resend-showcase-dot resend-showcase-dot--red" />
              <span className="resend-showcase-dot resend-showcase-dot--yellow" />
              <span className="resend-showcase-dot resend-showcase-dot--green" />
            </div>
            <span className="resend-tab-panel-title">{activeTab.panelTitle}</span>
          </div>
          <div className="resend-tab-panel-body">
            {activeTab.items.map((item) => (
              <div key={item.label} className="resend-feature-row">
                <span className="resend-feature-row-icon">
                  <i className="pi pi-check" />
                </span>
                <div className="resend-feature-row-copy">
                  <p className="resend-feature-row-label">{item.label}</p>
                  <p className="resend-feature-row-detail">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ResendDashboardShowcase({
  left,
  right,
}: {
  left: {
    kicker: string;
    title: string;
    stats: Array<{ label: string; value: string }>;
    chart?: "green" | "blue";
  };
  right: {
    kicker: string;
    value: string;
    metrics: Array<{ label: string; value: string; tone: "success" | "danger" | "info" | "violet" }>;
    secondary?: { label: string; value: string };
  };
}) {
  return (
    <div className="resend-dashboard-pair">
      <div className="resend-dashboard-card">
        <div className="resend-dashboard-card-head">
          <span className="resend-dashboard-icon">
            <i className="pi pi-users" />
          </span>
          <div>
            <p className="resend-dashboard-kicker">{left.kicker}</p>
            <p className="resend-dashboard-title">
              {left.title}
              <i className="pi pi-chevron-down text-[10px] opacity-50 ml-1" />
            </p>
          </div>
        </div>
        <div className="resend-dashboard-stats">
          {left.stats.map((stat) => (
            <div key={stat.label} className="resend-dashboard-stat">
              <p className="resend-dashboard-stat-label">{stat.label}</p>
              <p className="resend-dashboard-stat-value">{stat.value}</p>
            </div>
          ))}
          <div className="resend-dashboard-sparkline" data-tone={left.chart ?? "green"} aria-hidden="true" />
        </div>
      </div>

      <div className="resend-dashboard-card resend-dashboard-card--glow">
        <p className="resend-dashboard-kicker">{right.kicker}</p>
        <p className="resend-dashboard-hero-value">{right.value}</p>
        <div className="resend-dashboard-metrics">
          {right.metrics.map((metric) => (
            <div key={metric.label} className="resend-dashboard-metric">
              <span className={`resend-list-status resend-list-status--${metric.tone}`} />
              <span className="resend-dashboard-metric-label">{metric.label}</span>
              <span className="resend-dashboard-metric-value">{metric.value}</span>
            </div>
          ))}
        </div>
        {right.secondary && (
          <div className="resend-dashboard-secondary">
            <p className="resend-dashboard-kicker">{right.secondary.label}</p>
            <p className="resend-dashboard-secondary-value">{right.secondary.value}</p>
          </div>
        )}
      </div>
    </div>
  );
}
