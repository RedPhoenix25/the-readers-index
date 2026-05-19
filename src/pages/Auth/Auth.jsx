import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Library, Sparkles, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../services/api';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Auth({ type = 'login' }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = type === 'login' ? `${API_BASE}/auth/login` : `${API_BASE}/auth/register`;
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user, data.token);
        toast.success(type === 'login' ? `Welcome back, ${data.user.username}!` : 'Account created successfully!');
        navigate('/bookshelf');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!forgotEmail.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });

      const data = await res.json();

      if (res.ok) {
        setForgotSent(true);
        toast.success('Reset link sent! Check your inbox.');
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch (err) {
      toast.error('Connection failed. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Forgot password view
  if (forgotMode) {
    return (
      <div className="auth-wrapper">
        <div className="auth-container glass-card animate-fade-in-up">
          <div className="auth-header">
            <Library size={40} className="auth-icon" />
            <h1>{forgotSent ? 'Check Your Email' : 'Reset Password'}</h1>
            <p>
              {forgotSent
                ? 'We\'ve sent a password reset link to your email address.'
                : 'Enter the email address associated with your account.'}
            </p>
          </div>

          {!forgotSent ? (
            <form onSubmit={handleForgotPassword} className="auth-form" noValidate>
              <div className="form-group">
                <label><Mail size={14} /> Email Address</label>
                <input 
                  type="email" 
                  placeholder="reader@example.com"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  autoFocus
                />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={forgotLoading}>
                {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                {!forgotLoading && <ArrowRight size={18} />}
              </button>
            </form>
          ) : (
            <div className="forgot-success animate-fade-in-up">
              <div className="forgot-success__icon">
                <Mail size={48} />
              </div>
              <p>Didn't receive the email? Check your spam folder or try again.</p>
              <button 
                className="btn btn-secondary w-100"
                onClick={() => { setForgotSent(false); setForgotEmail(''); }}
              >
                Try Again
              </button>
            </div>
          )}

          <div className="auth-footer">
            <button 
              className="auth-back-link"
              onClick={() => { setForgotMode(false); setForgotSent(false); setForgotEmail(''); }}
            >
              <ArrowLeft size={14} /> Back to Sign In
            </button>
          </div>
        </div>
        
        <div className="auth-bg-ornament top-right"><Sparkles size={120} /></div>
        <div className="auth-bg-ornament bottom-left"><Library size={120} /></div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-container glass-card animate-fade-in-up">
        <div className="auth-header">
          <Library size={40} className="auth-icon" />
          <h1>{type === 'login' ? "Welcome Back" : "Join the Readership"}</h1>
          <p>
            {type === 'login' 
              ? "Sign in to manage your personal bookshelf and reading goals." 
              : "Create an account to start curating your own collection."}
          </p>
        </div>

        {error && <div className="auth-error animate-shake">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {type === 'register' && (
            <div className="form-group">
              <label><User size={14} /> Username</label>
              <input 
                type="text" 
                placeholder="LibrarianAtHeart"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                required 
              />
            </div>
          )}

          <div className="form-group">
            <label><Mail size={14} /> Email Address</label>
            <input 
              type="email" 
              placeholder="reader@example.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>

          <div className="form-group">
            <label><Lock size={14} /> Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                required 
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {type === 'login' && (
            <button 
              type="button" 
              className="forgot-password-link"
              onClick={() => setForgotMode(true)}
            >
              Forgot your password?
            </button>
          )}

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Processing..." : (type === 'login' ? "Sign In" : "Create Account")}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-footer">
          {type === 'login' ? (
            <p>Don't have an account? <Link to="/register">Create one</Link></p>
          ) : (
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          )}
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="auth-bg-ornament top-right"><Sparkles size={120} /></div>
      <div className="auth-bg-ornament bottom-left"><Library size={120} /></div>
    </div>
  );
}
