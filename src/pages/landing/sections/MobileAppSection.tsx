import MobileAppPhoneMockup from "@/components/MobileAppPhoneMockup";

export default function MobileAppSection() {
  return (
    <section className="relative py-5 sm:py-6 lg:py-7 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-16 left-1/4 w-56 h-56 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-16 right-1/4 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl animate-pulse"
          style={{ animationDelay: "900ms" }}
        />
      </div>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 bg-bg-primary/45 backdrop-blur-md p-4 sm:p-5 lg:p-5 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(14,165,233,0.16),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(16,185,129,0.14),transparent_45%)] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.2fr_0.95fr] gap-4 lg:gap-5 items-center">
            <div className="order-2 lg:order-1">
              <span className="inline-flex items-center gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-primary/25 bg-primary/10 text-primary text-[11px] sm:text-xs font-semibold mb-1.5 sm:mb-2">
                <i className="pi pi-mobile" />
                Now on Mobile
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-1.5 sm:mb-2 leading-tight bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                Take Checknown Everywhere You Go
              </h2>
              <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-3 max-w-2xl">
                Discover nearby people, get real-time updates, and connect instantly from your phone - anytime, anywhere.
              </p>

              <blockquote className="rounded-lg sm:rounded-xl border border-cyan-400/20 bg-gradient-to-r from-primary/10 via-cyan-500/10 to-emerald-500/10 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm text-text-primary italic mb-3 sm:mb-4">
                "Your local network in your pocket - simple, fast, and always within reach."
              </blockquote>

              <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
                <a
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                >
                  <i className="pi pi-android" />
                  Get it on Play Store
                </a>
                <a
                  href="https://www.apple.com/app-store/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl border border-white/15 bg-bg-primary/50 text-text-primary text-sm font-semibold hover:border-primary/35 transition-colors"
                >
                  <i className="pi pi-apple" />
                  Download on App Store
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-text-secondary">
                <span className="inline-flex items-center gap-2">
                  <i className="pi pi-bolt text-primary" />
                  Fast access
                </span>
                <span className="inline-flex items-center gap-2">
                  <i className="pi pi-bell text-cyan-400" />
                  Instant notifications
                </span>
                <span className="inline-flex items-center gap-2">
                  <i className="pi pi-shield text-emerald-400" />
                  Privacy controls
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[260px] sm:max-w-[280px] lg:max-w-[300px] order-1 lg:order-2">
              <div className="absolute -inset-2 sm:-inset-3 bg-gradient-to-r from-primary/18 via-cyan-500/18 to-emerald-500/18 blur-xl rounded-2xl" />
              <div className="relative rounded-xl sm:rounded-2xl border border-white/15 bg-bg-secondary/50 shadow-xl overflow-hidden">
                <div
                  className="relative min-h-[150px] sm:min-h-[165px] lg:min-h-[175px] w-full"
                  role="img"
                  aria-label="Smartphone illustration with Checknown on screen"
                >
                  <MobileAppPhoneMockup />
                </div>
                <div className="px-3 py-1.5 sm:px-3 sm:py-2 border-t border-white/10 bg-bg-primary/50 text-center">
                  <p className="text-[10px] sm:text-[11px] font-semibold text-primary uppercase tracking-wider mb-0.5">
                    Phone preview
                  </p>
                  <p className="text-[11px] sm:text-xs text-text-secondary leading-snug">
                    Realistic device frame — same experience on iOS and Android from the stores below.
                  </p>
                </div>

                <div className="rounded-b-xl sm:rounded-b-2xl border-t border-white/10 bg-bg-primary/60 p-2.5 sm:p-3">
                  <div className="rounded-lg sm:rounded-[1.05rem] border border-white/10 bg-bg-primary/70 p-2 sm:p-2.5">
                    <div className="h-0.5 w-10 mx-auto rounded-full bg-text-tertiary/35 mb-1.5" />

                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-white shrink-0">
                        <i className="pi pi-users text-xs" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-text-primary leading-tight truncate">
                          Nearby Connections
                        </p>
                        <p className="text-[11px] text-text-secondary">Ready on mobile</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-2">
                      <div className="h-1.5 rounded-full bg-gradient-to-r from-primary/35 to-cyan-400/35" />
                      <div className="h-1.5 rounded-full bg-gradient-to-r from-cyan-400/30 to-emerald-400/30 w-5/6" />
                      <div className="h-1.5 rounded-full bg-gradient-to-r from-emerald-400/25 to-primary/25 w-2/3" />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-bg-secondary/60 px-2 py-1">
                      <span className="text-[11px] text-text-secondary">Live updates</span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
