import { useNavigate, useLocation, Link } from "react-router-dom";
import BrandMark from "./BrandMark";
import ThemeToggle from "./ThemeToggle";
import { PRIMARY_NAV, ACCOUNT_NAV, isNavActive } from "@/config/appNavigation";
import type { AppNavItem } from "@/config/appNavigation";
import type { User } from "@/types";
import type { Subscription } from "@/services/subscriptionService/subscriptionService";

interface AppMobileNavProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  isPremium: boolean;
  subscription: Subscription | null;
  notificationCount: number;
  onLogout: () => void;
}

export default function AppMobileNav({
  open,
  onClose,
  user,
  isPremium,
  subscription,
  notificationCount,
  onLogout,
}: AppMobileNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const go = (path: string) => {
    navigate(path);
    onClose();
  };

  const renderLink = (item: AppNavItem) => {
    const active = isNavActive(location.pathname, item.path);
    const isNotifications = item.path === "/notifications";
    return (
      <button
        key={item.path}
        type="button"
        onClick={() => go(item.path)}
        className={`header-app-mobile-link ${active ? "is-active" : ""}`}
      >
        <span className="header-app-mobile-link-icon">
          <i className={`pi ${item.icon}`} />
        </span>
        <span className="header-app-mobile-link-text">
          <span className="header-app-mobile-link-label">{item.label}</span>
          {item.description ? (
            <span className="header-app-mobile-link-desc">{item.description}</span>
          ) : null}
        </span>
        {isNotifications && notificationCount > 0 ? (
          <span className="header-app-mobile-badge">
            {notificationCount > 99 ? "99+" : notificationCount}
          </span>
        ) : (
          <i className="pi pi-chevron-right header-app-mobile-link-arrow" />
        )}
      </button>
    );
  };

  return (
    <>
      <div
        className={`header-app-mobile-backdrop ${open ? "is-open" : ""}`}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={`header-app-mobile-drawer ${open ? "is-open" : ""}`}
        role="dialog"
        aria-label="Navigation menu"
      >
        <div className="header-app-mobile-head">
          <BrandMark size="sm" to="/" onClick={onClose} />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={onClose}
              className="header-app-icon-btn"
              aria-label="Close menu"
            >
              <i className="pi pi-times" />
            </button>
          </div>
        </div>

        {user ? (
          <div className="header-app-mobile-user">
            <div className="relative flex-shrink-0">
              <div
                className={`header-app-avatar header-app-avatar--lg${
                  isPremium ? " header-app-avatar--premium" : ""
                }`}
              >
                <span>{(user.name || "U")[0].toUpperCase()}</span>
              </div>
              {isPremium ? (
                <span className="header-app-premium" title="Premium">
                  <i className="pi pi-star-fill" />
                </span>
              ) : null}
            </div>
            <div className="min-w-0">
              <p className="header-app-dropdown-name">{user.name || "User"}</p>
              <p className="header-app-dropdown-meta">{user.mobileNumber || "No phone"}</p>
              {isPremium ? (
                <p className="header-app-dropdown-plan">
                  <i className="pi pi-star-fill" />
                  {subscription?.plan?.name || "Premium"}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <nav className="header-app-mobile-body" aria-label="Mobile navigation">
          {PRIMARY_NAV.map(renderLink)}
          <div className="header-app-mobile-divider" />
          {ACCOUNT_NAV.map(renderLink)}
        </nav>

        <div className="header-app-mobile-foot">
          <button type="button" className="header-app-mobile-logout" onClick={onLogout}>
            <i className="pi pi-sign-out" />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
