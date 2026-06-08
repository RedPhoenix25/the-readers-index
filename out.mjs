var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/assets/images/hero-bg.png
var require_hero_bg = __commonJS({
  "src/assets/images/hero-bg.png"() {
  }
});

// src/main.jsx
import React14 from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// src/App.jsx
import { Routes, Route } from "react-router-dom";
import React13, { useState as useState19, useEffect as useEffect14, useRef as useRef6 } from "react";
import { useLocation as useLocation3 } from "react-router-dom";
import { ArrowUp } from "lucide-react";

// src/components/Navbar/Navbar.jsx
import { useState as useState2, useEffect as useEffect2 } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, BookOpen, Search, User, LogOut } from "lucide-react";

// src/context/AuthContext.jsx
import React2, { createContext, useState, useContext, useEffect } from "react";

// src/services/api.js
var API_BASE = import.meta.env.MODE === "production" ? "https://the-readers-index.onrender.com/api" : "/api";
async function resilientFetch(url, options = {}, retries = 3) {
  const delays = [2e3, 5e3, 1e4];
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.ok || res.status < 500) return res;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, delays[attempt] || 5e3));
      }
    } catch (err) {
      if (attempt >= retries) throw err;
      await new Promise((r) => setTimeout(r, delays[attempt] || 5e3));
    }
  }
  return fetch(url, options);
}
async function fetchBooks(params = {}) {
  const query = new URLSearchParams();
  if (params.genre && params.genre !== "All") query.set("genre", params.genre);
  if (params.mood && params.mood !== "All") query.set("mood", params.mood);
  if (params.search) query.set("search", params.search);
  if (params.sort) query.set("sort", params.sort);
  if (params.page) query.set("page", params.page);
  if (params.limit) query.set("limit", params.limit);
  if (params.featured) query.set("featured", "true");
  const res = await resilientFetch(`${API_BASE}/books?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}
async function fetchAiAutofill(title, author) {
  const res = await resilientFetch(`${API_BASE}/books/auto-fill`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author })
  });
  if (!res.ok) throw new Error("Failed to fetch AI data");
  return res.json();
}
async function fetchCurrentlyReading() {
  const res = await resilientFetch(`${API_BASE}/currently-reading`);
  if (!res.ok) throw new Error("Failed to fetch currently reading");
  return res.json();
}
async function fetchGenres() {
  const res = await resilientFetch(`${API_BASE}/meta/genres`);
  if (!res.ok) throw new Error("Failed to fetch genres");
  return res.json();
}
async function fetchMoods() {
  const res = await resilientFetch(`${API_BASE}/meta/moods`);
  if (!res.ok) throw new Error("Failed to fetch moods");
  return res.json();
}
async function subscribe(email, source = "Newsletter") {
  const res = await fetch(`${API_BASE}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source })
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to subscribe");
  }
  return res.json();
}
async function addBook(book) {
  const res = await fetch(`${API_BASE}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book)
  });
  if (!res.ok) throw new Error("Failed to add book");
  return res.json();
}
async function updateBook(id, book) {
  const res = await fetch(`${API_BASE}/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book)
  });
  if (!res.ok) throw new Error("Failed to update book");
  return res.json();
}
async function deleteBook(id) {
  const res = await fetch(`${API_BASE}/books/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete book");
  return res.json();
}
async function updateCurrentlyReading(data) {
  const res = await fetch(`${API_BASE}/currently-reading`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to update currently reading");
  return res.json();
}
async function fetchLists() {
  const res = await resilientFetch(`${API_BASE}/lists`);
  if (!res.ok) throw new Error("Failed to fetch lists");
  return res.json();
}
async function addList(list) {
  const res = await fetch(`${API_BASE}/lists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(list)
  });
  if (!res.ok) throw new Error("Failed to add list");
  return res.json();
}
async function updateList(id, list) {
  const res = await fetch(`${API_BASE}/lists/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(list)
  });
  if (!res.ok) throw new Error("Failed to update list");
  return res.json();
}
async function deleteList(id) {
  const res = await fetch(`${API_BASE}/lists/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete list");
  return res.json();
}
async function fetchListBooks(id) {
  const res = await resilientFetch(`${API_BASE}/lists/${id}/books`);
  if (!res.ok) throw new Error("Failed to fetch list books");
  return res.json();
}
async function updateListBooks(id, bookIds) {
  const res = await fetch(`${API_BASE}/lists/${id}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookIds })
  });
  if (!res.ok) throw new Error("Failed to update list books");
  return res.json();
}
async function fetchSubscribers() {
  const res = await resilientFetch(`${API_BASE}/subscribers`);
  if (!res.ok) throw new Error("Failed to fetch subscribers");
  return res.json();
}
async function deleteSubscriber(id) {
  const res = await fetch(`${API_BASE}/subscribers/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete subscriber");
  return res.json();
}
async function fetchUsers() {
  const res = await resilientFetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}
async function deleteUser(id) {
  const res = await fetch(`${API_BASE}/admin/users/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
}
async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData
  });
  if (!res.ok) throw new Error("Failed to upload image");
  return res.json();
}
async function uploadAvatar(file, token) {
  const formData = new FormData();
  formData.append("avatar", file);
  const res = await fetch(`${API_BASE}/users/avatar`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData
  });
  if (!res.ok) throw new Error("Failed to upload avatar");
  return res.json();
}
async function fetchProducts() {
  const res = await resilientFetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}
async function addProduct(product) {
  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error("Failed to add product");
  return res.json();
}
async function updateProduct(id, product) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}
async function deleteProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
}
async function fetchOrders() {
  const res = await resilientFetch(`${API_BASE}/orders`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}
async function updateOrderStatus(id, status) {
  const res = await fetch(`${API_BASE}/orders/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error("Failed to update order status");
  return res.json();
}
async function fetchProductById(id) {
  const res = await resilientFetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product details");
  return res.json();
}
async function createOrder(orderData) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData)
  });
  if (!res.ok) throw new Error("Failed to place order");
  return res.json();
}

// src/context/AuthContext.jsx
var AuthContext = createContext(null);
var getInitialToken = () => {
  try {
    return localStorage.getItem("token");
  } catch (e) {
    return null;
  }
};
var AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userBooks, setUserBooks] = useState([]);
  const [token, setToken] = useState(getInitialToken());
  const [loading, setLoading] = useState(true);
  const fetchUserBooks = async (currentToken, retries = 3) => {
    const delays = [2e3, 5e3, 1e4];
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await fetch(`${API_BASE}/user/books`, {
          headers: { "Authorization": `Bearer ${currentToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUserBooks(data);
          return;
        }
        if (res.status === 401 || res.status === 403) return;
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, delays[attempt]));
        }
      } catch (err) {
        if (attempt >= retries) {
          console.error("Failed to fetch user shelf after retries");
          return;
        }
        await new Promise((r) => setTimeout(r, delays[attempt]));
      }
    }
  };
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      fetchUserProfile();
      fetchUserBooks(token);
    } else {
      localStorage.removeItem("token");
      setUser(null);
      setUserBooks([]);
      setLoading(false);
    }
  }, [token]);
  const fetchUserProfile = async (retries = 3) => {
    const delays = [2e3, 5e3, 1e4];
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setLoading(false);
          return;
        }
        if (res.status === 401 || res.status === 403) {
          logout();
          setLoading(false);
          return;
        }
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, delays[attempt]));
        }
      } catch (err) {
        if (attempt >= retries) {
          console.error("Failed to reach server after retries");
          setLoading(false);
          return;
        }
        await new Promise((r) => setTimeout(r, delays[attempt]));
      }
    }
    setLoading(false);
  };
  const login = (userData, userToken) => {
    setToken(userToken);
    setUser(userData);
  };
  const logout = () => {
    setToken(null);
    setUser(null);
    setUserBooks([]);
    localStorage.removeItem("token");
  };
  const refreshUserBooks = () => {
    if (token) fetchUserBooks(token);
  };
  const updateUser = (data) => {
    setUser((prev) => ({ ...prev, ...data }));
  };
  return /* @__PURE__ */ React2.createElement(AuthContext.Provider, { value: { user, userBooks, token, loading, login, logout, refreshUserBooks, updateUser } }, children);
};
var useAuth = () => useContext(AuthContext);

// src/components/Navbar/Navbar.jsx
var navLinks = [
  { path: "/", label: "Home" },
  { path: "/bookshelf", label: "The Bookshelf" },
  { path: "/recommendations", label: "Recommendations" },
  { path: "/coming-soon", label: "Shop" },
  { path: "/library-vision", label: "The Vision" }
];
function Navbar() {
  const [isOpen, setIsOpen] = useState2(false);
  const [scrolled, setScrolled] = useState2(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  useEffect2(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect2(() => {
    setIsOpen(false);
  }, [location]);
  useEffect2(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isOpen]);
  return /* @__PURE__ */ React.createElement("nav", { className: `navbar ${scrolled && !isOpen ? "navbar--scrolled" : ""} ${isOpen ? "navbar--solid" : ""}`, id: "main-navigation" }, /* @__PURE__ */ React.createElement("div", { className: "navbar__inner container" }, /* @__PURE__ */ React.createElement(Link, { to: "/", className: "navbar__logo", id: "nav-logo" }, /* @__PURE__ */ React.createElement(BookOpen, { size: 24, strokeWidth: 1.5 }), /* @__PURE__ */ React.createElement("span", { className: "navbar__logo-text" }, /* @__PURE__ */ React.createElement("span", { className: "navbar__logo-the" }, "The"), " Reader's Index")), /* @__PURE__ */ React.createElement("div", { className: `navbar__links ${isOpen ? "navbar__links--open" : ""}` }, navLinks.map((link) => /* @__PURE__ */ React.createElement(
    Link,
    {
      key: link.path,
      to: link.path,
      className: `navbar__link ${location.pathname === link.path ? "navbar__link--active" : ""}`,
      id: `nav-link-${link.path.replace("/", "") || "home"}`
    },
    link.label,
    location.pathname === link.path && /* @__PURE__ */ React.createElement("span", { className: "navbar__link-dot" })
  )), user ? /* @__PURE__ */ React.createElement("div", { className: "navbar__user" }, /* @__PURE__ */ React.createElement(Link, { to: "/my-shelf", className: "navbar__link navbar__link--user" }, /* @__PURE__ */ React.createElement(User, { size: 16 }), " My Archive"), /* @__PURE__ */ React.createElement("button", { onClick: logout, className: "navbar__link navbar__logout-btn" }, /* @__PURE__ */ React.createElement(LogOut, { size: 16 }))) : /* @__PURE__ */ React.createElement(Link, { to: "/login", className: "navbar__link navbar__login-link" }, "Sign In")), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "navbar__toggle",
      onClick: () => setIsOpen(!isOpen),
      "aria-label": "Toggle menu",
      id: "nav-toggle"
    },
    isOpen ? /* @__PURE__ */ React.createElement(X, { size: 22 }) : /* @__PURE__ */ React.createElement(Menu, { size: 22 })
  )));
}

// src/components/Footer/Footer.jsx
import { useState as useState3 } from "react";
import { Link as Link2 } from "react-router-dom";
import { BookOpen as BookOpen2, Mail } from "lucide-react";
function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return /* @__PURE__ */ React.createElement("footer", { className: "footer", id: "footer" }, /* @__PURE__ */ React.createElement("div", { className: "footer__glow" }), /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "footer__grid" }, /* @__PURE__ */ React.createElement("div", { className: "footer__brand" }, /* @__PURE__ */ React.createElement(Link2, { to: "/", className: "footer__logo" }, /* @__PURE__ */ React.createElement(BookOpen2, { size: 20, strokeWidth: 1.5 }), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("em", null, "The"), " Reader's Index")), /* @__PURE__ */ React.createElement("p", { className: "footer__tagline" }, "A curated literary sanctuary \u2014 from digital pages to a physical home for stories."), /* @__PURE__ */ React.createElement("h4", { className: "footer__connect-label" }, "Connect With Us"), /* @__PURE__ */ React.createElement("div", { className: "footer__socials" }, /* @__PURE__ */ React.createElement("a", { href: "https://www.instagram.com/the_readers_index", target: "_blank", rel: "noopener noreferrer", className: "footer__social", "aria-label": "Instagram", id: "footer-instagram", title: "Follow us on Instagram" }, /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("rect", { x: "2", y: "2", width: "20", height: "20", rx: "5", ry: "5" }), /* @__PURE__ */ React.createElement("path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }), /* @__PURE__ */ React.createElement("line", { x1: "17.5", y1: "6.5", x2: "17.51", y2: "6.5" }))), /* @__PURE__ */ React.createElement("a", { href: "https://wa.me/2348109825703", target: "_blank", rel: "noopener noreferrer", className: "footer__social", "aria-label": "WhatsApp", id: "footer-whatsapp", title: "Chat on WhatsApp" }, /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" }))), /* @__PURE__ */ React.createElement("a", { href: "mailto:thereadersindex@gmail.com", className: "footer__social", "aria-label": "Email", id: "footer-email", title: "Send us an email" }, /* @__PURE__ */ React.createElement(Mail, { size: 18 })))), /* @__PURE__ */ React.createElement("div", { className: "footer__nav-wrapper" }, /* @__PURE__ */ React.createElement("div", { className: "footer__nav-group" }, /* @__PURE__ */ React.createElement("h4", { className: "footer__nav-title" }, "Explore"), /* @__PURE__ */ React.createElement(Link2, { to: "/bookshelf", className: "footer__nav-link" }, "The Bookshelf"), /* @__PURE__ */ React.createElement(Link2, { to: "/recommendations", className: "footer__nav-link" }, "Recommendations"), /* @__PURE__ */ React.createElement(Link2, { to: "/coming-soon", className: "footer__nav-link" }, "Shop (Coming Soon)"), /* @__PURE__ */ React.createElement(Link2, { to: "/library-vision", className: "footer__nav-link" }, "The Library Vision")), /* @__PURE__ */ React.createElement("div", { className: "footer__nav-group" }, /* @__PURE__ */ React.createElement("h4", { className: "footer__nav-title" }, "Community"), /* @__PURE__ */ React.createElement(Link2, { to: "/coming-soon", className: "footer__nav-link" }, "Book of the Month"), /* @__PURE__ */ React.createElement(Link2, { to: "/coming-soon", className: "footer__nav-link" }, "Reading Challenges"), /* @__PURE__ */ React.createElement(Link2, { to: "/coming-soon", className: "footer__nav-link" }, "Join Discord"), /* @__PURE__ */ React.createElement(Link2, { to: "/bookshelf", className: "footer__nav-link" }, "Submit a Review")))), /* @__PURE__ */ React.createElement("div", { className: "footer__divider" }), /* @__PURE__ */ React.createElement("div", { className: "footer__bottom" }, /* @__PURE__ */ React.createElement("p", { className: "footer__copyright" }, "\xA9 ", (/* @__PURE__ */ new Date()).getFullYear(), " The Readers Index."))));
}

// src/pages/Home/Home.jsx
var import_hero_bg = __toESM(require_hero_bg(), 1);
import { useState as useState6, useEffect as useEffect5 } from "react";
import { Link as Link3 } from "react-router-dom";
import toast2 from "react-hot-toast";
import { ArrowRight as ArrowRight2, BookOpen as BookOpen4, ChevronRight, Sparkles, Mail as Mail2, Star as Star3, Users, Library } from "lucide-react";

// src/components/BookCard/BookCard.jsx
import { useState as useState4, useEffect as useEffect3 } from "react";
import { useNavigate } from "react-router-dom";
import { Star, BookmarkPlus, CheckCircle2 } from "lucide-react";
function BookCard({ book, onClick, index = 0, viewMode = "grid", isProfile = false }) {
  const [saving, setSaving] = useState4(false);
  const [showMobileActions, setShowMobileActions] = useState4(false);
  const { user, userBooks, token, refreshUserBooks } = useAuth();
  const navigate = useNavigate();
  useEffect3(() => {
    if (!showMobileActions) return;
    const handleClickOutside = () => setShowMobileActions(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [showMobileActions]);
  const isAlreadySaved = userBooks.some((b) => b.id === book.id);
  const handleCardClick = (e) => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      if (!showMobileActions) {
        e.preventDefault();
        e.stopPropagation();
        setShowMobileActions(true);
        return;
      }
    }
    onClick?.(book);
  };
  const handleReadReview = (e) => {
    e.stopPropagation();
    onClick?.(book);
  };
  const handleQuickSave = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/user/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ bookId: book.id, status: "Want to Read" })
      });
      if (res.ok) {
        refreshUserBooks();
      }
    } catch (err) {
      console.error("Failed to save book");
    } finally {
      setSaving(false);
    }
  };
  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < full) {
        stars.push(/* @__PURE__ */ React.createElement(Star, { key: i, size: 13, fill: "var(--accent-gold)", color: "var(--accent-gold)" }));
      } else if (i === full && hasHalf) {
        stars.push(/* @__PURE__ */ React.createElement(Star, { key: i, size: 13, fill: "var(--accent-gold)", color: "var(--accent-gold)", style: { clipPath: "inset(0 50% 0 0)" } }));
      } else {
        stars.push(/* @__PURE__ */ React.createElement(Star, { key: i, size: 13, color: "var(--text-muted)" }));
      }
    }
    return stars;
  };
  return /* @__PURE__ */ React.createElement(
    "article",
    {
      className: `book-card glass-card animate-fade-in-up ${viewMode === "list" ? "book-card--list" : ""} ${showMobileActions ? "book-card--active" : ""}`,
      style: { animationDelay: `${index * 0.08}s` },
      onClick: handleCardClick,
      onMouseLeave: () => setShowMobileActions(false),
      id: `book-card-${book.id}`
    },
    /* @__PURE__ */ React.createElement("div", { className: "book-card__cover-wrapper" }, /* @__PURE__ */ React.createElement(
      "img",
      {
        src: book.cover,
        alt: `Cover of ${book.title}`,
        className: "book-card__cover",
        loading: "lazy"
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "book-card__cover-shine" }), /* @__PURE__ */ React.createElement("div", { className: "book-card__overlay" }, /* @__PURE__ */ React.createElement("div", { className: "book-card__overlay-actions" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn btn-primary book-card__action-btn book-card__action-btn--primary",
        onClick: handleReadReview
      },
      "Read Review"
    ), !isProfile && (!isAlreadySaved ? /* @__PURE__ */ React.createElement(
      "button",
      {
        className: `btn btn-secondary book-card__action-btn ${saving ? "loading" : ""}`,
        onClick: handleQuickSave,
        title: "Add to Reading List",
        disabled: saving
      },
      /* @__PURE__ */ React.createElement(BookmarkPlus, { size: 14, style: { marginRight: "6px" } }),
      saving ? "Saving..." : "Read Later"
    ) : /* @__PURE__ */ React.createElement("div", { className: "book-card__saved-badge" }, /* @__PURE__ */ React.createElement(CheckCircle2, { size: 14 }), " Saved"))))),
    /* @__PURE__ */ React.createElement("div", { className: "book-card__info" }, /* @__PURE__ */ React.createElement("div", { className: "book-card__genre badge" }, book.genre), /* @__PURE__ */ React.createElement("h3", { className: "book-card__title" }, book.title), /* @__PURE__ */ React.createElement("p", { className: "book-card__author" }, "by ", book.author), /* @__PURE__ */ React.createElement("div", { className: "book-card__rating" }, /* @__PURE__ */ React.createElement("div", { className: "star-rating" }, renderStars(book.rating)), /* @__PURE__ */ React.createElement("span", { className: "book-card__rating-num" }, book.rating)))
  );
}

// src/components/BookModal/BookModal.jsx
import { useEffect as useEffect4, useState as useState5, useRef } from "react";
import { X as X2, Star as Star2, BookOpen as BookOpen3, Quote, Calendar, FileText, Bookmark, CheckCircle2 as CheckCircle22, Clock, Plus, Heart, MessageSquare, User as User2, Send, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
function BookModal({ book, onClose }) {
  const { user, userBooks, token, refreshUserBooks } = useAuth();
  const [saving, setSaving] = useState5(false);
  const [saveStatus, setSaveStatus] = useState5(null);
  const [engagement, setEngagement] = useState5({ likes: 0, userLiked: false, comments: [] });
  const [loadingEngagement, setLoadingEngagement] = useState5(true);
  const [newComment, setNewComment] = useState5("");
  const [newRating, setNewRating] = useState5(0);
  const [submittingComment, setSubmittingComment] = useState5(false);
  const [showComments, setShowComments] = useState5(false);
  const modalRef = useRef(null);
  const thoughtsContentRef = useRef(null);
  const currentStatus = userBooks.find((b) => b.id === book.id)?.status;
  useEffect4(() => {
    if (showComments) {
      if (modalRef.current) {
        modalRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
      if (thoughtsContentRef.current) {
        thoughtsContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [showComments]);
  useEffect4(() => {
    if (!book) return;
    const fetchEngagement = async () => {
      try {
        const headers = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const res = await fetch(`${API_BASE}/books/${book.id}/engagement`, { headers });
        if (res.ok) {
          const data = await res.json();
          setEngagement(data);
        }
      } catch (err) {
        console.error("Failed to fetch engagement data");
      } finally {
        setLoadingEngagement(false);
      }
    };
    fetchEngagement();
  }, [book, token]);
  useEffect4(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);
  if (!book) return null;
  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        /* @__PURE__ */ React.createElement(
          Star2,
          {
            key: i,
            size: 18,
            fill: i < full ? "var(--accent-gold)" : "transparent",
            color: i < full ? "var(--accent-gold)" : "var(--text-muted)"
          }
        )
      );
    }
    return stars;
  };
  const renderInteractiveStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        /* @__PURE__ */ React.createElement(
          "button",
          {
            key: i,
            type: "button",
            className: "star-btn",
            onClick: () => setNewRating(i),
            disabled: !user || submittingComment,
            title: `${i} Star${i > 1 ? "s" : ""}`
          },
          /* @__PURE__ */ React.createElement(
            Star2,
            {
              size: 20,
              fill: i <= newRating ? "var(--accent-gold)" : "transparent",
              color: i <= newRating ? "var(--accent-gold)" : "var(--border-light)",
              style: { transition: "all 0.2s" }
            }
          )
        )
      );
    }
    return stars;
  };
  const handleAddToShelf = async (status) => {
    if (!token) return;
    setSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch(`${API_BASE}/user/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ bookId: book.id, status })
      });
      if (res.ok) {
        setSaveStatus("success");
        refreshUserBooks();
        setTimeout(() => setSaveStatus(null), 2e3);
      }
    } catch (err) {
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };
  const handleLike = async () => {
    if (!user) return toast.error("Please sign in to like this book.");
    const isLiking = !engagement.userLiked;
    setEngagement((prev) => ({
      ...prev,
      userLiked: isLiking,
      likes: prev.likes + (isLiking ? 1 : -1)
    }));
    try {
      await fetch(`${API_BASE}/books/${book.id}/like`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
    } catch (err) {
      setEngagement((prev) => ({
        ...prev,
        userLiked: !isLiking,
        likes: prev.likes + (!isLiking ? 1 : -1)
      }));
    }
  };
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please sign in to comment.");
    if (!newComment.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await fetch(`${API_BASE}/books/${book.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment, rating: newRating > 0 ? newRating : null })
      });
      if (res.ok) {
        const comment = await res.json();
        setEngagement((prev) => ({
          ...prev,
          comments: [comment, ...prev.comments]
        }));
        setNewComment("");
        setNewRating(0);
        setNewRating(0);
        toast.success("Thought posted successfully!");
      }
    } catch (err) {
      toast.error("Failed to post comment.");
    } finally {
      setSubmittingComment(false);
    }
  };
  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`${API_BASE}/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setEngagement((prev) => ({
          ...prev,
          comments: prev.comments.filter((c) => c.id !== commentId)
        }));
        toast.success("Comment deleted");
      }
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "modal-backdrop", onClick: onClose, id: "book-modal-backdrop" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "modal animate-scale-in",
      onClick: (e) => e.stopPropagation(),
      id: "book-modal",
      ref: modalRef
    },
    /* @__PURE__ */ React.createElement("button", { className: "modal__close", onClick: onClose, "aria-label": "Close modal", id: "modal-close-btn" }, /* @__PURE__ */ React.createElement(X2, { size: 20 })),
    /* @__PURE__ */ React.createElement("div", { className: "modal__content" }, /* @__PURE__ */ React.createElement("div", { className: "modal__cover-side" }, /* @__PURE__ */ React.createElement("div", { className: "modal__cover-wrapper" }, /* @__PURE__ */ React.createElement("img", { src: book.cover, alt: book.title, className: "modal__cover" }), /* @__PURE__ */ React.createElement("div", { className: "modal__cover-glow" })), /* @__PURE__ */ React.createElement("div", { className: "modal__meta" }, /* @__PURE__ */ React.createElement("div", { className: "modal__meta-item" }, /* @__PURE__ */ React.createElement(Calendar, { size: 14 }), /* @__PURE__ */ React.createElement("span", null, book.year)), /* @__PURE__ */ React.createElement("div", { className: "modal__meta-item" }, /* @__PURE__ */ React.createElement(FileText, { size: 14 }), /* @__PURE__ */ React.createElement("span", null, book.pages, " pages")))), /* @__PURE__ */ React.createElement("div", { className: "modal__details" }, /* @__PURE__ */ React.createElement("div", { className: "badge" }, book.genre), /* @__PURE__ */ React.createElement("h2", { className: "modal__title" }, book.title), /* @__PURE__ */ React.createElement("p", { className: "modal__author" }, "by ", book.author), /* @__PURE__ */ React.createElement("div", { className: "modal__rating" }, /* @__PURE__ */ React.createElement("div", { className: "star-rating" }, renderStars(book.rating)), /* @__PURE__ */ React.createElement("span", { className: "modal__rating-text" }, book.rating, " / 5")), /* @__PURE__ */ React.createElement("div", { className: "modal__moods" }, book.mood.map((m) => /* @__PURE__ */ React.createElement("span", { key: m, className: "modal__mood-tag" }, m))), book.quote && /* @__PURE__ */ React.createElement("blockquote", { className: "modal__quote" }, /* @__PURE__ */ React.createElement(Quote, { size: 18, className: "modal__quote-icon" }), /* @__PURE__ */ React.createElement("p", null, book.quote)), /* @__PURE__ */ React.createElement("div", { className: "modal__review" }, /* @__PURE__ */ React.createElement("h4", null, /* @__PURE__ */ React.createElement(BookOpen3, { size: 16 }), " Our Review"), /* @__PURE__ */ React.createElement("p", null, book.review)), /* @__PURE__ */ React.createElement("div", { className: "modal__engagement" }, /* @__PURE__ */ React.createElement("div", { className: "engagement-actions" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: `engagement-btn ${engagement.userLiked ? "liked" : ""}`,
        onClick: handleLike,
        title: engagement.userLiked ? "Unlike" : "Like"
      },
      /* @__PURE__ */ React.createElement(Heart, { size: 20, fill: engagement.userLiked ? "var(--accent-gold)" : "none", color: engagement.userLiked ? "var(--accent-gold)" : "currentColor" }),
      /* @__PURE__ */ React.createElement("span", null, engagement.likes || 0)
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "engagement-btn conversation-btn",
        onClick: () => setShowComments(true)
      },
      /* @__PURE__ */ React.createElement(MessageSquare, { size: 20 }),
      /* @__PURE__ */ React.createElement("span", null, engagement.comments.length || 0, " Thoughts")
    )), /* @__PURE__ */ React.createElement("div", { className: "conversation-hub-preview glass-card", onClick: () => setShowComments(true) }, /* @__PURE__ */ React.createElement("div", { className: "hub-info" }, /* @__PURE__ */ React.createElement("h4", null, "Conversation Hub"), /* @__PURE__ */ React.createElement("p", null, engagement.comments.length > 0 ? `Join ${engagement.comments.length} others sharing their thoughts...` : "Be the first to share your thoughts on this book.")), /* @__PURE__ */ React.createElement(ArrowRight, { size: 20 }))))),
    showComments && /* @__PURE__ */ React.createElement("div", { className: "thoughts-overlay animate-fade-in" }, /* @__PURE__ */ React.createElement("div", { className: "thoughts-container animate-slide-up" }, /* @__PURE__ */ React.createElement("header", { className: "thoughts-header" }, /* @__PURE__ */ React.createElement("button", { className: "back-btn", onClick: () => setShowComments(false) }, /* @__PURE__ */ React.createElement(ArrowLeft, { size: 20 }), " Back to Review"), /* @__PURE__ */ React.createElement("h3", null, "Community Thoughts"), /* @__PURE__ */ React.createElement("div", { className: "thoughts-count-badge" }, engagement.comments.length)), /* @__PURE__ */ React.createElement("div", { className: "thoughts-content", ref: thoughtsContentRef }, /* @__PURE__ */ React.createElement("div", { className: "thoughts-input-section" }, /* @__PURE__ */ React.createElement("div", { className: "thoughts-input-header" }, /* @__PURE__ */ React.createElement("h4", null, "Share your thoughts"), user && /* @__PURE__ */ React.createElement("div", { className: "comment-rating-selector" }, /* @__PURE__ */ React.createElement("span", { className: "rating-label" }, "Your Rating:"), /* @__PURE__ */ React.createElement("div", { className: "interactive-stars" }, renderInteractiveStars()))), /* @__PURE__ */ React.createElement("form", { className: "thoughts-form", onSubmit: handleCommentSubmit }, /* @__PURE__ */ React.createElement(
      "textarea",
      {
        placeholder: user ? "What did you think of this book? Share your impressions..." : "Sign in to join the discussion",
        value: newComment,
        onChange: (e) => setNewComment(e.target.value),
        disabled: !user || submittingComment,
        rows: 4
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "thoughts-form-footer" }, /* @__PURE__ */ React.createElement("p", { className: "form-note" }, "Keep it respectful and focused on the story."), /* @__PURE__ */ React.createElement("button", { type: "submit", disabled: !user || !newComment.trim() || submittingComment, className: "btn btn-primary" }, submittingComment ? "Posting..." : "Post Thought", " ", /* @__PURE__ */ React.createElement(Send, { size: 16 }))))), /* @__PURE__ */ React.createElement("div", { className: "thoughts-list-section" }, /* @__PURE__ */ React.createElement("h4", null, "All User Thoughts"), /* @__PURE__ */ React.createElement("div", { className: "thoughts-list" }, loadingEngagement ? /* @__PURE__ */ React.createElement("div", { className: "comments-loading" }, "Loading thoughts...") : engagement.comments.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "comments-empty" }, /* @__PURE__ */ React.createElement("div", { className: "empty-icon" }, /* @__PURE__ */ React.createElement(MessageSquare, { size: 40, opacity: 0.2 })), /* @__PURE__ */ React.createElement("p", null, "The conversation hasn't started yet.")) : engagement.comments.map((comment) => /* @__PURE__ */ React.createElement("div", { key: comment.id, className: "comment-item animate-fade-in" }, /* @__PURE__ */ React.createElement("div", { className: "comment-avatar" }, comment.avatar ? /* @__PURE__ */ React.createElement("img", { src: comment.avatar, alt: comment.username }) : /* @__PURE__ */ React.createElement(User2, { size: 16 })), /* @__PURE__ */ React.createElement("div", { className: "comment-content" }, /* @__PURE__ */ React.createElement("div", { className: "comment-header" }, /* @__PURE__ */ React.createElement("span", { className: "comment-author" }, comment.username), comment.rating && /* @__PURE__ */ React.createElement("div", { className: "comment-stars" }, [...Array(comment.rating)].map((_, i) => /* @__PURE__ */ React.createElement(Star2, { key: i, size: 12, fill: "var(--accent-gold)", color: "var(--accent-gold)" }))), /* @__PURE__ */ React.createElement("span", { className: "comment-date" }, new Date(comment.created_at).toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" })), user && (user.id === comment.user_id || user.isAdmin) && /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn-comment-delete",
        onClick: () => handleDeleteComment(comment.id),
        title: "Delete comment"
      },
      /* @__PURE__ */ React.createElement(Trash2, { size: 12 })
    )), /* @__PURE__ */ React.createElement("p", { className: "comment-text" }, comment.content)))))))))
  ));
}

