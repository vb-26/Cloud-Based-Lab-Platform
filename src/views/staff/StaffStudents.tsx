import React from 'react';
import { Card } from '../../components/ui/Card';
import { User } from '../../types';

interface StaffStudentsProps {
  users: User[];
}

export const StaffStudents = ({ users }: StaffStudentsProps) => (
  <div className="space-y-6">
    <Card title="Student Directory" subtitle="All students registered in the system">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm font-medium text-gray-500 border-b border-gray-100">
              <th className="pb-4">Name</th>
              <th className="pb-4">Email</th>
              <th className="pb-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.filter(u => u.role === 'STUDENT').map(student => (
              <tr key={student.id}>
                <td className="py-4 font-medium text-gray-900">{student.name}</td>
                <td className="py-4 text-gray-600">{student.email}</td>
                <td className="py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);
