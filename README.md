# Personalized Career and Skills Advisor

An AI-powered platform that provides personalized career guidance and skills recommendations for Indian students using Google Cloud's generative AI capabilities.

## Features

- **Personalized Assessment**: Comprehensive skills and interest evaluation
- **Career Path Recommendations**: AI-driven career suggestions based on individual profiles
- **Skills Gap Analysis**: Identifies required skills and provides learning paths
- **Indian Job Market Focus**: Tailored to Indian education system and job market
- **Real-time Updates**: Adapts to evolving job market trends
- **Progress Tracking**: Monitor skill development and career readiness

## Tech Stack

- **Backend**: Node.js, Express.js, Google Cloud AI Platform
- **Frontend**: React.js, Material-UI, Chart.js
- **Database**: MongoDB
- **AI/ML**: Google Cloud Generative AI, Vertex AI
- **Authentication**: JWT-based authentication

## Project Structure

```
personalized-career-advisor/
├── server/                 # Backend API
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── services/         # Business logic
│   ├── middleware/       # Custom middleware
│   └── config/          # Configuration files
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── utils/       # Utility functions
└── docs/                # Documentation
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Google Cloud Platform account
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```

3. Set up environment variables:
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your configuration
   ```

4. Start the development servers:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the server directory with:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/career-advisor
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_KEY_FILE=path/to/service-account.json
JWT_SECRET=your-jwt-secret
NODE_ENV=development
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/profile` - Get user profile
- `POST /api/assessment` - Submit skills assessment
- `GET /api/career-paths` - Get career recommendations
- `GET /api/skills-gap` - Analyze skills gap
- `POST /api/progress` - Update learning progress

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
# Career_Advisor
