const express = require('express');
const router = express.Router();
const { sendSOSAlert, getEmergencyNumbers } = require('../controllers/sosController');
const { protect } = require('../middleware/auth');

// Test endpoint to check email configuration
router.get('/test', (req, res) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASSWORD;
  
  res.json({
    success: true,
    message: 'Email Config Test',
    emailConfigured: !!emailUser && !!emailPass,
    emailUser: emailUser ? emailUser.substring(0, 5) + '***' : 'NOT SET',
    passwordSet: !!emailPass,
    service: process.env.EMAIL_SERVICE || 'gmail'
  });
});

// Send SOS Alert
router.post('/send-alert', sendSOSAlert);

// Get Emergency Numbers
router.get('/emergency-numbers', getEmergencyNumbers);

module.exports = router;
