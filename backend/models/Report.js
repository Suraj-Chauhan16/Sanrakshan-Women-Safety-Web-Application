const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['harassment', 'assault', 'discrimination', 'threat', 'other'],
      required: true
    },
    reporterName: {
      type: String,
      required: true,
      trim: true
    },
    reporterEmail: {
      type: String,
      required: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    reporterPhone: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      required: true,
      minlength: [10, 'Description should be at least 10 characters'],
      maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    location: {
      type: String,
      trim: true
    },
    incidentDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'resolved', 'closed'],
      default: 'pending'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    notes: {
      type: String,
      default: ''
    },
    isAnonymous: {
      type: Boolean,
      default: false
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String
      }
    ],
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

module.exports = mongoose.model('Report', reportSchema);
