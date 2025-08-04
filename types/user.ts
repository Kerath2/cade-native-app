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
  lastName: string;
  position: string;
  bio: string;
  country: string;
  picture: string;
  isCommittee: boolean;
  isHost: boolean;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  createdAt: Date;
  updatedAt: Date;
}