// src/pages/Home/Home.jsx
var heroQuotes = [
  "Between life and death there is a library...",
  "A reader lives a thousand lives before he dies...",
  "Books are a uniquely portable magic...",
  "There is no friend as loyal as a book..."
];
function Home() {
  const [selectedBook, setSelectedBook] = useState6(null);
  const [quoteIndex, setQuoteIndex] = useState6(0);
  const [email, setEmail] = useState6("");
  const [subscribed, setSubscribed] = useState6(false);
  const [isSubscribing, setIsSubscribing] = useState6(false);
  const [isQuoteVisible, setIsQuoteVisible] = useState6(true);
  const [featuredBooks, setFeaturedBooks] = useState6([]);
  const [recentlyAdded, setRecentlyAdded] = useState6([]);
  const [readingStatus, setReadingStatus] = useState6(null);
  const [totalBooks, setTotalBooks] = useState6(0);
  const [loading, setLoading] = useState6(true);
  useEffect5(() => {
    const loadHomeData = async () => {
      try {
        const [featuredData, recentData, currentReading] = await Promise.all([
          fetchBooks({ featured: true, limit: 4 }),
          fetchBooks({ sort: "newest", limit: 8 }),
          fetchCurrentlyReading()
        ]);
        setFeaturedBooks(featuredData?.books || []);
        setRecentlyAdded(recentData?.books || []);
        setTotalBooks(recentData?.pagination?.total || 0);
        setReadingStatus(currentReading);
      } catch (err) {
        console.error("Failed to load home data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
    const interval = setInterval(() => {
      setIsQuoteVisible(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % heroQuotes.length);
        setIsQuoteVisible(true);
      }, 3e3);
    }, 1e4);
    return () => clearInterval(interval);
  }, []);
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast2.error("Please enter your email address");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast2.error("Please enter a valid email address");
      return;
    }
    setIsSubscribing(true);
    try {
      await subscribe(email);
      setSubscribed(true);
      setEmail("");
      toast2.success("Successfully subscribed!");
    } catch (err) {
      toast2.error(err.message || "Failed to subscribe. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "page-wrapper" }, /* @__PURE__ */ React.createElement(
    "section",
    {
      className: "hero",
      id: "hero-section",
      style: { "--hero-bg": `url(${import_hero_bg.default})` }
    },
    /* @__PURE__ */ React.createElement("div", { className: "hero__particles" }, Array.from({ length: 20 }).map((_, i) => /* @__PURE__ */ React.createElement(
      "span",
      {
        key: i,
        className: "hero__particle",
        style: {
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 15}s`,
          animationDuration: `${12 + Math.random() * 10}s`,
          width: `${2 + Math.random() * 3}px`,
          height: `${2 + Math.random() * 3}px`
        }
      }
    ))),
    /* @__PURE__ */ React.createElement("div", { className: "hero__content container" }, /* @__PURE__ */ React.createElement("div", { className: "hero__badge animate-fade-in-up" }, /* @__PURE__ */ React.createElement(Sparkles, { size: 14 }), /* @__PURE__ */ React.createElement("span", null, "A Curated Literary Sanctuary")), /* @__PURE__ */ React.createElement("h1", { className: "hero__title animate-fade-in-up delay-1" }, /* @__PURE__ */ React.createElement("span", { className: "hero__title-the" }, "The"), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "hero__title-main" }, "Readers Index")), /* @__PURE__ */ React.createElement("p", { className: `hero__quote ${isQuoteVisible ? "animate-fade-in" : "animate-fade-out"}` }, '"', heroQuotes[quoteIndex], '"'), /* @__PURE__ */ React.createElement("p", { className: "hero__subtitle animate-fade-in-up delay-3" }, "Discover your next favorite book through curated reviews, personalized recommendations, and a community of passionate readers building toward something extraordinary."), /* @__PURE__ */ React.createElement("div", { className: "hero__actions animate-fade-in-up delay-4" }, /* @__PURE__ */ React.createElement(Link3, { to: "/bookshelf", className: "btn btn-primary", id: "hero-explore-btn" }, "Explore the Bookshelf ", /* @__PURE__ */ React.createElement(ArrowRight2, { size: 16 })), /* @__PURE__ */ React.createElement(Link3, { to: "/recommendations", className: "btn btn-secondary", id: "hero-quiz-btn" }, "Find Your Next Read")), /* @__PURE__ */ React.createElement("div", { className: "hero__stats animate-fade-in-up delay-5" }, /* @__PURE__ */ React.createElement("div", { className: "hero__stat" }, /* @__PURE__ */ React.createElement("span", { className: "hero__stat-num" }, totalBooks, "+"), /* @__PURE__ */ React.createElement("span", { className: "hero__stat-label" }, "Reviews")), /* @__PURE__ */ React.createElement("div", { className: "hero__stat-divider" }), /* @__PURE__ */ React.createElement("div", { className: "hero__stat" }, /* @__PURE__ */ React.createElement("span", { className: "hero__stat-num" }, "2.4k"), /* @__PURE__ */ React.createElement("span", { className: "hero__stat-label" }, "Readers")), /* @__PURE__ */ React.createElement("div", { className: "hero__stat-divider" }), /* @__PURE__ */ React.createElement("div", { className: "hero__stat" }, /* @__PURE__ */ React.createElement("span", { className: "hero__stat-num" }, "7"), /* @__PURE__ */ React.createElement("span", { className: "hero__stat-label" }, "Genres")))),
    /* @__PURE__ */ React.createElement("div", { className: "hero__scroll-indicator" }, /* @__PURE__ */ React.createElement("span", null, "Scroll to discover"), /* @__PURE__ */ React.createElement("div", { className: "hero__scroll-line" }))
  ), /* @__PURE__ */ React.createElement("section", { className: "section currently-reading", id: "currently-reading" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("span", { className: "section-label" }, "What I'm Reading Now"), readingStatus ? /* @__PURE__ */ React.createElement("div", { className: "currently-reading__card glass-card" }, /* @__PURE__ */ React.createElement("div", { className: "currently-reading__cover-wrapper" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: readingStatus.cover,
      alt: readingStatus.title,
      className: "currently-reading__cover"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "currently-reading__info" }, /* @__PURE__ */ React.createElement("h3", null, readingStatus.title), /* @__PURE__ */ React.createElement("p", { className: "currently-reading__author" }, "by ", readingStatus.author), /* @__PURE__ */ React.createElement("div", { className: "currently-reading__progress" }, /* @__PURE__ */ React.createElement("div", { className: "currently-reading__progress-bar" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "currently-reading__progress-fill",
      style: { width: `${readingStatus.progress}%` }
    }
  )), /* @__PURE__ */ React.createElement("span", { className: "currently-reading__progress-text" }, readingStatus.progress, "% complete")), /* @__PURE__ */ React.createElement("p", { className: "currently-reading__thoughts" }, /* @__PURE__ */ React.createElement("em", null, '"', readingStatus.thoughts, '"')))) : /* @__PURE__ */ React.createElement("div", { className: "currently-reading__empty glass-card", style: { textAlign: "center", padding: "3rem" } }, /* @__PURE__ */ React.createElement("p", null, "Nothing on the bedside table right now. Browsing for the next story...")))), /* @__PURE__ */ React.createElement("section", { className: "section featured-reviews", id: "featured-reviews" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "featured-reviews__header" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "section-label" }, "Featured Reviews"), /* @__PURE__ */ React.createElement("h2", { className: "section-title" }, "Staff Picks & Favorites")), /* @__PURE__ */ React.createElement(Link3, { to: "/bookshelf", className: "btn btn-secondary", id: "view-all-reviews-btn" }, "View All ", /* @__PURE__ */ React.createElement(ChevronRight, { size: 16 }))), /* @__PURE__ */ React.createElement("div", { className: "featured-reviews__grid" }, featuredBooks.map((book, i) => /* @__PURE__ */ React.createElement(BookCard, { key: book.id, book, index: i, onClick: setSelectedBook }))))), /* @__PURE__ */ React.createElement("section", { className: "section recently-added", id: "recently-added" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "featured-reviews__header" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "section-label" }, "Fresh on the Shelf"), /* @__PURE__ */ React.createElement("h2", { className: "section-title" }, "Recently Added"))), /* @__PURE__ */ React.createElement("div", { className: "recently-added__carousel" }, recentlyAdded.map((book, i) => /* @__PURE__ */ React.createElement("div", { className: "recently-added__card-wrapper", key: book.id }, /* @__PURE__ */ React.createElement(BookCard, { book, index: i, onClick: setSelectedBook })))))), /* @__PURE__ */ React.createElement("section", { className: "section mission", id: "mission-section" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "mission__card" }, /* @__PURE__ */ React.createElement("div", { className: "mission__icon-group" }, /* @__PURE__ */ React.createElement(Library, { size: 40, strokeWidth: 1 })), /* @__PURE__ */ React.createElement("h2", null, "More Than a Website.", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "text-gradient" }, "A Movement.")), /* @__PURE__ */ React.createElement("p", null, "The Readers Index isn't just a collection of reviews \u2014 it's the first chapter in a bigger story. We're building a community of readers united by a shared dream: to open a real, physical library where stories come alive and everyone is welcome."), /* @__PURE__ */ React.createElement("div", { className: "mission__links" }, /* @__PURE__ */ React.createElement(Link3, { to: "/library-vision", className: "btn btn-primary", id: "mission-vision-btn" }, "Read Our Vision ", /* @__PURE__ */ React.createElement(ArrowRight2, { size: 16 })), /* @__PURE__ */ React.createElement(Link3, { to: "/coming-soon", className: "btn btn-secondary", id: "mission-shop-btn" }, "Support the Journey ", /* @__PURE__ */ React.createElement(ArrowRight2, { size: 16 })))))), /* @__PURE__ */ React.createElement("section", { className: "section newsletter-section", id: "newsletter-section" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "newsletter__card glass-card" }, /* @__PURE__ */ React.createElement("div", { className: "newsletter__content" }, /* @__PURE__ */ React.createElement("span", { className: "section-label" }, "Join the Community"), /* @__PURE__ */ React.createElement("h2", null, "Never Miss a Recommendation"), /* @__PURE__ */ React.createElement("p", null, "Get our weekly curated list, exclusive reviews, and be the first to know about new features, events, and our library journey."), subscribed ? /* @__PURE__ */ React.createElement("div", { className: "newsletter__success animate-fade-in" }, /* @__PURE__ */ React.createElement(Sparkles, { size: 18, className: "newsletter__success-icon" }), /* @__PURE__ */ React.createElement("h4", null, "Welcome to the community!"), /* @__PURE__ */ React.createElement("p", null, "Check your inbox to confirm your subscription.")) : /* @__PURE__ */ React.createElement("form", { className: "newsletter__form", onSubmit: handleSubscribe, noValidate: true }, /* @__PURE__ */ React.createElement("div", { className: "newsletter__input-group" }, /* @__PURE__ */ React.createElement(Mail2, { size: 18, className: "newsletter__icon" }), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "email",
      placeholder: "Enter your email",
      className: "newsletter__input",
      id: "home-newsletter-input",
      value: email,
      onChange: (e) => setEmail(e.target.value),
      required: true,
      disabled: isSubscribing
    }
  ), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-primary", id: "home-newsletter-btn", disabled: isSubscribing }, isSubscribing ? "Subscribing..." : "Subscribe")), /* @__PURE__ */ React.createElement("p", { className: "newsletter__privacy" }, "No spam, ever. Unsubscribe anytime. We respect your inbox."))), /* @__PURE__ */ React.createElement("div", { className: "newsletter__visual" }, /* @__PURE__ */ React.createElement("div", { className: "newsletter__books-stack" }, /* @__PURE__ */ React.createElement(BookOpen4, { size: 80, strokeWidth: 0.5, className: "newsletter__big-icon" })))))), selectedBook && /* @__PURE__ */ React.createElement(BookModal, { book: selectedBook, onClose: () => setSelectedBook(null) }));
}

// src/pages/Bookshelf/Bookshelf.jsx
import { useState as useState7, useEffect as useEffect6, useRef as useRef2, useCallback } from "react";
import { Search as Search2, SlidersHorizontal, X as X3, LayoutGrid, List, LibraryBig, ChevronDown, ChevronLeft, ChevronRight as ChevronRight2, Loader } from "lucide-react";
function Bookshelf() {
  const [selectedBook, setSelectedBook] = useState7(null);
  const [searchQuery, setSearchQuery] = useState7("");
  const [activeGenre, setActiveGenre] = useState7("All");
  const [activeMood, setActiveMood] = useState7("All");
  const [sortBy, setSortBy] = useState7("highest");
  const [showFilters, setShowFilters] = useState7(false);
  const [viewMode, setViewMode] = useState7("grid");
  const [currentPage, setCurrentPage] = useState7(1);
  const ITEMS_PER_PAGE2 = 12;
  const [isSortOpen, setIsSortOpen] = useState7(false);
  const sortRef = useRef2(null);
  const [books, setBooks] = useState7([]);
  const [genres, setGenres] = useState7(["All"]);
  const [moods, setMoods] = useState7(["All"]);
  const [pagination, setPagination] = useState7({ page: 1, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState7(true);
  const [error, setError] = useState7(null);
  const searchTimerRef = useRef2(null);
  const [debouncedSearch, setDebouncedSearch] = useState7("");
  useEffect6(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect6(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(searchTimerRef.current);
  }, [searchQuery]);
  useEffect6(() => {
    setCurrentPage(1);
  }, [debouncedSearch, activeGenre, activeMood, sortBy]);
  useEffect6(() => {
    fetchGenres().then(setGenres).catch(() => {
    });
    fetchMoods().then(setMoods).catch(() => {
    });
  }, []);
  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBooks({
        genre: activeGenre,
        mood: activeMood,
        search: debouncedSearch,
        sort: sortBy,
        page: currentPage,
        limit: ITEMS_PER_PAGE2
      });
      setBooks(data.books);
      setPagination(data.pagination);
    } catch (err) {
      setError("Failed to load books. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeGenre, activeMood, debouncedSearch, sortBy, currentPage]);
  useEffect6(() => {
    loadBooks();
  }, [loadBooks]);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const resultsSection = document.getElementById("bookshelf-controls");
    if (resultsSection) {
      const topPos = resultsSection.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: topPos, behavior: "smooth" });
    }
  };
  const clearFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setActiveGenre("All");
    setActiveMood("All");
    setSortBy("highest");
  };
  const hasActiveFilters = searchQuery || activeGenre !== "All" || activeMood !== "All";
  const sortLabels = {
    highest: "Highest Rated",
    lowest: "Lowest Rated",
    newest: "Most Recent",
    oldest: "Oldest First",
    title: "A \u2014 Z"
  };
  return /* @__PURE__ */ React.createElement("div", { className: "page-wrapper" }, /* @__PURE__ */ React.createElement("section", { className: "bookshelf-hero", id: "bookshelf-hero" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("span", { className: "section-label" }, "The Collection"), /* @__PURE__ */ React.createElement("h1", { className: "section-title" }, "The Bookshelf"), /* @__PURE__ */ React.createElement("p", { className: "section-subtitle" }, "Every book we've read, reviewed, and loved \u2014 searchable by genre, mood, and more."))), /* @__PURE__ */ React.createElement("section", { className: "bookshelf-controls", id: "bookshelf-controls" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "bookshelf-controls__top" }, /* @__PURE__ */ React.createElement("div", { className: "bookshelf-search" }, /* @__PURE__ */ React.createElement(Search2, { size: 18, className: "bookshelf-search__icon" }), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "Search by title, author, or genre...",
      value: searchQuery,
      onChange: (e) => setSearchQuery(e.target.value),
      className: "bookshelf-search__input",
      id: "bookshelf-search-input"
    }
  ), searchQuery && /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "bookshelf-search__clear",
      onClick: () => setSearchQuery(""),
      "aria-label": "Clear search"
    },
    /* @__PURE__ */ React.createElement(X3, { size: 16 })
  )), /* @__PURE__ */ React.createElement("div", { className: "bookshelf-controls__right" }, /* @__PURE__ */ React.createElement("div", { className: "bookshelf-sort-container", ref: sortRef }, /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "bookshelf-sort-trigger",
      onClick: () => setIsSortOpen(!isSortOpen),
      id: "bookshelf-sort-trigger"
    },
    /* @__PURE__ */ React.createElement("span", null, sortLabels[sortBy]),
    /* @__PURE__ */ React.createElement(ChevronDown, { size: 14, className: isSortOpen ? "rotate" : "" })
  ), isSortOpen && /* @__PURE__ */ React.createElement("div", { className: "bookshelf-sort-dropdown glass-card animate-fade-in" }, Object.entries(sortLabels).map(([key, label]) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key,
      className: `bookshelf-sort-option ${sortBy === key ? "active" : ""}`,
      onClick: () => {
        setSortBy(key);
        setIsSortOpen(false);
      }
    },
    label
  )))), /* @__PURE__ */ React.createElement("div", { className: "bookshelf-view-toggle" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      className: `btn btn-ghost ${viewMode === "grid" ? "active" : ""}`,
      onClick: () => setViewMode("grid"),
      "aria-label": "Grid View"
    },
    /* @__PURE__ */ React.createElement(LayoutGrid, { size: 16 })
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: `btn btn-ghost ${viewMode === "list" ? "active" : ""}`,
      onClick: () => setViewMode("list"),
      "aria-label": "List View"
    },
    /* @__PURE__ */ React.createElement(List, { size: 16 })
  )), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: `bookshelf-filter-toggle btn btn-secondary ${showFilters ? "active" : ""}`,
      onClick: () => setShowFilters(!showFilters),
      id: "bookshelf-filter-toggle"
    },
    /* @__PURE__ */ React.createElement(SlidersHorizontal, { size: 16 }),
    "Filters"
  ))), hasActiveFilters && /* @__PURE__ */ React.createElement("div", { className: "bookshelf-active-filters animate-fade-in" }, /* @__PURE__ */ React.createElement("span", { className: "bookshelf-active-filters__label" }, "Active Filters:"), searchQuery && /* @__PURE__ */ React.createElement("button", { className: "bookshelf-filter-pill", onClick: () => setSearchQuery("") }, '"', searchQuery, '" ', /* @__PURE__ */ React.createElement(X3, { size: 12 })), activeGenre !== "All" && /* @__PURE__ */ React.createElement("button", { className: "bookshelf-filter-pill", onClick: () => setActiveGenre("All") }, activeGenre, " ", /* @__PURE__ */ React.createElement(X3, { size: 12 })), activeMood !== "All" && /* @__PURE__ */ React.createElement("button", { className: "bookshelf-filter-pill", onClick: () => setActiveMood("All") }, activeMood, " ", /* @__PURE__ */ React.createElement(X3, { size: 12 })), /* @__PURE__ */ React.createElement("button", { className: "bookshelf-filter-clear-all btn btn-ghost", onClick: clearFilters }, "Clear All")), /* @__PURE__ */ React.createElement("div", { className: `bookshelf-filters ${showFilters ? "bookshelf-filters--open" : ""}` }, /* @__PURE__ */ React.createElement("div", { className: "bookshelf-filters__group" }, /* @__PURE__ */ React.createElement("h4", null, "Genre"), /* @__PURE__ */ React.createElement("div", { className: "bookshelf-filters__tags" }, genres.map((g) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: g,
      className: `bookshelf-filters__tag ${activeGenre === g ? "active" : ""}`,
      onClick: () => setActiveGenre(g),
      id: `genre-filter-${g.toLowerCase()}`
    },
    g
  )))), /* @__PURE__ */ React.createElement("div", { className: "bookshelf-filters__group" }, /* @__PURE__ */ React.createElement("h4", null, "Mood"), /* @__PURE__ */ React.createElement("div", { className: "bookshelf-filters__tags" }, moods.slice(0, 12).map((m) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: m,
      className: `bookshelf-filters__tag ${activeMood === m ? "active" : ""}`,
      onClick: () => setActiveMood(m),
      id: `mood-filter-${m.toLowerCase()}`
    },
    m
  )))), hasActiveFilters && /* @__PURE__ */ React.createElement("button", { className: "bookshelf-filters__clear btn btn-ghost", onClick: clearFilters }, /* @__PURE__ */ React.createElement(X3, { size: 14 }), " Clear all filters")))), /* @__PURE__ */ React.createElement("section", { className: "section bookshelf-results", id: "bookshelf-results" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("p", { className: "bookshelf-results__count" }, "Showing ", /* @__PURE__ */ React.createElement("strong", null, pagination.total), " ", pagination.total === 1 ? "book" : "books", hasActiveFilters && /* @__PURE__ */ React.createElement("span", { className: "bookshelf-results__filtered" }, " (filtered)")), loading ? /* @__PURE__ */ React.createElement("div", { className: "bookshelf-loading animate-fade-in" }, /* @__PURE__ */ React.createElement(Loader, { size: 32, className: "bookshelf-loading__spinner" }), /* @__PURE__ */ React.createElement("p", null, "Loading the collection...")) : error ? /* @__PURE__ */ React.createElement("div", { className: "bookshelf-empty glass-card animate-fade-in-up" }, /* @__PURE__ */ React.createElement("h3", null, "Something went wrong"), /* @__PURE__ */ React.createElement("p", null, error), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary", onClick: loadBooks }, "Try Again")) : books.length > 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: `bookshelf-results-container ${viewMode === "list" ? "bookshelf-list" : "bookshelf-grid"}` }, books.map((book, i) => /* @__PURE__ */ React.createElement(BookCard, { key: book.id, book, index: i, onClick: setSelectedBook, viewMode }))), pagination.totalPages > 1 && /* @__PURE__ */ React.createElement("div", { className: "bookshelf-pagination" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn btn-ghost bookshelf-page-btn",
      onClick: () => handlePageChange(Math.max(1, currentPage - 1)),
      disabled: currentPage === 1,
      "aria-label": "Previous page"
    },
    /* @__PURE__ */ React.createElement(ChevronLeft, { size: 16 })
  ), Array.from({ length: pagination.totalPages }).map((_, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: i + 1,
      className: `bookshelf-page-btn ${currentPage === i + 1 ? "active" : ""}`,
      onClick: () => handlePageChange(i + 1),
      "aria-label": `Page ${i + 1}`
    },
    i + 1
  )), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn btn-ghost bookshelf-page-btn",
      onClick: () => handlePageChange(Math.min(pagination.totalPages, currentPage + 1)),
      disabled: currentPage === pagination.totalPages,
      "aria-label": "Next page"
    },
    /* @__PURE__ */ React.createElement(ChevronRight2, { size: 16 })
  ))) : /* @__PURE__ */ React.createElement("div", { className: "bookshelf-empty glass-card animate-fade-in-up" }, /* @__PURE__ */ React.createElement("div", { className: "bookshelf-empty__icon-wrapper" }, /* @__PURE__ */ React.createElement(LibraryBig, { size: 48, strokeWidth: 1, className: "bookshelf-empty__icon" })), /* @__PURE__ */ React.createElement("h3", null, "No books found"), /* @__PURE__ */ React.createElement("p", null, "We couldn't find any reads matching your current filters."), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary", onClick: clearFilters, id: "empty-clear-filters-btn" }, "Clear All Filters")))), selectedBook && /* @__PURE__ */ React.createElement(BookModal, { book: selectedBook, onClose: () => setSelectedBook(null) }));
}

// src/pages/Recommendations/Recommendations.jsx
import { useState as useState8, useEffect as useEffect7, useRef as useRef3 } from "react";
import * as LucideIcons from "lucide-react";
import { ArrowRight as ArrowRight3, ArrowLeft as ArrowLeft2, Sparkles as Sparkles2, RotateCcw, BookOpen as BookOpen5, Share2, BookmarkPlus as BookmarkPlus2, Download } from "lucide-react";

// node_modules/html-to-image/es/util.js
function resolveUrl(url, baseUrl) {
  if (url.match(/^[a-z]+:\/\//i)) {
    return url;
  }
  if (url.match(/^\/\//)) {
    return window.location.protocol + url;
  }
  if (url.match(/^[a-z]+:/i)) {
    return url;
  }
  const doc = document.implementation.createHTMLDocument();
  const base = doc.createElement("base");
  const a = doc.createElement("a");
  doc.head.appendChild(base);
  doc.body.appendChild(a);
  if (baseUrl) {
    base.href = baseUrl;
  }
  a.href = url;
  return a.href;
}
var uuid = /* @__PURE__ */ (() => {
  let counter = 0;
  const random = () => (
    // eslint-disable-next-line no-bitwise
    `0000${(Math.random() * 36 ** 4 << 0).toString(36)}`.slice(-4)
  );
  return () => {
    counter += 1;
    return `u${random()}${counter}`;
  };
})();
function toArray(arrayLike) {
  const arr = [];
  for (let i = 0, l = arrayLike.length; i < l; i++) {
    arr.push(arrayLike[i]);
  }
  return arr;
}
var styleProps = null;
function getStyleProperties(options = {}) {
  if (styleProps) {
    return styleProps;
  }
  if (options.includeStyleProperties) {
    styleProps = options.includeStyleProperties;
    return styleProps;
  }
  styleProps = toArray(window.getComputedStyle(document.documentElement));
  return styleProps;
}
function px(node, styleProperty) {
  const win = node.ownerDocument.defaultView || window;
  const val = win.getComputedStyle(node).getPropertyValue(styleProperty);
  return val ? parseFloat(val.replace("px", "")) : 0;
}
function getNodeWidth(node) {
  const leftBorder = px(node, "border-left-width");
  const rightBorder = px(node, "border-right-width");
  return node.clientWidth + leftBorder + rightBorder;
}
function getNodeHeight(node) {
  const topBorder = px(node, "border-top-width");
  const bottomBorder = px(node, "border-bottom-width");
  return node.clientHeight + topBorder + bottomBorder;
}
function getImageSize(targetNode, options = {}) {
  const width = options.width || getNodeWidth(targetNode);
  const height = options.height || getNodeHeight(targetNode);
  return { width, height };
}
function getPixelRatio() {
  let ratio;
  let FINAL_PROCESS;
  try {
    FINAL_PROCESS = process;
  } catch (e) {
  }
  const val = FINAL_PROCESS && FINAL_PROCESS.env ? FINAL_PROCESS.env.devicePixelRatio : null;
  if (val) {
    ratio = parseInt(val, 10);
    if (Number.isNaN(ratio)) {
      ratio = 1;
    }
  }
  return ratio || window.devicePixelRatio || 1;
}
var canvasDimensionLimit = 16384;
function checkCanvasDimensions(canvas) {
  if (canvas.width > canvasDimensionLimit || canvas.height > canvasDimensionLimit) {
    if (canvas.width > canvasDimensionLimit && canvas.height > canvasDimensionLimit) {
      if (canvas.width > canvas.height) {
        canvas.height *= canvasDimensionLimit / canvas.width;
        canvas.width = canvasDimensionLimit;
      } else {
        canvas.width *= canvasDimensionLimit / canvas.height;
        canvas.height = canvasDimensionLimit;
      }
    } else if (canvas.width > canvasDimensionLimit) {
      canvas.height *= canvasDimensionLimit / canvas.width;
      canvas.width = canvasDimensionLimit;
    } else {
      canvas.width *= canvasDimensionLimit / canvas.height;
      canvas.height = canvasDimensionLimit;
    }
  }
}
function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      img.decode().then(() => {
        requestAnimationFrame(() => resolve(img));
      });
    };
    img.onerror = reject;
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.src = url;
  });
}
async function svgToDataURL(svg) {
  return Promise.resolve().then(() => new XMLSerializer().serializeToString(svg)).then(encodeURIComponent).then((html) => `data:image/svg+xml;charset=utf-8,${html}`);
}
async function nodeToDataURL(node, width, height) {
  const xmlns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(xmlns, "svg");
  const foreignObject = document.createElementNS(xmlns, "foreignObject");
  svg.setAttribute("width", `${width}`);
  svg.setAttribute("height", `${height}`);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  foreignObject.setAttribute("width", "100%");
  foreignObject.setAttribute("height", "100%");
  foreignObject.setAttribute("x", "0");
  foreignObject.setAttribute("y", "0");
  foreignObject.setAttribute("externalResourcesRequired", "true");
  svg.appendChild(foreignObject);
  foreignObject.appendChild(node);
  return svgToDataURL(svg);
}
var isInstanceOfElement = (node, instance) => {
  if (node instanceof instance)
    return true;
  const nodePrototype = Object.getPrototypeOf(node);
  if (nodePrototype === null)
    return false;
  return nodePrototype.constructor.name === instance.name || isInstanceOfElement(nodePrototype, instance);
};

// node_modules/html-to-image/es/clone-pseudos.js
function formatCSSText(style) {
  const content = style.getPropertyValue("content");
  return `${style.cssText} content: '${content.replace(/'|"/g, "")}';`;
}
function formatCSSProperties(style, options) {
  return getStyleProperties(options).map((name) => {
    const value = style.getPropertyValue(name);
    const priority = style.getPropertyPriority(name);
    return `${name}: ${value}${priority ? " !important" : ""};`;
  }).join(" ");
}
function getPseudoElementStyle(className, pseudo, style, options) {
  const selector = `.${className}:${pseudo}`;
  const cssText = style.cssText ? formatCSSText(style) : formatCSSProperties(style, options);
  return document.createTextNode(`${selector}{${cssText}}`);
}
function clonePseudoElement(nativeNode, clonedNode, pseudo, options) {
  const style = window.getComputedStyle(nativeNode, pseudo);
  const content = style.getPropertyValue("content");
  if (content === "" || content === "none") {
    return;
  }
  const className = uuid();
  try {
    clonedNode.className = `${clonedNode.className} ${className}`;
  } catch (err) {
    return;
  }
  const styleElement = document.createElement("style");
  styleElement.appendChild(getPseudoElementStyle(className, pseudo, style, options));
  clonedNode.appendChild(styleElement);
}
function clonePseudoElements(nativeNode, clonedNode, options) {
  clonePseudoElement(nativeNode, clonedNode, ":before", options);
  clonePseudoElement(nativeNode, clonedNode, ":after", options);
}

// node_modules/html-to-image/es/mimes.js
var WOFF = "application/font-woff";
var JPEG = "image/jpeg";
var mimes = {
  woff: WOFF,
  woff2: WOFF,
  ttf: "application/font-truetype",
  eot: "application/vnd.ms-fontobject",
  png: "image/png",
  jpg: JPEG,
  jpeg: JPEG,
  gif: "image/gif",
  tiff: "image/tiff",
  svg: "image/svg+xml",
  webp: "image/webp"
};
function getExtension(url) {
  const match = /\.([^./]*?)$/g.exec(url);
  return match ? match[1] : "";
}
function getMimeType(url) {
  const extension = getExtension(url).toLowerCase();
  return mimes[extension] || "";
}

// node_modules/html-to-image/es/dataurl.js
function getContentFromDataUrl(dataURL) {
  return dataURL.split(/,/)[1];
}
function isDataUrl(url) {
  return url.search(/^(data:)/) !== -1;
}
function makeDataUrl(content, mimeType) {
  return `data:${mimeType};base64,${content}`;
}
async function fetchAsDataURL(url, init, process2) {
  const res = await fetch(url, init);
  if (res.status === 404) {
    throw new Error(`Resource "${res.url}" not found`);
  }
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onloadend = () => {
      try {
        resolve(process2({ res, result: reader.result }));
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsDataURL(blob);
  });
}
var cache = {};
function getCacheKey(url, contentType, includeQueryParams) {
  let key = url.replace(/\?.*/, "");
  if (includeQueryParams) {
    key = url;
  }
  if (/ttf|otf|eot|woff2?/i.test(key)) {
    key = key.replace(/.*\//, "");
  }
  return contentType ? `[${contentType}]${key}` : key;
}
async function resourceToDataURL(resourceUrl, contentType, options) {
  const cacheKey = getCacheKey(resourceUrl, contentType, options.includeQueryParams);
  if (cache[cacheKey] != null) {
    return cache[cacheKey];
  }
  if (options.cacheBust) {
    resourceUrl += (/\?/.test(resourceUrl) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime();
  }
  let dataURL;
  try {
    const content = await fetchAsDataURL(resourceUrl, options.fetchRequestInit, ({ res, result }) => {
      if (!contentType) {
        contentType = res.headers.get("Content-Type") || "";
      }
      return getContentFromDataUrl(result);
    });
    dataURL = makeDataUrl(content, contentType);
  } catch (error) {
    dataURL = options.imagePlaceholder || "";
    let msg = `Failed to fetch resource: ${resourceUrl}`;
    if (error) {
      msg = typeof error === "string" ? error : error.message;
    }
    if (msg) {
      console.warn(msg);
    }
  }
  cache[cacheKey] = dataURL;
  return dataURL;
}

// node_modules/html-to-image/es/clone-node.js
async function cloneCanvasElement(canvas) {
  const dataURL = canvas.toDataURL();
  if (dataURL === "data:,") {
    return canvas.cloneNode(false);
  }
  return createImage(dataURL);
}
async function cloneVideoElement(video, options) {
  if (video.currentSrc) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL2 = canvas.toDataURL();
    return createImage(dataURL2);
  }
  const poster = video.poster;
  const contentType = getMimeType(poster);
  const dataURL = await resourceToDataURL(poster, contentType, options);
  return createImage(dataURL);
}
async function cloneIFrameElement(iframe, options) {
  var _a;
  try {
    if ((_a = iframe === null || iframe === void 0 ? void 0 : iframe.contentDocument) === null || _a === void 0 ? void 0 : _a.body) {
      return await cloneNode(iframe.contentDocument.body, options, true);
    }
  } catch (_b) {
  }
  return iframe.cloneNode(false);
}
async function cloneSingleNode(node, options) {
  if (isInstanceOfElement(node, HTMLCanvasElement)) {
    return cloneCanvasElement(node);
  }
  if (isInstanceOfElement(node, HTMLVideoElement)) {
    return cloneVideoElement(node, options);
  }
  if (isInstanceOfElement(node, HTMLIFrameElement)) {
    return cloneIFrameElement(node, options);
  }
  return node.cloneNode(isSVGElement(node));
}
var isSlotElement = (node) => node.tagName != null && node.tagName.toUpperCase() === "SLOT";
var isSVGElement = (node) => node.tagName != null && node.tagName.toUpperCase() === "SVG";
async function cloneChildren(nativeNode, clonedNode, options) {
  var _a, _b;
  if (isSVGElement(clonedNode)) {
    return clonedNode;
  }
  let children = [];
  if (isSlotElement(nativeNode) && nativeNode.assignedNodes) {
    children = toArray(nativeNode.assignedNodes());
  } else if (isInstanceOfElement(nativeNode, HTMLIFrameElement) && ((_a = nativeNode.contentDocument) === null || _a === void 0 ? void 0 : _a.body)) {
    children = toArray(nativeNode.contentDocument.body.childNodes);
  } else {
    children = toArray(((_b = nativeNode.shadowRoot) !== null && _b !== void 0 ? _b : nativeNode).childNodes);
  }
  if (children.length === 0 || isInstanceOfElement(nativeNode, HTMLVideoElement)) {
    return clonedNode;
  }
  await children.reduce((deferred, child) => deferred.then(() => cloneNode(child, options)).then((clonedChild) => {
    if (clonedChild) {
      clonedNode.appendChild(clonedChild);
    }
  }), Promise.resolve());
  return clonedNode;
}
function cloneCSSStyle(nativeNode, clonedNode, options) {
  const targetStyle = clonedNode.style;
  if (!targetStyle) {
    return;
  }
  const sourceStyle = window.getComputedStyle(nativeNode);
  if (sourceStyle.cssText) {
    targetStyle.cssText = sourceStyle.cssText;
    targetStyle.transformOrigin = sourceStyle.transformOrigin;
  } else {
    getStyleProperties(options).forEach((name) => {
      let value = sourceStyle.getPropertyValue(name);
      if (name === "font-size" && value.endsWith("px")) {
        const reducedFont = Math.floor(parseFloat(value.substring(0, value.length - 2))) - 0.1;
        value = `${reducedFont}px`;
      }
      if (isInstanceOfElement(nativeNode, HTMLIFrameElement) && name === "display" && value === "inline") {
        value = "block";
      }
      if (name === "d" && clonedNode.getAttribute("d")) {
        value = `path(${clonedNode.getAttribute("d")})`;
      }
      targetStyle.setProperty(name, value, sourceStyle.getPropertyPriority(name));
    });
  }
}
function cloneInputValue(nativeNode, clonedNode) {
  if (isInstanceOfElement(nativeNode, HTMLTextAreaElement)) {
    clonedNode.innerHTML = nativeNode.value;
  }
  if (isInstanceOfElement(nativeNode, HTMLInputElement)) {
    clonedNode.setAttribute("value", nativeNode.value);
  }
}
function cloneSelectValue(nativeNode, clonedNode) {
  if (isInstanceOfElement(nativeNode, HTMLSelectElement)) {
    const clonedSelect = clonedNode;
    const selectedOption = Array.from(clonedSelect.children).find((child) => nativeNode.value === child.getAttribute("value"));
    if (selectedOption) {
      selectedOption.setAttribute("selected", "");
    }
  }
}
function decorate(nativeNode, clonedNode, options) {
  if (isInstanceOfElement(clonedNode, Element)) {
    cloneCSSStyle(nativeNode, clonedNode, options);
    clonePseudoElements(nativeNode, clonedNode, options);
    cloneInputValue(nativeNode, clonedNode);
    cloneSelectValue(nativeNode, clonedNode);
  }
  return clonedNode;
}
async function ensureSVGSymbols(clone, options) {
  const uses = clone.querySelectorAll ? clone.querySelectorAll("use") : [];
  if (uses.length === 0) {
    return clone;
  }
  const processedDefs = {};
  for (let i = 0; i < uses.length; i++) {
    const use = uses[i];
    const id = use.getAttribute("xlink:href");
    if (id) {
      const exist = clone.querySelector(id);
      const definition = document.querySelector(id);
      if (!exist && definition && !processedDefs[id]) {
        processedDefs[id] = await cloneNode(definition, options, true);
      }
    }
  }
  const nodes = Object.values(processedDefs);
  if (nodes.length) {
    const ns = "http://www.w3.org/1999/xhtml";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("xmlns", ns);
    svg.style.position = "absolute";
    svg.style.width = "0";
    svg.style.height = "0";
    svg.style.overflow = "hidden";
    svg.style.display = "none";
    const defs = document.createElementNS(ns, "defs");
    svg.appendChild(defs);
    for (let i = 0; i < nodes.length; i++) {
      defs.appendChild(nodes[i]);
    }
    clone.appendChild(svg);
  }
  return clone;
}
async function cloneNode(node, options, isRoot) {
  if (!isRoot && options.filter && !options.filter(node)) {
    return null;
  }
  return Promise.resolve(node).then((clonedNode) => cloneSingleNode(clonedNode, options)).then((clonedNode) => cloneChildren(node, clonedNode, options)).then((clonedNode) => decorate(node, clonedNode, options)).then((clonedNode) => ensureSVGSymbols(clonedNode, options));
}

// node_modules/html-to-image/es/embed-resources.js
var URL_REGEX = /url\((['"]?)([^'"]+?)\1\)/g;
var URL_WITH_FORMAT_REGEX = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g;
var FONT_SRC_REGEX = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function toRegex(url) {
  const escaped = url.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(`(url\\(['"]?)(${escaped})(['"]?\\))`, "g");
}
function parseURLs(cssText) {
  const urls = [];
  cssText.replace(URL_REGEX, (raw, quotation, url) => {
    urls.push(url);
    return raw;
  });
  return urls.filter((url) => !isDataUrl(url));
}
async function embed(cssText, resourceURL, baseURL, options, getContentFromUrl) {
  try {
    const resolvedURL = baseURL ? resolveUrl(resourceURL, baseURL) : resourceURL;
    const contentType = getMimeType(resourceURL);
    let dataURL;
    if (getContentFromUrl) {
      const content = await getContentFromUrl(resolvedURL);
      dataURL = makeDataUrl(content, contentType);
    } else {
      dataURL = await resourceToDataURL(resolvedURL, contentType, options);
    }
    return cssText.replace(toRegex(resourceURL), `$1${dataURL}$3`);
  } catch (error) {
  }
  return cssText;
}
function filterPreferredFontFormat(str, { preferredFontFormat }) {
  return !preferredFontFormat ? str : str.replace(FONT_SRC_REGEX, (match) => {
    while (true) {
      const [src, , format] = URL_WITH_FORMAT_REGEX.exec(match) || [];
      if (!format) {
        return "";
      }
      if (format === preferredFontFormat) {
        return `src: ${src};`;
      }
    }
  });
}
function shouldEmbed(url) {
  return url.search(URL_REGEX) !== -1;
}
async function embedResources(cssText, baseUrl, options) {
  if (!shouldEmbed(cssText)) {
    return cssText;
  }
  const filteredCSSText = filterPreferredFontFormat(cssText, options);
  const urls = parseURLs(filteredCSSText);
  return urls.reduce((deferred, url) => deferred.then((css) => embed(css, url, baseUrl, options)), Promise.resolve(filteredCSSText));
}

// node_modules/html-to-image/es/embed-images.js
async function embedProp(propName, node, options) {
  var _a;
  const propValue = (_a = node.style) === null || _a === void 0 ? void 0 : _a.getPropertyValue(propName);
  if (propValue) {
    const cssString = await embedResources(propValue, null, options);
    node.style.setProperty(propName, cssString, node.style.getPropertyPriority(propName));
    return true;
  }
  return false;
}
async function embedBackground(clonedNode, options) {
  ;
  await embedProp("background", clonedNode, options) || await embedProp("background-image", clonedNode, options);
  await embedProp("mask", clonedNode, options) || await embedProp("-webkit-mask", clonedNode, options) || await embedProp("mask-image", clonedNode, options) || await embedProp("-webkit-mask-image", clonedNode, options);
}
async function embedImageNode(clonedNode, options) {
  const isImageElement = isInstanceOfElement(clonedNode, HTMLImageElement);
  if (!(isImageElement && !isDataUrl(clonedNode.src)) && !(isInstanceOfElement(clonedNode, SVGImageElement) && !isDataUrl(clonedNode.href.baseVal))) {
    return;
  }
  const url = isImageElement ? clonedNode.src : clonedNode.href.baseVal;
  const dataURL = await resourceToDataURL(url, getMimeType(url), options);
  await new Promise((resolve, reject) => {
    clonedNode.onload = resolve;
    clonedNode.onerror = options.onImageErrorHandler ? (...attributes) => {
      try {
        resolve(options.onImageErrorHandler(...attributes));
      } catch (error) {
        reject(error);
      }
    } : reject;
    const image = clonedNode;
    if (image.decode) {
      image.decode = resolve;
    }
    if (image.loading === "lazy") {
      image.loading = "eager";
    }
    if (isImageElement) {
      clonedNode.srcset = "";
      clonedNode.src = dataURL;
    } else {
      clonedNode.href.baseVal = dataURL;
    }
  });
}
async function embedChildren(clonedNode, options) {
  const children = toArray(clonedNode.childNodes);
  const deferreds = children.map((child) => embedImages(child, options));
  await Promise.all(deferreds).then(() => clonedNode);
}
async function embedImages(clonedNode, options) {
  if (isInstanceOfElement(clonedNode, Element)) {
    await embedBackground(clonedNode, options);
    await embedImageNode(clonedNode, options);
    await embedChildren(clonedNode, options);
  }
}

// node_modules/html-to-image/es/apply-style.js
function applyStyle(node, options) {
  const { style } = node;
  if (options.backgroundColor) {
    style.backgroundColor = options.backgroundColor;
  }
  if (options.width) {
    style.width = `${options.width}px`;
  }
  if (options.height) {
    style.height = `${options.height}px`;
  }
  const manual = options.style;
  if (manual != null) {
    Object.keys(manual).forEach((key) => {
      style[key] = manual[key];
    });
  }
  return node;
}

// node_modules/html-to-image/es/embed-webfonts.js
var cssFetchCache = {};
async function fetchCSS(url) {
  let cache2 = cssFetchCache[url];
  if (cache2 != null) {
    return cache2;
  }
  const res = await fetch(url);
  const cssText = await res.text();
  cache2 = { url, cssText };
  cssFetchCache[url] = cache2;
  return cache2;
}
async function embedFonts(data, options) {
  let cssText = data.cssText;
  const regexUrl = /url\(["']?([^"')]+)["']?\)/g;
  const fontLocs = cssText.match(/url\([^)]+\)/g) || [];
  const loadFonts = fontLocs.map(async (loc) => {
    let url = loc.replace(regexUrl, "$1");
    if (!url.startsWith("https://")) {
      url = new URL(url, data.url).href;
    }
    return fetchAsDataURL(url, options.fetchRequestInit, ({ result }) => {
      cssText = cssText.replace(loc, `url(${result})`);
      return [loc, result];
    });
  });
  return Promise.all(loadFonts).then(() => cssText);
}
function parseCSS(source) {
  if (source == null) {
    return [];
  }
  const result = [];
  const commentsRegex = /(\/\*[\s\S]*?\*\/)/gi;
  let cssText = source.replace(commentsRegex, "");
  const keyframesRegex = new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})", "gi");
  while (true) {
    const matches = keyframesRegex.exec(cssText);
    if (matches === null) {
      break;
    }
    result.push(matches[0]);
  }
  cssText = cssText.replace(keyframesRegex, "");
  const importRegex = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi;
  const combinedCSSRegex = "((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})";
  const unifiedRegex = new RegExp(combinedCSSRegex, "gi");
  while (true) {
    let matches = importRegex.exec(cssText);
    if (matches === null) {
      matches = unifiedRegex.exec(cssText);
      if (matches === null) {
        break;
      } else {
        importRegex.lastIndex = unifiedRegex.lastIndex;
      }
    } else {
      unifiedRegex.lastIndex = importRegex.lastIndex;
    }
    result.push(matches[0]);
  }
  return result;
}
async function getCSSRules(styleSheets, options) {
  const ret = [];
  const deferreds = [];
  styleSheets.forEach((sheet) => {
    if ("cssRules" in sheet) {
      try {
        toArray(sheet.cssRules || []).forEach((item, index) => {
          if (item.type === CSSRule.IMPORT_RULE) {
            let importIndex = index + 1;
            const url = item.href;
            const deferred = fetchCSS(url).then((metadata) => embedFonts(metadata, options)).then((cssText) => parseCSS(cssText).forEach((rule) => {
              try {
                sheet.insertRule(rule, rule.startsWith("@import") ? importIndex += 1 : sheet.cssRules.length);
              } catch (error) {
                console.error("Error inserting rule from remote css", {
                  rule,
                  error
                });
              }
            })).catch((e) => {
              console.error("Error loading remote css", e.toString());
            });
            deferreds.push(deferred);
          }
        });
      } catch (e) {
        const inline = styleSheets.find((a) => a.href == null) || document.styleSheets[0];
        if (sheet.href != null) {
          deferreds.push(fetchCSS(sheet.href).then((metadata) => embedFonts(metadata, options)).then((cssText) => parseCSS(cssText).forEach((rule) => {
            inline.insertRule(rule, inline.cssRules.length);
          })).catch((err) => {
            console.error("Error loading remote stylesheet", err);
          }));
        }
        console.error("Error inlining remote css file", e);
      }
    }
  });
  return Promise.all(deferreds).then(() => {
    styleSheets.forEach((sheet) => {
      if ("cssRules" in sheet) {
        try {
          toArray(sheet.cssRules || []).forEach((item) => {
            ret.push(item);
          });
        } catch (e) {
          console.error(`Error while reading CSS rules from ${sheet.href}`, e);
        }
      }
    });
    return ret;
  });
}
function getWebFontRules(cssRules) {
  return cssRules.filter((rule) => rule.type === CSSRule.FONT_FACE_RULE).filter((rule) => shouldEmbed(rule.style.getPropertyValue("src")));
}
async function parseWebFontRules(node, options) {
  if (node.ownerDocument == null) {
    throw new Error("Provided element is not within a Document");
  }
  const styleSheets = toArray(node.ownerDocument.styleSheets);
  const cssRules = await getCSSRules(styleSheets, options);
  return getWebFontRules(cssRules);
}
function normalizeFontFamily(font) {
  return font.trim().replace(/["']/g, "");
}
function getUsedFonts(node) {
  const fonts = /* @__PURE__ */ new Set();
  function traverse(node2) {
    const fontFamily = node2.style.fontFamily || getComputedStyle(node2).fontFamily;
    fontFamily.split(",").forEach((font) => {
      fonts.add(normalizeFontFamily(font));
    });
    Array.from(node2.children).forEach((child) => {
      if (child instanceof HTMLElement) {
        traverse(child);
      }
    });
  }
  traverse(node);
  return fonts;
}
async function getWebFontCSS(node, options) {
  const rules = await parseWebFontRules(node, options);
  const usedFonts = getUsedFonts(node);
  const cssTexts = await Promise.all(rules.filter((rule) => usedFonts.has(normalizeFontFamily(rule.style.fontFamily))).map((rule) => {
    const baseUrl = rule.parentStyleSheet ? rule.parentStyleSheet.href : null;
    return embedResources(rule.cssText, baseUrl, options);
  }));
  return cssTexts.join("\n");
}
async function embedWebFonts(clonedNode, options) {
  const cssText = options.fontEmbedCSS != null ? options.fontEmbedCSS : options.skipFonts ? null : await getWebFontCSS(clonedNode, options);
  if (cssText) {
    const styleNode = document.createElement("style");
    const sytleContent = document.createTextNode(cssText);
    styleNode.appendChild(sytleContent);
    if (clonedNode.firstChild) {
      clonedNode.insertBefore(styleNode, clonedNode.firstChild);
    } else {
      clonedNode.appendChild(styleNode);
    }
  }
}

// node_modules/html-to-image/es/index.js
async function toSvg(node, options = {}) {
  const { width, height } = getImageSize(node, options);
  const clonedNode = await cloneNode(node, options, true);
  await embedWebFonts(clonedNode, options);
  await embedImages(clonedNode, options);
  applyStyle(clonedNode, options);
  const datauri = await nodeToDataURL(clonedNode, width, height);
  return datauri;
}
async function toCanvas(node, options = {}) {
  const { width, height } = getImageSize(node, options);
  const svg = await toSvg(node, options);
  const img = await createImage(svg);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const ratio = options.pixelRatio || getPixelRatio();
  const canvasWidth = options.canvasWidth || width;
  const canvasHeight = options.canvasHeight || height;
  canvas.width = canvasWidth * ratio;
  canvas.height = canvasHeight * ratio;
  if (!options.skipAutoScale) {
    checkCanvasDimensions(canvas);
  }
  canvas.style.width = `${canvasWidth}`;
  canvas.style.height = `${canvasHeight}`;
  if (options.backgroundColor) {
    context.fillStyle = options.backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}
async function toPng(node, options = {}) {
  const canvas = await toCanvas(node, options);
  return canvas.toDataURL();
}

// src/pages/Recommendations/Recommendations.jsx
import toast3 from "react-hot-toast";

// src/data/books.js
var quizQuestions = [
  {
    id: 1,
    question: "It's a rainy Sunday. What are you reaching for?",
    options: [
      { text: "A warm blanket and hot cocoa", mood: "Cozy", icon: "Coffee" },
      { text: "A puzzle or mystery to solve", mood: "Mysterious", icon: "Search" },
      { text: "Something to make me feel alive", mood: "Thrilling", icon: "Zap" },
      { text: "A good cry (the cathartic kind)", mood: "Bittersweet", icon: "CloudRain" }
    ]
  },
  {
    id: 2,
    question: "Pick a vibe for your next adventure:",
    options: [
      { text: "Ancient temples and whispered prophecies", mood: "Epic", icon: "Landmark" },
      { text: "Starships and alien first contact", mood: "Thrilling", icon: "Rocket" },
      { text: "A crumbling mansion with dark secrets", mood: "Atmospheric", icon: "Ghost" },
      { text: "A small town where everyone knows your name", mood: "Heartwarming", icon: "Home" }
    ]
  },
  {
    id: 3,
    question: "What kind of main character do you root for?",
    options: [
      { text: "The underdog who defies all odds", mood: "Inspiring", icon: "Shield" },
      { text: "The sharp-witted strategist", mood: "Intellectual", icon: "Brain" },
      { text: "The hopeless romantic", mood: "Romantic", icon: "Heart" },
      { text: "The reluctant hero dragged into destiny", mood: "Epic", icon: "Swords" }
    ]
  },
  {
    id: 4,
    question: "How do you want to feel when you close the book?",
    options: [
      { text: "Like I just learned something profound", mood: "Reflective", icon: "Star" },
      { text: "Like I need to hug someone immediately", mood: "Heartwarming", icon: "HeartHandshake" },
      { text: "Like I need to sit in silence for an hour", mood: "Bittersweet", icon: "Moon" },
      { text: "Energized and ready to take on the world", mood: "Empowering", icon: "Flame" }
    ]
  },
  {
    id: 5,
    question: "What's your favorite literary landscape?",
    options: [
      { text: "Magic and high stakes", genre: "Fantasy", icon: "Sparkles" },
      { text: "Modern life and human stories", genre: "Fiction", icon: "Users" },
      { text: "Chilling mysteries and dark corners", genre: "Thriller", icon: "Ghost" },
      { text: "Future tech and space travel", genre: "Sci-Fi", icon: "Rocket" }
    ]
  },
  {
    id: 6,
    question: "How much time do you have for this journey?",
    options: [
      { text: "A quick weekend binge", length: "Short", icon: "Timer" },
      { text: "The perfect standard novel", length: "Medium", icon: "Book" },
      { text: "A massive, epic tome", length: "Long", icon: "Scroll" }
    ]
  },
  {
    id: 7,
    question: "How do you like your story to unfold?",
    options: [
      { text: "A fast-paced thrill ride", pacing: "Fast", icon: "Zap" },
      { text: "A steady, balanced journey", pacing: "Medium", icon: "Activity" },
      { text: "A slow-burn character study", pacing: "Slow", icon: "Coffee" }
    ]
  },
  {
    id: 8,
    question: "Which of these tropes calls to you?",
    options: [
      { text: "A crew of misfits (Found Family)", trope: "Found Family", icon: "Users" },
      { text: "Dark halls and deep secrets (Dark Academia)", trope: "Dark Academia", icon: "BookOpen" },
      { text: "Overcoming the odds (Chosen One/Quest)", trope: "Chosen One", icon: "Swords" },
      { text: "Sparks flying (Enemies to Lovers/Romance)", trope: "Enemies to Lovers", icon: "Heart" }
    ]
  },
  {
    id: 9,
    question: "Is there anything you absolutely want to avoid right now?",
    options: [
      { text: "No Romance, please", dealbreaker: "Romance", icon: "HeartOff" },
      { text: "No Sci-Fi or Fantasy", dealbreaker: "Sci-Fi/Fantasy", icon: "Ghost" },
      { text: "No heavy or sad topics", dealbreaker: "Bittersweet", icon: "CloudRain" },
      { text: "I'm open to anything!", dealbreaker: "None", icon: "Sparkles" }
    ]
  },
  {
    id: 10,
    question: "Finally, what is your biggest priority for this next read?",
    options: [
      { text: "The exact right Vibe/Mood", priority: "mood", icon: "Sparkles" },
      { text: "A specific Genre", priority: "genre", icon: "BookOpen" },
      { text: "A specific Length", priority: "length", icon: "Timer" },
      { text: "Just give me a good book", priority: "none", icon: "Star" }
    ]
  }
];
var timelineEvents = [
  {
    year: "2025",
    title: "The Seed is Planted",
    description: "Started sharing book reviews on Instagram. A community of passionate readers begins to grow.",
    status: "completed",
    icon: "Leaf"
  },
  {
    year: "2026",
    title: "The Readers Index",
    description: "Launched the website as a living archive \u2014 a searchable, curated home for every review and recommendation.",
    status: "current",
    icon: "Monitor"
  },
  {
    year: "",
    title: "The Online Bookshop",
    description: "Opening an e-commerce shop to bring curated reads directly to our community, along with bookish merchandise.",
    status: "upcoming",
    icon: "Package"
  },
  {
    year: "",
    title: "Community Events",
    description: "Hosting book signings, poetry nights, reading clubs, and literary gatherings \u2014 first online, then in person.",
    status: "upcoming",
    icon: "Users"
  },
  {
    year: "",
    title: "The Physical Library",
    description: "The ultimate dream \u2014 a real, physical sanctuary for readers. A place where stories live and breathe in the community.",
    status: "upcoming",
    icon: "Library"
  }
];
var shopProducts = [
  {
    id: 1,
    name: "Literary Bookmarks Collection",
    description: "Handcrafted brass bookmarks with quotes from classic literature.",
    category: "Accessories",
    icon: "Bookmark"
  },
  {
    id: 2,
    name: '"Lost in a Book" Tote Bag',
    description: "Organic cotton tote with our signature illustration. Because you always need room for one more book.",
    category: "Merchandise",
    icon: "ShoppingBag"
  },
  {
    id: 3,
    name: "Chapter One Candle",
    description: "Hand-poured soy candle that smells like old books, vanilla, and the promise of a new story.",
    category: "Home",
    icon: "Flame"
  },
  {
    id: 4,
    name: "Curated Book Box",
    description: "Monthly subscription: a hand-picked book, a bookmark, and a handwritten note from us.",
    category: "Subscription",
    icon: "Package"
  }
];

// src/pages/Recommendations/Recommendations.jsx
function Recommendations() {
  const [quizStarted, setQuizStarted] = useState8(false);
  const [currentQuestion, setCurrentQuestion] = useState8(0);
  const [answers, setAnswers] = useState8([]);
  const [showResults, setShowResults] = useState8(false);
  const [selectedBook, setSelectedBook] = useState8(null);
  const [activeList, setActiveList] = useState8(null);
  const resultsRef = useRef3(null);
  const [isGenerating, setIsGenerating] = useState8(false);
  const [allBooks, setAllBooks] = useState8([]);
  const [curatedLists, setCuratedLists] = useState8([]);
  const [loading, setLoading] = useState8(true);
  useEffect7(() => {
    const loadData = async () => {
      try {
        const [booksData, listsData] = await Promise.all([
          fetchBooks({ limit: 100 }),
          fetchLists()
        ]);
        setAllBooks(booksData.books);
        setCuratedLists(listsData);
      } catch (err) {
        console.error("Failed to load data for recommendations:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  const handleAnswer = (option) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };
  const getRecommendations = () => {
    const moodCounts = {};
    let preferredGenre = null;
    let preferredLength = null;
    let preferredPacing = null;
    let preferredTrope = null;
    let dealbreaker = null;
    let mainPriority = null;
    answers.forEach((ans) => {
      if (ans.mood) moodCounts[ans.mood] = (moodCounts[ans.mood] || 0) + 1;
      if (ans.genre) preferredGenre = ans.genre;
      if (ans.length) preferredLength = ans.length;
      if (ans.pacing) preferredPacing = ans.pacing;
      if (ans.trope) preferredTrope = ans.trope;
      if (ans.dealbreaker) dealbreaker = ans.dealbreaker;
      if (ans.priority) mainPriority = ans.priority;
    });
    const moodWeight = mainPriority === "mood" ? 4 : 2;
    const genreWeight = mainPriority === "genre" ? 10 : 5;
    const lengthWeightPos = mainPriority === "length" ? 6 : 3;
    const lengthWeightNeg = mainPriority === "length" ? 10 : 5;
    const scoredBooks = allBooks.filter((book) => {
      if (dealbreaker === "Romance" && book.genres && book.genres.includes("Romance")) return false;
      if (dealbreaker === "Sci-Fi/Fantasy" && book.genres && (book.genres.includes("Sci-Fi") || book.genres.includes("Fantasy"))) return false;
      if (dealbreaker === "Bittersweet" && book.mood && book.mood.includes("Bittersweet")) return false;
      return true;
    }).map((book) => {
      let score = 0;
      (book.mood || []).forEach((m) => {
        if (moodCounts[m]) score += moodCounts[m] * moodWeight;
      });
      if (preferredGenre && (book.genres || []).includes(preferredGenre)) {
        score += genreWeight;
      }
      if (preferredPacing && book.pacing === preferredPacing) {
        score += 3;
      }
      if (preferredTrope && (book.tropes || []).includes(preferredTrope)) {
        score += 4;
      }
      if (preferredLength) {
        if (preferredLength === "Short" && book.pages < 300) score += lengthWeightPos;
        if (preferredLength === "Short" && book.pages > 500) score -= lengthWeightNeg;
        if (preferredLength === "Medium" && book.pages >= 300 && book.pages <= 450) score += lengthWeightPos;
        if (preferredLength === "Long" && book.pages > 450) score += lengthWeightPos;
        if (preferredLength === "Long" && book.pages < 250) score -= lengthWeightNeg;
      }
      const randomTieBreaker = Math.random() * 0.05;
      score += book.rating * 0.1 + randomTieBreaker;
      return { ...book, score };
    }).filter((b) => b.score > Math.floor(b.rating * 0.1) + 0.05).sort((a, b) => b.score - a.score);
    const top3 = scoredBooks.slice(0, 3);
    const top3Ids = top3.map((b) => b.id);
    const discoveryPool = allBooks.filter((b) => !top3Ids.includes(b.id));
    let discoveryBook = discoveryPool.find((b) => {
      const hasMoodMatch = b.mood && b.mood.some((m) => moodCounts[m] > 0);
      const isDifferentGenre = preferredGenre ? b.genres && !b.genres.includes(preferredGenre) : true;
      return hasMoodMatch && isDifferentGenre && b.rating >= 4;
    });
    if (!discoveryBook && preferredGenre) {
      discoveryBook = discoveryPool.find(
        (b) => b.genres && !b.genres.includes(preferredGenre) && b.rating >= 4
      );
    }
    if (!discoveryBook) {
      discoveryBook = discoveryPool.find((b) => b.rating >= 4.2) || discoveryPool[0];
    }
    if (discoveryBook) {
      return [...top3, discoveryBook];
    }
    return top3;
  };
  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };
  const handleShareLink = async () => {
    const shareData = {
      title: "My Perfect Reads from The Readers Index",
      text: "I just took The Book Taste Quiz on The Readers Index and found my perfect next reads! Take the quiz to find yours. \u{1F4D6}\u2728",
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        toast3.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };
  const handleDownloadImage = async () => {
    if (!resultsRef.current) return;
    try {
      setIsGenerating(true);
      await new Promise((resolve) => setTimeout(resolve, 150));
      const options = {
        quality: 1,
        pixelRatio: 3,
        // High quality for mobile screens
        skipFonts: false,
        useCORS: true,
        cacheBust: true
      };
      const dataUrl = await toPng(resultsRef.current, options);
      const link = document.createElement("a");
      link.download = "my-readers-index-picks.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
      toast3.error("Failed to generate your share card. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  const renderIcon = (iconName, size = 20) => {
    const IconComponent = LucideIcons[iconName];
    return IconComponent ? /* @__PURE__ */ React.createElement(IconComponent, { size, strokeWidth: 1.5 }) : null;
  };
  const getListBooks = (listId) => {
    const list = curatedLists.find((l) => l.id === listId);
    if (!list || !list.bookIds || list.bookIds.length === 0) {
      return allBooks.slice(0, 4);
    }
    return allBooks.filter((book) => list.bookIds.includes(book.id));
  };
  const progress = quizStarted ? (currentQuestion + (showResults ? 1 : 0)) / quizQuestions.length * 100 : 0;
  return /* @__PURE__ */ React.createElement("div", { className: "page-wrapper" }, /* @__PURE__ */ React.createElement("section", { className: "reco-hero", id: "reco-hero" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("span", { className: "section-label" }, "Personalized for You"), /* @__PURE__ */ React.createElement("h1", { className: "section-title" }, "Find Your Next Read"), /* @__PURE__ */ React.createElement("p", { className: "section-subtitle" }, "Take our taste quiz or browse curated lists to discover your perfect book match."))), /* @__PURE__ */ React.createElement("section", { className: "section reco-quiz", id: "reco-quiz" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "reco-quiz__card glass-card" }, !quizStarted && !showResults && /* @__PURE__ */ React.createElement("div", { className: "reco-quiz__start animate-fade-in" }, /* @__PURE__ */ React.createElement("div", { className: "reco-quiz__start-icon" }, /* @__PURE__ */ React.createElement(Sparkles2, { size: 48, strokeWidth: 1 })), /* @__PURE__ */ React.createElement("h2", null, "The Book Taste Quiz"), /* @__PURE__ */ React.createElement("p", null, "Answer 10 quick questions about your reading mood and we'll recommend your perfect next read from our collection."), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn btn-primary",
      onClick: () => setQuizStarted(true),
      id: "start-quiz-btn"
    },
    "Start the Quiz ",
    /* @__PURE__ */ React.createElement(ArrowRight3, { size: 16 })
  )), quizStarted && !showResults && /* @__PURE__ */ React.createElement("div", { className: "reco-quiz__question animate-fade-in", key: currentQuestion }, /* @__PURE__ */ React.createElement("div", { className: "reco-quiz__progress" }, /* @__PURE__ */ React.createElement("div", { className: "reco-quiz__progress-bar" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "reco-quiz__progress-fill",
      style: { width: `${progress}%` }
    }
  )), /* @__PURE__ */ React.createElement("span", { className: "reco-quiz__progress-text" }, currentQuestion + 1, " / ", quizQuestions.length)), /* @__PURE__ */ React.createElement("h2", { className: "reco-quiz__question-text" }, quizQuestions[currentQuestion].question), /* @__PURE__ */ React.createElement("div", { className: "reco-quiz__options" }, quizQuestions[currentQuestion].options.map((option, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: i,
      className: "reco-quiz__option glass-card",
      onClick: () => handleAnswer(option),
      id: `quiz-option-${currentQuestion}-${i}`,
      style: { animationDelay: `${i * 0.1}s` }
    },
    /* @__PURE__ */ React.createElement("span", { className: "reco-quiz__option-icon" }, renderIcon(option.icon, 24)),
    /* @__PURE__ */ React.createElement("span", { className: "reco-quiz__option-text" }, option.text),
    /* @__PURE__ */ React.createElement(ArrowRight3, { size: 16, className: "reco-quiz__option-arrow" })
  ))), currentQuestion > 0 && /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn btn-ghost reco-quiz__back",
      onClick: () => {
        setCurrentQuestion((prev) => prev - 1);
        setAnswers((prev) => prev.slice(0, -1));
      }
    },
    /* @__PURE__ */ React.createElement(ArrowLeft2, { size: 14 }),
    " Back"
  )), showResults && /* @__PURE__ */ React.createElement("div", { className: "reco-quiz__results animate-fade-in" }, /* @__PURE__ */ React.createElement("div", { className: "reco-quiz__capture-area" }, /* @__PURE__ */ React.createElement("div", { className: "reco-quiz__results-header" }, /* @__PURE__ */ React.createElement(Sparkles2, { size: 24, className: "reco-quiz__results-icon" }), /* @__PURE__ */ React.createElement("h2", null, "Your Perfect Reads"), /* @__PURE__ */ React.createElement("p", null, "Based on your answers, here's what we think you'll love:")), /* @__PURE__ */ React.createElement("div", { className: "reco-quiz__results-grid" }, getRecommendations().map((book, i) => /* @__PURE__ */ React.createElement("div", { key: book.id, className: "reco-result-item" }, i === 3 && /* @__PURE__ */ React.createElement("div", { className: "discovery-label" }, /* @__PURE__ */ React.createElement(Sparkles2, { size: 12 }), " Discovery Pick"), /* @__PURE__ */ React.createElement(BookCard, { book, index: i, onClick: setSelectedBook }))))), /* @__PURE__ */ React.createElement(
    "div",
    {
      style: { position: "absolute", top: 0, left: "-9999px", opacity: 0, pointerEvents: "none", zIndex: -10 }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        ref: resultsRef,
        style: {
          width: "450px",
          height: "800px",
          background: "var(--bg-primary)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
          boxSizing: "border-box",
          fontFamily: "Inter, sans-serif",
          overflow: "hidden"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: "1.5rem" } }, /* @__PURE__ */ React.createElement(BookOpen5, { size: 32, color: "#C9A84C", style: { margin: "0 auto 0.5rem" } }), /* @__PURE__ */ React.createElement("h2", { style: { color: "#F5F0E8", fontFamily: '"Playfair Display", serif', fontSize: "1.8rem", margin: "0 0 0.25rem" } }, "My Perfect Reads"), /* @__PURE__ */ React.createElement("p", { style: { color: "#A89F91", fontSize: "0.9rem", margin: 0 } }, "Curated by The Readers Index")),
      /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", width: "100%", maxWidth: "340px", margin: "0 auto" } }, getRecommendations().slice(0, 4).map((book, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", flexDirection: "column", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: "125px", height: "185px", borderRadius: "8px", overflow: "hidden", boxShadow: "0 8px 20px rgba(0,0,0,0.5)" } }, /* @__PURE__ */ React.createElement(
        "img",
        {
          src: book.cover,
          alt: book.title,
          crossOrigin: "anonymous",
          style: { width: "100%", height: "100%", objectFit: "cover" }
        }
      )), /* @__PURE__ */ React.createElement("h3", { style: { color: "#F5F0E8", fontSize: "0.8rem", margin: "0.5rem 0 0", textAlign: "center", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.3 } }, book.title)))),
      /* @__PURE__ */ React.createElement("div", { style: { marginTop: "2rem", borderTop: "1px solid rgba(201,168,76,0.3)", paddingTop: "1rem", width: "80%", textAlign: "center" } }, /* @__PURE__ */ React.createElement("p", { style: { color: "#C9A84C", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.05em", margin: 0 } }, "READERSINDEX.COM"))
    )
  ), /* @__PURE__ */ React.createElement("div", { className: "reco-quiz__results-actions", style: { display: "flex", gap: "1rem", marginTop: "2rem", justifyContent: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { className: "btn btn-secondary", onClick: resetQuiz, id: "retake-quiz-btn" }, /* @__PURE__ */ React.createElement(RotateCcw, { size: 14 }), " Retake Quiz"), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary", onClick: handleShareLink, id: "share-results-btn" }, /* @__PURE__ */ React.createElement(Share2, { size: 14 }), " Share Link"), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn btn-secondary",
      onClick: handleDownloadImage,
      id: "download-results-btn",
      disabled: isGenerating
    },
    /* @__PURE__ */ React.createElement(Download, { size: 14 }),
    " ",
    isGenerating ? "Creating..." : "Save as Image"
  )))))), /* @__PURE__ */ React.createElement("section", { className: "section reco-lists", id: "reco-lists" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, !activeList ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "section-label" }, "Curated Collections"), /* @__PURE__ */ React.createElement("h2", { className: "section-title" }, "The Weekly Curated Lists"), /* @__PURE__ */ React.createElement("p", { className: "section-subtitle" }, "Deep dives into themes, moods, and reading vibes \u2014 beyond what Instagram captions allow."), /* @__PURE__ */ React.createElement("div", { className: "reco-lists__grid" }, curatedLists.map((list, i) => /* @__PURE__ */ React.createElement(
    "article",
    {
      key: list.id,
      className: "reco-list-card glass-card animate-fade-in-up",
      style: { animationDelay: `${i * 0.1}s`, background: list.gradient },
      id: `curated-list-${list.id}`,
      onClick: () => {
        setActiveList(list);
        document.getElementById("reco-lists").scrollIntoView({ behavior: "smooth" });
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "reco-list-card__icon-wrapper" }, renderIcon(list.icon, 28)),
    /* @__PURE__ */ React.createElement("h3", { className: "reco-list-card__title" }, list.title),
    /* @__PURE__ */ React.createElement("p", { className: "reco-list-card__desc" }, list.description),
    /* @__PURE__ */ React.createElement("div", { className: "reco-list-card__footer" }, /* @__PURE__ */ React.createElement("span", { className: "reco-list-card__count" }, /* @__PURE__ */ React.createElement(BookOpen5, { size: 14 }), " ", getListBooks(list.id).length, " books"), /* @__PURE__ */ React.createElement("span", { className: "reco-list-card__cta" }, "Read List \u2192"))
  )))) : /* @__PURE__ */ React.createElement("div", { className: "reco-list-active animate-fade-in" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn btn-ghost",
      onClick: () => setActiveList(null),
      style: { marginBottom: "1.5rem", paddingLeft: 0 }
    },
    /* @__PURE__ */ React.createElement(ArrowLeft2, { size: 16 }),
    " Back to All Lists"
  ), /* @__PURE__ */ React.createElement("div", { className: "glass-card", style: { background: activeList.gradient, padding: "2.5rem", marginBottom: "3rem", borderRadius: "var(--radius-lg)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" } }, /* @__PURE__ */ React.createElement("div", { style: { color: "var(--accent-gold)" } }, renderIcon(activeList.icon, 36)), /* @__PURE__ */ React.createElement("h2", { style: { margin: 0, fontSize: "2rem" } }, activeList.title)), /* @__PURE__ */ React.createElement("p", { style: { color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: "600px" } }, activeList.description)), /* @__PURE__ */ React.createElement("div", { className: "reco-quiz__results-grid" }, getListBooks(activeList.id).map((book, i) => /* @__PURE__ */ React.createElement(BookCard, { key: book.id, book, index: i, onClick: setSelectedBook })))))), selectedBook && /* @__PURE__ */ React.createElement(BookModal, { book: selectedBook, onClose: () => setSelectedBook(null) }));
}

