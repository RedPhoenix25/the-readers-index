import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Trash2, Camera, LogOut, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { uploadAvatar } from '../../services/api';
import './Settings.css';

export default function Settings() {
  const { user, token, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // States
  const [activeTab, setActiveTab] = useState('profile');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form States
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setErrorMsg('');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const showError = (msg) => {
    setErrorMsg(msg);
    setSuccessMsg('');
    setTimeout(() => setErrorMsg(''), 4000);
  };

  // Avatar Handlers
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const res = await uploadAvatar(file, token);
      if (res.avatar) {
        updateUser({ avatar: res.avatar });
        showSuccess('Avatar updated successfully');
      }
    } catch (err) {
      showError('Failed to upload avatar.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const res = await fetch('/api/users/avatar', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        updateUser({ avatar: null });
        showSuccess('Avatar removed');
      } else {
        throw new Error('Failed');
      }
    } catch (err) {
      showError('Failed to remove avatar.');
    }
  };

  // Profile Form Handler
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, email })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');
      
      updateUser({ username: data.username, email: data.email });
      showSuccess('Profile updated successfully');
    } catch (err) {
      showError(err.message);
    }
  };

  // Password Form Handler
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    try {
      const res = await fetch('/api/users/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');

      setCurrentPassword('');
      setNewPassword('');
      showSuccess('Password updated successfully');
    } catch (err) {
      showError(err.message);
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you absolutely sure you want to delete your account? This will permanently erase your archive and community thoughts.')) return;
    if (!window.confirm('Final warning: This action cannot be undone.')) return;

    try {
      const res = await fetch('/api/users/account', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        logout();
        navigate('/');
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div className="page-wrapper settings-page">
      <header className="settings-header">
        <div className="container">
          <span className="section-label">Account Preferences</span>
          <h1>Settings</h1>
          <p>Manage your literary sanctuary profile and security.</p>
        </div>
      </header>

      <section className="section">
        <div className="container settings-container">
          <div className="settings-nav-header">
            <button className="settings-back-btn" onClick={() => navigate('/my-shelf')}>
              <ArrowLeft size={18} /> Back to Archive
            </button>
          </div>
          
          <aside className="settings-sidebar animate-fade-in-up">
            <nav className="settings-nav">
              <button 
                className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={18} /> Profile
              </button>
              <button 
                className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <Lock size={18} /> Security
              </button>
              <button 
                className={`settings-tab danger-tab ${activeTab === 'danger' ? 'active' : ''}`}
                onClick={() => setActiveTab('danger')}
              >
                <Trash2 size={18} /> Danger Zone
              </button>
            </nav>
          </aside>

          <main className="settings-content glass-card animate-scale-in">
            {successMsg && (
              <div className="settings-alert success">
                <CheckCircle2 size={16} /> {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="settings-alert error">
                 {errorMsg}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="settings-panel">
                <h2>Public Profile</h2>
                <div className="settings-avatar-section">
                  <div className="settings-avatar-wrapper">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="settings-avatar" />
                    ) : (
                      <div className="settings-avatar-placeholder">
                        <User size={40} />
                      </div>
                    )}
                    <button 
                      className="settings-avatar-edit-btn"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingAvatar}
                    >
                      <Camera size={14} />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleAvatarUpload} 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                    />
                  </div>
                  <div className="settings-avatar-actions">
                    <h3>Profile Picture</h3>
                    <p>PNG, JPG, or GIF up to 5MB.</p>
                    {user?.avatar && (
                      <button className="btn-text btn-text-danger" onClick={handleRemoveAvatar}>
                        Remove Picture
                      </button>
                    )}
                  </div>
                </div>

                <form className="settings-form" onSubmit={handleUpdateProfile}>
                  <div className="form-group">
                    <label>Username</label>
                    <input 
                      type="text" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </form>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="settings-panel">
                <h2>Security & Password</h2>
                <p className="settings-desc">Ensure your account is using a long, random password to stay secure.</p>
                
                <form className="settings-form" onSubmit={handleUpdatePassword}>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input 
                      type="password" 
                      value={currentPassword} 
                      onChange={(e) => setCurrentPassword(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input 
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      required 
                      minLength="6"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Update Password</button>
                </form>

                <div className="settings-divider"></div>
                
                <div className="settings-logout">
                  <h3>Log Out</h3>
                  <p>Log out of your account on this device.</p>
                  <button className="btn btn-outline" onClick={logout}>
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              </div>
            )}

            {/* DANGER TAB */}
            {activeTab === 'danger' && (
              <div className="settings-panel">
                <h2 className="danger-text">Danger Zone</h2>
                <p className="settings-desc">Once you delete your account, there is no going back. Please be certain.</p>
                
                <div className="danger-box">
                  <div className="danger-box-info">
                    <h3>Delete Account</h3>
                    <p>Permanently remove your personal archive, reading lists, and community comments.</p>
                  </div>
                  <button className="btn btn-danger" onClick={handleDeleteAccount}>
                    Delete Account
                  </button>
                </div>
              </div>
            )}

          </main>
        </div>
      </section>
    </div>
  );
}
