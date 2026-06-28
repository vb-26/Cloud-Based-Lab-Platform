import React, { useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  getDoc
} from 'firebase/firestore';
import { auth, db, validateFirestoreConnection } from '../lib/firebase';
import { User, Lab, LabSession, UserRole } from '../types';
import { StorageContext } from '../contexts/StorageContext';

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [sessions, setSessions] = useState<LabSession[]>([]);

  // 1. Auth Sync & Global Connection Test
  useEffect(() => {
    validateFirestoreConnection();
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user metadata from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setCurrentUser(userDoc.data() as User);
        } else {
          // Fallback handle if metadata is missing (should not happen with regular flow)
          console.warn("User authenticated but no profile found in Firestore");
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
        setUsers([]);
        setLabs([]);
        setSessions([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-time Data Listeners
  useEffect(() => {
    if (!currentUser) {
      return;
    }

    // Role-based visibility logic
    const labsUnsubscribe = onSnapshot(collection(db, 'labs'), (snapshot) => {
      setLabs(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Lab)));
    });

    // Sessions: Students only see their own, Staff/Admin see all (governed primarily by rules)
    const sessionsQuery = currentUser.role === 'STUDENT'
      ? query(collection(db, 'sessions'), where('userId', '==', currentUser.id))
      : collection(db, 'sessions');

    const sessionsUnsubscribe = onSnapshot(sessionsQuery, (snapshot) => {
      setSessions(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as LabSession)));
    });

    // Users: Admin/Staff can see all users
    let usersUnsubscribe = () => {};
    if (currentUser.role !== 'STUDENT') {
      usersUnsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
        setUsers(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as User)));
      });
    }

    return () => {
      labsUnsubscribe();
      sessionsUnsubscribe();
      usersUnsubscribe();
    };
  }, [currentUser]);

  const login = async (email: string, password?: string) => {
    if (!password) throw new Error('Password is required');
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const register = async (name: string, email: string, role: UserRole, password?: string) => {
    if (!password) throw new Error('Password is required');
    
    // 1. Create Auth User
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    
    // 2. Create Firestore Profile
    const newUser: User = {
      id: firebaseUser.uid,
      name,
      email,
      role,
      createdAt: new Date().toISOString()
    };
    
    await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
    setCurrentUser(newUser); // Optimistic UI update
  };

  const updateUser = async (user: User) => {
    await setDoc(doc(db, 'users', user.id), user, { merge: true });
  };

  const deleteUser = async (userId: string) => {
    await deleteDoc(doc(db, 'users', userId));
  };

  const addLab = async (lab: Lab) => {
    await setDoc(doc(db, 'labs', lab.id), { ...lab, createdAt: Date.now() });
  };

  const updateLab = async (lab: Lab) => {
    await setDoc(doc(db, 'labs', lab.id), lab, { merge: true });
  };

  const deleteLab = async (labId: string) => {
    await deleteDoc(doc(db, 'labs', labId));
  };

  const startSession = async (session: LabSession) => {
    await setDoc(doc(db, 'sessions', session.id), { ...session, startTime: Date.now() });
  };

  const updateSession = async (session: LabSession) => {
    await setDoc(doc(db, 'sessions', session.id), session, { merge: true });
  };

  const resetSystemData = async () => {
    // In Firebase context, this would usually mean deleting collections (admin only)
    alert("System reset is only available via Firebase Console for safety.");
  };

  return (
    <StorageContext.Provider value={{ 
      currentUser, loading, users, labs, sessions, 
      login, logout, register, updateUser, deleteUser,
      addLab, updateLab, deleteLab,
      startSession, updateSession, resetSystemData
    }}>
      {children}
    </StorageContext.Provider>
  );
};
