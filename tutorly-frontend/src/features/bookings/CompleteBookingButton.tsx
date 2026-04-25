
"use client";
import { useCompleteBookingMutation } from "@/features/bookings/bookingApi";
import { Button } from "@/components/ui/button";

export default function CompleteBookingButton({ id }: { id: string }) {
  const [completeBooking, { isLoading }] = useCompleteBookingMutation();

  return (
    <Button
      variant="default"
      onClick={() => completeBooking(id)}
      disabled={isLoading}
    >
      {isLoading ? "Completing..." : "Mark Complete"}
    </Button>
  );
}