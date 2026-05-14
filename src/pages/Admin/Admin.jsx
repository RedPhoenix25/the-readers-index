import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookPlus, 
  Settings, 
  LogOut, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Plus, 
  ExternalLink,
  Users,
  Library,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader,
  Sparkles,
  Star,
  Upload,
  Mail,
  Download
} from 'lucide-react';
import { 
  fetchBooks, 
  fetchCurrentlyReading, 
  addBook, 
  updateBook, 
  deleteBook, 
  updateCurrentlyReading,
  fetchLists,
  addList,
  updateList,
  deleteList,
  fetchListBooks,
  updateListBooks,
  fetchSubscribers,
  deleteSubscriber,
  fetchUsers,
  deleteUser,
  uploadImage
} from '../../services/api';
import './Admin.css';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('books'); // 'books' | 'reading' | 'subscribers'
  
  // Data State
  const [books, setBooks] = useState([]);
  const [curatedLists, setCuratedLists] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [users, setUsers] = useState([]);
  const [readingStatus, setReadingStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    cover: '',
    rating: 5,
    genre: '',
    mood: '',
    review: '',
    quote: '',
    pages: 300,
    year: new Date().getFullYear(),
    featured: false
  });

  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [listFormData, setListFormData] = useState({
    title: '',
    description: '',
    icon: 'Sparkles',
    gradient: 'linear-gradient(135deg, #C9A84C22, #D4956A22)',
    selectedBookIds: []
  });

  const [readingForm, setReadingForm] = useState({
    title: '',
    author: '',
    cover: '',
    progress: 0,
    thoughts: ''
  });

  // Simple mock authentication
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'reader123') {
      setIsAuthenticated(true);
      loadData();
    } else {
      alert('Invalid password');
    }
  };

  const loadData = async () => {
    setLoading(true);
    
    // Fetch books
    try {
      const data = await fetchBooks({ limit: 100 });
      setBooks(data?.books || []);
    } catch (err) { console.error('Failed to load books'); }

    // Fetch lists
    try {
      const data = await fetchLists();
      setCuratedLists(data || []);
    } catch (err) { console.error('Failed to load lists'); }

    // Fetch reading status
    try {
      const data = await fetchCurrentlyReading();
      setReadingStatus(data);
      if (data) {
        setReadingForm({
          title: data.title || '',
          author: data.author || '',
          cover: data.cover || '',
          progress: data.progress || 0,
          thoughts: data.thoughts || ''
        });
      }
    } catch (err) { console.error('Failed to load reading status'); }

    // Fetch subscribers
    try {
      const data = await fetchSubscribers();
      setSubscribers(data || []);
    } catch (err) { console.error('Failed to load subscribers'); }

    // Fetch users
    try {
      const data = await fetchUsers();
      setUsers(data || []);
    } catch (err) { console.error('Failed to load users'); }

    setLoading(false);
  };
  const handleOpenModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        ...book,
        mood: Array.isArray(book.mood) ? book.mood.join(', ') : book.mood
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: '',
        author: '',
        cover: '',
        rating: 5,
        genre: '',
        mood: '',
        review: '',
        quote: '',
        pages: 300,
        year: new Date().getFullYear(),
        featured: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        mood: formData.mood.split(',').map(m => m.trim()),
        rating: parseFloat(formData.rating),
        pages: parseInt(formData.pages),
        year: parseInt(formData.year)
      };

      if (editingBook) {
        await updateBook(editingBook.id, payload);
      } else {
        await addBook(payload);
      }
      
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert('Failed to save book: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsSaving(true);
    try {
      const { url } = await uploadImage(file);
      setFormData(prev => ({ ...prev, cover: url }));
    } catch (err) {
      alert('Failed to upload image');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await deleteBook(id);
      loadData();
    } catch (err) {
      alert('Failed to delete book');
    }
  };

  const handleOpenListModal = async (list = null) => {
    if (list) {
      setEditingList(list);
      try {
        const bookIds = await fetchListBooks(list.id);
        setListFormData({ ...list, selectedBookIds: bookIds });
      } catch (err) {
        setListFormData({ ...list, selectedBookIds: [] });
      }
    } else {
      setEditingList(null);
      setListFormData({
        title: '',
        description: '',
        icon: 'Sparkles',
        gradient: 'linear-gradient(135deg, #C9A84C22, #D4956A22)',
        selectedBookIds: []
      });
    }
    setIsListModalOpen(true);
  };

  const handleSaveList = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let listId = editingList?.id;
      if (editingList) {
        await updateList(listId, listFormData);
      } else {
        const result = await addList(listFormData);
        listId = result.id;
      }
      
      // Save book associations
      await updateListBooks(listId, listFormData.selectedBookIds);
      
      setIsListModalOpen(false);
      loadData();
    } catch (err) {
      alert('Failed to save list');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSubscriber = async (id) => {
    if (!window.confirm('Remove this reader from the archives?')) return;
    try {
      await deleteSubscriber(id);
      loadData();
    } catch (err) {
      alert('Failed to remove subscriber');
    }
  };

  const handleDeleteList = async (id) => {
    if (!window.confirm('Are you sure you want to delete this curated list?')) return;
    try {
      await deleteList(id);
      loadData();
    } catch (err) {
      alert('Failed to delete list');
    }
  };

  const handleUpdateReading = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateCurrentlyReading(readingForm);
      loadData();
      alert('Reading status updated!');
    } catch (err) {
      alert('Failed to update reading status');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card glass-card animate-fade-in-up">
          <div className="admin-login-header">
            <Library size={40} className="admin-icon" />
            <h1>The Librarian's Sanctum</h1>
            <p>Provide the secret key to tend to the shelves and update the archives.</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input 
                type="password" 
                placeholder="Whisper the passphrase..." 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Enter the Sanctum</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        {/* Sidebar/Nav */}
        <div className="admin-layout">
          <aside className="admin-sidebar glass-card">
            <div className="admin-profile">
              <div className="admin-avatar">RI</div>
              <div>
                <h3>Admin</h3>
                <p>The Readers Index</p>
              </div>
            </div>
            
            <nav className="admin-nav">
              <button 
                className={`admin-nav-item ${activeTab === 'books' ? 'active' : ''}`}
                onClick={() => setActiveTab('books')}
              >
                <Library size={18} /> Master Archive
              </button>
              <button 
                className={`admin-nav-item ${activeTab === 'reading' ? 'active' : ''}`}
                onClick={() => setActiveTab('reading')}
              >
                <BookPlus size={18} /> On the Nightstand
              </button>
              <button 
                className={`admin-nav-item ${activeTab === 'lists' ? 'active' : ''}`}
                onClick={() => setActiveTab('lists')}
              >
                <Sparkles size={18} /> Themed Collections
              </button>
              <button 
                className={`admin-nav-item ${activeTab === 'subscribers' ? 'active' : ''}`}
                onClick={() => setActiveTab('subscribers')}
              >
                <Mail size={18} /> The Readership
              </button>
              <button 
                className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <Users size={18} /> Registered Users
              </button>
              <button className="admin-nav-item logout" onClick={() => setIsAuthenticated(false)}>
                <LogOut size={18} /> Logout
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="admin-main">
            {activeTab === 'books' && (
              <section className="admin-section animate-fade-in">
                <div className="admin-header">
                  <div>
                    <h2>Manage Collection</h2>
                    <p>Add, edit, or remove books from the library.</p>
                  </div>
                  <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <Plus size={18} /> Add New Book
                  </button>
                </div>

                <div className="admin-books-grid">
                  {loading ? (
                    <div className="admin-loading"><Loader className="spin" /> Loading library...</div>
                  ) : (
                    books.map(book => (
                      <div key={book.id} className="admin-book-item glass-card">
                        <img src={book.cover} alt={book.title} />
                        <div className="admin-book-details">
                          <h4>{book.title}</h4>
                          <p>{book.author}</p>
                          <div className="admin-book-meta">
                            <span>{book.genre}</span>
                            {book.featured && <span className="badge-featured">Staff Pick</span>}
                            {new Date(book.created_at) > new Date(Date.now() - 86400000) && <span className="badge-new">Recent</span>}
                          </div>
                        </div>
                        <div className="admin-book-actions">
                          <button className="btn-icon" onClick={() => handleOpenModal(book)}><Edit3 size={16} /></button>
                          <button className="btn-icon delete" onClick={() => handleDeleteBook(book.id)}><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}

            {activeTab === 'reading' && (
              <section className="admin-section animate-fade-in">
                <div className="admin-header">
                  <div>
                    <h2>Currently Reading</h2>
                    <p>Update what's on your bedside table right now.</p>
                  </div>
                </div>

                <form className="admin-form glass-card" onSubmit={handleUpdateReading}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Title</label>
                      <input 
                        value={readingForm.title}
                        onChange={e => setReadingForm({...readingForm, title: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Author</label>
                      <input 
                        value={readingForm.author}
                        onChange={e => setReadingForm({...readingForm, author: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group full">
                      <label>Cover Image URL or Upload Photo</label>
                      <div className="form-input-with-preview">
                        <input 
                          value={readingForm.cover}
                          onChange={e => setReadingForm({...readingForm, cover: e.target.value})}
                          placeholder="https://..."
                          required
                        />
                        <div className="file-upload-wrapper">
                          <input type="file" id="reading-cover-upload" accept="image/*" onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            setIsSaving(true);
                            try {
                              const { url } = await uploadImage(file);
                              setReadingForm(prev => ({ ...prev, cover: url }));
                            } catch (err) {
                              alert('Failed to upload image');
                            } finally {
                              setIsSaving(false);
                            }
                          }} />
                          <label htmlFor="reading-cover-upload" className="btn btn-secondary btn-icon-only">
                            <Upload size={16} />
                          </label>
                        </div>
                        {readingForm.cover && (
                          <div className="admin-form-preview-mini">
                            <img src={readingForm.cover} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Progress (%)</label>
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        value={readingForm.progress}
                        onChange={e => setReadingForm({...readingForm, progress: parseInt(e.target.value)})}
                        required
                      />
                    </div>
                    <div className="form-group full">
                      <label>Thoughts / Quote</label>
                      <textarea 
                        rows="4"
                        value={readingForm.thoughts}
                        onChange={e => setReadingForm({...readingForm, thoughts: e.target.value})}
                        required
                      ></textarea>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Update Reading Status'}
                    </button>
                  </div>
                </form>
              </section>
            )}

            {activeTab === 'lists' && (
              <section className="admin-section animate-fade-in">
                <div className="admin-header">
                  <div>
                    <h2>Curated Lists</h2>
                    <p>Manage the themed collections on the Recommendations page.</p>
                  </div>
                  <button className="btn btn-primary" onClick={() => handleOpenListModal()}>
                    <Plus size={18} /> Create New List
                  </button>
                </div>

                <div className="admin-books-grid">
                  {loading ? (
                    <div className="admin-loading"><Loader className="spin" /> Loading lists...</div>
                  ) : (
                    curatedLists.map(list => (
                      <div key={list.id} className="admin-book-item glass-card">
                        <div className="admin-list-icon-preview" style={{ background: list.gradient }}>
                          <Sparkles size={24} />
                        </div>
                        <div className="admin-book-details">
                          <h4>{list.title}</h4>
                          <p>{list.description}</p>
                          <div className="admin-book-meta">
                            <span>Icon: {list.icon}</span>
                          </div>
                        </div>
                        <div className="admin-book-actions">
                          <button className="btn-icon" onClick={() => handleOpenListModal(list)}><Edit3 size={16} /></button>
                          <button className="btn-icon delete" onClick={() => handleDeleteList(list.id)}><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}

            {activeTab === 'users' && (
              <section className="admin-section animate-fade-in">
                <div className="admin-content-card glass-card animate-fade-in">
                  <div className="admin-header">
                    <div>
                      <h2>Registered Users</h2>
                      <p>You have {users.length} registered members in the system.</p>
                    </div>
                  </div>

                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Joined</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="text-center" style={{ padding: '3rem', color: 'var(--text-muted)' }}>
                              No registered users yet.
                            </td>
                          </tr>
                        ) : (
                          users.map((user) => (
                            <tr key={user.id}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  <div className="reader-icon"><Users size={14} /></div>
                                  <span style={{ fontWeight: 600 }}>{user.username}</span>
                                </div>
                              </td>
                              <td>{user.email}</td>
                              <td>{new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                              <td style={{ textAlign: 'right' }}>
                                <button className="btn-icon delete" onClick={async () => {
                                  if (!window.confirm(`Are you sure you want to delete user "${user.username}"?`)) return;
                                  try {
                                    await deleteUser(user.id);
                                    setUsers(prev => prev.filter(u => u.id !== user.id));
                                  } catch (err) {
                                    alert('Failed to delete user');
                                  }
                                }}>
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'subscribers' && (
              <section className="admin-section animate-fade-in">
                <div className="admin-content-card glass-card animate-fade-in">
                  <div className="admin-header">
                    <div>
                      <h2>The Readership</h2>
                      <p>You have {subscribers.length} dedicated readers in your archive.</p>
                    </div>
                    <button className="btn btn-secondary" onClick={() => {
                      const header = "Email,Source,Joined\n";
                      const rows = subscribers.map(s => `${s.email},${s.source || 'Newsletter'},${new Date(s.created_at).toLocaleDateString()}`).join('\n');
                      const csv = header + rows;
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'readership_emails.csv';
                      a.click();
                    }}>
                      <Download size={18} /> Export List
                    </button>
                  </div>

                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Reader Email</th>
                          <th>Source</th>
                          <th>Joined the Sanctum</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscribers.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="text-center" style={{ padding: '3rem', color: 'var(--text-muted)' }}>
                              No readers have found the secret path to your archives yet.
                            </td>
                          </tr>
                        ) : (
                          subscribers.map((sub) => (
                            <tr key={sub.id}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  <div className="reader-icon"><Mail size={14} /></div>
                                  <span style={{ fontWeight: 600 }}>{sub.email}</span>
                                </div>
                              </td>
                              <td>
                                <span className={`badge ${sub.source?.toLowerCase() === 'waitlist' ? 'badge-new' : 'badge-featured'}`} style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem' }}>
                                  {sub.source || 'Newsletter'}
                                </span>
                              </td>
                              <td>{new Date(sub.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                              <td style={{ textAlign: 'right' }}>
                                <button className="btn-icon delete" onClick={() => handleDeleteSubscriber(sub.id)}>
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>

      {/* Book Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay animate-fade-in">
          <div className="admin-modal glass-card animate-scale-in">
            <div className="admin-modal-header">
              <h3>{editingBook ? 'Edit Book' : 'Add New Book'}</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveBook} className="admin-modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Title</label>
                  <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Author</label>
                  <input value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required />
                </div>
                <div className="form-group full">
                  <label>Cover URL or Upload Photo</label>
                  <div className="form-input-with-preview">
                    <input value={formData.cover} onChange={e => setFormData({...formData, cover: e.target.value})} placeholder="https://..." required />
                    <div className="file-upload-wrapper">
                      <input type="file" id="cover-upload" accept="image/*" onChange={handleFileUpload} />
                      <label htmlFor="cover-upload" className="btn btn-secondary btn-icon-only">
                        <Upload size={16} />
                      </label>
                    </div>
                    {formData.cover && (
                      <div className="admin-form-preview-mini">
                        <img src={formData.cover} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label>Genre</label>
                  <input value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Rating (0-5)</label>
                  <input type="number" step="0.1" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <input type="number" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Pages</label>
                  <input type="number" value={formData.pages} onChange={e => setFormData({...formData, pages: e.target.value})} required />
                </div>
                <div className="form-group full">
                  <label>Moods (comma separated)</label>
                  <input placeholder="e.g. Atmospheric, Mysterious, Intellectual" value={formData.mood} onChange={e => setFormData({...formData, mood: e.target.value})} required />
                </div>
                <div className="form-group full">
                  <label>Review</label>
                  <textarea rows="3" value={formData.review} onChange={e => setFormData({...formData, review: e.target.value})} required />
                </div>
                <div className="form-group full">
                  <label>Signature Quote</label>
                  <input value={formData.quote} onChange={e => setFormData({...formData, quote: e.target.value})} required />
                </div>
                <div className="form-group checkbox featured-toggle">
                  <label>
                    <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} />
                    <Star size={16} className={formData.featured ? 'active' : ''} />
                    <span>Display as <strong>Staff Pick</strong> on Homepage</span>
                  </label>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? 'Saving...' : (editingBook ? 'Update Book' : 'Add Book')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List Modal */}
      {isListModalOpen && (
        <div className="admin-modal-overlay animate-fade-in">
          <div className="admin-modal glass-card animate-scale-in" style={{ maxWidth: '600px' }}>
            <div className="admin-modal-header">
              <h3>{editingList ? 'Edit Curated List' : 'Create New List'}</h3>
              <button className="btn-icon" onClick={() => setIsListModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveList} className="admin-modal-form">
              <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="form-group">
                  <label>List Title</label>
                  <input value={listFormData.title} onChange={e => setListFormData({...listFormData, title: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea rows="3" value={listFormData.description} onChange={e => setListFormData({...listFormData, description: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Icon Name (Lucide)</label>
                  <input placeholder="e.g. Heart, CloudRain, Zap, Brain" value={listFormData.icon} onChange={e => setListFormData({...listFormData, icon: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>List Color Theme (Wheel)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input 
                      type="color" 
                      value="#C9A84C" 
                      style={{ width: '50px', height: '50px', border: 'none', borderRadius: '50%', cursor: 'pointer' }}
                      onChange={e => {
                        const color = e.target.value;
                        const gradient = `linear-gradient(135deg, ${color}22, ${color}11)`;
                        setListFormData({...listFormData, gradient});
                      }} 
                    />
                    <div style={{ flex: 1, height: '40px', borderRadius: 'var(--radius-md)', background: listFormData.gradient, border: '1px solid var(--border-subtle)' }} />
                  </div>
                </div>
                
                <div className="form-group full">
                  <label>Select Books for this List</label>
                  <div className="admin-list-book-selector glass-card">
                    <div className="admin-list-book-grid">
                      {books.map(book => (
                        <label key={book.id} className={`admin-list-book-option ${listFormData.selectedBookIds.includes(book.id) ? 'active' : ''}`}>
                          <input 
                            type="checkbox" 
                            checked={listFormData.selectedBookIds.includes(book.id)}
                            onChange={(e) => {
                              const ids = e.target.checked 
                                ? [...listFormData.selectedBookIds, book.id]
                                : listFormData.selectedBookIds.filter(id => id !== book.id);
                              setListFormData({ ...listFormData, selectedBookIds: ids });
                            }}
                          />
                          <img src={book.cover} alt={book.title} />
                          <div className="option-info">
                            <span className="option-title">{book.title}</span>
                            <span className="option-author">{book.author}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setIsListModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? 'Saving...' : (editingList ? 'Update List' : 'Create List')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
