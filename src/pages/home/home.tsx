import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Header, NetworkBackground } from "@/components";
import "primeicons/primeicons.css";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Search People",
      description: "Find and connect with people",
      icon: "pi pi-search",
      path: "/search",
      gradient: "from-primary to-cyan-600",
    },
    {
      title: "Business",
      description: "List and manage your businesses",
      icon: "pi pi-briefcase",
      path: "/business",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      title: "Number Reveal",
      description: "View and respond to number reveal requests",
      icon: "pi pi-eye",
      path: "/number-reveal-requests",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      title: "My Profile",
      description: "Manage your profile",
      icon: "pi pi-user",
      path: "/profile",
      gradient: "from-cyan-500 to-teal-500",
    },
    {
      title: "Plans & Pricing",
      description: "View subscription plans",
      icon: "pi pi-star",
      path: "/plans",
      gradient: "from-teal-500 to-emerald-500",
    },
    {
      title: "Subscription",
      description: "Manage subscription",
      icon: "pi pi-credit-card",
      path: "/subscription",
      gradient: "from-sky-500 to-cyan-500",
    },
  ];

  const discoverTips = [
    { text: "Search by city or name to find people near you.", icon: "pi pi-map-marker", path: "/search" },
    { text: "A complete profile gets more connection requests.", icon: "pi pi-user", path: "/profile" },
    { text: "Check announcements for updates from your network.", icon: "pi pi-megaphone", path: "/announcements" },
  ];

  const productHighlights = [
    {
      title: "Local Discovery Engine",
      description: "Find nearby people and communities with location-aware search.",
      icon: "pi pi-compass",
    },
    {
      title: "Privacy First Controls",
      description: "Choose how your number and profile details appear to others.",
      icon: "pi pi-shield",
    },
    {
      title: "Community Announcements",
      description: "Share updates, opportunities, and local notices in one feed.",
      icon: "pi pi-megaphone",
    },
    {
      title: "Smart Messaging",
      description: "Start conversations quickly and keep your network active.",
      icon: "pi pi-comments",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-secondary via-bg-secondary to-bg-tertiary flex flex-col relative overflow-hidden">
      {/* Network Background */}
      <NetworkBackground />
      
      {/* Decorative gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <Header showAuthButtons={false} />

      {/* Main Content */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 sm:gap-8 relative z-10">
        {/* Welcome Header */}
          <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
          <div className="relative backdrop-blur-xl bg-bg-primary/90 rounded-3xl p-8 sm:p-10 lg:p-12 border border-white/20 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-sky-500/5 to-cyan-500/5"></div>
            
            <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative group/icon">
                    <div className="absolute -inset-2 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500 rounded-2xl blur-xl opacity-30 group-hover/icon:opacity-50 transition-opacity"></div>
                    <div className="relative p-4 bg-gradient-to-br from-primary to-cyan-600 rounded-2xl shadow-2xl">
                      <i className="pi pi-home text-white text-2xl"></i>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-2 bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                      Welcome Back
                    </h1>
                    <p className="text-text-secondary text-sm flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Connected to the network
                    </p>
                  </div>
                </div>
                <p className="text-text-secondary text-lg sm:text-xl mb-2">
                  Hello, <span className="font-bold text-text-primary">{user?.name || "User"}</span> 👋
                </p>
                <p className="text-text-secondary/80 text-base">
                  Manage your connections and explore the network
                </p>
              </div>
              <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-br from-primary/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl border border-primary/20">
                <i className="pi pi-calendar text-primary text-xl"></i>
                <div>
                  <p className="text-xs text-text-secondary/70 uppercase tracking-wider mb-1 font-bold">Today</p>
                  <p className="text-base font-bold text-text-primary">
                    {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shortcuts / Quick Actions */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
          <div className="relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl bg-gradient-to-br from-primary/10 via-cyan-500/5 to-emerald-500/10 backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),transparent)]"></div>
            <div className="relative p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-cyan-600 shadow-lg">
                  <i className="pi pi-bolt text-white text-lg"></i>
                </div>
                <div>
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary/90 mb-0.5">Shortcuts</span>
                  <h2 className="text-xl sm:text-2xl font-black text-text-primary">
                    Quick Actions
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => navigate(action.path)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-bg-primary/60 border border-white/10 hover:border-white/25 hover:bg-bg-primary/80 text-left transition-all duration-300 group/btn"
                  >
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${action.gradient} shadow-md group-hover/btn:scale-105 transition-transform flex-shrink-0`}>
                      <i className={`${action.icon} text-white text-lg`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text-primary truncate">
                        {action.title}
                      </p>
                      <p className="text-xs text-text-secondary/80 truncate">
                        {action.description}
                      </p>
                    </div>
                    <i className="pi pi-arrow-right text-text-secondary/50 group-hover/btn:text-primary group-hover/btn:translate-x-0.5 transition-all flex-shrink-0"></i>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Highlights */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500 rounded-3xl blur-2xl opacity-15 group-hover:opacity-25 transition-opacity duration-500"></div>
          <div className="relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl bg-bg-primary/85 backdrop-blur-xl">
            <div className="relative p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-cyan-600 shadow-lg">
                  <i className="pi pi-star text-white text-lg"></i>
                </div>
                <div>
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary/90 mb-0.5">
                    Platform
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-text-primary">
                    What Checknown Offers
                  </h2>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {productHighlights.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-bg-secondary/45 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
                        <i className={item.icon}></i>
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-text-primary mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Discover – tips & inspiration */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500 rounded-3xl blur-2xl opacity-25 group-hover:opacity-35 transition-opacity duration-500"></div>
          <div className="relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl bg-gradient-to-br from-primary/15 via-cyan-500/10 to-emerald-500/15 backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.2),transparent)]"></div>
            <div className="relative p-8 sm:p-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary/90 mb-2">Discover</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-text-primary mb-2">
                    Get more from your network
                  </h2>
                  <p className="text-text-secondary max-w-xl">
                    Quick ideas to help you connect and stay in the loop.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center shadow-lg">
                    <i className="pi pi-bolt text-white text-2xl"></i>
                  </div>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {discoverTips.map((tip, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(tip.path)}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-bg-primary/60 border border-white/10 hover:border-primary/30 hover:bg-bg-primary/80 text-left transition-all duration-300 group"
                  >
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-cyan-500/20 group-hover:from-primary/30 group-hover:to-cyan-500/30 transition-colors">
                      <i className={`${tip.icon} text-primary text-lg`}></i>
                    </div>
                    <p className="text-sm font-medium text-text-primary flex-1 leading-snug">
                      {tip.text}
                    </p>
                    <i className="pi pi-arrow-right text-text-secondary/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0"></i>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
