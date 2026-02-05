export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'TUTOR' | 'ADMIN';
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

