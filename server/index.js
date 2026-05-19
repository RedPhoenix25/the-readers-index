const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const { connectMongoDB } = require('./database');
const User = require('./models/User');
const Book = require('./models/Book');
const Subscriber = require('./models/Subscriber');
const CuratedList = require('./models/CuratedList');
const CurrentlyReading = require('./models/CurrentlyReading');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'readers_index_secret_key_2026';

// Email transporter for password resets
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'thereadersindex@gmail.com',
    pass: process.env.EMAIL_PASS // Gmail App Password (set in Render env vars)
  }
});

// Verify email transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('⚠️ SMTP Transporter configuration error:', error.message);
  } else {
    console.log('📧 SMTP Transporter is ready to send emails');
  }
});

// Frontend URL for reset links
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://the-readers-index.vercel.app';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Connect to MongoDB
connectMongoDB();

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).json({ error: 'Username or email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET);
    res.status(201).json({ token, user: { id: user._id, username, email, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET);
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ ...user.toObject(), id: user._id.toString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Forgot Password — sends a reset link via email
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if email environment variables are configured
    if (!process.env.EMAIL_PASS) {
      console.error('⚠️ Forgot password error: EMAIL_PASS is missing in environment variables.');
      return res.status(500).json({ 
        error: 'Backend email service is not configured. Please set the EMAIL_PASS environment variable in Render.' 
      });
    }

    const user = await User.findOne({ email });
    
    // Always return success to prevent email enumeration attacks
    if (!user) {
      return res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send the email
    await transporter.sendMail({
      from: `"The Reader's Index" <${process.env.EMAIL_USER || 'thereadersindex@gmail.com'}>`,
      to: email,
      subject: 'Reset Your Password — The Reader\'s Index',
      html: `
        <div style="max-width: 520px; margin: 0 auto; font-family: 'Segoe UI', sans-serif; background: #1a1a2e; color: #f5f0e8; padding: 2.5rem; border-radius: 12px; border: 1px solid rgba(201,168,76,0.2);">
          <div style="text-align: center; margin-bottom: 1.5rem;">
            <h1 style="color: #C9A84C; font-size: 1.6rem; margin: 0;">The Reader's Index</h1>
            <p style="color: #a89f91; margin: 0.5rem 0 0;">Password Reset Request</p>
          </div>
          <p style="line-height: 1.6; color: #d4cfc7;">Hello <strong>${user.username}</strong>,</p>
          <p style="line-height: 1.6; color: #d4cfc7;">We received a request to reset your password. Click the button below to choose a new one. This link expires in <strong>1 hour</strong>.</p>
          <div style="text-align: center; margin: 2rem 0;">
            <a href="${resetLink}" style="display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #C9A84C, #D4956A); color: #1a1a2e; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 1rem; letter-spacing: 0.02em;">Reset Password</a>
          </div>
          <p style="line-height: 1.6; color: #a89f91; font-size: 0.85rem;">If you didn't request this, you can safely ignore this email. Your password will remain unchanged.</p>
          <hr style="border: none; border-top: 1px solid rgba(201,168,76,0.15); margin: 1.5rem 0;" />
          <p style="text-align: center; color: #6b6560; font-size: 0.8rem; margin: 0;">© ${new Date().getFullYear()} The Reader's Index</p>
        </div>
      `
    });

    res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: `Mail service error: ${err.message || 'Failed to send reset link.'}` });
  }
});

// Reset Password — verifies token and updates password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() } // token must not be expired
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset link. Please request a new one.' });
    }

    // Hash the new password and clear the reset token
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now sign in.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- BOOKS API ---

const transformBook = (b) => ({
  ...b.toObject ? b.toObject() : b,
  id: (b._id || b.id).toString(),
  mood: b.mood && typeof b.mood === 'string' ? b.mood.split(',').map(m => m.trim()) : (Array.isArray(b.mood) ? b.mood : [])
});

