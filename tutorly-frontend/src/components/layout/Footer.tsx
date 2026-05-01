import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Browse tutors", href: "/tutors" },
  { label: "Become a tutor", href: "/register" },
  { label: "Sign in", href: "/login" },
];

export function Footer() {
  return (
    <footer className="px-10 py-8 border-t border-[#e5e3de] flex items-center justify-between">

      <span className="font-display text-base text-[#9e9c97] font-normal">
        Tutorly
      </span>

      <div className="flex items-center gap-6">
        {FOOTER_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-xs text-[#9e9c97] font-light hover:text-[#1a1a18] transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>

  
      <span className="text-xs text-[#c4c2bd] font-light">
        © {new Date().getFullYear()} Tutorly
      </span>
    </footer>
  );
}