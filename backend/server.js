import express from 'express'
import cors from 'cors'
import sqlite3 from 'sqlite3'
import bcrypt from 'bcrypt'

const app = express()
const port = 3001

// Middleware
app.use(cors())
app.use(express.json())

// SQLite database
const db = new sqlite3.Database('queue_system.db')

// Table Initialization
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'customer'
  )`)

  db.run(`CREATE TABLE IF NOT EXISTS queues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)

  db.run(`CREATE TABLE IF NOT EXISTS queue_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    queue_id INTEGER,
    position INTEGER,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (queue_id) REFERENCES queues (id)
  )`)
})

// REGISTER
app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body
  console.log("Register attempt:", req.body)

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required." })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed: users.email')) {
            return res.status(400).json({ error: 'Email already registered.' })
          } else {
            console.error('DB Error:', err.message)
            return res.status(400).json({ error: 'Database error. Try again.' })
          }
        }
        return res.json({ id: this.lastID, name, email, role })
      }
    )
  } catch (error) {
    console.error("Registration Error:", error.message)
    res.status(500).json({ error: 'Server error. Please try again later.' })
  }
})

// LOGIN
app.post('/api/login', (req, res) => {
  const { email, password } = req.body

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (validPassword) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      })
    } else {
      res.status(400).json({ error: 'Invalid credentials' })
    }
  })
})

// GET ALL QUEUES
app.get('/api/queues', (req, res) => {
  db.all(`
    SELECT q.*, 
           COUNT(qe.id) AS current_length,
           COUNT(qe.id) * 5 AS estimated_wait
    FROM queues q
    LEFT JOIN queue_entries qe ON q.id = qe.queue_id
    GROUP BY q.id
  `, (err, queues) => {
    if (err) return res.status(500).json({ error: 'Server error' })
    res.json(queues)
  })
})

// CREATE QUEUE
app.post('/api/queues', (req, res) => {
  const { name } = req.body

  db.run('INSERT INTO queues (name) VALUES (?)', [name], function (err) {
    if (err) return res.status(500).json({ error: 'Server error' })
    res.json({ id: this.lastID, name })
  })
})

// JOIN QUEUE
app.post('/api/join-queue', (req, res) => {
  const { userId, queueId } = req.body

  db.get('SELECT * FROM queue_entries WHERE user_id = ?', [userId], (err, existingEntry) => {
    if (existingEntry) {
      return res.status(400).json({ error: 'Already in a queue' })
    }

    db.get('SELECT MAX(position) AS max_position FROM queue_entries WHERE queue_id = ?', [queueId], (err, result) => {
      const nextPosition = (result?.max_position || 0) + 1

      db.run('INSERT INTO queue_entries (user_id, queue_id, position) VALUES (?, ?, ?)',
        [userId, queueId, nextPosition], function (err) {
          if (err) return res.status(500).json({ error: 'Server error' })
          res.json({ success: true })
        }
      )
    })
  })
})

// GET USER QUEUE STATUS
app.get('/api/user-queue/:userId', (req, res) => {
  const { userId } = req.params

  db.get(`
    SELECT qe.*, q.name AS queue_name, qe.position * 5 AS estimated_wait
    FROM queue_entries qe
    JOIN queues q ON qe.queue_id = q.id
    WHERE qe.user_id = ?
  `, [userId], (err, entry) => {
    if (err) return res.status(500).json({ error: 'Server error' })
    res.json(entry)
  })
})

// LEAVE QUEUE
app.delete('/api/leave-queue/:userId', (req, res) => {
  const { userId } = req.params

  db.run('DELETE FROM queue_entries WHERE user_id = ?', [userId], function (err) {
    if (err) return res.status(500).json({ error: 'Server error' })
    res.json({ success: true })
  })
})

// PROCESS NEXT USER IN QUEUE
app.post('/api/process-next/:queueId', (req, res) => {
  const { queueId } = req.params

  db.get('SELECT * FROM queue_entries WHERE queue_id = ? ORDER BY position LIMIT 1',
    [queueId], (err, entry) => {
      if (err || !entry) return res.status(400).json({ error: 'No one in queue' })

      db.run('DELETE FROM queue_entries WHERE id = ?', [entry.id], (err) => {
        if (err) return res.status(500).json({ error: 'Server error' })

        db.run(
          'UPDATE queue_entries SET position = position - 1 WHERE queue_id = ? AND position > ?',
          [queueId, entry.position],
          (err) => {
            if (err) return res.status(500).json({ error: 'Server error' })
            res.json({ success: true })
          }
        )
      })
    })
})

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`)
})
