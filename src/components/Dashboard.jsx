import React, { useState, useEffect } from 'react';
import { LogOut, Users, Clock, MapPin, RefreshCw, UserMinus } from 'lucide-react';
import { queueAPI } from '../services/api';
import LoadingSpinner from './ui/LoadingSpinner';
import Toast from './ui/Toast';

function Dashboard({ user, onLogout }) {
  const [queues, setQueues] = useState([]);
  const [userQueue, setUserQueue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [user.id]);

  const fetchData = async () => {
    try {
      const [queuesResponse, userQueueResponse] = await Promise.all([
        queueAPI.getQueues(),
        queueAPI.getUserQueue(user.id)
      ]);
      
      setQueues(queuesResponse.data);
      setUserQueue(userQueueResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status !== 404) {
        setToast({ message: 'Failed to fetch data', type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  const joinQueue = async (queueId) => {
    setActionLoading(true);
    try {
      await queueAPI.joinQueue({ userId: user.id, queueId });
      setToast({ message: 'Successfully joined the queue!', type: 'success' });
      fetchData();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to join queue';
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const leaveQueue = async () => {
    setActionLoading(true);
    try {
      await queueAPI.leaveQueue(user.id);
      setToast({ message: 'Successfully left the queue', type: 'success' });
      setUserQueue(null);
      fetchData();
    } catch (error) {
      setToast({ message: 'Failed to leave queue', type: 'error' });
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
              <Users />
            </div>
            <div className="header-text">
              <h1>Queue Dashboard</h1>
              <p>Welcome back, {user.name}</p>
            </div>
          </div>
          <button onClick={onLogout} className="btn-secondary">
            <LogOut />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {userQueue ? (
          <div className="current-queue-section">
            <h2>Your Current Queue</h2>
            <div className="current-queue-card">
              <div className="queue-info">
                <h3>{userQueue.queue_name}</h3>
                <div className="queue-stats">
                  <div className="stat-item">
                    <MapPin />
                    <span>Position: <strong>#{userQueue.position}</strong></span>
                  </div>
                  <div className="stat-item">
                    <Clock />
                    <span>Est. Wait: <strong>{userQueue.estimated_wait} min</strong></span>
                  </div>
                </div>
              </div>
              <button
                onClick={leaveQueue}
                disabled={actionLoading}
                className="btn-danger"
              >
                {actionLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <UserMinus />
                    <span>Leave Queue</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="available-queues-section">
            <div className="section-header">
              <h2>Available Queues</h2>
              <button onClick={fetchData} className="btn-secondary">
                <RefreshCw />
                <span>Refresh</span>
              </button>
            </div>

            {queues.length === 0 ? (
              <div className="empty-state">
                <Users />
                <h3>No Queues Available</h3>
                <p>There are currently no active queues. Please check back later.</p>
              </div>
            ) : (
              <div className="queues-grid">
                {queues.map((queue) => (
                  <div key={queue.id} className="queue-card">
                    <div className="queue-header">
                      <h3>{queue.name}</h3>
                      <div className="status-indicator active"></div>
                    </div>
                    
                    <div className="queue-details">
                      <div className="detail-row">
                        <span>Queue Length:</span>
                        <strong>{queue.current_length} people</strong>
                      </div>
                      <div className="detail-row">
                        <span>Est. Wait Time:</span>
                        <strong>{queue.estimated_wait} min</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => joinQueue(queue.id)}
                      disabled={actionLoading}
                      className="btn-primary full-width"
                    >
                      {actionLoading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <Users />
                          <span>Join Queue</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;