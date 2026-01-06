import { useState, useRef } from 'react';
import api from '../utils/api';

const ProfileForm = ({ profile, onSave, onCancel }) => {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(profile?.profileImage || '');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    profileImage: profile?.profileImage || '',
    personal: {
      phone_number: profile?.personal?.phone_number || '',
      date_of_birth: profile?.personal?.date_of_birth ? new Date(profile.personal.date_of_birth).toISOString().split('T')[0] : '',
      gender: profile?.personal?.gender || '',
      nationality: profile?.personal?.nationality || '',
      address_city: profile?.personal?.address_city || '',
      address_country: profile?.personal?.address_country || ''
    },
    academic: {
      undergraduate_university_name: profile?.academic?.undergraduate_university_name || '',
      undergraduate_country: profile?.academic?.undergraduate_country || '',
      undergraduate_degree: profile?.academic?.undergraduate_degree || '',
      undergraduate_department: profile?.academic?.undergraduate_department || '',
      undergraduate_cgpa: profile?.academic?.undergraduate_cgpa || '',
      cgpa_scale: profile?.academic?.cgpa_scale || 4.0,
      undergraduate_start_year: profile?.academic?.undergraduate_start_year || '',
      undergraduate_end_year: profile?.academic?.undergraduate_end_year || ''
    },
    testScores: {
      ielts: {
        has_taken: profile?.testScores?.ielts?.has_taken || false,
        overall_band: profile?.testScores?.ielts?.overall_band || '',
        listening: profile?.testScores?.ielts?.listening || '',
        reading: profile?.testScores?.ielts?.reading || '',
        writing: profile?.testScores?.ielts?.writing || '',
        speaking: profile?.testScores?.ielts?.speaking || ''
      },
      toefl: {
        has_taken: profile?.testScores?.toefl?.has_taken || false,
        total_score: profile?.testScores?.toefl?.total_score || ''
      },
      gre: {
        has_taken: profile?.testScores?.gre?.has_taken || false,
        total_score: profile?.testScores?.gre?.total_score || '',
        quantitative: profile?.testScores?.gre?.quantitative || '',
        verbal: profile?.testScores?.gre?.verbal || '',
        analytical_writing: profile?.testScores?.gre?.analytical_writing || ''
      }
    },
    preferences: {
      target_degree: profile?.preferences?.target_degree || '',
      program: profile?.preferences?.program || '',
      target_countries: profile?.preferences?.target_countries?.join(', ') || ''
    },
    skills: {
      programming_languages: profile?.skills?.programming_languages?.join(', ') || '',
      frameworks: profile?.skills?.frameworks?.join(', ') || ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('personal');

  // Resize and compress image
  const resizeImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          const resizedBase64 = canvas.toDataURL(file.type, quality);
          resolve(resizedBase64);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle image file selection from gallery
  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      // Resize and compress the image
      const resizedImage = await resizeImage(file, 800, 800, 0.85);
      
      // Check the size of the compressed image
      const base64Size = (resizedImage.length * 3) / 4; // Approximate size in bytes
      const sizeMB = (base64Size / (1024 * 1024)).toFixed(2);
      
      setImagePreview(resizedImage);
      setFormData(prev => ({
        ...prev,
        profileImage: resizedImage
      }));
      setUploadingImage(false);
    } catch (err) {
      setError('Failed to process image. Please try again.');
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      profileImage: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        name: formData.name,
        profileImage: formData.profileImage,
        personal: formData.personal,
        academic: formData.academic,
        testScores: formData.testScores,
        preferences: {
          ...formData.preferences,
          target_countries: formData.preferences.target_countries.split(',').map(c => c.trim()).filter(Boolean)
        },
        skills: {
          programming_languages: formData.skills.programming_languages.split(',').map(s => s.trim()).filter(Boolean),
          frameworks: formData.skills.frameworks.split(',').map(s => s.trim()).filter(Boolean)
        }
      };

      const response = await api.put('/profile', payload);
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'academic', label: 'Academic' },
    { id: 'tests', label: 'Test Scores' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'skills', label: 'Skills' }
  ];

  return (
    <div className="min-h-screen py-8" style={{background: 'linear-gradient(135deg, #0a1628 0%, #1a2f4a 100%)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header with Gradient */}
          <div className="p-8 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Edit Profile</h1>
                  <p className="text-green-100 mt-1">Update your personal and academic information</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl font-semibold transition-all flex items-center gap-2 border border-white/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex overflow-x-auto px-2">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`px-6 py-4 font-semibold whitespace-nowrap transition-all relative ${
                    activeSection === section.id
                      ? 'text-green-600 bg-white'
                      : 'text-gray-600 hover:text-green-600 hover:bg-white/50'
                  }`}
                >
                  {section.label}
                  {activeSection === section.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-8">
              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl flex items-start gap-3 shadow-sm">
                  <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold">Error</p>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              {activeSection === 'personal' && (
                <div className="space-y-8">
                  {/* Profile Photo Upload Section */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">Profile Photo</h3>
                        <p className="text-sm text-gray-600 mt-1">Upload a photo - it will be automatically resized to 800x800px</p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-6">
                      {/* Image Preview */}
                      <div className="relative group">
                        {imagePreview ? (
                          <div className="relative">
                            <img 
                              src={imagePreview} 
                              alt="Profile Preview" 
                              className="h-32 w-32 rounded-2xl object-cover border-4 border-white shadow-xl ring-2 ring-green-200"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-all transform hover:scale-110"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center border-4 border-white shadow-xl ring-2 ring-green-200">
                            <svg className="w-16 h-16 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Upload Button */}
                      <div className="flex-1 text-center md:text-left">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                          id="profile-image-upload"
                        />
                        <label
                          htmlFor="profile-image-upload"
                          className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer"
                        >
                          {uploadingImage ? (
                            <>
                              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              {imagePreview ? 'Change Photo' : 'Upload Photo'}
                            </>
                          )}
                        </label>
                        <p className="text-xs text-gray-500 mt-2">Supported formats: JPG, PNG, GIF • Auto-resized & compressed</p>
                      </div>
                    </div>
                  </div>

                  {/* Personal Details Info */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-green-700">Fill in your personal details to help us provide better recommendations.</p>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.personal.phone_number}
                        onChange={(e) => handleChange('personal', 'phone_number', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={formData.personal.date_of_birth}
                        onChange={(e) => handleChange('personal', 'date_of_birth', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Gender
                      </label>
                      <select
                        value={formData.personal.gender}
                        onChange={(e) => handleChange('personal', 'gender', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Nationality
                      </label>
                      <input
                        type="text"
                        value={formData.personal.nationality}
                        onChange={(e) => handleChange('personal', 'nationality', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="American, British, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.personal.address_city}
                        onChange={(e) => handleChange('personal', 'address_city', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="New York, London, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Country
                      </label>
                      <input
                        type="text"
                        value={formData.personal.address_country}
                        onChange={(e) => handleChange('personal', 'address_country', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        placeholder="United States, United Kingdom, etc."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Academic Background */}
              {activeSection === 'academic' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Undergraduate Education</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">University Name</label>
                      <input
                        type="text"
                        value={formData.academic.undergraduate_university_name}
                        onChange={(e) => handleChange('academic', 'undergraduate_university_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <input
                        type="text"
                        value={formData.academic.undergraduate_country}
                        onChange={(e) => handleChange('academic', 'undergraduate_country', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                      <input
                        type="text"
                        value={formData.academic.undergraduate_degree}
                        onChange={(e) => handleChange('academic', 'undergraduate_degree', e.target.value)}
                        placeholder="e.g., Bachelor of Science"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department/Major</label>
                      <input
                        type="text"
                        value={formData.academic.undergraduate_department}
                        onChange={(e) => handleChange('academic', 'undergraduate_department', e.target.value)}
                        placeholder="e.g., Computer Science"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.academic.undergraduate_cgpa}
                        onChange={(e) => handleChange('academic', 'undergraduate_cgpa', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CGPA Scale</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.academic.cgpa_scale}
                        onChange={(e) => handleChange('academic', 'cgpa_scale', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Year</label>
                      <input
                        type="number"
                        value={formData.academic.undergraduate_start_year}
                        onChange={(e) => handleChange('academic', 'undergraduate_start_year', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Year</label>
                      <input
                        type="number"
                        value={formData.academic.undergraduate_end_year}
                        onChange={(e) => handleChange('academic', 'undergraduate_end_year', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Test Scores */}
              {activeSection === 'tests' && (
                <div className="space-y-6">
                  {/* IELTS */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        checked={formData.testScores.ielts.has_taken}
                        onChange={(e) => handleChange('testScores', 'ielts', { ...formData.testScores.ielts, has_taken: e.target.checked })}
                        className="mr-2"
                      />
                      <label className="text-lg font-semibold text-gray-900">IELTS</label>
                    </div>
                    {formData.testScores.ielts.has_taken && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Overall Band</label>
                          <input
                            type="number"
                            step="0.5"
                            value={formData.testScores.ielts.overall_band}
                            onChange={(e) => handleChange('testScores', 'ielts', { ...formData.testScores.ielts, overall_band: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Listening</label>
                          <input
                            type="number"
                            step="0.5"
                            value={formData.testScores.ielts.listening}
                            onChange={(e) => handleChange('testScores', 'ielts', { ...formData.testScores.ielts, listening: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Reading</label>
                          <input
                            type="number"
                            step="0.5"
                            value={formData.testScores.ielts.reading}
                            onChange={(e) => handleChange('testScores', 'ielts', { ...formData.testScores.ielts, reading: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Writing</label>
                          <input
                            type="number"
                            step="0.5"
                            value={formData.testScores.ielts.writing}
                            onChange={(e) => handleChange('testScores', 'ielts', { ...formData.testScores.ielts, writing: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Speaking</label>
                          <input
                            type="number"
                            step="0.5"
                            value={formData.testScores.ielts.speaking}
                            onChange={(e) => handleChange('testScores', 'ielts', { ...formData.testScores.ielts, speaking: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* TOEFL */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        checked={formData.testScores.toefl.has_taken}
                        onChange={(e) => handleChange('testScores', 'toefl', { ...formData.testScores.toefl, has_taken: e.target.checked })}
                        className="mr-2"
                      />
                      <label className="text-lg font-semibold text-gray-900">TOEFL</label>
                    </div>
                    {formData.testScores.toefl.has_taken && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Score</label>
                        <input
                          type="number"
                          value={formData.testScores.toefl.total_score}
                          onChange={(e) => handleChange('testScores', 'toefl', { ...formData.testScores.toefl, total_score: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  {/* GRE */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        checked={formData.testScores.gre.has_taken}
                        onChange={(e) => handleChange('testScores', 'gre', { ...formData.testScores.gre, has_taken: e.target.checked })}
                        className="mr-2"
                      />
                      <label className="text-lg font-semibold text-gray-900">GRE</label>
                    </div>
                    {formData.testScores.gre.has_taken && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Total Score</label>
                          <input
                            type="number"
                            value={formData.testScores.gre.total_score}
                            onChange={(e) => handleChange('testScores', 'gre', { ...formData.testScores.gre, total_score: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Quantitative</label>
                          <input
                            type="number"
                            value={formData.testScores.gre.quantitative}
                            onChange={(e) => handleChange('testScores', 'gre', { ...formData.testScores.gre, quantitative: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Verbal</label>
                          <input
                            type="number"
                            value={formData.testScores.gre.verbal}
                            onChange={(e) => handleChange('testScores', 'gre', { ...formData.testScores.gre, verbal: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">AWA</label>
                          <input
                            type="number"
                            step="0.5"
                            value={formData.testScores.gre.analytical_writing}
                            onChange={(e) => handleChange('testScores', 'gre', { ...formData.testScores.gre, analytical_writing: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Study Preferences */}
              {activeSection === 'preferences' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Target Degree</label>
                      <select
                        value={formData.preferences.target_degree}
                        onChange={(e) => handleChange('preferences', 'target_degree', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">Select Degree</option>
                        <option value="Bachelors">Bachelors</option>
                        <option value="Masters">Masters</option>
                        <option value="PhD">PhD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                      <input
                        type="text"
                        value={formData.preferences.program}
                        onChange={(e) => handleChange('preferences', 'program', e.target.value)}
                        placeholder="e.g., Computer Science"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Target Countries (comma-separated)</label>
                      <input
                        type="text"
                        value={formData.preferences.target_countries}
                        onChange={(e) => handleChange('preferences', 'target_countries', e.target.value)}
                        placeholder="USA, Canada, UK, Germany"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Skills */}
              {activeSection === 'skills' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Programming Languages (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.skills.programming_languages}
                      onChange={(e) => handleChange('skills', 'programming_languages', e.target.value)}
                      placeholder="Python, JavaScript, Java"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frameworks (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.skills.frameworks}
                      onChange={(e) => handleChange('skills', 'frameworks', e.target.value)}
                      placeholder="React, Node.js, Django"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-8 border-t bg-gradient-to-r from-gray-50 to-white flex justify-end space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all flex items-center gap-2 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
