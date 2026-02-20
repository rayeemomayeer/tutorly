
"use client";
import { useGetStatsQuery } from "./adminDashboardApi";

export default function AdminStats() {
  const { data, isLoading } = useGetStatsQuery();

  if (isLoading) return <p>Loading stats...</p>;
  if (!data) return <p>No stats available.</p>;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="border p-4">
        <h2 className="font-bold">Users</h2>
        <p>{data.totalUsers}</p>
      </div>
      <div className="border p-4">
        <h2 className="font-bold">Tutors</h2>
        <p>{data.totalTutors}</p>
      </div>
      <div className="border p-4">
        <h2 className="font-bold">Bookings</h2>
        <p>{data.totalBookings}</p>
      </div>
      <div className="border p-4">
        <h2 className="font-bold">Categories</h2>
        <p>{data.totalCategories}</p>
      </div>
    </div>
  );
}