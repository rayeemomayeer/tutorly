"use client";

import { ReactNode, useEffect } from "react";
import { useGetSessionQuery } from "./authApi";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "./authSlice";
import { usePathname, useRouter } from "next/navigation";

type UserRole = "student" | "tutor" | "admin";

const ROLE_PRIORITY: Record<UserRole, number> = {
  student: 1,
  tutor: 2,
  admin: 3,
};

const TUTOR_PROTECTED_ROUTE_PATTERN =
  /^\/tutors\/[^/]+\/(edit|bookings|availability)$/;

function getRequiredRole(pathname: string): UserRole | null {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return "admin";
  }

  if (pathname === "/student" || pathname.startsWith("/student/")) {
    return "student";
  }

  if (pathname === "/tutors") {
    return "student";
  }

  if (TUTOR_PROTECTED_ROUTE_PATTERN.test(pathname)) {
    return "tutor";
  }

  return null;
}

function normalizeRole(role: unknown): UserRole | null {
  if (role === "student" || role === "tutor" || role === "admin") {
    return role;
  }

  return null;
}

function canAccessRoute(userRole: UserRole, requiredRole: UserRole) {
  return ROLE_PRIORITY[userRole] >= ROLE_PRIORITY[requiredRole];
}

function getDefaultRoute(role: UserRole | null) {
  if (role === "admin") return "/admin";
  if (role === "tutor") return "/tutors";
  if (role === "student") return "/student";

  return "/login";
}

export default function SessionProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, isError } = useGetSessionQuery();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();

  const user = data?.user ?? null;
  const userRole = normalizeRole(user?.role);
  const requiredRole = getRequiredRole(pathname);
  const isProtectedRoute = requiredRole !== null;
  const isAuthenticated = Boolean(user);
  const isAllowed =
    !isProtectedRoute ||
    (isAuthenticated &&
      userRole !== null &&
      canAccessRoute(userRole, requiredRole));

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    } else if (!isLoading || isError) {
      dispatch(clearUser());
    }
  }, [user, isLoading, isError, dispatch]);

  useEffect(() => {
    if (isLoading || isAllowed) return;

    router.replace(getDefaultRoute(userRole));
  }, [isLoading, isAllowed, router, userRole]);

  if (isLoading) {
    return <p>Loading session...</p>;
  }

  if (!isAllowed) {
    return <p>Redirecting...</p>;
  }

  return <>{children}</>;
}
