import ScrollReveal from "@/components/ScrollReveal";

const cards = [
  {
    icon: "pi pi-map-marker",
    iconGradient: "from-primary to-cyan-600",
    title: "Discover People Nearby",
    description:
      "See people in your area and explore new connections based on your location and community.",
  },
  {
    icon: "pi pi-comments",
    iconGradient: "from-cyan-500 to-teal-500",
    title: "Start Real Conversations",
    description:
      "Message people instantly, share updates, and stay in touch with the people who matter to you.",
  },
  {
    icon: "pi pi-shield",
    iconGradient: "from-emerald-500 to-teal-500",
    title: "Safe & Private by Design",
    description:
      "Your privacy is protected with robust controls and a platform built with safety in mind.",
  },
];

export default function HowChecknownHelpsSection() {
  return (
    <section className="relative py-10 sm:py-12 lg:py-14 landing-section-perspective">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <ScrollReveal variant="blur-up">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent landing-title-shine">
              How Checknown Connects You
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="pop-up" delay={120}>
            <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
              From discovering nearby people to building lasting relationships, Checknown
              makes every step of the journey simple.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {cards.map((card, index) => (
            <ScrollReveal key={card.title} variant="flip-up" delay={index * 150}>
              <div className="landing-card-glow rounded-2xl bg-bg-primary/40 backdrop-blur-sm border border-white/10 p-6 sm:p-7 shadow-xl h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.iconGradient} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <i className={`${card.icon} text-white text-xl`}></i>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  {card.title}
                </h3>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                  {card.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
