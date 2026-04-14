import React from 'react';
import './Checkout.css';
import { CreditCard, ShieldCheck, Zap } from 'lucide-react';

const Checkout = () => {
  return (
    <div className="checkout-page">
      <div className="checkout-container glass">
        <h1 className="checkout-title">RefoxAI – Secure Checkout <br/> <span className="text-refox-green">(₹29 only)</span></h1>
        <p className="checkout-subtitle">Your career deserves a premium start. Unlock your professional future in seconds.</p>
        
        <div className="checkout-summary glass">
          <div className="summary-item">
            <div className="summary-info">
              <h3>Your Google Template Resume</h3>
              <p>Optimized for FAANG & Tech</p>
            </div>
            <div className="summary-price">
              <div className="price">₹29</div>
              <span className="price-tag">ONE-TIME. NO SUBSCRIPTION.</span>
            </div>
          </div>
          <div className="ats-check text-refox-green">
             <Zap size={14} /> ATS READY EXPORT
          </div>
        </div>

        <div className="payment-options">
           <button className="btn-pay-google">
             <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_Pay_Logo.svg" alt="GPay" style={{height: '24px'}} />
             Continue with Google Pay
           </button>
           
           <div className="divider">OR PAY WITH UPI / CARDS</div>
           
           <div className="methods-grid">
              <div className="method card glass">
                 <CreditCard size={20} />
                 <span>UPI / WALLETS</span>
              </div>
              <div className="method card glass">
                 <CreditCard size={20} />
                 <span>CREDIT / DEBIT</span>
              </div>
           </div>
           
           <button className="btn-pay-now neon-glow">
             Pay Now →
           </button>
           
           <p className="secure-text">100% secure. Instant download after payment.</p>
        </div>

        <div className="security-badges">
          <div className="badge">
            <ShieldCheck size={18} className="text-refox-green" />
            <span>Bank-Grade Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
