import type { BusinessAnalytics } from "@/services/businessAnalyticsService/businessAnalyticsService";

interface BarItem {
  key: string;
  label: string;
  value: number;
  color: string;
}

interface BusinessAnalyticsChartsProps {
  analytics: BusinessAnalytics;
}

function maxValue(items: BarItem[]): number {
  return Math.max(1, ...items.map((i) => i.value));
}

export function BusinessAnalyticsCharts({ analytics }: BusinessAnalyticsChartsProps) {
  const totals: BarItem[] = [
    { key: "impressions", label: "Search views", value: analytics.totals.impressions, color: "#38bdf8" },
    { key: "profileClicks", label: "Profile clicks", value: analytics.totals.profileClicks, color: "#ff6000" },
    { key: "messageRequests", label: "Message requests", value: analytics.totals.messageRequests, color: "#a78bfa" },
  ];

  const totalsMax = maxValue(totals);
  const recentDaily = analytics.daily.slice(-7);
  const dailyMax = Math.max(
    1,
    ...recentDaily.flatMap((d) => [d.impressions, d.profileClicks, d.messageRequests])
  );

  return (
    <div className="app-business-analytics">
      <div className="app-business-analytics-totals">
        {totals.map((item) => (
          <div key={item.key} className="app-business-analytics-stat">
            <div className="app-business-analytics-stat-head">
              <span className="app-business-analytics-stat-label">{item.label}</span>
              <strong className="app-business-analytics-stat-value">{item.value}</strong>
            </div>
            <div className="app-business-analytics-bar-track">
              <span
                className="app-business-analytics-bar-fill"
                style={{
                  width: `${(item.value / totalsMax) * 100}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {recentDaily.length > 0 ? (
        <div className="app-business-analytics-daily">
          <h3 className="app-business-analytics-daily-title">Last 7 days</h3>
          <div className="app-business-analytics-daily-chart">
            {recentDaily.map((day) => {
              const dayTotal =
                day.impressions + day.profileClicks + day.messageRequests;
              const heightPct = (dayTotal / dailyMax) * 100;
              const label = new Date(day.date).toLocaleDateString(undefined, {
                weekday: "short",
              });
              return (
                <div key={day.date} className="app-business-analytics-day">
                  <div className="app-business-analytics-day-bar-wrap">
                    <span
                      className="app-business-analytics-day-bar"
                      style={{ height: `${heightPct}%` }}
                      title={`${dayTotal} events`}
                    />
                  </div>
                  <span className="app-business-analytics-day-label">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="app-business-analytics-empty">
          No activity yet. Views appear when neighbours find your listing in search.
        </p>
      )}
    </div>
  );
}
