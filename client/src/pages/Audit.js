import React, { useState, useEffect } from 'react';
import { getAuditLogs } from '../services/auditService';
import { useError } from '../context/ErrorContext';

const Audit = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { showError } = useError();

  const fetchAuditLogs = async () => {
    try {
      const response = await getAuditLogs(100);
      setAuditLogs(response.data);
    } catch (err) {
      showError('Failed to fetch audit logs', 'Error Loading Audit Logs');
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();

    // Auto-refresh every 2 seconds if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchAuditLogs();
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE':
        return '#4ade80'; // green
      case 'UPDATE':
        return '#60a5fa'; // blue
      case 'DELETE':
        return '#f87171'; // red
      default:
        return '#a8a29e'; // gray
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'CREATE':
        return '+';
      case 'UPDATE':
        return '~';
      case 'DELETE':
        return 'x';
      default:
        return '•';
    }
  };

  return (
    <div className="audit-page">
      <div className="audit-header">
        <h1>Audit Log Console</h1>
        <div className="audit-controls">
          <button
            className={`refresh-toggle ${autoRefresh ? 'active' : ''}`}
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? '⏸ Pause Auto-Refresh' : '▶ Resume Auto-Refresh'}
          </button>
          <button className="refresh-btn" onClick={fetchAuditLogs}>
            🔄 Refresh Now
          </button>
          <span className="log-count">
            {auditLogs.length} {auditLogs.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
      </div>

      {loading && auditLogs.length === 0 ? (
        <div className="audit-loading">Loading audit logs...</div>
      ) : (
        <div className="audit-console">
          <div className="console-header">
            <span className="console-prompt">$ audit.log</span>
          </div>
          <div className="console-content">
            {auditLogs.length === 0 ? (
              <div className="console-empty">
                No audit logs yet. Start by creating, updating, or deleting users.
              </div>
            ) : (
              auditLogs.map((log) => (
                <div key={log._id} className="console-line">
                  <span className="log-timestamp">[{formatTimestamp(log.timestamp)}]</span>
                  <span
                    className="log-action"
                    style={{ color: getActionColor(log.action) }}
                  >
                    [{getActionIcon(log.action)} {log.action}]
                  </span>
                  <span className="log-entity">{log.entityType}</span>
                  {log.userName && (
                    <span className="log-user">
                      User: <strong>{log.userName}</strong>
                    </span>
                  )}
                  {log.userEmail && (
                    <span className="log-email">({log.userEmail})</span>
                  )}
                  {log.details && (
                    <span className="log-details">
                      {log.action === 'CREATE' && log.details.status && (
                        <> - Status: {log.details.status}</>
                      )}
                      {log.action === 'UPDATE' && log.details.updatedFields && (
                        <> - Updated: {Object.keys(log.details.updatedFields).join(', ')}</>
                      )}
                      {log.action === 'DELETE' && (
                        <> - Deleted from system</>
                      )}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="audit-info">
        <h3>About the Audit Log</h3>
        <p>
          This console displays real-time audit logs of all user management activities.
          The log automatically refreshes every 2 seconds to show the latest entries.
        </p>
        <div className="legend">
          <h4>Action Types:</h4>
          <div className="legend-items">
            <div className="legend-item">
              <span style={{ color: '#4ade80' }}>[+] CREATE</span> - New user created
            </div>
            <div className="legend-item">
              <span style={{ color: '#60a5fa' }}>[~] UPDATE</span> - User information updated
            </div>
            <div className="legend-item">
              <span style={{ color: '#f87171' }}>[x] DELETE</span> - User removed from system
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audit;
