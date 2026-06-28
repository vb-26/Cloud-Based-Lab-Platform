import React, { useState } from 'react';
import { UserPlus, Edit, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { User, UserRole } from '../../types';

interface AdminUsersProps {
  users: User[];
  showToast: (_message: string, _type?: 'success' | 'error' | 'info') => void;
}

import { useStorage } from '../../contexts/StorageContext';

export const AdminUsers = ({ users, showToast }: AdminUsersProps) => {
  const { register, updateUser, deleteUser: storageDeleteUser } = useStorage();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('STUDENT');

  const deleteUser = async (id: string) => {
    try {
      await storageDeleteUser(id);
      showToast('User deleted successfully', 'success');
    } catch (_error) {
      showToast('Failed to delete user', 'error');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await updateUser(editingUser);
        showToast('User updated successfully', 'success');
      } else {
        await register(newName, newEmail, newRole, 'password123');
        showToast('User added successfully', 'success');
      }
      setShowUserForm(false);
      setEditingUser(null);
    } catch (_error) {
      showToast('Failed to save user', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <Card 
        title="User Management" 
        subtitle="Manage staff and student records"
        action={
          <Button onClick={() => { setEditingUser(null); setNewName(''); setNewEmail(''); setNewRole('STUDENT'); setShowUserForm(true); }} icon={UserPlus}>
            Add User
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm font-medium text-gray-500 border-b border-gray-100">
                <th className="pb-4">Name</th>
                <th className="pb-4">Email</th>
                <th className="pb-4">Role</th>
                <th className="pb-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.filter(u => u.role !== 'ADMIN').map(user => (
                <tr key={user.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-medium text-gray-900">{user.name}</td>
                  <td className="py-4 text-gray-600">{user.email}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'STAFF' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 text-right space-x-2">
                    <button onClick={() => { setEditingUser(user); setShowUserForm(true); }} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => deleteUser(user.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showUserForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">{editingUser ? 'Edit User' : 'Add New User'}</h2>
            <div className="space-y-4">
              <Input label="Full Name" value={editingUser ? editingUser.name : newName} onChange={editingUser ? (v: any) => setEditingUser({...editingUser, name: v}) : setNewName} />
              <Input label="Email" value={editingUser ? editingUser.email : newEmail} onChange={editingUser ? (v: any) => setEditingUser({...editingUser, email: v}) : setNewEmail} />
              <Select 
                label="Role" 
                value={editingUser ? editingUser.role : newRole} 
                onChange={editingUser ? (v: any) => setEditingUser({...editingUser, role: v}) : setNewRole}
                options={['STAFF', 'STUDENT']} 
              />
              <div className="flex gap-4 pt-4">
                <Button variant="secondary" className="flex-1" onClick={() => setShowUserForm(false)}>Cancel</Button>
                <Button className="flex-1" onClick={handleSubmit}>
                  {editingUser ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
