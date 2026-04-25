"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  useGetTutorByIdQuery,
  useUpdateTutorProfileMutation,
} from "@/features/tutors/tutorApi";
import { Button } from "@/components/ui/button";
import { useGetCategoriesQuery } from "@/features/adminCategories/adminCategoryApi";

export default function EditTutorPage() {
  const { id } = useParams();
  const { data: tutor, isLoading } = useGetTutorByIdQuery(id as string);
  const [updateTutorProfile, { isLoading: isUpdating }] =
    useUpdateTutorProfileMutation();

  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState(0);
  const [categoriesSelected, setCategoriesSelected] = useState<{ id: string }[]>([]);
  const { data: categories } = useGetCategoriesQuery();


  useEffect(() => {
    if (tutor) {
      setBio(tutor.bio || "");
      setHourlyRate(tutor.hourlyRate || 0);
      setCategoriesSelected(tutor.subjects || []); 
    }
  }, [tutor]);

  const handleSave = async () => {
    try {
      await updateTutorProfile({
        id: id as string,
        bio,
        hourlyRate,
        categories: categoriesSelected,
      }).unwrap();

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update tutor:", err);
      alert("Error updating profile.");
    }
  };

  if (isLoading) return <p>Loading tutor...</p>;
  if (!tutor) return <p>Tutor not found.</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Edit Profile</h1>

      <label className="block">
        Bio:
        <input
          type="text"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="border p-2 w-full"
        />
      </label>

      <label className="block">
        Hourly Rate:
        <input
          type="number"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(Number(e.target.value))}
          className="border p-2 w-full"
        />
      </label>

      <div>
        <div className="flex flex-wrap gap-2 mb-2">
          {categoriesSelected.map((s) => {
            const cat = categories?.find((c) => c.id === s.id);
            return (
              <span
                key={s.id}
                className="px-2 py-1 bg-blue-500 text-white rounded flex items-center gap-1"
              >
                {cat?.name}
                <button
                  onClick={() =>
                    setCategoriesSelected(categoriesSelected.filter((x) => x.id !== s.id))
                  }
                >
                  ✕
                </button>
              </span>
            );
          })}
        </div>

        <select
          onChange={(e) => {
            const id = e.target.value;
            if (id && !categoriesSelected.some((c) => c.id === id)) {
              setCategoriesSelected([...categoriesSelected, { id }]);
            }
          }}
        >
          <option value="">Select category</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <Button onClick={handleSave} disabled={isUpdating}>
        {isUpdating ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}