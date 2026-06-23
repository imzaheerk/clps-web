import ScrollReveal from "@/components/ScrollReveal";

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
    <section className="relative py-10 sm:py-12 lg:py-14 landing-section-perspective">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <ScrollReveal variant="blur-up">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent landing-title-shine">
              Why People Choose Checknown
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="pop-up" delay={120}>
            <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
              Built to make local digital connections simple, safe, and useful for
              everyday life.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {highlights.map((item, index) => (
            <ScrollReveal
              key={item.title}
              variant={index % 2 === 0 ? "fade-right" : "fade-left"}
              delay={index * 130}
            >
              <article className="landing-card-glow rounded-2xl bg-bg-primary/40 backdrop-blur-sm border border-white/10 p-6 shadow-xl h-full transition-all duration-500 hover:-translate-y-2 hover:border-primary/25">
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
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
