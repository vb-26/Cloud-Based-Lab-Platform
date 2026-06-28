import React from 'react';
import { motion } from 'motion/react';
import { FlaskConical, Zap, Shield, Globe, Users, Cpu, Code2, Terminal } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

interface HomePageProps {
  onSetView: (view: string) => void;
}

export const HomePage = ({ onSetView }: HomePageProps) => (
  <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4 group cursor-pointer">
        <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg shadow-indigo-600/20 group-hover:rotate-12 transition-transform duration-300">
          <FlaskConical size={24} />
        </div>
        <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic">Virtual<span className="text-indigo-600">Lab</span></span>
      </div>
      <div className="flex gap-4">
        <Button variant="ghost" onClick={() => onSetView('admin-login')}>Admin Portal</Button>
        <Button variant="secondary" onClick={() => onSetView('login')}>Sign In</Button>
        <Button onClick={() => onSetView('register')}>Get Started</Button>
      </div>
    </nav>

    <main className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center justify-center p-8 relative">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full" />

        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 mb-8">
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Next-Gen Virtual Learning</span>
            </div>
            <h1 className="text-7xl md:text-8xl font-black text-slate-900 leading-[0.85] mb-8 tracking-tighter uppercase italic">
              The Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Lab Practice</span> <br />
              is Here.
            </h1>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed font-medium max-w-lg">
              Experience a seamless virtual environment for learning, practice, and real-time monitoring. Built for the next generation of engineers.
            </p>
            <div className="flex flex-wrap gap-6">
              <Button className="px-10 py-5 text-sm" onClick={() => onSetView('register')}>Start Free Trial</Button>
              <Button variant="secondary" className="px-10 py-5 text-sm" onClick={() => onSetView('login')}>View Labs</Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl rounded-full animate-pulse" />
            <div className="relative bg-white p-4 rounded-[3rem] shadow-2xl border border-slate-200">
              <img 
                src="https://www.skillable.com/wp-content/uploads/2023/04/Man-sitting-at-computer-home-office-1024x684.webp" 
                alt="Lab Interface" 
                className="rounded-[2.5rem] shadow-inner"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white border-y border-slate-200 relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: 'Active Students', value: '50K+' },
              { label: 'Virtual Labs', value: '1.2K' },
              { label: 'Institutions', value: '450+' },
              { label: 'Uptime', value: '99.9%' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">{stat.value}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic mb-4">Powerful Features</h2>
            <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Everything you need for a complete virtual lab experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Cloud IDE', desc: 'Full-featured code editor with multi-language support and real-time execution.', icon: Code2, color: 'indigo' },
              { title: '3D Visualization', desc: 'Interactive 3D models to examine hardware and lab setups in detail.', icon: Cpu, color: 'purple' },
              { title: 'Live Monitoring', desc: 'Instructors can monitor student progress and code in real-time.', icon: Zap, color: 'amber' },
              { title: 'Secure Access', desc: 'Role-based access control and secure environment for every student.', icon: Shield, color: 'emerald' },
              { title: 'Global Reach', desc: 'Access your labs from anywhere in the world, on any device.', icon: Globe, color: 'blue' },
              { title: 'Collaboration', desc: 'Built-in tools for student-teacher interaction and peer review.', icon: Users, color: 'rose' },
            ].map((feature, i) => (
              <Card key={i} className="group hover:scale-[1.02] transition-transform">
                <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-50 flex items-center justify-center text-${feature.color}-600 mb-6 border border-${feature.color}-100 group-hover:bg-${feature.color}-600 group-hover:text-white transition-all duration-500`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase italic">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-6xl font-black tracking-tighter uppercase italic mb-12">How it <span className="text-indigo-500">Works</span></h2>
              <div className="space-y-12">
                {[
                  { step: '01', title: 'Register Account', desc: 'Sign up as a student or instructor using your institutional credentials.' },
                  { step: '02', title: 'Select Lab', desc: 'Browse through available labs and initialize your personal instance.' },
                  { step: '03', title: 'Practice & Learn', desc: 'Use the Cloud IDE and 3D models to complete your assignments.' },
                  { step: '04', title: 'Get Certified', desc: 'Submit your work for review and track your progress in real-time.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 group">
                    <span className="text-4xl font-black text-indigo-500/30 group-hover:text-indigo-500 transition-colors italic">{item.step}</span>
                    <div>
                      <h4 className="text-2xl font-black tracking-tight uppercase italic mb-2">{item.title}</h4>
                      <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-indigo-600/20 blur-[120px] absolute inset-0 rounded-full" />
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[3rem]">
                <div className="flex items-center gap-4 mb-8">
                  <Terminal size={24} className="text-indigo-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Terminal</span>
                </div>
                <div className="space-y-4 font-mono text-sm text-indigo-300">
                  <p className="flex gap-4"><span className="text-slate-600">01</span> $ initialize virtual-lab --env production</p>
                  <p className="flex gap-4"><span className="text-slate-600">02</span> [SYSTEM] Mounting cloud resources...</p>
                  <p className="flex gap-4"><span className="text-slate-600">03</span> [SYSTEM] Allocating 4GB RAM / 2 vCPUs</p>
                  <p className="flex gap-4"><span className="text-slate-600">04</span> [SYSTEM] IDE instance ready at port 3000</p>
                  <p className="flex gap-4 animate-pulse"><span className="text-slate-600">05</span> $ start-practice --session-id 8829</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-8">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[4rem] p-16 text-center text-white shadow-2xl shadow-indigo-500/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -mr-48 -mt-48 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10">
              <h2 className="text-6xl font-black tracking-tighter uppercase italic mb-8">Ready to Start?</h2>
              <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto font-medium">Join thousands of students and instructors already using VirtualLab for their daily practice.</p>
              <div className="flex flex-wrap justify-center gap-6">
                <Button className="bg-white text-indigo-600 hover:bg-indigo-50 px-12 py-6 text-sm" onClick={() => onSetView('register')}>Create Free Account</Button>
                <Button variant="secondary" className="bg-transparent border-white text-white hover:bg-white/10 px-12 py-6 text-sm" onClick={() => onSetView('login')}>Contact Sales</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer className="bg-white border-t border-slate-200 py-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-2 bg-indigo-600 rounded-2xl text-white">
                <FlaskConical size={24} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic">Virtual<span className="text-indigo-600">Lab</span></span>
            </div>
            <p className="text-slate-500 max-w-sm leading-relaxed font-medium">
              Empowering the next generation of engineers with high-performance virtual laboratory environments.
            </p>
          </div>
          <div>
            <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6">Platform</h5>
            <ul className="space-y-4 text-sm font-bold text-slate-500 uppercase tracking-tight">
              <li><button className="hover:text-indigo-600 transition-colors">Virtual Labs</button></li>
              <li><button className="hover:text-indigo-600 transition-colors">Cloud IDE</button></li>
              <li><button className="hover:text-indigo-600 transition-colors">Monitoring</button></li>
              <li><button className="hover:text-indigo-600 transition-colors">Assessment</button></li>
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6">Company</h5>
            <ul className="space-y-4 text-sm font-bold text-slate-500 uppercase tracking-tight">
              <li><button className="hover:text-indigo-600 transition-colors">About Us</button></li>
              <li><button className="hover:text-indigo-600 transition-colors">Careers</button></li>
              <li><button className="hover:text-indigo-600 transition-colors">Privacy Policy</button></li>
              <li><button className="hover:text-indigo-600 transition-colors">Terms of Service</button></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2026 VirtualLab. All rights reserved.</p>
          <div className="flex gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <button className="hover:text-indigo-600 transition-colors">Twitter</button>
            <button className="hover:text-indigo-600 transition-colors">LinkedIn</button>
            <button className="hover:text-indigo-600 transition-colors">GitHub</button>
          </div>
        </div>
      </div>
    </footer>
  </div>
);
