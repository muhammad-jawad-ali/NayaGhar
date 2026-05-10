export default function TermsOfServicePage() {
  return (
    <main className="relative min-h-screen bg-[#f7f5ef] pt-32 pb-24 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tight text-gray-950 sm:text-6xl mb-6">
            Terms of Service
          </h1>
          <p className="text-lg font-medium text-gray-500">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 shadow-xl shadow-black/[0.03] backdrop-blur-3xl p-8 sm:p-12 prose prose-emerald prose-lg max-w-none text-gray-600">
          <h2 className="text-2xl font-black text-gray-900 mt-0">1. Acceptance of Terms</h2>
          <p className="font-medium">
            By accessing and using NayaGhar, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mt-8">2. Description of Service</h2>
          <p className="font-medium">
            NayaGhar provides a platform for buyers to post real estate requirements ("Briefs") and for agents to respond with available properties ("Pitches/Bids"). We act solely as an intermediary matching platform and are not a real estate broker.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mt-8">3. User Conduct</h2>
          <p className="font-medium">
            Users agree to use the platform only for lawful purposes. You agree not to:
          </p>
          <ul className="font-medium">
            <li>Post false or misleading property requirements or pitches.</li>
            <li>Harass, abuse, or harm other users.</li>
            <li>Circumvent the platform's security features.</li>
            <li>Create multiple accounts for malicious purposes.</li>
          </ul>

          <h2 className="text-2xl font-black text-gray-900 mt-8">4. Account Termination</h2>
          <p className="font-medium">
            We reserve the right to suspend or terminate your account at any time, without notice, for conduct that violates these Terms of Service or is harmful to other users of the application, us, or third parties.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mt-8">5. Disclaimer of Warranties</h2>
          <p className="font-medium">
            The service is provided on an "as is" and "as available" basis. NayaGhar makes no representations or warranties of any kind regarding the accuracy, reliability, or completeness of the properties pitched by agents.
          </p>
        </div>
      </div>
    </main>
  );
}
