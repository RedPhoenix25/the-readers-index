import { Routes, Route } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Bookshelf from './pages/Bookshelf/Bookshelf';
import Recommendations from './pages/Recommendations/Recommendations';
import ComingSoon from './pages/ComingSoon/ComingSoon';
import LibraryVision from './pages/LibraryVision/LibraryVision';
import Admin from './pages/Admin/Admin';
import Auth from './pages/Auth/Auth';
import MyShelf from './pages/MyShelf/MyShelf';
import Settings from './pages/Settings/Settings';

function ScrollToTop() {
  const { pathname } = useLocation();
  const lastPathname = useRef(pathname);

  useEffect(() => {
    if (pathname !== lastPathname.current) {
      window.scrollTo(0, 0);
      lastPathname.current = pathname;
    }
  }, [pathname]);
  return null;
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button 
      className={`back-to-top-pulse ${visible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
      id="back-to-top-floating"
    >
      <ArrowUp size={20} />
      <div className="pulse-ring" />
    </button>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("React Crash:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#1a1612', color: '#c9a84c', height: '100vh', textAlign: 'center', fontFamily: 'serif' }}>
          <h2>The Sanctuary hit a snag.</h2>
          <p>{this.state.error?.toString()}</p>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', background: '#c9a84c', color: '#1a1612', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Try Re-entering
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';
  const hideFooterPages = ['/admin', '/my-shelf', '/settings', '/login', '/register'];
  const shouldHideFooter = hideFooterPages.includes(location.pathname);

  return (
    <ErrorBoundary>
      <ScrollToTop />
      {!isAdminPage && <BackToTop />}
      {!isAdminPage && <Navbar />}
      <main className={isAdminPage ? 'admin-page-container' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bookshelf" element={<Bookshelf />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/library-vision" element={<LibraryVision />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Auth type="login" />} />
          <Route path="/register" element={<Auth type="register" />} />
          <Route path="/my-shelf" element={<MyShelf />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      {!shouldHideFooter && <Footer />}
    </ErrorBoundary>
  );
}
