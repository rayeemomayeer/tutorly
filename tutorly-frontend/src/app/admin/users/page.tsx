
import UserList from "@/features/admin/UserList";

export default function AdminUsersPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Users</h1>
      <UserList />
    </div>
  );
}