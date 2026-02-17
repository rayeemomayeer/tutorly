
import AdminBookingList from "@/features/adminBookings/AdminBookingList";

export default function AdminBookingsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage All Bookings</h1>
      <AdminBookingList />
    </div>
  );
}