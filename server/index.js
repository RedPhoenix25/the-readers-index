const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'readers_index_secret_key_2026';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ============================================
// BOOKS API
// ============================================

// Get all books (with optional filtering, sorting, pagination)
app.get('/api/books', (req, res) => {
  const {
    genre,
    mood,
    search,
    sort = 'newest',
    page = 1,
    limit = 12,
    featured,
  } = req.query;

  let query = 'SELECT * FROM books WHERE 1=1';
  const params = [];

  // Filter by genre
  if (genre && genre !== 'All') {
    query += ' AND genre = ?';
    params.push(genre);
  }

  // Filter by mood (mood is comma-separated in DB)
  if (mood && mood !== 'All') {
    query += ' AND mood LIKE ?';
    params.push(`%${mood}%`);
  }

  // Search by title or author
  if (search) {
    query += ' AND (title LIKE ? OR author LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  // Filter featured only
  if (featured === 'true') {
    query += ' AND featured = 1';
  }

  // Sorting
  switch (sort) {
    case 'newest':
      query += ' ORDER BY year DESC, id DESC';
      break;
    case 'oldest':
      query += ' ORDER BY year ASC, id ASC';
      break;
    case 'highest':
      query += ' ORDER BY rating DESC';
      break;
    case 'lowest':
      query += ' ORDER BY rating ASC';
      break;
    case 'title':
      query += ' ORDER BY title ASC';
      break;
    default:
      query += ' ORDER BY created_at DESC';
  }

  // First, get total count for pagination metadata
  const countQuery = query.replace('SELECT * FROM', 'SELECT COUNT(*) as total FROM');

  db.get(countQuery, params, (err, countRow) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const total = countRow.total;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const totalPages = Math.ceil(total / limitNum);
    const offset = (pageNum - 1) * limitNum;

    // Add pagination
    query += ' LIMIT ? OFFSET ?';
    params.push(limitNum, offset);

    db.all(query, params, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const books = rows.map(b => ({
        ...b,
        mood: b.mood ? b.mood.split(',') : [],
        featured: Boolean(b.featured),
      }));

      res.json({
        books,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
        },
      });
    });
  });
});

// Get a single book by ID
app.get('/api/books/:id', (req, res) => {
  db.get('SELECT * FROM books WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({
      ...row,
      mood: row.mood ? row.mood.split(',') : [],
      featured: Boolean(row.featured),
    });
  });
});

// Add a new book
app.post('/api/books', (req, res) => {
  const { title, author, cover, rating, genre, mood, review, quote, pages, year, featured } = req.body;
  const moodString = Array.isArray(mood) ? mood.join(',') : mood;

  db.run(
    `INSERT INTO books (title, author, cover, rating, genre, mood, review, quote, pages, year, featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, author, cover, rating, genre, moodString, review, quote, pages, year, featured ? 1 : 0],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, message: 'Book added successfully' });
    }
  );
});

// Update a book
app.put('/api/books/:id', (req, res) => {
  const { title, author, cover, rating, genre, mood, review, quote, pages, year, featured } = req.body;
  const moodString = Array.isArray(mood) ? mood.join(',') : mood;

  db.run(
    `UPDATE books SET
      title = ?, author = ?, cover = ?, rating = ?, genre = ?,
      mood = ?, review = ?, quote = ?, pages = ?, year = ?, featured = ?
     WHERE id = ?`,
    [title, author, cover, rating, genre, moodString, review, quote, pages, year, featured ? 1 : 0, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.json({ message: 'Book updated successfully' });
    }
  );
});

// Delete a book
app.delete('/api/books/:id', (req, res) => {
  db.run('DELETE FROM books WHERE id = ?', [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  });
});

// ============================================
// CURATED LISTS API
// ============================================

// Get all curated lists with book IDs
app.get('/api/lists', (req, res) => {
  const query = `
    SELECT cl.*, GROUP_CONCAT(lb.book_id) as bookIds
    FROM curated_lists cl
    LEFT JOIN list_books lb ON cl.id = lb.list_id
    GROUP BY cl.id
    ORDER BY cl.created_at DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const lists = rows.map(row => ({
      ...row,
      bookIds: row.bookIds ? row.bookIds.split(',').map(Number) : []
    }));
    res.json(lists);
  });
});

