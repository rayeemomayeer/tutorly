"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useGetTutorsQuery } from "./tutorApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCategoriesQuery } from "@/features/adminCategories/adminCategoryApi";
import type { RootState } from "@/lib/store";

// ─── Types ─────────────────────────────────────────────────────────────────────
type Subject = { id: string; name: string };
type Tutor = {
  id: string;
  user: { id: string; name: string; image?: string };
  bio: string;
  hourlyRate: number;
  subjects: Subject[];
  tutorReviews?: { rating: number }[];
};
type AuthUser = { id?: string; role?: string };

// ─── Helpers ───────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColors(name: string): string {
  const palettes = [
    "bg-indigo-50 text-indigo-600",
    "bg-emerald-50 text-emerald-700",
    "bg-orange-50 text-orange-700",
    "bg-rose-50 text-rose-700",
    "bg-violet-50 text-violet-700",
    "bg-sky-50 text-sky-700",
    "bg-amber-50 text-amber-700",
  ];
  // deterministic by name so color doesn't change on re-render
  const idx = name.charCodeAt(0) % palettes.length;
  return palettes[idx];
}

function averageRating(reviews?: { rating: number }[]): string {
  if (!reviews || reviews.length === 0) return "";
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  return avg.toFixed(1);
}

// ─── Skeleton loaders ──────────────────────────────────────────────────────────
function TutorCardSkeleton() {
  return (
    <div className="bg-white border border-[#e5e3de] rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-11 h-11 rounded-full" />
        <div className="flex flex-col gap-1.5 flex-1">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex gap-1.5 mt-1">
        <Skeleton className="h-5 w-16 rounded" />
        <Skeleton className="h-5 w-20 rounded" />
      </div>
    </div>
  );
}

