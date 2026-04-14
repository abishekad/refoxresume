import React from 'react';
import './Templates.css';
import resumeTemplates from '../../data/templateRegistry';

const REVIEWS = [
  { id: 1, name: "Rahul S.", text: "I used this template and got shortlisted at Google! For just $29, it's very worth for money.", rating: 5, company: "Google" },
  { id: 2, name: "Priya K.", text: "Best resume buddy ever. Clean, professional, and highly affordable.", rating: 5, company: "Amazon" },
  { id: 3, name: "Arjun M.", text: "Only $29? I can't believe the quality. I finally got an interview call from Amazon.", rating: 5, company: "Amazon" },
  { id: 4, name: "Sneha R.", text: "ATS score went from 60 to 98 immediately. Definitely worth every penny.", rating: 5, company: "Microsoft" },
  { id: 5, name: "David L.", text: "I was struggling for months. Switched to RefoxAI and got hired in 2 weeks. Best investment!", rating: 5, company: "Meta" },
  { id: 6, name: "Anjali T.", text: "Shortlisted at Meta with the Meta SWE template. Affordable and best resume buddy!", rating: 5, company: "Meta" },
  { id: 7, name: "Kevin P.", text: "Very worth for money. The $29 price is a steal for this level of quality.", rating: 5, company: "Netflix" },
  { id: 8, name: "Sarah J.", text: "Impressive designs. My recruiter specifically mentioned how clean my resume looked.", rating: 5, company: "Apple" },
  { id: 9, name: "Vikram B.", text: "Affordable best resume buddy. Highly recommended for FAANG aspirants.", rating: 5, company: "Tesla" },
  { id: 10, name: "Megha G.", text: "The best $29 I've spent this year. Shortlisted at 3 companies already!", rating: 5, company: "Adobe" },
];

const Templates = ({ setPage, onSelectTemplate }) => {
  const handleSelect = (template) => {
    if (onSelectTemplate) onSelectTemplate(template);
    if (setPage) setPage('editor');
  };

  return (
    <div className="templates-page">
      {/* HEADER */}
      <div className="templates-header">
        <div className="header-badge">✦ ATS-Optimized · FAANG-Ready · Recruiter Approved</div>
        <h1>Pick Your <span className="text-refox-green">FAANG Template</span></h1>
        <p>
          5 templates built from <span className="text-refox-green">real offer letters</span> at top MNCs.
          Every template scored 95–99 on ATS scanners.
        </p>
      </div>

      {/* GRID */}
      <div className="templates-grid">
        {resumeTemplates.map((template) => (
          <div key={template.id} className="template-card" onClick={() => handleSelect(template)}>

            {/* PREVIEW AREA */}
            <div className="template-preview">
              <div
                className="template-type-badge"
                style={{ borderColor: template.color === '#FFFFFF' || template.color === '#2c5f2e' ? '#00E396' : template.color,
                         color:       template.color === '#FFFFFF' || template.color === '#2c5f2e' ? '#00E396' : template.color }}
              >
                {template.type}
              </div>

              {template.preview ? (
                <img
                  src={template.preview}
                  alt={`${template.name} resume preview`}
                  className="template-preview-img"
                />
              ) : (
                <div className="resume-skeleton">
                  <div className="skeleton-name" />
                  <div className="skeleton-line w80" />
                  <div className="skeleton-divider" />
                  <div className="skeleton-line w60" />
                  <div className="skeleton-line w90" />
                  <div className="skeleton-line w70" />
                  <div className="skeleton-divider" />
                  <div className="skeleton-line w80" />
                  <div className="skeleton-line w50" />
                  <div className="skeleton-line w75" />
                </div>
              )}

              {/* ATS SCORE OVERLAY */}
              <div className="ats-score-chip">
                <span className="ats-score-num">{template.score}</span>
                <span className="ats-score-label">/100 ATS</span>
              </div>
            </div>

            {/* INFO FOOTER */}
            <div className="template-info">
              <div className="template-info-top">
                <div>
                  <h3 className="template-name">{template.name}</h3>
                  <p className="template-tag">{template.tag}</p>
                  {template.sub && <p className="template-sub">{template.sub}</p>}
                </div>
              </div>
              <button className="btn-select" onClick={(e) => { e.stopPropagation(); handleSelect(template); }}>
                Use This Template →
              </button>
            </div>

          </div>
        ))}
      </div>

      <div className="stats-bar-container">
        <div className="footer-stats">
          <div className="stat-item">
            <span className="stat-num">50K+</span>
            <span className="stat-label">Resumes Built</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num">98%</span>
            <span className="stat-label">ATS Pass Rate</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-num">5</span>
            <span className="stat-label">FAANG Templates</span>
          </div>
        </div>
        
        <button className="btn-next neon-glow" onClick={() => setPage('editor')}>
          Next: Edit Resume →
        </button>
      </div>

      {/* REVIEWS SECTION */}
      <div className="reviews-section">
        <div className="reviews-header">
          <h2>Success Stories from <span className="text-refox-green">Our Candidates</span></h2>
        </div>
        <div className="marquee-container">
          <div className="marquee-track">
            {[...REVIEWS, ...REVIEWS].map((review, idx) => (
              <div key={`${review.id}-${idx}`} className="review-card blur-glass">
                <div className="review-stars">{"★".repeat(review.rating)}</div>
                <p className="review-text">"{review.text}"</p>
                <div className="review-footer">
                  <span className="review-name">— {review.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="templates-footer">
        <p className="footer-tagline">JOIN 50,000+ CANDIDATES WHO SECURED INTERVIEWS AT TOP TECH FIRMS</p>
      </div>
    </div>
  );
};

export default Templates;
