import { useNavigate } from "react-router-dom";
import { Button } from "@/components";
import FinalCtaCityConnectionsModel from "@/components/FinalCtaCityConnectionsModel";
import ScrollReveal from "@/components/ScrollReveal";

export default function FinalCtaSection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-10 sm:py-12 lg:py-14 landing-section-perspective">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="zoom">
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-primary/15 via-cyan-500/10 to-emerald-500/10 backdrop-blur-md p-6 sm:p-8 lg:p-10 shadow-2xl min-h-[320px] sm:min-h-[380px]">
            <div className="absolute inset-0 opacity-95 pointer-events-none">
              <FinalCtaCityConnectionsModel />
            </div>
            <div className="absolute -top-16 -left-16 w-44 h-44 rounded-full bg-primary/20 blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute -bottom-16 -right-16 w-44 h-44 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none animate-pulse" />

            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <ScrollReveal variant="blur-up" delay={150}>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent landing-title-shine">
                  Ready to Build Real Local Connections?
                </h2>
              </ScrollReveal>
              <ScrollReveal variant="pop-up" delay={280}>
                <p className="text-text-secondary text-base sm:text-lg mb-6">
                  Join Checknown to discover nearby people, share important updates, and
                  grow your trusted local network.
                </p>
              </ScrollReveal>
              <ScrollReveal variant="elastic" delay={400}>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <Button
                    label="Create Free Account"
                    icon="pi pi-user-plus"
                    onClick={() => navigate("/signup")}
                    variant="gradient"
                    Size="large"
                  />
                  <Button
                    label="Explore Features"
                    icon="pi pi-compass"
                    onClick={() => navigate("/login")}
                    variant="outlined"
                    Size="large"
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
