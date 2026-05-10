export default function PrivacyPolicyPage() {
  return (
    <main className="relative min-h-screen bg-[#f7f5ef] pt-32 pb-24 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tight text-gray-950 sm:text-6xl mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg font-medium text-gray-500">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 shadow-xl shadow-black/[0.03] backdrop-blur-3xl p-8 sm:p-12 prose prose-emerald prose-lg max-w-none text-gray-600">
          <h2 className="text-2xl font-black text-gray-900 mt-0">1. Introduction</h2>
          <p className="font-medium">
            At NayaGhar, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our demand-first real estate marketplace.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mt-8">2. Information We Collect</h2>
          <p className="font-medium">
            We collect personal information that you voluntarily provide to us when you register on the platform. This includes:
          </p>
          <ul className="font-medium">
            <li>Name and Email Address</li>
            <li>Role (Buyer or Agent)</li>
            <li>Property requirements (Briefs) and Pitches (Bids)</li>
            <li>Usage data and cookies to maintain your session (NextAuth).</li>
          </ul>

          <h2 className="text-2xl font-black text-gray-900 mt-8">3. How We Use Your Information</h2>
          <p className="font-medium">
            Your information is used to facilitate the core functionality of NayaGhar:
          </p>
          <ul className="font-medium">
            <li>To match buyers with relevant agents.</li>
            <li>To manage your account and authentication sessions.</li>
            <li>To send notifications regarding new bids or accepted pitches.</li>
          </ul>

          <h2 className="text-2xl font-black text-gray-900 mt-8">4. Data Security</h2>
          <p className="font-medium">
            We use administrative, technical, and physical security measures to help protect your personal information. Your passwords are encrypted using industry-standard hashing algorithms (bcrypt) before being stored in our MongoDB database. Plain-text passwords are never logged or stored.
          </p>

          <h2 className="text-2xl font-black text-gray-900 mt-8">5. Contact Us</h2>
          <p className="font-medium">
            If you have questions or comments about this Privacy Policy, please contact us at privacy@nayaghar.com.
          </p>
        </div>
      </div>
    </main>
  );
}
