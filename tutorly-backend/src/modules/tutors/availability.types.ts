export interface AvailabilitySlotDTO {
  id: string;
  tutorId: string;
  dayOfWeek: number;
  startTime: Date;
  endTime: Date;
}