// src/pages/ComingSoon/ComingSoon.jsx
import { useState as useState9, useEffect as useEffect8 } from "react";
import * as LucideIcons2 from "lucide-react";
import { Bell, ShoppingBag, Mail as Mail3, Clock as Clock2, Package, ArrowRight as ArrowRight4, Sparkles as Sparkles3 } from "lucide-react";
import toast4 from "react-hot-toast";
function ComingSoon() {
  const [email, setEmail] = useState9("");
  const [submitted, setSubmitted] = useState9(false);
  const [phase, setPhase] = useState9(0);
  const phases = [
    "Curating inventory...",
    "Designing merchandise...",
    "Brewing coffee...",
    "Preparing the shelves..."
  ];
  const renderIcon = (iconName, size = 20) => {
    const IconComponent = LucideIcons2[iconName];
    return IconComponent ? /* @__PURE__ */ React.createElement(IconComponent, { size, strokeWidth: 1.5 }) : null;
  };
  useEffect8(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % phases.length);
    }, 3e3);
    return () => clearInterval(interval);
  }, [phases.length]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast4.error("Please enter your email address");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast4.error("Please enter a valid email address");
      return;
    }
    try {
      await subscribe(email, "Waitlist");
      setSubmitted(true);
      setEmail("");
      toast4.success("Joined waitlist successfully!");
    } catch (err) {
      toast4.error(err.message || "Failed to join waitlist");
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "page-wrapper" }, /* @__PURE__ */ React.createElement("section", { className: "shop-hero", id: "shop-hero" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("span", { className: "section-label" }, /* @__PURE__ */ React.createElement(Clock2, { size: 14 }), " Coming Soon"), /* @__PURE__ */ React.createElement("h1", { className: "section-title" }, "The Bookish ", /* @__PURE__ */ React.createElement("span", { className: "text-gradient" }, "Shop")), /* @__PURE__ */ React.createElement("p", { className: "section-subtitle" }, "Curated reads, bookish merchandise, and monthly book boxes \u2014 all handpicked with love. Sign up to be the first to know when we launch."))), /* @__PURE__ */ React.createElement("section", { className: "section shop-countdown", id: "shop-countdown" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "countdown glass-card" }, /* @__PURE__ */ React.createElement("h3", null, "Shop Status"), /* @__PURE__ */ React.createElement("div", { className: "status-indicator" }, /* @__PURE__ */ React.createElement("div", { className: "status-indicator__visual" }, /* @__PURE__ */ React.createElement("div", { className: "status-indicator__core" }), /* @__PURE__ */ React.createElement("div", { className: "status-indicator__ring" }), /* @__PURE__ */ React.createElement("div", { className: "status-indicator__ring-2" })), /* @__PURE__ */ React.createElement("div", { className: "status-indicator__text", key: phase }, phases[phase]))))), /* @__PURE__ */ React.createElement("section", { className: "section shop-products", id: "shop-products" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("span", { className: "section-label" }, "Sneak Peek"), /* @__PURE__ */ React.createElement("h2", { className: "section-title" }, "What's Coming"), /* @__PURE__ */ React.createElement("p", { className: "section-subtitle", style: { margin: "0 auto" } }, "A taste of what we're preparing for you.")), /* @__PURE__ */ React.createElement("div", { className: "shop-products__grid" }, shopProducts.map((product, i) => /* @__PURE__ */ React.createElement(
    "article",
    {
      key: product.id,
      className: "product-card glass-card animate-fade-in-up",
      style: { animationDelay: `${i * 0.1}s` },
      id: `product-card-${product.id}`
    },
    /* @__PURE__ */ React.createElement("div", { className: "product-card__icon-wrapper" }, renderIcon(product.icon, 28)),
    /* @__PURE__ */ React.createElement("div", { className: "product-card__badge badge" }, product.category),
    /* @__PURE__ */ React.createElement("h3", { className: "product-card__name" }, product.name),
    /* @__PURE__ */ React.createElement("p", { className: "product-card__desc" }, product.description),
    /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "product-card__notify btn btn-secondary",
        id: `notify-btn-${product.id}`,
        onClick: () => {
          document.getElementById("shop-waitlist")?.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => {
            document.getElementById("waitlist-email-input")?.focus();
          }, 600);
        }
      },
      /* @__PURE__ */ React.createElement(Bell, { size: 14 }),
      " Notify Me"
    )
  ))))), /* @__PURE__ */ React.createElement("section", { className: "section shop-waitlist", id: "shop-waitlist" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "waitlist-card glass-card" }, /* @__PURE__ */ React.createElement("div", { className: "waitlist-card__icon" }, /* @__PURE__ */ React.createElement(ShoppingBag, { size: 48, strokeWidth: 1 })), /* @__PURE__ */ React.createElement("h2", null, "Join the Waitlist"), /* @__PURE__ */ React.createElement("p", null, "Be the first to shop when we launch. Early supporters get exclusive discounts and first access to limited-edition items."), !submitted ? /* @__PURE__ */ React.createElement("form", { className: "waitlist-card__form", onSubmit: handleSubmit, noValidate: true }, /* @__PURE__ */ React.createElement("div", { className: "waitlist-card__input-group" }, /* @__PURE__ */ React.createElement(Mail3, { size: 18, className: "waitlist-card__input-icon" }), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "email",
      placeholder: "your@email.com",
      value: email,
      onChange: (e) => setEmail(e.target.value),
      className: "waitlist-card__input",
      required: true,
      id: "waitlist-email-input"
    }
  ), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-primary", id: "waitlist-submit-btn" }, "Join Waitlist ", /* @__PURE__ */ React.createElement(ArrowRight4, { size: 14 })))) : /* @__PURE__ */ React.createElement("div", { className: "waitlist-card__success animate-scale-in" }, /* @__PURE__ */ React.createElement("div", { className: "waitlist-card__success-icon" }, /* @__PURE__ */ React.createElement(Sparkles3, { size: 28 })), /* @__PURE__ */ React.createElement("h3", null, "You're on the list!"), /* @__PURE__ */ React.createElement("p", null, "We'll let you know as soon as the shop doors open.")), /* @__PURE__ */ React.createElement("div", { className: "waitlist-card__perks" }, /* @__PURE__ */ React.createElement("div", { className: "waitlist-card__perk" }, /* @__PURE__ */ React.createElement(Package, { size: 16 }), /* @__PURE__ */ React.createElement("span", null, "Early Access")), /* @__PURE__ */ React.createElement("div", { className: "waitlist-card__perk" }, /* @__PURE__ */ React.createElement(ShoppingBag, { size: 16 }), /* @__PURE__ */ React.createElement("span", null, "Exclusive Discounts")), /* @__PURE__ */ React.createElement("div", { className: "waitlist-card__perk" }, /* @__PURE__ */ React.createElement(Bell, { size: 16 }), /* @__PURE__ */ React.createElement("span", null, "Launch Day Alert")))))));
}

