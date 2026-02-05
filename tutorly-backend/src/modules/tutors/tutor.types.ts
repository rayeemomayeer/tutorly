import { CategoryDTO } from "../categories/category.types";
import { AvailabilitySlotDTO } from "./availability.types";


export interface TutorProfileDTO {
  id: string;
  userId: string;
  bio?: string;
  hourlyRate: number;
  rating: number;
  subjects: CategoryDTO[];
  availability: AvailabilitySlotDTO[];
}
