import React from 'react';
import './Home.css';
import { MousePointer2, Zap, Trophy, CreditCard } from 'lucide-react';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🔥</span>
            <span>Used by 15,000+ candidates</span>
          </div>
          
          <h1 className="hero-title">
            Build a <span className="text-refox-green">Google-selected</span> resume in 10 minutes.
          </h1>
          
          <p className="hero-subtitle">
            5 real resumes that got offers at Google and other top MNCs – now turned into templates for you.
          </p>

          <ul className="hero-features">
            <li><Zap size={16} className="text-refox-green" /> ATS-optimized to bypass robots.</li>
            <li><Trophy size={16} className="text-refox-green" /> FAANG-ready formatting.</li>
            <li><CreditCard size={16} className="text-refox-green" /> ₹29 single download fee.</li>
          </ul>

          <div className="hero-actions">
            <button className="btn-primary animate-pulse">
              Get Started – Free Email Download
            </button>
            <p className="hero-caption">No credit card required to start</p>
          </div>
        </div>

        <div className="hero-preview">
          <div className="preview-card glass">
            <div className="preview-header"></div>
            <div className="preview-body">
              {[80, 65, 90, 75].map((width, i) => (
                <div key={i} className="skeleton-line" style={{ width: `${width}%` }}></div>
              ))}
            </div>
            <div className="preview-indicator neon-glow">
              <MousePointer2 size={20} className="text-refox-green" />
              <span>Arjun Applied at Google</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="trust-badges">
        <span>OPTIMIZED FOR ATS</span>
        <span>ATS PASS 100%</span>
        <span>DESIGNED FOR GOOGLE STYLE</span>
      </div>
      
      {/* Cards Section */}
      <section className="features-grid">
         <h2 className="section-title">Why RefoxAI works for <span className="text-refox-green">FAANG & Top MNCs</span></h2>
         <div className="grid">
            <FeatureCard 
              icon={<Zap className="text-refox-green" />} 
              title="Resumes that get into Google" 
              desc="We reverse-engineered the formatting and keyword density of successful profiles from Google, Meta, and Netflix."
            />
            <FeatureCard 
              icon={<Trophy className="text-refox-green" />} 
              title="ATS first, design second" 
              desc="Recruiters focus on clarity first. We focus on power-friendly structures that ensure your data gets past the robots."
            />
            <FeatureCard 
              icon={<CreditCard className="text-refox-green" />} 
              title="Built for Indian tech talent" 
              desc="Optimized for Indian recruitment norms and specific MNC requirements common in Bengaluru, Hyderabad, and Pune."
            />
         </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="glass feature-card">
    <div className="card-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </div>
);

export default Home;
