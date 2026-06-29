const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

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
const Product = require('./models/Product');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'readers_index_secret_key_2026';

// Email transporter for password resets
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'thereadersindex@gmail.com',
    pass: process.env.EMAIL_PASS // Gmail App Password (set in Render env vars)
  },
  connectionTimeout: 10000, // 10 seconds
  socketTimeout: 10000,     // 10 seconds
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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
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
    if (!process.env.RESEND_API_KEY && !process.env.SENDGRID_API_KEY && !process.env.EMAIL_PASS) {
      console.error('⚠️ Forgot password error: No email API keys or SMTP passwords are set.');
      return res.status(500).json({ 
        error: 'Backend email service is not configured. Please set the SENDGRID_API_KEY environment variable on Render.' 
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
    const htmlContent = `
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
    `;

    // 1. Send via SendGrid HTTP API
    if (process.env.SENDGRID_API_KEY) {
      console.log('Sending reset email via SendGrid HTTP API...');
      const sendgridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email }] }],
          from: { email: process.env.EMAIL_USER || 'thereadersindex@gmail.com', name: "The Reader's Index" },
          subject: "Reset Your Password - The Reader's Index",
          content: [{ type: 'text/html', value: htmlContent }]
        })
      });

      if (!sendgridResponse.ok) {
        const sgData = await sendgridResponse.json();
        throw new Error(sgData.errors?.[0]?.message || 'SendGrid HTTP API failure');
      }
      console.log('Reset email sent successfully via SendGrid!');
    }
    // 2. Send via Resend HTTP REST API if key is provided (never blocked by Render Free)
    else if (process.env.RESEND_API_KEY) {
      console.log('Sending reset email via Resend HTTP API...');
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: (process.env.EMAIL_USER && !process.env.EMAIL_USER.endsWith('@gmail.com')) 
            ? `"The Reader's Index" <${process.env.EMAIL_USER}>` 
            : `"The Reader's Index" <onboarding@resend.dev>`,
          to: [email],
          subject: "Reset Your Password - The Reader's Index",
          html: htmlContent
        })
      });

      const resendData = await resendResponse.json();
      if (!resendResponse.ok) {
        throw new Error(resendData.message || 'Resend HTTP API failure');
      }
      console.log('Reset email sent successfully via Resend!');
    } 
    // 3. Fallback to standard Nodemailer SMTP
    else {
      console.log('Sending reset email via standard SMTP...');
      await transporter.sendMail({
        from: `"The Reader's Index" <${process.env.EMAIL_USER || 'thereadersindex@gmail.com'}>`,
        to: email,
        subject: "Reset Your Password — The Reader's Index",
        html: htmlContent
      });
      console.log('Reset email sent successfully via SMTP!');
    }

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

