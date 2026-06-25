export const DEFAULT_DISCOVERY_RADIUS_KM = 2;
export const CITY_WIDE_RADIUS_KM = 0;

export const DISCOVERY_RADIUS_OPTIONS = [
  { value: 1, label: "1 km", premium: false },
  { value: 2, label: "2 km", premium: false },
  { value: 5, label: "5 km", premium: true },
  { value: 0, label: "City-wide", premium: true },
] as const;

export type DiscoveryRadiusKm = (typeof DISCOVERY_RADIUS_OPTIONS)[number]["value"];

export function discoveryRadiusLabel(radiusKm: number): string {
  return (
    DISCOVERY_RADIUS_OPTIONS.find((o) => o.value === radiusKm)?.label ??
    `${radiusKm} km`
  );
}

export function isPremiumDiscoveryRadius(radiusKm: number): boolean {
  return radiusKm > DEFAULT_DISCOVERY_RADIUS_KM || radiusKm === CITY_WIDE_RADIUS_KM;
}
