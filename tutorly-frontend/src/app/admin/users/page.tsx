"use client";

import { useState } from "react";
import { useGetUsersQuery } from "@/features/admin/adminApi";
import UserList from "@/features/admin/UserList";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading } = useGetUsersQuery({ page, limit });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafaf8] px-4 sm:px-10 py-10 flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-32 rounded" />
          <Skeleton className="h-9 w-56 rounded" />
        </div>
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center">
        <p className="text-sm text-[#9e9c97]">No users found.</p>
      </div>
    );
  }

  const { totalPages } = data.meta;

  return (
    <div className="min-h-screen bg-[#fafaf8] px-4 sm:px-10 py-10 flex flex-col gap-8 max-w-4xl mx-auto">

      <div>
        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-5 h-px bg-indigo-500 block" />
          <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-indigo-500">
            Admin
          </span>
        </div>
        <h1 className="font-display text-[28px] sm:text-[34px] font-normal tracking-[-0.8px] text-[#1a1a18] leading-tight">
          Manage{" "}
          <em className="font-display italic font-light text-indigo-500">
            users
          </em>
        </h1>
        <p className="text-sm text-[#9e9c97] font-light mt-1.5">
          Page {page} of {totalPages}
        </p>
      </div>

      <UserList users={data.data} />

      <div className="flex items-center justify-between gap-3 flex-nowrap">
        <Button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="whitespace-nowrap"
        >
          ← Prev
        </Button>

        <span className="text-xs text-[#6b6b66] font-light whitespace-nowrap">
          Page {page} / {totalPages}
        </span>

        <Button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="whitespace-nowrap"
        >
          Next →
        </Button>
      </div>  
    </div>
  );
}