// src/pages/LibraryVision/LibraryVision.jsx
import { Link as Link4 } from "react-router-dom";
import * as LucideIcons3 from "lucide-react";
import { Heart as Heart2, Users as Users2, BookOpen as BookOpen6, MapPin, ArrowRight as ArrowRight5, Check, Circle, Clock as Clock3, Sparkles as Sparkles4 } from "lucide-react";
function TimelineItem({ event, index }) {
  const statusIcons = {
    completed: /* @__PURE__ */ React.createElement(Check, { size: 16 }),
    current: /* @__PURE__ */ React.createElement(Circle, { size: 16, className: "timeline-pulse" }),
    upcoming: /* @__PURE__ */ React.createElement(Clock3, { size: 14 })
  };
  const renderIcon = (iconName, size = 20) => {
    const IconComponent = LucideIcons3[iconName];
    return IconComponent ? /* @__PURE__ */ React.createElement(IconComponent, { size, strokeWidth: 1.5 }) : null;
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: `timeline-item timeline-item--${event.status} animate-fade-in-up`,
      style: { animationDelay: `${index * 0.15}s` },
      id: `timeline-${event.year}`
    },
    /* @__PURE__ */ React.createElement("div", { className: "timeline-item__marker" }, /* @__PURE__ */ React.createElement("div", { className: "timeline-item__icon" }, statusIcons[event.status]), /* @__PURE__ */ React.createElement("div", { className: "timeline-item__line" })),
    /* @__PURE__ */ React.createElement("div", { className: "timeline-item__content glass-card" }, event.year && /* @__PURE__ */ React.createElement("span", { className: "timeline-item__year" }, event.year), /* @__PURE__ */ React.createElement("div", { className: "timeline-item__icon-badge" }, renderIcon(event.icon, 20)), /* @__PURE__ */ React.createElement("h3", null, event.title), /* @__PURE__ */ React.createElement("p", null, event.description), event.status === "current" && /* @__PURE__ */ React.createElement("span", { className: "timeline-item__badge badge" }, "You are here"))
  );
}
function LibraryVision() {
  return /* @__PURE__ */ React.createElement("div", { className: "page-wrapper" }, /* @__PURE__ */ React.createElement("section", { className: "vision-hero", id: "vision-hero" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("span", { className: "section-label" }, "The Dream"), /* @__PURE__ */ React.createElement("h1", { className: "section-title" }, "From Digital Pages to a", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "text-gradient" }, "Physical Sanctuary")), /* @__PURE__ */ React.createElement("p", { className: "section-subtitle" }, "Every great library started with a single bookshelf. This is our journey from an Instagram page to a real, breathing home for stories and readers."))), /* @__PURE__ */ React.createElement("section", { className: "section vision-story", id: "vision-story" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "vision-story__card glass-card" }, /* @__PURE__ */ React.createElement("div", { className: "vision-story__content" }, /* @__PURE__ */ React.createElement("span", { className: "section-label" }, "Our Story"), /* @__PURE__ */ React.createElement("h2", null, "Why We're Building This"), /* @__PURE__ */ React.createElement("p", null, "It started with a simple belief: that books have the power to change lives, and that every community deserves a sanctuary where stories are shared, discovered, and celebrated."), /* @__PURE__ */ React.createElement("p", null, "We began sharing reviews on Instagram \u2014 short reflections on books that moved us, challenged us, made us laugh or cry. The response was overwhelming. Thousands of readers joined the conversation, sharing their own stories and recommendations."), /* @__PURE__ */ React.createElement("p", null, "But Instagram isn't enough. Stories deserve more than a fleeting caption. They deserve a home \u2014 first digital, then physical. That's what we're building: a library that belongs to its community, where every shelf tells a story and every reader is welcome.")), /* @__PURE__ */ React.createElement("div", { className: "vision-story__visual" }, /* @__PURE__ */ React.createElement("div", { className: "vision-story__icon-stack" }, /* @__PURE__ */ React.createElement(BookOpen6, { size: 100, strokeWidth: 0.5, className: "vision-story__big-icon" })))))), /* @__PURE__ */ React.createElement("section", { className: "section vision-timeline", id: "vision-timeline" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("span", { className: "section-label" }, "The Roadmap"), /* @__PURE__ */ React.createElement("h2", { className: "section-title" }, "Our Journey, Step by Step"), /* @__PURE__ */ React.createElement("p", { className: "section-subtitle", style: { margin: "0 auto" } }, "From a seed of an idea to the doors of a real library.")), /* @__PURE__ */ React.createElement("div", { className: "timeline" }, timelineEvents.map((event, i) => /* @__PURE__ */ React.createElement(TimelineItem, { key: i, event, index: i }))))), /* @__PURE__ */ React.createElement("section", { className: "section vision-impact", id: "vision-impact" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("span", { className: "section-label" }, "Community Impact"), /* @__PURE__ */ React.createElement("h2", { className: "section-title" }, "Together We're Building Something Special")), /* @__PURE__ */ React.createElement("div", { className: "vision-impact__grid" }, /* @__PURE__ */ React.createElement("div", { className: "impact-card glass-card animate-fade-in-up delay-1" }, /* @__PURE__ */ React.createElement(Users2, { size: 32, strokeWidth: 1, className: "impact-card__icon" }), /* @__PURE__ */ React.createElement("span", { className: "impact-card__number" }, "2,400+"), /* @__PURE__ */ React.createElement("span", { className: "impact-card__label" }, "Readers in our community")), /* @__PURE__ */ React.createElement("div", { className: "impact-card glass-card animate-fade-in-up delay-2" }, /* @__PURE__ */ React.createElement(BookOpen6, { size: 32, strokeWidth: 1, className: "impact-card__icon" }), /* @__PURE__ */ React.createElement("span", { className: "impact-card__number" }, "150+"), /* @__PURE__ */ React.createElement("span", { className: "impact-card__label" }, "Books reviewed and shared")), /* @__PURE__ */ React.createElement("div", { className: "impact-card glass-card animate-fade-in-up delay-3" }, /* @__PURE__ */ React.createElement(Heart2, { size: 32, strokeWidth: 1, className: "impact-card__icon" }), /* @__PURE__ */ React.createElement("span", { className: "impact-card__number" }, "12k+"), /* @__PURE__ */ React.createElement("span", { className: "impact-card__label" }, "Reading recommendations made")), /* @__PURE__ */ React.createElement("div", { className: "impact-card glass-card animate-fade-in-up delay-4" }, /* @__PURE__ */ React.createElement(MapPin, { size: 32, strokeWidth: 1, className: "impact-card__icon" }), /* @__PURE__ */ React.createElement("span", { className: "impact-card__number" }, "1"), /* @__PURE__ */ React.createElement("span", { className: "impact-card__label" }, "Library coming soon ", /* @__PURE__ */ React.createElement(Sparkles4, { size: 12, style: { display: "inline", color: "var(--accent-gold)", marginLeft: "4px" } })))))), /* @__PURE__ */ React.createElement("section", { className: "section vision-cta", id: "vision-cta" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "vision-cta__card" }, /* @__PURE__ */ React.createElement("h2", null, "Be Part of the Story"), /* @__PURE__ */ React.createElement("p", null, "Every follower, every shared review, every book discussed \u2014 it all brings us one step closer. Here's how you can help make this dream a reality."), /* @__PURE__ */ React.createElement("div", { className: "vision-cta__actions" }, /* @__PURE__ */ React.createElement(Link4, { to: "/coming-soon", className: "btn btn-primary", id: "vision-support-btn" }, "Support the Shop ", /* @__PURE__ */ React.createElement(ArrowRight5, { size: 16 })), /* @__PURE__ */ React.createElement("a", { href: "#", className: "btn btn-secondary", id: "vision-share-btn" }, "Spread the Word"))))));
}

