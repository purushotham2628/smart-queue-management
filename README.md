# 🏥 Smart Queue Management System

<div align="center">
  <img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Queue Management" width="600" style="border-radius: 10px; margin: 20px 0;">
  
  [![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-Latest-green.svg)](https://nodejs.org/)
  [![Express](https://img.shields.io/badge/Express-4.21.2-lightgrey.svg)](https://expressjs.com/)
  [![SQLite](https://img.shields.io/badge/SQLite-3-blue.svg)](https://sqlite.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
</div>

---

## 🌟 Overview

A **modern, responsive web-based queue management system** designed to revolutionize customer service efficiency in clinics, banks, government offices, and public service centers. Built with cutting-edge technologies and featuring a beautiful, intuitive user interface.

### ✨ Key Highlights

- 🎯 **Real-time Queue Tracking** - Live updates every 3-5 seconds
- 🔐 **Secure Authentication** - bcrypt password hashing
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Lightning Fast** - Built with Vite for optimal performance
- 🎨 **Modern UI/UX** - Tailwind CSS with custom animations
- 🔄 **Auto-refresh** - Real-time data synchronization

---

## 🚀 Features

### 👥 **User Management**
- ✅ **Dual Role System** - Customer & Admin accounts
- ✅ **Secure Registration & Login** - Email validation & password encryption
- ✅ **Profile Management** - User-specific dashboards

### 🎫 **Queue Operations**
- ✅ **Smart Token Generation** - Automatic position assignment
- ✅ **Real-time Position Tracking** - Live queue updates
- ✅ **Intelligent Wait Time Estimation** - Dynamic calculations
- ✅ **One-click Join/Leave** - Seamless queue management

### 🧑‍💼 **Admin Controls**
- ✅ **Queue Creation & Management** - Unlimited queue support
- ✅ **Process Next Customer** - Efficient queue processing
- ✅ **Live Dashboard** - Real-time monitoring
- ✅ **Analytics Overview** - Queue length & wait times

### 🎨 **User Experience**
- ✅ **Beautiful Animations** - Smooth transitions & micro-interactions
- ✅ **Toast Notifications** - Real-time feedback
- ✅ **Loading States** - Professional loading indicators
- ✅ **Error Handling** - Graceful error management

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| ⚛️ **React.js** | 18.3.1 | UI Framework |
| ⚡ **Vite** | 5.4.19 | Build Tool |
| 🎨 **Tailwind CSS** | Latest | Styling |
| 🔗 **Axios** | Latest | HTTP Client |
| 🎯 **Lucide React** | Latest | Icons |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| 🌐 **Node.js** | Latest | Runtime |
| 🚀 **Express.js** | 4.21.2 | Web Framework |
| 🗂️ **SQLite3** | 5.1.7 | Database |
| 🔐 **bcrypt** | 5.1.1 | Password Hashing |
| 🌍 **CORS** | 2.8.5 | Cross-Origin Support |

</div>

---

## 📁 Project Architecture

```
smart-queue-management/
├── 📂 backend/                    # Server-side application
│   ├── 📄 server.js              # Express server & API routes
│   ├── 📄 package.json           # Backend dependencies
│   └── 🗃️ queue_system.db        # SQLite database
│
├── 📂 src/                       # Frontend application
│   ├── 📂 components/            # React components
│   │   ├── 📂 ui/               # Reusable UI components
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── Toast.jsx
│   │   ├── Login.jsx            # Authentication
│   │   ├── Register.jsx         # User registration
│   │   ├── Dashboard.jsx        # Customer dashboard
│   │   └── AdminDashboard.jsx   # Admin panel
│   ├── 📂 services/             # API services
│   │   └── api.js               # Axios configuration
│   ├── 📄 App.jsx               # Root component
│   ├── 📄 main.jsx              # App entry point
│   └── 🎨 index.css             # Global styles
│
├── 📄 package.json               # Project dependencies
├── 📄 tailwind.config.js         # Tailwind configuration
├── 📄 vite.config.js             # Vite configuration
└── 📄 README.md                  # Project documentation
```

---

## ⚙️ Quick Start

### 🔧 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**

### 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/purushotham2628/smart-queue-management.git
   cd smart-queue-management
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - 🌐 **Frontend**: [http://localhost:3000](http://localhost:3000)
   - 🔧 **Backend API**: [http://localhost:3001](http://localhost:3001)

### 🎯 Alternative Setup

**Backend Only:**
```bash
cd backend
npm install
npm run dev
```

**Frontend Only:**
```bash
npm install
npm run dev:frontend
```

---

## 📱 Screenshots & Demo

<div align="center">

### 🔐 Authentication
<img src="https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Login Interface" width="400" style="border-radius: 8px; margin: 10px;">

### 👥 Customer Dashboard
<img src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Customer Dashboard" width="400" style="border-radius: 8px; margin: 10px;">

### 🧑‍💼 Admin Panel
<img src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Admin Dashboard" width="400" style="border-radius: 8px; margin: 10px;">

</div>

---

## 🔌 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/register` | User registration |
| `POST` | `/api/login` | User authentication |

### 🎫 Queue Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/queues` | Get all queues |
| `POST` | `/api/queues` | Create new queue |
| `POST` | `/api/join-queue` | Join a queue |
| `DELETE` | `/api/leave-queue/:userId` | Leave queue |
| `GET` | `/api/user-queue/:userId` | Get user's queue status |
| `POST` | `/api/process-next/:queueId` | Process next in queue |

---

## 🎨 Design Features

### 🌈 Color Palette
- **Primary**: Blue gradient (`#3b82f6` to `#1e40af`)
- **Success**: Green (`#22c55e`)
- **Warning**: Amber (`#f59e0b`)
- **Error**: Red (`#ef4444`)

### ✨ Animations
- **Fade In**: Smooth component mounting
- **Slide Up**: Content reveal animations
- **Pulse**: Live status indicators
- **Hover Effects**: Interactive feedback

### 📱 Responsive Breakpoints
- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`

---

## 🔧 Configuration

### 🌐 Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=Smart Queue Management
```

### ⚙️ Database Schema

```sql
-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'customer'
);

-- Queues table
CREATE TABLE queues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Queue entries table
CREATE TABLE queue_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  queue_id INTEGER,
  position INTEGER,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (queue_id) REFERENCES queues (id)
);
```

---

## 🚀 Deployment

### 🌐 Frontend Deployment (Netlify/Vercel)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder**

### 🔧 Backend Deployment (Heroku/Railway)

1. **Add start script to backend/package.json**
   ```json
   {
     "scripts": {
       "start": "node server.js"
     }
   }
   ```

2. **Deploy with your preferred platform**

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **🍴 Fork the repository**
2. **🌿 Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **💾 Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **📤 Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **🔄 Open a Pull Request**

### 📋 Development Guidelines

- Follow **React best practices**
- Use **Tailwind CSS** for styling
- Write **clean, commented code**
- Test your changes thoroughly
- Update documentation as needed

---

## 🐛 Troubleshooting

### Common Issues

**❌ Backend connection failed**
```bash
# Check if backend is running
cd backend && npm run dev
```

**❌ Database errors**
```bash
# Delete and recreate database
rm backend/queue_system.db
# Restart backend server
```

**❌ Frontend build issues**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📈 Future Enhancements

- 🔔 **Push Notifications** - Real-time alerts
- 📊 **Analytics Dashboard** - Detailed insights
- 🌍 **Multi-language Support** - Internationalization
- 📱 **Mobile App** - React Native version
- 🔗 **API Integration** - Third-party services
- 🎯 **Queue Priorities** - VIP queue management

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

<div align="center">

**Purushotham E**

[![GitHub](https://img.shields.io/badge/GitHub-purushotham2628-black?style=for-the-badge&logo=github)](https://github.com/purushotham2628)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/purushotham2628)
[![Email](https://img.shields.io/badge/Email-Contact-red?style=for-the-badge&logo=gmail)](mailto:purushotham2628@gmail.com)

</div>

---

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the beautiful icons
- **Pexels** - For the stunning stock photos
- **Open Source Community** - For inspiration and support

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

**Made with ❤️ by [Purushotham E](https://github.com/purushotham2628)**

</div>