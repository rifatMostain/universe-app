import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/HomePage.css';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [stats, setStats] = useState({ students: 0, universities: 0, countries: 0 });

  // Animate stats on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    const targets = { students: 1500, universities: 500, countries: 25 };
    let current = { students: 0, universities: 0, countries: 0 };
    
    const timer = setInterval(() => {
      current.students = Math.min(current.students + 25, targets.students);
      current.universities = Math.min(current.universities + 8, targets.universities);
      current.countries = Math.min(current.countries + 1, targets.countries);
      
      setStats({ ...current });
      
      if (current.students >= targets.students) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      id: 1,
      icon: '🌍',
      title: 'Destination Finder',
      description: 'Take our intelligent 20-question quiz to discover the perfect study destinations tailored to your academic goals, budget, and preferences.',
      link: '/country-quiz',
      color: '#059669'
    },
    {
      id: 2,
      icon: '�',
      title: 'Application Guide',
      description: 'Get comprehensive step-by-step guidance for your entire application journey - from admission to visa, tailored to your destination.',
      link: '/application-guidance',
      color: '#10b981'
    },
    {
      id: 3,
      icon: '💬',
      title: 'AI Chatbot',
      description: 'Get instant, accurate answers to all your study abroad questions. Available 24/7 with no login required.',
      link: '/chatbot',
      color: '#0891b2'
    },
    {
      id: 4,
      icon: '💰',
      title: 'Scholarship Finder',
      description: 'Access comprehensive scholarship database with filtering options. Find funding opportunities that match your profile.',
      link: '/scholarships',
      color: '#7c3aed'
    },
    {
      id: 5,
      icon: '🎓',
      title: 'University Finder',
      description: 'Get AI-powered personalized university recommendations based on your academic profile, budget, and career goals.',
      link: '/university-recommendations',
      color: '#8b5cf6'
    },
    {
      id: 6,
      icon: '📝',
      title: 'SOP Assistant',
      description: 'Generate compelling Statement of Purpose with AI. Tailor your SOP for specific universities and programs.',
      link: '/sop-cv',
      color: '#dc2626'
    },
    {
      id: 7,
      icon: '👨‍🏫',
      title: 'Professor Finder',
      description: 'Find professors in your research field, get contact details, and learn how to write effective cold emails.',
      link: '/professor-finder',
      color: '#ea580c'
    },
    {
      id: 8,
      icon: '📊',
      title: 'Profile Builder',
      description: 'Build your academic profile, track applications, and get personalized recommendations based on your credentials.',
      link: '/profile',
      color: '#16a34a'
    }
  ];

  const handleGetStarted = () => {
    if (user) {
      navigate('/country-quiz');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="homepage">
      {/* Hero Section with Animated Background */}
      <section className="hero-modern">
        <div className="hero-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
          </div>
        </div>
        
        <div className="hero-content-wrapper">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>AI-Powered Study Abroad Platform</span>
          </div>
          
          <h1 className="hero-title-modern">
            Your Journey to
            <span className="gradient-text"> Global Education</span>
            <br />Starts Here
          </h1>
          
          <p className="hero-subtitle-modern">
            Comprehensive guidance for Bangladeshi students aspiring to study abroad.
            <br />From university selection to visa application - we've got you covered.
          </p>
          
          <div className="hero-cta-buttons">
            <button onClick={handleGetStarted} className="cta-primary">
              <span>Start Your Journey</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <Link to="/country-quiz" className="cta-secondary">
              <span className="quiz-icon">🧭</span>
              <span>Find Your Destination</span>
            </Link>
          </div>
          
          {/* Stats Bar */}
          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-number">{stats.students}+</div>
              <div className="stat-label">Students Helped</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">{stats.universities}+</div>
              <div className="stat-label">Universities</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">{stats.countries}+</div>
              <div className="stat-label">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="features-showcase">
        <div className="section-header">
          <span className="section-badge">Powerful Tools</span>
          <h2 className="section-title-modern">Everything You Need in One Place</h2>
          <p className="section-description">
            Comprehensive suite of tools designed specifically for Bangladeshi students
          </p>
        </div>

        <div className="features-grid-modern">
          {features.map((feature, index) => (
            <Link 
              to={feature.link} 
              key={feature.id}
              className="feature-card-modern"
              onMouseEnter={() => setActiveFeature(index)}
              style={{ '--feature-color': feature.color }}
            >
              <div className="feature-icon-wrapper">
                <span className="feature-icon-large">{feature.icon}</span>
                <div className="feature-icon-bg"></div>
              </div>
              <h3 className="feature-title-modern">{feature.title}</h3>
              <p className="feature-description-modern">{feature.description}</p>
              <div className="feature-arrow">
                <span>Explore</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="section-header">
          <span className="section-badge">Simple Process</span>
          <h2 className="section-title-modern">How UniVerse Works</h2>
        </div>

        <div className="process-timeline">
          <div className="process-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Create Your Profile</h3>
              <p>Sign up and build your academic profile with your qualifications and goals</p>
            </div>
          </div>
          
          <div className="timeline-connector"></div>
          
          <div className="process-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Discover Universities</h3>
              <p>Use our destination finder and get AI-powered university recommendations</p>
            </div>
          </div>
          
          <div className="timeline-connector"></div>
          
          <div className="process-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Prepare Applications</h3>
              <p>Generate AI-powered SOP drafts and save them to your account</p>
            </div>
          </div>
          
          <div className="timeline-connector"></div>
          
          <div className="process-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Apply & Succeed</h3>
              <p>Track applications, find scholarships, and get 24/7 support from our AI chatbot</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-header">
          <span className="section-badge">Success Stories</span>
          <h2 className="section-title-modern">What Students Say</h2>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="quote-icon">"</div>
            <p className="testimonial-text">
              The destination finder helped me discover universities I never knew existed. Got admission to my dream university in Canada!
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">🎓</div>
              <div>
                <div className="author-name">Rafiq Ahmed</div>
                <div className="author-info">Computer Science • Canada</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="quote-icon">"</div>
            <p className="testimonial-text">
              The AI chatbot answered all my visa questions instantly. The SOP builder was incredibly helpful for my applications.
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">🎓</div>
              <div>
                <div className="author-name">Nusrat Khan</div>
                <div className="author-info">Business Analytics • USA</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="quote-icon">"</div>
            <p className="testimonial-text">
              Found the perfect professor for my research interests using the professor finder. Secured a fully funded PhD position!
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">🎓</div>
              <div>
                <div className="author-name">Kamal Hassan</div>
                <div className="author-info">Electrical Engineering • Germany</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section-modern">
        <div className="cta-content-modern">
          <h2 className="cta-title-modern">Ready to Begin Your Journey?</h2>
          <p className="cta-description-modern">
            Join thousands of Bangladeshi students who are making their study abroad dreams a reality
          </p>
          <div className="cta-buttons-modern">
            <button onClick={handleGetStarted} className="cta-btn-large">
              Get Started Free
            </button>
            <Link to="/chatbot" className="cta-btn-outline">
              Try AI Chatbot
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-modern">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-icon">🎓</span>
              <span className="footer-logo-text">UniVerse</span>
            </div>
            <p className="footer-tagline">
              Empowering Bangladeshi students to achieve their global education dreams
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>Platform</h4>
              <Link to="/country-quiz">Destination Finder</Link>
              <Link to="/scholarships">Scholarships</Link>
              <Link to="/chatbot">AI Chatbot</Link>
            </div>
            
            <div className="footer-column">
              <h4>Tools</h4>
              <Link to="/sop-cv">SOP Assistant</Link>
              <Link to="/professor-finder">Professor Finder</Link>
              <Link to="/profile">My Profile</Link>
            </div>
            
            <div className="footer-column">
              <h4>Resources</h4>
              <a href="#faq">FAQ</a>
              <a href="#guides">Guides</a>
              <a href="#blog">Blog</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 UniVerse. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
