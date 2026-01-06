import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import ProfileForm from '../components/ProfileForm';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      setProfile(response.data.user);
    } catch (error) {
      // Silently fail - will show empty form
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #0a1628 0%, #1a2f4a 100%)'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-400 mx-auto"></div>
          <p className="mt-4 text-white font-medium text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (editing) {
    return (
      <ProfileForm 
        profile={profile} 
        onSave={() => {
          setEditing(false);
          fetchProfile();
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="min-h-screen py-8" style={{background: 'linear-gradient(135deg, #0a1628 0%, #1a2f4a 100%)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-6">
              <div className="relative">
                {profile?.profileImage ? (
                  <img src={profile.profileImage} alt="Profile" className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg" />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-white text-green-600 flex items-center justify-center text-3xl font-bold shadow-lg">
                    {profile?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 h-6 w-6 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">{profile?.name || 'Student'}</h1>
                <p className="text-green-100 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  {profile?.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="px-6 py-3 bg-white text-green-600 rounded-xl hover:bg-green-50 font-semibold shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>

        {/* Personal Information */}
        {profile?.personal && Object.values(profile.personal).some(v => v) && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.personal.phone_number && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-50 rounded-lg mt-1">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                    <p className="text-gray-900 font-semibold">{profile.personal.phone_number}</p>
                  </div>
                </div>
              )}
              {profile.personal.date_of_birth && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg mt-1">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Date of Birth</p>
                    <p className="text-gray-900 font-semibold">{new Date(profile.personal.date_of_birth).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
              {profile.personal.nationality && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-50 rounded-lg mt-1">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Nationality</p>
                    <p className="text-gray-900 font-semibold">{profile.personal.nationality}</p>
                  </div>
                </div>
              )}
              {profile.personal.address_city && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-50 rounded-lg mt-1">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Location</p>
                    <p className="text-gray-900 font-semibold">{profile.personal.address_city}, {profile.personal.address_country}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Academic Background */}
        {profile?.academic && Object.values(profile.academic).some(v => v) && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Academic Background</h2>
            </div>
            <div className="space-y-4">
              {profile.academic.undergraduate_university_name && (
                <div className="border-l-4 border-emerald-500 pl-6 py-4 bg-gradient-to-r from-purple-50 to-transparent rounded-r-xl">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{profile.academic.undergraduate_degree}</h3>
                  <div className="space-y-2">
                    <p className="text-gray-800 font-semibold flex items-center gap-2">
                      <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {profile.academic.undergraduate_university_name}, {profile.academic.undergraduate_country}
                    </p>
                    <p className="text-gray-700 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                      </svg>
                      {profile.academic.undergraduate_department}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full font-bold text-sm">
                        CGPA: {profile.academic.undergraduate_cgpa}/{profile.academic.cgpa_scale || 4.0}
                      </span>
                      <span className="text-gray-600 font-medium">
                        {profile.academic.undergraduate_start_year} - {profile.academic.undergraduate_end_year}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Test Scores */}
        {profile?.testScores && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Test Scores</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.testScores.ielts?.has_taken && (
                <div className="border-2 border-green-100 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl text-gray-900">IELTS</h3>
                    <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-bold">{profile.testScores.ielts.overall_band}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Listening</span>
                      <span className="font-bold text-gray-900">{profile.testScores.ielts.listening}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Reading</span>
                      <span className="font-bold text-gray-900">{profile.testScores.ielts.reading}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Writing</span>
                      <span className="font-bold text-gray-900">{profile.testScores.ielts.writing}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">Speaking</span>
                      <span className="font-bold text-gray-900">{profile.testScores.ielts.speaking}</span>
                    </div>
                  </div>
                </div>
              )}
              {profile.testScores.toefl?.has_taken && (
                <div className="border-2 border-green-100 rounded-xl p-6 bg-gradient-to-br from-green-50 to-white hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl text-gray-900">TOEFL</h3>
                    <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-bold">{profile.testScores.toefl.total_score}</span>
                  </div>
                  <p className="text-gray-600">Total Score</p>
                </div>
              )}
              {profile.testScores.gre?.has_taken && (
                <div className="border-2 border-emerald-100 rounded-xl p-6 bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl text-gray-900">GRE</h3>
                    <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-sm font-bold">{profile.testScores.gre.total_score}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Quantitative</span>
                      <span className="font-bold text-gray-900">{profile.testScores.gre.quantitative}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Verbal</span>
                      <span className="font-bold text-gray-900">{profile.testScores.gre.verbal}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">AWA</span>
                      <span className="font-bold text-gray-900">{profile.testScores.gre.analytical_writing}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Study Preferences */}
        {profile?.preferences && Object.values(profile.preferences).some(v => v) && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Study Preferences</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.preferences.target_degree && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-50 rounded-lg mt-1">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Target Degree</p>
                    <p className="text-gray-900 font-semibold text-lg">{profile.preferences.target_degree}</p>
                  </div>
                </div>
              )}
              {profile.preferences.program && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-50 rounded-lg mt-1">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Program</p>
                    <p className="text-gray-900 font-semibold text-lg">{profile.preferences.program}</p>
                  </div>
                </div>
              )}
              {profile.preferences.target_countries?.length > 0 && (
                <div className="md:col-span-2 flex items-start gap-3">
                  <div className="p-2 bg-red-50 rounded-lg mt-1">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-2">Target Countries</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.preferences.target_countries.map((country, idx) => (
                        <span key={idx} className="px-4 py-2 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 rounded-full font-semibold text-sm border border-red-200">
                          {country}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Experience */}
        {profile?.experience?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
            </div>
            <div className="space-y-6">
              {profile.experience.map((exp, idx) => (
                <div key={idx} className="border-l-4 border-orange-500 pl-6 py-4 bg-gradient-to-r from-orange-50 to-transparent rounded-r-xl hover:from-orange-100 transition-colors">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-bold text-xl text-gray-900">{exp.position}</h3>
                      <p className="text-gray-800 font-semibold mt-1">{exp.company}</p>
                    </div>
                    {exp.is_current && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Current</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mt-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {new Date(exp.start_date).toLocaleDateString()} - {exp.is_current ? 'Present' : new Date(exp.end_date).toLocaleDateString()}
                  </p>
                  {exp.description && <p className="text-gray-700 mt-3 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {profile?.skills && (profile.skills.programming_languages?.length > 0 || profile.skills.frameworks?.length > 0) && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Skills & Expertise</h2>
            </div>
            <div className="space-y-6">
              {profile.skills.programming_languages?.length > 0 && (
                <div>
                  <p className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Programming Languages
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {profile.skills.programming_languages.map((lang, idx) => (
                      <span key={idx} className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-shadow">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile.skills.frameworks?.length > 0 && (
                <div>
                  <p className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                    </svg>
                    Frameworks & Technologies
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {profile.skills.frameworks.map((fw, idx) => (
                      <span key={idx} className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-shadow">
                        {fw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
