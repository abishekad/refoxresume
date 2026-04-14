import React from 'react';
import './GoogleLogin.css';
import { supabase } from '../../services/supabase';

const GoogleLogin = () => {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/templates'
      }
    });
    
    if (error) console.error('Error logging in:', error.message);
  };

  return (
    <div className="auth-overlay glass">
      <div className="auth-modal glass">
        <h2>RefoxAI – Secure Login</h2>
        <p>Login with Google to start building your FAANG-optimized resume.</p>
        
        <button className="btn-google-login" onClick={handleLogin}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="G" />
          Continue with Google
        </button>
        
        <p className="auth-footer">By continuing, you agree to our Terms of Service.</p>
      </div>
    </div>
  );
};

export default GoogleLogin;
