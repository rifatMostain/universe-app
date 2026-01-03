import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import HomePage from './pages/HomePage'
import ScholarshipInfo from './pages/ScholarshipInfo'
import Profile from './pages/Profile'
import ChatPage from './pages/ChatPage'
import CountryQuiz from './pages/CountryQuiz'
import UniversityRecommendations from './pages/UniversityRecommendations'
import ApplicationGuidance from './pages/ApplicationGuidance'
import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import Chatbot from './components/Chatbot'
import SOPHelper from './components/SOPHelper'
import './App.css'

function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="app-layout">
          <Navbar />
          <div className="app-container">
            <main className="main-content">
            <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            } />
            
            {/* Public Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/scholarships" element={<ScholarshipInfo />} />
            <Route path="/chatbot" element={<ChatPage />} />
            <Route path="/application-guidance" element={<ApplicationGuidance />} />
            
            {/* Protected Routes - Require Login */}
            <Route path="/country-quiz" element={
              <ProtectedRoute>
                <CountryQuiz />
              </ProtectedRoute>
            } />
            <Route path="/university-recommendations" element={
              <ProtectedRoute>
                <UniversityRecommendations />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/sop-cv" element={
              <ProtectedRoute>
                <SOPHelper />
              </ProtectedRoute>
            } />
            <Route path="/sop-helper" element={
              <ProtectedRoute>
                <SOPHelper />
              </ProtectedRoute>
            } />
            <Route path="/professor-finder" element={
              <ProtectedRoute>
                <div className="p-8 text-center"><h1 className="text-3xl">Professor Finder - Coming Soon</h1></div>
              </ProtectedRoute>
            } />
            </Routes>
            </main>
            {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
          </div>
          
          {/* Floating Toggle Button - Only show when chatbot is closed */}
          {!isChatbotOpen && (
            <button 
              className="chatbot-toggle-btn"
              onClick={toggleChatbot}
              aria-label="Open AI Assistant"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
                <circle cx="12" cy="8" r="1.5" fill="currentColor"/>
                <path d="M8.5 14c.83 1.24 2.24 2 3.5 2s2.67-.76 3.5-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="chatbot-toggle-text">AI Assistant</span>
            </button>
          )}
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
