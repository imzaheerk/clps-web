import { Link } from "react-router-dom";
import {
  DISCOVERY_RADIUS_OPTIONS,
  type DiscoveryRadiusKm,
} from "@/constants/discoveryRadius";

interface DiscoveryRadiusControlProps {
  value: number;
  onChange: (value: DiscoveryRadiusKm) => void;
  isPremium: boolean;
  disabled?: boolean;
  onPremiumBlocked?: () => void;
  compact?: boolean;
}

export function DiscoveryRadiusControl({
  value,
  onChange,
  isPremium,
  disabled,
  onPremiumBlocked,
  compact,
}: DiscoveryRadiusControlProps) {
  return (
    <div
      className={`app-discovery-radius${compact ? " app-discovery-radius--compact" : ""}`}
      role="group"
      aria-label="Discovery radius"
    >
      {DISCOVERY_RADIUS_OPTIONS.map((option) => {
        const locked = option.premium && !isPremium;
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            className={`app-discovery-radius-chip${active ? " is-active" : ""}${
              locked ? " is-locked" : ""
            }`}
            disabled={disabled}
            aria-pressed={active}
            onClick={() => {
              if (locked) {
                onPremiumBlocked?.();
                return;
              }
              onChange(option.value);
            }}
          >
            {option.label}
            {option.premium ? (
              <i className="pi pi-star-fill app-discovery-radius-premium-icon" aria-hidden />
            ) : null}
          </button>
        );
      })}
      {!isPremium ? (
        <p className="app-discovery-radius-hint">
          <Link to="/subscription">Upgrade to premium</Link> for 5 km or city-wide discovery.
        </p>
      ) : null}
    </div>
  );
}
