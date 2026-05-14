const stats = [
  {
    title: "Verified Local Profiles",
    description: "Connect with real people in your area through profile-first local discovery.",
    icon: "pi pi-users",
  },
  {
    title: "Location-first Discovery",
    description: "See people, services, and updates that are relevant to your locality.",
    icon: "pi pi-map-marker",
  },
  {
    title: "Community Messaging",
    description: "Keep conversations and local updates organized in one place.",
    icon: "pi pi-comments",
  },
  {
    title: "Privacy by Default",
    description: "Control your visibility and sharing preferences while building trusted connections.",
    icon: "pi pi-shield",
  },
];

export default function CommunityStatsSection() {
  return (
    <section className="relative py-10 sm:py-12 lg:py-14 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-16 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl animate-pulse"
          style={{ animationDelay: "900ms" }}
        />
      </div>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-white/15 bg-bg-primary/45 backdrop-blur-md p-5 sm:p-6 lg:p-8 shadow-2xl">
          <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.12),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.12),transparent_45%)] pointer-events-none" />
          <div className="relative text-center mb-7">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
              Built for Safe, Local Connections
            </h2>
            <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
              Checknown helps you discover nearby people, communicate clearly, and
              stay in control of your privacy.
            </p>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="group rounded-2xl bg-bg-secondary/45 border border-white/10 p-4 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-primary/10"
              >
                <div className="mx-auto mb-3 w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <i className={`${stat.icon} text-lg`} />
                </div>
                <p className="text-base sm:text-lg font-bold text-text-primary mb-1">
                  {stat.title}
                </p>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
