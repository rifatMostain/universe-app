const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chat = require('../models/Chat');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Save chat message to database (for logged-in users)
 */
exports.saveChatMessage = async (req, res) => {
  try {
    const { role, content } = req.body;
    const userId = req.user._id;

    if (!role || !content) {
      return res.status(400).json({ error: 'Role and content are required' });
    }

    // Find or create active chat session
    let chat = await Chat.findOne({ 
      userId, 
      isActive: true 
    }).sort({ updatedAt: -1 });

    if (!chat) {
      chat = new Chat({
        userId,
        title: 'New Conversation',
        messages: [],
        isActive: true
      });
    }

    // Add message to chat
    chat.messages.push({ role, content, timestamp: new Date() });
    
    // Update title based on first user message if still default
    if (chat.title === 'New Conversation' && role === 'user' && chat.messages.length <= 2) {
      chat.title = content.substring(0, 50) + (content.length > 50 ? '...' : '');
    }

    await chat.save();

    res.json({ 
      success: true, 
      chatId: chat._id,
      message: 'Message saved successfully' 
    });
  } catch (error) {
    console.error('Error saving chat message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
};

/**
 * Get chat history for logged-in user
 */
exports.getChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get active chat session
    const chat = await Chat.findOne({ 
      userId, 
      isActive: true 
    }).sort({ updatedAt: -1 });

    if (!chat) {
      return res.json({ messages: [] });
    }

    res.json({ 
      messages: chat.messages,
      chatId: chat._id 
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

/**
 * Clear chat history
 */
exports.clearChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    // Set all active chats to inactive
    await Chat.updateMany(
      { userId, isActive: true },
      { isActive: false }
    );

    res.json({ 
      success: true,
      message: 'Chat history cleared' 
    });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
};

/**
 * Chat with AI - Streaming Response
 */
exports.chat = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    
    // Get the generative model - using gemini-2.5-flash
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash'
    });

    // Build context from conversation history with educational focus
    const systemPrompt = `You are an AI University Counselor specialized in international education. Your primary focus is ONLY on educational topics including:
- University admissions and requirements
- Study programs and degrees
- Scholarships and financial aid
- Student visas and immigration
- Academic planning and course selection
- Study abroad destinations
- Application processes and deadlines
- Statement of Purpose and personal statements
- Letters of recommendation
- Language requirements (IELTS, TOEFL, etc.)
- Career guidance related to education

IMPORTANT RULES:
1. If the user asks about NON-EDUCATIONAL topics (sports, entertainment, politics, general chitchat, etc.), give a VERY brief 1-2 sentence response and immediately redirect them back to educational topics.
2. Keep all educational responses detailed, helpful, and informative.
3. Always maintain a friendly and professional tone.
4. For greetings, respond warmly but quickly guide to educational topics.

Example:
User: "What's the weather like?"
You: "I don't have access to weather information. However, I'm here to help you with university admissions, scholarships, study abroad programs, and educational planning! What would you like to know about your educational journey?"`;

    let prompt = message;
    if (conversationHistory && conversationHistory.length > 0) {
      const contextMessages = conversationHistory
        .slice(-5) // Last 5 messages for context
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');
      prompt = `${systemPrompt}\n\nConversation History:\n${contextMessages}\n\nuser: ${message}`;
    } else {
      prompt = `${systemPrompt}\n\nuser: ${message}`;
    }
    
    // Generate content with streaming
    const result = await model.generateContentStream(prompt);

    // Stream the response
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Chat error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate response', details: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`);
      res.end();
    }
  }
};

/**
 * Get university recommendations based on user profile
 */
