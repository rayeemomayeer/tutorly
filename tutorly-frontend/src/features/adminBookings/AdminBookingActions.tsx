"use client";

import {
  useCancelBookingMutation,
  useCompleteBookingMutation,
} from "./adminBookingApi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminBookingActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [cancelBooking, { isLoading: canceling }] = useCancelBookingMutation();
  const [completeBooking, { isLoading: completing }] =
    useCompleteBookingMutation();

  const handleCancel = async () => {
    const t = toast.loading("Cancelling booking...");
    try {
      await cancelBooking(id).unwrap();
      toast.success("Booking cancelled", { id: t });
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to cancel", { id: t });
    }
  };

  const handleComplete = async () => {
    const t = toast.loading("Completing booking...");
    try {
      await completeBooking(id).unwrap();
      toast.success("Marked as completed", { id: t });
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to complete", { id: t });
    }
  };

  if (status !== "CONFIRMED") return null;

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <Button
        variant="destructive"
        onClick={handleCancel}
        disabled={canceling}
        className="w-full sm:w-auto"
      >
        {canceling ? "Cancelling..." : "Cancel"}
      </Button>

      <Button
        onClick={handleComplete}
        disabled={completing}
        className="w-full sm:w-auto"
      >
        {completing ? "Completing..." : "Complete"}
      </Button>
    </div>
  );
}