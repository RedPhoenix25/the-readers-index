import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Trash2, Heart, Clock, CheckCircle2, Bookmark, Camera, User, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BookCard from '../../components/BookCard/BookCard';
import BookModal from '../../components/BookModal/BookModal';
import { uploadAvatar } from '../../services/api';
import './MyShelf.css';

const ITEMS_PER_PAGE = 8;

function ShelfSection({ section, allBooks, onSelectBook, onMarkRead, onRemove }) {
  const [currentPage, setCurrentPage] = useState(1);
  const sectionBooks = allBooks.filter(b => b.status === section.status);
  
  if (sectionBooks.length === 0) return null;

  const totalPages = Math.ceil(sectionBooks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pagedBooks = sectionBooks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const element = document.getElementById(`section-${section.status}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div key={section.status} className="myshelf-section animate-fade-in-up" id={`section-${section.status}`}>
      <div className="myshelf-section-header">
        {section.icon}
        <h2>{section.title}</h2>
        <span className="count-badge">{sectionBooks.length}</span>
      </div>

      {sectionBooks.length > 0 ? (
        <>
          <div className="myshelf-grid">
            {pagedBooks.map((book, i) => (
              <div key={book.id} className="myshelf-item-wrapper">
                <BookCard book={book} index={i} onClick={onSelectBook} isProfile={true} />
                {book.status === 'Want to Read' && (
                  <button 
                    className="mark-read-btn" 
                    onClick={(e) => onMarkRead(e, book.id)}
                    title="Mark as completed"
                  >
                    <CheckCircle2 size={16} /> Read
                  </button>
                )}
                <button 
                  className="remove-shelf-btn" 
                  onClick={(e) => onRemove(e, book.id)}
                  title="Remove from archive"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="bookshelf-pagination" style={{ marginTop: 'var(--space-xl)' }}>
              <button 
                className="btn btn-ghost bookshelf-page-btn" 
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  className={`bookshelf-page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                className="btn btn-ghost bookshelf-page-btn" 
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-section-hint glass-card">
          <p>No books in this section yet.</p>
        </div>
      )}
    </div>
  );
}

export default function MyShelf() {
  const { user, token, loading: authLoading, updateUser } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const loadUserBooks = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/user/books', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (err) {
      console.error('Failed to load bookshelf');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserBooks();
  }, [token]);

  const handleRemoveBook = async (e, bookId) => {
    e.stopPropagation();
    if (!window.confirm('Remove from your archive?')) return;
    
    try {
      const res = await fetch(`/api/user/books/${bookId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setBooks(books.filter(b => b.id !== bookId));
      }
    } catch (err) {
      alert('Failed to remove book');
    }
  };

  const handleMarkAsRead = async (e, bookId) => {
    e.stopPropagation();
    try {
      const res = await fetch('/api/user/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookId, status: 'Read' })
      });
      if (res.ok) {
        setBooks(prev => prev.map(b => 
          b.id === bookId ? { ...b, status: 'Read' } : b
        ));
      }
    } catch (err) {
      alert('Failed to update book status');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const res = await uploadAvatar(file, token);
      if (res.avatar) {
        updateUser({ avatar: res.avatar });
      }
    } catch (err) {
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (authLoading || (loading && books.length === 0)) {
    return <div className="loading-state">Tending to your shelves...</div>;
  }

  const sections = [
    { title: 'Want to Read', status: 'Want to Read', icon: <Bookmark size={20} /> },
    { title: 'Completed', status: 'Read', icon: <CheckCircle2 size={20} /> },
  ];

  return (
    <div className="page-wrapper myshelf-page">
      <header className="myshelf-header">
        <div className="container myshelf-header-content">
          <div className="myshelf-profile">
            <div className="myshelf-avatar-container">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} className="myshelf-avatar" />
              ) : (
                <div className="myshelf-avatar-placeholder">
                  <User size={48} />
                </div>
              )}
              <button 
                className="myshelf-avatar-edit" 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                title="Change Avatar"
              >
                <Camera size={16} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarUpload} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
            </div>
            <div className="myshelf-info">
              <span className="section-label">Personal Archive</span>
              <h1>Welcome, {user?.username}</h1>
              <p>Your sanctuary for the stories you've discovered and those yet to be told.</p>
              <button 
                className="btn btn-outline" 
                style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                onClick={() => navigate('/settings')}
              >
                <Settings size={16} /> Account Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          {books.length === 0 ? (
            <div className="empty-shelf glass-card animate-fade-in">
              <BookOpen size={48} />
              <h3>Your shelves are empty</h3>
              <p>Start exploring the library and add books to your archive.</p>
              <button className="btn btn-primary" onClick={() => navigate('/bookshelf')}>
                Explore The Bookshelf
              </button>
            </div>
          ) : (
            <div className="myshelf-content">
              {sections.map(section => (
                <ShelfSection 
                  key={section.status}
                  section={section}
                  allBooks={books}
                  onSelectBook={setSelectedBook}
                  onMarkRead={handleMarkAsRead}
                  onRemove={handleRemoveBook}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedBook && (
        <BookModal 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
        />
      )}
    </div>
  );
}
