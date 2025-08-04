export interface Section {
  id: number;
  title: string;
  description?: string;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
  sessions: Session[];
}

export interface Session {
  id: number;
  title: string;
  description?: string;
  startsAt: string;
  endsAt: string;
  location?: string;
  type: 'PRESENTATION' | 'PANEL' | 'WORKSHOP' | 'NETWORKING';
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  sectionId: number;
  createdAt: string;
  updatedAt: string;
  speakers?: SessionSpeaker[];
  likes?: Like[];
  comments?: Comment[];
  questions?: Question[];
  summary?: Summary;
}

export interface SessionSpeaker {
  id: number;
  sessionId: number;
  speakerId: number;
  speaker: Speaker;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface Like {
  id: number;
  userId: number;
  sessionId: number;
  createdAt: string;
  user: {
    id: number;
    name: string;
  };
}

export interface Comment {
  id: number;
  content: string;
  userId: number;
  sessionId: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
  };
}

export interface Question {
  id: number;
  content: string;
  userId: number;
  sessionId: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
  };
}

export interface Summary {
  id: number;
  content?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  sessionId: number;
  createdAt: string;
  updatedAt: string;
}