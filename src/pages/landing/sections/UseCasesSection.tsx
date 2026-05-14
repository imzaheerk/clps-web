export default function UseCasesSection() {
  return (
    <section className="relative pb-10 sm:pb-12 lg:pb-14">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black mb-4 bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
            Built for Real-life Connections
          </h2>
          <p className="text-text-secondary text-base sm:text-lg mb-6 leading-relaxed">
            Whether you&apos;re new to an area or looking to strengthen your local
            network, Checknown helps you connect with people around you in meaningful
            ways.
          </p>
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
        </div>

        <div className="rounded-3xl bg-bg-primary/40 backdrop-blur-sm border border-white/10 p-6 sm:p-8 shadow-2xl flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center text-white shadow-lg">
              <i className="pi pi-users text-lg"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">
                Local Community First
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary">
                See who&apos;s around you and build strong local circles.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white shadow-lg">
              <i className="pi pi-megaphone text-lg"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">
                Announcements that Matter
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary">
                Stay updated with what&apos;s happening around you in real time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg">
              <i className="pi pi-lock text-lg"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">
                You&apos;re in Control
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary">
                Control who can connect with you and what you share.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
