# UniVerse - AI-Powered Study Abroad Guidance Platform

## Project Overview
UniVerse is an AI-powered platform designed to help Bangladeshi students navigate their study abroad journey. The platform provides personalized guidance, AI-powered assistance for SOP writing, professor finder, and comprehensive data analysis for informed decision-making.

## Tech Stack
- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB Atlas
- **Authentication**: Firebase Auth (Free Tier)
- **AI Services**:
  - Chatbot, SOP Assistant, Data Analysis: Google Gemini API
  - Professor Finder: Google Scholar Scraper / Semantic Scholar API
- **Hosting**: 
  - Frontend: Vercel
  - Backend: Render / Cyclic (Free Tier)

## Project Structure
```
universe-app/
├── frontend/          # React.js frontend application
├── backend/           # Node.js/Express backend server
└── README.md          # Project documentation
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Firebase account
- Google Gemini API key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   FIREBASE_CONFIG=your_firebase_config
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   VITE_API_URL=http://localhost:5000
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Features
- 🤖 AI-Powered Chatbot for instant guidance
- 📝 SOP Writing Assistant
- 👨‍🏫 Professor Finder Tool
- 📊 Data Analysis and Insights
- 🔐 Secure Authentication
- 💰 Cost-effective solution using free-tier services

## Development Status
Currently in Phase 1: Project Foundation & Setup

## Contributing
This is a development project. Contributions and suggestions are welcome.

## License
MIT License

## Contact
For more information, please reach out to the development team.
