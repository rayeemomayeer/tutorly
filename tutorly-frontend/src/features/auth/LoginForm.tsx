
"use client";
import { useLoginMutation, useLazyGetSessionQuery } from "./authApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DEMO_ACCOUNTS, DemoRole } from "./demoAuth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const [getSession, { isFetching: isFetchingSession }] = useLazyGetSessionQuery();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  const handleDemoLogin = async (role: DemoRole) => {
    const account = DEMO_ACCOUNTS[role];

    try {
      await login({
        email: account.email,
        password: account.password,
      }).unwrap();
      await getSession(undefined, false).unwrap();

      toast.success(`Logged in as ${account.label}.`);
      router.replace(account.redirectTo);
    } catch {
      toast.error(
        `Could not log in as ${account.label}. Make sure ${account.email} exists in the database.`
      );
    }
  };

  return (
    <div className="space-y-6 max-w-sm mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <div className="space-y-3 border-t border-[#e5e3de] pt-5">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#9e9c97]">
          Demo access
        </p>
        <div className="grid gap-2">
          {(Object.keys(DEMO_ACCOUNTS) as DemoRole[]).map((role) => (
            <Button
              key={role}
              type="button"
              variant="outline"
              disabled={isLoading || isFetchingSession}
              onClick={() => handleDemoLogin(role)}
              className="w-full justify-center"
            >
              {DEMO_ACCOUNTS[role].label}
            </Button>
          ))}
        </div>
        <p className="text-xs text-[#6b6b66]">
          Demo users can browse everything for their role and only submit POST actions.
        </p>
      </div>
    </div>
  );
}
