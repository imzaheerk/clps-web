import { useEffect, useState } from "react";
import {
  formatStatCount,
  cityLabel,
  type CommunityStats,
} from "@/services/communityStatsService/communityStatsService";

function useCountUp(target: number, duration = 1200, enabled = true) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled || target <= 0) {
      setValue(target);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, enabled]);

  return value;
}

interface LiveCommunityCounterProps {
  stats: CommunityStats | null;
  loading?: boolean;
  variant?: "hero" | "section" | "compact";
  className?: string;
}

export default function LiveCommunityCounter({
  stats,
  loading,
  variant = "section",
  className = "",
}: LiveCommunityCounterProps) {
  const members = useCountUp(stats?.totalMembers ?? 0, 1400, !loading && !!stats);
  const businesses = useCountUp(stats?.totalBusinesses ?? 0, 1400, !loading && !!stats);
  const cities = useCountUp(stats?.totalCities ?? 0, 1000, !loading && !!stats);
  const announcements = useCountUp(
    stats?.totalAnnouncements ?? 0,
    1200,
    !loading && !!stats
  );

  const featured = stats?.featuredCity;

  if (variant === "hero") {
    return (
      <div className={`landing-live-stats landing-live-stats--hero ${className}`.trim()}>
        <div className="landing-live-stat">
          <span className="landing-live-stat-value">
            {loading ? "—" : formatStatCount(members)}
          </span>
          <span className="landing-live-stat-label">Members nearby</span>
        </div>
        <div className="landing-live-stat-divider" aria-hidden="true" />
        <div className="landing-live-stat">
          <span className="landing-live-stat-value">
            {loading ? "—" : formatStatCount(businesses)}
          </span>
          <span className="landing-live-stat-label">Local businesses</span>
        </div>
        <div className="landing-live-stat-divider" aria-hidden="true" />
        <div className="landing-live-stat">
          <span className="landing-live-stat-value">
            {loading ? "—" : formatStatCount(cities)}
          </span>
          <span className="landing-live-stat-label">Cities active</span>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <p className={`landing-live-featured ${className}`.trim()}>
        {loading ? (
          <span className="landing-live-pulse">Loading live community stats…</span>
        ) : featured && featured.members > 0 ? (
          <>
            <span className="landing-live-dot" aria-hidden="true" />
            <strong>{formatStatCount(featured.members)}</strong> people in{" "}
            <strong>{cityLabel(featured)}</strong>
            {featured.businesses > 0 ? (
              <>
                {" "}
                · <strong>{formatStatCount(featured.businesses)}</strong> businesses
              </>
            ) : null}
          </>
        ) : stats && stats.totalMembers > 0 ? (
          <>
            <span className="landing-live-dot" aria-hidden="true" />
            <strong>{formatStatCount(stats.totalMembers)}</strong> members across{" "}
            <strong>{formatStatCount(stats.totalCities)}</strong> cities
          </>
        ) : (
          <span>Community growing — be among the first in your area.</span>
        )}
      </p>
    );
  }

  return (
    <div className={`landing-live-stats landing-live-stats--section ${className}`.trim()}>
      <div className="landing-live-stats-grid">
        <article className="landing-live-stat-card">
          <span className="landing-live-stat-card-value">
            {loading ? "—" : formatStatCount(members)}
          </span>
          <span className="landing-live-stat-card-label">Active members</span>
        </article>
        <article className="landing-live-stat-card">
          <span className="landing-live-stat-card-value">
            {loading ? "—" : formatStatCount(businesses)}
          </span>
          <span className="landing-live-stat-card-label">Local businesses</span>
        </article>
        <article className="landing-live-stat-card">
          <span className="landing-live-stat-card-value">
            {loading ? "—" : formatStatCount(announcements)}
          </span>
          <span className="landing-live-stat-card-label">Announcements</span>
        </article>
        <article className="landing-live-stat-card">
          <span className="landing-live-stat-card-value">
            {loading ? "—" : formatStatCount(cities)}
          </span>
          <span className="landing-live-stat-card-label">Cities</span>
        </article>
      </div>

      {!loading && stats && stats.cities.length > 0 ? (
        <div className="landing-live-cities">
          <p className="landing-live-cities-label">Top communities</p>
          <div className="landing-live-city-chips">
            {stats.cities.map((c) => (
              <span key={`${c.city}-${c.state ?? ""}`} className="landing-live-city-chip">
                <strong>{cityLabel(c)}</strong>
                <span>
                  {formatStatCount(c.members)} people
                  {c.businesses > 0 ? ` · ${formatStatCount(c.businesses)} businesses` : ""}
                </span>
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
