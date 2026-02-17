
import BookingList from "@/features/bookings/BookingList";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Student Dashboard</h1>
      <BookingList />
    </div>
  );
}