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
  Download,
  ShoppingCart,
  Package,
  TrendingUp,
  Megaphone,
  Maximize2
} from 'lucide-react';
import toast from 'react-hot-toast';
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
  uploadImage,
  fetchAiAutofill,
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  fetchOrders,
  updateOrder,
  deleteDeliveredOrders,
  sendNewsletter
} from '../../services/api';
import './Admin.css';
import AnalyticsDashboard from './AnalyticsDashboard';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'books' | 'reading' | 'subscribers' | ...
  
  // Data State
  const [books, setBooks] = useState([]);
  const [curatedLists, setCuratedLists] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [users, setUsers] = useState([]);
  const [readingStatus, setReadingStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    cover: '',
    rating: 5,
    genre: '',
    genres: '',
    tropes: '',
    pacing: '',
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

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    price: 0,
    images: '',
    stock: 0,
    category: 'Merch',
    currency: 'NGN',
    isFeatured: false
  });

  // Order Details Modal State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderTrackingForm, setOrderTrackingForm] = useState({ trackingNumber: '', trackingUrl: '' });

  // Newsletter State
  const [newsletterForm, setNewsletterForm] = useState({
    audience: 'All Subscribers',
    subject: '',
    message: '',
    customEmails: '',
    testEmail: ''
  });
  const [isSendingNewsletter, setIsSendingNewsletter] = useState(false);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

  const confirmAction = (message, action) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ margin: 0, fontWeight: 500 }}>{message}</p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button 
            className="btn-sm" 
            style={{ background: 'var(--accent-rose)', color: 'white', border: 'none' }}
            onClick={() => { toast.dismiss(t.id); action(); }}
          >Confirm</button>
          <button className="btn-sm btn-ghost" onClick={() => toast.dismiss(t.id)}>Cancel</button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  // No background auto-refresh to prevent slowing down the page
  useEffect(() => {
    // Only load data once on authentication
    // No interval to avoid database connection exhaustion
  }, [isAuthenticated, activeTab]);

  // Simple mock authentication
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'reader123') {
      setIsAuthenticated(true);
      loadData();
      toast.success('Welcome back, Admin');
    } else {
      toast.error('Invalid password');
    }
  };

  const loadData = async () => {
    setLoading(false); // Disable global blocking loader, let sections populate as they arrive
    
    try {
      // Staggered non-blocking fetches to prevent DB pool exhaustion while remaining fast
      fetchOrders().then(o => setOrders(o || [])).catch(() => {});
      await new Promise(r => setTimeout(r, 200));
      
      fetchProducts().then(p => setProducts(p || [])).catch(() => {});
      await new Promise(r => setTimeout(r, 200));
      
      fetchBooks({ limit: 100 }).then(b => setBooks(b?.books || [])).catch(() => {});
      await new Promise(r => setTimeout(r, 200));
      
      fetchLists().then(l => setCuratedLists(l || [])).catch(() => {});
      await new Promise(r => setTimeout(r, 200));
      
      fetchSubscribers().then(s => setSubscribers(s || [])).catch(() => {});
      await new Promise(r => setTimeout(r, 200));
      
      fetchUsers().then(u => setUsers(u || [])).catch(() => {});
      await new Promise(r => setTimeout(r, 200));
      
      fetchCurrentlyReading().then(r => {
        if (r) {
          setReadingStatus(r);
          setReadingForm({
            title: r.title || '', author: r.author || '', cover: r.cover || '',
            progress: r.progress || 0, thoughts: r.thoughts || ''
          });
        }
      }).catch(() => {});
      
    } catch (err) {
      console.error('Error initiating staggered load', err);
    }
  };
  const handleOpenModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        ...book,
        mood: Array.isArray(book.mood) ? book.mood.join(', ') : book.mood,
        genres: Array.isArray(book.genres) ? book.genres.join(', ') : book.genres || '',
        tropes: Array.isArray(book.tropes) ? book.tropes.join(', ') : book.tropes || '',
        pacing: book.pacing || ''
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: '',
        author: '',
        cover: '',
        rating: 5,
        genre: '',
        genres: '',
        tropes: '',
        pacing: '',
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
        mood: typeof formData.mood === 'string' ? formData.mood.split(',').map(m => m.trim()).filter(Boolean) : formData.mood,
        genres: typeof formData.genres === 'string' ? formData.genres.split(',').map(m => m.trim()).filter(Boolean) : formData.genres,
        tropes: typeof formData.tropes === 'string' ? formData.tropes.split(',').map(m => m.trim()).filter(Boolean) : formData.tropes,
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
      toast.success('Book saved successfully');
    } catch (err) {
      toast.error('Failed to save book: ' + err.message);
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
      toast.success('Image uploaded');
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setIsSaving(false);
    }
  };

  const handleProductImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsSaving(true);
    try {
      const { url } = await uploadImage(file);
      setProductForm(prev => {
        const currentImages = prev.images.trim();
        const newImages = currentImages ? `${currentImages}\n${url}` : url;
        return { ...prev, images: newImages };
      });
      toast.success('Product image uploaded');
    } catch (err) {
      toast.error('Failed to upload product image');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBook = (id) => {
    confirmAction('Are you sure you want to delete this book?', async () => {
      try {
        await deleteBook(id);
        loadData();
        toast.success('Book deleted');
      } catch (err) {
        toast.error('Failed to delete book');
      }
    });
  };

  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        ...product,
        images: product.images?.join('\n') || ''
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        title: '', description: '', price: 0, images: '', stock: 0, category: 'Merch', currency: 'NGN', isFeatured: false
      });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        images: typeof productForm.images === 'string' ? productForm.images.split('\n').map(m => m.trim()).filter(Boolean) : productForm.images
      };
      delete payload.weight;

      if (editingProduct) {
        await updateProduct(editingProduct._id || editingProduct.id, payload);
      } else {
        await addProduct(payload);
      }
      setIsProductModalOpen(false);
      loadData();
      toast.success('Product saved successfully');
    } catch (err) {
      toast.error('Failed to save product: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = (id) => {
    confirmAction('Are you sure you want to delete this product?', async () => {
      try {
        await deleteProduct(id);
        loadData();
        toast.success('Product deleted');
      } catch (err) {
        toast.error('Failed to delete product');
      }
    });
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await updateOrder(id, { status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      toast.success('Order status updated to ' + status);
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  const handleDownloadOrdersCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer Name', 'Customer Email', 'Total Amount', 'Status', 'Tracking Number'];
    const rows = orders.map(o => [
      o._id,
      new Date(o.createdAt).toLocaleDateString(),
      `"${o.shippingAddress?.fullName || ''}"`,
      o.customerEmail,
      o.totalAmount,
      o.status,
      o.trackingNumber || ''
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Orders exported to CSV');
  };

  const handleDeleteDeliveredOrders = () => {
    confirmAction('Are you sure you want to delete all Delivered and Cancelled orders? This cannot be undone.', async () => {
      try {
        const data = await deleteDeliveredOrders();
        // Optimistic UI update to remove deleted orders instantly without a full reload
        setOrders(prev => prev.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled'));
        toast.success(`Deleted ${data.count || 0} completed/cancelled orders`);
      } catch (err) {
        toast.error('Failed to clean up orders');
      }
    });
  };

  const handleArchiveAndCleanOrders = () => {
    confirmAction('This will download all Delivered and Cancelled orders to a CSV file and then permanently delete them. Continue?', async () => {
      try {
        const completedOrders = orders.filter(o => o.status === 'Delivered');
        const cancelledOrders = orders.filter(o => o.status === 'Cancelled');
        
        if (completedOrders.length === 0 && cancelledOrders.length === 0) {
          toast.error('No delivered or cancelled orders to archive.');
          return;
        }

        const headers = ['Order ID', 'Date', 'Customer Name', 'Customer Email', 'Total Amount', 'Status', 'Tracking Number'];
        let csvRows = [];
        
        // Delivered Section
        csvRows.push(['--- DELIVERED ORDERS ---']);
        csvRows.push(headers);
        completedOrders.forEach(o => {
          csvRows.push([
            o._id,
            new Date(o.createdAt).toLocaleDateString(),
            o.customerName,
            o.customerEmail,
            o.totalAmount,
            o.status,
            o.trackingNumber || ''
          ]);
        });
        
        csvRows.push([]); // Empty row
        csvRows.push([]); // Empty row
        
        // Cancelled Section
        csvRows.push(['--- CANCELLED ORDERS ---']);
        csvRows.push(headers);
        cancelledOrders.forEach(o => {
          csvRows.push([
            o._id,
            new Date(o.createdAt).toLocaleDateString(),
            o.customerName,
            o.customerEmail,
            o.totalAmount,
            o.status,
            o.trackingNumber || ''
          ]);
        });
        
        const csvContent = csvRows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `archived_orders_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        
        // Optimistic UI update to remove deleted orders instantly without a full reload
        const data = await deleteDeliveredOrders();
        setOrders(prev => prev.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled'));
        toast.success(`Archived and deleted ${data.count || 0} completed/cancelled orders`);
      } catch (err) {
        toast.error('Failed to archive and clean orders');
      }
    });
  };

  const handleUpdateOrderTracking = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsSaving(true);
    try {
      await updateOrder(selectedOrder._id, orderTrackingForm);
      // Update local selectedOrder to reflect changes in the modal immediately
      setSelectedOrder(prev => ({ ...prev, trackingNumber: orderTrackingForm.trackingNumber, trackingUrl: orderTrackingForm.trackingUrl }));
      // Optimistically update the main orders list as well
      setOrders(prev => prev.map(o => o._id === selectedOrder._id ? { ...o, trackingNumber: orderTrackingForm.trackingNumber, trackingUrl: orderTrackingForm.trackingUrl } : o));
      toast.success('Tracking info updated');
    } catch (err) {
      toast.error('Failed to update tracking info');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenOrderModal = (order) => {
    setSelectedOrder(order);
    setOrderTrackingForm({
      trackingNumber: order.trackingNumber || '',
      trackingUrl: order.trackingUrl || ''
    });
    setIsOrderModalOpen(true);
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
      toast.success('List saved successfully');
    } catch (err) {
      toast.error('Failed to save list');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAutoFill = async () => {
    if (!formData.title || !formData.author) {
      toast.error('Please enter a Title and Author first');
      return;
    }
    setIsAutoFilling(true);
    const loadingToast = toast.loading('Consulting the AI Librarian...');
    try {
      const aiData = await fetchAiAutofill(formData.title, formData.author);
      setFormData(prev => ({
        ...prev,
        cover: aiData.cover || prev.cover,
        review: aiData.review || prev.review,
        quote: aiData.quote || prev.quote,
        genres: aiData.genres ? aiData.genres.join(', ') : prev.genres,
        tropes: aiData.tropes ? aiData.tropes.join(', ') : prev.tropes,
        pacing: aiData.pacing || prev.pacing,
        mood: aiData.mood ? aiData.mood.join(', ') : prev.mood,
        year: aiData.year || prev.year,
        pages: aiData.pages || prev.pages,
        genre: (aiData.genres && aiData.genres.length > 0) ? aiData.genres[0] : prev.genre
      }));
      toast.success('Form magically populated!', { id: loadingToast });
    } catch (err) {
      toast.error('Failed to auto-fill data. Is the API key set?', { id: loadingToast });
    } finally {
      setIsAutoFilling(false);
    }
  };

  const handleDeleteSubscriber = (id) => {
    confirmAction('Remove this reader from the archives?', async () => {
      try {
        await deleteSubscriber(id);
        loadData();
        toast.success('Subscriber removed');
      } catch (err) {
        toast.error('Failed to remove subscriber');
      }
    });
  };

  const handleDeleteList = (id) => {
    confirmAction('Are you sure you want to delete this curated list?', async () => {
      try {
        await deleteList(id);
        loadData();
        toast.success('List deleted');
      } catch (err) {
        toast.error('Failed to delete list');
      }
    });
  };

  const handleUpdateReading = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const saved = await updateCurrentlyReading(readingForm);
      setReadingForm(saved);
      loadData();
      toast.success('Reading status updated!');
    } catch (err) {
      toast.error('Failed to update reading status');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendNewsletter = async (e, isTest = false) => {
    if (e) e.preventDefault();
    
    if (isTest && !newsletterForm.testEmail) {
      toast.error('Test email address is required');
      return;
    }
    if (!isTest && (!newsletterForm.subject || !newsletterForm.message)) {
      toast.error('Subject and message are required');
      return;
    }
    
    setIsSendingNewsletter(true);
    try {
      const payload = { ...newsletterForm, isTest };
      const res = await sendNewsletter(payload);
      toast.success(res.message || 'Newsletter sent successfully');
      if (!isTest) {
        setNewsletterForm({ ...newsletterForm, subject: '', message: '', customEmails: '', testEmail: '' });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send newsletter');
    } finally {
      setIsSendingNewsletter(false);
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
                className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <TrendingUp size={20} />
                Sales Dashboard
              </button>
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
              <button 
                className={`admin-nav-item ${activeTab === 'shop' ? 'active' : ''}`}
                onClick={() => setActiveTab('shop')}
              >
                <ShoppingCart size={18} /> Manage Shop
              </button>
              <button 
                className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <Package size={18} /> Orders
              </button>
              <button 
                className={`admin-nav-item ${activeTab === 'newsletter' ? 'active' : ''}`}
                onClick={() => setActiveTab('newsletter')}
              >
                <Megaphone size={18} /> Campaigns
              </button>
              <button className="admin-nav-item logout" onClick={() => setIsAuthenticated(false)}>
                <LogOut size={18} /> Logout
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="admin-main">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="admin-panel animate-fade-in">
                <AnalyticsDashboard orders={orders} />
              </div>
            )}

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
                              toast.error('Failed to upload image');
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
                                <button className="btn-icon delete" onClick={() => {
                                  confirmAction(`Are you sure you want to delete user "${user.username}"?`, async () => {
                                    try {
                                      await deleteUser(user.id);
                                      loadData();
                                      toast.success('User deleted');
                                    } catch (err) {
                                      toast.error('Failed to delete user');
                                    }
                                  });
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

            {activeTab === 'newsletter' && (
              <section className="admin-section animate-fade-in">
                <div className="admin-header">
                  <div>
                    <h2>Broadcast Mail</h2>
                    <p>Send customized emails to your users.</p>
                  </div>
                </div>

                <div className="broadcast-layout">
                  <div className="broadcast-main">
                    {/* 1 - CHOOSE AUDIENCE */}
                    <div className="broadcast-section">
                      <h3>1 — CHOOSE AUDIENCE</h3>
                      <div className="audience-pills">
                        <button 
                          className={`pill-btn ${newsletterForm.audience === 'All Subscribers' ? 'active' : ''}`}
                          onClick={() => setNewsletterForm({...newsletterForm, audience: 'All Subscribers'})}
                        >All Subscribers</button>
                        <button 
                          className={`pill-btn ${newsletterForm.audience === 'Waitlist Only' ? 'active' : ''}`}
                          onClick={() => setNewsletterForm({...newsletterForm, audience: 'Waitlist Only'})}
                        >Waitlist Only</button>
                        <button 
                          className={`pill-btn ${newsletterForm.audience === 'Newsletter Only' ? 'active' : ''}`}
                          onClick={() => setNewsletterForm({...newsletterForm, audience: 'Newsletter Only'})}
                        >Newsletter Only</button>
                        <button 
                          className={`pill-btn ${newsletterForm.audience === 'Custom List' ? 'active custom-list' : ''}`}
                          onClick={() => setNewsletterForm({...newsletterForm, audience: 'Custom List'})}
                        >Custom List</button>
                      </div>
                      
                      {newsletterForm.audience === 'Custom List' && (
                        <div style={{ marginTop: '1rem' }}>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            EMAIL ADDRESSES (one per line or comma separated)
                          </label>
                          <textarea 
                            className="broadcast-textarea"
                            placeholder="john@email.com, jane@email.com"
                            value={newsletterForm.customEmails}
                            onChange={(e) => setNewsletterForm({...newsletterForm, customEmails: e.target.value})}
                          />
                        </div>
                      )}
                    </div>

                    {/* 2 - SUBJECT */}
                    <div className="broadcast-section">
                      <h3>2 — SUBJECT</h3>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          EMAIL SUBJECT *
                        </label>
                        <input 
                          type="text"
                          className="broadcast-input"
                          placeholder="e.g. Exciting News from The Readers Index!"
                          value={newsletterForm.subject}
                          onChange={(e) => setNewsletterForm({...newsletterForm, subject: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    {/* 3 - COMPOSE EMAIL */}
                    <div className="broadcast-section">
                      <h3>3 — COMPOSE EMAIL</h3>
                      <div className="quill-container" style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>
                        <ReactQuill 
                          theme="snow" 
                          value={newsletterForm.message} 
                          onChange={(content) => setNewsletterForm({...newsletterForm, message: content})}
                          style={{ minHeight: '300px' }}
                          modules={{
                            toolbar: [
                              [{ 'header': [1, 2, 3, false] }],
                              ['bold', 'italic', 'underline', 'strike'],
                              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                              ['link', 'image'],
                              ['clean']
                            ]
                          }}
                        />
                      </div>
                    </div>

                    {/* 4 - SEND */}
                    <div className="broadcast-section">
                      <h3>4 — SEND</h3>
                      <div style={{ background: 'rgba(255, 107, 0, 0.1)', border: '1px solid rgba(255, 107, 0, 0.2)', padding: '1rem', borderRadius: '8px', color: '#FF8C00', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        <AlertCircle size={16} /> Emails sent in batches. Large lists may take several minutes.
                      </div>
                      
                      <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          SEND TEST EMAIL FIRST
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input 
                            type="email"
                            className="broadcast-input"
                            placeholder="your@email.com"
                            value={newsletterForm.testEmail}
                            onChange={(e) => setNewsletterForm({...newsletterForm, testEmail: e.target.value})}
                          />
                          <button 
                            type="button"
                            className="btn btn-secondary" 
                            style={{ whiteSpace: 'nowrap' }}
                            onClick={() => handleSendNewsletter(null, true)}
                            disabled={isSendingNewsletter}
                          >
                            Send Test
                          </button>
                        </div>
                      </div>

                      <button 
                        type="button" 
                        className="send-broadcast-btn"
                        onClick={(e) => handleSendNewsletter(e, false)}
                        disabled={isSendingNewsletter}
                      >
                        {isSendingNewsletter ? (
                          <><Loader size={18} className="spin" /> Sending...</>
                        ) : (
                          <><Megaphone size={18} /> Send Broadcast</>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* RIGHT SIDEBAR */}
                  <div className="broadcast-sidebar">
                    <div className="broadcast-section" style={{ padding: 0, overflow: 'hidden' }}>
                      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '0.9rem' }}>LIVE PREVIEW</h3>
                        <button className="btn-icon" onClick={() => setIsPreviewExpanded(true)} title="Expand Preview">
                          <Maximize2 size={14} />
                        </button>
                      </div>
                      <div style={{ padding: '1rem', background: 'var(--bg-secondary)' }}>
                        <div className="live-preview-window">
                          <div className="live-preview-header">
                            <div className="preview-dot red"></div>
                            <div className="preview-dot yellow"></div>
                            <div className="preview-dot green"></div>
                          </div>
                          <div className="live-preview-content" dangerouslySetInnerHTML={{ __html: `
                            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1a2e; color: #d4cfc7; padding: 2rem; border-radius: 8px;">
                              <div style="text-align: center; margin-bottom: 2rem;">
                                <h1 style="color: #C9A84C; font-size: 1.5rem; margin: 0; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">The Reader's Index</h1>
                                <hr style="border: none; border-top: 1px solid rgba(201,168,76,0.15); margin-top: 1.5rem;" />
                              </div>
                              <div style="line-height: 1.6; font-size: 0.95rem;">
                                ${newsletterForm.message || '<p style="color: rgba(255,255,255,0.2);">Start typing to preview...</p>'}
                              </div>
                            </div>
                          `}} />
                        </div>
                      </div>
                    </div>

                    <div className="broadcast-section">
                      <h3>RECENT BROADCASTS</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>No broadcasts yet.</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* EXPANDED PREVIEW MODAL */}
            {isPreviewExpanded && (
              <div className="preview-modal-overlay" onClick={() => setIsPreviewExpanded(false)}>
                <div className="preview-modal-content" onClick={e => e.stopPropagation()}>
                  <button className="close-preview-btn" onClick={() => setIsPreviewExpanded(false)}>
                    <X size={20} /> Close Preview
                  </button>
                  <div className="live-preview-window">
                    <div className="live-preview-header">
                      <div className="preview-dot red"></div>
                      <div className="preview-dot yellow"></div>
                      <div className="preview-dot green"></div>
                    </div>
                    <div className="live-preview-content" dangerouslySetInnerHTML={{ __html: `
                      <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1a2e; color: #d4cfc7; padding: 2.5rem; border-radius: 12px; border: 1px solid rgba(201,168,76,0.2);">
                        <div style="text-align: center; margin-bottom: 2rem;">
                          <h1 style="color: #C9A84C; font-size: 1.8rem; margin: 0; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">The Reader's Index</h1>
                          <hr style="border: none; border-top: 1px solid rgba(201,168,76,0.15); margin-top: 1.5rem;" />
                        </div>
                        <div style="line-height: 1.7; font-size: 1.05rem; color: #d4cfc7;">
                          ${newsletterForm.message || '<p style="color: rgba(255,255,255,0.2);">Start typing to preview...</p>'}
                        </div>
                      </div>
                    `}} />
                  </div>
                </div>
              </div>
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

            {activeTab === 'shop' && (
              <section className="admin-section animate-fade-in">
                <div className="admin-header">
                  <div>
                    <h2>Manage Shop</h2>
                    <p>Manage your physical merchandise and products.</p>
                  </div>
                  <button className="btn btn-primary" onClick={() => handleOpenProductModal()}>
                    <Plus size={18} /> Add New Product
                  </button>
                </div>

                <div className="admin-books-grid">
                  {loading ? (
                    <div className="admin-loading"><Loader className="spin" /> Loading products...</div>
                  ) : (
                    products.map(product => (
                      <div key={product._id} className="admin-book-item glass-card">
                        <img src={product.images?.[0] || 'https://via.placeholder.com/150'} alt={product.title} />
                        <div className="admin-book-details">
                          <h4>{product.title}</h4>
                          <p>
                            {product.currency === 'NGN' ? '₦' : product.currency === 'GBP' ? '£' : '$'}
                            {product.price.toFixed(2)}
                          </p>
                          <div className="admin-book-meta">
                            <span className={product.stock > 0 ? 'badge-new' : 'badge-featured'}>
                              {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
                            </span>
                            {product.isFeatured && <span className="badge-featured">Featured</span>}
                          </div>
                        </div>
                        <div className="admin-book-actions">
                          <button className="btn-icon" onClick={() => handleOpenProductModal(product)}><Edit3 size={16} /></button>
                          <button className="btn-icon delete" onClick={() => handleDeleteProduct(product._id)}><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            )}

            {activeTab === 'orders' && (
              <section className="admin-section animate-fade-in">
                <div className="admin-content-card glass-card animate-fade-in">
                  <div className="admin-header">
                    <div>
                      <h2>Orders</h2>
                      <p>View and manage incoming store orders.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <button className="btn btn-secondary" onClick={handleDownloadOrdersCSV}>
                        <Download size={18} /> Export CSV
                      </button>
                      <button className="btn btn-primary" style={{ background: 'var(--accent-gold)', borderColor: 'var(--accent-gold)' }} onClick={handleArchiveAndCleanOrders}>
                        <Download size={18} /> Archive & Clean
                      </button>
                      <button className="btn btn-outline" style={{ borderColor: 'var(--accent-rose)', color: 'var(--accent-rose)' }} onClick={handleDeleteDeliveredOrders}>
                        <Trash2 size={18} /> Clean Delivered
                      </button>
                    </div>
                  </div>

                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Customer</th>
                          <th>Total Amount</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center" style={{ padding: '3rem', color: 'var(--text-muted)' }}>
                              No orders yet.
                            </td>
                          </tr>
                        ) : (
                          orders.map((order) => (
                            <tr key={order._id}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  <div className="reader-icon"><Package size={14} /></div>
                                  <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>#{order._id.substring(0, 8)}</span>
                                </div>
                              </td>
                              <td style={{ color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontWeight: 500 }}>{order.shippingAddress?.fullName}</span>
                                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.customerEmail}</span>
                                </div>
                              </td>
                              <td style={{ fontWeight: 600 }}>₦{order.totalAmount.toFixed(2)}</td>
                              <td>
                                <span className={`badge status-badge status-${order.status.toLowerCase()}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                  <button className="btn-icon" title="View Details" onClick={() => handleOpenOrderModal(order)}>
                                    <Eye size={16} />
                                  </button>
                                </div>
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

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="admin-modal-overlay animate-fade-in">
          <div className="admin-modal glass-card animate-scale-in">
            <div className="admin-modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="btn-icon" onClick={() => setIsProductModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="admin-modal-form">
              <div className="form-grid">
                <div className="form-group full">
                  <label>Title</label>
                  <input value={productForm.title} onChange={e => setProductForm({...productForm, title: e.target.value})} required />
                </div>
                <div className="form-group full">
                  <label>Image URLs (one per line) or Upload Photo</label>
                  <div className="form-input-with-preview">
                    <textarea rows="3" placeholder="https://..." value={productForm.images} onChange={e => setProductForm({...productForm, images: e.target.value})} required style={{ resize: 'vertical' }} />
                    <div className="file-upload-wrapper">
                      <input type="file" id="product-image-upload" accept="image/*" onChange={handleProductImageUpload} />
                      <label htmlFor="product-image-upload" className="btn btn-secondary btn-icon-only">
                        <Upload size={16} />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-group" style={{ display: 'flex', gap: '0.5rem', gridColumn: 'span 2' }}>
                  <div style={{ flex: 1 }}>
                    <label>Price</label>
                    <input type="number" step="0.01" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} required />
                  </div>
                  <div>
                    <label>Currency</label>
                    <select value={productForm.currency} onChange={e => setProductForm({...productForm, currency: e.target.value})} style={{ width: '90px' }} required>
                      <option value="NGN">₦ NGN</option>
                      <option value="USD">$ USD</option>
                      <option value="GBP">£ GBP</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} required />
                </div>

                <div className="form-group full">
                  <label>Description</label>
                  <textarea rows="4" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} required />
                </div>
                <div className="form-group checkbox featured-toggle">
                  <label>
                    <input type="checkbox" checked={productForm.isFeatured} onChange={e => setProductForm({...productForm, isFeatured: e.target.checked})} />
                    <Star size={16} className={productForm.isFeatured ? 'active' : ''} />
                    <span>Display as <strong>Featured</strong></span>
                  </label>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setIsProductModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                <div className="form-group full" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', background: 'var(--bg-glass-subtle)', padding: '1rem', borderRadius: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label>Title</label>
                    <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Author</label>
                    <input value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required />
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={handleAutoFill} 
                    disabled={isAutoFilling || !formData.title || !formData.author}
                    style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)', border: 'none', height: '42px', display: 'flex', alignItems: 'center' }}
                  >
                    {isAutoFilling ? <Loader size={18} className="spin" /> : <Sparkles size={18} />}
                    {isAutoFilling ? ' Thinking...' : ' Auto-Fill'}
                  </button>
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
                  <label>Primary Genre</label>
                  <input value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} required />
                </div>
                <div className="form-group full">
                  <label>All Genres (comma separated)</label>
                  <input placeholder="e.g. Fantasy, Mystery, Romance" value={formData.genres} onChange={e => setFormData({...formData, genres: e.target.value})} />
                </div>
                <div className="form-group full">
                  <label>Tropes (comma separated)</label>
                  <input placeholder="e.g. Found Family, Enemies to Lovers" value={formData.tropes} onChange={e => setFormData({...formData, tropes: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Pacing</label>
                  <select value={formData.pacing} onChange={e => setFormData({...formData, pacing: e.target.value})} required>
                    <option value="">Select pacing...</option>
                    <option value="Fast">Fast</option>
                    <option value="Medium">Medium</option>
                    <option value="Slow">Slow</option>
                  </select>
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
      {/* Order Details Modal */}
      {isOrderModalOpen && selectedOrder && (
        <div className="admin-modal-overlay animate-fade-in">
          <div className="admin-modal glass-card animate-scale-in" style={{ maxWidth: '650px' }}>
            <div className="admin-modal-header">
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Order Details <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>#{selectedOrder._id.substring(0,8)}</span>
                </h3>
              </div>
              <button className="btn-icon" onClick={() => setIsOrderModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="admin-modal-content" style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="order-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div className="order-details-section">
                  <h4 style={{ color: 'var(--accent-gold)', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>Customer Details</h4>
                  <p style={{ marginBottom: '0.2rem' }}><strong>Name:</strong> {selectedOrder.shippingAddress?.fullName}</p>
                  <p style={{ marginBottom: '0.2rem' }}><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                  <p style={{ marginBottom: '0.2rem' }}><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center' }}>
                    <strong style={{ marginRight: '0.5rem' }}>Status:</strong>
                      <select 
                        value={selectedOrder.status} 
                        onChange={(e) => {
                          handleUpdateOrderStatus(selectedOrder._id, e.target.value);
                          setSelectedOrder({...selectedOrder, status: e.target.value});
                        }}
                        style={{
                          padding: '0.6rem 1rem',
                          background: 'var(--bg-primary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          color: 'var(--text-primary)',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                
                <div className="order-details-section">
                  <h4 style={{ color: 'var(--accent-gold)', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>Shipping Address</h4>
                  <p style={{ margin: 0 }}>{selectedOrder.shippingAddress?.fullName}</p>
                  <p style={{ margin: 0 }}>{selectedOrder.shippingAddress?.street}</p>
                  <p style={{ margin: 0 }}>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}</p>
                  <p style={{ margin: 0 }}>{selectedOrder.shippingAddress?.country}</p>
                </div>
              </div>

              <div className="order-details-section" style={{ marginBottom: '2rem', background: 'var(--bg-glass-subtle)', padding: '1.5rem', borderRadius: '12px' }}>
                <h4 style={{ color: 'var(--accent-gold)', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>Tracking Information</h4>
                <form onSubmit={handleUpdateOrderTracking} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem' }}>Tracking Number</label>
                    <input 
                      value={orderTrackingForm.trackingNumber} 
                      onChange={e => setOrderTrackingForm({...orderTrackingForm, trackingNumber: e.target.value})} 
                      placeholder="e.g. 1Z999999..."
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ fontSize: '0.85rem' }}>Tracking URL</label>
                    <input 
                      value={orderTrackingForm.trackingUrl} 
                      onChange={e => setOrderTrackingForm({...orderTrackingForm, trackingUrl: e.target.value})} 
                      placeholder="e.g. https://fedex.com/track?..."
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-sm btn-secondary" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Tracking Info'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="order-details-section">
                <h4 style={{ color: 'var(--accent-gold)', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>Order Items</h4>
                <div className="order-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedOrder.products?.map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--bg-glass-subtle)', padding: '0.75rem', borderRadius: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <h5 style={{ margin: 0, color: 'var(--text-primary)' }}>{item.product?.title || 'Unknown Product'}</h5>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Quantity: {item.quantity}</p>
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        ₦{(item.priceAtPurchase * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                    <span>Total Amount</span>
                    <span style={{ color: 'var(--accent-gold)' }}>₦{selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button type="button" className="btn btn-ghost" onClick={() => setIsOrderModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
