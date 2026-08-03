const express = require('express');
const { check } = require('express-validator');
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation middleware
const validateRegister = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
];

const validateLogin = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
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

router.post('/register', validateRegister, handleValidationErrors, registerUser);
router.post('/login', validateLogin, handleValidationErrors, loginUser);
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getMe);

module.exports = router;
