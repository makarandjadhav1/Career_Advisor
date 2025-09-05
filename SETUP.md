# Personalized Career Advisor - Setup Guide

This guide will help you set up and run the Personalized Career Advisor application locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v6.0 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)
- **Google Cloud Platform Account** - [Sign up here](https://cloud.google.com/)

## Google Cloud Setup

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note down your Project ID

### 2. Enable Required APIs

Enable the following APIs in your Google Cloud project:
- **Vertex AI API**
- **Generative AI API**

### 3. Create Service Account

1. Go to IAM & Admin > Service Accounts
2. Create a new service account
3. Grant the following roles:
   - Vertex AI User
   - AI Platform Developer
4. Create and download the JSON key file
5. Save it as `server/config/service-account.json`

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd Personalized_carrier

# Install all dependencies
npm run install-all
```

### 2. Environment Configuration

Create environment files:

```bash
# Copy the example environment file
cp server/env.example server/.env

# Edit the .env file with your configuration
nano server/.env
```

Update the following variables in `server/.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/career-advisor

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_CLOUD_KEY_FILE=./config/service-account.json

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Start MongoDB

```bash
# Start MongoDB service
sudo systemctl start mongod

# Or if using MongoDB Compass or manual installation
mongod
```

### 4. Seed Sample Data

```bash
# Navigate to server directory
cd server

# Run the seed script to populate sample career paths
node scripts/seedData.js
```

### 5. Start the Application

```bash
# From the root directory, start both frontend and backend
npm run dev

# Or start them separately:
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend  
cd client && npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Docker Setup (Alternative)

If you prefer using Docker:

### 1. Create Environment File

```bash
# Create .env file in root directory
cp server/env.example .env
```

Update the `.env` file with your Google Cloud configuration.

### 2. Run with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

## API Testing

### Using curl

```bash
# Health check
curl http://localhost:5000/api/health

# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "dateOfBirth": "2000-01-01",
    "gender": "male",
    "location": {
      "state": "Maharashtra",
      "city": "Mumbai"
    },
    "education": {
      "currentLevel": "undergraduate"
    }
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Using Postman

1. Import the API collection (if available)
2. Set the base URL to `http://localhost:5000/api`
3. Test the endpoints

## Project Structure

```
personalized-career-advisor/
├── server/                 # Backend API
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── services/         # Business logic
│   ├── middleware/       # Custom middleware
│   ├── routes/          # API routes
│   ├── scripts/         # Database scripts
│   └── config/          # Configuration files
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── contexts/    # React contexts
│   │   └── utils/       # Utility functions
├── docs/                # Documentation
└── docker-compose.yml   # Docker configuration
```

## Key Features Implemented

### Backend Features
- ✅ User authentication and authorization
- ✅ Comprehensive user profile management
- ✅ AI-powered assessment system
- ✅ Career path recommendations
- ✅ Skills gap analysis
- ✅ Google Cloud AI integration
- ✅ RESTful API with proper error handling
- ✅ Rate limiting and security middleware

### Frontend Features
- ✅ Modern React application with Material-UI
- ✅ Responsive design for all devices
- ✅ User authentication flow
- ✅ Dashboard with progress tracking
- ✅ Assessment interface
- ✅ Career exploration
- ✅ Skills analysis
- ✅ Personalized recommendations

### Database Features
- ✅ MongoDB with comprehensive schemas
- ✅ User profiles with detailed information
- ✅ Assessment results and history
- ✅ Career paths with Indian market context
- ✅ Skills tracking and progress

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```bash
   # Check if MongoDB is running
   sudo systemctl status mongod
   
   # Start MongoDB if not running
   sudo systemctl start mongod
   ```

2. **Google Cloud Authentication Error**
   - Ensure the service account JSON file is in the correct location
   - Verify the Project ID is correct
   - Check that required APIs are enabled

3. **Port Already in Use**
   ```bash
   # Kill processes using ports 3000 or 5000
   sudo lsof -ti:3000 | xargs kill -9
   sudo lsof -ti:5000 | xargs kill -9
   ```

4. **Node Modules Issues**
   ```bash
   # Clear npm cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

### Logs

- **Backend logs**: Check the terminal where you ran `npm run dev`
- **Frontend logs**: Check the browser console
- **MongoDB logs**: Check `/var/log/mongodb/mongod.log`

## Next Steps

1. **Customize the AI prompts** in `server/services/aiService.js`
2. **Add more career paths** using the seed script
3. **Implement additional assessment types**
4. **Add more Indian market data**
5. **Enhance the frontend with more interactive features**
6. **Set up production deployment**

## Support

For issues and questions:
- Check the troubleshooting section above
- Review the API documentation
- Check the console logs for error messages
- Ensure all prerequisites are properly installed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Note**: This is a development setup. For production deployment, additional security measures and optimizations are required.
