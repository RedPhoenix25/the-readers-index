import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Trash2, Camera, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { uploadAvatar, API_BASE } from '../../services/api';
import toast from 'react-hot-toast';
import './Settings.css';

export default function Settings() {
  const { user, token, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // States
  const [activeTab, setActiveTab] = useState('profile');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Form States
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  // Avatar Handlers
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const res = await uploadAvatar(file, token);
      if (res.avatar) {
        updateUser({ avatar: res.avatar });
        toast.success('Avatar updated successfully');
      }
    } catch (err) {
      toast.error('Failed to upload avatar.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const res = await fetch(`${API_BASE}/users/avatar`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        updateUser({ avatar: null });
        toast.success('Avatar removed');
      } else {
        throw new Error('Failed');
      }
    } catch (err) {
      toast.error('Failed to remove avatar.');
    }
  };

  // Profile Form Handler
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/users/profile`, {
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
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Password Form Handler
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    try {
      const res = await fetch(`${API_BASE}/users/password`, {
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
      toast.success('Password updated successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ margin: 0, fontWeight: 600 }}>Delete your account?</p>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>This will permanently erase your archive and thoughts.</p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button 
            className="btn-sm" 
            style={{ background: 'var(--accent-rose)', color: 'white', border: 'none' }}
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await fetch(`${API_BASE}/users/account`, {
                  method: 'DELETE',
                  headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                  logout();
                  navigate('/');
                  toast.success('Account deleted');
                } else {
                  throw new Error('Failed to delete account');
                }
              } catch (err) {
                toast.error(err.message);
              }
            }}
          >
            Yes, Delete
          </button>
          <button className="btn-sm btn-ghost" onClick={() => toast.dismiss(t.id)}>Cancel</button>
        </div>
      </div>
    ), { duration: 5000, position: 'top-center' });
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
