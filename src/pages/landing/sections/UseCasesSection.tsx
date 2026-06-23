import ScrollReveal from "@/components/ScrollReveal";

const useCaseItems = [
  {
    icon: "pi pi-users",
    iconGradient: "from-primary to-cyan-600",
    title: "Local Community First",
    description: "See who's around you and build strong local circles.",
  },
  {
    icon: "pi pi-megaphone",
    iconGradient: "from-cyan-500 to-teal-500",
    title: "Announcements that Matter",
    description: "Stay updated with what's happening around you in real time.",
  },
  {
    icon: "pi pi-lock",
    iconGradient: "from-emerald-500 to-teal-500",
    title: "You're in Control",
    description: "Control who can connect with you and what you share.",
  },
];

export default function UseCasesSection() {
  return (
    <section className="relative pb-10 sm:pb-12 lg:pb-14 landing-section-perspective">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
        <div>
          <ScrollReveal variant="fade-right">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent landing-title-shine">
              Built for Real-life Connections
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="pop-up" delay={130}>
            <p className="text-text-secondary text-base sm:text-lg mb-6 leading-relaxed">
              Whether you&apos;re new to an area or looking to strengthen your local
              network, Checknown helps you connect with people around you in meaningful
              ways.
            </p>
          </ScrollReveal>
          <ScrollReveal variant="elastic" delay={260}>
            <ul className="space-y-3 text-text-secondary text-sm sm:text-base">
              <li className="flex items-start gap-2">
                <i className="pi pi-check text-primary mt-1"></i>
                <span>Find neighbours and people in your locality.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="pi pi-check text-primary mt-1"></i>
                <span>Share and discover local announcements and updates.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="pi pi-check text-primary mt-1"></i>
                <span>Stay connected through messaging and notifications.</span>
              </li>
            </ul>
          </ScrollReveal>
        </div>

        <ScrollReveal variant="fade-left" delay={180}>
          <div className="landing-card-glow rounded-3xl bg-bg-primary/40 backdrop-blur-sm border border-white/10 p-6 sm:p-8 shadow-2xl flex flex-col gap-4">
            {useCaseItems.map((item, index) => (
              <ScrollReveal key={item.title} variant="flip-up" delay={280 + index * 110}>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.iconGradient} flex items-center justify-center text-white shadow-lg`}
                  >
                    <i className={`${item.icon} text-lg`}></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-text-secondary">
                      {item.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