// src/pages/Admin/Admin.jsx
import { useState as useState10, useEffect as useEffect9 } from "react";
import {
  LayoutDashboard,
  BookPlus,
  Settings,
  LogOut as LogOut2,
  Trash2 as Trash22,
  Edit3,
  Save,
  X as X4,
  Plus as Plus2,
  ExternalLink,
  Users as Users4,
  Library as Library2,
  Eye,
  CheckCircle2 as CheckCircle23,
  AlertCircle,
  Loader as Loader2,
  Sparkles as Sparkles5,
  Star as Star4,
  Upload,
  Mail as Mail4,
  Download as Download2,
  ShoppingCart as ShoppingCart2,
  Package as Package3,
  TrendingUp
} from "lucide-react";
import toast5 from "react-hot-toast";

// src/pages/Admin/AnalyticsDashboard.jsx
import React3, { useMemo } from "react";
import { ShoppingCart, DollarSign, Package as Package2, Users as Users3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
function AnalyticsDashboard({ orders }) {
  const stats = useMemo(() => {
    let totalRevenue = 0;
    let totalItems = 0;
    const uniqueCustomers = /* @__PURE__ */ new Set();
    const productSales = {};
    const salesByDate = {};
    orders.forEach((order) => {
      totalRevenue += order.totalAmount;
      uniqueCustomers.add(order.customerEmail);
      const date = new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (!salesByDate[date]) salesByDate[date] = 0;
      salesByDate[date] += 1;
      order.products.forEach((p) => {
        totalItems += p.quantity;
        const pId = p.product?._id || p.product;
        const pName = p.product?.title || "Unknown Product";
        if (!productSales[pId]) {
          productSales[pId] = { name: pName, quantity: 0, revenue: 0 };
        }
        productSales[pId].quantity += p.quantity;
        productSales[pId].revenue += p.priceAtPurchase * p.quantity;
      });
    });
    const trendData = Object.keys(salesByDate).map((date) => ({
      date,
      sales: salesByDate[date]
    })).slice(-14);
    const topProducts = Object.values(productSales).sort((a, b) => b.quantity - a.quantity).slice(0, 5);
    return {
      totalOrders: orders.length,
      totalRevenue,
      totalItems,
      activeCustomers: uniqueCustomers.size,
      trendData,
      topProducts
    };
  }, [orders]);
  const getCurrencySymbol = () => "\u20A6";
  return /* @__PURE__ */ React3.createElement("div", { className: "analytics-dashboard" }, /* @__PURE__ */ React3.createElement("div", { className: "analytics-header", style: { marginBottom: "2rem" } }, /* @__PURE__ */ React3.createElement("h2", { style: { fontSize: "1.8rem", fontFamily: "var(--font-serif)", color: "var(--text-primary)" } }, "Sales Analytics Dashboard"), /* @__PURE__ */ React3.createElement("p", { style: { color: "var(--text-secondary)" } }, "Real-time insights on orders, sales, and revenue")), /* @__PURE__ */ React3.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2rem" } }, /* @__PURE__ */ React3.createElement("div", { className: "glass-card", style: { padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React3.createElement("div", null, /* @__PURE__ */ React3.createElement("p", { style: { color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" } }, "Total Orders"), /* @__PURE__ */ React3.createElement("h3", { style: { fontSize: "2rem", color: "var(--text-primary)" } }, stats.totalOrders)), /* @__PURE__ */ React3.createElement(ShoppingCart, { size: 32, color: "var(--accent-gold)", opacity: 0.8 })), /* @__PURE__ */ React3.createElement("div", { className: "glass-card", style: { padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React3.createElement("div", null, /* @__PURE__ */ React3.createElement("p", { style: { color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" } }, "Total Items Sold"), /* @__PURE__ */ React3.createElement("h3", { style: { fontSize: "2rem", color: "var(--text-primary)" } }, stats.totalItems)), /* @__PURE__ */ React3.createElement(Package2, { size: 32, color: "var(--accent-gold)", opacity: 0.8 })), /* @__PURE__ */ React3.createElement("div", { className: "glass-card", style: { padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React3.createElement("div", null, /* @__PURE__ */ React3.createElement("p", { style: { color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" } }, "Revenue Generated"), /* @__PURE__ */ React3.createElement("h3", { style: { fontSize: "2rem", color: "var(--text-primary)" } }, getCurrencySymbol(), stats.totalRevenue.toLocaleString(void 0, { minimumFractionDigits: 2 }))), /* @__PURE__ */ React3.createElement(DollarSign, { size: 32, color: "var(--accent-gold)", opacity: 0.8 })), /* @__PURE__ */ React3.createElement("div", { className: "glass-card", style: { padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React3.createElement("div", null, /* @__PURE__ */ React3.createElement("p", { style: { color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" } }, "Active Customers"), /* @__PURE__ */ React3.createElement("h3", { style: { fontSize: "2rem", color: "var(--text-primary)" } }, stats.activeCustomers)), /* @__PURE__ */ React3.createElement(Users3, { size: 32, color: "var(--accent-gold)", opacity: 0.8 }))), /* @__PURE__ */ React3.createElement("div", { style: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" } }, /* @__PURE__ */ React3.createElement("div", { className: "glass-card", style: { padding: "1.5rem" } }, /* @__PURE__ */ React3.createElement("h4", { style: { marginBottom: "1.5rem", color: "var(--text-primary)" } }, "Sales Trend (Last 14 Days)"), /* @__PURE__ */ React3.createElement("div", { style: { height: "300px", width: "100%" } }, stats.trendData.length > 0 ? /* @__PURE__ */ React3.createElement(ResponsiveContainer, { width: "100%", height: "100%" }, /* @__PURE__ */ React3.createElement(LineChart, { data: stats.trendData }, /* @__PURE__ */ React3.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "rgba(201, 168, 76, 0.1)", vertical: false }), /* @__PURE__ */ React3.createElement(XAxis, { dataKey: "date", stroke: "var(--text-muted)", tick: { fill: "var(--text-muted)" } }), /* @__PURE__ */ React3.createElement(YAxis, { stroke: "var(--text-muted)", tick: { fill: "var(--text-muted)" }, allowDecimals: false }), /* @__PURE__ */ React3.createElement(
    Tooltip,
    {
      contentStyle: { backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" },
      itemStyle: { color: "var(--accent-gold)" }
    }
  ), /* @__PURE__ */ React3.createElement(Line, { type: "monotone", dataKey: "sales", stroke: "var(--accent-gold)", strokeWidth: 3, dot: { r: 4, fill: "var(--bg-primary)", stroke: "var(--accent-gold)", strokeWidth: 2 }, activeDot: { r: 6 } }))) : /* @__PURE__ */ React3.createElement("div", { style: { height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" } }, "No sales recorded yet"))), /* @__PURE__ */ React3.createElement("div", { className: "glass-card", style: { padding: "1.5rem" } }, /* @__PURE__ */ React3.createElement("h4", { style: { marginBottom: "1.5rem", color: "var(--text-primary)" } }, "Top Products"), stats.topProducts.length > 0 ? /* @__PURE__ */ React3.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "1rem" } }, stats.topProducts.map((product, index) => /* @__PURE__ */ React3.createElement("div", { key: index, style: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "1rem", borderBottom: "1px solid var(--border-subtle)" } }, /* @__PURE__ */ React3.createElement("div", null, /* @__PURE__ */ React3.createElement("p", { style: { fontWeight: 500, color: "var(--text-primary)" } }, product.name), /* @__PURE__ */ React3.createElement("p", { style: { fontSize: "0.8rem", color: "var(--text-muted)" } }, product.quantity, " sold")), /* @__PURE__ */ React3.createElement("div", { style: { fontWeight: 600, color: "var(--accent-gold)" } }, getCurrencySymbol(), product.revenue.toLocaleString())))) : /* @__PURE__ */ React3.createElement("div", { style: { height: "200px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" } }, "No top products yet"))));
}

// src/pages/Admin/Admin.jsx
function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState10(false);
  const [password, setPassword] = useState10("");
  const [activeTab, setActiveTab] = useState10("dashboard");
  const [books, setBooks] = useState10([]);
  const [curatedLists, setCuratedLists] = useState10([]);
  const [subscribers, setSubscribers] = useState10([]);
  const [users, setUsers] = useState10([]);
  const [readingStatus, setReadingStatus] = useState10(null);
  const [loading, setLoading] = useState10(true);
  const [isSaving, setIsSaving] = useState10(false);
  const [isAutoFilling, setIsAutoFilling] = useState10(false);
  const [products, setProducts] = useState10([]);
  const [orders, setOrders] = useState10([]);
  const [isModalOpen, setIsModalOpen] = useState10(false);
  const [editingBook, setEditingBook] = useState10(null);
  const [formData, setFormData] = useState10({
    title: "",
    author: "",
    cover: "",
    rating: 5,
    genre: "",
    genres: "",
    tropes: "",
    pacing: "",
    mood: "",
    review: "",
    quote: "",
    pages: 300,
    year: (/* @__PURE__ */ new Date()).getFullYear(),
    featured: false
  });
  const [isListModalOpen, setIsListModalOpen] = useState10(false);
  const [editingList, setEditingList] = useState10(null);
  const [listFormData, setListFormData] = useState10({
    title: "",
    description: "",
    icon: "Sparkles",
    gradient: "linear-gradient(135deg, #C9A84C22, #D4956A22)",
    selectedBookIds: []
  });
  const [readingForm, setReadingForm] = useState10({
    title: "",
    author: "",
    cover: "",
    progress: 0,
    thoughts: ""
  });
  const [isProductModalOpen, setIsProductModalOpen] = useState10(false);
  const [editingProduct, setEditingProduct] = useState10(null);
  const [productForm, setProductForm] = useState10({
    title: "",
    description: "",
    price: 0,
    images: "",
    stock: 0,
    category: "Merch",
    currency: "NGN",
    isFeatured: false
  });
  const confirmAction = (message, action) => {
    toast5((t) => /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "8px" } }, /* @__PURE__ */ React.createElement("p", { style: { margin: 0, fontWeight: 500 } }, message), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px", marginTop: "8px" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn-sm",
        style: { background: "var(--accent-rose)", color: "white", border: "none" },
        onClick: () => {
          toast5.dismiss(t.id);
          action();
        }
      },
      "Confirm"
    ), /* @__PURE__ */ React.createElement("button", { className: "btn-sm btn-ghost", onClick: () => toast5.dismiss(t.id) }, "Cancel"))), { duration: 5e3 });
  };
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "reader123") {
      setIsAuthenticated(true);
      loadData();
      toast5.success("Welcome back, Admin");
    } else {
      toast5.error("Invalid password");
    }
  };
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchBooks({ limit: 100 });
      setBooks(data?.books || []);
    } catch (err) {
      console.error("Failed to load books");
    }
    try {
      const data = await fetchLists();
      setCuratedLists(data || []);
    } catch (err) {
      console.error("Failed to load lists");
    }
    try {
      const data = await fetchCurrentlyReading();
      setReadingStatus(data);
      if (data) {
        setReadingForm({
          title: data.title || "",
          author: data.author || "",
          cover: data.cover || "",
          progress: data.progress || 0,
          thoughts: data.thoughts || ""
        });
      }
    } catch (err) {
      console.error("Failed to load reading status");
    }
    try {
      const data = await fetchSubscribers();
      setSubscribers(data || []);
    } catch (err) {
      console.error("Failed to load subscribers");
    }
    try {
      const data = await fetchUsers();
      setUsers(data || []);
    } catch (err) {
      console.error("Failed to load users");
    }
    try {
      const data = await fetchProducts();
      setProducts(data || []);
    } catch (err) {
      console.error("Failed to load products");
    }
    try {
      const data = await fetchOrders();
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to load orders");
    }
    setLoading(false);
  };
  const handleOpenModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        ...book,
        mood: Array.isArray(book.mood) ? book.mood.join(", ") : book.mood,
        genres: Array.isArray(book.genres) ? book.genres.join(", ") : book.genres || "",
        tropes: Array.isArray(book.tropes) ? book.tropes.join(", ") : book.tropes || "",
        pacing: book.pacing || ""
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: "",
        author: "",
        cover: "",
        rating: 5,
        genre: "",
        genres: "",
        tropes: "",
        pacing: "",
        mood: "",
        review: "",
        quote: "",
        pages: 300,
        year: (/* @__PURE__ */ new Date()).getFullYear(),
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
        mood: typeof formData.mood === "string" ? formData.mood.split(",").map((m) => m.trim()).filter(Boolean) : formData.mood,
        genres: typeof formData.genres === "string" ? formData.genres.split(",").map((m) => m.trim()).filter(Boolean) : formData.genres,
        tropes: typeof formData.tropes === "string" ? formData.tropes.split(",").map((m) => m.trim()).filter(Boolean) : formData.tropes,
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
      toast5.success("Book saved successfully");
    } catch (err) {
      toast5.error("Failed to save book: " + err.message);
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
      setFormData((prev) => ({ ...prev, cover: url }));
      toast5.success("Image uploaded");
    } catch (err) {
      toast5.error("Failed to upload image");
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
      setProductForm((prev) => {
        const currentImages = prev.images.trim();
        const newImages = currentImages ? `${currentImages}
${url}` : url;
        return { ...prev, images: newImages };
      });
      toast5.success("Product image uploaded");
    } catch (err) {
      toast5.error("Failed to upload product image");
    } finally {
      setIsSaving(false);
    }
  };
  const handleDeleteBook = (id) => {
    confirmAction("Are you sure you want to delete this book?", async () => {
      try {
        await deleteBook(id);
        loadData();
        toast5.success("Book deleted");
      } catch (err) {
        toast5.error("Failed to delete book");
      }
    });
  };
  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        ...product,
        images: product.images?.join("\n") || ""
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        title: "",
        description: "",
        price: 0,
        images: "",
        stock: 0,
        category: "Merch",
        currency: "NGN",
        isFeatured: false
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
        images: typeof productForm.images === "string" ? productForm.images.split("\n").map((m) => m.trim()).filter(Boolean) : productForm.images
      };
      delete payload.weight;
      if (editingProduct) {
        await updateProduct(editingProduct._id || editingProduct.id, payload);
      } else {
        await addProduct(payload);
      }
      setIsProductModalOpen(false);
      loadData();
      toast5.success("Product saved successfully");
    } catch (err) {
      toast5.error("Failed to save product: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };
  const handleDeleteProduct = (id) => {
    confirmAction("Are you sure you want to delete this product?", async () => {
      try {
        await deleteProduct(id);
        loadData();
        toast5.success("Product deleted");
      } catch (err) {
        toast5.error("Failed to delete product");
      }
    });
  };
  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      loadData();
      toast5.success("Order status updated to " + status);
    } catch (err) {
      toast5.error("Failed to update order status");
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
        title: "",
        description: "",
        icon: "Sparkles",
        gradient: "linear-gradient(135deg, #C9A84C22, #D4956A22)",
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
      await updateListBooks(listId, listFormData.selectedBookIds);
      setIsListModalOpen(false);
      loadData();
      toast5.success("List saved successfully");
    } catch (err) {
      toast5.error("Failed to save list");
    } finally {
      setIsSaving(false);
    }
  };
  const handleAutoFill = async () => {
    if (!formData.title || !formData.author) {
      toast5.error("Please enter a Title and Author first");
      return;
    }
    setIsAutoFilling(true);
    const loadingToast = toast5.loading("Consulting the AI Librarian...");
    try {
      const aiData = await fetchAiAutofill(formData.title, formData.author);
      setFormData((prev) => ({
        ...prev,
        cover: aiData.cover || prev.cover,
        review: aiData.review || prev.review,
        quote: aiData.quote || prev.quote,
        genres: aiData.genres ? aiData.genres.join(", ") : prev.genres,
        tropes: aiData.tropes ? aiData.tropes.join(", ") : prev.tropes,
        pacing: aiData.pacing || prev.pacing,
        mood: aiData.mood ? aiData.mood.join(", ") : prev.mood,
        year: aiData.year || prev.year,
        pages: aiData.pages || prev.pages,
        genre: aiData.genres && aiData.genres.length > 0 ? aiData.genres[0] : prev.genre
      }));
      toast5.success("Form magically populated!", { id: loadingToast });
    } catch (err) {
      toast5.error("Failed to auto-fill data. Is the API key set?", { id: loadingToast });
    } finally {
      setIsAutoFilling(false);
    }
  };
  const handleDeleteSubscriber = (id) => {
    confirmAction("Remove this reader from the archives?", async () => {
      try {
        await deleteSubscriber(id);
        loadData();
        toast5.success("Subscriber removed");
      } catch (err) {
        toast5.error("Failed to remove subscriber");
      }
    });
  };
  const handleDeleteList = (id) => {
    confirmAction("Are you sure you want to delete this curated list?", async () => {
      try {
        await deleteList(id);
        loadData();
        toast5.success("List deleted");
      } catch (err) {
        toast5.error("Failed to delete list");
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
      toast5.success("Reading status updated!");
    } catch (err) {
      toast5.error("Failed to update reading status");
    } finally {
      setIsSaving(false);
    }
  };
  if (!isAuthenticated) {
    return /* @__PURE__ */ React.createElement("div", { className: "admin-login-wrapper" }, /* @__PURE__ */ React.createElement("div", { className: "admin-login-card glass-card animate-fade-in-up" }, /* @__PURE__ */ React.createElement("div", { className: "admin-login-header" }, /* @__PURE__ */ React.createElement(Library2, { size: 40, className: "admin-icon" }), /* @__PURE__ */ React.createElement("h1", null, "The Librarian's Sanctum"), /* @__PURE__ */ React.createElement("p", null, "Provide the secret key to tend to the shelves and update the archives.")), /* @__PURE__ */ React.createElement("form", { onSubmit: handleLogin }, /* @__PURE__ */ React.createElement("div", { className: "input-group" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "password",
        placeholder: "Whisper the passphrase...",
        value: password,
        onChange: (e) => setPassword(e.target.value),
        autoFocus: true,
        required: true
      }
    )), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-primary" }, "Enter the Sanctum"))));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "admin-dashboard" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "admin-layout" }, /* @__PURE__ */ React.createElement("aside", { className: "admin-sidebar glass-card" }, /* @__PURE__ */ React.createElement("div", { className: "admin-profile" }, /* @__PURE__ */ React.createElement("div", { className: "admin-avatar" }, "RI"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", null, "Admin"), /* @__PURE__ */ React.createElement("p", null, "The Readers Index"))), /* @__PURE__ */ React.createElement("nav", { className: "admin-nav" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      className: `admin-nav-item ${activeTab === "dashboard" ? "active" : ""}`,
      onClick: () => setActiveTab("dashboard")
    },
    /* @__PURE__ */ React.createElement(TrendingUp, { size: 20 }),
    "Sales Dashboard"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: `admin-nav-item ${activeTab === "books" ? "active" : ""}`,
      onClick: () => setActiveTab("books")
    },
    /* @__PURE__ */ React.createElement(Library2, { size: 18 }),
    " Master Archive"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: `admin-nav-item ${activeTab === "reading" ? "active" : ""}`,
      onClick: () => setActiveTab("reading")
    },
    /* @__PURE__ */ React.createElement(BookPlus, { size: 18 }),
    " On the Nightstand"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: `admin-nav-item ${activeTab === "lists" ? "active" : ""}`,
      onClick: () => setActiveTab("lists")
    },
    /* @__PURE__ */ React.createElement(Sparkles5, { size: 18 }),
    " Themed Collections"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: `admin-nav-item ${activeTab === "subscribers" ? "active" : ""}`,
      onClick: () => setActiveTab("subscribers")
    },
    /* @__PURE__ */ React.createElement(Mail4, { size: 18 }),
    " The Readership"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: `admin-nav-item ${activeTab === "users" ? "active" : ""}`,
      onClick: () => setActiveTab("users")
    },
    /* @__PURE__ */ React.createElement(Users4, { size: 18 }),
    " Registered Users"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: `admin-nav-item ${activeTab === "shop" ? "active" : ""}`,
      onClick: () => setActiveTab("shop")
    },
    /* @__PURE__ */ React.createElement(ShoppingCart2, { size: 18 }),
    " Manage Shop"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: `admin-nav-item ${activeTab === "orders" ? "active" : ""}`,
      onClick: () => setActiveTab("orders")
    },
    /* @__PURE__ */ React.createElement(Package3, { size: 18 }),
    " Orders"
  ), /* @__PURE__ */ React.createElement("button", { className: "admin-nav-item logout", onClick: () => setIsAuthenticated(false) }, /* @__PURE__ */ React.createElement(LogOut2, { size: 18 }), " Logout"))), /* @__PURE__ */ React.createElement("main", { className: "admin-main" }, activeTab === "dashboard" && /* @__PURE__ */ React.createElement("div", { className: "admin-panel animate-fade-in" }, /* @__PURE__ */ React.createElement(AnalyticsDashboard, { orders })), activeTab === "books" && /* @__PURE__ */ React.createElement("section", { className: "admin-section animate-fade-in" }, /* @__PURE__ */ React.createElement("div", { className: "admin-header" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, "Manage Collection"), /* @__PURE__ */ React.createElement("p", null, "Add, edit, or remove books from the library.")), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary", onClick: () => handleOpenModal() }, /* @__PURE__ */ React.createElement(Plus2, { size: 18 }), " Add New Book")), /* @__PURE__ */ React.createElement("div", { className: "admin-books-grid" }, loading ? /* @__PURE__ */ React.createElement("div", { className: "admin-loading" }, /* @__PURE__ */ React.createElement(Loader2, { className: "spin" }), " Loading library...") : books.map((book) => /* @__PURE__ */ React.createElement("div", { key: book.id, className: "admin-book-item glass-card" }, /* @__PURE__ */ React.createElement("img", { src: book.cover, alt: book.title }), /* @__PURE__ */ React.createElement("div", { className: "admin-book-details" }, /* @__PURE__ */ React.createElement("h4", null, book.title), /* @__PURE__ */ React.createElement("p", null, book.author), /* @__PURE__ */ React.createElement("div", { className: "admin-book-meta" }, /* @__PURE__ */ React.createElement("span", null, book.genre), book.featured && /* @__PURE__ */ React.createElement("span", { className: "badge-featured" }, "Staff Pick"), new Date(book.created_at) > new Date(Date.now() - 864e5) && /* @__PURE__ */ React.createElement("span", { className: "badge-new" }, "Recent"))), /* @__PURE__ */ React.createElement("div", { className: "admin-book-actions" }, /* @__PURE__ */ React.createElement("button", { className: "btn-icon", onClick: () => handleOpenModal(book) }, /* @__PURE__ */ React.createElement(Edit3, { size: 16 })), /* @__PURE__ */ React.createElement("button", { className: "btn-icon delete", onClick: () => handleDeleteBook(book.id) }, /* @__PURE__ */ React.createElement(Trash22, { size: 16 }))))))), activeTab === "reading" && /* @__PURE__ */ React.createElement("section", { className: "admin-section animate-fade-in" }, /* @__PURE__ */ React.createElement("div", { className: "admin-header" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, "Currently Reading"), /* @__PURE__ */ React.createElement("p", null, "Update what's on your bedside table right now."))), /* @__PURE__ */ React.createElement("form", { className: "admin-form glass-card", onSubmit: handleUpdateReading }, /* @__PURE__ */ React.createElement("div", { className: "form-grid" }, /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Title"), /* @__PURE__ */ React.createElement(
    "input",
    {
      value: readingForm.title,
      onChange: (e) => setReadingForm({ ...readingForm, title: e.target.value }),
      required: true
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Author"), /* @__PURE__ */ React.createElement(
    "input",
    {
      value: readingForm.author,
      onChange: (e) => setReadingForm({ ...readingForm, author: e.target.value }),
      required: true
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "form-group full" }, /* @__PURE__ */ React.createElement("label", null, "Cover Image URL or Upload Photo"), /* @__PURE__ */ React.createElement("div", { className: "form-input-with-preview" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      value: readingForm.cover,
      onChange: (e) => setReadingForm({ ...readingForm, cover: e.target.value }),
      placeholder: "https://...",
      required: true
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "file-upload-wrapper" }, /* @__PURE__ */ React.createElement("input", { type: "file", id: "reading-cover-upload", accept: "image/*", onChange: async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsSaving(true);
    try {
      const { url } = await uploadImage(file);
      setReadingForm((prev) => ({ ...prev, cover: url }));
    } catch (err) {
      toast5.error("Failed to upload image");
    } finally {
      setIsSaving(false);
    }
  } }), /* @__PURE__ */ React.createElement("label", { htmlFor: "reading-cover-upload", className: "btn btn-secondary btn-icon-only" }, /* @__PURE__ */ React.createElement(Upload, { size: 16 }))), readingForm.cover && /* @__PURE__ */ React.createElement("div", { className: "admin-form-preview-mini" }, /* @__PURE__ */ React.createElement("img", { src: readingForm.cover, alt: "Preview", onError: (e) => e.target.style.display = "none" })))), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Progress (%)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "number",
      min: "0",
      max: "100",
      value: readingForm.progress,
      onChange: (e) => setReadingForm({ ...readingForm, progress: parseInt(e.target.value) }),
      required: true
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "form-group full" }, /* @__PURE__ */ React.createElement("label", null, "Thoughts / Quote"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      rows: "4",
      value: readingForm.thoughts,
      onChange: (e) => setReadingForm({ ...readingForm, thoughts: e.target.value }),
      required: true
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "form-actions" }, /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-primary", disabled: isSaving }, isSaving ? "Saving..." : "Update Reading Status")))), activeTab === "lists" && /* @__PURE__ */ React.createElement("section", { className: "admin-section animate-fade-in" }, /* @__PURE__ */ React.createElement("div", { className: "admin-header" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, "Curated Lists"), /* @__PURE__ */ React.createElement("p", null, "Manage the themed collections on the Recommendations page.")), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary", onClick: () => handleOpenListModal() }, /* @__PURE__ */ React.createElement(Plus2, { size: 18 }), " Create New List")), /* @__PURE__ */ React.createElement("div", { className: "admin-books-grid" }, loading ? /* @__PURE__ */ React.createElement("div", { className: "admin-loading" }, /* @__PURE__ */ React.createElement(Loader2, { className: "spin" }), " Loading lists...") : curatedLists.map((list) => /* @__PURE__ */ React.createElement("div", { key: list.id, className: "admin-book-item glass-card" }, /* @__PURE__ */ React.createElement("div", { className: "admin-list-icon-preview", style: { background: list.gradient } }, /* @__PURE__ */ React.createElement(Sparkles5, { size: 24 })), /* @__PURE__ */ React.createElement("div", { className: "admin-book-details" }, /* @__PURE__ */ React.createElement("h4", null, list.title), /* @__PURE__ */ React.createElement("p", null, list.description), /* @__PURE__ */ React.createElement("div", { className: "admin-book-meta" }, /* @__PURE__ */ React.createElement("span", null, "Icon: ", list.icon))), /* @__PURE__ */ React.createElement("div", { className: "admin-book-actions" }, /* @__PURE__ */ React.createElement("button", { className: "btn-icon", onClick: () => handleOpenListModal(list) }, /* @__PURE__ */ React.createElement(Edit3, { size: 16 })), /* @__PURE__ */ React.createElement("button", { className: "btn-icon delete", onClick: () => handleDeleteList(list.id) }, /* @__PURE__ */ React.createElement(Trash22, { size: 16 }))))))), activeTab === "users" && /* @__PURE__ */ React.createElement("section", { className: "admin-section animate-fade-in" }, /* @__PURE__ */ React.createElement("div", { className: "admin-content-card glass-card animate-fade-in" }, /* @__PURE__ */ React.createElement("div", { className: "admin-header" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, "Registered Users"), /* @__PURE__ */ React.createElement("p", null, "You have ", users.length, " registered members in the system."))), /* @__PURE__ */ React.createElement("div", { className: "admin-table-wrapper" }, /* @__PURE__ */ React.createElement("table", { className: "admin-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Username"), /* @__PURE__ */ React.createElement("th", null, "Email"), /* @__PURE__ */ React.createElement("th", null, "Joined"), /* @__PURE__ */ React.createElement("th", { style: { textAlign: "right" } }, "Actions"))), /* @__PURE__ */ React.createElement("tbody", null, users.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "4", className: "text-center", style: { padding: "3rem", color: "var(--text-muted)" } }, "No registered users yet.")) : users.map((user) => /* @__PURE__ */ React.createElement("tr", { key: user.id }, /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "0.75rem" } }, /* @__PURE__ */ React.createElement("div", { className: "reader-icon" }, /* @__PURE__ */ React.createElement(Users4, { size: 14 })), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600 } }, user.username))), /* @__PURE__ */ React.createElement("td", null, user.email), /* @__PURE__ */ React.createElement("td", null, new Date(user.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })), /* @__PURE__ */ React.createElement("td", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-icon delete", onClick: () => {
    confirmAction(`Are you sure you want to delete user "${user.username}"?`, async () => {
      try {
        await deleteUser(user.id);
        loadData();
        toast5.success("User deleted");
      } catch (err) {
        toast5.error("Failed to delete user");
      }
    });
  } }, /* @__PURE__ */ React.createElement(Trash22, { size: 16 })))))))))), activeTab === "subscribers" && /* @__PURE__ */ React.createElement("section", { className: "admin-section animate-fade-in" }, /* @__PURE__ */ React.createElement("div", { className: "admin-content-card glass-card animate-fade-in" }, /* @__PURE__ */ React.createElement("div", { className: "admin-header" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, "The Readership"), /* @__PURE__ */ React.createElement("p", null, "You have ", subscribers.length, " dedicated readers in your archive.")), /* @__PURE__ */ React.createElement("button", { className: "btn btn-secondary", onClick: () => {
    const header = "Email,Source,Joined\n";
    const rows = subscribers.map((s) => `${s.email},${s.source || "Newsletter"},${new Date(s.created_at).toLocaleDateString()}`).join("\n");
    const csv = header + rows;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "readership_emails.csv";
    a.click();
  } }, /* @__PURE__ */ React.createElement(Download2, { size: 18 }), " Export List")), /* @__PURE__ */ React.createElement("div", { className: "admin-table-wrapper" }, /* @__PURE__ */ React.createElement("table", { className: "admin-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Reader Email"), /* @__PURE__ */ React.createElement("th", null, "Source"), /* @__PURE__ */ React.createElement("th", null, "Joined the Sanctum"), /* @__PURE__ */ React.createElement("th", { style: { textAlign: "right" } }, "Actions"))), /* @__PURE__ */ React.createElement("tbody", null, subscribers.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "4", className: "text-center", style: { padding: "3rem", color: "var(--text-muted)" } }, "No readers have found the secret path to your archives yet.")) : subscribers.map((sub) => /* @__PURE__ */ React.createElement("tr", { key: sub.id }, /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "0.75rem" } }, /* @__PURE__ */ React.createElement("div", { className: "reader-icon" }, /* @__PURE__ */ React.createElement(Mail4, { size: 14 })), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600 } }, sub.email))), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("span", { className: `badge ${sub.source?.toLowerCase() === "waitlist" ? "badge-new" : "badge-featured"}`, style: { fontSize: "0.65rem", padding: "0.2rem 0.6rem" } }, sub.source || "Newsletter")), /* @__PURE__ */ React.createElement("td", null, new Date(sub.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })), /* @__PURE__ */ React.createElement("td", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-icon delete", onClick: () => handleDeleteSubscriber(sub.id) }, /* @__PURE__ */ React.createElement(Trash22, { size: 16 })))))))))), activeTab === "shop" && /* @__PURE__ */ React.createElement("section", { className: "admin-section animate-fade-in" }, /* @__PURE__ */ React.createElement("div", { className: "admin-header" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, "Manage Shop"), /* @__PURE__ */ React.createElement("p", null, "Manage your physical merchandise and products.")), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary", onClick: () => handleOpenProductModal() }, /* @__PURE__ */ React.createElement(Plus2, { size: 18 }), " Add New Product")), /* @__PURE__ */ React.createElement("div", { className: "admin-books-grid" }, loading ? /* @__PURE__ */ React.createElement("div", { className: "admin-loading" }, /* @__PURE__ */ React.createElement(Loader2, { className: "spin" }), " Loading products...") : products.map((product) => /* @__PURE__ */ React.createElement("div", { key: product._id, className: "admin-book-item glass-card" }, /* @__PURE__ */ React.createElement("img", { src: product.images?.[0] || "https://via.placeholder.com/150", alt: product.title }), /* @__PURE__ */ React.createElement("div", { className: "admin-book-details" }, /* @__PURE__ */ React.createElement("h4", null, product.title), /* @__PURE__ */ React.createElement("p", null, product.currency === "NGN" ? "\u20A6" : product.currency === "GBP" ? "\xA3" : "$", product.price.toFixed(2)), /* @__PURE__ */ React.createElement("div", { className: "admin-book-meta" }, /* @__PURE__ */ React.createElement("span", { className: product.stock > 0 ? "badge-new" : "badge-featured" }, product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"), product.isFeatured && /* @__PURE__ */ React.createElement("span", { className: "badge-featured" }, "Featured"))), /* @__PURE__ */ React.createElement("div", { className: "admin-book-actions" }, /* @__PURE__ */ React.createElement("button", { className: "btn-icon", onClick: () => handleOpenProductModal(product) }, /* @__PURE__ */ React.createElement(Edit3, { size: 16 })), /* @__PURE__ */ React.createElement("button", { className: "btn-icon delete", onClick: () => handleDeleteProduct(product._id) }, /* @__PURE__ */ React.createElement(Trash22, { size: 16 }))))))), activeTab === "orders" && /* @__PURE__ */ React.createElement("section", { className: "admin-section animate-fade-in" }, /* @__PURE__ */ React.createElement("div", { className: "admin-content-card glass-card animate-fade-in" }, /* @__PURE__ */ React.createElement("div", { className: "admin-header" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", null, "Orders"), /* @__PURE__ */ React.createElement("p", null, "View and manage incoming store orders."))), /* @__PURE__ */ React.createElement("div", { className: "admin-table-wrapper" }, /* @__PURE__ */ React.createElement("table", { className: "admin-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Order ID"), /* @__PURE__ */ React.createElement("th", null, "Customer Email"), /* @__PURE__ */ React.createElement("th", null, "Total Amount"), /* @__PURE__ */ React.createElement("th", null, "Status"), /* @__PURE__ */ React.createElement("th", { style: { textAlign: "right" } }, "Actions"))), /* @__PURE__ */ React.createElement("tbody", null, orders.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "5", className: "text-center", style: { padding: "3rem", color: "var(--text-muted)" } }, "No orders yet.")) : orders.map((order) => /* @__PURE__ */ React.createElement("tr", { key: order._id }, /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "0.75rem" } }, /* @__PURE__ */ React.createElement("div", { className: "reader-icon" }, /* @__PURE__ */ React.createElement(Package3, { size: 14 })), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 600 } }, order._id.substring(0, 8), "..."))), /* @__PURE__ */ React.createElement("td", null, order.customerEmail), /* @__PURE__ */ React.createElement("td", null, "$", order.totalAmount.toFixed(2)), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(
    "select",
    {
      value: order.status,
      onChange: (e) => handleUpdateOrderStatus(order._id, e.target.value),
      className: "admin-status-select"
    },
    /* @__PURE__ */ React.createElement("option", { value: "Pending" }, "Pending"),
    /* @__PURE__ */ React.createElement("option", { value: "Processing" }, "Processing"),
    /* @__PURE__ */ React.createElement("option", { value: "Shipped" }, "Shipped"),
    /* @__PURE__ */ React.createElement("option", { value: "Delivered" }, "Delivered"),
    /* @__PURE__ */ React.createElement("option", { value: "Cancelled" }, "Cancelled")
  )), /* @__PURE__ */ React.createElement("td", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-icon", onClick: () => alert(JSON.stringify(order.shippingAddress, null, 2)) }, /* @__PURE__ */ React.createElement(Eye, { size: 16 }))))))))))))), isProductModalOpen && /* @__PURE__ */ React.createElement("div", { className: "admin-modal-overlay animate-fade-in" }, /* @__PURE__ */ React.createElement("div", { className: "admin-modal glass-card animate-scale-in" }, /* @__PURE__ */ React.createElement("div", { className: "admin-modal-header" }, /* @__PURE__ */ React.createElement("h3", null, editingProduct ? "Edit Product" : "Add New Product"), /* @__PURE__ */ React.createElement("button", { className: "btn-icon", onClick: () => setIsProductModalOpen(false) }, /* @__PURE__ */ React.createElement(X4, { size: 20 }))), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSaveProduct, className: "admin-modal-form" }, /* @__PURE__ */ React.createElement("div", { className: "form-grid" }, /* @__PURE__ */ React.createElement("div", { className: "form-group full" }, /* @__PURE__ */ React.createElement("label", null, "Title"), /* @__PURE__ */ React.createElement("input", { value: productForm.title, onChange: (e) => setProductForm({ ...productForm, title: e.target.value }), required: true })), /* @__PURE__ */ React.createElement("div", { className: "form-group full" }, /* @__PURE__ */ React.createElement("label", null, "Image URLs (one per line) or Upload Photo"), /* @__PURE__ */ React.createElement("div", { className: "form-input-with-preview" }, /* @__PURE__ */ React.createElement("textarea", { rows: "3", placeholder: "https://...", value: productForm.images, onChange: (e) => setProductForm({ ...productForm, images: e.target.value }), required: true, style: { resize: "vertical" } }), /* @__PURE__ */ React.createElement("div", { className: "file-upload-wrapper" }, /* @__PURE__ */ React.createElement("input", { type: "file", id: "product-image-upload", accept: "image/*", onChange: handleProductImageUpload }), /* @__PURE__ */ React.createElement("label", { htmlFor: "product-image-upload", className: "btn btn-secondary btn-icon-only" }, /* @__PURE__ */ React.createElement(Upload, { size: 16 }))))), /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { display: "flex", gap: "0.5rem", gridColumn: "span 2" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("label", null, "Price"), /* @__PURE__ */ React.createElement("input", { type: "number", step: "0.01", value: productForm.price, onChange: (e) => setProductForm({ ...productForm, price: e.target.value }), required: true })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Currency"), /* @__PURE__ */ React.createElement("select", { value: productForm.currency, onChange: (e) => setProductForm({ ...productForm, currency: e.target.value }), style: { width: "90px" }, required: true }, /* @__PURE__ */ React.createElement("option", { value: "NGN" }, "\u20A6 NGN"), /* @__PURE__ */ React.createElement("option", { value: "USD" }, "$ USD"), /* @__PURE__ */ React.createElement("option", { value: "GBP" }, "\xA3 GBP")))), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Stock Quantity"), /* @__PURE__ */ React.createElement("input", { type: "number", value: productForm.stock, onChange: (e) => setProductForm({ ...productForm, stock: e.target.value }), required: true })), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Category"), /* @__PURE__ */ React.createElement("input", { value: productForm.category, onChange: (e) => setProductForm({ ...productForm, category: e.target.value }), required: true })), /* @__PURE__ */ React.createElement("div", { className: "form-group full" }, /* @__PURE__ */ React.createElement("label", null, "Description"), /* @__PURE__ */ React.createElement("textarea", { rows: "4", value: productForm.description, onChange: (e) => setProductForm({ ...productForm, description: e.target.value }), required: true })), /* @__PURE__ */ React.createElement("div", { className: "form-group checkbox featured-toggle" }, /* @__PURE__ */ React.createElement("label", null, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: productForm.isFeatured, onChange: (e) => setProductForm({ ...productForm, isFeatured: e.target.checked }) }), /* @__PURE__ */ React.createElement(Star4, { size: 16, className: productForm.isFeatured ? "active" : "" }), /* @__PURE__ */ React.createElement("span", null, "Display as ", /* @__PURE__ */ React.createElement("strong", null, "Featured"))))), /* @__PURE__ */ React.createElement("div", { className: "admin-modal-footer" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-ghost", onClick: () => setIsProductModalOpen(false) }, "Cancel"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-primary", disabled: isSaving }, isSaving ? "Saving..." : editingProduct ? "Update Product" : "Add Product"))))), isModalOpen && /* @__PURE__ */ React.createElement("div", { className: "admin-modal-overlay animate-fade-in" }, /* @__PURE__ */ React.createElement("div", { className: "admin-modal glass-card animate-scale-in" }, /* @__PURE__ */ React.createElement("div", { className: "admin-modal-header" }, /* @__PURE__ */ React.createElement("h3", null, editingBook ? "Edit Book" : "Add New Book"), /* @__PURE__ */ React.createElement("button", { className: "btn-icon", onClick: () => setIsModalOpen(false) }, /* @__PURE__ */ React.createElement(X4, { size: 20 }))), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSaveBook, className: "admin-modal-form" }, /* @__PURE__ */ React.createElement("div", { className: "form-grid" }, /* @__PURE__ */ React.createElement("div", { className: "form-group full", style: { display: "flex", gap: "1rem", alignItems: "flex-end", background: "var(--bg-glass-subtle)", padding: "1rem", borderRadius: "12px" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("label", null, "Title"), /* @__PURE__ */ React.createElement("input", { value: formData.title, onChange: (e) => setFormData({ ...formData, title: e.target.value }), required: true })), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("label", null, "Author"), /* @__PURE__ */ React.createElement("input", { value: formData.author, onChange: (e) => setFormData({ ...formData, author: e.target.value }), required: true })), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "btn btn-primary",
      onClick: handleAutoFill,
      disabled: isAutoFilling || !formData.title || !formData.author,
      style: { background: "linear-gradient(135deg, #a855f7, #6366f1)", border: "none", height: "42px", display: "flex", alignItems: "center" }
    },
    isAutoFilling ? /* @__PURE__ */ React.createElement(Loader2, { size: 18, className: "spin" }) : /* @__PURE__ */ React.createElement(Sparkles5, { size: 18 }),
    isAutoFilling ? " Thinking..." : " Auto-Fill"
  )), /* @__PURE__ */ React.createElement("div", { className: "form-group full" }, /* @__PURE__ */ React.createElement("label", null, "Cover URL or Upload Photo"), /* @__PURE__ */ React.createElement("div", { className: "form-input-with-preview" }, /* @__PURE__ */ React.createElement("input", { value: formData.cover, onChange: (e) => setFormData({ ...formData, cover: e.target.value }), placeholder: "https://...", required: true }), /* @__PURE__ */ React.createElement("div", { className: "file-upload-wrapper" }, /* @__PURE__ */ React.createElement("input", { type: "file", id: "cover-upload", accept: "image/*", onChange: handleFileUpload }), /* @__PURE__ */ React.createElement("label", { htmlFor: "cover-upload", className: "btn btn-secondary btn-icon-only" }, /* @__PURE__ */ React.createElement(Upload, { size: 16 }))), formData.cover && /* @__PURE__ */ React.createElement("div", { className: "admin-form-preview-mini" }, /* @__PURE__ */ React.createElement("img", { src: formData.cover, alt: "Preview", onError: (e) => e.target.style.display = "none" })))), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Primary Genre"), /* @__PURE__ */ React.createElement("input", { value: formData.genre, onChange: (e) => setFormData({ ...formData, genre: e.target.value }), required: true })), /* @__PURE__ */ React.createElement("div", { className: "form-group full" }, /* @__PURE__ */ React.createElement("label", null, "All Genres (comma separated)"), /* @__PURE__ */ React.createElement("input", { placeholder: "e.g. Fantasy, Mystery, Romance", value: formData.genres, onChange: (e) => setFormData({ ...formData, genres: e.target.value }) })), /* @__PURE__ */ React.createElement("div", { className: "form-group full" }, /* @__PURE__ */ React.createElement("label", null, "Tropes (comma separated)"), /* @__PURE__ */ React.createElement("input", { placeholder: "e.g. Found Family, Enemies to Lovers", value: formData.tropes, onChange: (e) => setFormData({ ...formData, tropes: e.target.value }) })), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Pacing"), /* @__PURE__ */ React.createElement("select", { value: formData.pacing, onChange: (e) => setFormData({ ...formData, pacing: e.target.value }), required: true }, /* @__PURE__ */ React.createElement("option", { value: "" }, "Select pacing..."), /* @__PURE__ */ React.createElement("option", { value: "Fast" }, "Fast"), /* @__PURE__ */ React.createElement("option", { value: "Medium" }, "Medium"), /* @__PURE__ */ React.createElement("option", { value: "Slow" }, "Slow"))), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Rating (0-5)"), /* @__PURE__ */ React.createElement("input", { type: "number", step: "0.1", value: formData.rating, onChange: (e) => setFormData({ ...formData, rating: e.target.value }), required: true })), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Year"), /* @__PURE__ */ React.createElement("input", { type: "number", value: formData.year, onChange: (e) => setFormData({ ...formData, year: e.target.value }), required: true })), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Pages"), /* @__PURE__ */ React.createElement("input", { type: "number", value: formData.pages, onChange: (e) => setFormData({ ...formData, pages: e.target.value }), required: true })), /* @__PURE__ */ React.createElement("div", { className: "form-group full" }, /* @__PURE__ */ React.createElement("label", null, "Moods (comma separated)"), /* @__PURE__ */ React.createElement("input", { placeholder: "e.g. Atmospheric, Mysterious, Intellectual", value: formData.mood, onChange: (e) => setFormData({ ...formData, mood: e.target.value }), required: true })), /* @__PURE__ */ React.createElement("div", { className: "form-group full" }, /* @__PURE__ */ React.createElement("label", null, "Review"), /* @__PURE__ */ React.createElement("textarea", { rows: "3", value: formData.review, onChange: (e) => setFormData({ ...formData, review: e.target.value }), required: true })), /* @__PURE__ */ React.createElement("div", { className: "form-group full" }, /* @__PURE__ */ React.createElement("label", null, "Signature Quote"), /* @__PURE__ */ React.createElement("input", { value: formData.quote, onChange: (e) => setFormData({ ...formData, quote: e.target.value }), required: true })), /* @__PURE__ */ React.createElement("div", { className: "form-group checkbox featured-toggle" }, /* @__PURE__ */ React.createElement("label", null, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: formData.featured, onChange: (e) => setFormData({ ...formData, featured: e.target.checked }) }), /* @__PURE__ */ React.createElement(Star4, { size: 16, className: formData.featured ? "active" : "" }), /* @__PURE__ */ React.createElement("span", null, "Display as ", /* @__PURE__ */ React.createElement("strong", null, "Staff Pick"), " on Homepage")))), /* @__PURE__ */ React.createElement("div", { className: "admin-modal-footer" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-ghost", onClick: () => setIsModalOpen(false) }, "Cancel"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-primary", disabled: isSaving }, isSaving ? "Saving..." : editingBook ? "Update Book" : "Add Book"))))), isListModalOpen && /* @__PURE__ */ React.createElement("div", { className: "admin-modal-overlay animate-fade-in" }, /* @__PURE__ */ React.createElement("div", { className: "admin-modal glass-card animate-scale-in", style: { maxWidth: "600px" } }, /* @__PURE__ */ React.createElement("div", { className: "admin-modal-header" }, /* @__PURE__ */ React.createElement("h3", null, editingList ? "Edit Curated List" : "Create New List"), /* @__PURE__ */ React.createElement("button", { className: "btn-icon", onClick: () => setIsListModalOpen(false) }, /* @__PURE__ */ React.createElement(X4, { size: 20 }))), /* @__PURE__ */ React.createElement("form", { onSubmit: handleSaveList, className: "admin-modal-form" }, /* @__PURE__ */ React.createElement("div", { className: "form-grid", style: { gridTemplateColumns: "1fr" } }, /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "List Title"), /* @__PURE__ */ React.createElement("input", { value: listFormData.title, onChange: (e) => setListFormData({ ...listFormData, title: e.target.value }), required: true })), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Description"), /* @__PURE__ */ React.createElement("textarea", { rows: "3", value: listFormData.description, onChange: (e) => setListFormData({ ...listFormData, description: e.target.value }), required: true })), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Icon Name (Lucide)"), /* @__PURE__ */ React.createElement("input", { placeholder: "e.g. Heart, CloudRain, Zap, Brain", value: listFormData.icon, onChange: (e) => setListFormData({ ...listFormData, icon: e.target.value }), required: true })), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "List Color Theme (Wheel)"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "1rem" } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "color",
      value: "#C9A84C",
      style: { width: "50px", height: "50px", border: "none", borderRadius: "50%", cursor: "pointer" },
      onChange: (e) => {
        const color = e.target.value;
        const gradient = `linear-gradient(135deg, ${color}22, ${color}11)`;
        setListFormData({ ...listFormData, gradient });
      }
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: "40px", borderRadius: "var(--radius-md)", background: listFormData.gradient, border: "1px solid var(--border-subtle)" } }))), /* @__PURE__ */ React.createElement("div", { className: "form-group full" }, /* @__PURE__ */ React.createElement("label", null, "Select Books for this List"), /* @__PURE__ */ React.createElement("div", { className: "admin-list-book-selector glass-card" }, /* @__PURE__ */ React.createElement("div", { className: "admin-list-book-grid" }, books.map((book) => /* @__PURE__ */ React.createElement("label", { key: book.id, className: `admin-list-book-option ${listFormData.selectedBookIds.includes(book.id) ? "active" : ""}` }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      checked: listFormData.selectedBookIds.includes(book.id),
      onChange: (e) => {
        const ids = e.target.checked ? [...listFormData.selectedBookIds, book.id] : listFormData.selectedBookIds.filter((id) => id !== book.id);
        setListFormData({ ...listFormData, selectedBookIds: ids });
      }
    }
  ), /* @__PURE__ */ React.createElement("img", { src: book.cover, alt: book.title }), /* @__PURE__ */ React.createElement("div", { className: "option-info" }, /* @__PURE__ */ React.createElement("span", { className: "option-title" }, book.title), /* @__PURE__ */ React.createElement("span", { className: "option-author" }, book.author)))))))), /* @__PURE__ */ React.createElement("div", { className: "admin-modal-footer" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-ghost", onClick: () => setIsListModalOpen(false) }, "Cancel"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-primary", disabled: isSaving }, isSaving ? "Saving..." : editingList ? "Update List" : "Create List"))))));
}

