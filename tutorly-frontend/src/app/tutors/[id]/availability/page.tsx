import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import AvailabilityForm from "@/features/availability/AvailabilityForm";

export default function TutorAvailabilityPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6">
      <AvailabilityForm />
    </div>
  );
}
