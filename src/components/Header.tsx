import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import BrandMark from "./BrandMark";
import { useAuth } from "@/contexts/AuthContext";
import ResendModal from "./ResendModal";
import AppMobileNav from "./AppMobileNav";
import ThemeToggle from "./ThemeToggle";
import { notificationService } from "@/services/notificationService/notificationService";
import { useSubscription } from "@/hooks/useSubscription";
import {
  PRIMARY_NAV,
  ACCOUNT_NAV,
  isNavActive,
} from "@/config/appNavigation";

interface HeaderProps {
  showAuthButtons?: boolean;
}

export default function Header({ showAuthButtons = true }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const { subscription } = useSubscription(user?.id ?? null, isAuthenticated);
  const isPremium = Boolean(
    isAuthenticated &&
      subscription?.status === "active" &&
      subscription?.plan &&
      !subscription.plan.isDefault &&
      subscription.plan.price > 0
  );
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLandingMenu, setActiveLandingMenu] = useState<string | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const landingMenuCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = (path: string) => isNavActive(location.pathname, path);

  // Load notification count
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const loadNotificationCount = async () => {
        try {
          const count = await notificationService.getNotificationCount(user.id);
          setNotificationCount(count);
        } catch (error) {
          // Silently fail
        }
      };

      loadNotificationCount();

      // Refresh when tab/window becomes visible
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          loadNotificationCount();
        }
      };

      // Refresh when notification is updated
      const handleNotificationUpdate = () => {
        loadNotificationCount();
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("notification-updated", handleNotificationUpdate);

      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("notification-updated", handleNotificationUpdate);
      };
    }
  }, [isAuthenticated, user, location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobileMenu]);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/");
  };

  const handleUserButtonClick = () => {
    setShowUserMenu((prev) => !prev);
  };

  const openMobileMenu = () => {
    setShowUserMenu(false);
    setShowMobileMenu(true);
  };

  const landingMenuItems = [
    {
      key: "features",
      label: "Features",
      title: "Powerful discovery features",
      description:
        "Explore tools designed to help people find the right connections quickly and safely.",
      linksLeft: ["Smart profile discovery", "Community-focused matching", "Easy mobile-first experience"],
      linksRight: ["Location-based filters", "Interest tags", "Saved searches"],
      cards: [
        {
          title: "Local discovery",
          subtitle: "Find people and groups around you with map-first browsing.",
          variant: "grid" as const,
        },
        {
          title: "Trusted matching",
          subtitle: "Connect through shared interests, locality, and community signals.",
          variant: "arc" as const,
        },
      ],
    },
    {
      key: "services",
      label: "Services",
      title: "Services you can trust",
      description:
        "Checknown supports meaningful interactions with a reliable and easy-to-use platform.",
      linksLeft: ["Verified member ecosystem", "Messaging and announcements", "Real-time notifications"],
      linksRight: ["Profile visibility controls", "Contact requests", "Premium plans"],
      cards: [
        {
          title: "Messaging",
          subtitle: "Secure conversations with the people that matter to you.",
          variant: "grid" as const,
        },
        {
          title: "Announcements",
          subtitle: "Share and discover updates that are relevant to your area.",
          variant: "arc" as const,
        },
      ],
    },
    {
      key: "how-it-works",
      label: "How it works",
      title: "Simple three-step flow",
      description:
        "Get started in minutes and begin building better local and professional connections.",
      linksLeft: ["Create your profile", "Search and discover people", "Connect and collaborate"],
      linksRight: ["Set privacy preferences", "Send your first message", "Grow your network"],
      cards: [
        {
          title: "Get started fast",
          subtitle: "Sign up, set your location, and start exploring in minutes.",
          variant: "grid" as const,
        },
        {
          title: "Build connections",
          subtitle: "Move from discovery to conversation with a simple guided flow.",
          variant: "arc" as const,
        },
      ],
    },
    {
      key: "community",
      label: "Community",
      title: "Built for connected communities",
      description:
        "From local groups to professionals, Checknown helps people stay connected.",
      linksLeft: ["Use-case focused approach", "Supportive network growth", "Designed for trust and safety"],
      linksRight: ["Local groups", "Neighbourhood updates", "Professional circles"],
      cards: [
        {
          title: "Growing network",
          subtitle: "Join people who are already connecting in your area every day.",
          variant: "grid" as const,
        },
        {
          title: "Safe by design",
          subtitle: "Privacy controls and reporting tools keep communities healthy.",
          variant: "arc" as const,
        },
      ],
    },
  ];

  useEffect(() => {
    return () => {
      if (landingMenuCloseTimeoutRef.current) {
        clearTimeout(landingMenuCloseTimeoutRef.current);
      }
    };
  }, []);

  const handleLandingMenuOpen = (menuKey: string) => {
    if (landingMenuCloseTimeoutRef.current) {
      clearTimeout(landingMenuCloseTimeoutRef.current);
      landingMenuCloseTimeoutRef.current = null;
    }
    setActiveLandingMenu(menuKey);
  };

  const handleLandingMenuClose = () => {
    if (landingMenuCloseTimeoutRef.current) {
      clearTimeout(landingMenuCloseTimeoutRef.current);
    }
    landingMenuCloseTimeoutRef.current = setTimeout(() => {
      setActiveLandingMenu(null);
    }, 160);
  };

  const clearLandingMenuClose = () => {
    if (landingMenuCloseTimeoutRef.current) {
      clearTimeout(landingMenuCloseTimeoutRef.current);
      landingMenuCloseTimeoutRef.current = null;
    }
  };

  const activeLandingMenuItem = landingMenuItems.find((item) => item.key === activeLandingMenu);

  const isLandingHeader = !isAuthenticated;

  const toggleLandingMobileMenu = () => {
    setShowMobileMenu((prev) => {
      if (prev) setActiveLandingMenu(null);
      return !prev;
    });
  };

  const scrollToPricing = () => {
    const goToPricing = () => {
      const section = document.getElementById("pricing");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    if (location.pathname !== "/") {
      navigate("/#pricing");
      setTimeout(goToPricing, 120);
      return;
    }

    goToPricing();
  };

  const renderLandingNavItem = (item: (typeof landingMenuItems)[number], onSelect?: () => void) => {
    const isActiveLandingItem = activeLandingMenu === item.key;
    return (
      <button
        key={item.key}
        id={`landing-nav-${item.key}`}
        type="button"
        className={`header-landing-nav-item group ${isActiveLandingItem ? "active" : ""}`}
        onMouseEnter={() => handleLandingMenuOpen(item.key)}
        onFocus={() => handleLandingMenuOpen(item.key)}
        onClick={() => {
          handleLandingMenuOpen(item.key);
          onSelect?.();
        }}
        aria-expanded={isActiveLandingItem}
        aria-haspopup="dialog"
      >
        {item.label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`header-landing-chevron ${isActiveLandingItem ? "is-open" : ""}`}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    );
  };

  const renderLandingMegaMenu = (embedded = false) => {
    if (!activeLandingMenuItem) return null;

    return (
      <div
        className={`header-mega-menu-panel${embedded ? " header-mega-menu-panel--embedded" : ""}`}
        role="dialog"
        aria-label={`${activeLandingMenuItem.label} menu`}
      >
        <div key={activeLandingMenuItem.key} className="header-mega-menu-content">
          <div className="header-mega-menu-intro">
            <p className="header-mega-menu-kicker">{activeLandingMenuItem.label}</p>
            <h3 className="header-mega-menu-title">{activeLandingMenuItem.title}</h3>
            <p className="header-mega-menu-description">{activeLandingMenuItem.description}</p>
          </div>
          <div className="header-mega-menu-grid">
            <div className="header-mega-menu-links">
              <ul className="header-mega-link-col">
                {activeLandingMenuItem.linksLeft.map((link) => (
                  <li key={link}>
                    <span className="header-mega-link">{link}</span>
                  </li>
                ))}
              </ul>
              <ul className="header-mega-link-col">
                {activeLandingMenuItem.linksRight.map((link) => (
                  <li key={link}>
                    <span className="header-mega-link">{link}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="header-mega-menu-cards">
              {activeLandingMenuItem.cards.map((card) => (
                <div
                  key={card.title}
                  className={`header-mega-card header-mega-card--${card.variant}`}
                >
                  <div className="header-mega-card-visual" aria-hidden="true" />
                  <div className="header-mega-card-copy">
                    <p className="header-mega-card-title">{card.title}</p>
                    <p className="header-mega-card-subtitle">{card.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {isLandingHeader ? (
        <header
          className={`header-bar header-bar--landing header-bar--fixed z-50 w-full transition duration-200 ease-in-out ${
            isScrolled ? "header-bar--landing-scrolled" : ""
          }`}
          onMouseLeave={handleLandingMenuClose}
        >
          <div
            className="header-landing-wrap"
            onMouseEnter={clearLandingMenuClose}
          >
          <div className="header-shell relative z-10 mx-auto w-full min-h-[60px] max-w-5xl px-6 md:min-h-[58px] md:max-w-7xl">
            {/* Mobile bar */}
            <div className="header-mobile-bar relative z-20 flex w-full flex-col md:hidden">
              <div className="flex w-full items-center px-6 py-4">
                <div className="flex-auto">
                  <Link to="/" className="header-brand-link">
                    <BrandMark size="md" />
                  </Link>
                </div>
                <div className="flex flex-auto items-center justify-end gap-2">
                  <ThemeToggle />
                  <button
                    type="button"
                    onClick={toggleLandingMobileMenu}
                    aria-controls="mobile-menu"
                    aria-expanded={showMobileMenu}
                    aria-label="Open main menu"
                    className="header-menu-btn"
                  >
                    <span className="sr-only">Open main menu</span>
                    <svg
                      aria-hidden="true"
                      className="block h-8 w-8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              {showMobileMenu && (
                <div id="mobile-menu" className="header-landing-mobile-panel w-full px-6 py-5">
                  <ul className="flex flex-col gap-1">
                    {landingMenuItems.map((item) => {
                      const isOpen = activeLandingMenu === item.key;
                      return (
                      <li key={item.key}>
                        <button
                          type="button"
                          className={`landing-mobile-nav-item flex w-full items-center justify-between text-left py-2.5 text-sm font-medium ${isOpen ? "is-active" : ""}`}
                          onClick={() => {
                            if (isOpen) {
                              setActiveLandingMenu(null);
                            } else {
                              handleLandingMenuOpen(item.key);
                            }
                          }}
                          aria-expanded={isOpen}
                        >
                          {item.label}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`header-landing-chevron ${isOpen ? "is-open" : ""}`}
                            aria-hidden="true"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </button>
                      </li>
                    );
                    })}
                    <li>
                      <button
                        type="button"
                        className="landing-mobile-nav-item flex w-full items-center justify-between text-left py-2.5 text-sm font-medium"
                        onClick={() => {
                          setShowMobileMenu(false);
                          setActiveLandingMenu(null);
                          scrollToPricing();
                        }}
                      >
                        Pricing
                      </button>
                    </li>
                  </ul>

                  {activeLandingMenuItem ? (
                    <div className="header-mega-menu-mobile mt-3">
                      {renderLandingMegaMenu(true)}
                    </div>
                  ) : null}

                  {showAuthButtons && (
                    <div className="header-landing-mobile-divider mt-5 flex flex-col gap-3 border-t pt-5">
                      <button type="button" onClick={() => navigate("/login")} className="header-login-text text-left">
                        Log in
                      </button>
                      <button type="button" onClick={() => navigate("/signup")} className="header-get-started-btn w-full">
                        Get started
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Desktop bar */}
            <div className="header-desktop-bar mx-auto hidden h-[58px] w-full items-center md:flex">
              <div className="flex flex-1 lg:w-[225px]">
                <Link to="/" className="header-brand-link py-1">
                  <BrandMark size="md" />
                </Link>
              </div>

              <div className="header-landing-nav-zone relative">
                <ul className="header-landing-nav-list flex items-center">
                  {landingMenuItems.map((item) => (
                    <li key={item.key}>{renderLandingNavItem(item)}</li>
                  ))}
                  <li>
                    <button
                      type="button"
                      className="header-landing-nav-item header-landing-nav-item--link"
                      onClick={scrollToPricing}
                    >
                      Pricing
                    </button>
                  </li>
                </ul>
              </div>

              <div className="flex flex-1 items-center justify-end gap-3">
                <ThemeToggle />
                {showAuthButtons && (
                  <>
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="header-login-text hidden lg:inline-flex"
                    aria-label="Log in"
                  >
                    Log in
                  </button>
                  <button type="button" onClick={() => navigate("/signup")} className="header-get-started-btn">
                    Get started
                  </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {activeLandingMenuItem && (
            <div className="header-mega-menu-portal hidden md:block">
              <div className="header-mega-menu-container">{renderLandingMegaMenu(false)}</div>
            </div>
          )}
          </div>
        </header>
      ) : (
        <>
        <header
          className={`header-bar header-bar--app header-bar--fixed z-[100] transition-all duration-300 ${
            isScrolled ? "header-bar--app-scrolled" : "header-bar--app-top"
          }`}
        >
        <div className="header-app-shell">
          <div className="header-app-inner">
            <BrandMark size="sm" to="/" />

            <nav className="hidden lg:flex header-app-nav" aria-label="Main">
              {PRIMARY_NAV.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`header-app-nav-link ${isActive(item.path) ? "is-active" : ""}`}
                  title={item.description}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex header-app-actions">
              <ThemeToggle />
              <Link
                to="/notifications"
                className={`header-app-icon-btn relative ${isActive("/notifications") ? "is-active" : ""}`}
                title="Notifications"
                aria-label={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ""}`}
              >
                <i className="pi pi-bell" />
                {notificationCount > 0 ? (
                  <span className="header-app-badge">
                    {notificationCount > 99 ? "99+" : notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                ) : null}
              </Link>
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={handleUserButtonClick}
                  className={`header-account-trigger ${showUserMenu ? "is-open" : ""}`}
                  title="Account"
                  aria-label="Account menu"
                  aria-expanded={showUserMenu}
                >
                  <span className="header-account-trigger-name">
                    {user?.name?.split(" ")[0] || "Account"}
                  </span>
                  <span
                    className={`header-account-trigger-avatar${
                      isPremium ? " header-account-trigger-avatar--premium" : ""
                    }`}
                  >
                    {(user?.name || "U")[0].toUpperCase()}
                    {isPremium ? (
                      <span className="header-account-trigger-premium" title="Premium">
                        <i className="pi pi-star-fill" />
                      </span>
                    ) : null}
                  </span>
                </button>
                {showUserMenu ? (
                  <div className="header-account-menu">
                    <div className="header-account-menu-profile">
                      <span
                        className={`header-account-menu-avatar${
                          isPremium ? " header-account-menu-avatar--premium" : ""
                        }`}
                      >
                        {(user?.name || "U")[0].toUpperCase()}
                        {isPremium ? (
                          <span className="header-account-menu-avatar-premium" title="Premium">
                            <i className="pi pi-star-fill" />
                          </span>
                        ) : null}
                      </span>
                      <div className="min-w-0">
                        <p className="header-account-menu-name">{user?.name || "User"}</p>
                        <p className="header-account-menu-meta">{user?.mobileNumber || "No phone"}</p>
                        {isPremium ? (
                          <span className="header-account-menu-plan">
                            <i className="pi pi-star-fill" />
                            {subscription?.plan?.name || "Premium"}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="header-account-menu-divider" />
                    <div className="header-account-menu-links">
                      {ACCOUNT_NAV.map(({ path, label, icon }) => (
                        <button
                          key={path}
                          type="button"
                          onClick={() => {
                            navigate(path);
                            setShowUserMenu(false);
                          }}
                          className={`header-account-menu-link ${isActive(path) ? "is-active" : ""}`}
                        >
                          <span className="header-account-menu-link-icon">
                            <i className={`pi ${icon}`} />
                          </span>
                          <span className="header-account-menu-link-label">{label}</span>
                          {path === "/notifications" && notificationCount > 0 ? (
                            <span className="header-account-menu-badge">
                              {notificationCount > 99 ? "99+" : notificationCount}
                            </span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                    <div className="header-account-menu-divider" />
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowLogoutModal(true);
                      }}
                      className="header-account-menu-logout"
                    >
                      <i className="pi pi-sign-out" />
                      Log out
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={openMobileMenu}
              className="lg:hidden header-app-menu-btn"
              aria-label="Open menu"
            >
              <i className="pi pi-bars" />
            </button>
          </div>
        </div>
      </header>
      <div className="header-spacer header-spacer--app" aria-hidden="true" />
      </>
      )}

      {!isLandingHeader && (
        <AppMobileNav
          open={showMobileMenu}
          onClose={() => setShowMobileMenu(false)}
          user={user}
          isPremium={isPremium}
          subscription={subscription}
          notificationCount={notificationCount}
          onLogout={() => {
            setShowMobileMenu(false);
            setShowLogoutModal(true);
          }}
        />
      )}

      <ResendModal
        visible={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
        badge="Session"
        title="Log out?"
        description="You'll need to sign in again to access your account and messages."
        icon="pi-sign-out"
        tone="danger"
        footer={
          <div className="resend-modal-actions-row">
            <button type="button" className="resend-btn resend-btn-secondary" onClick={() => setShowLogoutModal(false)}>
              Stay signed in
            </button>
            <button type="button" className="resend-btn resend-btn-danger" onClick={handleLogout}>
              <i className="pi pi-sign-out" />
              Log out
            </button>
          </div>
        }
      />
    </>
  );
}
