
"use client";
import { useCancelBookingMutation } from "@/features/bookings/bookingApi";
import { Button } from "@/components/ui/button";

export default function CancelBookingButton({ id }: { id: string }) {
  const [cancelBooking, { isLoading }] = useCancelBookingMutation();

  return (
    <Button
      variant="destructive"
      onClick={() => cancelBooking(id)}
      disabled={isLoading}
    >
      {isLoading ? "Cancelling..." : "Cancel"}
    </Button>
  );
}
