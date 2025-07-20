# -LearnHub-Your-Center-for-Skill-Enhancement-
Empower your learning journey with **LearnHub** — a modern, full-stack platform for students, teachers, and administrators to connect, create, and grow. Seamlessly manage courses, enrollments, and educational content in one place.

## Table of Contents
- [🗂️ Project Structure](#project-structure)
- [🚀 Features](#features)
- [🛠️ Technologies Used](#technologies-used)
- [⚡ Getting Started](#getting-started)
- [📁 Folder Details](#folder-details)
- [🤝 Contributing](#contributing)
- [📄 License](#license)

## 🗂️ Project Structure

```text
LearnHub/
├── backend/         # Node.js/Express API and database logic
│   ├── config/           # MongoDB connection setup
│   ├── controllers/      # Business logic for users, admins, courses
│   ├── middlewares/      # Authentication and request validation
│   ├── routers/          # API route definitions
│   ├── schemas/          # Mongoose models (User, Course, etc.)
│   ├── uploads/          # Uploaded course content (e.g., videos)
│   ├── index.js          # Main server entry point
│   └── package.json      # Backend dependencies
├── frontend/        # React client app
│   ├── public/           # Static assets
│   ├── src/              # React source code
│   │   ├── components/   # UI components (admin, user, common)
│   │   ├── assets/       # Images and static files
│   │   ├── App.jsx       # Main React app
│   │   └── main.jsx      # React entry point
│   ├── index.html        # HTML template
│   ├── package.json      # Frontend dependencies
│   └── vite.config.js    # Vite configuration
```

## 🚀 Features

- **User Authentication:** Secure login/registration for students, teachers, and admins
- **Admin Panel:** Manage users, courses, and platform settings
- **Teacher Dashboard:** Add, edit, and manage courses and content
- **Student Dashboard:** Enroll in courses, view content, and track progress
- **Course Management:** Create, update, and delete courses and sections
- **Media Uploads:** Upload and stream course videos

## 🛠️ Technologies Used

### Backend
- express
- cors
- bcryptjs
- dotenv
- mongoose
- multer
- nodemon
- jsonwebtoken

### Frontend
- React
- Bootstrap
- Material UI
- Axios
- Antd
- mdb-react-ui-kit
- react-bootstrap

## ⚡ Getting Started

### Prerequisites
- Node.js (v16 or above)
- MongoDB

### Installation of required tools

#### Backend
```sh
cd backend
npm install
```

#### Frontend
```sh
cd frontend
npm install
```

### Running the Application

1. **Start the backend server:**
   ```sh
   cd backend
   npm start
   ```
2. **Start the frontend development server:**
   ```sh
   cd frontend
   npm run dev
   ```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5000](http://localhost:5000) (default)

## 📁 Folder Details

- `backend/config/` – MongoDB connection setup
- `backend/controllers/` – Handles business logic for users, admins, and courses
- `backend/middlewares/` – Authentication and request validation
- `backend/routers/` – Express route definitions
- `backend/schemas/` – Mongoose models for MongoDB collections
- `backend/uploads/` – Uploaded files (e.g., course videos)
- `frontend/src/components/` – React components for admin, user, and common features
- `frontend/src/assets/` – Images and static assets

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License.
