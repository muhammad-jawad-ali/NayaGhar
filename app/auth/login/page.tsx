import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#020617]">
      <AuthForm type="login" />
    </main>
  );
}