// Add a new list
app.post('/api/lists', (req, res) => {
  const { title, description, icon, gradient } = req.body;
  db.run(
    'INSERT INTO curated_lists (title, description, icon, gradient) VALUES (?, ?, ?, ?)',
    [title, description, icon, gradient],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, message: 'List added successfully' });
    }
  );
});

// Update a list
app.put('/api/lists/:id', (req, res) => {
  const { title, description, icon, gradient } = req.body;
  db.run(
    'UPDATE curated_lists SET title = ?, description = ?, icon = ?, gradient = ? WHERE id = ?',
    [title, description, icon, gradient, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'List updated successfully' });
    }
  );
});

// Delete a list
app.delete('/api/lists/:id', (req, res) => {
  db.run('DELETE FROM curated_lists WHERE id = ?', [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'List deleted successfully' });
  });
});

// Get book IDs for a specific list
app.get('/api/lists/:id/books', (req, res) => {
  db.all('SELECT book_id FROM list_books WHERE list_id = ?', [req.params.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows.map(r => r.book_id));
  });
});

// Update books in a list
app.post('/api/lists/:id/books', (req, res) => {
  const { bookIds } = req.body;
  const listId = req.params.id;

  db.serialize(() => {
    db.run('DELETE FROM list_books WHERE list_id = ?', [listId]);
    
    if (bookIds && bookIds.length > 0) {
      const stmt = db.prepare('INSERT INTO list_books (list_id, book_id) VALUES (?, ?)');
      bookIds.forEach(bookId => {
        stmt.run(listId, bookId);
      });
      stmt.finalize();
    }
    
    res.json({ message: 'List books updated successfully' });
  });
});

// ============================================
// CURRENTLY READING API
// ============================================

// Get currently reading
app.get('/api/currently-reading', (req, res) => {
  db.get('SELECT * FROM currently_reading WHERE id = 1', (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.json(null);
    }
    res.json(row);
  });
});