// src/pages/Auth/Auth.jsx
import React4, { useState as useState11 } from "react";
import { useNavigate as useNavigate2, Link as Link5 } from "react-router-dom";
import { Mail as Mail5, Lock, User as User3, ArrowRight as ArrowRight6, Library as Library3, Sparkles as Sparkles6, Eye as Eye2, EyeOff, ArrowLeft as ArrowLeft3 } from "lucide-react";
import toast6 from "react-hot-toast";
function Auth({ type = "login" }) {
  const [formData, setFormData] = useState11({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState11("");
  const [loading, setLoading] = useState11(false);
  const [showPassword, setShowPassword] = useState11(false);
  const [forgotMode, setForgotMode] = useState11(false);
  const [forgotEmail, setForgotEmail] = useState11("");
  const [forgotLoading, setForgotLoading] = useState11(false);
  const [forgotSent, setForgotSent] = useState11(false);
  const { login } = useAuth();
  const navigate = useNavigate2();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const endpoint = type === "login" ? `${API_BASE}/auth/login` : `${API_BASE}/auth/register`;
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user, data.token);
        toast6.success(type === "login" ? `Welcome back, ${data.user.username}!` : "Account created successfully!");
        navigate("/bookshelf");
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast6.error("Please enter your email address");
      return;
    }
    setForgotLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setForgotSent(true);
        toast6.success("Reset link sent! Check your inbox.");
      } else {
        toast6.error(data.error || "Something went wrong");
      }
    } catch (err) {
      toast6.error("Connection failed. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };
  if (forgotMode) {
    return /* @__PURE__ */ React4.createElement("div", { className: "auth-wrapper" }, /* @__PURE__ */ React4.createElement("div", { className: "auth-container glass-card animate-fade-in-up" }, /* @__PURE__ */ React4.createElement("div", { className: "auth-header" }, /* @__PURE__ */ React4.createElement(Library3, { size: 40, className: "auth-icon" }), /* @__PURE__ */ React4.createElement("h1", null, forgotSent ? "Check Your Email" : "Reset Password"), /* @__PURE__ */ React4.createElement("p", null, forgotSent ? "We've sent a password reset link to your email address." : "Enter the email address associated with your account.")), !forgotSent ? /* @__PURE__ */ React4.createElement("form", { onSubmit: handleForgotPassword, className: "auth-form", noValidate: true }, /* @__PURE__ */ React4.createElement("div", { className: "form-group" }, /* @__PURE__ */ React4.createElement("label", null, /* @__PURE__ */ React4.createElement(Mail5, { size: 14 }), " Email Address"), /* @__PURE__ */ React4.createElement(
      "input",
      {
        type: "email",
        placeholder: "reader@example.com",
        value: forgotEmail,
        onChange: (e) => setForgotEmail(e.target.value),
        autoFocus: true
      }
    )), /* @__PURE__ */ React4.createElement("button", { type: "submit", className: "btn btn-primary w-100", disabled: forgotLoading }, forgotLoading ? "Sending..." : "Send Reset Link", !forgotLoading && /* @__PURE__ */ React4.createElement(ArrowRight6, { size: 18 }))) : /* @__PURE__ */ React4.createElement("div", { className: "forgot-success animate-fade-in-up" }, /* @__PURE__ */ React4.createElement("div", { className: "forgot-success__icon" }, /* @__PURE__ */ React4.createElement(Mail5, { size: 48 })), /* @__PURE__ */ React4.createElement("p", null, "Didn't receive the email? Check your spam folder or try again."), /* @__PURE__ */ React4.createElement(
      "button",
      {
        className: "btn btn-secondary w-100",
        onClick: () => {
          setForgotSent(false);
          setForgotEmail("");
        }
      },
      "Try Again"
    )), /* @__PURE__ */ React4.createElement("div", { className: "auth-footer" }, /* @__PURE__ */ React4.createElement(
      "button",
      {
        className: "auth-back-link",
        onClick: () => {
          setForgotMode(false);
          setForgotSent(false);
          setForgotEmail("");
        }
      },
      /* @__PURE__ */ React4.createElement(ArrowLeft3, { size: 14 }),
      " Back to Sign In"
    ))), /* @__PURE__ */ React4.createElement("div", { className: "auth-bg-ornament top-right" }, /* @__PURE__ */ React4.createElement(Sparkles6, { size: 120 })), /* @__PURE__ */ React4.createElement("div", { className: "auth-bg-ornament bottom-left" }, /* @__PURE__ */ React4.createElement(Library3, { size: 120 })));
  }
  return /* @__PURE__ */ React4.createElement("div", { className: "auth-wrapper" }, /* @__PURE__ */ React4.createElement("div", { className: "auth-container glass-card animate-fade-in-up" }, /* @__PURE__ */ React4.createElement("div", { className: "auth-header" }, /* @__PURE__ */ React4.createElement(Library3, { size: 40, className: "auth-icon" }), /* @__PURE__ */ React4.createElement("h1", null, type === "login" ? "Welcome Back" : "Join the Readership"), /* @__PURE__ */ React4.createElement("p", null, type === "login" ? "Sign in to manage your personal bookshelf and reading goals." : "Create an account to start curating your own collection.")), error && /* @__PURE__ */ React4.createElement("div", { className: "auth-error animate-shake" }, error), /* @__PURE__ */ React4.createElement("form", { onSubmit: handleSubmit, className: "auth-form" }, type === "register" && /* @__PURE__ */ React4.createElement("div", { className: "form-group" }, /* @__PURE__ */ React4.createElement("label", null, /* @__PURE__ */ React4.createElement(User3, { size: 14 }), " Username"), /* @__PURE__ */ React4.createElement(
    "input",
    {
      type: "text",
      placeholder: "LibrarianAtHeart",
      value: formData.username,
      onChange: (e) => setFormData({ ...formData, username: e.target.value }),
      required: true
    }
  )), /* @__PURE__ */ React4.createElement("div", { className: "form-group" }, /* @__PURE__ */ React4.createElement("label", null, /* @__PURE__ */ React4.createElement(Mail5, { size: 14 }), " Email Address"), /* @__PURE__ */ React4.createElement(
    "input",
    {
      type: "email",
      placeholder: "reader@example.com",
      value: formData.email,
      onChange: (e) => setFormData({ ...formData, email: e.target.value }),
      required: true
    }
  )), /* @__PURE__ */ React4.createElement("div", { className: "form-group" }, /* @__PURE__ */ React4.createElement("label", null, /* @__PURE__ */ React4.createElement(Lock, { size: 14 }), " Password"), /* @__PURE__ */ React4.createElement("div", { className: "password-input-wrapper" }, /* @__PURE__ */ React4.createElement(
    "input",
    {
      type: showPassword ? "text" : "password",
      placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
      value: formData.password,
      onChange: (e) => setFormData({ ...formData, password: e.target.value }),
      required: true
    }
  ), /* @__PURE__ */ React4.createElement(
    "button",
    {
      type: "button",
      className: "password-toggle",
      onClick: () => setShowPassword(!showPassword),
      "aria-label": showPassword ? "Hide password" : "Show password",
      tabIndex: -1
    },
    showPassword ? /* @__PURE__ */ React4.createElement(EyeOff, { size: 18 }) : /* @__PURE__ */ React4.createElement(Eye2, { size: 18 })
  ))), type === "login" && /* @__PURE__ */ React4.createElement(
    "button",
    {
      type: "button",
      className: "forgot-password-link",
      onClick: () => setForgotMode(true)
    },
    "Forgot your password?"
  ), /* @__PURE__ */ React4.createElement("button", { type: "submit", className: "btn btn-primary w-100", disabled: loading }, loading ? "Processing..." : type === "login" ? "Sign In" : "Create Account", !loading && /* @__PURE__ */ React4.createElement(ArrowRight6, { size: 18 }))), /* @__PURE__ */ React4.createElement("div", { className: "auth-footer" }, type === "login" ? /* @__PURE__ */ React4.createElement("p", null, "Don't have an account? ", /* @__PURE__ */ React4.createElement(Link5, { to: "/register" }, "Create one")) : /* @__PURE__ */ React4.createElement("p", null, "Already have an account? ", /* @__PURE__ */ React4.createElement(Link5, { to: "/login" }, "Sign in")))), /* @__PURE__ */ React4.createElement("div", { className: "auth-bg-ornament top-right" }, /* @__PURE__ */ React4.createElement(Sparkles6, { size: 120 })), /* @__PURE__ */ React4.createElement("div", { className: "auth-bg-ornament bottom-left" }, /* @__PURE__ */ React4.createElement(Library3, { size: 120 })));
}

// src/pages/MyShelf/MyShelf.jsx
import React5, { useState as useState12, useEffect as useEffect10, useRef as useRef4 } from "react";
import { useNavigate as useNavigate3 } from "react-router-dom";
import { BookOpen as BookOpen7, Trash2 as Trash23, Heart as Heart3, Clock as Clock4, CheckCircle2 as CheckCircle24, Bookmark as Bookmark2, Camera, User as User4, Settings as Settings2, ChevronLeft as ChevronLeft2, ChevronRight as ChevronRight3 } from "lucide-react";
import toast7 from "react-hot-toast";
var ITEMS_PER_PAGE = 8;
function ShelfSection({ section, allBooks, onSelectBook, onMarkRead, onRemove }) {
  const [currentPage, setCurrentPage] = useState12(1);
  const sectionBooks = allBooks.filter((b) => b.status === section.status);
  if (sectionBooks.length === 0) return null;
  const totalPages = Math.ceil(sectionBooks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pagedBooks = sectionBooks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const element = document.getElementById(`section-${section.status}`);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return /* @__PURE__ */ React5.createElement("div", { key: section.status, className: "myshelf-section animate-fade-in-up", id: `section-${section.status}` }, /* @__PURE__ */ React5.createElement("div", { className: "myshelf-section-header" }, section.icon, /* @__PURE__ */ React5.createElement("h2", null, section.title), /* @__PURE__ */ React5.createElement("span", { className: "count-badge" }, sectionBooks.length)), sectionBooks.length > 0 ? /* @__PURE__ */ React5.createElement(React5.Fragment, null, /* @__PURE__ */ React5.createElement("div", { className: "myshelf-grid" }, pagedBooks.map((book, i) => /* @__PURE__ */ React5.createElement("div", { key: book.id, className: "myshelf-item-wrapper" }, /* @__PURE__ */ React5.createElement(BookCard, { book, index: i, onClick: onSelectBook, isProfile: true }), book.status === "Want to Read" && /* @__PURE__ */ React5.createElement(
    "button",
    {
      className: "mark-read-btn",
      onClick: (e) => onMarkRead(e, book.id),
      title: "Mark as completed"
    },
    /* @__PURE__ */ React5.createElement(CheckCircle24, { size: 16 }),
    " Read"
  ), /* @__PURE__ */ React5.createElement(
    "button",
    {
      className: "remove-shelf-btn",
      onClick: (e) => onRemove(e, book.id),
      title: "Remove from archive"
    },
    /* @__PURE__ */ React5.createElement(Trash23, { size: 16 })
  )))), totalPages > 1 && /* @__PURE__ */ React5.createElement("div", { className: "bookshelf-pagination", style: { marginTop: "var(--space-xl)" } }, /* @__PURE__ */ React5.createElement(
    "button",
    {
      className: "btn btn-ghost bookshelf-page-btn",
      onClick: () => handlePageChange(Math.max(1, currentPage - 1)),
      disabled: currentPage === 1
    },
    /* @__PURE__ */ React5.createElement(ChevronLeft2, { size: 16 })
  ), Array.from({ length: totalPages }).map((_, i) => /* @__PURE__ */ React5.createElement(
    "button",
    {
      key: i + 1,
      className: `bookshelf-page-btn ${currentPage === i + 1 ? "active" : ""}`,
      onClick: () => handlePageChange(i + 1)
    },
    i + 1
  )), /* @__PURE__ */ React5.createElement(
    "button",
    {
      className: "btn btn-ghost bookshelf-page-btn",
      onClick: () => handlePageChange(Math.min(totalPages, currentPage + 1)),
      disabled: currentPage === totalPages
    },
    /* @__PURE__ */ React5.createElement(ChevronRight3, { size: 16 })
  ))) : /* @__PURE__ */ React5.createElement("div", { className: "empty-section-hint glass-card" }, /* @__PURE__ */ React5.createElement("p", null, "No books in this section yet.")));
}
function MyShelf() {
  const { user, token, loading: authLoading, updateUser, refreshUserBooks } = useAuth();
  const [books, setBooks] = useState12([]);
  const [loading, setLoading] = useState12(true);
  const [selectedBook, setSelectedBook] = useState12(null);
  const [uploadingAvatar, setUploadingAvatar] = useState12(false);
  const fileInputRef = useRef4(null);
  const navigate = useNavigate3();
  useEffect10(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);
  const loadUserBooks = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/user/books`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (err) {
      console.error("Failed to load bookshelf");
    } finally {
      setLoading(false);
    }
  };
  useEffect10(() => {
    loadUserBooks();
  }, [token]);
  const handleRemoveBook = async (e, bookId) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_BASE}/user/books/${bookId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setBooks(books.filter((b) => b.id !== bookId));
        refreshUserBooks();
        toast7.success("Removed from archive");
      }
    } catch (err) {
      toast7.error("Failed to remove book");
    }
  };
  const handleMarkAsRead = async (e, bookId) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_BASE}/user/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ bookId, status: "Read" })
      });
      if (res.ok) {
        setBooks((prev) => prev.map(
          (b) => b.id === bookId ? { ...b, status: "Read" } : b
        ));
        refreshUserBooks();
        toast7.success("Marked as read");
      }
    } catch (err) {
      toast7.error("Failed to update book status");
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
        toast7.success("Avatar updated successfully");
      }
    } catch (err) {
      toast7.error("Failed to upload avatar. Please try again.");
    } finally {
      setUploadingAvatar(false);
    }
  };
  if (authLoading || loading && books.length === 0) {
    return /* @__PURE__ */ React5.createElement("div", { className: "loading-state" }, "Tending to your shelves...");
  }
  const sections = [
    { title: "Want to Read", status: "Want to Read", icon: /* @__PURE__ */ React5.createElement(Bookmark2, { size: 20 }) },
    { title: "Completed", status: "Read", icon: /* @__PURE__ */ React5.createElement(CheckCircle24, { size: 20 }) }
  ];
  return /* @__PURE__ */ React5.createElement("div", { className: "page-wrapper myshelf-page" }, /* @__PURE__ */ React5.createElement("header", { className: "myshelf-header" }, /* @__PURE__ */ React5.createElement("div", { className: "container myshelf-header-content" }, /* @__PURE__ */ React5.createElement("div", { className: "myshelf-profile" }, /* @__PURE__ */ React5.createElement("div", { className: "myshelf-avatar-container" }, user?.avatar ? /* @__PURE__ */ React5.createElement("img", { src: user.avatar, alt: user.username, className: "myshelf-avatar" }) : /* @__PURE__ */ React5.createElement("div", { className: "myshelf-avatar-placeholder" }, /* @__PURE__ */ React5.createElement(User4, { size: 48 })), /* @__PURE__ */ React5.createElement(
    "button",
    {
      className: "myshelf-avatar-edit",
      onClick: () => fileInputRef.current?.click(),
      disabled: uploadingAvatar,
      title: "Change Avatar"
    },
    /* @__PURE__ */ React5.createElement(Camera, { size: 16 })
  ), /* @__PURE__ */ React5.createElement(
    "input",
    {
      type: "file",
      ref: fileInputRef,
      onChange: handleAvatarUpload,
      accept: "image/*",
      style: { display: "none" }
    }
  )), /* @__PURE__ */ React5.createElement("div", { className: "myshelf-info" }, /* @__PURE__ */ React5.createElement("span", { className: "section-label" }, "Personal Archive"), /* @__PURE__ */ React5.createElement("h1", null, "Welcome, ", user?.username), /* @__PURE__ */ React5.createElement("p", null, "Your sanctuary for the stories you've discovered and those yet to be told."), /* @__PURE__ */ React5.createElement(
    "button",
    {
      className: "btn btn-outline",
      style: { marginTop: "1rem", display: "inline-flex", alignItems: "center", gap: "8px" },
      onClick: () => navigate("/settings")
    },
    /* @__PURE__ */ React5.createElement(Settings2, { size: 16 }),
    " Account Settings"
  ))))), /* @__PURE__ */ React5.createElement("section", { className: "section" }, /* @__PURE__ */ React5.createElement("div", { className: "container" }, books.length === 0 ? /* @__PURE__ */ React5.createElement("div", { className: "empty-shelf glass-card animate-fade-in" }, /* @__PURE__ */ React5.createElement(BookOpen7, { size: 48 }), /* @__PURE__ */ React5.createElement("h3", null, "Your shelves are empty"), /* @__PURE__ */ React5.createElement("p", null, "Start exploring the library and add books to your archive."), /* @__PURE__ */ React5.createElement("button", { className: "btn btn-primary", onClick: () => navigate("/bookshelf") }, "Explore The Bookshelf")) : /* @__PURE__ */ React5.createElement("div", { className: "myshelf-content" }, sections.map((section) => /* @__PURE__ */ React5.createElement(
    ShelfSection,
    {
      key: section.status,
      section,
      allBooks: books,
      onSelectBook: setSelectedBook,
      onMarkRead: handleMarkAsRead,
      onRemove: handleRemoveBook
    }
  ))))), selectedBook && /* @__PURE__ */ React5.createElement(
    BookModal,
    {
      book: selectedBook,
      onClose: () => setSelectedBook(null)
    }
  ));
}

// src/pages/Settings/Settings.jsx
import React6, { useState as useState13, useRef as useRef5 } from "react";
import { useNavigate as useNavigate4 } from "react-router-dom";
import { User as User5, Lock as Lock2, Trash2 as Trash24, Camera as Camera2, LogOut as LogOut3, ArrowLeft as ArrowLeft4, Eye as Eye3, EyeOff as EyeOff2 } from "lucide-react";
import toast8 from "react-hot-toast";
function Settings3() {
  const { user, token, logout, updateUser } = useAuth();
  const navigate = useNavigate4();
  const fileInputRef = useRef5(null);
  const [activeTab, setActiveTab] = useState13("profile");
  const [uploadingAvatar, setUploadingAvatar] = useState13(false);
  const [showPassword, setShowPassword] = useState13(false);
  const [username, setUsername] = useState13(user?.username || "");
  const [email, setEmail] = useState13(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState13("");
  const [newPassword, setNewPassword] = useState13("");
  if (!user) {
    navigate("/login");
    return null;
  }
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingAvatar(true);
      const res = await uploadAvatar(file, token);
      if (res.avatar) {
        updateUser({ avatar: res.avatar });
        toast8.success("Avatar updated successfully");
      }
    } catch (err) {
      toast8.error("Failed to upload avatar.");
    } finally {
      setUploadingAvatar(false);
    }
  };
  const handleRemoveAvatar = async () => {
    try {
      const res = await fetch(`${API_BASE}/users/avatar`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        updateUser({ avatar: null });
        toast8.success("Avatar removed");
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      toast8.error("Failed to remove avatar.");
    }
  };
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ username, email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");
      updateUser({ username: data.username, email: data.email });
      toast8.success("Profile updated successfully");
    } catch (err) {
      toast8.error(err.message);
    }
  };
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    try {
      const res = await fetch(`${API_BASE}/users/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");
      setCurrentPassword("");
      setNewPassword("");
      toast8.success("Password updated successfully");
    } catch (err) {
      toast8.error(err.message);
    }
  };
  const handleDeleteAccount = async () => {
    toast8((t) => /* @__PURE__ */ React6.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "8px" } }, /* @__PURE__ */ React6.createElement("p", { style: { margin: 0, fontWeight: 600 } }, "Delete your account?"), /* @__PURE__ */ React6.createElement("p", { style: { margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" } }, "This will permanently erase your archive and thoughts."), /* @__PURE__ */ React6.createElement("div", { style: { display: "flex", gap: "8px", marginTop: "8px" } }, /* @__PURE__ */ React6.createElement(
      "button",
      {
        className: "btn-sm",
        style: { background: "var(--accent-rose)", color: "white", border: "none" },
        onClick: async () => {
          toast8.dismiss(t.id);
          try {
            const res = await fetch(`${API_BASE}/users/account`, {
              method: "DELETE",
              headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
              logout();
              navigate("/");
              toast8.success("Account deleted");
            } else {
              throw new Error("Failed to delete account");
            }
          } catch (err) {
            toast8.error(err.message);
          }
        }
      },
      "Yes, Delete"
    ), /* @__PURE__ */ React6.createElement("button", { className: "btn-sm btn-ghost", onClick: () => toast8.dismiss(t.id) }, "Cancel"))), { duration: 5e3, position: "top-center" });
  };
  return /* @__PURE__ */ React6.createElement("div", { className: "page-wrapper settings-page" }, /* @__PURE__ */ React6.createElement("header", { className: "settings-header" }, /* @__PURE__ */ React6.createElement("div", { className: "container" }, /* @__PURE__ */ React6.createElement("span", { className: "section-label" }, "Account Preferences"), /* @__PURE__ */ React6.createElement("h1", null, "Settings"), /* @__PURE__ */ React6.createElement("p", null, "Manage your literary sanctuary profile and security."))), /* @__PURE__ */ React6.createElement("section", { className: "section" }, /* @__PURE__ */ React6.createElement("div", { className: "container settings-container" }, /* @__PURE__ */ React6.createElement("div", { className: "settings-nav-header" }, /* @__PURE__ */ React6.createElement("button", { className: "settings-back-btn", onClick: () => navigate("/my-shelf") }, /* @__PURE__ */ React6.createElement(ArrowLeft4, { size: 18 }), " Back to Archive")), /* @__PURE__ */ React6.createElement("aside", { className: "settings-sidebar animate-fade-in-up" }, /* @__PURE__ */ React6.createElement("nav", { className: "settings-nav" }, /* @__PURE__ */ React6.createElement(
    "button",
    {
      className: `settings-tab ${activeTab === "profile" ? "active" : ""}`,
      onClick: () => setActiveTab("profile")
    },
    /* @__PURE__ */ React6.createElement(User5, { size: 18 }),
    " Profile"
  ), /* @__PURE__ */ React6.createElement(
    "button",
    {
      className: `settings-tab ${activeTab === "security" ? "active" : ""}`,
      onClick: () => setActiveTab("security")
    },
    /* @__PURE__ */ React6.createElement(Lock2, { size: 18 }),
    " Security"
  ), /* @__PURE__ */ React6.createElement(
    "button",
    {
      className: `settings-tab danger-tab ${activeTab === "danger" ? "active" : ""}`,
      onClick: () => setActiveTab("danger")
    },
    /* @__PURE__ */ React6.createElement(Trash24, { size: 18 }),
    " Danger Zone"
  ))), /* @__PURE__ */ React6.createElement("main", { className: "settings-content glass-card animate-scale-in" }, activeTab === "profile" && /* @__PURE__ */ React6.createElement("div", { className: "settings-panel" }, /* @__PURE__ */ React6.createElement("h2", null, "Public Profile"), /* @__PURE__ */ React6.createElement("div", { className: "settings-avatar-section" }, /* @__PURE__ */ React6.createElement("div", { className: "settings-avatar-wrapper" }, user?.avatar ? /* @__PURE__ */ React6.createElement("img", { src: user.avatar, alt: "Avatar", className: "settings-avatar" }) : /* @__PURE__ */ React6.createElement("div", { className: "settings-avatar-placeholder" }, /* @__PURE__ */ React6.createElement(User5, { size: 40 })), /* @__PURE__ */ React6.createElement(
    "button",
    {
      className: "settings-avatar-edit-btn",
      onClick: () => fileInputRef.current?.click(),
      disabled: uploadingAvatar
    },
    /* @__PURE__ */ React6.createElement(Camera2, { size: 14 })
  ), /* @__PURE__ */ React6.createElement(
    "input",
    {
      type: "file",
      ref: fileInputRef,
      onChange: handleAvatarUpload,
      accept: "image/*",
      style: { display: "none" }
    }
  )), /* @__PURE__ */ React6.createElement("div", { className: "settings-avatar-actions" }, /* @__PURE__ */ React6.createElement("h3", null, "Profile Picture"), /* @__PURE__ */ React6.createElement("p", null, "PNG, JPG, or GIF up to 5MB."), user?.avatar && /* @__PURE__ */ React6.createElement("button", { className: "btn-text btn-text-danger", onClick: handleRemoveAvatar }, "Remove Picture"))), /* @__PURE__ */ React6.createElement("form", { className: "settings-form", onSubmit: handleUpdateProfile }, /* @__PURE__ */ React6.createElement("div", { className: "form-group" }, /* @__PURE__ */ React6.createElement("label", null, "Username"), /* @__PURE__ */ React6.createElement(
    "input",
    {
      type: "text",
      value: username,
      onChange: (e) => setUsername(e.target.value),
      required: true
    }
  )), /* @__PURE__ */ React6.createElement("div", { className: "form-group" }, /* @__PURE__ */ React6.createElement("label", null, "Email Address"), /* @__PURE__ */ React6.createElement(
    "input",
    {
      type: "email",
      value: email,
      onChange: (e) => setEmail(e.target.value),
      required: true
    }
  )), /* @__PURE__ */ React6.createElement("button", { type: "submit", className: "btn btn-primary" }, "Save Changes"))), activeTab === "security" && /* @__PURE__ */ React6.createElement("div", { className: "settings-panel" }, /* @__PURE__ */ React6.createElement("h2", null, "Security & Password"), /* @__PURE__ */ React6.createElement("p", { className: "settings-desc" }, "Ensure your account is using a long, random password to stay secure."), /* @__PURE__ */ React6.createElement("form", { className: "settings-form", onSubmit: handleUpdatePassword }, /* @__PURE__ */ React6.createElement("div", { className: "form-group" }, /* @__PURE__ */ React6.createElement("label", null, "Current Password"), /* @__PURE__ */ React6.createElement("div", { className: "password-input-wrapper" }, /* @__PURE__ */ React6.createElement(
    "input",
    {
      type: showPassword ? "text" : "password",
      value: currentPassword,
      onChange: (e) => setCurrentPassword(e.target.value),
      required: true
    }
  ), /* @__PURE__ */ React6.createElement(
    "button",
    {
      type: "button",
      className: "password-toggle",
      onClick: () => setShowPassword(!showPassword),
      tabIndex: -1
    },
    showPassword ? /* @__PURE__ */ React6.createElement(EyeOff2, { size: 18 }) : /* @__PURE__ */ React6.createElement(Eye3, { size: 18 })
  ))), /* @__PURE__ */ React6.createElement("div", { className: "form-group" }, /* @__PURE__ */ React6.createElement("label", null, "New Password"), /* @__PURE__ */ React6.createElement("div", { className: "password-input-wrapper" }, /* @__PURE__ */ React6.createElement(
    "input",
    {
      type: showPassword ? "text" : "password",
      value: newPassword,
      onChange: (e) => setNewPassword(e.target.value),
      required: true,
      minLength: "6"
    }
  ))), /* @__PURE__ */ React6.createElement("button", { type: "submit", className: "btn btn-primary" }, "Update Password")), /* @__PURE__ */ React6.createElement("div", { className: "settings-divider" }), /* @__PURE__ */ React6.createElement("div", { className: "settings-logout" }, /* @__PURE__ */ React6.createElement("h3", null, "Log Out"), /* @__PURE__ */ React6.createElement("p", null, "Log out of your account on this device."), /* @__PURE__ */ React6.createElement("button", { className: "btn btn-outline", onClick: logout }, /* @__PURE__ */ React6.createElement(LogOut3, { size: 16 }), " Log Out"))), activeTab === "danger" && /* @__PURE__ */ React6.createElement("div", { className: "settings-panel" }, /* @__PURE__ */ React6.createElement("h2", { className: "danger-text" }, "Danger Zone"), /* @__PURE__ */ React6.createElement("p", { className: "settings-desc" }, "Once you delete your account, there is no going back. Please be certain."), /* @__PURE__ */ React6.createElement("div", { className: "danger-box" }, /* @__PURE__ */ React6.createElement("div", { className: "danger-box-info" }, /* @__PURE__ */ React6.createElement("h3", null, "Delete Account"), /* @__PURE__ */ React6.createElement("p", null, "Permanently remove your personal archive, reading lists, and community comments.")), /* @__PURE__ */ React6.createElement("button", { className: "btn btn-danger", onClick: handleDeleteAccount }, "Delete Account")))))));
}

