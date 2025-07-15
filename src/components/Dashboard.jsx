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
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Queue Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="btn-secondary flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userQueue ? (
          /* Current Queue Status */
          <div className="mb-8 animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Current Queue</h2>
            <div className="card bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-primary-900 mb-2">
                    {userQueue.queue_name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-primary-600" />
                      <span className="text-primary-800">
                        Position: <span className="font-semibold">#{userQueue.position}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-primary-600" />
                      <span className="text-primary-800">
                        Est. Wait: <span className="font-semibold">{userQueue.estimated_wait} min</span>
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={leaveQueue}
                  disabled={actionLoading}
                  className="btn-danger flex items-center space-x-2"
                >
                  {actionLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <UserMinus className="h-4 w-4" />
                      <span>Leave Queue</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Available Queues */
          <div className="animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Available Queues</h2>
              <button
                onClick={fetchData}
                className="btn-secondary flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>

            {queues.length === 0 ? (
              <div className="card text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Queues Available</h3>
                <p className="text-gray-500">There are currently no active queues. Please check back later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {queues.map((queue) => (
                  <div key={queue.id} className="card hover:shadow-lg transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{queue.name}</h3>
                      <div className="h-3 w-3 bg-success-400 rounded-full animate-pulse-slow"></div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Queue Length:</span>
                        <span className="font-semibold text-gray-900">{queue.current_length} people</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Est. Wait Time:</span>
                        <span className="font-semibold text-gray-900">{queue.estimated_wait} min</span>
                      </div>
                    </div>

                    <button
                      onClick={() => joinQueue(queue.id)}
                      disabled={actionLoading}
                      className="w-full btn-primary flex items-center justify-center space-x-2"
                    >
                      {actionLoading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <Users className="h-4 w-4" />
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