import { useState, useEffect } from 'react'

function Dashboard({ user, onLogout }) {
  const [queues, setQueues] = useState([])
  const [userQueue, setUserQueue] = useState(null)

  useEffect(() => {
    fetchQueues()
    fetchUserQueue()
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

  const fetchUserQueue = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/user-queue/${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setUserQueue(data)
      }
    } catch (error) {
      console.error('Error fetching user queue:', error)
    }
  }

  const joinQueue = async (queueId) => {
    try {
      const response = await fetch('http://localhost:3001/api/join-queue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          queueId: queueId
        }),
      })
      
      if (response.ok) {
        fetchUserQueue()
        fetchQueues()
      }
    } catch (error) {
      console.error('Error joining queue:', error)
    }
  }

  const leaveQueue = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/leave-queue/${user.id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setUserQueue(null)
        fetchQueues()
      }
    } catch (error) {
      console.error('Error leaving queue:', error)
    }
  }

  return (
    <div className="dashboard">
      <header>
        <h1>Welcome, {user.name}</h1>
        <button onClick={onLogout}>Logout</button>
      </header>

      {userQueue ? (
        <div className="current-queue">
          <h2>Your Current Queue</h2>
          <p>Queue: {userQueue.queue_name}</p>
          <p>Position: {userQueue.position}</p>
          <p>Estimated Wait: {userQueue.estimated_wait} minutes</p>
          <button onClick={leaveQueue}>Leave Queue</button>
        </div>
      ) : (
        <div className="available-queues">
          <h2>Available Queues</h2>
          {queues.map(queue => (
            <div key={queue.id} className="queue-card">
              <h3>{queue.name}</h3>
              <p>Current Length: {queue.current_length}</p>
              <p>Estimated Wait: {queue.estimated_wait} minutes</p>
              <button onClick={() => joinQueue(queue.id)}>Join Queue</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard