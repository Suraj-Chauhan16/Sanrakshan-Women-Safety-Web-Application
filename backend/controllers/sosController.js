const User = require('../models/User');
const nodemailer = require('nodemailer');

// Test transporter to verify email config
let transporter;

try {
  // Check if using test mode (development without real email)
  if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_USER) {
    console.log('📧 Using Development Mode (emails logged only)');
    transporter = {
      sendMail: async (options) => {
        console.log('📧 TEST EMAIL WOULD BE SENT:');
        console.log('   To:', options.to);
        console.log('   Subject:', options.subject);
        console.log('   Message logged for testing');
        return Promise.resolve({ response: 'Test email logged' });
      },
      verify: (callback) => {
        console.log('✅ Development mode ready');
        callback(null, true);
      }
    };
  } else {
    // Real Gmail configuration
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    // Verify connection
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Email Configuration Error:', error.message);
      } else {
        console.log('✅ Email service ready');
      }
    });
  }
} catch (error) {
  console.error('Email initialization error:', error);
}

// Send SOS Alert
exports.sendSOSAlert = async (req, res) => {
  try {
    const { userId, emergencyContacts, latitude, longitude } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Use contacts from request (localStorage) or database
    const contactsToNotify = emergencyContacts && emergencyContacts.length > 0 
      ? emergencyContacts 
      : user.emergencyContacts;

    if (!contactsToNotify || contactsToNotify.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No emergency contacts added. Please add emergency contacts first.'
      });
    }

    // Get user location (if available from frontend)
    const location = latitude && longitude 
      ? `Latitude: ${latitude}, Longitude: ${longitude}`
      : 'Location not available';

    // Create alert message
    const alertMessage = `
      🚨 EMERGENCY SOS ALERT 🚨
      
      User: ${user.name}
      Email: ${user.email}
      Phone: ${user.phone || 'Not provided'}
      
      Location: ${location}
      Time: ${new Date().toLocaleString()}
      
      This is an automated SOS alert. The user needs immediate help.
      Please call or contact them immediately.
    `;

    // Send email to each emergency contact
    const emailPromises = contactsToNotify.map(contact => {
      if (contact.email) {
        return transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: contact.email,
          subject: '🚨 EMERGENCY SOS ALERT - Immediate Help Needed',
          text: alertMessage,
          html: `
            <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ff0000;">
              <h2 style="color: #ff0000;">🚨 EMERGENCY SOS ALERT 🚨</h2>
              <p><strong>User:</strong> ${user.name}</p>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Phone:</strong> ${user.phone || 'Not provided'}</p>
              <p><strong>Location:</strong> ${location}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              <hr>
              <p style="color: #ff0000;"><strong>This is an automated SOS alert. The user needs immediate help.</strong></p>
              <p><strong>Please call or contact them immediately.</strong></p>
            </div>
          `
        });
      }
      return Promise.resolve();
    });

    try {
      await Promise.all(emailPromises);
    } catch (emailError) {
      console.warn('⚠️ Email sending failed, but continuing:', emailError.message);
      // Don't fail the whole request if email fails in development
      if (process.env.NODE_ENV !== 'development') {
        throw emailError;
      }
    }

    // Log the alert
    console.log(`✅ SOS Alert sent by ${user.name} to ${contactsToNotify.length} contacts`);

    res.status(200).json({
      success: true,
      message: 'SOS alert sent to all emergency contacts',
      contactsNotified: contactsToNotify.length,
      timestamp: new Date().toISOString(),
      location: { latitude, longitude }
    });

  } catch (error) {
    console.error('🚨 SOS Alert Error:', error.message);
    console.error('Full Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send SOS alert: ' + error.message,
      error: process.env.NODE_ENV === 'development' ? error.message : 'Email service error'
    });
  }
};

// Get Emergency Numbers for a region
exports.getEmergencyNumbers = async (req, res) => {
  try {
    const emergencyNumbers = {
      India: {
        police: '100',
        ambulance: '102',
        womenHelpline: '1091',
        crisisHotline: '1800-180-1111',
        cybercrime: '1930'
      },
      USA: {
        emergency: '911',
        womenHotline: '1-800-799-7233'
      },
      UK: {
        emergency: '999',
        womenSupport: '0808-2000-247'
      },
      Canada: {
        emergency: '911',
        womenHotline: '1-800-363-9010'
      }
    };

    res.status(200).json({
      success: true,
      emergencyNumbers
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch emergency numbers',
      error: error.message
    });
  }
};