// src/pages/ResetPassword/ResetPassword.jsx
import React7, { useState as useState14 } from "react";
import { useNavigate as useNavigate5, useSearchParams, Link as Link6 } from "react-router-dom";
import { Lock as Lock3, ArrowRight as ArrowRight7, Library as Library4, Sparkles as Sparkles7, Eye as Eye4, EyeOff as EyeOff3, CheckCircle2 as CheckCircle25 } from "lucide-react";
import toast9 from "react-hot-toast";
function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate5();
  const [newPassword, setNewPassword] = useState14("");
  const [confirmPassword, setConfirmPassword] = useState14("");
  const [showPassword, setShowPassword] = useState14(false);
  const [loading, setLoading] = useState14(false);
  const [success, setSuccess] = useState14(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast9.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast9.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        toast9.success("Password reset successfully!");
      } else {
        toast9.error(data.error || "Failed to reset password");
      }
    } catch (err) {
      toast9.error("Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  if (!token) {
    return /* @__PURE__ */ React7.createElement("div", { className: "auth-wrapper" }, /* @__PURE__ */ React7.createElement("div", { className: "auth-container glass-card animate-fade-in-up" }, /* @__PURE__ */ React7.createElement("div", { className: "auth-header" }, /* @__PURE__ */ React7.createElement(Library4, { size: 40, className: "auth-icon" }), /* @__PURE__ */ React7.createElement("h1", null, "Invalid Link"), /* @__PURE__ */ React7.createElement("p", null, "This password reset link is invalid or has expired.")), /* @__PURE__ */ React7.createElement(Link6, { to: "/login", className: "btn btn-primary w-100", style: { textDecoration: "none", textAlign: "center" } }, "Back to Sign In ", /* @__PURE__ */ React7.createElement(ArrowRight7, { size: 18 }))), /* @__PURE__ */ React7.createElement("div", { className: "auth-bg-ornament top-right" }, /* @__PURE__ */ React7.createElement(Sparkles7, { size: 120 })), /* @__PURE__ */ React7.createElement("div", { className: "auth-bg-ornament bottom-left" }, /* @__PURE__ */ React7.createElement(Library4, { size: 120 })));
  }
  if (success) {
    return /* @__PURE__ */ React7.createElement("div", { className: "auth-wrapper" }, /* @__PURE__ */ React7.createElement("div", { className: "auth-container glass-card animate-fade-in-up" }, /* @__PURE__ */ React7.createElement("div", { className: "auth-header" }, /* @__PURE__ */ React7.createElement("div", { className: "reset-success-icon" }, /* @__PURE__ */ React7.createElement(CheckCircle25, { size: 48 })), /* @__PURE__ */ React7.createElement("h1", null, "Password Reset!"), /* @__PURE__ */ React7.createElement("p", null, "Your password has been updated successfully. You can now sign in with your new password.")), /* @__PURE__ */ React7.createElement(Link6, { to: "/login", className: "btn btn-primary w-100", style: { textDecoration: "none", textAlign: "center" } }, "Sign In ", /* @__PURE__ */ React7.createElement(ArrowRight7, { size: 18 }))), /* @__PURE__ */ React7.createElement("div", { className: "auth-bg-ornament top-right" }, /* @__PURE__ */ React7.createElement(Sparkles7, { size: 120 })), /* @__PURE__ */ React7.createElement("div", { className: "auth-bg-ornament bottom-left" }, /* @__PURE__ */ React7.createElement(Library4, { size: 120 })));
  }
  return /* @__PURE__ */ React7.createElement("div", { className: "auth-wrapper" }, /* @__PURE__ */ React7.createElement("div", { className: "auth-container glass-card animate-fade-in-up" }, /* @__PURE__ */ React7.createElement("div", { className: "auth-header" }, /* @__PURE__ */ React7.createElement(Library4, { size: 40, className: "auth-icon" }), /* @__PURE__ */ React7.createElement("h1", null, "New Password"), /* @__PURE__ */ React7.createElement("p", null, "Choose a strong new password for your account.")), /* @__PURE__ */ React7.createElement("form", { onSubmit: handleSubmit, className: "auth-form", noValidate: true }, /* @__PURE__ */ React7.createElement("div", { className: "form-group" }, /* @__PURE__ */ React7.createElement("label", null, /* @__PURE__ */ React7.createElement(Lock3, { size: 14 }), " New Password"), /* @__PURE__ */ React7.createElement("div", { className: "password-input-wrapper" }, /* @__PURE__ */ React7.createElement(
    "input",
    {
      type: showPassword ? "text" : "password",
      placeholder: "At least 6 characters",
      value: newPassword,
      onChange: (e) => setNewPassword(e.target.value),
      autoFocus: true
    }
  ), /* @__PURE__ */ React7.createElement(
    "button",
    {
      type: "button",
      className: "password-toggle",
      onClick: () => setShowPassword(!showPassword),
      "aria-label": showPassword ? "Hide password" : "Show password",
      tabIndex: -1
    },
    showPassword ? /* @__PURE__ */ React7.createElement(EyeOff3, { size: 18 }) : /* @__PURE__ */ React7.createElement(Eye4, { size: 18 })
  ))), /* @__PURE__ */ React7.createElement("div", { className: "form-group" }, /* @__PURE__ */ React7.createElement("label", null, /* @__PURE__ */ React7.createElement(Lock3, { size: 14 }), " Confirm Password"), /* @__PURE__ */ React7.createElement("div", { className: "password-input-wrapper" }, /* @__PURE__ */ React7.createElement(
    "input",
    {
      type: showPassword ? "text" : "password",
      placeholder: "Re-enter your password",
      value: confirmPassword,
      onChange: (e) => setConfirmPassword(e.target.value)
    }
  ))), /* @__PURE__ */ React7.createElement("button", { type: "submit", className: "btn btn-primary w-100", disabled: loading }, loading ? "Resetting..." : "Reset Password", !loading && /* @__PURE__ */ React7.createElement(ArrowRight7, { size: 18 }))), /* @__PURE__ */ React7.createElement("div", { className: "auth-footer" }, /* @__PURE__ */ React7.createElement(Link6, { to: "/login", style: { color: "var(--accent-gold)", fontWeight: 600 } }, "Back to Sign In"))), /* @__PURE__ */ React7.createElement("div", { className: "auth-bg-ornament top-right" }, /* @__PURE__ */ React7.createElement(Sparkles7, { size: 120 })), /* @__PURE__ */ React7.createElement("div", { className: "auth-bg-ornament bottom-left" }, /* @__PURE__ */ React7.createElement(Library4, { size: 120 })));
}

