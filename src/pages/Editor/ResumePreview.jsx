import React from 'react';
import './ResumePreview.css';

const ResumePreview = ({ data }) => {
  const { personal, experience, education, skills } = data;

  return (
    <div className="resume-sheet">
      <header className="resume-header">
        <h1>{personal.fullName || 'ARJUN VARDHAN'}</h1>
        <p className="contact-info">
          {personal.email} | {personal.phone} | {personal.location}
        </p>
      </header>

      <section className="resume-section">
        <h2 className="section-title">PROFESSIONAL SUMMARY</h2>
        <p className="summary-text">{personal.summary}</p>
      </section>

      <section className="resume-section">
        <h2 className="section-title">EXPERIENCE</h2>
        {experience.map((exp, idx) => (
          <div key={idx} className="experience-block">
            <div className="block-header">
              <span className="role">{exp.role}</span>
              <span className="period">{exp.period}</span>
            </div>
            <div className="company">{exp.company}</div>
            <ul className="bullet-points">
              {exp.description.split('. ').map((point, i) => (
                point && <li key={i}>{point.trim()}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="resume-section">
        <h2 className="section-title">EDUCATION</h2>
        {education.map((edu, idx) => (
          <div key={idx} className="education-block">
             <div className="block-header">
                <span className="degree">{edu.degree}</span>
                <span className="year">{edu.year}</span>
             </div>
             <div className="school">{edu.school}</div>
          </div>
        ))}
      </section>

      <section className="resume-section">
        <h2 className="section-title">SKILLS</h2>
        <p className="skills-list">{skills.join(', ')}</p>
      </section>
      
      <div className="watermark">REFOX AI</div>
    </div>
  );
};

export default ResumePreview;
