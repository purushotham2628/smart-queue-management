import { useState, useEffect } from 'react'

function AdminDashboard({ user, onLogout }) {
  const [queues, setQueues] = useState([])
  const [newQueueName, setNewQueueName] = useState('')

  useEffect(() => {
    fetchQueues()
  }, [])

  const fetchQueues = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/queues')
      if (response.ok) {
        const data = await response.json()
        setQueues(data)
      }
    } catch (error) {
      console.error('Error fetching queues:', error)
    }
  }

  const createQueue = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:3001/api/queues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newQueueName }),
      })
      
      if (response.ok) {
        setNewQueueName('')
        fetchQueues()
      }
    } catch (error) {
      console.error('Error creating queue:', error)
    }
  }

  const processNext = async (queueId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/process-next/${queueId}`, {
        method: 'POST'
      })
      
      if (response.ok) {
        fetchQueues()
      }
    } catch (error) {
      console.error('Error processing next:', error)
    }
  }

  return (
    <div className="admin-dashboard">
      <header>
        <h1>Admin Dashboard - {user.name}</h1>
        <button onClick={onLogout}>Logout</button>
      </header>

      <div className="create-queue">
        <h2>Create New Queue</h2>
        <form onSubmit={createQueue}>
          <input
            type="text"
            placeholder="Queue Name"
            value={newQueueName}
            onChange={(e) => setNewQueueName(e.target.value)}
            required
          />
          <button type="submit">Create Queue</button>
        </form>
      </div>

      <div className="manage-queues">
        <h2>Manage Queues</h2>
        {queues.map(queue => (
          <div key={queue.id} className="queue-management">
            <h3>{queue.name}</h3>
            <p>Current Length: {queue.current_length}</p>
            <p>Estimated Wait: {queue.estimated_wait} minutes</p>
            <button onClick={() => processNext(queue.id)}>Process Next</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard