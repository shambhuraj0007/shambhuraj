# 🚀 Quick Start Guide - AI Text Summarizer

Get your AI Text Summarizer up and running in minutes!

## ⚡ Prerequisites

- Node.js v18+ installed
- MongoDB (local or Atlas account)
- OpenRouter API key ([Get one here](https://openrouter.ai))
- Redis (optional, for caching)

## 📦 Installation Steps

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

#### Backend `.env` file:

```bash
cd backend
# Create .env file
```

Add the following:

```env
PORT=8080
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
OPENROUTER_API_KEY=your_openrouter_api_key
SITE_URL=http://localhost:5173
SITE_NAME=AI Summarizer

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
```

#### Frontend `.env` file:

```bash
cd ../frontend
# Create .env file
```

Add the following:

```env
VITE_BACKEND_URL=http://localhost:8080
```

### 3. Start the Application

#### Option A: Without Docker (Development)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Redis (Optional):**
```bash
redis-server
```

#### Option B: With Docker (Production-like)

```bash
# From project root
docker-compose up --build
```

## 🌐 Access the Application

- **Frontend**: http://localhost:5173 (dev) or http://localhost (docker)
- **Backend API**: http://localhost:8080
- **API Health Check**: http://localhost:8080/ping

## 🎯 First Steps

1. **Sign Up**: Create a new account at `/signup`
2. **Login**: Access your account at `/login`
3. **Dashboard**: View your stats and recent summaries
4. **Create Summary**: Go to `/summarize` to generate your first AI summary
5. **View History**: Check all your summaries at `/history`

## 🔑 Getting API Keys

### OpenRouter API Key

1. Visit [openrouter.ai](https://openrouter.ai)
2. Sign up for an account
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste into your `.env` file

### MongoDB Atlas (Free Tier)

1. Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Create a database user
5. Whitelist your IP (or use 0.0.0.0/0 for all IPs)
6. Get connection string and add to `.env`

## 🐛 Troubleshooting

### Backend won't start

- Check MongoDB connection string
- Verify OpenRouter API key is valid
- Ensure port 8080 is not in use

### Frontend can't connect to backend

- Verify `VITE_BACKEND_URL` in frontend `.env`
- Check backend is running on port 8080
- Check CORS settings in backend

### Redis connection errors

- Redis is optional - app works without it
- Install Redis or comment out Redis env variables
- Check Redis is running: `redis-cli ping`

### Docker issues

- Clear Docker cache: `docker system prune -a`
- Rebuild: `docker-compose build --no-cache`
- Check logs: `docker-compose logs -f`

## 📚 Features to Try

1. **Generate Summary**: Paste text (50+ words) and click "Generate AI Summary"
2. **Different Styles**: Try Concise, Detailed, Bullet Points, or Executive styles
3. **Save Summaries**: Give your summary a title and save to history
4. **Search History**: Use the search bar to find specific summaries
5. **View Statistics**: Check your dashboard for usage stats

## 🎨 Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Cache**: Redis
- **Queue**: BullMQ
- **AI**: OpenRouter API
- **Auth**: JWT

## 📖 Next Steps

- Read the full [DEPLOYMENT_README.md](./DEPLOYMENT_README.md) for deployment
- Check [API Documentation](./DEPLOYMENT_README.md#api-documentation)
- Explore Docker deployment options
- Deploy to Render (backend) and Vercel (frontend)

## 💡 Tips

- **Minimum Text**: 50 words for best results
- **Cache**: Identical texts return cached results (faster!)
- **Async Jobs**: Use queue endpoint for very long texts
- **Styles**: Experiment with different summary styles
- **Compression**: Aim for 20-30% compression ratio

## 🆘 Need Help?

- Check the logs in terminal
- Visit `/api/diagnostics` endpoint for system status
- Review environment variables
- Ensure all dependencies are installed

---

**Happy Summarizing! 🎉**