app.post('/api/books/auto-fill', async (req, res) => {
  try {
    const { title, author } = req.body;
    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required' });
    }

    // 1. Fetch factual data from Google Books API
    let cover = '';
    let year = null;
    let pages = null;
    
    try {
      const gBooksRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}&langRestrict=en`);
      const gBooksData = await gBooksRes.json();
      
      if (gBooksData.items && gBooksData.items.length > 0) {
        const volumeInfo = gBooksData.items[0].volumeInfo;
        if (volumeInfo.imageLinks) {
          cover = volumeInfo.imageLinks.thumbnail || volumeInfo.imageLinks.smallThumbnail || '';
          if (cover) cover = cover.replace('&edge=curl', '').replace('zoom=1', 'zoom=0');
        }
        if (volumeInfo.publishedDate) {
          year = parseInt(volumeInfo.publishedDate.substring(0, 4));
        }
        if (volumeInfo.pageCount) {
          pages = volumeInfo.pageCount;
        }
      }
    } catch (err) {
      console.error('Failed to fetch from Google Books API:', err);
    }

    // 2. Fetch creative data from Google Gemini API
    let aiData = { review: '', quote: '', genres: [], tropes: [], pacing: 'Medium', mood: [], year: null, pages: null };
    
    if (process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenAI } = require('@google/genai');
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const prompt = `Analyze the book "${title}" by "${author}". 
Return a strict JSON object (NO markdown formatting, just raw JSON) with the following exact keys:
- "review": A beautiful 3 sentence aesthetic review of the book.
- "quote": A famous or highly memorable quote from the book.
- "genres": An array of up to 3 entirely DISTINCT genres. Do not be repetitive (e.g. if you use "High Fantasy", do NOT also use "Dragon Rider Fantasy" or "Coming-of-Age Fantasy"). 
- "tropes": An array of up to 4 tropes. Use your full creative vocabulary.
- "pacing": A string that is exactly one of: "Fast", "Medium", or "Slow".
- "mood": An array of up to 3 moods. Try to include at least one of these core moods if they fit: "Cozy", "Mysterious", "Thrilling", "Bittersweet", "Epic", "Atmospheric", "Heartwarming", "Inspiring", "Intellectual", "Romantic", "Reflective", "Empowering".
- "year": The year the book was originally published (as an integer).
- "pages": The approximate number of pages (as an integer).

Example format:
{
  "review": "A sprawling epic...",
  "quote": "I must not fear...",
  "genres": ["Sci-Fi", "Political Thriller"],
  "tropes": ["Chosen One", "Political Intrigue"],
  "pacing": "Medium",
  "mood": ["Epic", "Intellectual", "Atmospheric"],
  "year": 1965,
  "pages": 412
}`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        let aiText = response.text.trim();
        if (aiText.startsWith('\`\`\`json')) aiText = aiText.substring(7);
        if (aiText.endsWith('\`\`\`')) aiText = aiText.substring(0, aiText.length - 3);

        aiData = JSON.parse(aiText);
      } catch (err) {
        console.error('Failed to generate from Gemini API:', err);
      }
    } else {
      console.warn('No GEMINI_API_KEY found, returning empty AI data');
    }

    // 3. Combine and return
    res.json({
      cover: cover || '',
      year: year || aiData.year || new Date().getFullYear(),
      pages: pages || aiData.pages || 300,
      review: aiData.review || '',
      quote: aiData.quote || '',
      genres: aiData.genres || [],
      tropes: aiData.tropes || [],
      pacing: aiData.pacing || 'Medium',
      mood: aiData.mood || []
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/books', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(transformBook(book));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(transformBook(book));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted' });
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

// Multer & Uploads (using memory/temporary storage and converting directly to persistent base64 in MongoDB)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  try {
    const fileBuffer = fs.readFileSync(req.file.path);
    const base64Image = fileBuffer.toString('base64');
    const dataUrl = `data:${req.file.mimetype};base64,${base64Image}`;
    
    // Safely clean up the temp file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('⚠️ Error unlinking temp file:', err);
    });

    res.json({ url: dataUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const fileBuffer = fs.readFileSync(req.file.path);
    const base64Image = fileBuffer.toString('base64');
    const avatarUrl = `data:${req.file.mimetype};base64,${base64Image}`;

    const user = await User.findById(req.user.id);
    user.avatar = avatarUrl;
    await user.save();

    // Safely clean up the temp file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('⚠️ Error unlinking temp file:', err);
    });

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

// --- NEWSLETTER ---
app.post('/api/newsletter/send', async (req, res) => {
  try {
    const { audience, subject, message, isTest, testEmail, customEmails } = req.body;
    
    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message are required' });
    }

    let emails = [];
    if (isTest) {
      if (!testEmail) return res.status(400).json({ error: 'Test email is required' });
      emails = [testEmail];
    } else if (audience === 'Custom List') {
      if (!customEmails) return res.status(400).json({ error: 'Custom emails are required' });
      emails = customEmails.split(/[\n,]+/).map(e => e.trim()).filter(Boolean);
    } else {
      let query = {};
      if (audience === 'Waitlist Only') {
        query.source = { $regex: /waitlist/i };
      } else if (audience === 'Newsletter Only') {
        // Find where source is missing, null, or doesn't contain waitlist
        query.$or = [
          { source: { $exists: false } },
          { source: null },
          { source: { $not: { $regex: /waitlist/i } } }
        ];
      }
      
      const subscribers = await Subscriber.find(query);
      emails = subscribers.map(sub => sub.email).filter(Boolean);
    }

    if (emails.length === 0) {
      return res.status(404).json({ error: 'No subscribers found for this audience' });
    }

    const htmlContent = `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1a2e; color: #d4cfc7; padding: 2.5rem; border-radius: 12px; border: 1px solid rgba(201,168,76,0.2);">
        <div style="text-align: center; margin-bottom: 2rem;">
          <h1 style="color: #C9A84C; font-size: 1.8rem; margin: 0; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">The Reader's Index</h1>
          <hr style="border: none; border-top: 1px solid rgba(201,168,76,0.15); margin-top: 1.5rem;" />
        </div>
        
        <div style="line-height: 1.7; font-size: 1.05rem; color: #d4cfc7;">
          ${message}
        </div>

        <div style="margin-top: 3rem; text-align: center;">
          <hr style="border: none; border-top: 1px solid rgba(201,168,76,0.15); margin-bottom: 1.5rem;" />
          <p style="color: #a89f91; font-size: 0.85rem; margin: 0.5rem 0;">You're receiving this because you subscribed to updates from The Reader's Index.</p>
          <p style="color: #6b6560; font-size: 0.8rem; margin: 0;">© ${new Date().getFullYear()} The Reader's Index. All rights reserved.</p>
        </div>
      </div>
    `;

    if (process.env.SENDGRID_API_KEY) {
      console.log('Sending newsletter via SendGrid HTTP API...');
      const sendgridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: process.env.EMAIL_USER || 'thereadersindex@gmail.com' }],
              bcc: emails.map(email => ({ email }))
            }
          ],
          from: { email: process.env.EMAIL_USER || 'thereadersindex@gmail.com', name: "The Readers Index" },
          subject: subject,
          content: [{ type: 'text/html', value: htmlContent }]
        })
      });

      if (!sendgridResponse.ok) {
        const sgData = await sendgridResponse.json();
        throw new Error(sgData.errors?.[0]?.message || 'SendGrid HTTP API failure');
      }
      console.log('Newsletter sent successfully via SendGrid!');
    } else if (process.env.RESEND_API_KEY) {
      console.log('Sending newsletter via Resend HTTP API...');
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: (process.env.EMAIL_USER && !process.env.EMAIL_USER.endsWith('@gmail.com')) 
            ? `"The Readers Index" <${process.env.EMAIL_USER}>` 
            : `"The Readers Index" <onboarding@resend.dev>`,
          to: process.env.EMAIL_USER || 'thereadersindex@gmail.com',
          bcc: emails,
          subject: subject,
          html: htmlContent
        })
      });

      const resendData = await resendResponse.json();
      if (!resendResponse.ok) {
        throw new Error(resendData.message || 'Resend HTTP API failure');
      }
      console.log('Newsletter sent successfully via Resend!');
    } else {
      console.log('Sending newsletter via standard SMTP...');
      const mailOptions = {
        from: `"The Readers Index" <${process.env.EMAIL_USER || 'thereadersindex@gmail.com'}>`,
        to: process.env.EMAIL_USER || 'thereadersindex@gmail.com',
        bcc: emails,
        subject: subject,
        html: htmlContent
      };
      await transporter.sendMail(mailOptions);
    }

    res.json({ message: `Newsletter sent successfully to ${emails.length} subscriber(s)` });
  } catch (err) {
    console.error('Newsletter send error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// E-COMMERCE / SHOP ROUTES
// ==========================================

// --- PRODUCTS ---
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ORDERS (MOCK CHECKOUT) ---
app.delete('/api/orders/delivered', async (req, res) => {
  try {
    const result = await Order.deleteMany({ status: { $in: ['Delivered', 'Cancelled'] } });
    res.json({ message: `Deleted ${result.deletedCount} completed orders`, count: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('products.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const { status, trackingNumber, trackingUrl } = req.body;
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (trackingUrl !== undefined) updateData.trackingUrl = trackingUrl;

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders/track', async (req, res) => {
  try {
    const { orderId, email } = req.body;
    if (!orderId || !email) return res.status(400).json({ error: 'Order ID and Email are required' });
    
    // Allow tracking with either full 24-char ID or the 8-char short ID shown to users
    const orders = await Order.find({ customerEmail: email }).populate('products.product');
    const order = orders.find(o => o._id.toString().startsWith(orderId));

    if (!order) return res.status(404).json({ error: 'Order not found with those details' });
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n🚀 Sanctuary Backend (MongoDB) live on port ${PORT}`);
});

module.exports = app;