// src/pages/Shop/Shop.jsx
import React9, { useState as useState16, useEffect as useEffect12 } from "react";
import { Link as Link7 } from "react-router-dom";
import { ShoppingBag as ShoppingBag2, Loader as Loader3, Search as Search3, ShoppingCart as ShoppingCart3, Plus as Plus3 } from "lucide-react";

// src/context/CartContext.jsx
import React8, { createContext as createContext2, useContext as useContext2, useState as useState15, useEffect as useEffect11 } from "react";
import toast10 from "react-hot-toast";
var CartContext = createContext2();
function useCart() {
  return useContext2(CartContext);
}
function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState15(() => {
    try {
      const saved = localStorage.getItem("s_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState15(false);
  useEffect11(() => {
    localStorage.setItem("s_cart", JSON.stringify(cartItems));
  }, [cartItems]);
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast10.error("Cannot add more than available stock.");
          return prev;
        }
        toast10.success(`Increased ${product.title} quantity.`);
        return prev.map(
          (item) => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      toast10.success(`${product.title} added to cart!`);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  };
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) => prev.map((item) => {
      if (item._id === productId) {
        if (newQuantity > item.stock) {
          toast10.error("Cannot exceed available stock.");
          return item;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };
  const clearCart = () => {
    setCartItems([]);
  };
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };
  return /* @__PURE__ */ React8.createElement(CartContext.Provider, { value: {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isCartOpen,
    setIsCartOpen
  } }, children);
}

// src/pages/Shop/Shop.jsx
function Shop() {
  const { getCartCount, setIsCartOpen, addToCart } = useCart();
  const [products, setProducts] = useState16([]);
  const [loading, setLoading] = useState16(true);
  const [searchQuery, setSearchQuery] = useState16("");
  useEffect12(() => {
    loadProducts();
  }, []);
  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
    }
  };
  const filteredProducts = products.filter(
    (p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case "GBP":
        return "\xA3";
      case "USD":
        return "$";
      case "NGN":
        return "\u20A6";
      default:
        return "\u20A6";
    }
  };
  return /* @__PURE__ */ React9.createElement("div", { className: "shop-page page-transition" }, /* @__PURE__ */ React9.createElement("header", { className: "shop-hero" }, /* @__PURE__ */ React9.createElement("div", { className: "shop-hero-content animate-fade-in" }, /* @__PURE__ */ React9.createElement("h1", null, "The Sanctuary Shop"), /* @__PURE__ */ React9.createElement("p", null, "Exclusive merchandise, signed copies, and literary treasures."))), /* @__PURE__ */ React9.createElement("section", { className: "shop-main container" }, /* @__PURE__ */ React9.createElement("div", { className: "shop-controls animate-slide-up" }, /* @__PURE__ */ React9.createElement("div", { className: "shop-search glass-card" }, /* @__PURE__ */ React9.createElement(Search3, { size: 20 }), /* @__PURE__ */ React9.createElement(
    "input",
    {
      type: "text",
      placeholder: "Search products...",
      value: searchQuery,
      onChange: (e) => setSearchQuery(e.target.value)
    }
  ))), loading ? /* @__PURE__ */ React9.createElement("div", { className: "shop-loading" }, /* @__PURE__ */ React9.createElement(Loader3, { className: "spin", size: 32 }), /* @__PURE__ */ React9.createElement("p", null, "Curating the collection...")) : /* @__PURE__ */ React9.createElement("div", { className: "shop-grid" }, filteredProducts.length === 0 ? /* @__PURE__ */ React9.createElement("div", { className: "shop-empty" }, /* @__PURE__ */ React9.createElement(ShoppingBag2, { size: 48 }), /* @__PURE__ */ React9.createElement("p", null, "No products found.")) : filteredProducts.map((product, index) => /* @__PURE__ */ React9.createElement(
    Link7,
    {
      to: `/shop/${product._id}`,
      key: product._id,
      className: "shop-card glass-card animate-scale-in",
      style: { animationDelay: `${index * 0.05}s` }
    },
    /* @__PURE__ */ React9.createElement("div", { className: "shop-card-image-wrapper" }, product.images && product.images[0] ? /* @__PURE__ */ React9.createElement("img", { src: product.images[0], alt: product.title, loading: "lazy" }) : /* @__PURE__ */ React9.createElement("div", { className: "shop-card-placeholder" }, /* @__PURE__ */ React9.createElement(ShoppingBag2, { size: 48, opacity: 0.5 })), product.isFeatured && /* @__PURE__ */ React9.createElement("span", { className: "shop-badge featured" }, "Featured"), product.stock === 0 && /* @__PURE__ */ React9.createElement("span", { className: "shop-badge sold-out" }, "Sold Out")),
    /* @__PURE__ */ React9.createElement("div", { className: "shop-card-content" }, /* @__PURE__ */ React9.createElement("span", { className: "shop-card-category" }, product.category), /* @__PURE__ */ React9.createElement("h3", null, product.title), /* @__PURE__ */ React9.createElement("div", { className: "shop-card-footer" }, /* @__PURE__ */ React9.createElement("span", { className: "shop-card-price" }, getCurrencySymbol(product.currency), product.price.toFixed(2)), /* @__PURE__ */ React9.createElement(
      "button",
      {
        className: "btn-quick-add",
        disabled: product.stock <= 0,
        onClick: (e) => {
          e.preventDefault();
          addToCart(product);
        },
        title: product.stock > 0 ? "Add to Cart" : "Out of Stock"
      },
      /* @__PURE__ */ React9.createElement(Plus3, { size: 18 })
    )))
  )))), /* @__PURE__ */ React9.createElement("button", { className: "floating-cart-btn glass-card", onClick: () => setIsCartOpen(true) }, /* @__PURE__ */ React9.createElement(ShoppingCart3, { size: 24 }), getCartCount() > 0 && /* @__PURE__ */ React9.createElement("span", { className: "cart-badge" }, getCartCount())));
}

// src/pages/Shop/ProductDetails.jsx
import React10, { useState as useState17, useEffect as useEffect13 } from "react";
import { useParams, Link as Link8, useNavigate as useNavigate6 } from "react-router-dom";
import { ShoppingCart as ShoppingCart4, ArrowLeft as ArrowLeft5, Loader as Loader4, Check as Check2 } from "lucide-react";
function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate6();
  const { addToCart, getCartCount, setIsCartOpen } = useCart();
  const [product, setProduct] = useState17(null);
  const [loading, setLoading] = useState17(true);
  const [error, setError] = useState17("");
  useEffect13(() => {
    loadProduct();
  }, [id]);
  const loadProduct = async () => {
    try {
      const data = await fetchProductById(id);
      setProduct(data);
    } catch (err) {
      setError("Product not found or unavailable.");
    } finally {
      setLoading(false);
    }
  };
  const handleAddToCart = () => {
    addToCart(product);
  };
  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case "GBP":
        return "\xA3";
      case "USD":
        return "$";
      case "NGN":
        return "\u20A6";
      default:
        return "\u20A6";
    }
  };
  if (loading) {
    return /* @__PURE__ */ React10.createElement("div", { className: "shop-page page-transition" }, /* @__PURE__ */ React10.createElement("div", { className: "shop-loading" }, /* @__PURE__ */ React10.createElement(Loader4, { className: "spin", size: 32 }), /* @__PURE__ */ React10.createElement("p", null, "Loading product details...")));
  }
  if (error || !product) {
    return /* @__PURE__ */ React10.createElement("div", { className: "shop-page page-transition" }, /* @__PURE__ */ React10.createElement("div", { className: "shop-empty" }, /* @__PURE__ */ React10.createElement("p", null, error), /* @__PURE__ */ React10.createElement(Link8, { to: "/shop", className: "btn btn-secondary" }, "Return to Shop")));
  }
  return /* @__PURE__ */ React10.createElement("div", { className: "product-details-page page-transition" }, /* @__PURE__ */ React10.createElement("div", { className: "product-details-container animate-fade-in" }, /* @__PURE__ */ React10.createElement("div", { className: "product-gallery animate-slide-right" }, /* @__PURE__ */ React10.createElement("div", { className: "product-breadcrumb" }, /* @__PURE__ */ React10.createElement(Link8, { to: "/shop" }, /* @__PURE__ */ React10.createElement(ArrowLeft5, { size: 14, style: { display: "inline", marginRight: "4px" } }), " Shop"), /* @__PURE__ */ React10.createElement("span", { style: { margin: "0 8px" } }, "/"), /* @__PURE__ */ React10.createElement("span", null, product.category)), /* @__PURE__ */ React10.createElement("div", { className: "product-image-main" }, product.images && product.images[0] ? /* @__PURE__ */ React10.createElement("img", { src: product.images[0], alt: product.title }) : /* @__PURE__ */ React10.createElement("div", { className: "shop-card-placeholder" }, /* @__PURE__ */ React10.createElement(ShoppingCart4, { size: 64, opacity: 0.3 })))), /* @__PURE__ */ React10.createElement("div", { className: "product-info animate-slide-left" }, /* @__PURE__ */ React10.createElement("h1", null, product.title), /* @__PURE__ */ React10.createElement("div", { className: "product-price" }, getCurrencySymbol(product.currency), product.price.toFixed(2)), /* @__PURE__ */ React10.createElement("div", { className: "product-description" }, product.description.split("\n").map((para, idx) => /* @__PURE__ */ React10.createElement("p", { key: idx, style: { marginBottom: "1rem" } }, para))), /* @__PURE__ */ React10.createElement("div", { className: "product-actions" }, /* @__PURE__ */ React10.createElement(
    "button",
    {
      className: "btn btn-primary",
      onClick: handleAddToCart,
      disabled: product.stock <= 0
    },
    /* @__PURE__ */ React10.createElement(ShoppingCart4, { size: 18 }),
    product.stock > 0 ? "Add to Cart" : "Out of Stock"
  )), /* @__PURE__ */ React10.createElement("div", { className: `product-stock-status ${product.stock > 0 ? "status-in-stock" : "status-out-stock"}` }, product.stock > 0 ? /* @__PURE__ */ React10.createElement(React10.Fragment, null, /* @__PURE__ */ React10.createElement(Check2, { size: 16 }), " In Stock (", product.stock, " available)") : "Currently out of stock."))), /* @__PURE__ */ React10.createElement("button", { className: "floating-cart-btn glass-card", onClick: () => setIsCartOpen(true) }, /* @__PURE__ */ React10.createElement(ShoppingCart4, { size: 24 }), getCartCount() > 0 && /* @__PURE__ */ React10.createElement("span", { className: "cart-badge" }, getCartCount())));
}

// src/pages/Shop/Checkout.jsx
import React11, { useState as useState18 } from "react";
import { useLocation as useLocation2, useNavigate as useNavigate7, Link as Link9 } from "react-router-dom";
import { Check as Check3, ArrowLeft as ArrowLeft6, Loader as Loader5 } from "lucide-react";
import toast11 from "react-hot-toast";
function Checkout() {
  const navigate = useNavigate7();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState18({
    email: "",
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Nigeria"
  });
  const [isSubmitting, setIsSubmitting] = useState18(false);
  const [orderSuccess, setOrderSuccess] = useState18(false);
  if (!cartItems || cartItems.length === 0) {
    return /* @__PURE__ */ React11.createElement("div", { className: "shop-page page-transition" }, /* @__PURE__ */ React11.createElement("div", { className: "shop-empty" }, /* @__PURE__ */ React11.createElement("p", null, "Your cart is empty."), /* @__PURE__ */ React11.createElement(Link9, { to: "/shop", className: "btn btn-primary" }, "Return to Shop")));
  }
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const orderData = {
      customerEmail: formData.email,
      products: cartItems.map((item) => ({ product: item._id, quantity: item.quantity, priceAtPurchase: item.price })),
      totalAmount: getCartTotal(),
      shippingAddress: {
        fullName: formData.name,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      }
    };
    try {
      await createOrder(orderData);
      clearCart();
      setOrderSuccess(true);
      toast11.success("Order placed successfully!");
    } catch (err) {
      toast11.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case "GBP":
        return "\xA3";
      case "USD":
        return "$";
      case "NGN":
        return "\u20A6";
      default:
        return "\u20A6";
    }
  };
  if (orderSuccess) {
    return /* @__PURE__ */ React11.createElement("div", { className: "checkout-page page-transition" }, /* @__PURE__ */ React11.createElement("div", { className: "checkout-success glass-card animate-scale-in" }, /* @__PURE__ */ React11.createElement("div", { className: "checkout-success-icon" }, /* @__PURE__ */ React11.createElement(Check3, { size: 40 })), /* @__PURE__ */ React11.createElement("h2", null, "Order Confirmed"), /* @__PURE__ */ React11.createElement("p", null, "Your mock order has been placed successfully and is now pending in the Admin Dashboard."), /* @__PURE__ */ React11.createElement(Link9, { to: "/shop", className: "btn btn-primary" }, "Continue Shopping")));
  }
  return /* @__PURE__ */ React11.createElement("div", { className: "checkout-page page-transition" }, /* @__PURE__ */ React11.createElement("div", { className: "checkout-header animate-fade-in" }, /* @__PURE__ */ React11.createElement(Link9, { to: "/shop", style: { display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", marginBottom: "var(--space-xl)", textDecoration: "none" } }, /* @__PURE__ */ React11.createElement(ArrowLeft6, { size: 16 }), " Back to Shop"), /* @__PURE__ */ React11.createElement("h1", null, "Mock Checkout"), /* @__PURE__ */ React11.createElement("p", null, "This is a simulated checkout. No payment is required.")), /* @__PURE__ */ React11.createElement("div", { className: "checkout-form-card glass-card animate-slide-up" }, /* @__PURE__ */ React11.createElement("div", { className: "checkout-summary", style: { flexDirection: "column", alignItems: "stretch" } }, /* @__PURE__ */ React11.createElement("h3", { style: { marginBottom: "1rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem" } }, "Order Summary"), cartItems.map((item) => /* @__PURE__ */ React11.createElement("div", { key: item._id, style: { display: "flex", gap: "1rem", marginBottom: "1rem" } }, item.images?.[0] ? /* @__PURE__ */ React11.createElement("img", { src: item.images[0], alt: item.title, style: { width: "50px", height: "50px" } }) : /* @__PURE__ */ React11.createElement("div", { style: { width: "50px", height: "50px", background: "rgba(0,0,0,0.2)", borderRadius: "var(--radius-sm)" } }), /* @__PURE__ */ React11.createElement("div", { className: "checkout-summary-details" }, /* @__PURE__ */ React11.createElement("h4", { style: { fontSize: "0.9rem" } }, item.title), /* @__PURE__ */ React11.createElement("p", { style: { fontSize: "0.85rem" } }, "Qty: ", item.quantity)), /* @__PURE__ */ React11.createElement("div", { style: { marginLeft: "auto", fontWeight: "500", color: "var(--accent-gold)" } }, getCurrencySymbol(item.currency), (item.price * item.quantity).toFixed(2))))), /* @__PURE__ */ React11.createElement("form", { onSubmit: handleSubmit, className: "checkout-form" }, /* @__PURE__ */ React11.createElement("div", { className: "form-group full" }, /* @__PURE__ */ React11.createElement("label", null, "Email Address"), /* @__PURE__ */ React11.createElement("input", { type: "email", name: "email", value: formData.email, onChange: handleInputChange, required: true })), /* @__PURE__ */ React11.createElement("div", { className: "form-group full" }, /* @__PURE__ */ React11.createElement("label", null, "Full Name"), /* @__PURE__ */ React11.createElement("input", { type: "text", name: "name", value: formData.name, onChange: handleInputChange, required: true })), /* @__PURE__ */ React11.createElement("div", { className: "form-group full" }, /* @__PURE__ */ React11.createElement("label", null, "Street Address"), /* @__PURE__ */ React11.createElement("input", { type: "text", name: "street", value: formData.street, onChange: handleInputChange, required: true })), /* @__PURE__ */ React11.createElement("div", { className: "checkout-form-row" }, /* @__PURE__ */ React11.createElement("div", { className: "form-group" }, /* @__PURE__ */ React11.createElement("label", null, "City"), /* @__PURE__ */ React11.createElement("input", { type: "text", name: "city", value: formData.city, onChange: handleInputChange, required: true })), /* @__PURE__ */ React11.createElement("div", { className: "form-group" }, /* @__PURE__ */ React11.createElement("label", null, "State / Province"), /* @__PURE__ */ React11.createElement("input", { type: "text", name: "state", value: formData.state, onChange: handleInputChange, required: true }))), /* @__PURE__ */ React11.createElement("div", { className: "checkout-form-row" }, /* @__PURE__ */ React11.createElement("div", { className: "form-group" }, /* @__PURE__ */ React11.createElement("label", null, "Zip / Postal Code"), /* @__PURE__ */ React11.createElement("input", { type: "text", name: "zipCode", value: formData.zipCode, onChange: handleInputChange, required: true })), /* @__PURE__ */ React11.createElement("div", { className: "form-group" }, /* @__PURE__ */ React11.createElement("label", null, "Country"), /* @__PURE__ */ React11.createElement("input", { type: "text", name: "country", value: formData.country, onChange: handleInputChange, required: true }))), /* @__PURE__ */ React11.createElement("div", { className: "checkout-total" }, /* @__PURE__ */ React11.createElement("span", null, "Total to pay:"), /* @__PURE__ */ React11.createElement("span", { style: { color: "var(--accent-gold)" } }, getCurrencySymbol(cartItems[0]?.currency || "NGN"), getCartTotal().toFixed(2))), /* @__PURE__ */ React11.createElement("button", { type: "submit", className: "btn btn-primary", style: { width: "100%", padding: "1rem", marginTop: "var(--space-md)" }, disabled: isSubmitting }, isSubmitting ? /* @__PURE__ */ React11.createElement(Loader5, { className: "spin", size: 18 }) : "Complete Mock Order"))));
}

// src/components/CartDrawer/CartDrawer.jsx
import React12 from "react";
import { X as X5, Minus, Plus as Plus4, ShoppingBag as ShoppingBag3, ArrowRight as ArrowRight8 } from "lucide-react";
import { useNavigate as useNavigate8 } from "react-router-dom";
function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    getCartTotal
  } = useCart();
  const navigate = useNavigate8();
  if (!isCartOpen) return null;
  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case "GBP":
        return "\xA3";
      case "USD":
        return "$";
      case "NGN":
        return "\u20A6";
      default:
        return "\u20A6";
    }
  };
  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/shop/checkout");
  };
  return /* @__PURE__ */ React12.createElement(React12.Fragment, null, /* @__PURE__ */ React12.createElement("div", { className: "cart-backdrop", onClick: () => setIsCartOpen(false) }), /* @__PURE__ */ React12.createElement("div", { className: `cart-drawer ${isCartOpen ? "open" : ""}` }, /* @__PURE__ */ React12.createElement("div", { className: "cart-header" }, /* @__PURE__ */ React12.createElement("h2", null, "Your Cart"), /* @__PURE__ */ React12.createElement("button", { className: "cart-close-btn", onClick: () => setIsCartOpen(false) }, /* @__PURE__ */ React12.createElement(X5, { size: 24 }))), /* @__PURE__ */ React12.createElement("div", { className: "cart-content" }, cartItems.length === 0 ? /* @__PURE__ */ React12.createElement("div", { className: "cart-empty" }, /* @__PURE__ */ React12.createElement(ShoppingBag3, { size: 48, opacity: 0.5 }), /* @__PURE__ */ React12.createElement("p", null, "Your cart is empty."), /* @__PURE__ */ React12.createElement("button", { className: "btn btn-secondary", onClick: () => setIsCartOpen(false) }, "Continue Shopping")) : /* @__PURE__ */ React12.createElement("div", { className: "cart-items" }, cartItems.map((item) => /* @__PURE__ */ React12.createElement("div", { key: item._id, className: "cart-item" }, /* @__PURE__ */ React12.createElement("img", { src: item.images?.[0] || "https://via.placeholder.com/80", alt: item.title, className: "cart-item-image" }), /* @__PURE__ */ React12.createElement("div", { className: "cart-item-details" }, /* @__PURE__ */ React12.createElement("h4", null, item.title), /* @__PURE__ */ React12.createElement("p", { className: "cart-item-price" }, getCurrencySymbol(item.currency), item.price.toFixed(2)), /* @__PURE__ */ React12.createElement("div", { className: "cart-item-actions" }, /* @__PURE__ */ React12.createElement("div", { className: "quantity-controls" }, /* @__PURE__ */ React12.createElement("button", { onClick: () => updateQuantity(item._id, item.quantity - 1) }, /* @__PURE__ */ React12.createElement(Minus, { size: 14 })), /* @__PURE__ */ React12.createElement("span", null, item.quantity), /* @__PURE__ */ React12.createElement("button", { onClick: () => updateQuantity(item._id, item.quantity + 1) }, /* @__PURE__ */ React12.createElement(Plus4, { size: 14 }))), /* @__PURE__ */ React12.createElement("button", { className: "remove-item-btn", onClick: () => removeFromCart(item._id) }, "Remove"))))))), cartItems.length > 0 && /* @__PURE__ */ React12.createElement("div", { className: "cart-footer" }, /* @__PURE__ */ React12.createElement("div", { className: "cart-subtotal" }, /* @__PURE__ */ React12.createElement("span", null, "Subtotal"), /* @__PURE__ */ React12.createElement("span", null, getCurrencySymbol(cartItems[0]?.currency || "NGN"), getCartTotal().toFixed(2))), /* @__PURE__ */ React12.createElement("p", { className: "cart-shipping-note" }, "Shipping and taxes calculated at checkout."), /* @__PURE__ */ React12.createElement("button", { className: "btn btn-primary btn-checkout", onClick: handleCheckout }, "Checkout ", /* @__PURE__ */ React12.createElement(ArrowRight8, { size: 18 })))));
}

// src/App.jsx
import { Toaster } from "react-hot-toast";
function ScrollToTop() {
  const { pathname } = useLocation3();
  const lastPathname = useRef6(pathname);
  useEffect14(() => {
    if (pathname !== lastPathname.current) {
      window.scrollTo(0, 0);
      lastPathname.current = pathname;
    }
  }, [pathname]);
  return null;
}
function BackToTop() {
  const [visible, setVisible] = useState19(false);
  useEffect14(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return /* @__PURE__ */ React13.createElement(
    "button",
    {
      className: `back-to-top-pulse ${visible ? "visible" : ""}`,
      onClick: scrollToTop,
      "aria-label": "Back to top",
      id: "back-to-top-floating"
    },
    /* @__PURE__ */ React13.createElement(ArrowUp, { size: 20 }),
    /* @__PURE__ */ React13.createElement("div", { className: "pulse-ring" })
  );
}
var ErrorBoundary = class extends React13.Component {
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
      return /* @__PURE__ */ React13.createElement("div", { style: { padding: "40px", background: "#1a1612", color: "#c9a84c", height: "100vh", textAlign: "center", fontFamily: "serif" } }, /* @__PURE__ */ React13.createElement("h2", null, "The Sanctuary hit a snag."), /* @__PURE__ */ React13.createElement("p", null, this.state.error?.toString()), /* @__PURE__ */ React13.createElement("button", { onClick: () => window.location.reload(), style: { padding: "10px 20px", background: "#c9a84c", color: "#1a1612", border: "none", borderRadius: "4px", cursor: "pointer" } }, "Try Re-entering"));
    }
    return this.props.children;
  }
};
function App() {
  const location = useLocation3();
  const isAdminPage = location.pathname === "/admin";
  const hideFooterPages = ["/admin", "/my-shelf", "/settings", "/login", "/register"];
  const shouldHideFooter = hideFooterPages.includes(location.pathname);
  return /* @__PURE__ */ React13.createElement(ErrorBoundary, null, /* @__PURE__ */ React13.createElement(
    Toaster,
    {
      position: "bottom-center",
      toastOptions: {
        style: {
          background: "var(--bg-secondary)",
          color: "var(--text-primary)",
          border: "1px solid var(--accent-gold-dim)",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-lg)",
          fontFamily: "var(--font-sans)",
          fontSize: "0.9rem"
        },
        success: {
          iconTheme: {
            primary: "var(--accent-gold)",
            secondary: "var(--bg-primary)"
          }
        },
        error: {
          style: {
            border: "1px solid var(--accent-rose)"
          },
          iconTheme: {
            primary: "var(--accent-rose)",
            secondary: "#fff"
          }
        }
      }
    }
  ), /* @__PURE__ */ React13.createElement(ScrollToTop, null), !isAdminPage && /* @__PURE__ */ React13.createElement(BackToTop, null), !isAdminPage && /* @__PURE__ */ React13.createElement(Navbar, null), /* @__PURE__ */ React13.createElement("main", { className: isAdminPage ? "admin-page-container" : "" }, /* @__PURE__ */ React13.createElement(Routes, null, /* @__PURE__ */ React13.createElement(Route, { path: "/", element: /* @__PURE__ */ React13.createElement(Home, null) }), /* @__PURE__ */ React13.createElement(Route, { path: "/bookshelf", element: /* @__PURE__ */ React13.createElement(Bookshelf, null) }), /* @__PURE__ */ React13.createElement(Route, { path: "/recommendations", element: /* @__PURE__ */ React13.createElement(Recommendations, null) }), /* @__PURE__ */ React13.createElement(Route, { path: "/coming-soon", element: /* @__PURE__ */ React13.createElement(ComingSoon, null) }), /* @__PURE__ */ React13.createElement(Route, { path: "/library-vision", element: /* @__PURE__ */ React13.createElement(LibraryVision, null) }), /* @__PURE__ */ React13.createElement(Route, { path: "/admin", element: /* @__PURE__ */ React13.createElement(Admin, null) }), /* @__PURE__ */ React13.createElement(Route, { path: "/login", element: /* @__PURE__ */ React13.createElement(Auth, { type: "login" }) }), /* @__PURE__ */ React13.createElement(Route, { path: "/register", element: /* @__PURE__ */ React13.createElement(Auth, { type: "register" }) }), /* @__PURE__ */ React13.createElement(Route, { path: "/my-shelf", element: /* @__PURE__ */ React13.createElement(MyShelf, null) }), /* @__PURE__ */ React13.createElement(Route, { path: "/settings", element: /* @__PURE__ */ React13.createElement(Settings3, null) }), /* @__PURE__ */ React13.createElement(Route, { path: "/reset-password", element: /* @__PURE__ */ React13.createElement(ResetPassword, null) }), /* @__PURE__ */ React13.createElement(Route, { path: "/shop", element: /* @__PURE__ */ React13.createElement(Shop, null) }), /* @__PURE__ */ React13.createElement(Route, { path: "/shop/:id", element: /* @__PURE__ */ React13.createElement(ProductDetails, null) }), /* @__PURE__ */ React13.createElement(Route, { path: "/shop/checkout", element: /* @__PURE__ */ React13.createElement(Checkout, null) }))), /* @__PURE__ */ React13.createElement(CartDrawer, null), !shouldHideFooter && /* @__PURE__ */ React13.createElement(Footer, null));
}

// src/main.jsx
window.onerror = function(msg, url, lineNo, columnNo, error) {
  document.body.innerHTML = `<div style="color:red; padding:20px;"><h2>Global Error</h2><p>${msg}</p><pre>${error?.stack}</pre></div>`;
  return false;
};
window.addEventListener("unhandledrejection", function(event) {
  document.body.innerHTML = `<div style="color:red; padding:20px;"><h2>Unhandled Promise Rejection</h2><pre>${event.reason?.stack || event.reason}</pre></div>`;
});
try {
  document.body.innerHTML = "<h1>Script starting...</h1>";
  ReactDOM.createRoot(document.getElementById("root")).render(
    /* @__PURE__ */ React14.createElement(React14.StrictMode, null, /* @__PURE__ */ React14.createElement(BrowserRouter, null, /* @__PURE__ */ React14.createElement(AuthProvider, null, /* @__PURE__ */ React14.createElement(CartProvider, null, /* @__PURE__ */ React14.createElement(App, null)))))
  );
} catch (e) {
  document.body.innerHTML = `<div style="color:red; padding:20px;"><h2>Render Error</h2><pre>${e.stack}</pre></div>`;
}
