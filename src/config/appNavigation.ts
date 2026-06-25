export interface AppNavItem {
  path: string;
  label: string;
  icon: string;
  description?: string;
}

/** Core app screens — shown in desktop header & mobile drawer */
export const PRIMARY_NAV: AppNavItem[] = [
  { path: "/", label: "Home", icon: "pi-home", description: "Your dashboard" },
  { path: "/feed", label: "Local feed", icon: "pi-bolt", description: "Announcements & events" },
  { path: "/search", label: "Search", icon: "pi-search", description: "Find people & businesses" },
  { path: "/messaging", label: "Messages", icon: "pi-comments", description: "Active conversations" },
  { path: "/announcements", label: "Announcements", icon: "pi-megaphone", description: "Local updates" },
  { path: "/events", label: "Events", icon: "pi-calendar", description: "Local meetups & gatherings" },
  { path: "/invite", label: "Invite neighbors", icon: "pi-users", description: "Share & earn rewards" },
  { path: "/business", label: "Business", icon: "pi-briefcase", description: "Manage your listings" },
  { path: "/messaging/requests", label: "Chat requests", icon: "pi-user-plus", description: "Pending invites" },
  { path: "/number-reveal-requests", label: "Number reveal", icon: "pi-eye", description: "Privacy requests" },
];

/** Account & billing — user menu + mobile drawer */
export const ACCOUNT_NAV: AppNavItem[] = [
  { path: "/profile", label: "My profile", icon: "pi-user", description: "Account details" },
  { path: "/notifications", label: "Notifications", icon: "pi-bell", description: "Alerts & activity" },
  { path: "/subscription", label: "Subscription", icon: "pi-credit-card", description: "Current plan" },
  { path: "/plans", label: "Plans & pricing", icon: "pi-star", description: "Upgrade options" },
];

export interface DashboardSection {
  id: string;
  title: string;
  description: string;
  items: AppNavItem[];
}

export const DASHBOARD_SECTIONS: DashboardSection[] = [
  {
    id: "discover",
    title: "Discover",
    description: "Explore your local network and find what you need.",
    items: [
      { path: "/feed", label: "Local feed", icon: "pi-bolt", description: "Everything nearby in one stream" },
      { path: "/search", label: "Search", icon: "pi-search", description: "People & businesses nearby" },
      { path: "/saved-searches", label: "Saved searches", icon: "pi-bookmark", description: "Alerts for your queries" },
      { path: "/announcements", label: "Announcements", icon: "pi-megaphone", description: "Updates in your area" },
      { path: "/events", label: "Local events", icon: "pi-calendar", description: "Meetups near you" },
      { path: "/invite", label: "Invite neighbors", icon: "pi-users", description: "Share your link & earn" },
      { path: "/business", label: "My business", icon: "pi-briefcase", description: "Listings you manage" },
    ],
  },
  {
    id: "connect",
    title: "Connect",
    description: "Messages, requests, and privacy controls.",
    items: [
      { path: "/messaging", label: "Messages", icon: "pi-comments", description: "Your conversations" },
      { path: "/messaging/requests", label: "Chat requests", icon: "pi-user-plus", description: "Pending invites" },
      { path: "/number-reveal-requests", label: "Number reveal", icon: "pi-eye", description: "Who can see your number" },
    ],
  },
  {
    id: "account",
    title: "Account",
    description: "Profile, alerts, and subscription settings.",
    items: [
      { path: "/profile", label: "My profile", icon: "pi-user", description: "Personal information" },
      { path: "/notifications", label: "Notifications", icon: "pi-bell", description: "Recent activity" },
      { path: "/subscription", label: "Subscription", icon: "pi-credit-card", description: "Plan & billing" },
      { path: "/plans", label: "Plans", icon: "pi-star", description: "Compare pricing" },
    ],
  },
];

export const ALL_APP_NAV: AppNavItem[] = [...PRIMARY_NAV, ...ACCOUNT_NAV];

export function isNavActive(pathname: string, path: string): boolean {
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}
