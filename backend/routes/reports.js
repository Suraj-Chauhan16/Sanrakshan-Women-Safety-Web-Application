const express = require('express');
const router = express.Router();
const { 
  getAllReports, 
  createReport, 
  getReportById, 
  updateReportStatus, 
  deleteReport 
} = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

// Get all reports (admin only)
router.get('/', protect, getAllReports);

// Create a new report (public)
router.post('/', createReport);

// Get specific report by ID
router.get('/:id', protect, getReportById);

// Update report status (admin only)
router.put('/:id', protect, updateReportStatus);

// Delete report (admin only)
router.delete('/:id', protect, deleteReport);

module.exports = router;
