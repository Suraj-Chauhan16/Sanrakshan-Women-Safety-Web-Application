const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  register,
  login,
  getCurrentUser,
  updateProfile,
  getAdminStats,
  getAllUsers,
  deleteUser,
  updateUserStatus,
  getSettings,
  updateSettings
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Validation middleware
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin')
];

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Private routes
router.get('/me', protect, getCurrentUser);
router.put('/updateprofile', protect, updateProfile);

// Admin routes
router.get('/admin/stats', protect, getAdminStats);
router.get('/admin/users', protect, getAllUsers);
router.delete('/admin/users/:userId', protect, deleteUser);
router.put('/admin/users/:userId', protect, updateUserStatus);
router.get('/admin/settings', protect, getSettings);
router.put('/admin/settings', protect, updateSettings);

module.exports = router;
