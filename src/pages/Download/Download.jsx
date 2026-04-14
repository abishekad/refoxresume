import React from 'react';
import './Download.css';
import { CheckCircle, Download as DownloadIcon, Share2, Plus } from 'lucide-react';

const Download = () => {
  return (
    <div className="download-page">
      <div className="success-container glass">
        <div className="success-icon neon-glow">
          <CheckCircle size={48} className="text-refox-green" />
        </div>
        
        <h1 className="success-title">
          Resume Downloaded! <br/> 
          <span className="text-refox-green">You're FAANG-Ready.</span>
        </h1>
        
        <p className="success-subtitle">
          Your ATS-optimized resume is ready. <br/> 
          Good luck with <span className="text-refox-green">Google & top MNCs!</span>
        </p>
        
        <div className="action-buttons">
          <button className="btn-new-resume neon-glow">
            <Plus size={20} /> Build New Resume
          </button>
          
          <div className="secondary-actions">
            <button className="btn-secondary">
              <DownloadIcon size={18} /> Download Again <br/> <span className="price-tag">₹29 ONLY</span>
            </button>
            <button className="btn-secondary">
              <Share2 size={18} /> SHARE SUCCESS
            </button>
          </div>
        </div>

        <div className="success-footer">
          <span>GOOGLE READY</span>
          <span>META OPTIMIZED</span>
          <span>AWS COMPATIBLE</span>
        </div>
      </div>
    </div>
  );
};

export default Download;
