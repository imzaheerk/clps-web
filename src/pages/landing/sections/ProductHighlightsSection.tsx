const highlights = [
  {
    icon: "pi pi-search",
    title: "Smart Local Discovery",
    description:
      "Find people in your area using location-based discovery designed for real-world relevance.",
  },
  {
    icon: "pi pi-send",
    title: "Secure Messaging",
    description:
      "Start conversations instantly while keeping your privacy settings and visibility controls in your hands.",
  },
  {
    icon: "pi pi-megaphone",
    title: "Community Announcements",
    description:
      "Post and discover local updates, services, and important neighborhood information in one place.",
  },
  {
    icon: "pi pi-bell",
    title: "Real-time Notifications",
    description:
      "Get timely updates on new connections, messages, and relevant activity around your local network.",
  },
];

export default function ProductHighlightsSection() {
  return (
    <section className="relative py-10 sm:py-12 lg:py-14">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl font-black mb-4 bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
            Why People Choose Checknown
          </h2>
          <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
            Built to make local digital connections simple, safe, and useful for
            everyday life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl bg-bg-primary/40 backdrop-blur-sm border border-white/10 p-6 shadow-xl"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center mb-4 text-white shadow-lg">
                <i className={`${item.icon} text-lg`} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-2">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