// ─── Individual Tutor Card ─────────────────────────────────────────────────────
function TutorCard({
  tutor,
  role,
  currentUserId,
}: {
  tutor: Tutor;
  role: string | undefined;
  currentUserId: string | undefined;
}) {
  const router = useRouter();
  const isOwnProfile = role === "tutor" && tutor.user.id === currentUserId;
  const avg = averageRating(tutor.tutorReviews);
  const reviewCount = tutor.tutorReviews?.length ?? 0;

  return (
    <div
      className="group bg-white border border-[#e5e3de] rounded-xl p-5 flex flex-col
                 hover:border-indigo-300 hover:shadow-sm transition-all duration-150"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {tutor.user.image ? (
            <img
              src={tutor.user.image}
              alt={tutor.user.name}
              className="w-11 h-11 rounded-full object-cover shrink-0"
            />
          ) : (
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center
                          text-sm font-medium shrink-0 ${getAvatarColors(tutor.user.name)}`}
            >
              {getInitials(tutor.user.name)}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-[#1a1a18] leading-tight">
              {tutor.user.name}
            </p>
            <p className="text-xs text-[#9e9c97] mt-0.5">
              ${tutor.hourlyRate}
              <span className="font-light"> / hour</span>
            </p>
          </div>
        </div>

        {/* Rating badge — only shown if reviews exist */}
        {avg && (
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-amber-400 text-xs">★</span>
            <span className="text-xs text-[#6b6b66]">
              {avg}
              <span className="text-[#c4c2bd] ml-0.5">({reviewCount})</span>
            </span>
          </div>
        )}
      </div>

      {/* Bio */}
      {tutor.bio && (
        <p className="text-xs text-[#6b6b66] font-light leading-relaxed mb-3 line-clamp-2">
          {tutor.bio}
        </p>
      )}

      {/* Subject tags */}
      {tutor.subjects.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tutor.subjects.slice(0, 4).map((s) => (
            <span
              key={s.id}
              className="text-[11px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-[3px]"
            >
              {s.name}
            </span>
          ))}
          {tutor.subjects.length > 4 && (
            <span className="text-[11px] text-[#9e9c97] px-1">
              +{tutor.subjects.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions — role-based */}
      <div className="pt-4 border-t border-[#f0ede8]">
        {/* Student: view profile */}
        {role === "student" && (
          <Link
            href={`/tutors/${tutor.id}`}
            className="w-full flex items-center justify-center text-xs font-medium
                       text-indigo-600 bg-indigo-50 hover:bg-indigo-100
                       py-2 rounded-md transition-colors"
          >
            View profile →
          </Link>
        )}

        {/* Tutor: edit own profile */}
        {isOwnProfile && (
          <button
            onClick={() => router.push(`/tutors/${tutor.id}/edit`)}
            className="w-full flex items-center justify-center text-xs font-medium
                       text-[#1a1a18] bg-[#f0ede8] hover:bg-[#e8e5df]
                       py-2 rounded-md transition-colors"
          >
            Edit profile
          </button>
        )}

        {/* Admin: management actions */}
        {role === "admin" && (
          <div className="flex gap-2">
            <Link
              href={`/tutors/${tutor.id}`}
              className="flex-1 flex items-center justify-center text-xs font-medium
                         text-[#1a1a18] bg-[#f0ede8] hover:bg-[#e8e5df]
                         py-2 rounded-md transition-colors"
            >
              View
            </Link>
            <button
              className="flex-1 flex items-center justify-center text-xs font-medium
                         text-rose-600 bg-rose-50 hover:bg-rose-100
                         py-2 rounded-md transition-colors"
            >
              Ban
            </button>
          </div>
        )}

        {/* Not logged in: link to profile */}
        {!role && (
          <Link
            href={`/tutors/${tutor.id}`}
            className="w-full flex items-center justify-center text-xs font-medium
                       text-indigo-600 bg-indigo-50 hover:bg-indigo-100
                       py-2 rounded-md transition-colors"
          >
            View profile →
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Filter Sidebar ────────────────────────────────────────────────────────────
// Note: "categoryId" filter is kept but exposed as a text input labeled "Subject ID"
// until you have a /api/categories endpoint to populate a proper dropdown.
// To upgrade: fetch categories, map to <option> elements inside the <select>.
function FilterSidebar({
  search, setSearch,
  categoryId, setCategoryId,
  categories,
  selectedCategoryName,
  minRate, setMinRate,
  maxRate, setMaxRate,
  onReset,
}: {
  search: string;       setSearch: (v: string) => void;
  categoryId: string;   setCategoryId: (v: string) => void;
  categories: Subject[];
  selectedCategoryName: string;
  minRate: number | undefined;   setMinRate: (v: number | undefined) => void;
  maxRate: number | undefined;   setMaxRate: (v: number | undefined) => void;
  onReset: () => void;
}) {
  const hasActiveFilters = search || categoryId || minRate !== undefined || maxRate !== undefined;

  return (
    <aside className="w-[240px] shrink-0 flex flex-col gap-6">
      {/* Sidebar label */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#9e9c97]">
          Filters
        </span>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-[11px] text-indigo-500 hover:text-indigo-700 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search by name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#6b6b66]">Name</label>
        <input
          type="text"
          placeholder="e.g. Ayesha Rahman"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm text-[#1a1a18] bg-white border border-[#e5e3de]
                     rounded-md px-3 py-2 placeholder:text-[#c4c2bd] placeholder:font-light
                     focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100
                     transition-colors"
        />
      </div>

      {/* Subject / Category */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#6b6b66]">Subject</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full text-sm text-[#1a1a18] bg-white border border-[#e5e3de]
                     rounded-md px-3 py-2 placeholder:text-[#c4c2bd] placeholder:font-light
                     focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100
                     transition-colors"
        >
          <option value="">All subjects</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Hourly rate range */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[#6b6b66]">Hourly rate ($)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minRate ?? ""}
            min={0}
            onChange={(e) =>
              setMinRate(e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full text-sm text-[#1a1a18] bg-white border border-[#e5e3de]
                       rounded-md px-3 py-2 placeholder:text-[#c4c2bd] placeholder:font-light
                       focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100
                       transition-colors"
          />
          <span className="text-xs text-[#c4c2bd] shrink-0">to</span>
          <input
            type="number"
            placeholder="Max"
            value={maxRate ?? ""}
            min={0}
            onChange={(e) =>
              setMaxRate(e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full text-sm text-[#1a1a18] bg-white border border-[#e5e3de]
                       rounded-md px-3 py-2 placeholder:text-[#c4c2bd] placeholder:font-light
                       focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100
                       transition-colors"
          />
        </div>
      </div>

      {/* Active filter pills — visual feedback */}
      {hasActiveFilters && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#c4c2bd]">
            Active
          </span>
          <div className="flex flex-wrap gap-1.5">
            {search && (
              <span className="inline-flex items-center gap-1 text-[11px] text-indigo-600
                               bg-indigo-50 px-2 py-0.5 rounded-full">
                {search}
                <button onClick={() => setSearch("")} className="ml-0.5 hover:text-indigo-800">×</button>
              </span>
            )}
            {categoryId && (
              <span className="inline-flex items-center gap-1 text-[11px] text-indigo-600
                               bg-indigo-50 px-2 py-0.5 rounded-full">
                {selectedCategoryName || "Subject"}
                <button onClick={() => setCategoryId("")} className="ml-0.5 hover:text-indigo-800">×</button>
              </span>
            )}
            {(minRate !== undefined || maxRate !== undefined) && (
              <span className="inline-flex items-center gap-1 text-[11px] text-indigo-600
                               bg-indigo-50 px-2 py-0.5 rounded-full">
                ${minRate ?? "0"}–${maxRate ?? "∞"}
                <button
                  onClick={() => { setMinRate(undefined); setMaxRate(undefined); }}
                  className="ml-0.5 hover:text-indigo-800"
                >×</button>
              </span>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-12 h-12 rounded-full bg-[#f0ede8] flex items-center justify-center mb-4">
        <span className="text-xl">🔍</span>
      </div>
      <p className="text-sm font-medium text-[#1a1a18] mb-1">No tutors found</p>
      <p className="text-xs text-[#9e9c97] font-light mb-5">
        Try adjusting your filters or search term.
      </p>
      <button
        onClick={onReset}
        className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );
}

// ─── Pagination ────────────────────────────────────────────────────────────────
function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  // Show a window of page numbers around the current page
  const pages = useMemo(() => {
    const range: (number | "…")[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        range.push(i);
      } else if (range[range.length - 1] !== "…") {
        range.push("…");
      }
    }
    return range;
  }, [page, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-6 mt-2 border-t border-[#e5e3de]">
      <button
        disabled={page <= 1}
        onClick={onPrev}
        className="text-xs text-[#6b6b66] disabled:text-[#c4c2bd] disabled:cursor-not-allowed
                   hover:text-[#1a1a18] transition-colors flex items-center gap-1"
      >
        ← Previous
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="text-xs text-[#c4c2bd] px-1">…</span>
          ) : (
            <button
              key={p}
              onClick={() => {
                if (p < page) onPrev();
                else if (p > page) onNext();
              }}
              className={`w-7 h-7 rounded text-xs transition-colors ${
                p === page
                  ? "bg-[#1a1a18] text-[#fafaf8]"
                  : "text-[#6b6b66] hover:bg-[#f0ede8]"
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        disabled={page >= totalPages}
        onClick={onNext}
        className="text-xs text-[#6b6b66] disabled:text-[#c4c2bd] disabled:cursor-not-allowed
                   hover:text-[#1a1a18] transition-colors flex items-center gap-1"
      >
        Next →
      </button>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function TutorList() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [minRate, setMinRate] = useState<number | undefined>();
  const [maxRate, setMaxRate] = useState<number | undefined>();
  const [page, setPage] = useState(1);

  const authUser = useSelector(
    (state: RootState) => state.auth.user as AuthUser | null
  );
  const role = authUser?.role;
  const currentUserId = authUser?.id;
  const { data: categories = [] } = useGetCategoriesQuery();
  const selectedCategoryName =
    categories.find((category) => category.id === categoryId)?.name ?? "";

  const { data, isLoading } = useGetTutorsQuery({
    page,
    limit: 9,
    categoryId: categoryId || undefined,
    minRate,
    maxRate,
    search: search || undefined,
  });

  function handleReset() {
    setSearch("");
    setCategoryId("");
    setMinRate(undefined);
    setMaxRate(undefined);
    setPage(1);
  }

  const totalPages = data?.meta?.totalPages ?? 1;
  const totalCount = data?.meta?.total ?? 0;

  return (
    <div className="min-h-screen bg-[#fafaf8] pt-5">
      {/* ── Page header ── */}
      <div className="px-10 py-10 border-b border-[#e5e3de]">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="w-5 h-px bg-indigo-500 block shrink-0" />
          <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-indigo-500">
            Expert tutors
          </span>
        </div>
        <h1 className="font-display text-[38px] font-normal tracking-[-1px] text-[#1a1a18] leading-tight">
          Find your{" "}
          <em className="font-display italic font-light text-indigo-500">
            perfect
          </em>{" "}
          tutor
        </h1>
        {!isLoading && totalCount > 0 && (
          <p className="text-sm text-[#9e9c97] font-light mt-2">
            {totalCount} tutor{totalCount !== 1 ? "s" : ""} available
          </p>
        )}
      </div>

      {/* ── Body: sidebar + grid ── */}
      <div className="flex gap-10 px-10 py-10">
        {/* Filters */}
        <FilterSidebar
          search={search}           setSearch={(v) => { setSearch(v); setPage(1); }}
          categoryId={categoryId}   setCategoryId={(v) => { setCategoryId(v); setPage(1); }}
          categories={categories}
          selectedCategoryName={selectedCategoryName}
          minRate={minRate}         setMinRate={(v) => { setMinRate(v); setPage(1); }}
          maxRate={maxRate}         setMaxRate={(v) => { setMaxRate(v); setPage(1); }}
          onReset={handleReset}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Loading skeleton grid */}
          {isLoading && (
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <TutorCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && (!data?.data || data.data.length === 0) && (
            <EmptyState onReset={handleReset} />
          )}

          {/* Tutor grid */}
          {!isLoading && data?.data && data.data.length > 0 && (
            <>
              <div className="grid grid-cols-3 gap-4">
                {data.data.map((tutor: Tutor) => (
                  <TutorCard
                    key={tutor.id}
                    tutor={tutor}
                    role={role}
                    currentUserId={currentUserId}
                  />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                page={page}
                totalPages={totalPages}
                onPrev={() => setPage((p) => Math.max(p - 1, 1))}
                onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
