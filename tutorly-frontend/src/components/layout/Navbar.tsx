"use client";

import LogoutButton from "@/features/auth/LogoutButton";
import { useGetTutorsQuery } from "@/features/tutors/tutorApi";
import type { RootState } from "@/lib/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Menu, X } from "lucide-react";

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
  { label: "Profile", href: "/student" },
  { label: "My bookings", href: "/student/bookings" },
];

const ADMIN_LINKS: NavLink[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Bookings", href: "/admin/bookings" },
  { label: "Browse tutors", href: "/tutors" },
];

function getTutorProfileId(user: AuthUser | null, resolvedTutorProfileId?: string) {
  return resolvedTutorProfileId ?? user?.tutorProfile?.id ?? user?.tutor?.id ?? user?.tutorId;
}

function getRoleLinks(user: AuthUser | null, tutorProfileId?: string): NavLink[] {
  if (!user?.role) return PUBLIC_LINKS;
  if (user.role === "admin") return ADMIN_LINKS;
  if (user.role === "tutor") {
    const tutorId = getTutorProfileId(user, tutorProfileId);
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

function getLinkClass(pathname: string, href: string, mobile = false) {
  const isActive =
    href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  if (mobile) {
    return `block text-sm font-light py-2.5 border-b border-[#f0ede8] transition-colors ${
      isActive ? "text-[#1a1a18]" : "text-[#6b6b66]"
    }`;
  }
  return `text-[13px] font-light transition-colors ${
    isActive ? "text-[#1a1a18]" : "text-[#6b6b66] hover:text-[#1a1a18]"
  }`;
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user as AuthUser | null);
  const { data: tutors } = useGetTutorsQuery(
    { page: 1, limit: 100 },
    { skip: user?.role !== "tutor" }
  );
  const tutorProfileId = tutors?.data.find((tutor) => tutor.user.id === user?.id)?.id;
  const navLinks = getRoleLinks(user, tutorProfileId);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#fafaf8] border-b border-[#e5e3de]">
        <div className="flex items-center justify-between px-5 sm:px-10 py-4 sm:py-5">
          <Link
            href="/"
            className="font-display text-xl font-normal tracking-[-0.3px] text-[#1a1a18] hover:opacity-80 transition-opacity"
          >
            Tutorly
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={getLinkClass(pathname, link.href)}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
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

          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-md text-[#6b6b66] hover:text-[#1a1a18] hover:bg-[#f0ede8] transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden px-5 pb-4 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={getLinkClass(pathname, link.href, true)}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              {user ? (
                <LogoutButton />
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-center text-[#6b6b66] font-light border border-[#e5e3de] rounded-md py-2.5 hover:text-[#1a1a18] hover:border-[#c4c2bd] transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm text-center bg-[#1a1a18] text-[#fafaf8] rounded-md py-2.5 hover:bg-[#2c2c2a] transition-colors"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}