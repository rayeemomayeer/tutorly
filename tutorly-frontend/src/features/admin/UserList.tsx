"use client";
import UserActions from "./UserActions";

export default function UserList({ users }: { users: any[] }) {
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="border p-4 flex justify-between">
          <div>
            <p>Name: {user.name ?? "N/A"}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>Status: {user.banned ? "Banned" : "Active"}</p>
          </div>
          <UserActions id={user.id} currentRole={user.role} isBanned={user.banned} />
        </div>
      ))}
    </div>
  );
}