import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Admin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    alertsSent: 0,
    averageSessionTime: '0 mins',
    uptime: '0%'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reports, setReports] = useState([]);
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Fetch admin statistics and users from backend
  useEffect(() => {
    fetchAdminData();
    fetchSettings();
    // Set up interval to refresh data every 30 seconds for real-time updates
    const interval = setInterval(() => {
      fetchAdminData();
      fetchSettings();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken'); // Changed from 'token' to 'authToken'
      
      if (!token) {
        setError('No authentication token found. Please login as admin first.');
        setLoading(false);
        console.error('Token not found in localStorage');
        return;
      }

      console.log('Fetching admin data with token:', token.substring(0, 20) + '...');

      // Fetch statistics
      const statsResponse = await fetch('http://localhost:5000/api/auth/admin/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Stats response status:', statsResponse.status);

      // Fetch users
      const usersResponse = await fetch('http://localhost:5000/api/auth/admin/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Users response status:', usersResponse.status);

      if (!statsResponse.ok) {
        const errorData = await statsResponse.json();
        throw new Error(`Stats API Error: ${errorData.message || statsResponse.status}`);
      }

      if (!usersResponse.ok) {
        const errorData = await usersResponse.json();
        throw new Error(`Users API Error: ${errorData.message || usersResponse.status}`);
      }

      const statsData = await statsResponse.json();
      const usersData = await usersResponse.json();

      console.log('Stats data:', statsData);
      console.log('Users data:', usersData);

      if (statsData.success) {
        setStats(statsData.stats);
      }

      if (usersData.success) {
        // Transform backend users to match component format
        const formattedUsers = usersData.users.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          joinDate: new Date(user.createdAt).toLocaleDateString(),
          status: user.isActive !== false ? 'active' : 'inactive', // Default to active if not specified
          role: user.role === 'admin' ? 'moderator' : 'member',
        }));
        setUsers(formattedUsers);
      }

      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reports from backend
  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('No token for fetching reports');
        return;
      }

      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch reports: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Format reports
        const formattedReports = data.reports.map((report) => ({
          id: report._id,
          type: report.type,
          reporter: report.reporterName,
          date: new Date(report.createdAt).toLocaleDateString(),
          status: report.status,
          priority: report.priority,
          description: report.description,
          email: report.reporterEmail,
          notes: report.notes
        }));
        setReports(formattedReports);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  // Fetch settings from backend
  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/auth/admin/settings', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success && data.settings) {
        setSettings({
          maintenanceMode: data.settings.maintenanceMode || false,
          allowRegistration: data.settings.allowRegistration !== false,
          emailNotifications: data.settings.emailNotifications !== false,
          sessionTimeout: data.settings.sessionTimeout || 30,
          maxLoginAttempts: data.settings.maxLoginAttempts || 5
        });
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  // Save settings to backend
  const saveSettings = async () => {
    try {
      setSettingsLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('No authentication token found');
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/admin/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      const data = await response.json();
      if (data.success) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
        alert('Settings saved successfully!');
      } else {
        alert('Error saving settings: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Error saving settings: ' + err.message);
    } finally {
      setSettingsLoading(false);
    }
  };

  // Handle settings change
  const handleSettingsChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Fetch reports on mount
  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleUserStatusChange = (userId, newStatus) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('No authentication token found');
      return;
    }

    const isActive = newStatus === 'active';

    fetch(`http://localhost:5000/api/auth/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isActive })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update user status');
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === userId ? { ...user, status: newStatus } : user
            )
          );
          alert(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
        }
      })
      .catch(err => {
        console.error('Error updating user:', err);
        alert(`Error: ${err.message}`);
      });
  };

  const handleDeleteUser = (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('No authentication token found');
      return;
    }

    fetch(`http://localhost:5000/api/auth/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete user');
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
          alert('User deleted successfully');
        }
      })
      .catch(err => {
        console.error('Error deleting user:', err);
        alert(`Error: ${err.message}`);
      });
  };

  // Handle report status change
  const handleReportStatusChange = (reportId, newStatus) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('No authentication token found');
      return;
    }

    fetch(`http://localhost:5000/api/reports/${reportId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus, notes: 'Status updated by admin' })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update report');
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setReports((prevReports) =>
            prevReports.map((report) =>
              report.id === reportId ? { ...report, status: newStatus } : report
            )
          );
          alert(`Report status updated to ${newStatus}`);
        }
      })
      .catch(err => {
        console.error('Error updating report:', err);
        alert(`Error: ${err.message}`);
      });
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Admin Header */}
        <div className="admin-header">
          <h1>👨‍💼 Admin Dashboard</h1>
          <p>Manage users, monitor activity, and system statistics</p>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </button>
          <button
            className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            📋 Reports
          </button>
          <button
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="admin-content">
            {error && (
              <div className="error-message" style={{ color: '#d32f2f', padding: '10px', marginBottom: '20px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
                Error: {error}
              </div>
            )}
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>Loading statistics...</p>
              </div>
            ) : (
              <>
                <h2>System Overview</h2>

                {/* Statistics Cards */}
                <div className="stats-grid">
                  <div className="stat-card large">
                    <div className="stat-number">{stats.totalUsers}</div>
                    <div className="stat-label">Total Users</div>
                    <div className="stat-change positive">↑ 12% this month</div>
                  </div>

                  <div className="stat-card large">
                    <div className="stat-number">{stats.activeUsers}</div>
                    <div className="stat-label">Active Users</div>
                    <div className="stat-change positive">↑ 8% increase</div>
                  </div>

                  <div className="stat-card large">
                    <div className="stat-number">{stats.newUsersThisMonth}</div>
                    <div className="stat-label">New Users This Month</div>
                    <div className="stat-change positive">↑ Growing</div>
                  </div>

                  <div className="stat-card large">
                    <div className="stat-number">{stats.alertsSent}</div>
                    <div className="stat-label">Alerts Sent</div>
                    <div className="stat-change">This month</div>
                  </div>

                  <div className="stat-card large">
                    <div className="stat-number">{stats.averageSessionTime}</div>
                    <div className="stat-label">Avg. Session Time</div>
                    <div className="stat-change">Per user</div>
                  </div>

                  <div className="stat-card large">
                    <div className="stat-number">{stats.uptime}</div>
                    <div className="stat-label">Uptime</div>
                    <div className="stat-change positive">Excellent</div>
                  </div>
                </div>

                {/* Activity Summary */}
                <div className="activity-summary">
                  <h3>Recent System Activity</h3>
                  <div className="activity-chart">
                    <div className="chart-placeholder">
                      📈 User Growth Chart - Integration with Chart.js available
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="admin-content">
            {error && (
              <div className="error-message" style={{ color: '#d32f2f', padding: '10px', marginBottom: '20px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
                Error: {error}
              </div>
            )}
            
            <div className="users-header">
              <h2>User Management</h2>
              <button className="btn btn-primary btn-small">+ Add New User</button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>Loading users...</p>
              </div>
            ) : (
              <>
                <div className="users-table-container">
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Join Date</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.joinDate}</td>
                          <td>
                            <span className={`role-badge ${user.role}`}>{user.role}</span>
                          </td>
                          <td>
                            <span className={`status-badge ${user.status}`}>{user.status}</span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn btn-secondary btn-tiny"
                                onClick={() =>
                                  handleUserStatusChange(
                                    user.id,
                                    user.status === 'active' ? 'inactive' : 'active'
                                  )
                                }
                              >
                                {user.status === 'active' ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                className="btn btn-danger btn-tiny"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {users.length === 0 && (
                  <div className="empty-state">
                    <p>No users found</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="admin-content">
            <h2>User Reports & Issues</h2>

            {reports.length === 0 ? (
              <div className="empty-state">
                <p>No reports yet</p>
              </div>
            ) : (
              <div className="reports-list">
                {reports.map((report) => (
                  <div key={report.id} className="report-card">
                    <div className="report-header">
                      <h3>{report.type}</h3>
                      <span className={`report-status ${report.status}`}>{report.status}</span>
                    </div>
                    <p className="report-info">
                      <strong>Reported by:</strong> {report.reporter || 'Anonymous'}
                    </p>
                    {report.email && (
                      <p className="report-info">
                        <strong>Email:</strong> {report.email}
                      </p>
                    )}
                    <p className="report-info">
                      <strong>Description:</strong> {report.description}
                    </p>
                    <p className="report-date">{report.date}</p>
                    <div className="report-actions">
                      <button 
                        className="btn btn-secondary btn-small"
                        onClick={() => alert(`Report Details:\n\nType: ${report.type}\nReporter: ${report.reporter}\nDate: ${report.date}\nStatus: ${report.status}\n\nDescription:\n${report.description}`)}
                      >
                        View Details
                      </button>
                      {report.status !== 'resolved' && (
                        <button 
                          className="btn btn-primary btn-small"
                          onClick={() => handleReportStatusChange(report.id, 'resolved')}
                        >
                          Resolve
                        </button>
                      )}
                      {report.status === 'pending' && (
                        <button 
                          className="btn btn-secondary btn-small"
                          onClick={() => handleReportStatusChange(report.id, 'in-progress')}
                        >
                          In Progress
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="admin-content">
            <h2>Admin Settings</h2>

            <div className="settings-section">
              <h3>General Settings</h3>
              <div className="setting-item">
                <label>Site Maintenance Mode</label>
                <div className="setting-control">
                  <input 
                    type="checkbox" 
                    id="maintenance"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleSettingsChange('maintenanceMode', e.target.checked)}
                  />
                  <label htmlFor="maintenance" className="toggle-label">
                    Enable Maintenance Mode
                  </label>
                </div>
                <small style={{color: '#666', display: 'block', marginTop: '5px'}}>
                  When enabled, users cannot register and the site may show maintenance notices
                </small>
              </div>

              <div className="setting-item">
                <label>User Registration</label>
                <div className="setting-control">
                  <input 
                    type="checkbox" 
                    id="registration"
                    checked={settings.allowRegistration}
                    onChange={(e) => handleSettingsChange('allowRegistration', e.target.checked)}
                  />
                  <label htmlFor="registration" className="toggle-label">
                    Allow New User Registration
                  </label>
                </div>
                <small style={{color: '#666', display: 'block', marginTop: '5px'}}>
                  When disabled, new users cannot create accounts
                </small>
              </div>

              <div className="setting-item">
                <label>Email Notifications</label>
                <div className="setting-control">
                  <input 
                    type="checkbox" 
                    id="notifications"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingsChange('emailNotifications', e.target.checked)}
                  />
                  <label htmlFor="notifications" className="toggle-label">
                    Send Admin Notifications
                  </label>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h3>Security Settings</h3>
              <div className="setting-item">
                <label>Session Timeout (minutes)</label>
                <input 
                  type="number" 
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingsChange('sessionTimeout', parseInt(e.target.value) || 30)}
                  className="edit-input" 
                  min="5"
                  max="480"
                />
              </div>

              <div className="setting-item">
                <label>Max Login Attempts</label>
                <input 
                  type="number" 
                  value={settings.maxLoginAttempts}
                  onChange={(e) => handleSettingsChange('maxLoginAttempts', parseInt(e.target.value) || 5)}
                  className="edit-input" 
                  min="1"
                  max="20"
                />
              </div>
            </div>

            <div className="settings-actions">
              <button 
                className="btn btn-primary"
                onClick={saveSettings}
                disabled={settingsLoading}
              >
                {settingsLoading ? 'Saving...' : 'Save Settings'}
              </button>
              <button 
                className="btn btn-secondary"
                onClick={fetchSettings}
              >
                Reset Changes
              </button>
              {settingsSaved && (
                <span style={{color: '#10b981', marginLeft: '10px', fontWeight: 'bold'}}>
                  ✓ Settings saved successfully!
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
