import React, { useState } from 'react';
import { Plus, FlaskConical, Edit, Trash2, CheckCircle, Code } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { TextArea } from '../../components/ui/TextArea';
import { Lab, Question, User } from '../../types';

interface StaffDashboardProps {
  labs: Lab[];
  currentUser: User;
  onSetView: (view: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  serverTypes: string[];
}

import { useStorage } from '../../contexts/StorageContext';

export const StaffDashboard = ({ 
  labs, 
  currentUser, 
  onSetView, 
  showToast, 
  serverTypes 
}: StaffDashboardProps) => {
  const { addLab, updateLab, deleteLab } = useStorage();
  const [showLabForm, setShowLabForm] = useState(false);
  const [editingLab, setEditingLab] = useState<Lab | null>(null);
  const [newLab, setNewLab] = useState<Partial<Lab>>({
    name: '',
    maxStudents: 20,
    serverType: serverTypes[0],
    duration: 60,
    sketchfabUrl: '',
    questions: []
  });

  const openEditLab = (lab: Lab) => {
    setEditingLab(lab);
    setNewLab({ ...lab });
    setShowLabForm(true);
  };

  const saveLab = async () => {
    if (!newLab.name) return;
    try {
      if (editingLab) {
        await updateLab({ ...editingLab, ...newLab } as Lab);
        showToast('Lab updated successfully', 'success');
      } else {
        const lab: Lab = {
          ...newLab as Lab,
          id: `lab-${Date.now()}`,
          staffId: currentUser.id,
          createdAt: Date.now(),
          questions: newLab.questions || []
        };
        await addLab(lab);
        showToast('Lab created successfully', 'success');
      }
      setShowLabForm(false);
      setEditingLab(null);
    } catch (_error) {
      showToast('Failed to save lab', 'error');
    }
  };

  const addQuestion = (type: 'mcq' | 'coding' = 'mcq') => {
    let q: Question;
    if (type === 'mcq') {
      q = {
        id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type: 'mcq',
        text: '',
        options: ['', ''],
        correctAnswer: 0,
        points: 5,
        explanation: ''
      };
    } else {
      q = {
        id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type: 'coding',
        text: '',
        language: 'python',
        boilerplate: '',
        solution: '',
        points: 10,
        explanation: ''
      };
    }
    setNewLab(prev => ({ ...prev, questions: [...(prev.questions || []), q] }));
  };

  return (
    <div className="space-y-10 relative z-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">My Labs</h2>
        <Button onClick={() => setShowLabForm(true)} icon={Plus}>Create Lab</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {labs.filter(l => l.staffId === currentUser.id).map(lab => (
          <Card key={lab.id} className="group relative">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
                <FlaskConical size={24} />
              </div>
              <div className="flex gap-2">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => openEditLab(lab)} 
                  className="p-2 bg-white/5 text-gray-400 hover:text-indigo-400 rounded-xl border border-white/10 transition-all"
                >
                  <Edit size={16} />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={async () => {
                    try {
                      await deleteLab(lab.id);
                      showToast('Lab deleted', 'info');
                    } catch (_error) {
                      showToast('Failed to delete lab', 'error');
                    }
                  }} 
                  className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl border border-red-500/20 transition-all"
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase italic leading-tight">{lab.name}</h3>
            
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center">
                <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Duration</p>
                <p className="text-sm font-black text-white italic">{lab.duration}m</p>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center">
                <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Capacity</p>
                <p className="text-sm font-black text-white italic">{lab.maxStudents}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center">
                <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">Type</p>
                <p className="text-[10px] font-black text-indigo-400 italic truncate">{lab.serverType}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{lab.questions.length} Practice Modules</span>
                <Button variant="ghost" className="text-[10px] px-4 py-2" onClick={() => onSetView('monitoring')}>Monitor</Button>
              </div>
              
              {lab.questions.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] uppercase tracking-widest text-gray-600 font-black">Curriculum Preview</p>
                  <div className="max-h-32 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {lab.questions.map((q, i) => (
                      <div key={q.id} className="text-[11px] text-gray-400 flex items-start gap-3 group/item">
                        <span className="w-5 h-5 flex items-center justify-center bg-white/5 text-indigo-400 rounded-lg text-[9px] font-black shrink-0 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-colors">{i + 1}</span>
                        <span className="flex-1 leading-relaxed group-hover/item:text-gray-200 transition-colors truncate">{q.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {showLabForm && (
        <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-b from-gray-900 to-gray-950 border border-white/10 rounded-[2.5rem] shadow-2xl my-8 relative overflow-hidden w-full max-w-4xl"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 blur-[120px] rounded-full -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -ml-32 -mb-32" />
            
            <div className="relative z-10 p-8 max-h-[90vh] overflow-y-auto custom-scrollbar space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                    <FlaskConical size={24} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                      {editingLab ? 'Update Lab Instance' : 'Create New Lab'}
                    </h2>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Configure your virtual laboratory environment</p>
                  </div>
                </div>
              </div>

              {/* Lab Configuration Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-indigo-500 rounded-full" />
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Lab Configuration</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                  <Input label="Lab Name" placeholder="e.g., Network Security Lab" value={newLab.name || ''} onChange={(v: any) => setNewLab({...newLab, name: v})} />
                  <Input label="Duration (Minutes)" type="number" min="15" value={newLab.duration || 0} onChange={(v: any) => setNewLab({...newLab, duration: parseInt(v)})} />
                  <Select label="Environment Type" value={newLab.serverType || ''} onChange={(v: any) => setNewLab({...newLab, serverType: v})} options={serverTypes} />
                  <Input label="Max Student Capacity" type="number" min="1" value={newLab.maxStudents || 0} onChange={(v: any) => setNewLab({...newLab, maxStudents: parseInt(v)})} />
                </div>
              </div>

              {/* 3D Model Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-blue-500 rounded-full" />
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">3D Model (Optional)</h3>
                </div>
                
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all space-y-3">
                  <Input 
                    label="Sketchfab URL or Embed Code" 
                    placeholder="https://sketchfab.com/models/..." 
                    value={newLab.sketchfabUrl || ''} 
                    onChange={(v: any) => setNewLab({...newLab, sketchfabUrl: v})} 
                  />
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">💡 Paste a Sketchfab URL or full &lt;iframe&gt; embed code</p>
                </div>
              </div>

              {/* Assessment Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-purple-500 rounded-full" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Assessment Curriculum</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      onClick={() => addQuestion('mcq')} 
                      icon={Plus} 
                      className="text-[9px] px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20"
                    >
                      MCQ
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => addQuestion('coding')} 
                      icon={Code} 
                      className="text-[9px] px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20"
                    >
                      Coding
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {newLab.questions?.map((q, qIdx) => (
                    <motion.div 
                      key={q.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-6 rounded-2xl border transition-all ${
                        q.type === 'mcq' 
                          ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40' 
                          : 'bg-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/40'
                      }`}
                    >
                      {/* Question Header */}
                      <div className="flex items-start justify-between mb-4 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                            q.type === 'mcq' 
                              ? 'bg-amber-500/20 text-amber-400' 
                              : 'bg-cyan-500/20 text-cyan-400'
                          }`}>
                            {q.type === 'mcq' ? '📋 Multiple Choice' : '💻 Coding Task'}
                          </div>
                          <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Module {qIdx + 1}</span>
                        </div>
                        <button 
                          onClick={() => {
                            setNewLab(prev => ({
                              ...prev,
                              questions: prev.questions?.filter((_, idx) => idx !== qIdx)
                            }));
                          }}
                          className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Question Content */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <TextArea 
                              label="Question / Prompt" 
                              value={q.text} 
                              rows={3}
                              placeholder="Enter the question or coding challenge..."
                              onChange={(v: any) => {
                                setNewLab(prev => ({
                                  ...prev,
                                  questions: prev.questions?.map((item, idx) => 
                                    idx === qIdx ? { ...item, text: v } : item
                                  )
                                }));
                              }} 
                            />
                          </div>
                          <Input 
                            label="Points" 
                            type="number"
                            min="1"
                            value={q.points} 
                            onChange={(v: any) => {
                              setNewLab(prev => ({
                                ...prev,
                                questions: prev.questions?.map((item, idx) => 
                                  idx === qIdx ? { ...item, points: parseInt(v) || 0 } : item
                                )
                              }));
                            }} 
                          />
                        </div>
                        
                        {q.type === 'mcq' ? (
                          <div className="space-y-3">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Answer Options</div>
                            <div className="grid grid-cols-1 gap-2">
                              {q.options.map((opt, oIdx) => (
                                <div key={oIdx} className="flex items-center gap-3 group">
                                  <button
                                    onClick={() => {
                                      setNewLab(prev => ({
                                        ...prev,
                                        questions: prev.questions?.map((item, idx) => 
                                          idx === qIdx ? { ...item, correctAnswer: oIdx } : item
                                        )
                                      }));
                                    }}
                                    className={`flex-shrink-0 p-1.5 rounded-lg transition-all ${
                                      q.correctAnswer === oIdx 
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                                        : 'text-gray-600 hover:text-emerald-400 hover:bg-emerald-500/10'
                                    }`}
                                    title="Mark as correct answer"
                                  >
                                    <CheckCircle size={16} />
                                  </button>
                                  <input 
                                    type="text"
                                    placeholder={`Option ${oIdx + 1}`}
                                    value={opt} 
                                    onChange={(v: any) => {
                                      setNewLab(prev => ({
                                        ...prev,
                                        questions: prev.questions?.map((item, idx) => {
                                          if (idx === qIdx) {
                                            const newOptions = [...item.options];
                                            newOptions[oIdx] = v.target.value;
                                            return { ...item, options: newOptions };
                                          }
                                          return item;
                                        })
                                      }));
                                    }} 
                                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-gray-600 rounded-lg text-[13px] focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium"
                                  />
                                  {q.options.length > 2 && (
                                    <button
                                      onClick={() => {
                                        setNewLab(prev => ({
                                          ...prev,
                                          questions: prev.questions?.map((item, idx) => {
                                            if (idx === qIdx) {
                                              const newOptions = item.options.filter((_, i) => i !== oIdx);
                                              const newCorrect = q.correctAnswer >= newOptions.length ? 0 : q.correctAnswer;
                                              return { ...item, options: newOptions, correctAnswer: newCorrect };
                                            }
                                            return item;
                                          })
                                        }));
                                      }}
                                      className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                            {q.options.length < 6 && (
                              <button
                                onClick={() => {
                                  setNewLab(prev => ({
                                    ...prev,
                                    questions: prev.questions?.map((item, idx) => 
                                      idx === qIdx ? { ...item, options: [...item.options, ''] } : item
                                    )
                                  }));
                                }}
                                className="w-full py-3 rounded-lg border-2 border-dashed border-white/10 text-gray-500 text-[11px] font-black uppercase tracking-widest hover:border-amber-500/50 hover:text-amber-400 hover:bg-amber-500/5 transition-all"
                              >
                                + Add Option
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Select 
                              label="Programming Language" 
                              value={q.language} 
                              options={['python', 'javascript', 'cpp', 'java']} 
                              onChange={(v: string) => {
                                setNewLab(prev => ({
                                  ...prev,
                                  questions: prev.questions?.map((item, idx) => 
                                    idx === qIdx ? { ...item, language: v } : item
                                  )
                                }));
                              }}
                            />
                            <TextArea 
                              label="Starter Code (Boilerplate)" 
                              value={q.boilerplate} 
                              rows={3}
                              placeholder="Initial code template for students..."
                              onChange={(v: string) => {
                                setNewLab(prev => ({
                                  ...prev,
                                  questions: prev.questions?.map((item, idx) => 
                                    idx === qIdx ? { ...item, boilerplate: v } : item
                                  )
                                }));
                              }} 
                            />
                            <TextArea 
                              label="Solution / Success Criteria" 
                              value={q.solution} 
                              rows={3}
                              placeholder="Reference solution or expected behavior..."
                              onChange={(v: string) => {
                                setNewLab(prev => ({
                                  ...prev,
                                  questions: prev.questions?.map((item, idx) => 
                                    idx === qIdx ? { ...item, solution: v } : item
                                  )
                                }));
                              }} 
                            />
                          </div>
                        )}

                        <TextArea 
                          label="Explanation (Shown After Completion)" 
                          value={q.explanation || ''} 
                          rows={2}
                          placeholder="Optional feedback or explanation..."
                          onChange={(v: string) => {
                            setNewLab(prev => ({
                              ...prev,
                              questions: prev.questions?.map((item, idx) => 
                                idx === qIdx ? { ...item, explanation: v } : item
                              )
                            }));
                          }} 
                        />
                      </div>
                    </motion.div>
                  ))}
                  
                  {(!newLab.questions || newLab.questions.length === 0) && (
                    <div className="text-center py-12 px-6 text-gray-600 border-2 border-dashed border-white/10 rounded-2xl font-bold uppercase tracking-widest text-[11px]">
                      <p>📚 No assessment modules yet</p>
                      <p className="text-[10px] text-gray-700 mt-2">Add MCQ or Coding questions above</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-white/5">
                <Button 
                  variant="secondary" 
                  className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10" 
                  onClick={() => { setShowLabForm(false); setEditingLab(null); }}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 border-0 shadow-lg shadow-indigo-600/30" 
                  onClick={saveLab}
                >
                  {editingLab ? '✓ Update Lab' : '✓ Create Lab'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
