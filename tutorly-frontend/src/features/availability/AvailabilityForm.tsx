"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useGetAvailabilityQuery, useSetAvailabilityMutation } from "@/features/availability/availabilityApi";
import { Button } from "@/components/ui/button";

export default function AvailabilityForm() {
  const { id } = useParams();
  const { data: availability, isLoading } = useGetAvailabilityQuery(id as string);
  const [setAvailability] = useSetAvailabilityMutation();

  const [slots, setSlots] = useState<{ dayOfWeek: number; startTime: string; endTime: string }[]>([]);

  const handleAddSlot = () => {
    setSlots([...slots, { dayOfWeek: 1, startTime: "09:00", endTime: "12:00" }]);
  };

const handleSave = async () => {
  const formattedSlots = slots.map((slot) => {
    const today = new Date();
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + ((slot.dayOfWeek - today.getDay() + 7) % 7));

    const start = new Date(`${nextDate.toDateString()} ${slot.startTime}`);
    const end = new Date(`${nextDate.toDateString()} ${slot.endTime}`);

    return {
      dayOfWeek: slot.dayOfWeek,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    };
  });

  await setAvailability({ tutorId: id as string, slots: formattedSlots }).unwrap();
  alert("Availability updated!");
};


  if (isLoading) return <p>Loading availability...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Set Availability</h2>
      {slots.map((slot, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="number"
            value={slot.dayOfWeek}
            onChange={(e) => {
              const updated = [...slots];
              updated[i].dayOfWeek = Number(e.target.value);
              setSlots(updated);
            }}
          />
          <input
            type="time"
            value={slot.startTime}
            onChange={(e) => {
              const updated = [...slots];
              updated[i].startTime = e.target.value;
              setSlots(updated);
            }}
          />
          <input
            type="time"
            value={slot.endTime}
            onChange={(e) => {
              const updated = [...slots];
              updated[i].endTime = e.target.value;
              setSlots(updated);
            }}
          />
        </div>
      ))}
      <Button onClick={handleAddSlot}>Add Slot</Button>
      <Button onClick={handleSave}>Save Availability</Button>
    </div>
  );
}
