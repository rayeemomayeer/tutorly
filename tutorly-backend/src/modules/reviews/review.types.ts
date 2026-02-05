export interface ReviewDTO {
  id: string;
  studentId: string;
  tutorId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}
