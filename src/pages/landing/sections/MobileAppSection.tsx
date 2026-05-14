export default function MobileAppSection() {
  return (
    <section className="relative py-12 sm:py-14 lg:py-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-1/4 w-72 h-72 rounded-full bg-primary/12 blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-24 right-1/4 w-80 h-80 rounded-full bg-emerald-500/12 blur-3xl animate-pulse"
          style={{ animationDelay: "900ms" }}
        />
      </div>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-bg-primary/45 backdrop-blur-md p-6 sm:p-8 lg:p-10 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(14,165,233,0.16),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(16,185,129,0.14),transparent_45%)] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-7 lg:gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/25 bg-primary/10 text-primary text-xs sm:text-sm font-semibold mb-3">
                <i className="pi pi-mobile" />
                Now on Mobile
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 leading-tight bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                Take Checknown Everywhere You Go
              </h2>
              <p className="text-text-secondary text-base sm:text-lg leading-relaxed mb-5 max-w-2xl">
                Discover nearby people, get real-time updates, and connect instantly from your phone - anytime, anywhere.
              </p>

              <blockquote className="rounded-xl border border-cyan-400/20 bg-gradient-to-r from-primary/10 via-cyan-500/10 to-emerald-500/10 px-4 py-3 text-sm sm:text-base text-text-primary italic mb-6">
                "Your local network in your pocket - simple, fast, and always within reach."
              </blockquote>

              <div className="flex flex-wrap gap-3 mb-6">
                <a
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-cyan-500 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                >
                  <i className="pi pi-android" />
                  Get it on Play Store
                </a>
                <a
                  href="https://www.apple.com/app-store/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/15 bg-bg-primary/50 text-text-primary font-semibold hover:border-primary/35 transition-colors"
                >
                  <i className="pi pi-apple" />
                  Download on App Store
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-text-secondary">
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

            <div className="relative mx-auto w-full max-w-[360px]">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-cyan-500/20 to-emerald-500/20 blur-2xl rounded-3xl" />
              <div className="relative rounded-[2rem] border border-white/15 bg-bg-secondary/50 p-4 sm:p-5 shadow-2xl">
                <div className="rounded-[1.5rem] border border-white/10 bg-bg-primary/70 p-4">
                  <div className="h-1.5 w-16 mx-auto rounded-full bg-text-tertiary/40 mb-4" />

                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-white">
                      <i className="pi pi-users text-sm" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary leading-tight">
                        Nearby Connections
                      </p>
                      <p className="text-xs text-text-secondary">Ready on mobile</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-4">
                    <div className="h-2.5 rounded-full bg-gradient-to-r from-primary/35 to-cyan-400/35" />
                    <div className="h-2.5 rounded-full bg-gradient-to-r from-cyan-400/30 to-emerald-400/30 w-5/6" />
                    <div className="h-2.5 rounded-full bg-gradient-to-r from-emerald-400/25 to-primary/25 w-2/3" />
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-bg-secondary/60 px-3 py-2">
                    <span className="text-xs text-text-secondary">Live updates</span>
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </span>
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