app.get('/api/books', async (req, res) => {
  try {
    const { genre, mood, search, sort = 'newest', page = 1, limit = 12, featured } = req.query;
    const query = {};
    if (genre && genre !== 'All') query.genre = genre;
    if (mood && mood !== 'All') query.mood = { $regex: mood, $options: 'i' };
    if (search) query.$or = [{ title: { $regex: search, $options: 'i' } }, { author: { $regex: search, $options: 'i' } }];
    if (featured === 'true') query.featured = true;

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { year: 1, _id: 1 };
    else if (sort === 'highest') sortOption = { rating: -1 };
    else if (sort === 'lowest') sortOption = { rating: 1 };
    else if (sort === 'title') sortOption = { title: 1 };

    const total = await Book.countDocuments(query);
    const books = await Book.find(query).sort(sortOption).skip((page - 1) * limit).limit(parseInt(limit));

    res.json({
      books: books.map(transformBook),
      pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid book ID format' });
    }
    const book = await Book.findById(id).populate('comments.user', 'username');
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(transformBook(book));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/books/:id/engagement', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('comments.user', 'username');
    if (!book) return res.status(404).json({ error: 'Book not found' });
    
    const comments = (book.comments || []).map(c => ({
      id: c._id,
      user_id: c.user?._id?.toString(),
      username: c.user?.username || 'Former Librarian',
      content: c.content,
      rating: c.rating,
      created_at: c.createdAt
    }));

    res.json({
      likes: book.likes?.length || 0,
      userLiked: false, 
      comments
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/books/:id/like', authenticateToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    
    book.likes = book.likes || [];
    if (!book.likes.includes(req.user.id)) {
      book.likes.push(req.user.id);
      await book.save();
    }
    res.json({ likes: book.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/books/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { content, rating } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    book.comments.push({
      user: req.user.id,
      content,
      rating: rating || null
    });

    await book.save();
    
    const savedBook = await Book.findById(book._id).populate('comments.user', 'username');
    const newComment = savedBook.comments[savedBook.comments.length - 1];
    
    res.status(201).json({
      id: newComment._id,
      user_id: newComment.user?._id?.toString(),
      username: newComment.user?.username || 'Former Librarian',
      content: newComment.content,
      rating: newComment.rating,
      created_at: newComment.createdAt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/comments/:id', authenticateToken, async (req, res) => {
  try {
    const book = await Book.findOne({ 'comments._id': req.params.id });
    if (!book) return res.status(404).json({ error: 'Comment not found' });
    
    book.comments = book.comments.filter(c => c._id.toString() !== req.params.id);
    await book.save();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- USER SHELF API ---

app.get('/api/user/books', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('shelf.book');
    if (!user) return res.status(404).json({ error: 'User not found' });
    const validItems = (user.shelf || []).filter(item => item.book);
    res.json(validItems.map(item => ({ ...transformBook(item.book), status: item.status })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/user/books', authenticateToken, async (req, res) => {
  try {
    const { bookId, status } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.shelf = user.shelf || [];
    const existsIndex = user.shelf.findIndex(item => item.book && item.book.toString() === bookId);
    if (existsIndex === -1) {
      user.shelf.push({ book: bookId, status: status || 'Want to Read' });
    } else {
      user.shelf[existsIndex].status = status || 'Want to Read';
    }
    await user.save();
    
    res.status(201).json({ message: 'Added/Updated on shelf' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/user/books/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.shelf = (user.shelf || []).filter(item => item.book && item.book.toString() !== req.params.id);
    await user.save();
    res.json({ message: 'Removed from shelf' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- LISTS & READING ---

app.get('/api/curated', (req, res) => res.redirect('/api/lists'));

app.get('/api/lists', async (req, res) => {
  try {
    const lists = await CuratedList.find().populate('books').sort({ createdAt: -1 });
    res.json(lists.map(l => {
      const listData = l.toObject();
      return {
        ...listData,
        id: l._id.toString(),
        bookIds: l.books.map(b => b._id.toString()),
        books: l.books.map(transformBook),
        created_at: l.createdAt
      };
    }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/currently-reading', async (req, res) => {
  try {
    const current = await CurrentlyReading.findOne().sort({ updatedAt: -1 });
    res.json(current || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- META & ENGAGEMENT ---

app.get('/api/meta/genres', async (req, res) => {
  try {
    const genres = await Book.distinct('genre');
    res.json(['All', ...genres.filter(g => g).sort()]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/meta/moods', async (req, res) => {
  try {
    const moods = await Book.distinct('mood');
    const flatMoods = [...new Set(moods.filter(m => m).map(m => m.split(',')).flat().map(m => m.trim()))];
    res.json(['All', ...flatMoods.sort()]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/subscribe', async (req, res) => {
  try {
    const { email, source } = req.body;
    const sub = new Subscriber({ email, source });
    await sub.save();
    res.status(201).json({ message: 'Subscribed' });
  } catch (err) {
    res.status(500).json({ error: 'Already subscribed' });
  }
});

app.get('/api/subscribers', async (req, res) => {
  try {
    const subs = await Subscriber.find().sort({ createdAt: -1 });
    res.json(subs.map(s => ({ ...s.toObject(), id: s._id, created_at: s.createdAt })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users.map(u => ({ ...u.toObject(), id: u._id, created_at: u.createdAt })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/subscribers/:id', async (req, res) => {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subscriber deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Multer & Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({ url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` });
});

app.post('/api/users/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const user = await User.findById(req.user.id);
    user.avatar = avatarUrl;
    await user.save();
    res.json({ avatar: avatarUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/avatar', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.avatar = null;
    await user.save();
    res.json({ message: 'Avatar removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n🚀 Sanctuary Backend (MongoDB) live on port ${PORT}`);
});

module.exports = app;
