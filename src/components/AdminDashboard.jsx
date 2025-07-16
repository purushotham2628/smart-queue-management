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
    const interval = setInterval(fetchQueues, 3000); // Refresh every 3 seconds
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
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Manage queues and operations</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <button
                onClick={onLogout}
                className="btn-secondary flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Queue Section */}
        <div className="mb-8 animate-slide-up">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Create New Queue</span>
            </h2>
            <form onSubmit={createQueue} className="flex space-x-4">
              <input
                type="text"
                placeholder="Enter queue name (e.g., Customer Service, Billing, etc.)"
                value={newQueueName}
                onChange={(e) => setNewQueueName(e.target.value)}
                className="input-field flex-1"
                required
              />
              <button
                type="submit"
                disabled={actionLoading}
                className="btn-primary flex items-center space-x-2 px-6"
              >
                {actionLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Create</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Queue Management Section */}
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Queue Management</h2>
            <button
              onClick={fetchQueues}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>

          {queues.length === 0 ? (
            <div className="card text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Queues Created</h3>
              <p className="text-gray-500">Create your first queue to start managing customer flow.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {queues.map((queue) => (
                <div key={queue.id} className="card hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{queue.name}</h3>
                    <div className={`h-3 w-3 rounded-full ${queue.current_length > 0 ? 'bg-warning-400 animate-pulse-slow' : 'bg-success-400'}`}></div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">People in Queue:</span>
                        <span className="text-lg font-bold text-gray-900">{queue.current_length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Wait Time:</span>
                        <span className="text-sm font-semibold text-gray-700">{queue.estimated_wait} minutes</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>Created: {new Date(queue.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => processNext(queue.id, queue.name)}
                    disabled={actionLoading || queue.current_length === 0}
                    className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                      queue.current_length === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'btn-primary'
                    }`}
                  >
                    {actionLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <UserCheck className="h-4 w-4" />
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