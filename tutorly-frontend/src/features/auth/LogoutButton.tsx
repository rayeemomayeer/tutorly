
"use client";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { authApi, useLogoutMutation } from "./authApi";
import { clearUser } from "./authSlice";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await logout().unwrap();
    dispatch(clearUser());
    dispatch(authApi.util.resetApiState());
    router.replace("/login");
  };

  return (
    <Button onClick={handleLogout} disabled={isLoading}>
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
}
