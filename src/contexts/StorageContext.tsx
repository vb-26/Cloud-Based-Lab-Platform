import { createContext, useContext } from 'react';
import { User, Lab, LabSession, UserRole } from '../types';

export interface StorageContextType {
  currentUser: User | null;
  loading: boolean;
  users: User[];
  labs: Lab[];
  sessions: LabSession[];
  login: (_email: string, _password?: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (_name: string, _email: string, _role: UserRole, _password?: string) => Promise<void>;
  updateUser: (_user: User) => Promise<void>;
  deleteUser: (_userId: string) => Promise<void>;
  addLab: (_lab: Lab) => Promise<void>;
  updateLab: (_lab: Lab) => Promise<void>;
  deleteLab: (_labId: string) => Promise<void>;
  startSession: (_session: LabSession) => Promise<void>;
  updateSession: (_session: LabSession) => Promise<void>;
  resetSystemData: () => Promise<void>;
}

export const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
};