// Update currently reading (admin only later)
app.put('/api/currently-reading', (req, res) => {
  const { title, author, cover, progress, thoughts } = req.body;

  db.run(
    `INSERT OR REPLACE INTO currently_reading (id, title, author, cover, progress, thoughts, updated_at)
     VALUES (1, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [title, author, cover, progress, thoughts],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Currently reading updated successfully' });
    }
  );
});

// ============================================
// NEWSLETTER / SUBSCRIBERS API
// ============================================

app.post('/api/subscribe', (req, res) => {
  const { email, source = 'Newsletter' } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  db.run(
    'INSERT INTO subscribers (email, source) VALUES (?, ?)',
    [email, source],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ error: `Email already subscribed for ${source}` });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, message: 'Subscribed successfully!' });
    }
  );
});

app.get('/api/subscribers', (req, res) => {
  db.all('SELECT * FROM subscribers ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.delete('/api/subscribers/:id', (req, res) => {
  db.run('DELETE FROM subscribers WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Subscriber removed successfully' });
  });
});

// ============================================
// AUTH & USER API
// ============================================

app.get('/api/users', (req, res) => {
  db.all('SELECT id, username, email, created_at FROM users ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.delete('/api/admin/users/:id', (req, res) => {
  db.run('DELETE FROM users WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

// Middleware to authenticate JWT token
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

// Register a new user
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            if (err.message.includes('users.username')) {
              return res.status(400).json({ error: 'Username is already taken' });
            }
            if (err.message.includes('users.email')) {
              return res.status(400).json({ error: 'Email is already registered' });
            }
            return res.status(400).json({ error: 'Username or email already exists' });
          }
          return res.status(500).json({ error: err.message });
        }
        
        const userId = this.lastID;
        
        const token = jwt.sign({ id: userId, username }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: userId, username, email } });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, username: user.username, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar, isAdmin: user.isAdmin } });
  });
});

// Get current user profile
app.get('/api/auth/me', authenticateToken, (req, res) => {
  db.get('SELECT id, username, email, avatar, isAdmin, created_at FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(user);
  });
});

// Upload User Avatar
app.post('/api/users/avatar', authenticateToken, upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  // URL path for the uploaded image
  const avatarUrl = `/uploads/${req.file.filename}`;

  db.run('UPDATE users SET avatar = ? WHERE id = ?', [avatarUrl, req.user.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to update avatar in database' });
    }
    
    // Return updated user data (or just the new avatar url)
    res.json({ message: 'Avatar updated successfully', avatar: avatarUrl });
  });
});

// Remove User Avatar
app.delete('/api/users/avatar', authenticateToken, (req, res) => {
  db.run('UPDATE users SET avatar = NULL WHERE id = ?', [req.user.id], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to remove avatar' });
    res.json({ message: 'Avatar removed successfully' });
  });
});

// Update Profile Info
app.put('/api/users/profile', authenticateToken, (req, res) => {
  const { username, email } = req.body;
  
  db.run('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, req.user.id], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }
      return res.status(500).json({ error: 'Failed to update profile' });
    }
    res.json({ message: 'Profile updated successfully', username, email });
  });
});

// Update Password
app.put('/api/users/password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  db.get('SELECT password FROM users WHERE id = ?', [req.user.id], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Incorrect current password' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id], function(err) {
      if (err) return res.status(500).json({ error: 'Failed to update password' });
      res.json({ message: 'Password updated successfully' });
    });
  });
});

// Delete Account
app.delete('/api/users/account', authenticateToken, (req, res) => {
  db.run('DELETE FROM users WHERE id = ?', [req.user.id], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to delete account' });
    res.json({ message: 'Account deleted successfully' });
  });
});

// Get user's personal bookshelf
app.get('/api/user/books', authenticateToken, (req, res) => {
  const query = `
    SELECT b.*, ub.status, ub.added_at
    FROM books b
    JOIN user_books ub ON b.id = ub.book_id
    WHERE ub.user_id = ?
    ORDER BY ub.added_at DESC
  `;
  
  db.all(query, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const books = rows.map(b => ({
      ...b,
      mood: b.mood ? b.mood.split(',') : [],
      featured: Boolean(b.featured)
    }));
    res.json(books);
  });
});

// Add/Update book in user's bookshelf
app.post('/api/user/books', authenticateToken, (req, res) => {
  const { bookId, status } = req.body;
  
  db.run(
    'INSERT INTO user_books (user_id, book_id, status) VALUES (?, ?, ?) ON CONFLICT(user_id, book_id) DO UPDATE SET status = ?',
    [req.user.id, bookId, status, status],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Bookshelf updated' });
    }
  );
});

// Remove book from user's bookshelf
app.delete('/api/user/books/:bookId', authenticateToken, (req, res) => {
  db.run('DELETE FROM user_books WHERE user_id = ? AND book_id = ?', [req.user.id, req.params.bookId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Book removed from shelf' });
  });
});

// ============================================
// ENGAGEMENT API (Likes & Comments)
// ============================================

// Get engagement data for a specific book
app.get('/api/books/:id/engagement', (req, res) => {
  const bookId = req.params.id;
  let userId = null;
  
  // Optional auth to see if current user liked it
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.id;
    } catch (e) { /* ignore invalid token for this public route */ }
  }

  const queries = {
    likes: new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM book_likes WHERE book_id = ?', [bookId], (err, row) => {
        if (err) reject(err); else resolve(row.count);
      });
    }),
    userLiked: new Promise((resolve, reject) => {
      if (!userId) return resolve(false);
      db.get('SELECT 1 FROM book_likes WHERE book_id = ? AND user_id = ?', [bookId, userId], (err, row) => {
        if (err) reject(err); else resolve(!!row);
      });
    }),
    comments: new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, u.username, u.avatar 
        FROM book_comments c 
        JOIN users u ON c.user_id = u.id 
        WHERE c.book_id = ? 
        ORDER BY c.created_at DESC
      `;
      db.all(query, [bookId], (err, rows) => {
        if (err) reject(err); else resolve(rows || []);
      });
    })
  };

  Promise.all([queries.likes, queries.userLiked, queries.comments])
    .then(([likes, userLiked, comments]) => {
      res.json({ likes, userLiked, comments });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// Toggle like for a book
app.post('/api/books/:id/like', authenticateToken, (req, res) => {
  const bookId = req.params.id;
  const userId = req.user.id;

  db.get('SELECT 1 FROM book_likes WHERE book_id = ? AND user_id = ?', [bookId, userId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (row) {
      // Unlike
      db.run('DELETE FROM book_likes WHERE book_id = ? AND user_id = ?', [bookId, userId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ liked: false });
      });
    } else {
      // Like
      db.run('INSERT INTO book_likes (book_id, user_id) VALUES (?, ?)', [bookId, userId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ liked: true });
      });
    }
  });
});

