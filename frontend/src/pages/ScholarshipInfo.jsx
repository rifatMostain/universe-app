import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/ScholarshipInfo.css';

const ScholarshipInfo = () => {
  const { user } = useAuth();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedDeadline, setSelectedDeadline] = useState('All');
  const [savedScholarships, setSavedScholarships] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'deadline', 'country'

  const scholarships = [
    {
      id: 1,
      name: "Fulbright Scholarship",
      country: "USA",
      website: "https://foreign.fulbrightonline.org/",
      description: "One of the most prestigious international educational exchange programs in the world.",
      level: "Masters, PhD",
      deadline: "May - October (varies by country)",
      eligibility: "Bachelor's degree, English proficiency, leadership potential",
      coverage: "Tuition, airfare, living stipend, health insurance",
      fundingType: "Fully Funded"
    },
    {
      id: 2,
      name: "Chevening Scholarship",
      country: "UK",
      website: "https://www.chevening.org/",
      description: "UK government's global scholarship program for future leaders.",
      level: "Masters",
      deadline: "November (annual)",
      eligibility: "2+ years work experience, leadership qualities, UK university offer",
      coverage: "Full tuition, travel costs, monthly stipend",
      fundingType: "Fully Funded"
    },
    {
      id: 3,
      name: "DAAD Scholarship",
      country: "Germany",
      website: "https://www.daad.de/en/",
      description: "German Academic Exchange Service scholarship for international students.",
      level: "Masters, PhD",
      deadline: "October - November",
      eligibility: "Bachelor's degree, academic excellence, German or English proficiency",
      coverage: "Monthly stipend, health insurance, travel allowance",
      fundingType: "Fully Funded"
    },
    {
      id: 4,
      name: "Erasmus Mundus Scholarship",
      country: "Europe",
      website: "https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en",
      description: "Joint Masters and Doctoral programs across European universities.",
      level: "Masters, PhD",
      deadline: "December - January",
      eligibility: "Bachelor's degree, academic merit, language requirements vary",
      coverage: "Tuition fees, travel, installation costs, monthly allowance",
      fundingType: "Fully Funded"
    },
    {
      id: 5,
      name: "MEXT Scholarship",
      country: "Japan",
      website: "https://www.studyinjapan.go.jp/en/",
      description: "Japanese government scholarship for international students.",
      level: "Undergraduate, Masters, PhD",
      deadline: "April - May",
      eligibility: "Age limit varies, good academic record, health certificate",
      coverage: "Tuition, monthly allowance, airfare",
      fundingType: "Fully Funded"
    },
    {
      id: 6,
      name: "CSC Scholarship",
      country: "China",
      website: "https://www.csc.edu.cn/",
      description: "Chinese Government Scholarship Council program.",
      level: "Undergraduate, Masters, PhD",
      deadline: "January - April",
      eligibility: "Good health, academic excellence, age limits apply",
      coverage: "Tuition waiver, accommodation, living allowance",
      fundingType: "Fully Funded"
    },
    {
      id: 7,
      name: "Commonwealth Scholarship",
      country: "UK",
      website: "https://cscuk.fcdo.gov.uk/",
      description: "For students from low and middle-income Commonwealth countries.",
      level: "Masters, PhD",
      deadline: "December - January",
      eligibility: "Commonwealth citizen, academic merit, return to home country",
      coverage: "Airfare, tuition, living expenses",
      fundingType: "Fully Funded"
    },
    {
      id: 8,
      name: "Gates Cambridge Scholarship",
      country: "UK",
      website: "https://www.gatescambridge.org/",
      description: "Full-cost scholarship for postgraduate study at Cambridge.",
      level: "Masters, PhD",
      deadline: "October - December",
      eligibility: "Outstanding academic achievement, leadership potential, commitment to others",
      coverage: "Full cost of studying, maintenance allowance, flights",
      fundingType: "Fully Funded"
    },
    {
      id: 9,
      name: "Rhodes Scholarship",
      country: "UK",
      website: "https://www.rhodeshouse.ox.ac.uk/",
      description: "World's oldest and most prestigious international scholarship at Oxford.",
      level: "Masters, PhD",
      deadline: "September - October",
      eligibility: "Age 18-28, exceptional academic achievement, leadership, character",
      coverage: "Full tuition, stipend, airfare, health insurance",
      fundingType: "Fully Funded"
    },
    {
      id: 10,
      name: "Swiss Excellence Scholarship",
      country: "Switzerland",
      website: "https://www.sbfi.admin.ch/sbfi/en/home/education/scholarships-and-grants.html",
      description: "For international postgraduate researchers in Switzerland.",
      level: "Masters, PhD",
      deadline: "September - December",
      eligibility: "Master's or equivalent degree, research proposal, academic excellence",
      coverage: "Monthly allowance, tuition waiver, health insurance",
      fundingType: "Fully Funded"
    },
    {
      id: 11,
      name: "Netherlands Scholarship",
      country: "Netherlands",
      website: "https://www.studyinnl.org/finances/scholarships",
      description: "Scholarships for international students in Holland.",
      level: "Undergraduate, Masters",
      deadline: "February - May",
      eligibility: "Non-EU/EEA students, admission to Dutch university",
      coverage: "Partial to full tuition, monthly allowance",
      fundingType: "Partial/Full"
    },
    {
      id: 12,
      name: "Australia Awards Scholarship",
      country: "Australia",
      website: "https://www.dfat.gov.au/people-to-people/australia-awards",
      description: "Australian government scholarship for developing countries.",
      level: "Masters, PhD",
      deadline: "April - May",
      eligibility: "From developing countries, return commitment, leadership potential",
      coverage: "Full tuition, return air travel, establishment allowance",
      fundingType: "Fully Funded"
    },
    {
      id: 13,
      name: "New Zealand Scholarship",
      country: "New Zealand",
      website: "https://www.studywithnewzealand.govt.nz/scholarships",
      description: "New Zealand government funding for international students.",
      level: "Undergraduate, Masters, PhD",
      deadline: "July - August",
      eligibility: "From eligible countries, academic merit, English proficiency",
      coverage: "Tuition, living costs, travel, insurance",
      fundingType: "Fully Funded"
    },
    {
      id: 14,
      name: "Oxford Clarendon Scholarship",
      country: "UK",
      website: "https://www.ox.ac.uk/clarendon",
      description: "Graduate scholarship at Oxford University.",
      level: "Masters, PhD",
      deadline: "January",
      eligibility: "Outstanding academic merit, Oxford admission",
      coverage: "Full tuition and living expenses",
      fundingType: "Fully Funded"
    },
    {
      id: 15,
      name: "Singapore Government Scholarship",
      country: "Singapore",
      website: "https://www.moe.gov.sg/financial-matters/awards-scholarships",
      description: "Singaporean government scholarship for international students.",
      level: "Undergraduate, Masters, PhD",
      deadline: "February - March",
      eligibility: "Excellent academic record, leadership qualities, bond requirements",
      coverage: "Tuition fees, monthly allowance, accommodation",
      fundingType: "Fully Funded"
    },
    {
      id: 16,
      name: "Canada Vanier Scholarship",
      country: "Canada",
      website: "https://vanier.gc.ca/",
      description: "Doctoral scholarship for high-achieving students.",
      level: "PhD",
      deadline: "November",
      eligibility: "Nominated by Canadian university, leadership, academic excellence",
      coverage: "$50,000 per year for 3 years",
      fundingType: "Fully Funded"
    },
    {
      id: 17,
      name: "Türkiye Burslari Scholarship",
      country: "Turkey",
      website: "https://turkiyeburslari.gov.tr/en/page/prospective-students/",
      description: "Turkish government scholarship for international students.",
      level: "Undergraduate, Masters, PhD",
      deadline: "February - March",
      eligibility: "Age under 21 (UG), 30 (Masters), 35 (PhD), good academic record",
      coverage: "Full tuition, accommodation, health insurance, airfare",
      fundingType: "Fully Funded"
    },
    {
      id: 18,
      name: "Russian Government Scholarship",
      country: "Russia",
      website: "https://russia.study/ru",
      description: "Study in Russia scholarship program.",
      level: "Undergraduate, Masters, PhD",
      deadline: "February - March",
      eligibility: "International students, age limits, medical certificate",
      coverage: "Full tuition, accommodation, monthly stipend",
      fundingType: "Fully Funded"
    }
  ];

  // Get unique filter options
  const countries = ['All', ...new Set(scholarships.map(s => s.country))].sort();
  const levels = ['All', 'Undergraduate', 'Masters', 'PhD'];
  const deadlineOptions = ['All', 'Upcoming (Next 3 Months)', 'Rolling Deadlines', 'Annual Deadlines'];

  // Filter and sort scholarships
  const filteredScholarships = useMemo(() => {
    let filtered = scholarships.filter(scholarship => {
      const matchesSearch = 
        scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.eligibility.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCountry = selectedCountry === 'All' || scholarship.country === selectedCountry;
      const matchesLevel = selectedLevel === 'All' || scholarship.level.includes(selectedLevel);
      
      // Deadline filtering
      let matchesDeadline = true;
      if (selectedDeadline !== 'All') {
        const deadlineLower = scholarship.deadline.toLowerCase();
        if (selectedDeadline === 'Upcoming (Next 3 Months)') {
          // Check for specific months in the next 3 months
          const currentMonth = new Date().getMonth(); // 0-11
          const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
          const next3Months = [months[currentMonth], months[(currentMonth + 1) % 12], months[(currentMonth + 2) % 12]];
          matchesDeadline = next3Months.some(month => deadlineLower.includes(month));
        } else if (selectedDeadline === 'Rolling Deadlines') {
          matchesDeadline = deadlineLower.includes('rolling') || deadlineLower.includes('open');
        } else if (selectedDeadline === 'Annual Deadlines') {
          matchesDeadline = deadlineLower.includes('annual') || deadlineLower.includes('yearly');
        }
      }
      
      return matchesSearch && matchesCountry && matchesLevel && matchesDeadline;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'country') return a.country.localeCompare(b.country);
      if (sortBy === 'deadline') return a.deadline.localeCompare(b.deadline);
      return 0;
    });

    return filtered;
  }, [searchTerm, selectedCountry, selectedLevel, selectedDeadline, sortBy]);

  // Toggle save
  const toggleSave = (id) => {
    setSavedScholarships(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCountry('All');
    setSelectedLevel('All');
    setSelectedDeadline('All');
  };

  return (
    <div className="scholarship-page-modern">
      {/* Hero Section */}
      <div className="scholarship-hero">
        <div className="scholarship-hero-content">
          <div className="hero-badge-scholarship">
            <span>✨</span> Your Path to Global Education
          </div>
          <h1 className="hero-title-scholarship">
            Discover {scholarships.length}+ Scholarships Worldwide
          </h1>
          <p className="hero-subtitle-scholarship">
            Find fully-funded opportunities for undergraduate, masters, and PhD programs across the globe
          </p>
          
          <div className="hero-stats-scholarship">
            <div className="stat-card-scholarship">
              <div className="stat-number-scholarship">{filteredScholarships.length}</div>
              <div className="stat-label-scholarship">Scholarships</div>
            </div>
            <div className="stat-card-scholarship">
              <div className="stat-number-scholarship">{countries.length - 1}</div>
              <div className="stat-label-scholarship">Countries</div>
            </div>
            <div className="stat-card-scholarship">
              <div className="stat-number-scholarship">{savedScholarships.length}</div>
              <div className="stat-label-scholarship">Saved</div>
            </div>
          </div>
        </div>
      </div>

      <div className="scholarship-container-modern">
        {/* Filter Section */}
        <div className="filter-section-modern">
          <div className="filter-header-modern">
            <h2 className="filter-title-modern">
              <span className="filter-icon">🔍</span>
              Find Your Scholarship
            </h2>
            <button onClick={clearFilters} className="btn-clear-filters">
              Clear All Filters
            </button>
          </div>

          <div className="filters-grid-modern">
            {/* Search */}
            <div className="filter-group-modern full-width-filter">
              <label className="filter-label-modern">
                <span className="label-icon-modern">🔎</span>
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name, country, description, or eligibility..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input-modern"
              />
            </div>

            {/* Country */}
            <div className="filter-group-modern">
              <label className="filter-label-modern">
                <span className="label-icon-modern">🌍</span>
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="filter-input-modern"
              >
                {countries.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div className="filter-group-modern">
              <label className="filter-label-modern">
                <span className="label-icon-modern">📚</span>
                Study Level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="filter-input-modern"
              >
                {levels.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Deadline */}
            <div className="filter-group-modern">
              <label className="filter-label-modern">
                <span className="label-icon-modern">📅</span>
                Deadline
              </label>
              <select
                value={selectedDeadline}
                onChange={(e) => setSelectedDeadline(e.target.value)}
                className="filter-input-modern"
              >
                {deadlineOptions.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="filter-group-modern">
              <label className="filter-label-modern">
                <span className="label-icon-modern">⬍</span>
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-input-modern"
              >
                <option value="name">Name (A-Z)</option>
                <option value="country">Country</option>
                <option value="deadline">Deadline</option>
              </select>
            </div>
          </div>

          {/* View Toggle */}
          <div className="view-controls-modern">
            <span className="view-label-modern">View:</span>
            <div className="view-toggle-modern">
              <button 
                className={`view-btn-modern ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                ⊞ Grid
              </button>
              <button 
                className={`view-btn-modern ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                ☰ List
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-header-modern">
          <p className="results-count-modern">
            Showing <strong>{filteredScholarships.length}</strong> of <strong>{scholarships.length}</strong> scholarships
          </p>
        </div>

        {/* Scholarships Grid/List */}
        <div className={`scholarships-display ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
          {filteredScholarships.map(scholarship => (
            <div key={scholarship.id} className={`scholarship-card-modern ${viewMode}`}>
              {/* Header */}
              <div className="scholarship-card-header">
                <div className="scholarship-title-section">
                  <h3 className="scholarship-name">{scholarship.name}</h3>
                  <span className="scholarship-country-badge">{scholarship.country}</span>
                </div>
                <button 
                  className={`save-btn ${savedScholarships.includes(scholarship.id) ? 'saved' : ''}`}
                  onClick={() => toggleSave(scholarship.id)}
                  title={savedScholarships.includes(scholarship.id) ? 'Unsave' : 'Save'}
                >
                  {savedScholarships.includes(scholarship.id) ? '❤️' : '🤍'}
                </button>
              </div>

              {/* Description */}
              <p className="scholarship-description">{scholarship.description}</p>

              {/* Details Grid */}
              <div className="scholarship-details">
                <div className="detail-item">
                  <span className="detail-icon">📚</span>
                  <div>
                    <div className="detail-label">Level</div>
                    <div className="detail-value">{scholarship.level}</div>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <div>
                    <div className="detail-label">Deadline</div>
                    <div className="detail-value">{scholarship.deadline}</div>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-icon">✅</span>
                  <div>
                    <div className="detail-label">Eligibility</div>
                    <div className="detail-value">{scholarship.eligibility}</div>
                  </div>
                </div>

                <div className="detail-item highlighted">
                  <span className="detail-icon">💰</span>
                  <div>
                    <div className="detail-label">Coverage</div>
                    <div className="detail-value">{scholarship.coverage}</div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="scholarship-card-footer">
                <span className="funding-badge">{scholarship.fundingType}</span>
                <a 
                  href={scholarship.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apply-btn-modern"
                >
                  Visit Website →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredScholarships.length === 0 && (
          <div className="no-results-modern">
            <div className="no-results-icon">🔍</div>
            <h3>No scholarships found</h3>
            <p>Try adjusting your filters or search term</p>
            <button onClick={clearFilters} className="btn-reset-modern">
              Reset All Filters
            </button>
          </div>
        )}

        {/* Tips Section */}
        <div className="tips-section-modern">
          <h2 className="tips-title">💡 Scholarship Application Tips</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <span className="tip-icon">📅</span>
              <h3>Start Early</h3>
              <p>Begin your application process 6-12 months before the deadline to prepare strong documents.</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">📝</span>
              <h3>Strong SOP</h3>
              <p>Write a compelling Statement of Purpose that highlights your goals and achievements.</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">👥</span>
              <h3>Get References</h3>
              <p>Request recommendation letters from professors or employers who know you well.</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">🎯</span>
              <h3>Meet Requirements</h3>
              <p>Carefully read and fulfill all eligibility criteria before applying.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipInfo;
