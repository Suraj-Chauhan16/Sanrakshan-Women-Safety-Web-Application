const User = require('../models/User');
const Settings = require('../models/Settings');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// @desc    Register a user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    console.log('📝 Register Request Body:', req.body);
    console.log('📝 Request Body Type:', typeof req.body);
    
    // Check if registration is allowed
    const settings = await Settings.findOne({ settingName: 'main' });
    if (settings && !settings.allowRegistration) {
      return res.status(503).json({
        success: false,
        message: 'User registration is currently disabled. Please try again later.'
      });
    }

    // Check if site is in maintenance mode
    if (settings && settings.maintenanceMode) {
      return res.status(503).json({
        success: false,
        message: 'Site is under maintenance. Please try again later.'
      });
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Registration validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, role, phone, dateOfBirth, city } = req.body;

    console.log('📝 Extracted values:', { name, email, phone, dateOfBirth, city });

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user with all provided fields, properly converting dateOfBirth to Date
    user = new User({
      name,
      email,
      password,
      phone: phone && phone.trim() ? phone.trim() : null,
      dateOfBirth: dateOfBirth && dateOfBirth.trim() ? new Date(dateOfBirth) : null,
      city: city && city.trim() ? city.trim() : null,
      role: role || 'user'
    });

    console.log('📝 User object before save:', {
      name: user.name,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      city: user.city
    });

    // Save user to database
    await user.save();

    console.log('✅ User saved successfully:', user._id);

    // Generate token
    const token = generateToken(user._id, user.role);

    // Return response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        city: user.city,
        role: user.role,
        profileImage: user.profileImage || null
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password, role } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user (password is selected because we excluded it in model)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify role matches (if provided)
    const requestedRole = role || 'user';
    if (user.role !== requestedRole) {
      return res.status(401).json({
        success: false,
        message: `This account is registered as ${user.role}, not ${requestedRole}`
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    // Return response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        city: user.city,
        role: user.role,
        profileImage: user.profileImage || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        city: user.city,
        bio: user.bio,
        role: user.role,
        profileImage: user.profileImage || null,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/updateprofile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, dateOfBirth, city, bio, profileImage } = req.body;

    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone.trim();
    if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
    if (city) user.city = city.trim();
    if (bio) user.bio = bio;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        city: user.city,
        bio: user.bio,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// @desc    Get admin statistics
// @route   GET /api/auth/admin/stats
// @access  Private (Admin only)
exports.getAdminStats = async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: { $ne: false } }); // Count users who are active or don't have isActive field
    
    // Get new users this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        newUsersThisMonth,
        alertsSent: 156,
        averageSessionTime: '24 mins',
        uptime: '98%'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin statistics',
      error: error.message
    });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/auth/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const users = await User.find().select('-password').limit(100);

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// @desc    Delete a user (admin)
// @route   DELETE /api/auth/admin/users/:userId
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const userToDelete = await User.findByIdAndDelete(req.params.userId);
    
    if (!userToDelete) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      user: userToDelete
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// @desc    Update user status (admin)
// @route   PUT /api/auth/admin/users/:userId
// @access  Private (Admin only)
exports.updateUserStatus = async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { isActive } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { isActive },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// @desc    Get system settings (admin)
// @route   GET /api/auth/admin/settings
// @access  Private (Admin only)
exports.getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    let settings = await Settings.findOne({ settingName: 'main' });
    
    // Create default settings if they don't exist
    if (!settings) {
      settings = await Settings.create({
        settingName: 'main',
        maintenanceMode: false,
        allowRegistration: true,
        emailNotifications: true,
        sessionTimeout: 30,
        maxLoginAttempts: 5
      });
    }

    res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message
    });
  }
};

// @desc    Update system settings (admin)
// @route   PUT /api/auth/admin/settings
// @access  Private (Admin only)
exports.updateSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { maintenanceMode, allowRegistration, emailNotifications, sessionTimeout, maxLoginAttempts } = req.body;

    let settings = await Settings.findOne({ settingName: 'main' });
    
    if (!settings) {
      settings = await Settings.create({
        settingName: 'main'
      });
    }

    // Update settings
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
    if (allowRegistration !== undefined) settings.allowRegistration = allowRegistration;
    if (emailNotifications !== undefined) settings.emailNotifications = emailNotifications;
    if (sessionTimeout !== undefined) settings.sessionTimeout = sessionTimeout;
    if (maxLoginAttempts !== undefined) settings.maxLoginAttempts = maxLoginAttempts;

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating settings',
      error: error.message
    });
  }
};
