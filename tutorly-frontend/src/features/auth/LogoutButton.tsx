
"use client";
import { useLogoutMutation } from "./authApi";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const [logout, { isLoading }] = useLogoutMutation();

  return (
    <Button onClick={() => logout()} disabled={isLoading}>
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
}