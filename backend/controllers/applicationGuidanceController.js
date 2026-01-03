const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Get Application Guidance - Streaming Response
 */
exports.getApplicationGuidance = async (req, res) => {
  try {
    const { country, degree, field, university } = req.body;

    // Validate required fields
    if (!country || !degree || !field) {
      return res.status(400).json({
        success: false,
        error: 'Country, degree, and field of study are required'
      });
    }

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    console.log('🎓 Generating application guidance for:', { country, degree, field, university });

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8000,
      }
    });

    const prompt = `You are an expert study abroad consultant for Bangladeshi students. 
Provide a complete, country-specific, step-by-step application guide for universities abroad.

**Student Information:**
- Target Country: ${country}
- Degree Level: ${degree}
- Field of Study: ${field}
${university ? `- Target University: ${university}` : ''}

**Required Output Sections:**

## 1. 📋 Admission Process Overview
- Brief overview of ${country}'s university application system
- Key differences from Bangladesh's education system
- Application platforms/portals commonly used (e.g., UCAS for UK, Common App for USA)
- General timeline from application to admission

## 2. 📝 Required Documents Checklist
Provide a complete list of documents typically required for ${degree} in ${field} in ${country}:
- Academic transcripts and certificates
- Standardized test scores (IELTS/TOEFL, GRE/GMAT if applicable)
- Statement of Purpose (SOP) / Personal Statement
- Letters of Recommendation
- Resume/CV
- Financial documents
- Passport and photos
- Any country-specific or field-specific documents

## 3. ✍️ Statement of Purpose (SOP) Guidance
- Key elements to include for ${field} programs
- Structure and format (word count, sections)
- **Common mistakes Bangladeshi students make**
- Tips for making your SOP stand out
- Sample opening and closing paragraphs structure

## 4. 💼 Letters of Recommendation (LOR)
- How many LORs typically required for ${degree} in ${country}
- Who should you ask (professors, employers, etc.)
- What information to provide to your recommenders
- Format and submission process
- Timeline for requesting LORs

## 5. 🛂 Visa Application Process for Bangladeshi Students
- Specific visa type required for ${country} (e.g., F-1 for USA, Tier 4 for UK)
- Required documents for visa application
- Financial proof requirements (bank statements, scholarship letters)
- Visa interview preparation tips (if applicable)
- Expected processing time from Bangladesh
- Common visa rejection reasons and how to avoid them

## 6. 💰 Financial Planning
- Estimated tuition fees for ${field} ${degree} programs
- Living expenses in ${country}
- Scholarship opportunities for Bangladeshi students
- Part-time work regulations
- Proof of funds requirements

## 7. 📅 Month-by-Month Application Timeline
Provide a detailed timeline from **12 months before** target intake to enrollment:
- **Month 1-3:** Preparation phase
- **Month 4-6:** Application phase
- **Month 7-9:** Waiting and follow-up
- **Month 10-12:** Visa and pre-departure
Include specific deadlines for ${country} universities (e.g., Fall/Spring intakes)

## 8. ⚠️ Common Mistakes to Avoid
- Application mistakes specific to ${country}
- SOP/LOR pitfalls
- Visa application errors
- Financial documentation issues

## 9. 🔗 Official Resources
Provide links to:
- ${country}'s official education website
- Student visa information page
- Application portals
- Scholarship databases for Bangladeshi students
${university ? `- ${university}'s official admissions page` : ''}

## 10. ✅ Final Checklist
A comprehensive checklist covering:
- Pre-application preparation
- Application submission
- Post-acceptance steps
- Visa application
- Pre-departure preparation

**Important Notes:**
- All information should be specific to **Bangladeshi students** applying to ${country}
- Include realistic timelines based on current processing times
- Mention any recent policy changes affecting international students
- Provide practical, actionable advice

Format the output with clear headings, bullet points, and numbered lists for easy reading.`;

    const result = await model.generateContentStream(prompt);

    // Stream the response
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
    }

    res.write(`data: [DONE]\n\n`);
    res.end();

    console.log('✅ Application guidance streaming complete');

  } catch (error) {
    console.error('❌ Error generating application guidance:', error);
    
    // If headers not sent, send error response
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Failed to generate application guidance',
        message: error.message
      });
    } else {
      // If streaming already started, send error in stream
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  }
};

module.exports = exports;
