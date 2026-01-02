import { Link } from 'react-router-dom';
import '../styles/ChatPage.css';

const ChatPage = () => {
  return (
    <div className="chat-page">
      <div className="chat-page-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>Powered by Google Gemini AI</span>
          </div>
          <h1>AI-Powered University Counseling</h1>
          <p className="hero-description">
            Get instant, personalized guidance for your international education journey. 
            Our AI assistant is trained to help you with admissions, scholarships, and more.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Available</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Universities</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">Free</div>
              <div className="stat-label">To Use</div>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="section-header">
          <h2>What Can Our AI Assistant Do?</h2>
          <p>Explore the powerful features designed to simplify your university application journey</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Program Guidance</h3>
            <p>Find the perfect program that matches your academic interests and career goals</p>
            <ul className="feature-list">
              <li>Program recommendations</li>
              <li>Course requirements</li>
              <li>Career outcomes</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Scholarship Information</h3>
            <p>Discover scholarships and financial aid opportunities to fund your education</p>
            <ul className="feature-list">
              <li>Merit-based scholarships</li>
              <li>Need-based financial aid</li>
              <li>Application deadlines</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">✈️</div>
            <h3>Study Abroad Help</h3>
            <p>Get comprehensive guidance on studying in your dream destination</p>
            <ul className="feature-list">
              <li>Visa requirements</li>
              <li>Living costs</li>
              <li>Cultural adaptation</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Application Support</h3>
            <p>Receive step-by-step assistance with your university applications</p>
            <ul className="feature-list">
              <li>Document preparation</li>
              <li>Essay guidance</li>
              <li>Timeline management</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏛️</div>
            <h3>University Research</h3>
            <p>Research and compare universities based on your preferences</p>
            <ul className="feature-list">
              <li>Rankings & reputation</li>
              <li>Campus facilities</li>
              <li>Student reviews</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Admission Requirements</h3>
            <p>Understand what you need to get accepted to your target universities</p>
            <ul className="feature-list">
              <li>GPA requirements</li>
              <li>Test scores</li>
              <li>Prerequisites</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="how-it-works">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Getting started is easy - just three simple steps</p>
        </div>
        
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Open the Assistant</h3>
              <p>Click the AI Assistant button in the bottom right corner</p>
            </div>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Ask Your Question</h3>
              <p>Type your question about universities, programs, or admissions</p>
            </div>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Get Instant Answers</h3>
              <p>Receive detailed, personalized responses in real-time</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Open the AI Assistant now and get personalized guidance for free!</p>
          <p className="cta-note">
            💡 <Link to="/signup" className="signup-link">Sign up</Link> or <Link to="/login" className="signup-link">Login</Link> to save your conversations and track your progress
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
