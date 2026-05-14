import { Routes, Route } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
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

export default function App() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';
  const hideFooterPages = ['/admin', '/my-shelf', '/settings', '/login', '/register'];
  const shouldHideFooter = hideFooterPages.includes(location.pathname);

  return (
    <>
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
    </>
  );
}
