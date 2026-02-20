// src/features/adminCategories/AdminCategoryList.tsx
"use client";
import { useGetCategoriesQuery } from "./adminCategoryApi";
import CategoryActions from "./CategoryActions";

export default function AdminCategoryList() {
  const { data, isLoading } = useGetCategoriesQuery();

  if (isLoading) return <p>Loading categories...</p>;
  if (!data || data.length === 0) return <p>No categories found.</p>;

  return (
    <div className="space-y-4">
      {data.map((cat) => (
        <div key={cat.id} className="border p-4 flex justify-between">
          <p>{cat.name}</p>
          <CategoryActions id={cat.id} currentName={cat.name} />
        </div>
      ))}
    </div>
  );
}