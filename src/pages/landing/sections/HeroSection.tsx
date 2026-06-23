import HeroNetworkModel from "@/components/HeroNetworkModel";
import ScrollReveal from "@/components/ScrollReveal";

const badges = [
  { icon: "pi pi-map-marker", iconClass: "text-primary", label: "Local discovery" },
  { icon: "pi pi-comments", iconClass: "text-cyan-400", label: "Real conversations" },
  { icon: "pi pi-shield", iconClass: "text-emerald-400", label: "Privacy controls" },
];

export default function HeroSection() {
  return (
    <section className="relative max-w-[1200px] mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-72px)] flex items-center landing-section-perspective">
      <div className="relative z-10 w-full grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div className="text-center lg:text-left">
          <ScrollReveal immediate variant="blur-up" delay={0}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[3.75rem] font-black mb-4 sm:mb-5 bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent leading-tight landing-title-shine">
              Connecting People Over the Internet
            </h1>
          </ScrollReveal>

          <ScrollReveal immediate variant="pop-up" delay={180}>
            <p className="text-lg sm:text-xl lg:text-[1.35rem] text-text-secondary mb-5 sm:mb-6 leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0">
              We bring people together across the digital world. Connect, discover, and build meaningful relationships online.
            </p>
          </ScrollReveal>

          <div className="mb-5 sm:mb-6 flex flex-wrap gap-2.5 justify-center lg:justify-start">
            {badges.map((badge, index) => (
              <ScrollReveal key={badge.label} immediate variant="elastic" delay={320 + index * 100}>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-primary/50 border border-white/10 text-xs sm:text-sm text-text-primary shadow-lg shadow-primary/5">
                  <i className={`${badge.icon} ${badge.iconClass}`} />
                  {badge.label}
                </span>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal immediate variant="flip-up" delay={650}>
            <div className="mb-5 sm:mb-6 flex items-center justify-center lg:justify-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-cyan-600 shadow-lg shadow-primary/30 flex items-center justify-center">
                <i className="pi pi-user text-white text-lg"></i>
              </div>
              <div className="flex-1 max-w-[120px] sm:max-w-[160px] h-0.5 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500"></div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg shadow-cyan-500/30 flex items-center justify-center">
                <i className="pi pi-user text-white text-lg"></i>
              </div>
              <div className="flex-1 max-w-[120px] sm:max-w-[160px] h-0.5 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500"></div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 shadow-lg shadow-emerald-500/30 flex items-center justify-center">
                <i className="pi pi-user text-white text-lg"></i>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal immediate variant="fade-left" delay={250}>
          <div className="flex justify-center lg:justify-end landing-hero-float">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
              <div className="relative w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] min-h-0 overflow-visible isolate bg-transparent">
                <HeroNetworkModel />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
