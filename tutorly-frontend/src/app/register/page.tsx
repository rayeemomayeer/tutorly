import RegisterForm from "@/features/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Register</h1>
      <RegisterForm/>
    </div>
  );
}