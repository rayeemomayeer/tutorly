import LoginForm from "@/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Login</h1>
      <LoginForm/>
    </div>
  );
}