import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#f7f5ef]">
      {/* Premium Pakistan Architecture Background (Local Asset) */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/assets/images/pakistan_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      {/* Cinematic Darkening Overlay */}
      <div className="absolute inset-0 z-0 bg-black/40" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
      
      {/* Soft edge glows */}
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 blur-[150px] pointer-events-none z-0" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none z-0" />

      {/* Content */}
      <div className="relative z-10 w-full">
        <AuthForm type="login" />
      </div>
    </main>
  );
}
