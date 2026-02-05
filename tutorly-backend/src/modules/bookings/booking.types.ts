export interface BookingDTO {
  id: string;
  studentId: string;
  tutorId: string;
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  scheduledAt: Date;
  createdAt: Date;
}
