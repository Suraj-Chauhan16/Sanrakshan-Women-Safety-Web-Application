const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    settingName: {
      type: String,
      default: 'main',
      unique: true
    },
    allowRegistration: {
      type: Boolean,
      default: true
    },
    maintenanceMode: {
      type: Boolean,
      default: false
    },
    maintenanceMessage: {
      type: String,
      default: 'The system is under maintenance. Please try again later.'
    },
    maxLoginAttempts: {
      type: Number,
      default: 5
    },
    lockoutDuration: {
      type: Number,
      default: 15 // minutes
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Settings', settingsSchema);
