import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/SOPHelper.css';

const SOPHelper = () => {
  const { user } = useAuth();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [formData, setFormData] = useState({
    targetUniversity: '',
    program: '',
    degreeLevel: 'Masters',
    background: '',
    academicAchievements: '',
    workExperience: '',
    researchInterests: '',
    careerGoals: '',
    whyThisProgram: '',
    whyThisUniversity: '',
    uniqueStrengths: '',
    additionalInfo: ''
  });

  const [generatedSOP, setGeneratedSOP] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await api.post('/ai/generate-sop', formData);
      setGeneratedSOP(response.data.sop);
      setSuccessMessage('SOP generated successfully! You can now edit and save it.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate SOP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDB = async () => {
    if (!generatedSOP.trim()) {
      setError('No SOP content to save');
      return;
    }

    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      await api.post('/profile/save-sop', {
        sopContent: generatedSOP,
        targetUniversity: formData.targetUniversity,
        program: formData.program,
        degreeLevel: formData.degreeLevel
      });
      setSuccessMessage('SOP saved to your account successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save SOP. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    if (!generatedSOP.trim()) {
      setError('No SOP content to download');
      return;
    }

    const blob = new Blob([generatedSOP], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOP_${formData.targetUniversity || 'Draft'}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSuccessMessage('SOP downloaded successfully!');
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all fields and generated content?')) {
      setFormData({
        targetUniversity: '',
        program: '',
        degreeLevel: 'Masters',
        background: '',
        academicAchievements: '',
        workExperience: '',
        researchInterests: '',
        careerGoals: '',
        whyThisProgram: '',
        whyThisUniversity: '',
        uniqueStrengths: '',
        additionalInfo: ''
      });
      setGeneratedSOP('');
      setError('');
      setSuccessMessage('');
    }
  };

  return (
    <div className="sop-helper-page">
      <div className="sop-hero">
        <div className="sop-hero-content">
          <div className="hero-badge-sop">
            <span>✍️</span> AI-Powered SOP Generator
          </div>
          <h1 className="hero-title-sop">Statement of Purpose Assistant</h1>
          <p className="hero-subtitle-sop">
            Create a compelling SOP tailored to your target university and program with AI assistance
          </p>
        </div>
      </div>

      <div className="sop-container">
        {error && (
          <div className="alert alert-error">
            <svg className="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success">
            <svg className="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {successMessage}
          </div>
        )}

        <div className="sop-layout">
          {/* Input Form */}
          <div className="sop-form-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-icon">📝</span>
                Your Information
              </h2>
              <p className="section-subtitle">Fill in the details to generate your personalized SOP</p>
            </div>

            <form onSubmit={handleGenerate} className="sop-form">
              {/* Basic Information */}
              <div className="form-group-sop">
                <label className="form-label-sop">
                  <span className="label-icon">🎓</span>
                  Target University *
                </label>
                <input
                  type="text"
                  name="targetUniversity"
                  value={formData.targetUniversity}
                  onChange={handleChange}
                  placeholder="e.g., University of Toronto"
                  className="form-input-sop"
                  required
                />
              </div>

              <div className="form-group-sop">
                <label className="form-label-sop">
                  <span className="label-icon">📚</span>
                  Program/Course *
                </label>
                <input
                  type="text"
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  placeholder="e.g., Master of Science in Computer Science"
                  className="form-input-sop"
                  required
                />
              </div>

              <div className="form-group-sop">
                <label className="form-label-sop">
                  <span className="label-icon">🎯</span>
                  Degree Level *
                </label>
                <select
                  name="degreeLevel"
                  value={formData.degreeLevel}
                  onChange={handleChange}
                  className="form-input-sop"
                  required
                >
                  <option value="Bachelors">Bachelor's Degree</option>
                  <option value="Masters">Master's Degree</option>
                  <option value="PhD">PhD/Doctoral</option>
                  <option value="Postgraduate">Postgraduate Diploma</option>
                </select>
              </div>

              {/* Academic Background */}
              <div className="form-group-sop">
                <label className="form-label-sop">
                  <span className="label-icon">📖</span>
                  Academic Background *
                </label>
                <textarea
                  name="background"
                  value={formData.background}
                  onChange={handleChange}
                  placeholder="Describe your educational background, major, university, CGPA, etc."
                  className="form-textarea-sop"
                  rows="4"
                  required
                />
              </div>

              <div className="form-group-sop">
                <label className="form-label-sop">
                  <span className="label-icon">🏆</span>
                  Academic Achievements
                </label>
                <textarea
                  name="academicAchievements"
                  value={formData.academicAchievements}
                  onChange={handleChange}
                  placeholder="List your academic awards, honors, publications, projects, etc."
                  className="form-textarea-sop"
                  rows="3"
                />
              </div>

              {/* Professional Experience */}
              <div className="form-group-sop">
                <label className="form-label-sop">
                  <span className="label-icon">💼</span>
                  Work/Research Experience
                </label>
                <textarea
                  name="workExperience"
                  value={formData.workExperience}
                  onChange={handleChange}
                  placeholder="Describe your work experience, internships, research work, etc."
                  className="form-textarea-sop"
                  rows="4"
                />
              </div>

              <div className="form-group-sop">
                <label className="form-label-sop">
                  <span className="label-icon">🔬</span>
                  Research Interests
                </label>
                <textarea
                  name="researchInterests"
                  value={formData.researchInterests}
                  onChange={handleChange}
                  placeholder="What are your research interests and areas you want to explore?"
                  className="form-textarea-sop"
                  rows="3"
                />
              </div>

              {/* Goals and Motivation */}
              <div className="form-group-sop">
                <label className="form-label-sop">
                  <span className="label-icon">🎯</span>
                  Career Goals *
                </label>
                <textarea
                  name="careerGoals"
                  value={formData.careerGoals}
                  onChange={handleChange}
                  placeholder="What are your short-term and long-term career goals?"
                  className="form-textarea-sop"
                  rows="3"
                  required
                />
              </div>

              <div className="form-group-sop">
                <label className="form-label-sop">
                  <span className="label-icon">💡</span>
                  Why This Program? *
                </label>
                <textarea
                  name="whyThisProgram"
                  value={formData.whyThisProgram}
                  onChange={handleChange}
                  placeholder="Why are you interested in this specific program?"
                  className="form-textarea-sop"
                  rows="3"
                  required
                />
              </div>

              <div className="form-group-sop">
                <label className="form-label-sop">
                  <span className="label-icon">🏛️</span>
                  Why This University? *
                </label>
                <textarea
                  name="whyThisUniversity"
                  value={formData.whyThisUniversity}
                  onChange={handleChange}
                  placeholder="What attracts you to this university? (faculty, facilities, research opportunities, etc.)"
                  className="form-textarea-sop"
                  rows="3"
                  required
                />
              </div>

              <div className="form-group-sop">
                <label className="form-label-sop">
                  <span className="label-icon">⭐</span>
                  Unique Strengths/Skills
                </label>
                <textarea
                  name="uniqueStrengths"
                  value={formData.uniqueStrengths}
                  onChange={handleChange}
                  placeholder="What makes you stand out? Special skills, leadership, extracurricular activities, etc."
                  className="form-textarea-sop"
                  rows="3"
                />
              </div>

              <div className="form-group-sop">
                <label className="form-label-sop">
                  <span className="label-icon">📌</span>
                  Additional Information
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Any other relevant information you want to include"
                  className="form-textarea-sop"
                  rows="2"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleClear}
                  className="btn-secondary-sop"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear All
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary-sop"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate SOP
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Generated SOP Display */}
          <div className="sop-output-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-icon">📄</span>
                Generated Statement of Purpose
              </h2>
              <p className="section-subtitle">Review, edit, and save your SOP</p>
            </div>

            <div className="sop-editor">
              <textarea
                value={generatedSOP}
                onChange={(e) => setGeneratedSOP(e.target.value)}
                placeholder="Your generated SOP will appear here. You can edit it before saving."
                className="sop-textarea"
                rows="20"
              />
            </div>

            {generatedSOP && (
              <div className="sop-actions">
                <button
                  onClick={handleDownload}
                  className="btn-download-sop"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download to PC
                </button>
                <button
                  onClick={handleSaveToDB}
                  disabled={saving}
                  className="btn-save-sop"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Save to Account
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="sop-tips">
              <h3 className="tips-title">💡 Tips for a Great SOP:</h3>
              <ul className="tips-list">
                <li>Be specific about your goals and how this program aligns with them</li>
                <li>Highlight relevant experiences and achievements</li>
                <li>Show genuine interest in the university and program</li>
                <li>Keep it concise (typically 500-1000 words)</li>
                <li>Proofread carefully before submission</li>
                <li>Customize for each university - don't use a generic template</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOPHelper;
