import BrandMark from "./BrandMark";

/**
 * Realistic smartphone silhouette: titanium-style frame, glass bezel,
 * OLED wallpaper, status bar, Dynamic Island, and in-screen UI — no WebGL.
 */
export default function MobileAppPhoneMockup() {
  return (
    <div className="flex w-full items-center justify-center px-3 py-4 sm:py-5">
      <div className="relative" style={{ perspective: "1100px" }}>
        <div className="relative mobile-app-phone-drift">
          <div
            className="mobile-app-phone-glow-pulse pointer-events-none absolute -bottom-5 left-1/2 h-12 w-[92%] rounded-[100%] bg-primary/30 blur-2xl"
            aria-hidden
          />

          <div
            className="relative w-[112px] sm:w-[126px] lg:w-[134px] rounded-[2.4rem] border border-white/30 bg-gradient-to-b from-neutral-300 via-neutral-500 to-neutral-900 p-[8px] shadow-[0_22px_45px_-12px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.45)] dark:border-white/15 dark:from-zinc-600 dark:via-zinc-800 dark:to-zinc-950 dark:shadow-[0_22px_45px_-12px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.12)]"
            aria-hidden
          >
            <div className="absolute -left-[2px] top-[19%] h-8 w-[2px] rounded-l-[2px] bg-gradient-to-b from-neutral-500 to-neutral-800 dark:from-zinc-500 dark:to-zinc-800" />
            <div className="absolute -left-[2px] top-[28%] h-11 w-[2px] rounded-l-[2px] bg-gradient-to-b from-neutral-500 to-neutral-800 dark:from-zinc-500 dark:to-zinc-800" />
            <div className="absolute -left-[2px] top-[38%] h-11 w-[2px] rounded-l-[2px] bg-gradient-to-b from-neutral-500 to-neutral-800 dark:from-zinc-500 dark:to-zinc-800" />
            <div className="absolute -right-[2px] top-[26%] h-[4.25rem] w-[2px] rounded-r-[2px] bg-gradient-to-b from-neutral-500 to-neutral-800 dark:from-zinc-500 dark:to-zinc-800" />

            <div className="rounded-[2rem] bg-neutral-950 p-[6px] ring-1 ring-black/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
              <div className="relative aspect-[9/19.4] w-full overflow-hidden rounded-[1.65rem] bg-black shadow-[inset_0_0_16px_rgba(0,0,0,0.85)]">
                <div
                  className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_28%_12%,rgba(56,189,248,0.45),transparent_52%),radial-gradient(ellipse_70%_55%_at_88%_72%,rgba(16,185,129,0.28),transparent_50%),linear-gradient(168deg,#0b1224_0%,#0f172a_42%,#020617_100%)]"
                  aria-hidden
                />
                <div
                  className="absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-transparent opacity-70"
                  aria-hidden
                />

                <div className="relative flex h-full flex-col text-white">
                  <div className="flex shrink-0 items-start justify-between px-2.5 pt-2 text-[8px] font-semibold tracking-wide text-white/90 sm:text-[9px]">
                    <span>9:41</span>
                    <div className="flex items-center gap-1 pr-0.5">
                      <span className="text-[8px] opacity-80">5G</span>
                      <div className="flex gap-0.5 pt-0.5">
                        {[0.35, 0.55, 0.75, 1].map((o, i) => (
                          <span
                            key={i}
                            className="block w-[3px] rounded-[1px] bg-current"
                            style={{ height: `${5 + i * 2}px`, opacity: o }}
                          />
                        ))}
                      </div>
                      <div className="ml-0.5 flex h-2.5 w-5 items-center rounded-[3px] border border-white/35 px-[2px]">
                        <div className="h-1.5 w-[70%] rounded-[1px] bg-emerald-400/90" />
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 flex justify-center -mt-1">
                    <div className="h-[22px] w-[62px] rounded-full bg-black shadow-[inset_0_-1px_2px_rgba(255,255,255,0.08),0_2px_8px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
                      <div className="absolute left-3 top-1/2 h-1.5 w-2 -translate-y-1/2 rounded-full bg-neutral-800/90 ring-1 ring-white/5" />
                      <div className="absolute right-3 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-sky-900/80 blur-[1px]" />
                    </div>
                  </div>

                  <div className="absolute left-1/2 top-[7px] h-[3px] w-10 -translate-x-1/2 rounded-full bg-black/55 ring-1 ring-white/[0.07]" />

                  <div className="mt-2 flex flex-1 flex-col gap-1.5 px-2 pb-4">
                    <div className="rounded-xl border border-white/10 bg-white/[0.07] p-2 shadow-lg backdrop-blur-md">
                      <p className="text-[8px] font-bold text-sky-300 sm:text-[9px]">Nearby</p>
                      <p className="mt-0.5 text-[7px] leading-tight text-white/55 sm:text-[8px]">
                        People close to you
                      </p>
                      <div className="mt-1.5 h-1 rounded-full bg-gradient-to-r from-primary/50 to-cyan-400/40" />
                    </div>
                    <div className="w-[88%] self-center rounded-xl border border-white/10 bg-white/[0.05] p-2 shadow-md backdrop-blur-sm">
                      <div className="flex items-center gap-1.5">
                        <div className="flex size-5 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-cyan-500">
                          <i className="pi pi-users text-[7px] text-white" />
                        </div>
                        <div className="min-w-0 scale-[0.85] origin-left">
                          <BrandMark size="xs" showTm={false} />
                          <p className="text-[6.5px] text-white/45">Live</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto rounded-xl border border-white/10 bg-black/35 px-1.5 py-1 backdrop-blur-md">
                      <div className="mx-auto mb-0.5 flex justify-around">
                        {[0, 1, 2, 3].map((i) => (
                          <span
                            key={i}
                            className="size-4 rounded-md bg-gradient-to-br from-white/15 to-white/5 ring-1 ring-white/10"
                          />
                        ))}
                      </div>
                      <div className="mx-auto h-0.5 w-8 rounded-full bg-white/25" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
