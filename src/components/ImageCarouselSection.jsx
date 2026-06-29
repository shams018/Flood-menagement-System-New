const slides = [
  {
    src: "/scroll.png",
    alt: "Flood dashboard image 1",
    title: "Real-time flood monitoring",
  },
  {
    src: "/scroll1.png",
    alt: "Flood dashboard image 2",
    title: "Drone assessment visuals",
  },
  {
    src: "/scroll2.png",
    alt: "Flood dashboard image 3",
    title: "Forecast analytics overview",
  },
];

export default function ImageCarouselSection() {
  return (
    <section className="bg-slate-950/90 border-t border-white/10 px-6 py-12 lg:px-16">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 text-white shadow-2xl shadow-slate-950/20">
          <p className="text-xs uppercase tracking-[0.45em] text-blue-400/80">
            Real-time monitoring
          </p>
          <h2 className="mt-3 text-3xl font-black">
            {" "}
            Live Flood Situation Overview
          </h2>
          <p className="mt-4 max-w-3xl text-slate-300">
            Access real-time flood imagery, water-level observations, and field
            monitoring snapshots from affected regions. Stay informed with
            continuously updated visual data to support emergency response, risk
            assessment, and operational decision-making.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {slides.map((slide) => (
            <div
              key={slide.src}
              className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/80 shadow-2xl shadow-slate-950/15"
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="h-52 sm:h-56 md:h-64 w-full object-cover"
              />
              <div className="p-4 text-white">
                <p className="text-sm uppercase tracking-[0.35em] text-blue-400/80">
                  Snapshot
                </p>
                <p className="mt-2 text-lg font-semibold">{slide.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
