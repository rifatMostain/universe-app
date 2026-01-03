const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Get university recommendations using Gemini AI
 */
exports.getUniversityRecommendations = async (req, res) => {
  try {
    const studentProfile = req.body;

    // Validate required fields
    if (!studentProfile.degree || !studentProfile.field) {
      return res.status(400).json({
        success: false,
        error: 'Degree level and field of study are required'
      });
    }

    // Prepare the prompt for Gemini AI
    const prompt = `You are an expert international education consultant specializing in advising Bangladeshi students for higher studies abroad.

Context:
You have comprehensive knowledge of global universities, their programs, rankings (QS, THE, ARWU), admission requirements, costs, and opportunities. You must provide accurate, realistic recommendations based on your knowledge of international higher education as of 2026.

Student Profile:
- Degree Level: ${studentProfile.degree || 'Not specified'}
- Field of Study: ${studentProfile.field || 'Not specified'}
- Previous Degree / Major: ${studentProfile.previous_major || 'Not specified'}
- CGPA/GPA: ${studentProfile.gpa || 'Not specified'}
- Backlogs: ${studentProfile.backlogs || 'None'}
- Research Experience: ${studentProfile.research_experience || 'None'}
- IELTS Status & Score: ${studentProfile.ielts_status || 'Not taken'}, ${studentProfile.ielts_score || 'N/A'}
- GRE / GMAT: ${studentProfile.gre_gmat || 'Not taken'}
- Annual Tuition Budget (USD): ${studentProfile.budget_range || 'Flexible'}
- Living Cost Tolerance: ${studentProfile.living_cost_tolerance || 'Medium'}
- Preferred Intake: ${studentProfile.preferred_intake || 'Any'}
- Preferred Countries: ${studentProfile.preferred_countries ? studentProfile.preferred_countries.join(', ') : 'Any'}
- Career Goal: ${studentProfile.career_goal || 'Not specified'}
- Post-Study Work Priority: ${studentProfile.post_study_work || 'Medium'}
- Scholarship Needed: ${studentProfile.scholarship_needed || 'No'}
- Visa Risk Tolerance: ${studentProfile.visa_risk_tolerance || 'Medium'}

Your Tasks:
1. Analyze the student profile carefully.
2. Based on your knowledge of global universities, select the TOP 10 universities that best match the student's:
   - Academic background (GPA, previous degree compatibility)
   - Language and test eligibility (IELTS/GRE requirements)
   - Budget and living cost tolerance (tuition fees + living expenses)
   - Career and post-study work goals (industry connections, post-study work visas)
   - Country and intake preferences
   - Scholarship opportunities (if needed)
3. Rank the universities from MOST suitable (#1) to 10th most suitable.
4. For EACH university, provide:
   - University Name
   - Country
   - Approximate QS/THE World University Ranking 2026 (if available)
   - Degree & Subject Match (specific program name if possible)
   - A detailed explanation covering:
     • Academic eligibility fit (GPA requirements, prerequisite compatibility)
     • IELTS / test compatibility (minimum scores, waivers if applicable)
     • Budget & affordability (estimated annual tuition + living costs, scholarship opportunities)
     • Career or research alignment (program strengths, industry connections)
     • Post-study work relevance (work visa options, duration, industry demand)

Constraints:
- Use factual, neutral, and student-friendly language.
- Base recommendations on real universities with real programs.
- Provide realistic cost estimates (tuition + living costs in USD per year).
- Do NOT overpromise admissions or visa approval.
- If trade-offs exist (e.g., higher rank vs higher cost, or lower rank vs better affordability), mention them clearly.
- Consider Bangladeshi student context (visa acceptance rates, cultural fit, existing student communities).
- Prioritize universities with proven track records of accepting international students.

Return the response as a valid JSON object with this structure:
{
  "recommendations": [
    {
      "rank": 1,
      "university_name": "Full University Name",
      "country": "Country Name",
      "qs_ranking": "QS Rank or 'Not Ranked'",
      "degree_subject_match": "Specific degree program (e.g., MSc in Computer Science)",
      "estimated_annual_cost_usd": "Tuition + Living (e.g., $35,000 - $45,000)",
      "explanation": {
        "academic_fit": "Detailed explanation of GPA/academic requirements and how student matches",
        "language_test_fit": "IELTS/GRE requirements, waivers, and student's compatibility",
        "budget_affordability": "Tuition fees, living costs, scholarship opportunities, total estimated cost",
        "career_alignment": "Program strengths, industry connections, research opportunities, faculty expertise",
        "post_study_work": "Work visa options (e.g., OPT, PSW), duration, industry demand in that country"
      },
      "overall_recommendation": "2-3 sentence summary of why this is a strong match for this specific student"
    }
  ],
  "summary": "Overall summary (3-4 sentences) providing strategic advice: mix of reach/target/safety schools, budget considerations, application timeline recommendations, and any additional tips for this student's profile."
}

Provide exactly 10 ranked university recommendations. Ensure JSON is properly formatted and parseable.`;

    // Call Gemini AI
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    let recommendations;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;
      recommendations = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      // Return raw text if JSON parsing fails
      return res.json({
        success: true,
        raw_response: text,
        message: 'Recommendations generated but in text format. Please review the raw response.'
      });
    }

    res.json({
      success: true,
      data: recommendations,
      student_profile: studentProfile
    });

  } catch (error) {
    console.error('Error generating university recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations',
      message: error.message
    });
  }
};

/**
 * Get available countries (static list of popular study destinations)
 */
exports.getAvailableCountries = async (req, res) => {
  try {
    const countries = [
      'United States',
      'United Kingdom',
      'Canada',
      'Australia',
      'Germany',
      'Netherlands',
      'France',
      'Sweden',
      'Switzerland',
      'Singapore',
      'New Zealand',
      'Ireland',
      'Denmark',
      'Norway',
      'Finland',
      'Italy',
      'Spain',
      'South Korea',
      'Japan',
      'China'
    ];

    res.json({
      success: true,
      countries
    });
  } catch (error) {
    console.error('Error loading countries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load countries'
    });
  }
};

/**
 * Get system information
 */
exports.getSystemInfo = async (req, res) => {
  try {
    const info = {
      name: 'AI University Recommendation System',
      version: '1.0.0',
      powered_by: 'Google Gemini AI',
      description: 'Get personalized university recommendations based on your academic profile, budget, and career goals',
      features: [
        'AI-powered recommendations',
        'Personalized matching',
        'Global university coverage',
        'Budget-aware suggestions',
        'Career-aligned programs',
        'Scholarship information'
      ]
    };

    res.json({
      success: true,
      info
    });
  } catch (error) {
    console.error('Error loading system info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load system information'
    });
  }
};
