import AdminCategoryList from "@/features/adminCategories/AdminCategoryList";
import CategoryForm from "@/features/adminCategories/CategoryForm";

export default function AdminCategoriesPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Categories</h1>
      <CategoryForm />
      <AdminCategoryList />
    </div>
  );
}