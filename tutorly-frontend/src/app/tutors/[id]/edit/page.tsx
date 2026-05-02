"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useGetTutorByIdQuery, useUpdateTutorProfileMutation } from "@/features/tutors/tutorApi";
import { useGetCategoriesQuery } from "@/features/adminCategories/adminCategoryApi";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";

export default function EditTutorPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: tutor, isLoading } = useGetTutorByIdQuery(id as string);
  const [updateTutorProfile, { isLoading: isUpdating }] = useUpdateTutorProfileMutation();
  const { data: categories } = useGetCategoriesQuery();

  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState(0);
  const [categoriesSelected, setCategoriesSelected] = useState<{ id: string }[]>([]);

  useEffect(() => {
    if (tutor) {
      setBio(tutor.bio || "");
      setHourlyRate(tutor.hourlyRate || 0);
      setCategoriesSelected(tutor.subjects || []);
    }
  }, [tutor]);

  const handleSave = async () => {
    const loadingToast = toast.loading("Saving profile...");
    try {
      await updateTutorProfile({
        id: id as string,
        bio,
        hourlyRate,
        categories: categoriesSelected,
      }).unwrap();
      toast.success("Profile updated.", { id: loadingToast });
    } catch (err) {
      console.error("Failed to update tutor:", err);
      toast.error("Failed to update profile.", { id: loadingToast });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafaf8] px-10 py-10 max-w-2xl flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-32 rounded" />
          <Skeleton className="h-9 w-56 rounded" />
        </div>
        <Skeleton className="h-[120px] w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl text-[#1a1a18] mb-2">Tutor not found</p>
          <button
            onClick={() => router.back()}
            className="text-sm text-indigo-500 hover:text-indigo-700 transition-colors"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  const availableCategories = categories?.filter(
    (c) => !categoriesSelected.some((s) => s.id === c.id)
  );

  return (
    <div className="min-h-screen bg-[#fafaf8] px-10 py-10">
      <div className="max-w-2xl flex flex-col gap-8">

        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-5 h-px bg-indigo-500 block" />
            <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-indigo-500">
              Tutor dashboard
            </span>
          </div>
          <h1 className="font-display text-[34px] font-normal tracking-[-0.8px] text-[#1a1a18] leading-tight">
            Edit{" "}
            <em className="font-display italic font-light text-indigo-500">profile</em>
          </h1>
          <p className="text-sm text-[#9e9c97] font-light mt-1.5">
            Changes are saved instantly and visible to students.
          </p>
        </div>

        <div className="bg-white border border-[#e5e3de] rounded-xl divide-y divide-[#f0ede8]">

          <div className="px-6 py-5 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#6b6b66]">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Tell students about your background, teaching style, and experience..."
              className="w-full text-sm text-[#1a1a18] bg-[#fafaf8] border border-[#e5e3de]
                         rounded-lg px-3.5 py-3 placeholder:text-[#c4c2bd] placeholder:font-light
                         focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100
                         resize-none transition-colors leading-relaxed"
            />
            <p className="text-[11px] text-[#c4c2bd] font-light text-right">
              {bio.length} characters
            </p>
          </div>

          <div className="px-6 py-5 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#6b6b66]">Hourly rate</label>
            <div className="relative max-w-[180px]">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#9e9c97] font-light">
                $
              </span>
              <input
                type="number"
                value={hourlyRate}
                min={0}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full text-sm text-[#1a1a18] bg-[#fafaf8] border border-[#e5e3de]
                           rounded-lg pl-7 pr-3.5 py-2.5
                           focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100
                           transition-colors"
              />
            </div>
            <p className="text-[11px] text-[#c4c2bd] font-light">
              Charged per 1-hour session
            </p>
          </div>

          <div className="px-6 py-5 flex flex-col gap-3">
            <div>
              <label className="text-xs font-medium text-[#6b6b66]">Subjects</label>
              <p className="text-[11px] text-[#c4c2bd] font-light mt-0.5">
                Students filter by subject when searching for tutors
              </p>
            </div>

            {categoriesSelected.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {categoriesSelected.map((s) => {
                  const cat = categories?.find((c) => c.id === s.id);
                  return (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-600
                                 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full"
                    >
                      {cat?.name}
                      <button
                        onClick={() =>
                          setCategoriesSelected(categoriesSelected.filter((x) => x.id !== s.id))
                        }
                        className="text-indigo-400 hover:text-indigo-700 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            <select
              defaultValue=""
              onChange={(e) => {
                const val = e.target.value;
                if (val && !categoriesSelected.some((c) => c.id === val)) {
                  setCategoriesSelected([...categoriesSelected, { id: val }]);
                }
                e.target.value = "";
              }}
              className="w-full text-sm text-[#1a1a18] bg-[#fafaf8] border border-[#e5e3de]
                         rounded-lg px-3.5 py-2.5
                         focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100
                         transition-colors"
            >
              <option value="" disabled>
                {availableCategories?.length === 0
                  ? "All subjects added"
                  : "Add a subject..."}
              </option>
              {availableCategories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className={`flex items-center gap-2 text-sm font-medium px-6 py-2.5 rounded-md
                        transition-all duration-150
                        ${isUpdating
                          ? "bg-indigo-100 text-indigo-400 cursor-not-allowed"
                          : "bg-[#1a1a18] text-[#fafaf8] hover:bg-[#2c2c2a] active:scale-95"
                        }`}
          >
            {isUpdating ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-indigo-300 border-t-indigo-500 animate-spin" />
                Saving
              </>
            ) : (
              "Save changes"
            )}
          </button>
          <button
            onClick={() => router.back()}
            className="text-sm text-[#9e9c97] hover:text-[#1a1a18] transition-colors"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}