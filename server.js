const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const axios = require('axios');
const methodOverride = require('method-override');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'book_tracker',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

// Routes

// Home page - show all books with sorting
app.get('/', async (req, res) => {
  try {
    const sortBy = req.query.sort || 'date_read';
    let orderBy;
    
    switch(sortBy) {
      case 'title':
        orderBy = 'title ASC';
        break;
      case 'rating':
        orderBy = 'rating DESC, date_read DESC';
        break;
      case 'date_read':
      default:
        orderBy = 'date_read DESC';
        break;
    }
    
    const result = await pool.query(`SELECT * FROM books ORDER BY ${orderBy}`);
    res.render('index', { books: result.rows, sortBy });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Show form to add a new book
app.get('/books/new', (req, res) => {
  res.render('add-book');
});

// Add a new book
app.post('/books', async (req, res) => {
  const { title, author, rating, notes, date_read } = req.body;
  try {
    await pool.query(
      'INSERT INTO books (title, author, rating, notes, date_read) VALUES ($1, $2, $3, $4, $5)',
      [title, author, rating, notes, date_read]
    );
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Show a single book
app.get('/books/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [req.params.id]);
    const book = result.rows[0];
    
    if (!book) {
      return res.status(404).send('Book not found');
    }
    
    // Get book cover from Open Library API
    let coverUrl = null;
    try {
      const response = await axios.get(`https://covers.openlibrary.org/b/title/${encodeURIComponent(book.title)}-L.jpg?default=false`);
      if (response.request.res.responseUrl && !response.request.res.responseUrl.includes('default=false')) {
        coverUrl = response.request.res.responseUrl;
      }
    } catch (error) {
      console.log('No cover found for', book.title);
    }
    
    res.render('book', { book, coverUrl });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Show form to edit a book
app.get('/books/:id/edit', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [req.params.id]);
    const book = result.rows[0];
    
    if (!book) {
      return res.status(404).send('Book not found');
    }
    
    res.render('edit-book', { book });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Update a book
app.put('/books/:id', async (req, res) => {
  const { title, author, rating, notes, date_read } = req.body;
  try {
    await pool.query(
      'UPDATE books SET title = $1, author = $2, rating = $3, notes = $4, date_read = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6',
      [title, author, rating, notes, date_read, req.params.id]
    );
    res.redirect(`/books/${req.params.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Delete a book
app.delete('/books/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM books WHERE id = $1', [req.params.id]);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});