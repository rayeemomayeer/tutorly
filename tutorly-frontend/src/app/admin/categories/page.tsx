import AdminCategoryList from "@/features/adminCategories/AdminCategoryList";
import CategoryForm from "@/features/adminCategories/CategoryForm";

export default function AdminCategoriesPage() {
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
            categories
          </em>
        </h1>
        <p className="text-sm text-[#9e9c97] font-light mt-1.5">
          Organize subjects for tutors across the platform.
        </p>
      </div>

      <CategoryForm />
      <AdminCategoryList />

    </div>
  );
}