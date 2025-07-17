import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Users, Clock, Settings, RefreshCw, UserCheck } from 'lucide-react';
import { queueAPI } from '../services/api';
import LoadingSpinner from './ui/LoadingSpinner';
import Toast from './ui/Toast';

function AdminDashboard({ user, onLogout }) {
  const [queues, setQueues] = useState([]);
  const [newQueueName, setNewQueueName] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchQueues();
    const interval = setInterval(fetchQueues, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchQueues = async () => {
    try {
      const response = await queueAPI.getQueues();
      setQueues(response.data);
    } catch (error) {
      console.error('Error fetching queues:', error);
      setToast({ message: 'Failed to fetch queues', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const createQueue = async (e) => {
    e.preventDefault();
    if (!newQueueName.trim()) return;

    setActionLoading(true);
    try {
      await queueAPI.createQueue({ name: newQueueName });
      setNewQueueName('');
      setToast({ message: 'Queue created successfully!', type: 'success' });
      fetchQueues();
    } catch (error) {
      setToast({ message: 'Failed to create queue', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const processNext = async (queueId, queueName) => {
    setActionLoading(true);
    try {
      await queueAPI.processNext(queueId);
      setToast({ message: `Processed next person in ${queueName}`, type: 'success' });
      fetchQueues();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to process next person';
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="dashboard">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">
              <Settings />
            </div>
            <div className="header-text">
              <h1>Admin Dashboard</h1>
              <p>Manage queues and operations</p>
            </div>
          </div>
          <div className="header-right">
            <span className="user-name">Welcome, {user.name}</span>
            <button onClick={onLogout} className="btn-secondary">
              <LogOut />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="create-queue-section">
          <div className="card">
            <h2 className="section-title">
              <Plus />
              <span>Create New Queue</span>
            </h2>
            <form onSubmit={createQueue} className="create-queue-form">
              <input
                type="text"
                placeholder="Enter queue name (e.g., Customer Service, Billing, etc.)"
                value={newQueueName}
                onChange={(e) => setNewQueueName(e.target.value)}
                className="input-field"
                required
              />
              <button
                type="submit"
                disabled={actionLoading}
                className="btn-primary"
              >
                {actionLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Plus />
                    <span>Create</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="queue-management-section">
          <div className="section-header">
            <h2>Queue Management</h2>
            <button onClick={fetchQueues} className="btn-secondary">
              <RefreshCw />
              <span>Refresh</span>
            </button>
          </div>

          {queues.length === 0 ? (
            <div className="empty-state">
              <Users />
              <h3>No Queues Created</h3>
              <p>Create your first queue to start managing customer flow.</p>
            </div>
          ) : (
            <div className="admin-queues-grid">
              {queues.map((queue) => (
                <div key={queue.id} className="admin-queue-card">
                  <div className="queue-header">
                    <h3>{queue.name}</h3>
                    <div className={`status-indicator ${queue.current_length > 0 ? 'warning' : 'success'}`}></div>
                  </div>

                  <div className="queue-stats-box">
                    <div className="stat-row">
                      <span>People in Queue:</span>
                      <strong className="stat-number">{queue.current_length}</strong>
                    </div>
                    <div className="stat-row">
                      <span>Total Wait Time:</span>
                      <strong>{queue.estimated_wait} minutes</strong>
                    </div>
                  </div>

                  <div className="queue-meta">
                    <Clock />
                    <span>Created: {new Date(queue.created_at).toLocaleDateString()}</span>
                  </div>

                  <button
                    onClick={() => processNext(queue.id, queue.name)}
                    disabled={actionLoading || queue.current_length === 0}
                    className={`btn-primary full-width ${queue.current_length === 0 ? 'disabled' : ''}`}
                  >
                    {actionLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <UserCheck />
                        <span>
                          {queue.current_length === 0 ? 'No One in Queue' : 'Process Next Person'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;