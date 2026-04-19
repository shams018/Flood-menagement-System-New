import React from "react";
import {
  Home,
  Package,
  PawPrint,
  Leaf,
  MapPin,
  Upload,
  Satellite,
  Zap,
  CheckCircle2,
  Maximize2,
} from "lucide-react";

const VictemRegisPage = () => {
  return (
    <main className="min-h-screen bg-slate-900 text-[#E0E0E0] font-sans">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <section>
          <h1 className="text-5xl font-semibold tracking-tight leading-tight mb-6">
            <span className="text-white">Victim </span>
            <span className="text-[#A5C9FF]">Registration</span>
          </h1>
          <p className="max-w-3xl text-gray-400 text-lg leading-relaxed">
            Protocol Alpha: High-priority data collection for flood relief and
            emergency resource allocation. Please provide accurate details.
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-3 mt-12">
          <div className="lg:col-span-2 rounded-[32px] border border-white/5 bg-slate-800/50 p-8 shadow-2xl">
            <div className="mb-10 border-b border-white/5 pb-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-600 text-sm font-mono text-gray-400">
                    02
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">
                      Mission Status
                    </p>
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Damage Assessment
                    </h2>
                  </div>
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-bold">
                  Step 2 of 3
                </span>
              </div>
              <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-2/3 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              </div>
            </div>

            <form className="space-y-10">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-3">
                  Incident Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    defaultValue="Indus Basin District, Sector 4-B"
                    className="w-full rounded-[20px] border border-gray-700 bg-[#1E1E1E] px-4 py-4 pl-14 text-gray-100 outline-none transition-colors focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-3">
                  Type of Loss
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { icon: Home, label: "House", active: true },
                    { icon: Package, label: "Property", active: false },
                    { icon: PawPrint, label: "Livestock", active: false },
                    { icon: Leaf, label: "Crops", active: false },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border px-4 py-6 text-center transition-all ${
                        item.active
                          ? "border-blue-500 bg-blue-500/10 text-white"
                          : "border-transparent bg-[#1E1E1E] text-gray-400 hover:border-slate-700 hover:bg-[#252525]"
                      }`}
                    >
                      <item.icon className="h-6 w-6" />
                      <span className="text-[10px] uppercase tracking-[0.3em] font-bold">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-3">
                  Detailed Description
                </label>
                <textarea
                  placeholder="Describe the current situation and damage incurred..."
                  className="min-h-[10rem] w-full rounded-[24px] border border-gray-700 bg-[#1E1E1E] p-5 text-gray-100 outline-none transition-colors focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-3">
                  Visual Evidence (Upload Photos)
                </label>
                <div className="group rounded-[32px] border-2 border-dashed border-gray-800 bg-[#1A1A1A]/50 p-12 text-center transition-colors hover:bg-[#1A1A1A] cursor-pointer">
                  <Upload className="mx-auto mb-4 h-8 w-8 text-gray-500 transition-colors group-hover:text-blue-400" />
                  <p className="text-sm font-medium text-gray-200 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-[10px] uppercase tracking-tight text-gray-500">
                    JPEG, PNG up to 10MB each
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500 transition-colors hover:text-white"
                >
                  Previous Step
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 px-10 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-950 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Initialize Next Step
                </button>
              </div>
            </form>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[32px] border border-white/5 bg-slate-800/50 p-6 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold">Data Verification</h3>
                <div className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              </div>
              <p className="text-xs leading-relaxed text-gray-400 mb-6">
                Our AI-driven{" "}
                <span className="text-blue-300">Sentinel Protocol</span>{" "}
                verifies submissions against satellite imagery and local sensor
                data for accelerated relief processing.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-4 rounded-2xl bg-[#161616] p-4">
                  <Satellite className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold">
                      Satellite Sync
                    </p>
                    <p className="text-xs font-semibold">Active - Sector 4</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl bg-[#161616] p-4">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold">
                      Priority Queue
                    </p>
                    <p className="text-xs font-semibold">Level 2 Emergency</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[32px] border border-white/5 bg-slate-800/50 p-6">
              <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
                Required Documentation
              </h3>
              <ul className="space-y-4">
                {[
                  "Valid Government Issued ID / CNIC",
                  "Proof of residence (Utility bills etc.)",
                  "Geotagged damage photos (Automated)",
                ].map((text) => (
                  <li key={text} className="flex gap-3 items-start">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-blue-500" />
                    <span className="text-xs leading-tight text-gray-400">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="relative overflow-hidden rounded-[32px] border border-white/5 aspect-video bg-black">
              <img
                src="https://images.unsplash.com/photo-1551288560-1996948c3b6f?auto=format&fit=crop&q=80&w=800"
                alt="Thermal Satellite View"
                className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-lighten"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-[9px] uppercase tracking-[0.3em] text-blue-400 mb-1">
                  Live Sector View
                </p>
                <h4 className="text-sm font-bold tracking-tight">
                  INCIDENT: ALPHA-902
                </h4>
              </div>
              <button className="absolute bottom-4 right-4 rounded-md bg-black/50 p-2 backdrop-blur-md transition-colors hover:bg-white/10">
                <Maximize2 className="h-4 w-4 text-white" />
              </button>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default VictemRegisPage;
