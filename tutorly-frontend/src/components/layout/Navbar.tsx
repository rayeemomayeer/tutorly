"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Browse tutors", href: "/tutors" },
  { label: "How it works", href: "/#how-it-works", anchor: true },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-10 py-5 bg-[#fafaf8] border-b border-[#e5e3de]">

      <Link
        href="/"
        className="font-display text-xl font-normal tracking-[-0.3px] text-[#1a1a18] hover:opacity-80 transition-opacity"
      >
        Tutorly
      </Link>

      <div className="flex items-center gap-7">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[13px] text-[#6b6b66] font-light hover:text-[#1a1a18] transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>


      <div className="flex items-center gap-3">
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
      </div>
    </nav>
  );
}