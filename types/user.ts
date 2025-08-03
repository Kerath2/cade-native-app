export interface User {
  id: number;
  name: string;
  email: string;
  company?: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  lastLogin?: Date;
  speaker?: Speaker | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Speaker {
  id: number;
  name: string;
  position?: string;
  company?: string;
  bio?: string;
  image?: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  role: 'SPEAKER' | 'MODERATOR' | 'PANELIST';
  createdAt: Date;
  updatedAt: Date;
}