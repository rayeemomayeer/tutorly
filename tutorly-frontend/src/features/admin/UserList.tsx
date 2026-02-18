
"use client";
import { useGetUsersQuery } from "./adminApi";
import UserActions from "./UserActions";

export default function UserList() {
  const { data, isLoading } = useGetUsersQuery();

  if (isLoading) return <p>Loading users...</p>;
  if (!data || data.length === 0) return <p>No users found.</p>;

  return (
    <div className="space-y-4">
      {data.map((user: any) => (
        <div key={user.id} className="border p-4 flex justify-between">
          <div>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>Status: {user.isBanned ? "Banned" : "Active"}</p>
          </div>
          <UserActions id={user.id} currentRole={user.role} isBanned={user.isBanned} />
        </div>
      ))}
    </div>
  );
}