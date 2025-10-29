# AI Text Summarizer - MERN Stack Application

A full-stack AI-powered text summarization application built with MongoDB, Express.js, React, and Node.js (MERN). Features include real-time AI summarization, Redis caching, BullMQ job queues, and comprehensive deployment configurations.

## 🚀 Features

### Core Functionality
- **AI-Powered Summarization**: Generate concise summaries using OpenRouter AI API
- **Multiple Summary Styles**: Concise, Detailed, Bullet Points, Executive Summary
- **Redis Caching**: Fast response times with 24-hour cache TTL
- **Async Job Queue**: BullMQ-powered background processing for large texts
- **History Management**: View, search, filter, and paginate past summaries
- **User Authentication**: JWT-based secure authentication system
- **Real-time Statistics**: Track word counts, compression ratios, and usage stats

### Technical Features
- **Protected Routes**: React Context-based authentication
- **API Interceptors**: Automatic token attachment and error handling
- **Toast Notifications**: User-friendly feedback system
- **Loading Skeletons**: Enhanced UX with loading states
- **Mobile Responsive**: Tailwind CSS responsive design
- **Docker Support**: Full containerization with docker-compose
- **Nginx Reverse Proxy**: Production-ready configuration

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Environment Variables](#environment-variables)
4. [Running Locally](#running-locally)
5. [Docker Deployment](#docker-deployment)
6. [API Documentation](#api-documentation)
7. [Deployment](#deployment)
8. [Project Structure](#project-structure)

---

## 🔧 Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (v7.0 or higher) or MongoDB Atlas account
- **Redis** (v7 or higher) - Optional for caching
- **Docker & Docker Compose** (for containerized deployment)
- **OpenRouter API Key** - Get from [openrouter.ai](https://openrouter.ai)

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd tasks-main
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## 🔐 Environment Variables

### Backend (.env)

Create `backend/.env` file:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# AI Service
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
SITE_URL=http://localhost:5173
SITE_NAME=SummarizerApp

# Redis (Optional - for caching and job queue)
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Frontend (.env)

Create `frontend/.env` file:

```env
VITE_BACKEND_URL=http://localhost:8080
```

---

## 🏃 Running Locally

### Option 1: Without Docker

#### Start Backend

```bash
cd backend
npm start
```

Backend runs on `http://localhost:8080`

#### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`

#### Start Redis (Optional)

```bash
# Windows (with Redis installed)
redis-server

# macOS/Linux
redis-server
```

### Option 2: With Docker

```bash
# From project root
docker-compose up --build
```

Access the application:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

---

## 🐳 Docker Deployment

### Build and Run

```bash
# Build all services
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Individual Service Management

```bash
# Restart specific service
docker-compose restart backend

# View service logs
docker-compose logs backend

# Execute commands in container
docker-compose exec backend sh
```

---

## 📚 API Documentation

### Authentication Endpoints

#### POST /auth/signup
Register a new user

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Signup successful",
  "token": "jwt_token_here",
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### POST /auth/login
Login existing user

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Summary Endpoints

All summary endpoints require `Authorization: Bearer <token>` header.

#### POST /summaries/generate
Generate AI summary (synchronous with caching)

**Request Body:**
```json
{
  "text": "Your long text here...",
  "maxLength": 200,
  "style": "concise"
}
```

**Response:**
```json
{
  "success": true,
  "summary": "Generated summary text...",
  "statistics": {
    "originalWords": 500,
    "summaryWords": 100,
    "compressionRatio": "20.00"
  },
  "cached": false
}
```

#### POST /summaries/queue
Queue async summarization job

**Request Body:**
```json
{
  "text": "Your long text here...",
  "maxLength": 200,
  "style": "concise",
  "title": "My Summary"
}
```

**Response:**
```json
{
  "success": true,
  "jobId": "job_id_here",
  "message": "Summarization job queued"
}
```

#### GET /summaries/job/:jobId
Get job status

**Response:**
```json
{
  "success": true,
  "jobId": "job_id_here",
  "state": "completed",
  "progress": 100,
  "result": {
    "summaryId": "summary_id",
    "summary": "Generated summary..."
  }
}
```

#### POST /summaries
Create and save summary

**Request Body:**
```json
{
  "title": "My Summary",
  "originalText": "Original text...",
  "summarizedText": "Summary text...",
  "useAI": false
}
```

#### GET /summaries
Get all user summaries

**Response:**
```json
{
  "success": true,
  "count": 10,
  "summaries": [...]
}
```

#### GET /summaries/stats
Get user statistics

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalSummaries": 25,
    "totalOriginalWords": 12500,
    "totalSummaryWords": 2500,
    "avgCompressionRatio": 20.00
  }
}
```

#### GET /summaries/:id
Get single summary

#### PUT /summaries/:id
Update summary

#### DELETE /summaries/:id
Delete summary

---

## 🚀 Deployment

### Backend Deployment (Render)

1. **Create New Web Service** on Render
2. **Connect Repository**
3. **Configure Build Settings:**
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty or set to `backend`

4. **Add Environment Variables:**
   - `PORT`: 8080
   - `NODE_ENV`: production
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Strong secret key
   - `OPENROUTER_API_KEY`: Your API key
   - `REDIS_URL`: Redis Cloud URL (optional)
   - `SITE_URL`: Your frontend URL
   - `SITE_NAME`: Your app name

5. **Deploy**

### Frontend Deployment (Vercel)

1. **Install Vercel CLI** (optional):
```bash
npm install -g vercel
```

2. **Deploy via Vercel Dashboard:**
   - Import Git Repository
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Add Environment Variables:**
   - `VITE_BACKEND_URL`: Your backend URL from Render

4. **Deploy**

### MongoDB Atlas Setup

1. Create cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist IP addresses (0.0.0.0/0 for all)
4. Get connection string
5. Replace `<password>` and `<dbname>` in connection string

### Redis Cloud Setup (Optional)

1. Create free account at [redis.com/try-free](https://redis.com/try-free)
2. Create database
3. Get connection URL
4. Add to `REDIS_URL` environment variable

---

## 📁 Project Structure

```
tasks-main/
├── backend/
│   ├── Controllers/
│   │   ├── AuthController.js
│   │   └── SummaryController.js
│   ├── Middlewares/
│   │   └── Auth.js
│   ├── Models/
│   │   ├── User.js
│   │   ├── Summary.js
│   │   └── db.js
│   ├── Routes/
│   │   ├── AuthRouter.js
│   │   └── SummaryRouter.js
│   ├── Services/
│   │   ├── aiService.js
│   │   ├── redisClient.js
│   │   └── queueService.js
│   ├── .env
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   ├── Navigation.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SummaryContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Summarize.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
└── README.md
```

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong JWT secrets** in production
3. **Enable CORS** only for trusted origins
4. **Validate all inputs** on both frontend and backend
5. **Use HTTPS** in production
6. **Rotate API keys** regularly
7. **Implement rate limiting** for API endpoints
8. **Keep dependencies updated**

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### End-to-End Tests

```bash
npm run test:e2e
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Verify connection string format
- Check IP whitelist in MongoDB Atlas
- Ensure network access is configured

### Redis Connection Issues

- Verify Redis is running: `redis-cli ping`
- Check Redis URL format
- Application works without Redis (caching disabled)

### Docker Issues

- Clear Docker cache: `docker system prune -a`
- Rebuild without cache: `docker-compose build --no-cache`
- Check logs: `docker-compose logs -f`

### CORS Errors

- Verify `SITE_URL` in backend `.env`
- Check allowed origins in `backend/index.js`
- Ensure frontend URL is whitelisted

---

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

---

## 👥 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Email: support@example.com

---

## 🙏 Acknowledgments

- OpenRouter for AI API
- MongoDB for database
- Redis for caching
- React and Vite for frontend
- Express.js for backend
- Tailwind CSS for styling
- Lucide React for icons

---

**Built with ❤️ using the MERN Stack**
