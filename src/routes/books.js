const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks
} = require('../controllers/booksController');

// GET all books
router.get('/', auth, getAllBooks);

// GET book by ID
router.get('/:id', auth, getBookById);

// POST create book
router.post('/', auth, createBook);

// PUT update book
router.put('/:id', auth, updateBook);

// DELETE book
router.delete('/:id', auth, deleteBook);

// GET search by title
router.get('/search/:titre', auth, searchBooks);

module.exports = router;
