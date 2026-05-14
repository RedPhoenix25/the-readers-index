import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Library, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export default function Auth({ type = 'login' }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user, data.token);
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
            <input 
              type="password" 
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>

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
