import AdminStats from "@/features/adminDashboard/AdminStats";
import Link from "next/link";
import { Users, CalendarDays, Tag, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Dashboard — Tutorly Admin",
};

const MANAGEMENT_LINKS = [
  {
    label: "Users",
    href: "/admin/users",
    description: "View, search, and manage all registered users and their roles.",
    icon: Users,
    iconClass: "text-indigo-500 bg-indigo-50",
  },
  {
    label: "Bookings",
    href: "/admin/bookings",
    description: "Review all session bookings, statuses, and tutor assignments.",
    icon: CalendarDays,
    iconClass: "text-orange-500 bg-orange-50",
  },
  {
    label: "Categories",
    href: "/admin/categories",
    description: "Create, edit, and remove subject categories for tutors.",
    icon: Tag,
    iconClass: "text-violet-500 bg-violet-50",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

      <div>
        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-5 h-px bg-indigo-500 block" />
          <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-indigo-500">
            Overview
          </span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl lg:text-[34px] font-normal tracking-tight text-[#1a1a18] leading-tight">
          Admin{" "}
          <em className="font-display italic font-light text-indigo-500">
            dashboard
          </em>
        </h1>
        <p className="text-sm text-[#9e9c97] font-light mt-1.5">
          Platform health at a glance.
        </p>
      </div>

      <AdminStats />

      <div className="flex items-center gap-4">
        <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#9e9c97]">
          Manage
        </span>
        <div className="flex-1 h-px bg-[#e5e3de]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MANAGEMENT_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group bg-white border border-[#e5e3de] rounded-xl p-5
              hover:border-indigo-300 hover:shadow-sm transition-all duration-150
              flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${link.iconClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <ArrowRight className="w-4 h-4 text-[#c4c2bd] group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all duration-150" />
              </div>

              <div>
                <p className="text-sm font-medium text-[#1a1a18] mb-1">
                  {link.label}
                </p>
                <p className="text-xs text-[#9e9c97] font-light leading-relaxed">
                  {link.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}