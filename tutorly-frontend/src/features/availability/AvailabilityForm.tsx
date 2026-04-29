"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { EventSourcePolyfill } from "event-source-polyfill";
import { Pencil, Trash2, Save, X, Plus } from "lucide-react";

import {
  useGetAvailabilityQuery,
  useSetAvailabilityMutation,
  useUpdateAvailabilityMutation,
  useDeleteAvailabilityMutation,
} from "@/features/availability/availabilityApi";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type Slot = {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  status?: string;
};

export default function AvailabilityForm() {
  const { id } = useParams();

  const { data: availability, isLoading, isFetching, error: fetchError } =
    useGetAvailabilityQuery(id as string, {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
    });

  const [setAvailability] = useSetAvailabilityMutation();
  const [updateAvailability] = useUpdateAvailabilityMutation();
  const [deleteAvailability] = useDeleteAvailabilityMutation();

  const [localAvailability, setLocalAvailability] = useState<Slot[]>([]);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);

  const [newSlot, setNewSlot] = useState({
    dayOfWeek: 0,
    startTime: "",
    endTime: "",
  });

  const convertTimeToISO = (time: string) => {
    const today = new Date();
    const [hours, minutes] = time.split(":");

    today.setHours(Number(hours));
    today.setMinutes(Number(minutes));
    today.setSeconds(0);
    today.setMilliseconds(0);

    return today.toISOString();
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const formatTimeForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().slice(11, 16);
  };

  const formatDisplayTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    if (availability) {
      setLocalAvailability(availability);
    }
  }, [availability]);

  useEffect(() => {
    if (fetchError) {
      toast.error("Failed to load availability.");
    }
  }, [fetchError]);

  useEffect(() => {
    if (!id) return;

    const eventSource = new EventSourcePolyfill(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/tutors/${id}/availability/stream`,
      { withCredentials: true }
    );

    eventSource.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.type === "BOOKED") {
        setLocalAvailability((prev) =>
          prev.map((s) =>
            s.id === data.slotId ? { ...s, status: "BOOKED" } : s
          )
        );
      }

      if (data.type === "OPEN") {
        setLocalAvailability((prev) =>
          prev.map((s) => (s.id === data.slotId ? { ...s, status: "OPEN" } : s))
        );
      }

      if (data.type === "DELETED") {
        setLocalAvailability((prev) =>
          prev.filter((s) => s.id !== data.slotId)
        );
      }

      if (data.type === "UPDATED") {
        setLocalAvailability((prev) =>
          prev.map((s) =>
            s.id === data.slotId ? { ...s, ...data.slot } : s
          )
        );
      }
    };

    eventSource.onerror = () => {
      console.error("SSE connection error");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [id]);

  const handleAddSlot = async () => {
    if (!newSlot.startTime || !newSlot.endTime) {
      toast.error("Please fill all fields.");
      return;
    }

    const loadingToast = toast.loading("Adding slot...");

    try {
      const payload = {
        ...newSlot,
        startTime: convertTimeToISO(newSlot.startTime),
        endTime: convertTimeToISO(newSlot.endTime),
      };

      const created = await setAvailability({
        tutorId: id as string,
        slots: [payload],
      }).unwrap();

      setLocalAvailability((prev) => [
        ...prev,
        ...(Array.isArray(created) ? created : [created]),
      ]);

      setNewSlot({
        dayOfWeek: 0,
        startTime: "",
        endTime: "",
      });

      toast.success("Slot added.", { id: loadingToast });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add slot.", {
        id: loadingToast,
      });
    }
  };

  const handleUpdate = async (slotId: string, updatedSlot: Slot) => {
    const loadingToast = toast.loading("Updating slot...");
    const previous = [...localAvailability];

    setLocalAvailability((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, ...updatedSlot } : s))
    );

    try {
      const payload = {
        ...updatedSlot,
        startTime: convertTimeToISO(updatedSlot.startTime),
        endTime: convertTimeToISO(updatedSlot.endTime),
      };

      await updateAvailability({
        tutorId: id as string,
        slotId,
        slot: payload,
      }).unwrap();

      toast.success("Slot updated.", { id: loadingToast });
    } catch (err: any) {
      setLocalAvailability(previous);
      toast.error(err?.data?.message || "Failed to update slot.", {
        id: loadingToast,
      });
    }
  };

  const handleDelete = async (slotId: string) => {
    const loadingToast = toast.loading("Deleting slot...");
    const previous = [...localAvailability];

    setLocalAvailability((prev) => prev.filter((s) => s.id !== slotId));

    try {
      await deleteAvailability({ tutorId: id as string, slotId }).unwrap();
      toast.success("Slot deleted.", { id: loadingToast });
    } catch (err: any) {
      setLocalAvailability(previous);
      toast.error(err?.data?.message || "Failed to delete slot.", {
        id: loadingToast,
      });
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Manage Availability</h2>

      {/* Add Slot */}
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-2 items-center">
          <Input
            type="number"
            min={0}
            max={6}
            className="w-20"
            value={newSlot.dayOfWeek}
            onChange={(e) =>
              setNewSlot({
                ...newSlot,
                dayOfWeek: Number(e.target.value),
              })
            }
          />

          <Input
            type="time"
            value={newSlot.startTime}
            onChange={(e) =>
              setNewSlot({
                ...newSlot,
                startTime: e.target.value,
              })
            }
          />

          <Input
            type="time"
            value={newSlot.endTime}
            onChange={(e) =>
              setNewSlot({
                ...newSlot,
                endTime: e.target.value,
              })
            }
          />

          <Button onClick={handleAddSlot}>
            <Plus className="h-4 w-4 mr-2" />
            Add Slot
          </Button>
        </CardContent>
      </Card>

      {localAvailability?.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No availability slots found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {localAvailability.map((slot, index) => (
            <Card
              key={slot.id ?? `${slot.dayOfWeek}-${slot.startTime}-${index}`}
              className={`transition-all ${slot.status === "BOOKED"
                ? "opacity-70 border-red-300 bg-red-50"
                : "hover:shadow-md"
                }`}
            >
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {editingSlotId === slot.id ? (
                  <div className="flex flex-wrap gap-2 items-center w-full">
                    <Input
                      type="number"
                      min={0}
                      max={6}
                      className="w-20"
                      value={slot.dayOfWeek}
                      onChange={(e) =>
                        setLocalAvailability((prev) =>
                          prev.map((s) =>
                            s.id === slot.id
                              ? { ...s, dayOfWeek: Number(e.target.value) }
                              : s
                          )
                        )
                      }
                    />

                    <Input
                      type="time"
                      value={formatTimeForInput(slot.startTime)}
                      onChange={(e) =>
                        setLocalAvailability((prev) =>
                          prev.map((s) =>
                            s.id === slot.id
                              ? { ...s, startTime: e.target.value }
                              : s
                          )
                        )
                      }
                    />

                    <Input
                      type="time"
                      value={formatTimeForInput(slot.endTime)}
                      onChange={(e) =>
                        setLocalAvailability((prev) =>
                          prev.map((s) =>
                            s.id === slot.id
                              ? { ...s, endTime: e.target.value }
                              : s
                          )
                        )
                      }
                    />

                    <Button
                      size="icon"
                      onClick={() => {
                        const updatedSlot = localAvailability.find(
                          (s) => s.id === slot.id
                        )!;
                        handleUpdate(slot.id!, updatedSlot);
                        setEditingSlotId(null);
                      }}
                    >
                      <Save className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setEditingSlotId(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <p className="font-medium">
                        {days[slot.dayOfWeek] ?? `Day ${slot.dayOfWeek}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDisplayTime(slot.startTime)} -{" "}
                        {formatDisplayTime(slot.endTime)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {slot.status === "BOOKED" ? (
                        <Badge variant="destructive">BOOKED</Badge>
                      ) : (
                        <>
                          <Button
                            size="icon"
                            variant="secondary"
                            onClick={() => setEditingSlotId(slot.id!)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleDelete(slot.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}