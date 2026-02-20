import AdminStats from "@/features/adminDashboard/AdminStats";
import Link from "next/link";

export default function AdminDashboardPage() {
  
  return (
    <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <AdminStats />

        <Link href="/admin/users" className="block p-4 bg-blue-500 text-white rounded hover:bg-blue-600">
            Manage Users
        </Link>
        
        <Link href="/admin/categories" className="block p-4 bg-green-500 text-white rounded hover:bg-green-600">
            Manage Categories
        </Link>
        <Link href="/admin/bookings" className="block p-4 bg-purple-500 text-white rounded hover:bg-purple-600">
            Manage Bookings
        </Link>
    </div>
  );
}