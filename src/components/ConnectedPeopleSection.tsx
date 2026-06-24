import ScrollReveal from "@/components/ScrollReveal";

export default function ConnectedPeopleSection() {
  return (
    <section className="resend-section">
      <div className="resend-container text-center">
        <ScrollReveal variant="blur-up">
          <p className="resend-kicker">Community</p>
          <h2 className="resend-h2">Join a Growing Network</h2>
        </ScrollReveal>
        <ScrollReveal variant="pop-up" delay={120}>
          <p className="resend-lead resend-lead-center">
            Thousands of people are already connected. See how our community grows and connects
            every day.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <ScrollReveal variant="flip-up" delay={200}>
            <div className="resend-card text-left">
              <p className="resend-card-text">
                Community growth is in progress as we onboard more users.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="flip-up" delay={300}>
            <div className="resend-card text-left">
              <p className="resend-card-text">
                Live connection features are being refined for the best experience.
              </p>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal variant="elastic" delay={250}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="resend-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Live Network
            </span>
            <span className="resend-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              Active Connections
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
