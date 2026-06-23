import ScrollReveal from "@/components/ScrollReveal";

const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description:
      "Sign up with your location details and choose your preferred privacy level for number visibility.",
  },
  {
    number: "02",
    title: "Discover Nearby People",
    description:
      "Explore local users, announcements, and opportunities to connect with trusted people around you.",
  },
  {
    number: "03",
    title: "Connect and Grow",
    description:
      "Start conversations, share updates, and build meaningful relationships within your community.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative py-10 sm:py-12 lg:py-14 landing-section-perspective">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <ScrollReveal variant="blur-up">
            <h2 className="text-3xl sm:text-4xl font-black mb-4 bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent landing-title-shine">
              How Checknown Works
            </h2>
          </ScrollReveal>
          <ScrollReveal variant="pop-up" delay={120}>
            <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
              Get started in minutes and begin building real local connections.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {steps.map((step, index) => (
            <ScrollReveal key={step.number} variant="elastic" delay={index * 160}>
              <article className="landing-card-glow rounded-2xl bg-bg-primary/40 backdrop-blur-sm border border-white/10 p-6 sm:p-7 shadow-xl h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-primary/15">
                <p className="text-primary font-black text-2xl mb-3">{step.number}</p>
                <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
