export default function HowChecknownHelpsSection() {
  return (
    <section className="relative py-10 sm:py-12 lg:py-14">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl font-black mb-4 bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
            How Checknown Connects You
          </h2>
          <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto">
            From discovering nearby people to building lasting relationships, Checknown
            makes every step of the journey simple.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          <div className="rounded-2xl bg-bg-primary/40 backdrop-blur-sm border border-white/10 p-6 sm:p-7 shadow-xl">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center mb-4 shadow-lg">
              <i className="pi pi-map-marker text-white text-xl"></i>
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">
              Discover People Nearby
            </h3>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              See people in your area and explore new connections based on your
              location and community.
            </p>
          </div>

          <div className="rounded-2xl bg-bg-primary/40 backdrop-blur-sm border border-white/10 p-6 sm:p-7 shadow-xl">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center mb-4 shadow-lg">
              <i className="pi pi-comments text-white text-xl"></i>
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">
              Start Real Conversations
            </h3>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Message people instantly, share updates, and stay in touch with the
              people who matter to you.
            </p>
          </div>

          <div className="rounded-2xl bg-bg-primary/40 backdrop-blur-sm border border-white/10 p-6 sm:p-7 shadow-xl">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 shadow-lg">
              <i className="pi pi-shield text-white text-xl"></i>
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">
              Safe & Private by Design
            </h3>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Your privacy is protected with robust controls and a platform built
              with safety in mind.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
