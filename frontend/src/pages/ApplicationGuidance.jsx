import { useState, useEffect } from 'react';
import '../styles/ApplicationGuidance.css';

const ApplicationGuidance = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [formData, setFormData] = useState({
    country: '',
    degree: '',
    field: '',
    university: ''
  });
  const [loading, setLoading] = useState(false);
  const [guidance, setGuidance] = useState('');
  const [showResults, setShowResults] = useState(false);

  const countries = [
    'USA', 'UK', 'Canada', 'Australia', 'Germany', 'Netherlands',
    'France', 'Sweden', 'Switzerland', 'Singapore', 'New Zealand',
    'Ireland', 'Denmark', 'Norway', 'Finland'
  ];

  const degrees = [
    "Bachelor's",
    "Master's",
    "PhD/Doctoral",
    "Postgraduate Diploma"
  ];

  const fields = [
    'Computer Science',
    'Engineering',
    'Business/Management',
    'Data Science/AI',
    'Medicine/Health Sciences',
    'Economics',
    'Finance',
    'Biotechnology',
    'Environmental Science',
    'Psychology',
    'Law',
    'Architecture',
    'Arts/Design',
    'Education',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.country || !formData.degree || !formData.field) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setGuidance('');
    setShowResults(false);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const endpoint = `${apiUrl}/application-guidance`;
      
      console.log('🚀 Requesting application guidance from:', endpoint);
      console.log('📝 Form data:', formData);
      console.log('🌐 API URL:', apiUrl);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      }).catch(err => {
        console.error('❌ Fetch error:', err);
        throw new Error('Failed to connect to server. Please make sure the backend is running.');
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error:', response.status, errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      console.log('✅ Response received, reading stream...');
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
            if (data === '[DONE]') {
              setShowResults(true);
              break;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullResponse += parsed.text;
                setGuidance(fullResponse);
              }
            } catch (e) {
              console.error('Parse error:', e);
            }
          }
        }
      }

      console.log('✅ Streaming complete');
      setShowResults(true);

    } catch (error) {
      console.error('❌ Error:', error);
      setGuidance(`Error: ${error.message}\n\nPlease try again.`);
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      country: '',
      degree: '',
      field: '',
      university: ''
    });
    setGuidance('');
    setShowResults(false);
  };

  const handlePrint = () => {
    // Set the document title for printing
    const originalTitle = document.title;
    document.title = `Application Guide - ${formData.country} - ${formData.degree} - ${formData.field}`;
    
    // Trigger print
    window.print();
    
    // Restore original title after print dialog closes
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const formatGuidanceText = (text) => {
    if (!text) return null;

    return text.split('\n').map((line, index) => {
      let processedLine = line;

      // Remove ### and make it h3
      if (processedLine.trim().startsWith('###')) {
        const cleanText = processedLine.replace(/^###\s*/, '').replace(/\*\*/g, '');
        return <h3 key={index} className="guidance-h3">{cleanText}</h3>;
      }

      // Remove ## and make it h2
      if (processedLine.trim().startsWith('##')) {
        const cleanText = processedLine.replace(/^##\s*/, '').replace(/\*\*/g, '');
        return <h2 key={index} className="guidance-h2">{cleanText}</h2>;
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

        return <p key={index} className="guidance-paragraph">{parts}</p>;
      }

      // Handle bullet points with - or *
      if (processedLine.trim().startsWith('-') || processedLine.trim().startsWith('*')) {
        const cleanText = processedLine.trim().replace(/^[-*]\s*/, '');
        return <li key={index} className="guidance-bullet">{cleanText}</li>;
      }

      // Empty lines
      if (processedLine.trim() === '') {
        return <br key={index} />;
      }

      // Regular paragraphs
      return <p key={index} className="guidance-paragraph">{processedLine}</p>;
    });
  };

  if (showResults) {
    return (
      <div className="guidance-container">
        <div className="guidance-results">
          <div className="results-header">
            <h1>📚 Your Application Guidance</h1>
            <p>Complete step-by-step guide for {formData.country} • {formData.degree} • {formData.field}</p>
            <button onClick={handleReset} className="new-search-btn">
              ← New Search
            </button>
          </div>

          <div className="guidance-content">
            {formatGuidanceText(guidance)}
          </div>

          <div className="guidance-footer">
            <p>💡 <strong>Pro Tip:</strong> Save or print this guide for reference during your application process!</p>
            <button onClick={handlePrint} className="print-btn">
              🖨️ Print Guide
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="guidance-container">
      <div className="guidance-hero">
        <div className="hero-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">📚 Application Guidance</h1>
          <p className="hero-subtitle">
            Get personalized, step-by-step guidance for your university application journey
          </p>
        </div>
      </div>

      <div className="guidance-form-container">
        <form onSubmit={handleSubmit} className="guidance-form">
          <div className="form-header">
            <h2>Tell us about your target destination</h2>
            <p>We'll provide a comprehensive guide tailored to your needs</p>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="country">
                Target Country <span className="required">*</span>
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              >
                <option value="">Select a country</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="degree">
                Degree Level <span className="required">*</span>
              </label>
              <select
                id="degree"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                required
              >
                <option value="">Select degree level</option>
                {degrees.map(degree => (
                  <option key={degree} value={degree}>{degree}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="field">
                Field of Study <span className="required">*</span>
              </label>
              <select
                id="field"
                name="field"
                value={formData.field}
                onChange={handleChange}
                required
              >
                <option value="">Select your field</option>
                {fields.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="university">
                Target University <span className="optional">(Optional)</span>
              </label>
              <input
                type="text"
                id="university"
                name="university"
                value={formData.university}
                onChange={handleChange}
                placeholder="e.g., University of Toronto"
              />
            </div>
          </div>

          {loading && (
            <div className="loading-message">
              <div className="spinner"></div>
              <p>🤖 AI is preparing your personalized application guide...</p>
              <p className="loading-sub">This may take 30-60 seconds</p>
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={handleReset} className="reset-btn" disabled={loading}>
              Reset
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Generating Guide...' : '📚 Get Application Guide'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationGuidance;
