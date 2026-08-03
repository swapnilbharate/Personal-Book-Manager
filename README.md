# 📚 Personal Book Manager

> A production-ready, elegantly designed SaaS application for managing your personal library. Built with the MERN stack and Next.js 15 App Router.

![Personal Book Manager Preview](https://via.placeholder.com/1200x600.png?text=Personal+Book+Manager+-+Premium+SaaS)

## ✨ Project Overview

The Personal Book Manager is a full-stack web application designed to help readers curate, track, and manage their book collections. Moving beyond a simple CRUD app, it features a premium glassmorphism UI, comprehensive dashboard analytics, secure JWT authentication, and advanced book filtering. 

Built strictly following industry standards, clean architecture, and modern React patterns.

## 🚀 Key Features

### 🔒 Secure Authentication
- JWT-based authentication (HttpOnly Cookies for production)
- Password hashing with `bcrypt`
- Protected routes using Next.js AuthContext & Higher-Order concepts
- Rate limiting and XSS protection with `helmet`

### 📖 Advanced Book Management (CRUD+)
- **Add/Edit/Delete** books with rich metadata (Title, Author, Cover URL, Genre, Tags).
- **Track Reading Status**: Want to Read, Reading, Completed.
- **Rating System**: 1-5 stars.
- **Favorites**: Mark books as favorites.
- **Rich Notes**: Save thoughts and reviews for each book.

### 📊 Premium Dashboard
- **Analytics**: Visualize your reading habits with beautifully animated `recharts`.
- **Top Genres**: See your most read genres via Bar Charts.
- **Status Distribution**: Interactive Pie Charts for reading statuses.
- **Stats Cards**: Quickly view total books, books added this month, and currently reading.

### 🎨 Stunning UI/UX
- **Glassmorphism Design**: Translucent elements, animated gradients, and soft shadows.
- **Dark/Light Mode**: Full theme toggle with local storage persistence.
- **Responsive**: Flawless experience on Mobile, Tablet, and Desktop.
- **Micro-interactions**: Smooth hover effects and page transitions powered by `framer-motion`.
- **Toast Notifications**: Contextual success/error alerts.

## 🛠️ Technology Stack

**Frontend**
- Next.js 15 (App Router, React 19)
- Tailwind CSS (v4)
- Framer Motion (Animations)
- React Hook Form (Form state & validation)
- Recharts (Data visualization)
- Axios (API Client)
- Lucide React (Icons)

**Backend**
- Node.js & Express.js
- MongoDB & Mongoose ODM
- JSON Web Tokens (JWT)
- express-validator (Input validation)
- bcrypt (Cryptography)
- CORS, Helmet, express-rate-limit

## 📂 Folder Structure

```text
Personal-Book-Manager/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route logic (Auth, Books)
│   ├── middleware/      # Auth guard, Error handler
│   ├── models/          # Mongoose Schemas
│   ├── routes/          # Express API Routes
│   ├── utils/           # JWT generation
│   ├── .env             # Environment variables
│   └── server.js        # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── app/         # Next.js App Router (Pages & Layouts)
│   │   ├── components/  # Reusable UI & Feature components
│   │   ├── context/     # Auth & Theme Providers
│   │   ├── lib/         # Axios config & Tailwind utils
│   │   └── ...
│   ├── tailwind.config.ts
│   └── package.json
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or Atlas URI)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/personal-book-manager.git
cd personal-book-manager
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/book_manager_dev
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=30d
COOKIE_EXPIRES_IN=30
FRONTEND_URL=http://localhost:3000
```
Start the backend server:
```bash
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
# Open a new terminal
cd frontend
npm install
```
Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```
Start the frontend development server:
```bash
npm run dev
# Client runs on http://localhost:3000
```

## 🌐 API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/v1/auth/register` | Register new user | Public |
| POST | `/api/v1/auth/login` | Authenticate user | Public |
| POST | `/api/v1/auth/logout` | Clear cookie/token | Private |
| GET | `/api/v1/auth/me` | Get current user | Private |
| GET | `/api/v1/books` | Get all books (with filters) | Private |
| POST | `/api/v1/books` | Create new book | Private |
| PUT | `/api/v1/books/:id` | Update book | Private |
| DELETE | `/api/v1/books/:id` | Delete book | Private |
| GET | `/api/v1/books/stats/dashboard`| Get dashboard analytics | Private |

## 🚀 Deployment Guide

### Backend (Render / Heroku)
1. Push your code to GitHub.
2. Create a new Web Service on Render.
3. Connect your repository and set the Root Directory to `backend`.
4. Set Build Command: `npm install` and Start Command: `node server.js`.
5. Add Environment Variables (MONGO_URI from MongoDB Atlas, JWT_SECRET, etc.).

### Frontend (Vercel)
1. Import your GitHub repository into Vercel.
2. Set the Root Directory to `frontend`.
3. Vercel will automatically detect Next.js settings.
4. Add Environment Variable `NEXT_PUBLIC_API_URL` pointing to your deployed backend URL.
5. Click Deploy.

## 🔮 Future Enhancements
- Export Book List as PDF and CSV.
- Import Books via JSON/CSV.
- Social features: Share your reading list with friends.
- Google Books API integration to auto-fetch covers and descriptions via ISBN.

---
Built with ❤️ for readers.
