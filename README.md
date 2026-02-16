# Study Buddy

Study Buddy is a collaborative study platform that allows students to create and join study sessions, chat in real-time, and view session participants. This project is built with **React**, **Node.js**, **Express**, **Sequelize**, and **Socket.IO**.

## Features

- User authentication with JWT
- Create, join, and leave study sessions
- Real-time chat per session using Socket.IO
- Session dashboard with participants and chat (Discord-style layout)
- Search and filter sessions
- Responsive design

## Tech Stack

- Frontend: React, React Router
- Backend: Node.js, Express
- Database: MySQL (via Sequelize ORM)
- Real-time: Socket.IO
- Authentication: JWT

## Getting Started

### Prerequisites

- Node.js (>=18)
- npm or yarn
- MySQL database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/study-buddy.git
cd study-buddy
```

2. Install dependencies:

```bash
npm install
```

3. Configure your database in backend/config/db.js and create a .env file for sensitive credentials:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=studybuddy
JWT_SECRET=your_secret_key
```

### Running the Project

Backend:

```bash
cd backend
npm start
```

Frontend:

```bash
cd frontend
npm start
```

### Project Structure

```bash
study-buddy/
├─ backend/
│  ├─ controllers/
│  ├─ models/
│  ├─ routes/
│  ├─ config/
│  └─ server.js
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ api/
│  │  └─ App.js
│  └─ package.json
├─ .gitignore
└─ README.md
```
