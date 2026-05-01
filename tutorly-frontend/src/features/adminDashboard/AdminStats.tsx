"use client";

import { useGetStatsQuery } from "./adminDashboardApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, GraduationCap, CalendarDays, Tag } from "lucide-react";


const STAT_CONFIG = [
  {
    key: "totalUsers" as const,
    label: "Total users",
    icon: Users,
    iconClass: "text-indigo-500 bg-indigo-50",
    description: "Registered accounts",
  },
  {
    key: "totalTutors" as const,
    label: "Active tutors",
    icon: GraduationCap,
    iconClass: "text-emerald-600 bg-emerald-50",
    description: "Tutor profiles",
  },
  {
    key: "totalBookings" as const,
    label: "Bookings",
    icon: CalendarDays,
    iconClass: "text-orange-500 bg-orange-50",
    description: "Sessions booked",
  },
  {
    key: "totalCategories" as const,
    label: "Categories",
    icon: Tag,
    iconClass: "text-violet-500 bg-violet-50",
    description: "Subject categories",
  },
];


function StatSkeleton() {
  return (
    <div className="bg-white border border-[#e5e3de] rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24 rounded" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-9 w-20 rounded" />
      <Skeleton className="h-3 w-16 rounded" />
    </div>
  );
}


export default function AdminStats() {
  const { data, isLoading } = useGetStatsQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => <StatSkeleton key={i} />)}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white border border-[#e5e3de] rounded-xl px-5 py-8 text-center">
        <p className="text-sm text-[#9e9c97] font-light">Stats unavailable</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {STAT_CONFIG.map((stat) => {
        const Icon = stat.icon;
        const value = data[stat.key];

        return (
          <div
            key={stat.key}
            className="bg-white border border-[#e5e3de] rounded-xl p-5
                       hover:border-[#c4c2bd] transition-colors duration-150"
          >
   
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-[#9e9c97] font-light">
                {stat.label}
              </span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.iconClass}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>


            <p className="font-display text-[36px] font-normal text-[#1a1a18] leading-none tracking-[-1px] mb-2">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>


            <p className="text-[11px] text-[#c4c2bd] font-light">
              {stat.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}