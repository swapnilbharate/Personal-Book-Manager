const express = require('express');
const { check } = require('express-validator');
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getDashboardStats
} = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Require auth for all book routes
router.use(protect);

// Validation middleware
const validateBook = [
  check('title', 'Title is required').not().isEmpty(),
  check('author', 'Author is required').not().isEmpty(),
];

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
  }
  next();
};

router.route('/stats/dashboard').get(getDashboardStats);

router
  .route('/')
  .get(getBooks)
  .post(validateBook, handleValidationErrors, createBook);

router
  .route('/:id')
  .get(getBook)
  .put(updateBook)
  .delete(deleteBook);

module.exports = router;
