import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import AvailabilityForm from "@/features/availability/AvailabilityForm";

export default function TutorAvailabilityPage() {
  return (
    <div className="p-6">
      <AvailabilityForm />
    </div>
  );
}
