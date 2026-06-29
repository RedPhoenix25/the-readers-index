import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Trash2, Heart, Clock, CheckCircle2, Bookmark, Camera, User, Settings, ChevronLeft, ChevronRight, Package, MapPin, Truck, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BookCard from '../../components/BookCard/BookCard';
import BookModal from '../../components/BookModal/BookModal';
import { uploadAvatar, API_BASE } from '../../services/api';
import { fetchUserOrders } from '../../services/api';
import toast from 'react-hot-toast';
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
  const { user, token, loading: authLoading, updateUser, refreshUserBooks } = useAuth();
  const [activeTab, setActiveTab] = useState('library');
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [visiblePastOrders, setVisiblePastOrders] = useState(5);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'orders' || tabParam === 'library') {
      setActiveTab(tabParam);
    }
  }, [location]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const loadUserData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [booksRes, ordersRes] = await Promise.all([
        fetch(`${API_BASE}/user/books`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetchUserOrders(token)
      ]);
      if (booksRes.ok) {
        const booksData = await booksRes.json();
        setBooks(booksData);
      }
      setOrders(ordersRes || []);
    } catch (err) {
      console.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [token]);

  const handleRemoveBook = async (e, bookId) => {
    e.stopPropagation();
    
    try {
      const res = await fetch(`${API_BASE}/user/books/${bookId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setBooks(books.filter(b => b.id !== bookId));
        refreshUserBooks();
        toast.success('Removed from archive');
      }
    } catch (err) {
      toast.error('Failed to remove book');
    }
  };

  const handleMarkAsRead = async (e, bookId) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_BASE}/user/books`, {
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
        refreshUserBooks();
        toast.success('Marked as read');
      }
    } catch (err) {
      toast.error('Failed to update book status');
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
        toast.success('Avatar updated successfully');
      }
    } catch (err) {
      toast.error('Failed to upload avatar. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (authLoading || (loading && books.length === 0 && orders.length === 0)) {
    return <div className="loading-state">Tending to your shelves...</div>;
  }

  const sections = [
    { title: 'Want to Read', status: 'Want to Read', icon: <Bookmark size={20} /> },
    { title: 'Completed', status: 'Read', icon: <CheckCircle2 size={20} /> },
  ];

  const activeOrders = orders.filter(o => ['Pending', 'Processing', 'Shipped'].includes(o.status));
  const pastOrders = orders.filter(o => ['Delivered', 'Cancelled'].includes(o.status));

  const getStatusStep = (status) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      case 'Cancelled': return 0;
      default: return 1;
    }
  };

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

          <div className="myshelf-tabs">
            <button 
              className={`myshelf-tab ${activeTab === 'library' ? 'active' : ''}`}
              onClick={() => setActiveTab('library')}
            >
              <Bookmark size={18} /> My Library
            </button>
            <button 
              className={`myshelf-tab ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <Package size={18} /> My Orders
            </button>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          {activeTab === 'library' && (
            books.length === 0 ? (
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
            )
          )}

          {activeTab === 'orders' && (
            <div className="orders-tab animate-fade-in">
              <div className="orders-section active-orders">
                <h3 className="orders-section-title">Active Orders</h3>
                {activeOrders.length === 0 ? (
                  <div className="empty-orders glass-card">
                    <Package size={32} />
                    <p>You have no active orders.</p>
                    <button className="btn btn-outline" onClick={() => navigate('/shop')}>Shop Now</button>
                  </div>
                ) : (
                  <div className="orders-list">
                    {activeOrders.map(order => (
                      <div key={order._id} className="order-card glass-card">
                        <div className="order-card-header" onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)} style={{ cursor: 'pointer' }}>
                          <div>
                            <h4>Order <span style={{ fontFamily: 'monospace', color: 'var(--accent-gold)' }}>#{order._id.substring(0, 8)}</span></h4>
                            <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="order-status-group">
                            <span className={`badge status-badge status-${order.status.toLowerCase()}`}>{order.status}</span>
                            {expandedOrder === order._id ? <ChevronLeft size={16} style={{ transform: 'rotate(-90deg)' }}/> : <ChevronLeft size={16} style={{ transform: 'rotate(180deg)' }}/>}
                          </div>
                        </div>

                        {expandedOrder === order._id && (
                          <div className="order-card-expanded animate-fade-in">
                            <div className="order-timeline">
                              <div className={`timeline-step ${getStatusStep(order.status) >= 1 ? 'active' : ''}`}>
                                <div className="step-icon"><Clock size={16} /></div>
                                <p>Placed</p>
                              </div>
                              <div className={`timeline-line ${getStatusStep(order.status) >= 2 ? 'active' : ''}`} />
                              <div className={`timeline-step ${getStatusStep(order.status) >= 2 ? 'active' : ''}`}>
                                <div className="step-icon"><Package size={16} /></div>
                                <p>Processing</p>
                              </div>
                              <div className={`timeline-line ${getStatusStep(order.status) >= 3 ? 'active' : ''}`} />
                              <div className={`timeline-step ${getStatusStep(order.status) >= 3 ? 'active' : ''}`}>
                                <div className="step-icon"><Truck size={16} /></div>
                                <p>Shipped</p>
                              </div>
                              <div className={`timeline-line ${getStatusStep(order.status) >= 4 ? 'active' : ''}`} />
                              <div className={`timeline-step ${getStatusStep(order.status) >= 4 ? 'active' : ''}`}>
                                <div className="step-icon"><CheckCircle2 size={16} /></div>
                                <p>Delivered</p>
                              </div>
                            </div>

                            <div className="order-info-grid">
                              <div className="info-box">
                                <h5>Shipping Details</h5>
                                <p><strong>{order.shippingAddress.fullName}</strong></p>
                                <p>{order.shippingAddress.street}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                              </div>
                              
                              {(order.trackingNumber || order.trackingUrl) && (
                                <div className="info-box tracking-box">
                                  <h5>Carrier Info</h5>
                                  {order.trackingNumber && <p><strong>Tracking:</strong> {order.trackingNumber}</p>}
                                  {order.trackingUrl && (
                                    <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="btn-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '0.5rem' }}>
                                      <MapPin size={14} /> Track on Carrier Site
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="order-items">
                              <h5>Items</h5>
                              <div className="items-list">
                                {order.products.map((item, idx) => (
                                  <div key={idx} className="order-item-row">
                                    <div className="item-name">
                                      <span className="qty">{item.quantity}x</span> {item.product?.title || 'Unknown Product'}
                                    </div>
                                    <div className="item-price">₦{(item.priceAtPurchase * item.quantity).toFixed(2)}</div>
                                  </div>
                                ))}
                                <div className="order-total-row">
                                  <span>Total</span>
                                  <span>₦{order.totalAmount.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="orders-section past-orders">
                <h3 className="orders-section-title">Past Orders</h3>
                {pastOrders.length === 0 ? (
                  <div className="empty-orders glass-card">
                    <p>No past orders.</p>
                  </div>
                ) : (
                  <div className="orders-list">
                    {pastOrders.slice(0, visiblePastOrders).map(order => (
                      <div key={order._id} className="order-card compact glass-card">
                        <div className="order-card-header">
                          <div>
                            <h4>Order <span style={{ fontFamily: 'monospace', color: 'var(--accent-gold)' }}>#{order._id.substring(0, 8)}</span></h4>
                            <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="order-status-group">
                            <span className={`badge status-badge status-${order.status.toLowerCase()}`}>{order.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {visiblePastOrders < pastOrders.length && (
                      <button 
                        className="btn btn-outline load-more-btn"
                        onClick={() => setVisiblePastOrders(prev => prev + 5)}
                      >
                        Load More Orders
                      </button>
                    )}
                  </div>
                )}
              </div>
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
