"use client";

import { useGetCategoriesQuery } from "./adminCategoryApi";
import CategoryActions from "./CategoryActions";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCategoryList() {
  const { data, isLoading } = useGetCategoriesQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-[#e5e3de] rounded-xl flex flex-col items-center justify-center py-16 text-center">
        <div className="w-10 h-10 rounded-full bg-[#f0ede8] flex items-center justify-center mb-3 text-lg">
          🏷️
        </div>
        <p className="text-sm font-medium text-[#1a1a18] mb-1">
          No categories
        </p>
        <p className="text-xs text-[#9e9c97] font-light">
          Add your first category above.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {data.map((cat) => (
        <div
          key={cat.id}
          className="group bg-white border border-[#e5e3de] border-l-4 border-l-indigo-400
                     rounded-xl px-4 sm:px-5 py-4
                     flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5
                     hover:shadow-sm hover:border-indigo-300 transition-all duration-150"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#1a1a18] truncate">
              {cat.name}
            </p>
            <p className="text-xs text-[#9e9c97] font-light">
              Category
            </p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <CategoryActions id={cat.id} currentName={cat.name} />
          </div>
        </div>
      ))}
    </div>
  );
}