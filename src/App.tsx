import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FlaskConical, 
  Monitor,
  Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole, LabSession, NavItem } from './types';
import { SERVER_TYPES } from './constants';

// UI Components
import { Toast } from './components/layout/Toast';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { AuthLayout } from './components/layout/AuthLayout';

// Auth Views
import { HomePage } from './views/auth/HomePage';
import { LoginForm } from './views/auth/LoginForm';
import { RegisterForm } from './views/auth/RegisterForm';
import { AdminLoginForm } from './views/auth/AdminLoginForm';

// Admin Views
import { AdminStats } from './views/admin/AdminStats';
import { AdminUsers } from './views/admin/AdminUsers';
import { AdminLabs } from './views/admin/AdminLabs';

// Staff Views
import { StaffDashboard } from './views/staff/StaffDashboard';
import { StaffMonitoring } from './views/staff/StaffMonitoring';
import { StaffStudents } from './views/staff/StaffStudents';

// Student Views
import { StudentDashboard } from './views/student/StudentDashboard';
import { StudentProgress } from './views/student/StudentProgress';
import { LabSessionView } from './views/student/LabSessionView';
import { StudentMindGames } from './views/student/StudentMindGames';
import { StudentChat } from './components/student/StudentChat';

import { useStorage } from './contexts/StorageContext';
import { StorageProvider } from './components/StorageProvider';

function AppContent() {
  const { 
    currentUser, 
    loading,
    users, 
    labs, 
    sessions, 
    login, 
    logout, 
    register
  } = useStorage();
  
  const [view, setView] = useState<string>('home');
  const [activeSession, setActiveSession] = useState<LabSession | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Initializing Virtual Lab...</p>
        </div>
      </div>
    );
  }

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = async (email: string, password?: string) => {
    try {
      await login(email, password);
      // Re-check role if needed, but login() already sets currentUser
      setView('dashboard');
      showToast('Welcome back!', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Login failed', 'error');
    }
  };

  const handleRegister = async (name: string, email: string, role: UserRole, password?: string) => {
    try {
      await register(name, email, role, password);
      setView('dashboard');
      showToast('Account created successfully!', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Registration failed', 'error');
    }
  };

  const handleLogout = async () => {
    await logout();
    setActiveSession(null);
    setView('home');
  };

  if (!currentUser) {
    if (view === 'home') return <HomePage onSetView={setView} />;
    if (view === 'login') return (
      <AuthLayout title="Welcome Back" subtitle="Sign in to your student or staff account" onBackToHome={() => setView('home')}>
        <LoginForm onLogin={(e: string, p: string) => handleLogin(e, p)} onSwitch={() => setView('register')} />
      </AuthLayout>
    );
    if (view === 'register') return (
      <AuthLayout title="Create Account" subtitle="Join our virtual lab community" onBackToHome={() => setView('home')}>
        <RegisterForm onRegister={handleRegister} onSwitch={() => setView('login')} />
      </AuthLayout>
    );
    if (view === 'admin-login') return (
      <AuthLayout title="Admin Portal" subtitle="System administrator authentication" onBackToHome={() => setView('home')}>
        <AdminLoginForm onLogin={(e: string, p: string) => handleLogin(e, p)} onBack={() => setView('home')} />
      </AuthLayout>
    );
    return <HomePage onSetView={setView} />;
  }

  const navItems: Record<UserRole, NavItem[]> = {
    ADMIN: [
      { label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
      { label: 'Users', icon: Users, id: 'users' },
      { label: 'Labs', icon: FlaskConical, id: 'labs' },
    ],
    STAFF: [
      { label: 'My Labs', icon: FlaskConical, id: 'dashboard' },
      { label: 'Monitoring', icon: Monitor, id: 'monitoring' },
      { label: 'Students', icon: Users, id: 'students' },
    ],
    STUDENT: [
      { label: 'Available Labs', icon: FlaskConical, id: 'dashboard' },
      { label: 'Mind Training', icon: Brain, id: 'mind-games' },
      { label: 'My Progress', icon: LayoutDashboard, id: 'progress' },
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans selection:bg-indigo-500/20 selection:text-indigo-700">
      {view !== 'lab-session' && (
        <Sidebar 
          currentUser={currentUser} 
          navItems={navItems[currentUser.role]} 
          view={view} 
          onSetView={setView} 
          onLogout={handleLogout} 
        />
      )}

      <main className={`flex-1 flex flex-col relative overflow-hidden ${view === 'lab-session' ? 'p-0' : 'p-10'}`}>
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full -ml-64 -mb-64" />

        {view !== 'lab-session' && <Header view={view} currentUser={currentUser} />}

        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col min-h-0"
          >
            {currentUser.role === 'ADMIN' && (
              <>
                {view === 'dashboard' && (
                  <div className="space-y-6">
                    <AdminStats users={users} labs={labs} sessions={sessions} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50">
                          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                          <p className="text-sm text-gray-500">Latest system events</p>
                        </div>
                        <div className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                              <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                              <span className="text-gray-600">New staff member registered</span>
                              <span className="text-gray-400 ml-auto">Just now</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {view === 'users' && <AdminUsers users={users} showToast={showToast} />}
                {view === 'labs' && <AdminLabs labs={labs} users={users} onSetView={setView} />}
                {view === 'monitoring' && <StaffMonitoring sessions={sessions} users={users} labs={labs} />}
              </>
            )}

            {currentUser.role === 'STAFF' && (
              <>
                {view === 'dashboard' && <StaffDashboard labs={labs} currentUser={currentUser} onSetView={setView} showToast={showToast} serverTypes={SERVER_TYPES} />}
                {view === 'monitoring' && <StaffMonitoring sessions={sessions} users={users} labs={labs} />}
                {view === 'students' && <StaffStudents users={users} />}
              </>
            )}

            {currentUser.role === 'STUDENT' && (
              <>
                {view === 'dashboard' && <StudentDashboard labs={labs} users={users} currentUser={currentUser} setActiveSession={setActiveSession} onSetView={setView} />}
                {view === 'lab-session' && (
                  <div key={`${activeSession?.id}-${activeSession?.startTime}`} className="h-full">
                    <LabSessionView 
                      activeSession={activeSession} 
                      labs={labs} 
                      setActiveSession={setActiveSession} 
                      onSetView={setView} 
                      showToast={showToast} 
                    />
                  </div>
                )}
                {view === 'progress' && <StudentProgress sessions={sessions} labs={labs} currentUser={currentUser} />}
                {view === 'mind-games' && <StudentMindGames />}
                <StudentChat currentUser={currentUser} />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <Toast toast={toast} />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <StorageProvider>
      <AppContent />
    </StorageProvider>
  );
}
