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

import { Skeleton } from "@/components/ui/skeleton";

type Slot = {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  status?: string;
};

const DAYS = [
  { short: "Sun", label: "Sunday" },
  { short: "Mon", label: "Monday" },
  { short: "Tue", label: "Tuesday" },
  { short: "Wed", label: "Wednesday" },
  { short: "Thu", label: "Thursday" },
  { short: "Fri", label: "Friday" },
  { short: "Sat", label: "Saturday" },
];

function convertTimeToISO(time: string): string {
  const today = new Date();
  const [hours, minutes] = time.split(":");
  today.setHours(Number(hours));
  today.setMinutes(Number(minutes));
  today.setSeconds(0);
  today.setMilliseconds(0);
  return today.toISOString();
}

function formatTimeForInput(dateString: string): string {
  return new Date(dateString).toISOString().slice(11, 16);
}

function formatDisplayTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CalendarSkeleton() {
  return (
    <div className="flex gap-3 overflow-x-auto">
      {DAYS.map((d) => (
        <div key={d.short} className="flex-1 flex flex-col gap-2 min-w-[90px]">
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
          {d.short === "Mon" && <Skeleton className="h-20 w-full rounded-lg" />}
        </div>
      ))}
    </div>
  );
}

function SlotCard({
  slot,
  isEditing,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
  onLocalChange,
}: {
  slot: Slot;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (updated: Slot) => void;
  onDelete: () => void;
  onLocalChange: (updated: Slot) => void;
}) {
  const isBooked = slot.status === "BOOKED";

  if (isEditing) {
    return (
      <div className="bg-white border border-indigo-300 rounded-lg p-2.5 flex flex-col gap-2 shadow-sm">
        <select
          value={slot.dayOfWeek}
          onChange={(e) =>
            onLocalChange({ ...slot, dayOfWeek: Number(e.target.value) })
          }
          className="w-full text-[11px] text-[#1a1a18] bg-[#fafaf8] border border-[#e5e3de] rounded px-2 py-1.5 focus:outline-none focus:border-indigo-400"
        >
          {DAYS.map((d, i) => (
            <option key={i} value={i}>
              {d.label}
            </option>
          ))}
        </select>

        <div className="flex flex-col gap-0.5">
          <label className="text-[10px] text-[#9e9c97] font-medium uppercase tracking-wide">
            Start
          </label>
          <input
            type="time"
            value={formatTimeForInput(slot.startTime)}
            onChange={(e) =>
              onLocalChange({ ...slot, startTime: e.target.value })
            }
            className="w-full text-xs text-[#1a1a18] bg-[#fafaf8] border border-[#e5e3de] rounded px-2 py-1.5 focus:outline-none focus:border-indigo-400"
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <label className="text-[10px] text-[#9e9c97] font-medium uppercase tracking-wide">
            End
          </label>
          <input
            type="time"
            value={formatTimeForInput(slot.endTime)}
            onChange={(e) =>
              onLocalChange({ ...slot, endTime: e.target.value })
            }
            className="w-full text-xs text-[#1a1a18] bg-[#fafaf8] border border-[#e5e3de] rounded px-2 py-1.5 focus:outline-none focus:border-indigo-400"
          />
        </div>

        <div className="flex gap-1.5 mt-0.5">
          <button
            onClick={() => onSave(slot)}
            className="flex-1 flex items-center justify-center gap-1 text-[11px] font-medium bg-indigo-500 text-white rounded py-1.5 hover:bg-indigo-600 transition-colors"
          >
            <Save className="w-3 h-3" /> Save
          </button>
          <button
            onClick={onCancelEdit}
            className="flex items-center justify-center w-7 h-7 rounded border border-[#e5e3de] text-[#9e9c97] hover:text-[#1a1a18] hover:border-[#c4c2bd] transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  if (isBooked) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-medium tracking-wider uppercase text-rose-400">
            Booked
          </span>
        </div>
        <p className="text-[11px] text-rose-400 font-light">
          {formatDisplayTime(slot.startTime)}
        </p>
        <p className="text-[11px] text-rose-400 font-light">
          {formatDisplayTime(slot.endTime)}
        </p>
      </div>
    );
  }

  return (
    <div className="group bg-white border border-[#e5e3de] rounded-lg p-2.5 hover:border-indigo-300 hover:shadow-sm transition-all duration-150">
      <p className="text-[12px] font-medium text-[#1a1a18] leading-tight">
        {formatDisplayTime(slot.startTime)}
      </p>
      <p className="text-[11px] text-[#9e9c97] font-light mb-2">
        {formatDisplayTime(slot.endTime)}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium tracking-wider uppercase text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-[3px]">
          Open
        </span>

        <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="w-6 h-6 flex items-center justify-center rounded text-[#9e9c97] hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            className="w-6 h-6 flex items-center justify-center rounded text-[#9e9c97] hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AddSlotPanel({
  newSlot,
  setNewSlot,
  onAdd,
}: {
  newSlot: { dayOfWeek: number; startTime: string; endTime: string };
  setNewSlot: (s: typeof newSlot) => void;
  onAdd: () => void;
}) {
  return (
    <div className="bg-white border border-[#e5e3de] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-5 h-px bg-indigo-500" />
        <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-indigo-500">
          Add availability slot
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-end gap-3 sm:gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#6b6b66]">Day</label>
          <div className="flex gap-1.5 flex-wrap max-w-[220px]">
            {DAYS.map((d, i) => (
              <button
                key={i}
                onClick={() => setNewSlot({ ...newSlot, dayOfWeek: i })}
                className={`w-9 h-9 rounded-lg text-xs font-medium transition-all duration-100 ${
                  newSlot.dayOfWeek === i
                    ? "bg-[#1a1a18] text-[#fafaf8]"
                    : "bg-[#f0ede8] text-[#6b6b66] hover:bg-[#e8e5df]"
                }`}
              >
                {d.short}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#6b6b66]">
            Start time
          </label>
          <input
            type="time"
            value={newSlot.startTime}
            onChange={(e) =>
              setNewSlot({ ...newSlot, startTime: e.target.value })
            }
            className="text-sm text-[#1a1a18] bg-[#fafaf8] border border-[#e5e3de] rounded-md px-3 py-2 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#6b6b66]">
            End time
          </label>
          <input
            type="time"
            value={newSlot.endTime}
            onChange={(e) =>
              setNewSlot({ ...newSlot, endTime: e.target.value })
            }
            className="text-sm text-[#1a1a18] bg-[#fafaf8] border border-[#e5e3de] rounded-md px-3 py-2 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-colors"
          />
        </div>

        <button
          onClick={onAdd}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1a1a18] text-[#fafaf8] text-sm px-5 py-2 rounded-md hover:bg-[#2c2c2a] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add slot
        </button>
      </div>
    </div>
  );
}

function WeekGrid({
  slots,
  editingSlotId,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
  onLocalChange,
}: {
  slots: Slot[];
  editingSlotId: string | null;
  onEdit: (id: string) => void;
  onCancelEdit: () => void;
  onSave: (slotId: string, updated: Slot) => void;
  onDelete: (slotId: string) => void;
  onLocalChange: (updated: Slot) => void;
}) {
  const totalSlots = slots.length;

  return (
    <div className="bg-white border border-[#e5e3de] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e5e3de]">
        <span className="font-display text-base font-normal text-[#1a1a18] tracking-tight">
          Weekly schedule
        </span>
        <span className="text-xs text-[#9e9c97] font-light">
          {totalSlots} slot{totalSlots !== 1 ? "s" : ""} total
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 min-w-[700px] divide-x divide-[#f0ede8]">
          {DAYS.map((day, dayIndex) => {
            const daySlots = slots.filter((s) => s.dayOfWeek === dayIndex);

            return (
              <div
                key={dayIndex}
                className="flex flex-col min-h-[260px] sm:min-h-[300px] lg:min-h-[320px]"
              >
                <div
                  className={`px-2.5 py-2.5 border-b border-[#f0ede8] text-center ${
                    daySlots.length > 0 ? "bg-[#fafaf8]" : "bg-white"
                  }`}
                >
                  <p className="text-[11px] font-medium text-[#1a1a18] tracking-wide">
                    {day.short}
                  </p>
                  {daySlots.length > 0 && (
                    <p className="text-[10px] text-indigo-500 mt-0.5">
                      {daySlots.length}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 p-2 flex-1">
                  {daySlots.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-[10px] text-[#e5e3de] select-none">
                        —
                      </span>
                    </div>
                  ) : (
                    daySlots.map((slot, idx) => (
                      <SlotCard
                        key={slot.id ?? `${dayIndex}-${idx}`}
                        slot={slot}
                        isEditing={editingSlotId === slot.id}
                        onEdit={() => onEdit(slot.id!)}
                        onCancelEdit={onCancelEdit}
                        onSave={(updated) => onSave(slot.id!, updated)}
                        onDelete={() => onDelete(slot.id!)}
                        onLocalChange={onLocalChange}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function AvailabilityForm() {
  const { id } = useParams();

  const {
    data: availability,
    isLoading,
    isFetching,
    error: fetchError,
  } = useGetAvailabilityQuery(id as string, {
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

  useEffect(() => {
    if (availability) setLocalAvailability(availability);
  }, [availability]);

  useEffect(() => {
    if (fetchError) toast.error("Failed to load availability.");
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
        toast.info("A slot was booked");
      }

      if (data.type === "OPEN") {
        setLocalAvailability((prev) =>
          prev.map((s) =>
            s.id === data.slotId ? { ...s, status: "OPEN" } : s
          )
        );
        toast.info("A slot is now open");
      }

      if (data.type === "DELETED") {
        setLocalAvailability((prev) =>
          prev.filter((s) => s.id !== data.slotId)
        );
        toast.info("A slot was removed");
      }

      if (data.type === "UPDATED") {
        setLocalAvailability((prev) =>
          prev.map((s) =>
            s.id === data.slotId ? { ...s, ...data.slot } : s
          )
        );
        toast.info("A slot was updated");
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
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

      setNewSlot({ dayOfWeek: 0, startTime: "", endTime: "" });
      toast.success("Slot added successfully", { id: loadingToast });
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

      toast.success("Slot updated successfully", { id: loadingToast });
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
      toast.success("Slot deleted successfully", { id: loadingToast });
    } catch (err: any) {
      setLocalAvailability(previous);
      toast.error(err?.data?.message || "Failed to delete slot.", {
        id: loadingToast,
      });
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen bg-[#fafaf8] px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 flex flex-col gap-5 sm:gap-6">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-40 rounded" />
          <Skeleton className="h-9 w-64 rounded" />
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
        <CalendarSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 flex flex-col gap-5 sm:gap-6">
      <div>
        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-5 h-px bg-indigo-500 block" />
          <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-indigo-500">
            Tutor dashboard
          </span>
        </div>
        <h1 className="font-display text-[26px] sm:text-[30px] lg:text-[34px] font-normal tracking-[-0.6px] lg:tracking-[-0.8px] text-[#1a1a18] leading-tight">
          Manage{" "}
          <em className="font-display italic font-light text-indigo-500">
            availability
          </em>
        </h1>
        <p className="text-sm text-[#9e9c97] font-light mt-1.5">
          Set your weekly recurring slots. Students can book any open slot
          instantly.
        </p>
      </div>

      <AddSlotPanel
        newSlot={newSlot}
        setNewSlot={setNewSlot}
        onAdd={handleAddSlot}
      />

      {localAvailability.length === 0 ? (
        <div className="bg-white border border-[#e5e3de] rounded-xl flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 rounded-full bg-[#f0ede8] flex items-center justify-center mb-4 text-xl">
            📅
          </div>
          <p className="text-sm font-medium text-[#1a1a18] mb-1">
            No slots yet
          </p>
          <p className="text-xs text-[#9e9c97] font-light">
            Use the form above to add your first availability slot.
          </p>
        </div>
      ) : (
        <WeekGrid
          slots={localAvailability}
          editingSlotId={editingSlotId}
          onEdit={(id) => setEditingSlotId(id)}
          onCancelEdit={() => setEditingSlotId(null)}
          onSave={(slotId, updated) => {
            handleUpdate(slotId, updated);
            setEditingSlotId(null);
          }}
          onDelete={handleDelete}
          onLocalChange={(updated) =>
            setLocalAvailability((prev) =>
              prev.map((s) => (s.id === updated.id ? updated : s))
            )
          }
        />
      )}
    </div>
  );
}