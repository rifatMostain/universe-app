import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../styles/UniversityRecommendations.css';

const UniversityRecommendations = () => {
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    degree: 'Masters',
    field: '',
    previous_major: '',
    gpa: '',
    backlogs: '0',
    research_experience: '',
    ielts_status: 'Not taken',
    ielts_score: '',
    gre_gmat: 'Not taken',
    budget_range: '',
    living_cost_tolerance: 'Medium',
    preferred_intake: '',
    preferred_countries: [],
    career_goal: '',
    post_study_work: 'Medium',
    scholarship_needed: 'No',
    visa_risk_tolerance: 'Medium'
  });

  const [countryInput, setCountryInput] = useState('');

  const degreeOptions = ['Bachelors', 'Masters', 'PhD'];
  const intakeOptions = ['Fall', 'Spring', 'Summer', 'Any'];
  const countryOptions = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Netherlands', 'France', 'Sweden', 'Switzerland', 'Singapore'];
  const yesNoOptions = ['Yes', 'No'];
  const toleranceOptions = ['Low', 'Medium', 'High'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCountryChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setFormData(prev => ({
      ...prev,
      preferred_countries: selected
    }));
  };

  const addCountry = () => {
    const trimmedCountry = countryInput.trim();
    if (trimmedCountry && !formData.preferred_countries.includes(trimmedCountry)) {
      setFormData(prev => ({
        ...prev,
        preferred_countries: [...prev.preferred_countries, trimmedCountry]
      }));
      setCountryInput('');
    }
  };

  const removeCountry = (countryToRemove) => {
    setFormData(prev => ({
      ...prev,
      preferred_countries: prev.preferred_countries.filter(c => c !== countryToRemove)
    }));
  };

  const handleCountryInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCountry();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRecommendations(null);

    try {
      const response = await api.post('/universities/recommendations', formData);
      
      if (response.data.success) {
        setRecommendations(response.data.data);
      } else {
        setError(response.data.message || 'Failed to get recommendations');
      }
    } catch (err) {
      console.error('Error getting recommendations:', err);
      setError(err.response?.data?.message || err.message || 'Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      degree: 'Masters',
      field: '',
      previous_major: '',
      gpa: '',
      backlogs: '0',
      research_experience: '',
      ielts_status: 'Not taken',
      ielts_score: '',
      gre_gmat: 'Not taken',
      budget_range: '',
      living_cost_tolerance: 'Medium',
      preferred_intake: '',
      preferred_countries: [],
      career_goal: '',
      post_study_work: 'Medium',
      scholarship_needed: 'No',
      visa_risk_tolerance: 'Medium'
    });
    setCountryInput('');
    setRecommendations(null);
    setError('');
  };

  return (
    <div className="university-recommendations-page">
      {/* Hero Section */}
      <div className="recommendations-hero">
        <div className="hero-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">AI University Recommendations</h1>
          <p className="hero-subtitle">Get personalized university recommendations powered by advanced AI</p>
        </div>
      </div>

      <div className="recommendations-container">

      {!recommendations ? (
        <form onSubmit={handleSubmit} className="student-profile-form">
          <div className="form-section">
            <h2>Academic Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Degree Level *</label>
                <select name="degree" value={formData.degree} onChange={handleChange} required>
                  {degreeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Field of Study *</label>
                <input
                  type="text"
                  name="field"
                  value={formData.field}
                  onChange={handleChange}
                  placeholder="e.g., Computer Science, Business Analytics"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Previous Degree / Major</label>
                <input
                  type="text"
                  name="previous_major"
                  value={formData.previous_major}
                  onChange={handleChange}
                  placeholder="e.g., BSc in Computer Science"
                />
              </div>

              <div className="form-group">
                <label>CGPA / GPA</label>
                <input
                  type="text"
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleChange}
                  placeholder="e.g., 3.5/4.0 or 8.5/10"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Backlogs</label>
                <input
                  type="number"
                  name="backlogs"
                  value={formData.backlogs}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Research Experience</label>
                <input
                  type="text"
                  name="research_experience"
                  value={formData.research_experience}
                  onChange={handleChange}
                  placeholder="e.g., 2 publications, 1 year lab work"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Test Scores</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>IELTS Status</label>
                <select name="ielts_status" value={formData.ielts_status} onChange={handleChange}>
                  <option value="Not taken">Not taken</option>
                  <option value="Planned">Planned</option>
                  <option value="Taken">Taken</option>
                </select>
              </div>

              <div className="form-group">
                <label>IELTS Score (if taken)</label>
                <input
                  type="text"
                  name="ielts_score"
                  value={formData.ielts_score}
                  onChange={handleChange}
                  placeholder="e.g., Overall 7.0 (L:7 R:7 W:6.5 S:7)"
                  disabled={formData.ielts_status === 'Not taken'}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>GRE / GMAT</label>
                <input
                  type="text"
                  name="gre_gmat"
                  value={formData.gre_gmat}
                  onChange={handleChange}
                  placeholder="e.g., GRE 320 (Q:165 V:155) or Not taken"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Financial & Preferences</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Annual Tuition Budget (USD)</label>
                <input
                  type="text"
                  name="budget_range"
                  value={formData.budget_range}
                  onChange={handleChange}
                  placeholder="e.g., 20000-30000 or Flexible"
                />
              </div>

              <div className="form-group">
                <label>Living Cost Tolerance</label>
                <select name="living_cost_tolerance" value={formData.living_cost_tolerance} onChange={handleChange}>
                  {toleranceOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Preferred Intake</label>
                <select name="preferred_intake" value={formData.preferred_intake} onChange={handleChange}>
                  <option value="">Select intake</option>
                  {intakeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Scholarship Needed</label>
                <select name="scholarship_needed" value={formData.scholarship_needed} onChange={handleChange}>
                  {yesNoOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Preferred Countries</label>
                <div className="country-input-container">
                  <div className="country-input-wrapper">
                    <input
                      type="text"
                      value={countryInput}
                      onChange={(e) => setCountryInput(e.target.value)}
                      onKeyPress={handleCountryInputKeyPress}
                      placeholder="Type a country name and press Enter or click Add"
                      className="country-text-input"
                    />
                    <button 
                      type="button" 
                      onClick={addCountry}
                      className="add-country-btn"
                      disabled={!countryInput.trim()}
                    >
                      Add
                    </button>
                  </div>
                  <div className="countries-list">
                    {formData.preferred_countries.length > 0 ? (
                      formData.preferred_countries.map((country, index) => (
                        <span key={index} className="country-tag">
                          {country}
                          <button
                            type="button"
                            onClick={() => removeCountry(country)}
                            className="remove-country-btn"
                            aria-label={`Remove ${country}`}
                          >
                            ×
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="no-countries-text">No countries selected. Type to add countries.</span>
                    )}
                  </div>
                  <p className="country-hint">
                    Suggested: USA, UK, Canada, Australia, Germany, Netherlands, France, Sweden, Switzerland, Singapore
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Career Goals & Priorities</h2>
            
            <div className="form-row">
              <div className="form-group full-width">
                <label>Career Goal</label>
                <textarea
                  name="career_goal"
                  value={formData.career_goal}
                  onChange={handleChange}
                  placeholder="e.g., Work as a Data Scientist in a tech company"
                  rows="3"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Post-Study Work Priority</label>
                <select name="post_study_work" value={formData.post_study_work} onChange={handleChange}>
                  {toleranceOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Visa Risk Tolerance</label>
                <select name="visa_risk_tolerance" value={formData.visa_risk_tolerance} onChange={handleChange}>
                  {toleranceOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={handleReset} className="reset-button" disabled={loading}>
              Reset Form
            </button>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? (
                <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center'}}>
                  <span className="spinner"></span>
                  Analyzing your profile...
                </span>
              ) : 'Get Recommendations'}
            </button>
          </div>

          {loading && (
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #10b98110 0%, #05966910 100%)',
              borderRadius: '12px',
              textAlign: 'center',
              border: '2px solid #10b981',
              animation: 'pulse 2s infinite'
            }}>
              <p style={{fontSize: '1.1rem', color: '#059669', fontWeight: '600', marginBottom: '0.5rem'}}>
                🤖 AI is analyzing your profile and searching global universities...
              </p>
              <p style={{fontSize: '0.9rem', color: '#64748b'}}>
                This may take 30-60 seconds. Please wait...
              </p>
            </div>
          )}
        </form>
      ) : (
        <div className="recommendations-results">
          <div className="results-header">
            <h2>Your Top 10 University Recommendations</h2>
            <p>Powered by AI • Based on comprehensive global university knowledge</p>
            <button onClick={() => setRecommendations(null)} className="new-search-button">
              New Search
            </button>
          </div>

          {recommendations.summary && (
            <div className="overall-summary">
              <h3>Overall Summary</h3>
              <p>{recommendations.summary}</p>
            </div>
          )}

          <div className="recommendations-list">
            {recommendations.recommendations?.map((rec, index) => (
              <div key={index} className="recommendation-card">
                <div className="card-header">
                  <span className="rank-badge">#{rec.rank}</span>
                  <h3>{rec.university_name}</h3>
                </div>
                
                <div className="card-info">
                  <div className="info-item">
                    <span className="label">Country:</span>
                    <span className="value">{rec.country}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">QS Ranking 2026:</span>
                    <span className="value">{rec.qs_ranking}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Program:</span>
                    <span className="value">{rec.degree_subject_match}</span>
                  </div>
                  {rec.estimated_annual_cost_usd && (
                    <div className="info-item">
                      <span className="label">Estimated Cost (Annual):</span>
                      <span className="value cost-highlight">{rec.estimated_annual_cost_usd}</span>
                    </div>
                  )}
                </div>

                {rec.explanation && (
                  <div className="explanation-section">
                    <h4>Why This University?</h4>
                    
                    {rec.explanation.academic_fit && (
                      <div className="explanation-item">
                        <strong>Academic Fit:</strong>
                        <p>{rec.explanation.academic_fit}</p>
                      </div>
                    )}
                    
                    {rec.explanation.language_test_fit && (
                      <div className="explanation-item">
                        <strong>Language & Test Requirements:</strong>
                        <p>{rec.explanation.language_test_fit}</p>
                      </div>
                    )}
                    
                    {rec.explanation.budget_affordability && (
                      <div className="explanation-item">
                        <strong>Budget & Affordability:</strong>
                        <p>{rec.explanation.budget_affordability}</p>
                      </div>
                    )}
                    
                    {rec.explanation.career_alignment && (
                      <div className="explanation-item">
                        <strong>Career Alignment:</strong>
                        <p>{rec.explanation.career_alignment}</p>
                      </div>
                    )}
                    
                    {rec.explanation.post_study_work && (
                      <div className="explanation-item">
                        <strong>Post-Study Work:</strong>
                        <p>{rec.explanation.post_study_work}</p>
                      </div>
                    )}
                  </div>
                )}

                {rec.overall_recommendation && (
                  <div className="overall-recommendation">
                    <p>{rec.overall_recommendation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="results-footer">
            <button onClick={handleReset} className="start-over-button">
              Start Over
            </button>
            <button onClick={() => window.print()} className="print-button">
              Print Recommendations
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default UniversityRecommendations;
