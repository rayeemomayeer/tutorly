
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetTutorsQuery } from "./tutorApi";

export default function TutorList() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [minRate, setMinRate] = useState<number | undefined>();
  const [maxRate, setMaxRate] = useState<number | undefined>();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetTutorsQuery({
    page,
    limit: 10,
    categoryId: categoryId || undefined,
    minRate,
    maxRate,
    search: search || undefined,
  });

  const role = useSelector((state: any) => state.auth?.user?.role);
  const currentUserId = useSelector((state: any) => state.auth?.user?.id);
  const router = useRouter();

  if (isLoading) return <p>Loading tutors...</p>;
  if (!data?.data) return <p>No tutors found.</p>;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Category ID..."
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="border p-2"
        />
        <input
          type="number"
          placeholder="Min Rate"
          value={minRate ?? ""}
          onChange={(e) =>
            setMinRate(e.target.value ? Number(e.target.value) : undefined)
          }
          className="border p-2"
        />
        <input
          type="number"
          placeholder="Max Rate"
          value={maxRate ?? ""}
          onChange={(e) =>
            setMaxRate(e.target.value ? Number(e.target.value) : undefined)
          }
          className="border p-2"
        />
      </div>

      {/* Tutor Cards */}
      {data.data.map((tutor: any) => (
        <div key={tutor.id} className="border p-4 rounded flex justify-between">
          <div>
            <h2 className="font-bold">{tutor.user.name}</h2>
            <p>{tutor.bio}</p>
            <p>Subjects: {tutor.subjects.map((s: any) => s.name).join(", ")}</p>
            <p>Hourly Rate: ${tutor.hourlyRate}</p>
          </div>

          {/* Role-based actions */}
          <div className="space-x-2">
            {role === "student" &&

              <div className="flex gap-2">
                <Link href={`/tutors/${tutor.id}`}>
                  <Button variant="secondary">View Profile</Button>
                </Link>

              </div>

            }

            {role === "tutor" && tutor.user.id === currentUserId && (
              <Button onClick={() => router.push(`/tutors/${tutor.id}/edit`)}>
                Edit Profile
              </Button>
            )}

            {role === "admin" && (
              <>
                <Button variant="destructive">Ban</Button>
                <Button>Promote/Demote</Button>
              </>
            )}
          </div>
        </div>
      ))}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <Button
          disabled={page <= 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span>
          Page {data.meta.page} of {data.meta.totalPages}
        </span>
        <Button
          disabled={page >= data.meta.totalPages}
          onClick={() =>
            setPage((prev) => Math.min(prev + 1, data.meta.totalPages))
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}