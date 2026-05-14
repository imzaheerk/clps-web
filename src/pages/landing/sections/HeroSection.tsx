import HeroNetworkModel from "@/components/HeroNetworkModel";

export default function HeroSection() {
  return (
    <section className="relative max-w-[1200px] mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-72px)] flex items-center">
      <div className="relative z-10 w-full grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div className="text-center lg:text-left">
          {/* Main Heading - Focus on connecting people */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[3.75rem] font-black mb-4 sm:mb-5 bg-gradient-to-r from-primary via-cyan-600 to-emerald-600 bg-clip-text text-transparent leading-tight">
            Connecting People Over the Internet
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-[1.35rem] text-text-secondary mb-5 sm:mb-6 leading-relaxed font-medium max-w-2xl mx-auto lg:mx-0">
            We bring people together across the digital world. Connect, discover, and build meaningful relationships online.
          </p>

          {/* Key benefits - visible at first glance */}
          <div className="mb-5 sm:mb-6 flex flex-wrap gap-2.5 justify-center lg:justify-start">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-primary/50 border border-white/10 text-xs sm:text-sm text-text-primary">
              <i className="pi pi-map-marker text-primary" />
              Local discovery
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-primary/50 border border-white/10 text-xs sm:text-sm text-text-primary">
              <i className="pi pi-comments text-cyan-400" />
              Real conversations
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-primary/50 border border-white/10 text-xs sm:text-sm text-text-primary">
              <i className="pi pi-shield text-emerald-400" />
              Privacy controls
            </span>
          </div>

          {/* Simple visual element showing connection */}
          <div className="mb-5 sm:mb-6 flex items-center justify-center lg:justify-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-cyan-600 shadow-lg flex items-center justify-center">
              <i className="pi pi-user text-white text-lg"></i>
            </div>
            <div className="flex-1 max-w-[120px] sm:max-w-[160px] h-0.5 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500"></div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg flex items-center justify-center">
              <i className="pi pi-user text-white text-lg"></i>
            </div>
            <div className="flex-1 max-w-[120px] sm:max-w-[160px] h-0.5 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500"></div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 shadow-lg flex items-center justify-center">
              <i className="pi pi-user text-white text-lg"></i>
            </div>
          </div>

        </div>

        {/* 3D Network Model */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] min-h-0 overflow-visible isolate bg-transparent">
              <HeroNetworkModel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
