// API service layer for The Readers Index
// Centralizes all backend communication

const API_BASE = '/api';

/**
 * Fetch books from the backend with optional filters
 * @param {Object} params - Query parameters
 * @param {string} params.genre - Filter by genre
 * @param {string} params.mood - Filter by mood
 * @param {string} params.search - Search term
 * @param {string} params.sort - Sort order (newest, oldest, highest, lowest, title)
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {boolean} params.featured - Only featured books
 * @returns {Promise<{books: Array, pagination: Object}>}
 */
export async function fetchBooks(params = {}) {
  const query = new URLSearchParams();

  if (params.genre && params.genre !== 'All') query.set('genre', params.genre);
  if (params.mood && params.mood !== 'All') query.set('mood', params.mood);
  if (params.search) query.set('search', params.search);
  if (params.sort) query.set('sort', params.sort);
  if (params.page) query.set('page', params.page);
  if (params.limit) query.set('limit', params.limit);
  if (params.featured) query.set('featured', 'true');

  const res = await fetch(`${API_BASE}/books?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch books');
  return res.json();
}

/**
 * Fetch a single book by ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function fetchBookById(id) {
  const res = await fetch(`${API_BASE}/books/${id}`);
  if (!res.ok) throw new Error('Failed to fetch book');
  return res.json();
}

/**
 * Fetch the currently reading book
 * @returns {Promise<Object|null>}
 */
export async function fetchCurrentlyReading() {
  const res = await fetch(`${API_BASE}/currently-reading`);
  if (!res.ok) throw new Error('Failed to fetch currently reading');
  return res.json();
}

/**
 * Fetch available genres from the database
 * @returns {Promise<string[]>}
 */
export async function fetchGenres() {
  const res = await fetch(`${API_BASE}/meta/genres`);
  if (!res.ok) throw new Error('Failed to fetch genres');
  return res.json();
}

/**
 * Fetch available moods from the database
 * @returns {Promise<string[]>}
 */
export async function fetchMoods() {
  const res = await fetch(`${API_BASE}/meta/moods`);
  if (!res.ok) throw new Error('Failed to fetch moods');
  return res.json();
}

/**
 * Subscribe an email to the newsletter or waitlist
 * @param {string} email
 * @param {string} source - 'Newsletter' or 'Waitlist'
 * @returns {Promise<Object>}
 */
export async function subscribe(email, source = 'Newsletter') {
  const res = await fetch(`${API_BASE}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, source }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to subscribe');
  }
  return res.json();
}

/**
 * Add a new book (admin)
 * @param {Object} book
 * @returns {Promise<Object>}
 */
export async function addBook(book) {
  const res = await fetch(`${API_BASE}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error('Failed to add book');
  return res.json();
}

/**
 * Update an existing book (admin)
 * @param {number} id
 * @param {Object} book
 * @returns {Promise<Object>}
 */
export async function updateBook(id, book) {
  const res = await fetch(`${API_BASE}/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error('Failed to update book');
  return res.json();
}

/**
 * Delete a book (admin)
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function deleteBook(id) {
  const res = await fetch(`${API_BASE}/books/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete book');
  return res.json();
}

/**
 * Update currently reading (admin)
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export async function updateCurrentlyReading(data) {
  const res = await fetch(`${API_BASE}/currently-reading`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update currently reading');
  return res.json();
}

/**
 * Fetch all curated lists
 * @returns {Promise<Array>}
 */
export async function fetchLists() {
  const res = await fetch(`${API_BASE}/lists`);
  if (!res.ok) throw new Error('Failed to fetch lists');
  return res.json();
}

/**
 * Add a new curated list (admin)
 * @param {Object} list
 * @returns {Promise<Object>}
 */
export async function addList(list) {
  const res = await fetch(`${API_BASE}/lists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(list),
  });
  if (!res.ok) throw new Error('Failed to add list');
  return res.json();
}

/**
 * Update a curated list (admin)
 * @param {number} id
 * @param {Object} list
 * @returns {Promise<Object>}
 */
export async function updateList(id, list) {
  const res = await fetch(`${API_BASE}/lists/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(list),
  });
  if (!res.ok) throw new Error('Failed to update list');
  return res.json();
}

/**
 * Delete a curated list (admin)
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function deleteList(id) {
  const res = await fetch(`${API_BASE}/lists/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete list');
  return res.json();
}

/**
 * Fetch book IDs for a specific list
 * @param {number} id
 * @returns {Promise<Array>}
 */
export async function fetchListBooks(id) {
  const res = await fetch(`${API_BASE}/lists/${id}/books`);
  if (!res.ok) throw new Error('Failed to fetch list books');
  return res.json();
}

/**
 * Update books in a curated list
 * @param {number} id
 * @param {Array} bookIds
 * @returns {Promise<Object>}
 */
export async function updateListBooks(id, bookIds) {
  const res = await fetch(`${API_BASE}/lists/${id}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookIds }),
  });
  if (!res.ok) throw new Error('Failed to update list books');
  return res.json();
}

/**
 * Fetch all subscribers
 * @returns {Promise<Array>}
 */
export async function fetchSubscribers() {
  const res = await fetch(`${API_BASE}/subscribers`);
  if (!res.ok) throw new Error('Failed to fetch subscribers');
  return res.json();
}

/**
 * Delete a subscriber
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function deleteSubscriber(id) {
  const res = await fetch(`${API_BASE}/subscribers/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete subscriber');
  return res.json();
}

/**
 * Fetch all users
 * @returns {Promise<Array>}
 */
export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

/**
 * Delete a user
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function deleteUser(id) {
  const res = await fetch(`${API_BASE}/admin/users/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete user');
  return res.json();
}

/**
 * Upload an image file
 * @param {File} file
 * @returns {Promise<Object>}
 */
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload image');
  return res.json();
}

/**
 * Upload a user avatar
 * @param {File} file
 * @param {string} token
 * @returns {Promise<Object>}
 */
export async function uploadAvatar(file, token) {
  const formData = new FormData();
  formData.append('avatar', file);

  const res = await fetch(`${API_BASE}/users/avatar`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload avatar');
  return res.json();
}
