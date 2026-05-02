"use client";

import UserActions from "./UserActions";

function getInitials(name: string) {
  return name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function UserList({ users }: { users: any[] }) {
  return (
    <div className="flex flex-col gap-3">
      {users.map((user) => {
        const isBanned = user.banned;

        return (
          <div
            key={user.id}
            className={`group bg-white border border-[#e5e3de] border-l-4 
            ${isBanned ? "border-l-stone-300 opacity-70" : "border-l-indigo-400"}
            rounded-xl px-4 sm:px-5 py-4
            flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5
            hover:shadow-sm transition-all duration-150`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#e5e3de] shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-50 border border-[#e5e3de]
                                flex items-center justify-center text-xs font-medium text-indigo-600 shrink-0">
                  {user.name ? getInitials(user.name) : "?"}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1a1a18] truncate">
                  {user.name ?? "N/A"}
                </p>
                <p className="text-xs text-[#6b6b66] font-light truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 flex-wrap">
              <span
                className={`inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full
                ${
                  user.role === "ADMIN"
                    ? "text-violet-600 bg-violet-50"
                    : "text-indigo-600 bg-indigo-50"
                }`}
              >
                {user.role}
              </span>

              <span
                className={`inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full
                ${
                  isBanned
                    ? "text-stone-500 bg-stone-100"
                    : "text-emerald-700 bg-emerald-50"
                }`}
              >
                {isBanned ? "Banned" : "Active"}
              </span>

              <div className="flex gap-2 w-full sm:w-auto">
                <UserActions
                  id={user.id}
                  currentRole={user.role}
                  isBanned={user.banned}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}