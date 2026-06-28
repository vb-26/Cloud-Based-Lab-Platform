import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { FlaskConical, Clock, CheckCircle2, RotateCcw, CheckCircle, ChevronLeft, ChevronRight, Activity, Shield, Zap, Globe, Code2, Terminal, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/Button';
import { LabSession, Lab } from '../../types';

interface LabSessionViewProps {
  activeSession: LabSession | null;
  labs: Lab[];
  setSessions: (sessions: any) => void;
  setActiveSession: (session: LabSession | null) => void;
  onSetView: (view: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

import { useStorage } from '../../contexts/StorageContext';

export const LabSessionView = ({ 
  activeSession, 
  labs, 
  setActiveSession, 
  onSetView,
  showToast
}: Omit<LabSessionViewProps, 'setSessions' | 'sessions' | 'session' | 'view' | 'message' | 'type'>) => {
  const { updateSession } = useStorage();
  
  const lab = activeSession ? labs.find(l => l.id === activeSession.labId) : null;
  const [showModel, setShowModel] = useState(!!lab?.sketchfabUrl);
  const [modelFull, setModelFull] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(lab ? lab.duration * 60 : 0);
  const [showIDE, setShowIDE] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [resetKey, setResetKey] = useState(0);
  const [studentCode, setStudentCode] = useState<Record<string, string>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState<Record<string, { success: boolean; feedback: string }>>({});

  const currentQuestion = lab?.questions[currentQuestionIdx];

  const finishLab = React.useCallback(async () => {
    if (!activeSession) return;
    const updatedSession = { ...activeSession, status: 'completed' as const, progress: 100 };
    try {
      await updateSession(updatedSession);
      setActiveSession(null);
      onSetView('dashboard');
    } catch (error) {
      console.error("Failed to finish lab session:", error);
    }
  }, [activeSession, onSetView, setActiveSession, updateSession]);

  const languages = React.useMemo(() => [
    { id: 'python', name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { id: 'java', name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    { id: 'cpp', name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
    { id: 'c', name: 'C', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
    { id: 'javascript', name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  ], []);

  const evaluateCode = async () => {
    if (!currentQuestion || currentQuestion.type !== 'coding') return;
    
    setIsEvaluating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const code = studentCode[currentQuestion.id] || '';
      
      const prompt = `
        You are an automated grading system for a virtual lab.
        Lab Module Question: ${currentQuestion.text}
        Teacher's Reference Solution/Criteria: ${currentQuestion.solution}
        Student's Code Language: ${currentQuestion.language}
        Student's Submitted Code:
        \`\`\`${currentQuestion.language}
        ${code}
        \`\`\`
        
        Evaluate if the student's code is functionally correct according to the question and criteria.
        Be encouraging but strict on logic.
        Return your response in JSON format:
        {
          "success": boolean,
          "feedback": "A short (1-2 sentence) specific feedback message for the student. Do not give the full solution if they failed."
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text);
      setEvaluationResults(prev => ({ ...prev, [currentQuestion!.id]: result }));
      
      if (result.success) {
        showToast('Code evaluation passed!', 'success');
        handleAnswer(currentQuestion.id, 1); // Mark as correct (arbitrary 1)
      } else {
        showToast('Code needs improvement', 'info');
      }
    } catch (error) {
      console.error("Evaluation error:", error);
      showToast('Evaluation failed. Please try again.', 'error');
    } finally {
      setIsEvaluating(false);
    }
  };

  useEffect(() => {
    if (!activeSession) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishLab();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeSession, finishLab]);

  if (!activeSession || !lab || !currentQuestion) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = async (qId: string, optIdx: number) => {
    const newAnswers = { ...activeSession.answers, [qId]: optIdx };
    const totalQuestions = lab.questions.length;
    const progress = totalQuestions > 0 
      ? Math.floor((Object.keys(newAnswers).length / totalQuestions) * 100)
      : 0;
    
    // Calculate total score based on correct answers
    const totalScore = lab.questions.reduce((sum, q) => {
      const studentAnswer = newAnswers[q.id];
      if (studentAnswer === undefined) return sum;
      
      if (q.type === 'mcq') {
        return studentAnswer === q.correctAnswer ? sum + q.points : sum;
      } else {
        // For coding questions, we assume '1' in answers significa success as set in evaluateCode
        return studentAnswer === 1 ? sum + q.points : sum;
      }
    }, 0);
    
    const updatedSession = { ...activeSession, answers: newAnswers, progress, totalScore };
    try {
      await updateSession(updatedSession);
      setActiveSession(updatedSession);
    } catch (error) {
      console.error("Failed to update session answers:", error);
    }
  };

  const resetLab = async () => {
    if (confirm("Are you sure you want to reset the lab? All progress will be lost.")) {
      const resetSession = { 
        ...activeSession, 
        answers: {}, 
        progress: 0, 
        totalScore: 0
      };
      try {
        await updateSession(resetSession);
        setActiveSession(resetSession);
        // Reset UI state to show 3D model from the beginning
        setShowModel(true);
        setCurrentQuestionIdx(0);
        setStudentCode({});
        setEvaluationResults({});
        showToast('Lab session has been reset to its initial state', 'success');
      } catch (error) {
        console.error("Failed to reset lab:", error);
      }
    }
  };


  const getSketchfabEmbedUrl = (input: string) => {
    if (!input) return '';
    
    // 1. If it's an iframe tag, extract the src attribute
    const srcMatch = input.match(/src=["']([^"']+)["']/);
    let url = srcMatch ? srcMatch[1] : input;

    // 2. If it's already an embed URL, return it (but we'll re-format to ensure consistency)
    // 3. Extract the 32-character ID
    // Standard: https://sketchfab.com/3d-models/name-ID
    // Short/Embed: https://sketchfab.com/models/ID
    const idMatch = url.match(/\/models\/([a-z0-9]{32})/) || 
                    url.match(/\/3d-models\/.*-([a-z0-9]{32})/) ||
                    url.match(/([a-z0-9]{32})/i);
    
    if (idMatch && idMatch[1]) {
      return `https://sketchfab.com/models/${idMatch[1]}/embed`;
    }
    
    return url;
  };

  if (showModel && lab.sketchfabUrl) {
    return (
      <div className="h-full flex flex-col bg-slate-50 relative">
        <AnimatePresence>
          {!modelFull && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex items-center justify-between bg-white/80 backdrop-blur-xl p-6 border-b border-slate-200 shrink-0 overflow-hidden"
            >
              <div className="flex items-center gap-6">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl border border-indigo-200">
                  <FlaskConical size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-black text-slate-900 text-xl tracking-tight uppercase italic">{lab.name}</h2>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded uppercase tracking-widest border border-emerald-100 flex items-center gap-1">
                      <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                      System Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Examine the 3D model to understand the lab environment</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="secondary" onClick={() => setModelFull(!modelFull)} className="px-6 py-3 border border-slate-200">
                  Full Screen Preview
                </Button>
                <Button variant="primary" onClick={() => setShowModel(false)} className="px-8 py-3 shadow-lg shadow-indigo-600/20 border-0">
                  Start Practice Session
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {modelFull && (
          <div className="absolute top-6 right-6 z-50 flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setModelFull(false)}
              className="px-6 py-3 bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl text-[10px] font-black text-slate-900 uppercase tracking-widest shadow-2xl flex items-center gap-2"
            >
              <RotateCcw size={14} className="text-indigo-600" />
              Exit Full View
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModel(false)}
              className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/40 border-0"
            >
              Start Session
            </motion.button>
          </div>
        )}
        
        <div className={`flex-1 flex overflow-hidden transition-all duration-500 ${modelFull ? 'p-0' : 'p-6 gap-6'}`}>
          <div className={`flex-1 bg-slate-200 shadow-2xl border border-slate-300 overflow-hidden relative group transition-all duration-500 ${modelFull ? 'rounded-0 border-0' : 'rounded-3xl'}`}>
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <div className="px-3 py-1.5 bg-white/80 backdrop-blur-md border border-slate-200 rounded-lg text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 shadow-sm">
                <Activity size={12} className="text-indigo-600" />
                Live Render
              </div>
            </div>
            <iframe
              title="Sketchfab Model"
              className="w-full h-full border-0"
              src={`${getSketchfabEmbedUrl(lab.sketchfabUrl)}?autostart=1&ui_theme=light&dnt=1`}
              allow="autoplay; fullscreen; xr-spatial-tracking"
              xr-spatial-tracking="true"
              execution-while-out-of-viewport="true"
              execution-while-not-rendered="true"
              web-share="true"
            />
          </div>

          {!modelFull && (
            <div className="w-80 hidden xl:flex flex-col gap-4 shrink-0 animate-in slide-in-from-right duration-500">
              <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 flex-1 flex flex-col space-y-6 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lab Diagnostics</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield size={16} className="text-indigo-600" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Environment</span>
                    </div>
                    <p className="text-sm text-slate-900 font-black italic">{lab.serverType}</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap size={16} className="text-amber-500" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duration</span>
                    </div>
                    <p className="text-sm text-slate-900 font-black italic">{lab.duration} Minutes</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3 mb-2">
                      <Globe size={16} className="text-blue-500" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Access</span>
                    </div>
                    <p className="text-sm text-slate-900 font-black italic">Instance: Online</p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col min-h-0">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">System Console</h3>
                  <div className="flex-1 bg-slate-900 p-4 rounded-2xl border border-slate-800 font-mono text-[10px] text-emerald-400/70 space-y-1 overflow-y-auto custom-scrollbar">
                    <p className="">[SYSTEM] Initializing virtual environment...</p>
                    <p className="">[SYSTEM] Mounting storage volumes...</p>
                    <p className="">[SYSTEM] Network interface: eth0 UP</p>
                    <p className="">[SYSTEM] Services: SSH, HTTP, SQL READY</p>
                    <p className="animate-pulse">[IDLE] Waiting for student input...</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    <span>System Load</span>
                    <span className="text-indigo-600">12%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 border border-slate-200 overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full w-[12%]" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl p-5 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-6">
          <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl border border-indigo-200">
            <FlaskConical size={22} />
          </div>
          <div>
            <h2 className="font-black text-slate-900 text-lg leading-tight tracking-tight uppercase italic">{lab.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Session: {activeSession.id.split('-')[1]}</span>
              <span className="w-1 h-1 bg-slate-200 rounded-full" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                <Activity size={10} /> Live Session
              </span>
            </div>
          </div>
        </div>
          <div className="flex items-center gap-8">
            <Button variant="ghost" onClick={resetLab} className="text-slate-400 hover:text-red-600 px-4 h-10 text-[10px] font-black uppercase tracking-widest">
              <RotateCcw size={14} className="mr-2" /> Reset Lab
            </Button>
            <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Remaining</span>
            <div className={`flex items-center gap-2 font-mono text-xl font-black italic ${timeLeft < 300 ? 'text-red-500' : 'text-indigo-600'}`}>
              <Clock size={18} />
              {formatTime(timeLeft)}
            </div>
          </div>
          <Button variant="primary" onClick={finishLab} icon={CheckCircle2} className="px-8 py-4">
            Terminate Session
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-24 border-r border-slate-200 bg-white/50 backdrop-blur-xl flex flex-col items-center py-8 gap-6 overflow-y-auto custom-scrollbar shrink-0 relative z-20">
          <div className="flex flex-col items-center gap-6 pb-8 border-b border-slate-200 w-full">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowIDE(false)}
              className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all ${
                !showIDE ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/40' : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
              }`}
              title="Questions"
            >
              <FlaskConical size={24} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowIDE(true)}
              className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all ${
                showIDE ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/40' : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
              }`}
              title="IDE"
            >
              <Code2 size={24} />
            </motion.button>
          </div>

          <div className="flex flex-col items-center gap-4 w-full px-4">
            {lab.questions.map((_, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setShowIDE(false);
                  setCurrentQuestionIdx(idx);
                }}
                className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all shrink-0 relative group border-2 ${
                  currentQuestionIdx === idx && !showIDE
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-600/40 scale-110' 
                    : activeSession.answers[lab.questions[idx].id] !== undefined
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : 'bg-slate-100 text-slate-400 border-transparent hover:border-indigo-500/50 hover:text-indigo-600'
                }`}
              >
                <span className="text-xs font-black italic">{idx + 1}</span>
                {activeSession.answers[lab.questions[idx].id] !== undefined && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle2 size={8} className="text-white" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Active Content Area */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-50">
          {showIDE ? (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 bg-slate-200 flex flex-col min-h-0">
                <div className="px-6 py-2 border-b border-slate-300 flex items-center justify-between bg-white shrink-0">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                        main.{selectedLanguage === 'python' ? 'py' : selectedLanguage === 'javascript' ? 'js' : selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'java' ? 'java' : 'c'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                      {languages.map(lang => (
                        <button
                          key={lang.id}
                          onClick={() => setSelectedLanguage(lang.id)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2 ${
                            selectedLanguage === lang.id 
                              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                              : 'text-slate-500 hover:text-indigo-600 hover:bg-white'
                          }`}
                        >
                          <img src={lang.icon} alt={lang.name} className={`w-3 h-3 ${selectedLanguage === lang.id ? '' : 'grayscale opacity-50'}`} referrerPolicy="no-referrer" />
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="secondary" 
                        onClick={() => setResetKey(prev => prev + 1)}
                        className="bg-white border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 h-7 text-[9px] font-black uppercase tracking-widest px-3"
                      >
                        <RotateCcw size={10} className="mr-2" /> Reset
                      </Button>
                    </div>
                    <div className="h-4 w-px bg-slate-200" />
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1 h-1 bg-indigo-600 rounded-full animate-pulse" />
                      IDE Active
                    </span>
                  </div>
                </div>
                <div className="flex-1 bg-white relative min-h-0">
                  <iframe
                    key={`${selectedLanguage}-${resetKey}`}
                    title="Code Editor"
                    src={`https://onecompiler.com/embed/${selectedLanguage}?hideLanguageSelection=true&theme=light&hideTitle=true`}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="clipboard-read; clipboard-write"
                  />
                </div>
                <div className="px-6 py-2 bg-white border-t border-slate-200 flex items-center gap-6 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Online</span>
                  </div>
                  <div className="flex items-center gap-4 text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                    <span>UTF-8</span>
                    <span>{languages.find(l => l.id === selectedLanguage)?.name} Runtime</span>
                  </div>
                  <div className="ml-auto text-[9px] font-mono text-slate-300">
                    IDE v2.4.0
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-12 py-10 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-xl">
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Assessment Module</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <h4 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Practice Questions</h4>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-xl border border-indigo-100 uppercase tracking-widest">
                      {Object.keys(activeSession.answers).length} / {lab.questions.length} Completed
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar relative">
                {/* Decorative Background for Questions */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
                
                <div className={`mx-auto w-full relative z-10 transition-all duration-500 ${currentQuestion.type === 'coding' ? 'max-w-none' : 'max-w-4xl'}`}>
                  {lab.questions.length > 0 && (
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={currentQuestion.id} 
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.02, y: -10 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-10"
                      >
                        {currentQuestion.type === 'coding' ? (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                            <div className="space-y-10">
                              <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                  <span className="px-4 py-1.5 bg-white text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-[0.2em] border border-slate-200 shadow-sm">
                                    Module {currentQuestionIdx + 1}: Coding Task
                                  </span>
                                  <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
                                </div>
                                <h2 className="font-black text-slate-900 text-4xl leading-[1.1] tracking-tight uppercase italic pb-4 border-b border-slate-100">
                                  {currentQuestion.text}
                                </h2>
                              </div>

                              <div className="space-y-6">
                                <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-800 relative overflow-hidden group">
                                  <div className="flex items-center justify-between mb-6 relative z-10">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                      <Terminal size={14} className="text-indigo-400" />
                                      AI Verification Input
                                    </span>
                                    <Button 
                                      onClick={evaluateCode} 
                                      disabled={isEvaluating}
                                      className="h-10 px-6 text-[10px] bg-indigo-600 hover:bg-indigo-500 border-0 shadow-lg shadow-indigo-600/30"
                                    >
                                      {isEvaluating ? <Loader2 size={14} className="animate-spin mr-2" /> : <Sparkles size={14} className="mr-2" />}
                                      Evaluate Solution
                                    </Button>
                                  </div>
                                  <textarea
                                    value={studentCode[currentQuestion.id] ?? currentQuestion.boilerplate ?? ''}
                                    onChange={(e) => setStudentCode(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                                    className="w-full h-80 bg-slate-800/50 text-emerald-400 font-mono text-sm p-6 rounded-2xl outline-none focus:ring-2 ring-indigo-500/30 transition-all border border-slate-700 custom-scrollbar resize-none"
                                    spellCheck={false}
                                    placeholder="# Implement your solution here..."
                                  />
                                </div>

                                {evaluationResults[currentQuestion.id] && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-8 rounded-[2rem] border-2 flex items-start gap-6 ${
                                      evaluationResults[currentQuestion.id].success 
                                        ? 'bg-emerald-50 border-emerald-100' 
                                        : 'bg-red-50 border-red-100'
                                    }`}
                                  >
                                    <div className={`p-3 rounded-xl border shrink-0 ${
                                      evaluationResults[currentQuestion.id].success 
                                        ? 'bg-emerald-100 text-emerald-600 border-emerald-200' 
                                        : 'bg-red-100 text-red-600 border-red-200'
                                    }`}>
                                      {evaluationResults[currentQuestion.id].success ? <CheckCircle size={24} /> : <Zap size={24} />}
                                    </div>
                                    <div>
                                      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                                        evaluationResults[currentQuestion.id].success ? 'text-emerald-600' : 'text-red-600'
                                      }`}>
                                        {evaluationResults[currentQuestion.id].success ? 'Success' : 'Correction Needed'}
                                      </p>
                                      <p className={`text-lg font-bold italic leading-relaxed ${
                                        evaluationResults[currentQuestion.id].success ? 'text-emerald-900' : 'text-red-900'
                                      }`}>
                                        {evaluationResults[currentQuestion.id].feedback}
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            </div>

                            <div className="bg-slate-200 rounded-[2.5rem] p-1 shadow-inner border border-slate-300 h-[700px] flex flex-col group overflow-hidden sticky top-0">
                                <div className="px-6 py-3 bg-white flex items-center justify-between rounded-t-[2.3rem] shrink-0 border-b border-slate-200">
                                  <div className="flex items-center gap-3">
                                    <div className="flex gap-1">
                                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                      <Code2 size={12} className="text-indigo-600" />
                                      Execution IDE
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black rounded uppercase tracking-widest border border-emerald-100 italic">Live Console</div>
                                  </div>
                                </div>
                                <div className="flex-1 bg-white relative">
                                  <iframe
                                    key={`side-ide-${currentQuestion.language}`}
                                    title="Side Code Editor"
                                    src={`https://onecompiler.com/embed/${currentQuestion.language}?hideLanguageSelection=true&theme=light&hideTitle=true`}
                                    className="absolute inset-0 w-full h-full border-0"
                                    allow="clipboard-read; clipboard-write"
                                  />
                                </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="space-y-6">
                              <div className="flex items-center gap-4">
                                <span className="px-4 py-1.5 bg-white text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-[0.2em] border border-slate-200 shadow-sm">
                                  Module {currentQuestionIdx + 1}: MCQ
                                </span>
                                <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
                              </div>
                              <h2 className="font-black text-slate-900 text-4xl leading-[1.1] tracking-tight uppercase italic pb-4 border-b border-slate-100">
                                {currentQuestion.text}
                              </h2>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-6">
                              {currentQuestion.options.map((opt, oIdx) => (
                                <motion.button
                                  key={oIdx}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: oIdx * 0.1 }}
                                  onClick={() => handleAnswer(currentQuestion.id, oIdx)}
                                  className={`w-full text-left px-10 py-8 rounded-[2.5rem] text-xl transition-all flex items-center justify-between group border-2 relative overflow-hidden ${
                                    activeSession.answers[currentQuestion.id] === oIdx
                                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xl shadow-indigo-600/40 scale-[1.02]'
                                      : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-500/50 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm'
                                  }`}
                                >
                                  <div className="flex items-center gap-8 relative z-10">
                                    <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border-2 transition-all ${
                                      activeSession.answers[currentQuestion.id] === oIdx
                                        ? 'bg-white text-indigo-600 border-white'
                                        : 'bg-slate-50 border-slate-200 text-slate-400 group-hover:border-indigo-500/50 group-hover:text-indigo-600'
                                    }`}>
                                      {String.fromCharCode(65 + oIdx)}
                                    </span>
                                    <span className="font-bold tracking-tight">{opt}</span>
                                  </div>
                                  {activeSession.answers[currentQuestion.id] === oIdx && (
                                    <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} className="relative z-10">
                                      <CheckCircle2 size={32} />
                                    </motion.div>
                                  )}
                                </motion.button>
                              ))}
                            </div>
                          </>
                        )}

                        {activeSession.answers[lab.questions[currentQuestionIdx].id] !== undefined && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-6 pt-4"
                          >
                            <div className="flex items-center gap-4">
                              <button 
                                onClick={async () => {
                                  const newAnswers = { ...activeSession.answers };
                                  delete newAnswers[lab.questions[currentQuestionIdx].id];
                                  const totalQuestions = lab.questions.length;
                                  const progress = totalQuestions > 0 
                                    ? Math.floor((Object.keys(newAnswers).length / totalQuestions) * 100)
                                    : 0;
                                  
                                  // Recalculate score after reset
                                  const totalScore = lab.questions.reduce((sum, q) => {
                                    const studentAnswer = newAnswers[q.id];
                                    if (studentAnswer === undefined) return sum;
                                    
                                    if (q.type === 'mcq') {
                                      return studentAnswer === q.correctAnswer ? sum + q.points : sum;
                                    } else {
                                      return studentAnswer === 1 ? sum + q.points : sum;
                                    }
                                  }, 0);

                                  const updatedSession = { ...activeSession, answers: newAnswers, progress, totalScore };
                                  try {
                                    await updateSession(updatedSession);
                                    setActiveSession(updatedSession);
                                  } catch (error) {
                                    console.error("Failed to reset answer:", error);
                                  }
                                }}
                                className="text-xs text-slate-500 hover:text-red-600 font-black uppercase tracking-widest transition-colors flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-200"
                              >
                                <RotateCcw size={14} />
                                Reset Answer
                              </button>
                            </div>

                            {lab.questions[currentQuestionIdx].explanation && (
                              <div className="p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                  <FlaskConical size={80} className="text-emerald-600" />
                                </div>
                                <div className="relative z-10">
                                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Zap size={14} /> Knowledge Insight
                                  </p>
                                  <p className="text-lg text-emerald-900 leading-relaxed font-bold italic">
                                    {lab.questions[currentQuestionIdx].explanation}
                                  </p>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </div>

              <div className="px-12 py-10 border-t border-slate-200 flex justify-between items-center shrink-0 bg-white/50 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto w-full flex justify-between items-center">
                  <Button 
                    variant="secondary" 
                    disabled={currentQuestionIdx === 0}
                    onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                    icon={ChevronLeft}
                    className="rounded-2xl px-8 py-4"
                  >
                    Previous Module
                  </Button>
                  
                  <div className="flex flex-col items-center">
                    <div className="flex gap-2 mb-3">
                      {lab.questions.map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            i === currentQuestionIdx ? 'w-10 bg-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.3)]' : 'w-2 bg-slate-200'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Assessment Progress: {currentQuestionIdx + 1} / {lab.questions.length}
                    </span>
                  </div>

                  <Button 
                    variant="secondary" 
                    disabled={currentQuestionIdx === lab.questions.length - 1}
                    onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                    className="rounded-2xl px-8 py-4"
                  >
                    Next Module <ChevronRight size={18} className="ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
