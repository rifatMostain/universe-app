import { useState, useEffect } from 'react';
import '../styles/CountryQuiz.css';

const DestinationFinder = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  // Scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const quizPages = [
    {
      title: 'Academic & Career Profile',
      icon: '🎓',
      questions: [
        {
          id: 'academicStatus',
          question: 'Current academic status in Bangladesh:',
          options: [
            'High School (HSC/A Levels completed)',
            'Undergraduate student',
            'Recent graduate (BSc/BBA)',
            'Working professional (1-3 years experience)',
            'Working professional (4+ years experience)',
            'Master\'s student in Bangladesh'
          ]
        },
        {
          id: 'degreeLevel',
          question: 'Target degree level:',
          options: [
            'Bachelor\'s (Undergraduate)',
            'Master\'s (Course-based/MEng)',
            'Master\'s (Research-based/MSc)',
            'PhD/Doctoral',
            'Postgraduate Diploma/Certificate'
          ]
        },
        {
          id: 'academicPerformance',
          question: 'Academic performance (CGPA/equivalent):',
          options: [
            'Below 3.0/4.0 (2nd Class)',
            '3.0-3.5/4.0 (Good)',
            '3.5-3.7/4.0 (Very Good)',
            '3.7-4.0/4.0 (Excellent/First Class)',
            'Haven\'t completed yet'
          ]
        },
        {
          id: 'field',
          question: 'Your strongest academic area:',
          options: [
            'STEM (Science, Technology, Engineering, Math)',
            'Business/Commerce/Finance',
            'Medical/Health Sciences',
            'Social Sciences/Humanities',
            'Arts/Creative Fields',
            'Agriculture/Environmental'
          ]
        }
      ]
    },
    {
      title: 'Financial Considerations',
      icon: '💰',
      questions: [
        {
          id: 'budget',
          question: 'Annual budget for tuition + living (USD):',
          options: [
            '< $10,000 (Need full funding)',
            '$10,000 - $15,000',
            '$15,000 - $25,000',
            '$25,000 - $40,000',
            '$40,000+ (No major constraints)'
          ]
        },
        {
          id: 'fundingSource',
          question: 'Primary funding source:',
          options: [
            'Family support',
            'Personal savings',
            'Bank loan planned',
            'Dependent on scholarships',
            'University funding/assistantship'
          ]
        },
        {
          id: 'partTimeWork',
          question: 'Willingness to work part-time:',
          options: [
            'Yes, need to support myself',
            'Preferably, to gain experience',
            'No, want to focus only on studies',
            'Depends on country\'s regulations'
          ]
        },
        {
          id: 'scholarshipDependency',
          question: 'Scholarship dependency:',
          options: [
            'Must have scholarship to study',
            'Can study without scholarship but prefer partial',
            'Scholarship not required',
            'Only considering fully funded programs'
          ]
        }
      ]
    },
    {
      title: 'Career & Settlement Goals',
      icon: '🎯',
      questions: [
        {
          id: 'postStudyGoal',
          question: 'Post-study primary goal:',
          options: [
            'Gain international work experience (2-3 years)',
            'Permanent settlement abroad',
            'Return to Bangladesh with global experience',
            'Continue to PhD/research',
            'Start own business'
          ]
        },
        {
          id: 'industryPreference',
          question: 'Industry preference for work:',
          options: [
            'IT/Tech Industry',
            'Finance/Banking',
            'Healthcare/Pharma',
            'Academia/Research',
            'Manufacturing/Engineering',
            'Consulting/Business',
            'Not specific'
          ]
        }
      ]
    },
    {
      title: 'Personal Preferences',
      icon: '🌍',
      questions: [
        {
          id: 'campusEnvironment',
          question: 'Preferred campus environment:',
          options: [
            'Large city with many opportunities',
            'University town/college-centric',
            'Quiet suburban area',
            'Doesn\'t matter'
          ]
        },
        {
          id: 'communityImportance',
          question: 'Importance of Bangladeshi community:',
          options: [
            'Very important (want strong community)',
            'Somewhat important',
            'Not important at all',
            'Prefer diverse international community'
          ]
        },
        {
          id: 'climate',
          question: 'Climate sensitivity:',
          options: [
            'Prefer warmer climate (like Bangladesh)',
            'Prefer moderate climate',
            'Can adapt to cold weather',
            'Doesn\'t matter'
          ]
        },
        {
          id: 'language',
          question: 'Language readiness:',
          options: [
            'Only English-speaking countries',
            'Willing to learn basic local language',
            'Already know another language',
            'Prefer countries with English widely spoken'
          ]
        },
        {
          id: 'familyConsiderations',
          question: 'Family considerations:',
          options: [
            'Planning to bring spouse/family',
            'Will come alone initially',
            'Family will remain in Bangladesh',
            'Will visit family frequently'
          ]
        }
      ]
    },
    {
      title: 'Application Preparedness',
      icon: '📝',
      questions: [
        {
          id: 'testStatus',
          question: 'Standardized test status:',
          options: [
            'IELTS/TOEFL completed',
            'GRE/GMAT completed',
            'Planning to take tests soon',
            'Haven\'t started test preparation',
            'Applying to test-optional universities'
          ]
        },
        {
          id: 'timeline',
          question: 'Application timeline urgency:',
          options: [
            'Want to apply for next intake (3-6 months)',
            'Planning for next year (6-12 months)',
            'Early planning (1-2 years ahead)',
            'Just exploring options'
          ]
        },
        {
          id: 'priority',
          question: 'Priority factor in choosing country:',
          options: [
            'Employment opportunities after studies',
            'Tuition cost and living expenses',
            'University ranking/prestige',
            'Ease of visa and immigration process',
            'Quality of life and safety',
            'Research opportunities and funding'
          ]
        },
        {
          id: 'visaConcern',
          question: 'Visa process concern level:',
          options: [
            'Very concerned (want easier visa process)',
            'Somewhat concerned',
            'Not concerned (strong profile)',
            'Will hire consultant for visa'
          ]
        },
        {
          id: 'internationalExposure',
          question: 'Previous international exposure:',
          options: [
            'Never traveled abroad',
            'Have visited other countries',
            'Have relatives/friends abroad',
            'Have studied/lived abroad before'
          ]
        }
      ]
    }
  ];

  const handleAnswer = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleNextPage = () => {
    if (currentPage < quizPages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      // Quiz completed, get recommendations
      getRecommendations(answers);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const isPageComplete = () => {
    const currentQuestions = quizPages[currentPage].questions;
    return currentQuestions.every(q => answers[q.id]);
  };

  const getRecommendations = async (quizAnswers) => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/country-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers: quizAnswers })
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;

            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullResponse += parsed.text;
              }
            } catch (e) {
              console.error('Parse error:', e);
            }
          }
        }
      }

      setRecommendations(fullResponse);
      setShowResults(true);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setRecommendations('Sorry, we encountered an error. Please try again.');
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  const restartQuiz = () => {
    setCurrentPage(0);
    setAnswers({});
    setShowResults(false);
    setRecommendations(null);
  };

  const progress = ((currentPage + 1) / quizPages.length) * 100;

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading-screen">
          <div className="loader"></div>
          <h2>🤖 AI is analyzing your profile...</h2>
          <p>Finding the best countries for your study abroad journey</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="quiz-container">
        <div className="results-container">
          <div className="results-header">
            <h1>🎯 Your Personalized Country Recommendations</h1>
            <p>Based on your quiz responses, here are the best countries for you</p>
          </div>
          
          <div className="recommendations-content">
            <div className="recommendation-text">
              {recommendations ? (
                recommendations.split('\n').map((line, index) => {
                  let processedLine = line;
                  
                  // Remove ### and make it a heading
                  if (processedLine.trim().startsWith('###')) {
                    const cleanText = processedLine.replace(/^###\s*/, '').replace(/\*\*/g, '');
                    return <h3 key={index} className="country-heading">{cleanText}</h3>;
                  }
                  
                  // Remove ## and make it a heading
                  if (processedLine.trim().startsWith('##')) {
                    const cleanText = processedLine.replace(/^##\s*/, '').replace(/\*\*/g, '');
                    return <h2 key={index} className="section-heading">{cleanText}</h2>;
                  }
                  
                  // Handle lines with ** for bold
                  if (processedLine.includes('**')) {
                    const parts = [];
                    const regex = /\*\*([^*]+)\*\*/g;
                    let lastIndex = 0;
                    let match;
                    
                    while ((match = regex.exec(processedLine)) !== null) {
                      if (match.index > lastIndex) {
                        parts.push(processedLine.substring(lastIndex, match.index));
                      }
                      parts.push(<strong key={`bold-${index}-${match.index}`}>{match[1]}</strong>);
                      lastIndex = match.index + match[0].length;
                    }
                    
                    if (lastIndex < processedLine.length) {
                      parts.push(processedLine.substring(lastIndex));
                    }
                    
                    return <p key={index}>{parts}</p>;
                  }
                  
                  // Handle bullet points with - or *
                  if (processedLine.trim().startsWith('-') || processedLine.trim().startsWith('*')) {
                    const cleanText = processedLine.trim().replace(/^[-*]\s*/, '');
                    return <li key={index} className="bullet-item">{cleanText}</li>;
                  }
                  
                  // Empty lines
                  if (processedLine.trim() === '') {
                    return <br key={index} />;
                  }
                  
                  // Regular paragraphs
                  return <p key={index}>{processedLine}</p>;
                })
              ) : (
                <p>No recommendations available.</p>
              )}
            </div>
          </div>

          <button onClick={restartQuiz} className="restart-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Restart Destination Finder
          </button>
        </div>
      </div>
    );
  }

  const currentPageData = quizPages[currentPage];

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        {/* Progress Header */}
        <div className="quiz-header">
          <div className="quiz-intro">
            <h1 className="quiz-main-title">🌍 Destination Finder</h1>
            <p className="quiz-subtitle">Answer 20 questions to get AI-powered country recommendations tailored to your profile</p>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-info">
            <span className="page-indicator">Page {currentPage + 1} of {quizPages.length}</span>
            <span className="progress-percentage">{Math.round(progress)}% Complete</span>
          </div>
        </div>

        <div className="page-title-section">
          <div className="page-icon">{currentPageData.icon}</div>
          <h2 className="page-title">{currentPageData.title}</h2>
        </div>

        <div className="questions-group">
          {currentPageData.questions.map((question, qIndex) => (
            <div key={question.id} className="question-block">
              <div className="question-header-block">
                <span className="question-number-badge">{qIndex + 1}</span>
                <h3 className="question-label">{question.question}</h3>
              </div>
              <div className="options-grid">
                {question.options.map((option, oIndex) => (
                  <button
                    key={oIndex}
                    onClick={() => handleAnswer(question.id, option)}
                    className={`option-btn ${answers[question.id] === option ? 'selected' : ''}`}
                  >
                    <span className="option-text">{option}</span>
                    {answers[question.id] === option && (
                      <span className="check-mark">✓</span>
                    )}
                  </button>
                ))}
              </div>
              {answers[question.id] && (
                <div className="answer-confirmation">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Answer saved
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="navigation-section">
          <div className="completion-status">
            <div className="answered-questions">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>{currentPageData.questions.filter(q => answers[q.id]).length} of {currentPageData.questions.length} answered</span>
            </div>
            {!isPageComplete() && (
              <div className="completion-hint">
                <span className="hint-icon">💡</span>
                Please answer all questions to continue
              </div>
            )}
          </div>
          <div className="navigation-buttons">
            {currentPage > 0 && (
              <button onClick={handlePreviousPage} className="nav-btn previous-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Previous
              </button>
            )}
            <button 
              onClick={handleNextPage} 
              className={`nav-btn next-btn ${!isPageComplete() ? 'disabled' : ''}`}
              disabled={!isPageComplete()}
            >
              {currentPage === quizPages.length - 1 ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd"/>
                  </svg>
                  Get AI Recommendations
                </>
              ) : (
                <>
                  Continue
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationFinder;
