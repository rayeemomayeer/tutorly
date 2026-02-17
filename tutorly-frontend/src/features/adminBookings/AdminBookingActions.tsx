
"use client";
import {
  useCancelBookingMutation,
  useCompleteBookingMutation,
} from "./adminBookingApi";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="flex gap-2">
      {status === "pending" && (
        <>
          <Button
            variant="destructive"
            onClick={() => cancelBooking(id)}
            disabled={canceling}
          >
            {canceling ? "Cancelling..." : "Cancel"}
          </Button>
          <Button
            variant="default"
            onClick={() => completeBooking(id)}
            disabled={completing}
          >
            {completing ? "Completing..." : "Mark Complete"}
          </Button>
        </>
      )}
    </div>
  );
}