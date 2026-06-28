import { LucideIcon } from 'lucide-react';

export type UserRole = 'ADMIN' | 'STAFF' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface MCQQuestion {
  id: string;
  type: 'mcq';
  text: string;
  options: string[];
  correctAnswer: number;
  points: number;
  explanation?: string;
}

export interface CodingQuestion {
  id: string;
  type: 'coding';
  text: string;
  language: string;
  boilerplate: string;
  solution: string; // The reference solution or description of correct behavior
  points: number;
  explanation?: string;
}

export type Question = MCQQuestion | CodingQuestion;

export interface Lab {
  id: string;
  name: string;
  staffId: string;
  maxStudents: number;
  serverType: string;
  duration: number; // in minutes
  sketchfabUrl?: string;
  questions: Question[];
  createdAt: number;
}

export interface LabSession {
  id: string;
  labId: string;
  userId: string;
  startTime: number;
  code: string;
  answers: Record<string, number>;
  status: 'active' | 'completed';
  progress: number; // 0-100
  totalScore: number;
}

export interface NavItem {
  label: string;
  icon: LucideIcon;
  id: string;
}
