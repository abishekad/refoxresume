import React, { useState } from 'react';
import './Editor.css';
import ResumePreview from './ResumePreview';
import { User, Briefcase, GraduationCap, Code, Sparkles, Layout, ChevronRight, ChevronLeft } from 'lucide-react';

const Editor = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    personal: {
      fullName: 'Arjun Vardhan',
      email: 'arjun.v@example.com',
      phone: '+91 98765 43210',
      location: 'Bengaluru, India',
      summary: 'Strategic designer with 5+ years of experience in creating scalable design systems for FAANG-level products.'
    },
    experience: [
      {
        role: 'Senior Product Designer',
        company: 'TECHNOVA SOLUTIONS',
        period: '2021 – Present',
        description: 'Led the redesign of the core dashboard, reducing task completion time by 40%. Managed a cross-functional team of 12 designers.'
      }
    ],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        school: 'IIT Madras',
        year: '2019'
      }
    ],
    skills: ['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'Figma', 'System Design']
  });

  const updatePersonalInfo = (field, value) => {
    setFormData({
      ...formData,
      personal: { ...formData.personal, [field]: value }
    });
  };

  return (
    <div className="editor-page">
      <div className="editor-layout">
        {/* Sidebar Navigation */}
        <aside className="editor-sidebar glass">
          <div className="sidebar-nav">
            <NavItem icon={<User size={18}/>} label="Personal" active={activeStep === 1} onClick={() => setActiveStep(1)} />
            <NavItem icon={<Briefcase size={18}/>} label="Experience" active={activeStep === 2} onClick={() => setActiveStep(2)} />
            <NavItem icon={<GraduationCap size={18}/>} label="Education" active={activeStep === 3} onClick={() => setActiveStep(3)} />
            <NavItem icon={<Code size={18}/>} label="Skills" active={activeStep === 4} onClick={() => setActiveStep(4)} />
          </div>
          
          <div className="sidebar-footer">
            <div className="ats-score-mini glass">
              <span className="label">ATS SCORE</span>
              <span className="score text-refox-green">95/100</span>
            </div>
            <button className="btn-optimize neon-glow">
              <Sparkles size={16} /> Optimize ATS
            </button>
          </div>
        </aside>

        {/* Form Area */}
        <main className="editor-main">
          <div className="form-container glass">
            <div className="form-header">
              <h2>Edit Your <span className="text-refox-green">Google Template</span> Resume</h2>
              <p className="status-indicator"><span className="dot animate-pulse"></span> AI-POWERED OPTIMIZATION ACTIVE</p>
            </div>

            {/* Dynamic Step Content */}
            {activeStep === 1 && (
              <div className="form-step">
                <div className="input-group">
                  <label>FULL NAME</label>
                  <input 
                    type="text" 
                    value={formData.personal.fullName} 
                    onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  />
                </div>
                <div className="grid-2">
                  <div className="input-group">
                    <label>EMAIL</label>
                    <input type="email" value={formData.personal.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label>PHONE</label>
                    <input type="text" value={formData.personal.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
                  </div>
                </div>
                <div className="input-group">
                  <label>PROFESSIONAL SUMMARY</label>
                  <textarea rows="4" value={formData.personal.summary} onChange={(e) => updatePersonalInfo('summary', e.target.value)} />
                  <button className="btn-ai-gen">
                    <Sparkles size={14} /> AI GENERATOR
                  </button>
                </div>
              </div>
            )}
            
            {activeStep === 2 && (
              <div className="form-step">
                <h3>Experience <button className="btn-add">+ ADD JOB</button></h3>
                {formData.experience.map((exp, idx) => (
                  <div key={idx} className="experience-item glass">
                    <input className="input-transparent h3" value={exp.role} />
                    <div className="grid-2">
                       <input className="input-transparent" value={exp.company} />
                       <input className="input-transparent" value={exp.period} />
                    </div>
                    <textarea className="input-transparent" rows="3" value={exp.description} />
                    <button className="btn-ai-gen mini">
                      <Sparkles size={12} /> IMPROVE WITH AI
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="form-footer">
              <button className="btn-secondary" onClick={() => setActiveStep(s => Math.max(1, s-1))}>
                <ChevronLeft size={18} /> BACK
              </button>
              <button className="btn-primary" onClick={() => setActiveStep(s => Math.min(4, s+1))}>
                NEXT <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </main>

        {/* Live Preview Area */}
        <section className="editor-preview">
          <div className="preview-toolbar glass">
            <div className="zoom-controls">
              <Layout size={16} /> <span>100% (A4)</span>
            </div>
            <button className="btn-download-now">
              Download Resume (₹29)
            </button>
          </div>
          <div className="preview-canvas">
            <ResumePreview data={formData} />
          </div>
        </section>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
    <div className="nav-icon">{icon}</div>
    <span>{label}</span>
  </div>
);

export default Editor;
