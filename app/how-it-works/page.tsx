import { Link2, Sparkles, KeyRound, Handshake } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <main className="relative min-h-screen bg-[#f7f5ef] pt-32 pb-24 overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full bg-blue-400/10 blur-[150px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-emerald-400/5 blur-[150px] translate-y-1/4" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-black tracking-tight text-gray-950 sm:text-6xl mb-6">
            How NayaGhar Works
          </h1>
          <p className="text-xl font-medium text-gray-600 leading-relaxed max-w-2xl mx-auto">
            A seamless, demand-driven process designed to save you time and connect you with exactly what you need.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 shadow-xl shadow-black/[0.03] backdrop-blur-3xl p-8 pt-12 transition-all hover:-translate-y-1">
            <div className="absolute -top-6 -right-6 text-[120px] font-black text-gray-900/5 leading-none">1</div>
            <div className="mb-6 w-14 h-14 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm">
              <Sparkles className="text-primary" size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black text-gray-950 mb-4">Post a Brief</h3>
            <p className="text-gray-600 font-medium leading-relaxed">
              Tell us exactly what you are looking for. Specify the city, area, budget range, and special amenities. Your requirement goes live instantly on our marketplace.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 shadow-xl shadow-black/[0.03] backdrop-blur-3xl p-8 pt-12 transition-all hover:-translate-y-1">
            <div className="absolute -top-6 -right-6 text-[120px] font-black text-gray-900/5 leading-none">2</div>
            <div className="mb-6 w-14 h-14 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm">
              <Link2 className="text-primary" size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black text-gray-950 mb-4">Agents Pitch</h3>
            <p className="text-gray-600 font-medium leading-relaxed">
              Verified real estate agents monitor the marketplace. When they have a property that matches your exact criteria, they submit a detailed "Pitch" directly to your dashboard.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 shadow-xl shadow-black/[0.03] backdrop-blur-3xl p-8 pt-12 transition-all hover:-translate-y-1">
            <div className="absolute -top-6 -right-6 text-[120px] font-black text-gray-900/5 leading-none">3</div>
            <div className="mb-6 w-14 h-14 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm">
              <Handshake className="text-primary" size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black text-gray-950 mb-4">Compare & Connect</h3>
            <p className="text-gray-600 font-medium leading-relaxed">
              Review multiple tailored pitches side-by-side in your private negotiation room. Accept the best match and seamlessly connect with the agent to close the deal.
            </p>
          </div>
        </div>

        <div className="mt-20 text-center">
          <a
            href="/briefs/new"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-8 py-5 text-lg font-black text-white shadow-2xl shadow-gray-900/20 transition-all hover:bg-emerald-600 hover:-translate-y-1 group"
          >
            Start Your Search Now
            <Sparkles size={20} className="transition-transform group-hover:scale-110" />
          </a>
        </div>
      </div>
    </main>
  );
}
