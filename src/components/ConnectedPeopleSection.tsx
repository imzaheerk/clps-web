import ScrollReveal from "@/components/ScrollReveal";

export default function ConnectedPeopleSection() {
  return (
    <section className="relative w-full py-12 sm:py-14 lg:py-16 overflow-hidden landing-section-perspective">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-44 h-44 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div
          className="absolute bottom-8 right-1/4 w-52 h-52 rounded-full bg-emerald-500/10 blur-3xl animate-pulse"
          style={{ animationDelay: "900ms" }}
        />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal variant="blur-up">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 landing-title-shine bg-gradient-to-r from-text-primary via-primary to-cyan-500 bg-clip-text text-transparent">
            Join a Growing Network
          </h2>
        </ScrollReveal>
        <ScrollReveal variant="pop-up" delay={120}>
          <p className="text-xl sm:text-2xl text-text-secondary max-w-2xl mx-auto mb-6 leading-relaxed">
            Thousands of people are already connected. See how our community grows and
            connects every day.
          </p>
        </ScrollReveal>

        <div className="mb-7 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <ScrollReveal variant="flip-up" delay={200}>
            <div className="landing-card-glow rounded-2xl border border-white/10 bg-bg-primary/40 backdrop-blur-sm p-4 shadow-lg h-full">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                <span
                  className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"
                  style={{ animationDelay: "300ms" }}
                />
                <span
                  className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"
                  style={{ animationDelay: "600ms" }}
                />
              </div>
              <p className="text-sm sm:text-base text-text-secondary">
                Community growth is in progress as we onboard more users.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="flip-up" delay={320}>
            <div className="landing-card-glow rounded-2xl border border-white/10 bg-bg-primary/40 backdrop-blur-sm p-4 shadow-lg h-full">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping [animation-delay:400ms]" />
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping [animation-delay:800ms]" />
              </div>
              <p className="text-sm sm:text-base text-text-secondary">
                Live connection features are being refined for the best experience.
              </p>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal variant="elastic" delay={250}>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-bg-primary/40 backdrop-blur-sm border border-white/10 shadow-md">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
              </div>
              <span className="text-sm font-medium text-text-primary">Live Network</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-bg-primary/40 backdrop-blur-sm border border-white/10 shadow-md">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-75" />
              </div>
              <span className="text-sm font-medium text-text-primary">Active Connections</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
