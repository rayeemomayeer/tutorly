
import TutorBookingList from "@/features/tutorBookings/TutorBookingList";

export default function TutorDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Tutor Dashboard</h1>
      <TutorBookingList />
    </div>
  );
}