// Post a comment
app.post('/api/books/:id/comments', authenticateToken, (req, res) => {
  const bookId = req.params.id;
  const userId = req.user.id;
  const { content, rating } = req.body;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: 'Comment cannot be empty' });
  }

  // Basic validation for rating if provided
  let finalRating = null;
  if (rating !== undefined && rating !== null) {
    const r = parseInt(rating, 10);
    if (r >= 1 && r <= 5) {
      finalRating = r;
    }
  }

  db.run(
    'INSERT INTO book_comments (book_id, user_id, content, rating) VALUES (?, ?, ?, ?)',
    [bookId, userId, content.trim(), finalRating],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      
      db.get(
        'SELECT c.*, u.username, u.avatar FROM book_comments c JOIN users u ON c.user_id = u.id WHERE c.id = ?',
        [this.lastID],
        (err, comment) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json(comment);
        }
      );
    }
  );
});

// Delete a comment
app.delete('/api/comments/:id', authenticateToken, (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;
  const isAdmin = req.user.isAdmin;

  db.get('SELECT user_id FROM book_comments WHERE id = ?', [commentId], (err, comment) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    // Allow if user is author OR admin
    if (comment.user_id === userId || isAdmin) {
      db.run('DELETE FROM book_comments WHERE id = ?', [commentId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Comment deleted successfully' });
      });
    } else {
      res.status(403).json({ error: 'Not authorized to delete this comment' });
    }
  });
});

// ============================================
// METADATA API (for filters)
// ============================================

app.get('/api/meta/genres', (req, res) => {
  db.all('SELECT DISTINCT genre FROM books ORDER BY genre ASC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const genres = ['All', ...rows.map(r => r.genre)];
    res.json(genres);
  });
});

app.get('/api/meta/moods', (req, res) => {
  db.all('SELECT DISTINCT mood FROM books', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const moodSet = new Set();
    rows.forEach(r => {
      if (r.mood) {
        r.mood.split(',').forEach(m => moodSet.add(m.trim()));
      }
    });
    const moods = ['All', ...Array.from(moodSet).sort()];
    res.json(moods);
  });
});

// ============================================
// START SERVER
// ============================================

// ============================================
// UPLOAD API
// ============================================
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ url });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📚 API: http://localhost:${PORT}/api/books`);
    console.log(`📖 Currently Reading: http://localhost:${PORT}/api/currently-reading\n`);
  });
}

module.exports = app;
