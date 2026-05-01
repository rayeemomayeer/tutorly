"use client";

import LogoutButton from "@/features/auth/LogoutButton";
import type { RootState } from "@/lib/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

type UserRole = "student" | "tutor" | "admin";

type AuthUser = {
  id?: string;
  role?: UserRole;
  tutorId?: string;
  tutor?: { id?: string };
  tutorProfile?: { id?: string };
};

type NavLink = {
  label: string;
  href: string;
};

const PUBLIC_LINKS: NavLink[] = [
  { label: "How it works", href: "/#how-it-works" },
];

const STUDENT_LINKS: NavLink[] = [
  { label: "Browse tutors", href: "/tutors" },
  { label: "Dashboard", href: "/student" },
  { label: "My bookings", href: "/student/bookings" },
  { label: "Profile", href: "/student/profile" },
];

const ADMIN_LINKS: NavLink[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Bookings", href: "/admin/bookings" },
  { label: "Browse tutors", href: "/tutors" },
];

function getTutorProfileId(user: AuthUser | null) {
  return user?.tutorId ?? user?.tutorProfile?.id ?? user?.tutor?.id ?? user?.id;
}

function getRoleLinks(user: AuthUser | null): NavLink[] {
  if (!user?.role) return PUBLIC_LINKS;

  if (user.role === "admin") return ADMIN_LINKS;

  if (user.role === "tutor") {
    const tutorId = getTutorProfileId(user);

    return [
      { label: "Browse tutors", href: "/tutors" },
      ...(tutorId
        ? [
            { label: "Edit profile", href: `/tutors/${tutorId}/edit` },
            { label: "Tutor bookings", href: `/tutors/${tutorId}/bookings` },
            { label: "Availability", href: `/tutors/${tutorId}/availability` },
          ]
        : []),
    ];
  }

  return STUDENT_LINKS;
}

function getLinkClass(pathname: string, href: string) {
  const isActive =
    href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return `text-[13px] font-light transition-colors ${
    isActive ? "text-[#1a1a18]" : "text-[#6b6b66] hover:text-[#1a1a18]"
  }`;
}

export function Navbar() {
  const pathname = usePathname();
  const user = useSelector(
    (state: RootState) => state.auth.user as AuthUser | null
  );
  const navLinks = getRoleLinks(user);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-10 py-5 bg-[#fafaf8] border-b border-[#e5e3de]">

      <Link
        href="/"
        className="font-display text-xl font-normal tracking-[-0.3px] text-[#1a1a18] hover:opacity-80 transition-opacity"
      >
        Tutorly
      </Link>

      <div className="flex items-center gap-7">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={getLinkClass(pathname, link.href)}
          >
            {link.label}
          </Link>
        ))}
      </div>


      <div className="flex items-center gap-3">
        {user ? (
          <LogoutButton />
        ) : (
          <>
            <Link
              href="/login"
              className="text-[13px] text-[#6b6b66] font-light hover:text-[#1a1a18] transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-[13px] bg-[#1a1a18] text-[#fafaf8] px-4 py-2 rounded-md hover:bg-[#2c2c2a] transition-colors"
            >
              Get started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
