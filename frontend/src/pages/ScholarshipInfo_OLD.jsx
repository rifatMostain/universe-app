import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/ScholarshipInfo.css';

const ScholarshipInfo = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedDeadline, setSelectedDeadline] = useState('All');
  const [showEligibilityCheck, setShowEligibilityCheck] = useState(false);
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
      coverage: "Tuition, airfare, living stipend, health insurance"
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
      coverage: "Full tuition, travel costs, monthly stipend"
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
      coverage: "Monthly stipend, health insurance, travel allowance"
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
      coverage: "Tuition fees, travel, installation costs, monthly allowance"
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
      coverage: "Tuition, monthly allowance, airfare"
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
      coverage: "Tuition waiver, accommodation, living allowance"
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
      coverage: "Airfare, tuition, living expenses"
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
      coverage: "Full cost of studying, maintenance allowance, flights"
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
      coverage: "Full tuition, stipend, airfare, health insurance"
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
      coverage: "Monthly allowance, tuition waiver, health insurance"
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
      coverage: "Partial to full tuition, monthly allowance"
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
      coverage: "Full tuition, return air travel, establishment allowance"
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
      coverage: "Tuition, living costs, travel, insurance"
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
      coverage: "Full tuition and living expenses"
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
      coverage: "Tuition fees, monthly allowance, accommodation"
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
      coverage: "$50,000 per year for 3 years"
    },
    {
      id: 17,
      name: "Gates Foundation Scholarship",
      country: "USA",
      website: "https://www.gatesfoundation.org/",
      description: "Bill & Melinda Gates Foundation scholarship program.",
      level: "Undergraduate",
      deadline: "September",
      eligibility: "Minority students, Pell Grant eligible, high GPA, leadership",
      coverage: "Full cost of attendance"
    },
    {
      id: 18,
      name: "Ada Lovelace Scholarship",
      country: "Various",
      website: "https://www.adalovelaceinstitute.org/",
      description: "Scholarship for women in STEM fields.",
      level: "Undergraduate, Masters",
      deadline: "Varies",
      eligibility: "Women in technology, mathematics, engineering",
      coverage: "Varies by program"
    },
    {
      id: 19,
      name: "Google Anita Borg Scholarship",
      country: "Various",
      website: "https://www.microsoft.com/en-us/research/academic-programs/",
      description: "Scholarship for women in computing.",
      level: "Undergraduate, Masters, PhD",
      deadline: "December",
      eligibility: "Women in computer science, strong academic record",
      coverage: "$10,000 (USD) or equivalent"
    },
    {
      id: 20,
      name: "Microsoft Research Scholarship",
      country: "USA",
      website: "https://www.microsoft.com/en-us/research/academic-programs/",
      description: "For students pursuing research in computer science.",
      level: "PhD",
      deadline: "Rolling",
      eligibility: "PhD students, research in CS/AI, strong academic background",
      coverage: "Full tuition, research funding"
    },
    {
      id: 21,
      name: "Russian Government Scholarship",
      country: "Russia",
      website: "https://russia.study/ru",
      description: "Study in Russia scholarship program.",
      level: "Undergraduate, Masters, PhD",
      deadline: "February - March",
      eligibility: "International students, age limits, medical certificate",
      coverage: "Full tuition, accommodation, monthly stipend"
    },
    {
      id: 22,
      name: "British Chevening Scholarship (Bangladesh)",
      country: "UK",
      website: "https://www.chevening.org/scholarship/bangladesh/",
      description: "Chevening scholarship specifically for Bangladeshi students.",
      level: "Masters",
      deadline: "November",
      eligibility: "Bangladeshi citizen, 2+ years work experience, return commitment",
      coverage: "Tuition, living allowance, travel costs"
    },
    {
      id: 23,
      name: "Italian Government Scholarship",
      country: "Italy",
      website: "https://www.esteri.it/en/opportunita/borse-di-studio/",
      description: "Italian Ministry of Foreign Affairs scholarship.",
      level: "Undergraduate, Masters, PhD",
      deadline: "April - May",
      eligibility: "International students, academic merit, Italian or English proficiency",
      coverage: "Tuition, health insurance, monthly allowance"
    },
    {
      id: 24,
      name: "Türkiye Burslari Scholarship",
      country: "Turkey",
      website: "https://turkiyeburslari.gov.tr/en/page/prospective-students/",
      description: "Turkish government scholarship for international students.",
      level: "Undergraduate, Masters, PhD",
      deadline: "February - March",
      eligibility: "Age under 21 (UG), 30 (Masters), 35 (PhD), good academic record",
      coverage: "Full tuition, accommodation, health insurance, airfare"
    },
    {
      id: 25,
      name: "Danish Government Scholarship",
      country: "Denmark",
      website: "https://studyindenmark.dk/study-options/tuition-fees-scholarships/tuition-fees-and-scholarships",
      description: "Scholarships for non-EU/EEA students in Denmark.",
      level: "Undergraduate, Masters",
      deadline: "Varies by university",
      eligibility: "Non-EU/EEA students, admission to Danish university",
      coverage: "Full or partial tuition waiver"
    },
    {
      id: 26,
      name: "Cambridge Trust Scholarship",
      country: "UK",
      website: "https://www.cambridgetrust.org/",
      description: "International scholarship at Cambridge University.",
      level: "Masters, PhD",
      deadline: "December - January",
      eligibility: "Outstanding academic achievement, Cambridge admission",
      coverage: "Full or partial funding"
    },
    {
      id: 27,
      name: "Rotary International Scholarship",
      country: "Various",
      website: "https://www.rotary.org/en/our-programs/scholarships",
      description: "Global scholarship from Rotary Foundation.",
      level: "Masters",
      deadline: "Varies by district",
      eligibility: "Rotary district selection, commitment to peace/conflict resolution",
      coverage: "Up to $30,000 for graduate study"
    },
    {
      id: 28,
      name: "NASA Internship & Scholarship",
      country: "USA",
      website: "https://intern.nasa.gov/",
      description: "Internship and scholarship opportunities at NASA.",
      level: "Undergraduate, Masters, PhD",
      deadline: "Rolling (3 sessions/year)",
      eligibility: "US citizen or permanent resident, STEM field, GPA 3.0+",
      coverage: "Stipend, housing allowance (for interns)"
    },
    {
      id: 29,
      name: "UNESCO Scholarship",
      country: "Various",
      website: "https://en.unesco.org/fellowships",
      description: "UNESCO fellowships for education and research.",
      level: "Masters, PhD, Research",
      deadline: "Varies by program",
      eligibility: "Varies by fellowship, focus on education/science/culture",
      coverage: "Varies by program"
    }
  ];

  // Get unique countries
  const countries = ['All', ...new Set(scholarships.map(s => s.country))];

  // Filter scholarships
  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scholarship.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'All' || scholarship.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎓 World's Top 29 Scholarships
          </h1>
          <p className="text-xl text-gray-600">
            Find the perfect scholarship opportunity for your study abroad journey
          </p>
        </div>

        {/* Search and Filter */}
        <div className="card mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Scholarships
              </label>
              <input
                type="text"
                placeholder="Search by name, country, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredScholarships.length} of {scholarships.length} scholarships
          </div>
        </div>

        {/* Scholarships Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map((scholarship) => (
            <div
              key={scholarship.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-700 to-green-800 p-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-white pr-2">
                    {scholarship.name}
                  </h3>
                  <span className="px-3 py-1 bg-white text-emerald-700 text-xs font-semibold rounded-full whitespace-nowrap">
                    {scholarship.country}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                  {scholarship.description}
                </p>
                
                {/* Info Grid */}
                <div className="space-y-3 mb-5">
                  {/* Level */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-start">
                      <span className="text-emerald-600 text-lg mr-3">📚</span>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Level</p>
                        <p className="text-sm text-gray-800 font-medium">{scholarship.level}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Deadline */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-start">
                      <span className="text-emerald-600 text-lg mr-3">📅</span>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Deadline</p>
                        <p className="text-sm text-gray-800 font-medium">{scholarship.deadline}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Criteria */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-start">
                      <span className="text-emerald-600 text-lg mr-3">✅</span>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Criteria</p>
                        <p className="text-sm text-gray-800">{scholarship.eligibility}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Coverage */}
                  <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                    <div className="flex items-start">
                      <span className="text-emerald-600 text-lg mr-3">💰</span>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-emerald-700 uppercase mb-1">Coverage</p>
                        <p className="text-sm text-gray-800 font-medium">{scholarship.coverage}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Button */}
                <a
                  href={scholarship.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-sm"
                >
                  Visit Official Website →
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredScholarships.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No scholarships found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCountry('All');
              }}
              className="mt-4 text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-gradient-to-r from-emerald-600 to-green-700 rounded-lg shadow-md p-6 text-white">
          <h2 className="text-2xl font-bold mb-4">💡 Tips for Scholarship Applications</h2>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Start your application process at least 6-12 months in advance</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Read all eligibility criteria carefully before applying</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Prepare a strong Statement of Purpose (SOP) and CV</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Get recommendation letters from professors or employers</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Keep track of application deadlines using a calendar</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipInfo;