exports.getUniversityRecommendations = async (req, res) => {
  try {
    const { 
      field, 
      degree, 
      budget, 
      location, 
      preferences 
    } = req.body;

    if (!field || !degree) {
      return res.status(400).json({ 
        error: 'Field of study and degree level are required' 
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `As a university counselor, recommend universities for an international student with the following requirements:
    
Field of Study: ${field}
Degree Level: ${degree}
${budget ? `Budget Range: ${budget}` : ''}
${location ? `Preferred Location: ${location}` : ''}
${preferences ? `Additional Preferences: ${preferences}` : ''}

Provide 5-7 university recommendations with:
1. University name and country
2. Program highlights
3. Approximate tuition fees
4. Admission requirements overview
5. Why it's a good fit

Format the response clearly with each university recommendation separated.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ recommendations: text });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ 
      error: 'Failed to get recommendations', 
      details: error.message 
    });
  }
};

/**
 * Answer general questions about studying abroad
 */
exports.generalQuery = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({ error: 'Question is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const contextualPrompt = `You are a helpful university counselor assistant specializing in international education. 
Answer the following question about studying abroad, university applications, scholarships, or related topics:

${question}

Provide a clear, informative, and helpful response.`;

    const result = await model.generateContent(contextualPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ answer: text });
  } catch (error) {
    console.error('Error answering query:', error);
    res.status(500).json({ 
      error: 'Failed to answer query', 
      details: error.message 
    });
  }
};

/**
 * Get Country Recommendations based on Quiz (Streaming)
 */
exports.getCountryRecommendations = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({ error: 'Quiz answers are required' });
    }

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.7,
      }
    });

    const prompt = `Act as an expert study abroad counselor specialized in helping Bangladeshi students. Your task is to analyze a student's quiz responses and recommend the most suitable countries for higher education with specific focus on Bangladeshi student considerations.

Here are the comprehensive quiz questions and possible answers:

## **Academic & Career Profile**
1. **Current academic status in Bangladesh:**
   - High School (HSC/A Levels completed)
   - Undergraduate student
   - Recent graduate (BSc/BBA)
   - Working professional (1-3 years experience)
   - Working professional (4+ years experience)
   - Master's student in Bangladesh

2. **Target degree level:**
   - Bachelor's (Undergraduate)
   - Master's (Course-based/MEng)
   - Master's (Research-based/MSc)
   - PhD/Doctoral
   - Postgraduate Diploma/Certificate

3. **Academic performance (CGPA/equivalent):**
   - Below 3.0/4.0 (2nd Class)
   - 3.0-3.5/4.0 (Good)
   - 3.5-3.7/4.0 (Very Good)
   - 3.7-4.0/4.0 (Excellent/First Class)
   - Haven't completed yet

4. **Your strongest academic area:**
   - STEM (Science, Technology, Engineering, Math)
   - Business/Commerce/Finance
   - Medical/Health Sciences
   - Social Sciences/Humanities
   - Arts/Creative Fields
   - Agriculture/Environmental

## **Financial Considerations**
5. **Annual budget for tuition + living (USD):**
   - < $10,000 (Need full funding)
   - $10,000 - $15,000
   - $15,000 - $25,000
   - $25,000 - $40,000
   - $40,000+ (No major constraints)

6. **Primary funding source:**
   - Family support
   - Personal savings
   - Bank loan planned
   - Dependent on scholarships
   - University funding/assistantship

7. **Willingness to work part-time:**
   - Yes, need to support myself
   - Preferably, to gain experience
   - No, want to focus only on studies
   - Depends on country's regulations

## **Career & Settlement Goals**
8. **Post-study primary goal:**
   - Gain international work experience (2-3 years)
   - Permanent settlement abroad
   - Return to Bangladesh with global experience
   - Continue to PhD/research
   - Start own business

9. **Industry preference for work:**
   - IT/Tech Industry
   - Finance/Banking
   - Healthcare/Pharma
   - Academia/Research
   - Manufacturing/Engineering
   - Consulting/Business
   - Not specific

## **Personal Preferences**
10. **Preferred campus environment:**
    - Large city with many opportunities
    - University town/college-centric
    - Quiet suburban area
    - Doesn't matter

11. **Importance of Bangladeshi community:**
    - Very important (want strong community)
    - Somewhat important
    - Not important at all
    - Prefer diverse international community

12. **Climate sensitivity:**
    - Prefer warmer climate (like Bangladesh)
    - Prefer moderate climate
    - Can adapt to cold weather
    - Doesn't matter

13. **Language readiness:**
    - Only English-speaking countries
    - Willing to learn basic local language
    - Already know another language
    - Prefer countries with English widely spoken

## **Application Preparedness**
14. **Standardized test status:**
    - IELTS/TOEFL completed
    - GRE/GMAT completed
    - Planning to take tests soon
    - Haven't started test preparation
    - Applying to test-optional universities

15. **Application timeline urgency:**
    - Want to apply for next intake (3-6 months)
    - Planning for next year (6-12 months)
    - Early planning (1-2 years ahead)
    - Just exploring options

16. **Priority factor in choosing country:**
    - Employment opportunities after studies
    - Tuition cost and living expenses
    - University ranking/prestige
    - Ease of visa and immigration process
    - Quality of life and safety
    - Research opportunities and funding

## **Additional Bangladeshi-Specific Factors**
17. **Visa process concern level:**
    - Very concerned (want easier visa process)
    - Somewhat concerned
    - Not concerned (strong profile)
    - Will hire consultant for visa

18. **Family considerations:**
    - Planning to bring spouse/family
    - Will come alone initially
    - Family will remain in Bangladesh
    - Will visit family frequently

19. **Scholarship dependency:**
    - Must have scholarship to study
    - Can study without scholarship but prefer partial
    - Scholarship not required
    - Only considering fully funded programs

20. **Previous international exposure:**
    - Never traveled abroad
    - Have visited other countries
    - Have relatives/friends abroad
    - Have studied/lived abroad before

---

**STUDENT'S QUIZ RESPONSES:**
- Academic Status: ${answers.academicStatus}
- Target Degree: ${answers.degreeLevel}
- Academic Performance: ${answers.academicPerformance}
- Strongest Area: ${answers.field}
- Budget: ${answers.budget}
- Funding Source: ${answers.fundingSource}
- Part-time Work: ${answers.partTimeWork}
- Post-Study Goal: ${answers.postStudyGoal}
- Industry Preference: ${answers.industryPreference}
- Campus Environment: ${answers.campusEnvironment}
- Community Importance: ${answers.communityImportance}
- Climate: ${answers.climate}
- Language: ${answers.language}
- Test Status: ${answers.testStatus}
- Timeline: ${answers.timeline}
- Priority: ${answers.priority}
- Visa Concern: ${answers.visaConcern}
- Family: ${answers.familyConsiderations}
- Scholarship Dependency: ${answers.scholarshipDependency}
- International Exposure: ${answers.internationalExposure}

---

**ANALYSIS FORMAT REQUIREMENTS:**

For each recommended country (recommend exactly 3), provide:

1. **Country Name & Flag**
2. **Overall Match Score**: X/10
3. **Why This Fits Your Profile**: (3-4 specific points matching quiz responses)
4. **For Bangladeshi Students**: (2-3 country-specific insights relevant to Bangladeshis)
5. **Financial Reality Check**: (Tuition range + living costs + potential earnings)
6. **Post-Study Pathway**: (Work permit duration → PR timeline)
7. **Top 3 Universities in Your Field**: (With brief specialization notes)
8. **Potential Challenges**: (2 honest concerns to consider)
9. **Next Steps**: (Specific actions for this country)

**Additional Instructions:**
- Prioritize countries where Bangladeshi students have higher success rates
- Consider current immigration policies and political climate
- Factor in Bangladeshi community support availability
- Mention if the country has special agreements with Bangladesh
- Include information about part-time work policies for int'l students
- Be honest about visa refusal rates if relevant
- Suggest alternative/backup countries if profile is competitive

Make the recommendations personalized, practical, and specifically relevant to Bangladeshi students. Use proper formatting with headings, bold text, and bullet points.`;

    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Error generating country recommendations:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Failed to generate recommendations', 
        details: error.message 
      });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`);
      res.end();
    }
  }
};

/**
 * Generate Statement of Purpose
 */
exports.generateSOP = async (req, res) => {
  try {
    const {
      targetUniversity,
      program,
      degreeLevel,
      background,
      academicAchievements,
      workExperience,
      researchInterests,
      careerGoals,
      whyThisProgram,
      whyThisUniversity,
      uniqueStrengths,
      additionalInfo
    } = req.body;

    if (!targetUniversity || !program || !degreeLevel || !background || !careerGoals || !whyThisProgram || !whyThisUniversity) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert SOP (Statement of Purpose) writer with extensive experience helping international students craft compelling applications for top universities worldwide. Your task is to create a well-structured, professional, and personalized Statement of Purpose.

**STUDENT INFORMATION:**
- Target University: ${targetUniversity}
- Program: ${program}
- Degree Level: ${degreeLevel}
- Academic Background: ${background}
${academicAchievements ? `- Academic Achievements: ${academicAchievements}` : ''}
${workExperience ? `- Work/Research Experience: ${workExperience}` : ''}
${researchInterests ? `- Research Interests: ${researchInterests}` : ''}
- Career Goals: ${careerGoals}
- Why This Program: ${whyThisProgram}
- Why This University: ${whyThisUniversity}
${uniqueStrengths ? `- Unique Strengths/Skills: ${uniqueStrengths}` : ''}
${additionalInfo ? `- Additional Information: ${additionalInfo}` : ''}

**SOP WRITING GUIDELINES:**

1. **Introduction (Opening Hook)**
   - Start with a compelling anecdote, specific moment, or insight that sparked interest in this field
   - Avoid generic openings like "Since childhood..." or "I am writing to express my interest..."
   - Make it personal, specific, and memorable

2. **Academic Background & Achievements**
   - Highlight relevant coursework, projects, and academic accomplishments
   - Connect academic experiences to the target program
   - Quantify achievements where possible (CGPA, rankings, publications)
   - Show intellectual curiosity and academic rigor

3. **Professional/Research Experience**
   - Describe relevant work, internships, or research experiences
   - Focus on skills gained and how they prepare you for this program
   - Use specific examples and outcomes
   - Show progression and growth

4. **Why This Program**
   - Be specific about courses, faculty, research labs, or facilities
   - Show you've researched the program thoroughly
   - Explain how it aligns with your research interests and goals
   - Demonstrate genuine enthusiasm

5. **Why This University**
   - Mention specific resources, centers, opportunities unique to this institution
   - Reference particular professors or research groups you want to work with
   - Show cultural fit and understanding of university values

6. **Career Goals & Future Plans**
   - Articulate clear short-term and long-term goals
   - Show how this program is essential for achieving them
   - Demonstrate realistic understanding of the field
   - Connect goals back to earlier experiences

7. **Conclusion**
   - Summarize why you're an excellent fit
   - End with confidence and forward-looking vision
   - Reiterate commitment and readiness

**WRITING STYLE REQUIREMENTS:**
- Length: 800-1000 words (professional SOP length)
- Tone: Professional yet personal, confident but not arrogant
- Voice: First person, active voice
- Structure: Clear paragraphs with smooth transitions
- Language: Sophisticated but clear, avoid jargon unless field-specific
- NO clichés or generic statements
- NO repetition of resume information without adding context
- SHOW don't tell (use specific examples)

**FORMATTING:**
- Use proper paragraphs (not bullet points)
- Include smooth transitions between sections
- Maintain consistent narrative flow
- Professional academic writing style
- DO NOT use markdown formatting (no #, ##, ###, *, **, etc.)
- DO NOT use section headers with special characters
- Write as a continuous essay with paragraph breaks only
- Use plain text only - this is a formal academic document

Create a compelling, personalized SOP that stands out while remaining authentic to the student's profile. Make sure it's specific to ${targetUniversity} and ${program}, not a generic template. 

IMPORTANT: Output should be plain text essay format without any markdown, asterisks, or special formatting characters. Write it as you would submit it to a university - professional prose only.`;

    const result = await model.generateContent(prompt);
    const sop = result.response.text();

    res.json({ 
      success: true,
      sop: sop
    });
  } catch (error) {
    console.error('Error generating SOP:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate SOP', 
      details: error.message 
    });
  }
};

