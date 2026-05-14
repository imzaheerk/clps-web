import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog } from "primereact/dialog";
import Button from "./Button";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { notificationService } from "@/services/notificationService/notificationService";
import { useSubscription } from "@/hooks/useSubscription";

interface HeaderProps {
  showAuthButtons?: boolean;
}

export default function Header({ showAuthButtons = true }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const { subscription } = useSubscription(user?.id ?? null, isAuthenticated);
  const isPremium =
    isAuthenticated &&
    subscription?.status === "active" &&
    subscription?.plan &&
    !subscription.plan.isDefault &&
    subscription.plan.price > 0;
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

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

  const handleMobileNavClick = (path: string) => {
    navigate(path);
    setShowMobileMenu(false);
  };

  const handleUserButtonClick = () => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
      setShowUserMenu(false);
      setShowMobileMenu(true);
    } else {
      setShowUserMenu((prev) => !prev);
    }
  };

  const openMobileMenu = () => {
    setShowUserMenu(false);
    setShowMobileMenu(true);
  };

  const navItems = [
    { path: "/", label: "Home", icon: "pi-home" },
    { path: "/search", label: "Search", icon: "pi-search" },
    { path: "/messaging", label: "Messages", icon: "pi-comments" },
    { path: "/announcements", label: "Announcements", icon: "pi-megaphone" },
    { path: "/profile", label: "Profile", icon: "pi-user" },
  ];

  return (
    <>
      <header
        className={`header-bar fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          isScrolled ? "shadow-lg" : ""
        }`}
      >
        <div className="relative max-w-[1400px] mx-auto px-2.5 sm:px-6 lg:px-8">
          <div
            className={`items-center h-14 md:h-[72px] gap-2 sm:gap-4 ${
              isAuthenticated
                ? "flex justify-between md:grid md:grid-cols-[1fr_auto_1fr]"
                : "grid grid-cols-[minmax(0,1fr)_auto] gap-x-2 sm:gap-x-4"
            }`}
          >
            {/* Left: Hamburger (when logged in) + Logo */}
            <div className="flex items-center gap-2 sm:gap-6 min-w-0 overflow-hidden">
              {isAuthenticated && (
                <button
                  onClick={openMobileMenu}
                  className="md:hidden p-2 -ml-1 rounded-xl text-text-secondary hover:text-primary hover:bg-primary/10 transition-all active:scale-95 touch-manipulation shrink-0"
                  aria-label="Open menu"
                >
                  <i className="pi pi-bars text-lg" />
                </button>
              )}
              <Link
                to="/"
                className="min-w-0 max-w-full shrink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
              >
                <Logo />
              </Link>
            </div>

            {/* Center: Nav tray only when logged in (desktop) */}
            {isAuthenticated && (
              <nav className="hidden md:flex nav-tray justify-center" aria-label="Main">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-link-pill px-4 py-2.5 text-sm font-semibold no-underline flex items-center gap-2.5 ${
                      isActive(item.path) ? "active" : "text-text-secondary hover:text-primary hover:bg-primary/10"
                    }`}
                  >
                    <i className={`pi ${item.icon} text-[15px]`} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            )}

            {/* Right: Theme (hidden on mobile when logged in), Notifications, User / Auth */}
            <div className="flex items-center justify-end gap-1 sm:gap-2 md:gap-3 shrink-0 [&_.theme-pill]:shrink-0">
              <div className={isAuthenticated ? "hidden md:block" : undefined}>
                <ThemeToggle />
              </div>
              {isAuthenticated && (
                <>
                  <Link
                    to="/notifications"
                    className="relative p-2 sm:p-2.5 rounded-xl text-text-secondary hover:text-primary hover:bg-primary/10 transition-all active:scale-95 touch-manipulation"
                    title="Notifications"
                    aria-label={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ""}`}
                  >
                    <i className="pi pi-bell text-lg sm:text-xl" />
                    {notificationCount > 0 && (
                      <span className="header-badge absolute -top-0.5 -right-0.5 min-w-[18px] h-4 sm:min-w-[20px] sm:h-5 px-1 rounded-full bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center shadow-md ring-2 ring-bg-primary">
                        <span className="text-[9px] sm:text-[10px] font-bold text-white">
                          {notificationCount > 99 ? "99+" : notificationCount > 9 ? "9+" : notificationCount}
                        </span>
                      </span>
                    )}
                  </Link>
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={handleUserButtonClick}
                      className="flex items-center gap-1.5 sm:gap-2.5 pl-0.5 sm:pl-1 pr-2 sm:pr-2.5 py-1 sm:py-1.5 rounded-xl text-text-primary hover:bg-primary/10 transition-all active:scale-[0.98] touch-manipulation"
                      title="User Menu"
                      aria-label="User menu"
                      aria-expanded={showUserMenu}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary via-cyan-500 to-sky-600 flex items-center justify-center shadow-lg shadow-primary/25 border-2 border-white/20 dark:border-slate-600/50">
                          <span className="text-white font-bold text-xs sm:text-sm">{(user?.name || "U")[0].toUpperCase()}</span>
                        </div>
                        {isPremium && (
                          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center border-2 border-bg-primary" title="Premium">
                            <i className="pi pi-star-fill text-[8px] text-white" />
                          </span>
                        )}
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-success rounded-full border-2 border-bg-primary" title="Online" />
                      </div>
                      <i className={`pi pi-chevron-down text-xs transition-transform duration-200 hidden sm:block ${showUserMenu ? "rotate-180" : ""}`} />
                    </button>
                    {/* User dropdown: desktop only; on mobile avatar opens drawer */}
                    {showUserMenu && (
                      <div className="header-dropdown header-dropdown-in absolute right-0 top-full mt-2 w-[min(288px,calc(100vw-1.5rem))] sm:w-72 z-50 hidden md:block">
                        <div className="p-3 sm:p-4 border-b border-border">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary via-cyan-500 to-sky-600 flex items-center justify-center shadow-lg border-2 border-border flex-shrink-0 relative">
                              <span className="text-white font-bold text-base sm:text-lg">{(user?.name || "U")[0].toUpperCase()}</span>
                              {isPremium && (
                                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center border-2 border-bg-primary" title="Premium">
                                  <i className="pi pi-star-fill text-[10px] text-white" />
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-text-primary truncate">{user?.name || "User"}</p>
                              <p className="text-xs text-text-secondary truncate">{user?.mobileNumber || "No phone"}</p>
                              {isPremium && (
                                <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mt-0.5 flex items-center gap-1">
                                  <i className="pi pi-star-fill" />
                                  {subscription?.plan?.name || "Premium"} plan
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="py-2">
                          {[
                            { path: "/profile", label: "My Profile", icon: "pi-user" },
                            { path: "/subscription", label: "Subscription", icon: "pi-credit-card" },
                            { path: "/plans", label: "Plans & Pricing", icon: "pi-star" },
                          ].map(({ path, label, icon }) => (
                            <button
                              key={path}
                              onClick={() => {
                                navigate(path);
                                setShowUserMenu(false);
                              }}
                              className="w-full text-left px-4 py-3 text-sm font-medium text-text-secondary hover:text-primary hover:bg-primary/10 flex items-center gap-3 transition-colors"
                            >
                              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <i className={`pi ${icon} text-sm`} />
                              </span>
                              <span>{label}</span>
                            </button>
                          ))}
                          <div className="border-t border-border my-2" />
                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              setShowLogoutModal(true);
                            }}
                            className="w-full text-left px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-500/10 flex items-center gap-3 transition-colors"
                          >
                            <span className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                              <i className="pi pi-sign-out text-sm" />
                            </span>
                            <span className="text-red-500">Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
              {!isAuthenticated && showAuthButtons && (
                <>
                  {/* Compact icon actions on small screens — full labels from md up */}
                  <Button
                    icon="pi pi-sign-in"
                    aria-label="Login"
                    onClick={() => navigate("/login")}
                    variant="outlined"
                    Size="small"
                    className="md:!hidden !h-9 !w-9 !min-w-[2.25rem] !p-0 shrink-0 [&_.p-button-icon]:m-0 [&_.p-button-label]:hidden"
                  />
                  <Button
                    icon="pi pi-user-plus"
                    aria-label="Sign up"
                    onClick={() => navigate("/signup")}
                    variant="gradient"
                    Size="small"
                    className="md:!hidden !h-9 !w-9 !min-w-[2.25rem] !p-0 shrink-0 [&_.p-button-icon]:m-0 [&_.p-button-label]:hidden"
                  />
                  <Button
                    label="Login"
                    icon="pi pi-sign-in"
                    onClick={() => navigate("/login")}
                    variant="outlined"
                    Size="small"
                    className="!hidden md:!inline-flex"
                  />
                  <Button
                    label="Sign Up"
                    icon="pi pi-user-plus"
                    onClick={() => navigate("/signup")}
                    variant="gradient"
                    Size="small"
                    className="!hidden md:!inline-flex"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-14 md:h-[72px]" />

      {/* Mobile menu backdrop */}
      <div
        className={`fixed inset-0 z-[200] md:hidden transition-opacity duration-300 bg-black/60 backdrop-blur-sm [data-theme="dark"]:bg-black/75 ${
          showMobileMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowMobileMenu(false)}
        aria-hidden
      />
      {/* Mobile sidebar - cool drawer with gradient edge */}
      <div
        className={`fixed inset-y-0 left-0 w-[300px] max-w-[85vw] z-[201] md:hidden transition-transform duration-300 ease-out ${
          showMobileMenu ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-label="Main menu"
      >
        <div className="flex flex-col h-full bg-bg-primary border-r border-border shadow-2xl">
          {/* Gradient accent on right edge of drawer */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-primary/60 via-cyan-500/40 to-transparent opacity-80" />
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Logo />
            <div className="flex items-center gap-2">
              <div className="md:hidden">
                <ThemeToggle />
              </div>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2.5 rounded-xl text-text-secondary hover:text-primary hover:bg-primary/10 transition-all active:scale-95 touch-manipulation"
                aria-label="Close menu"
              >
                <i className="pi pi-times text-xl" />
              </button>
            </div>
          </div>
          {isAuthenticated && user && (
            <div className="px-4 py-4 border-b border-border">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-cyan-500 to-sky-600 flex items-center justify-center shadow-md border-2 border-border flex-shrink-0">
                  <span className="text-white font-bold text-lg">{(user.name || "U")[0].toUpperCase()}</span>
                  {isPremium && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center border-2 border-bg-primary" title="Premium">
                      <i className="pi pi-star-fill text-[10px] text-white" />
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-text-primary truncate">{user.name || "User"}</p>
                  <p className="text-xs text-text-secondary truncate">{user.mobileNumber || "No phone"}</p>
                  {isPremium && (
                    <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mt-0.5 flex items-center gap-1">
                      <i className="pi pi-star-fill" />
                      {subscription?.plan?.name || "Premium"} plan
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          {isAuthenticated && (
            <nav className="flex-1 overflow-y-auto py-4 px-3" aria-label="Mobile navigation">
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleMobileNavClick(item.path)}
                    className={`w-full text-left py-3.5 px-4 rounded-xl text-sm font-semibold flex items-center gap-3 transition-all ${
                      isActive(item.path)
                        ? "text-primary bg-primary/10 border-l-4 border-l-primary -ml-[3px] pl-[calc(1rem+3px)]"
                        : "text-text-secondary hover:text-primary hover:bg-primary/10 border-l-4 border-l-transparent"
                    }`}
                  >
                    <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${isActive(item.path) ? "bg-primary/20 text-primary" : "bg-bg-tertiary text-text-secondary"}`}>
                      <i className={`pi ${item.icon}`} />
                    </span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </nav>
          )}
          {isAuthenticated && (
            <div className="p-4 border-t border-border space-y-2 bg-bg-secondary/50">
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  navigate("/subscription");
                }}
                className="w-full text-left py-3 px-4 rounded-xl text-sm font-medium text-text-secondary hover:text-primary hover:bg-primary/10 flex items-center gap-3 transition-colors"
              >
                <span className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <i className="pi pi-credit-card" />
                </span>
                <span>Subscription</span>
              </button>
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  setShowLogoutModal(true);
                }}
                className="w-full text-left py-3 px-4 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 flex items-center gap-3 transition-colors"
              >
                <span className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                  <i className="pi pi-sign-out" />
                </span>
                <span className="text-red-500">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logout Modal */}
      <Dialog
        visible={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
        header="Confirm Logout"
        modal
        className="w-full max-w-md"
        footer={
          <div className="flex gap-2 justify-end">
            <Button
              label="Cancel"
              onClick={() => setShowLogoutModal(false)}
              variant="outlined"
              Size="medium"
              type="button"
            />
            <Button
              label="Logout"
              icon="pi pi-sign-out"
              onClick={handleLogout}
              variant="primary"
              Size="medium"
              type="button"
            />
          </div>
        }
      >
        <p className="text-text-primary m-0">
          Are you sure you want to logout? You will need to login again to access your account.
        </p>
      </Dialog>
    </>
  );
}
