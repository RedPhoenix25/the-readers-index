import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, ArrowRight, Library, Sparkles, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { API_BASE } from '../../services/api';
import toast from 'react-hot-toast';
import './ResetPassword.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        toast.success('Password reset successfully!');
      } else {
        toast.error(data.error || 'Failed to reset password');
      }
    } catch (err) {
      toast.error('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // No token provided
  if (!token) {
    return (
      <div className="auth-wrapper">
        <div className="auth-container glass-card animate-fade-in-up">
          <div className="auth-header">
            <Library size={40} className="auth-icon" />
            <h1>Invalid Link</h1>
            <p>This password reset link is invalid or has expired.</p>
          </div>
          <Link to="/login" className="btn btn-primary w-100" style={{ textDecoration: 'none', textAlign: 'center' }}>
            Back to Sign In <ArrowRight size={18} />
          </Link>
        </div>
        <div className="auth-bg-ornament top-right"><Sparkles size={120} /></div>
        <div className="auth-bg-ornament bottom-left"><Library size={120} /></div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="auth-wrapper">
        <div className="auth-container glass-card animate-fade-in-up">
          <div className="auth-header">
            <div className="reset-success-icon">
              <CheckCircle2 size={48} />
            </div>
            <h1>Password Reset!</h1>
            <p>Your password has been updated successfully. You can now sign in with your new password.</p>
          </div>
          <Link to="/login" className="btn btn-primary w-100" style={{ textDecoration: 'none', textAlign: 'center' }}>
            Sign In <ArrowRight size={18} />
          </Link>
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
          <h1>New Password</h1>
          <p>Choose a strong new password for your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label><Lock size={14} /> New Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                autoFocus
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

          <div className="form-group">
            <label><Lock size={14} /> Confirm Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login" style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>
            Back to Sign In
          </Link>
        </div>
      </div>
      
      <div className="auth-bg-ornament top-right"><Sparkles size={120} /></div>
      <div className="auth-bg-ornament bottom-left"><Library size={120} /></div>
    </div>
  );
}
