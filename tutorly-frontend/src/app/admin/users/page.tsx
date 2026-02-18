"use client";
import { useState } from "react";
import { useGetUsersQuery } from "@/features/admin/adminApi";
import UserList from "@/features/admin/UserList";
import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const limit = 5; 

  const { data, isLoading } = useGetUsersQuery({ page, limit });

  if (isLoading) return <p>Loading users...</p>;
  if (!data) return <p>No users found.</p>;

  const { totalPages } = data.meta;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Users</h1>
      <UserList users={data.data} />

      {/* Pagination Controls */}
      <div className="flex gap-2 mt-4">
        <Button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </Button>
        <span className="px-2">Page {page} of {totalPages}</span>
        <Button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}