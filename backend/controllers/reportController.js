const Report = require('../models/Report');

// Get all reports (admin only)
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error: error.message
    });
  }
};

// Create a new report
exports.createReport = async (req, res) => {
  try {
    const { type, reporterName, reporterEmail, reporterPhone, description, location, incidentDate, isAnonymous } = req.body;

    // Validate required fields
    if (!type || !reporterName || !reporterEmail || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const report = await Report.create({
      type,
      reporterName: isAnonymous ? 'Anonymous' : reporterName,
      reporterEmail: isAnonymous ? 'anonymous@report.local' : reporterEmail,
      reporterPhone,
      description,
      location,
      incidentDate,
      isAnonymous
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      report
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create report',
      error: error.message
    });
  }
};

// Get report by ID
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report',
      error: error.message
    });
  }
};

// Update report status (admin only)
exports.updateReportStatus = async (req, res) => {
  try {
    const { status, priority, notes } = req.body;

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, priority, notes, updatedAt: Date.now() },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report updated successfully',
      report
    });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update report',
      error: error.message
    });
  }
};

// Delete report (admin only)
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete report',
      error: error.message
    });
  }
};
