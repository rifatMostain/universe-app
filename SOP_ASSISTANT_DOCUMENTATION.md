# SOP Assistant Feature Documentation

## Overview
The SOP (Statement of Purpose) Assistant is an AI-powered tool that helps students create compelling, personalized SOPs tailored to specific universities and programs. Built using Google's Gemini AI, it generates professional-quality statements that can be edited, saved to the user's account, and downloaded to their PC.

## Feature Implementation

### Frontend Component
**Location:** `frontend/src/components/SOPHelper.jsx`

**Features:**
- ✅ Comprehensive input form with 12+ fields
- ✅ AI-powered SOP generation using Gemini API
- ✅ Editable text area for reviewing/modifying generated content
- ✅ Save to user account (database)
- ✅ Download to PC (.txt file)
- ✅ Clear all fields functionality
- ✅ Professional dark gradient design matching app theme
- ✅ Real-time success/error alerts
- ✅ Loading states for better UX
- ✅ Form validation

**Input Fields:**
1. Target University *
2. Program/Course *
3. Degree Level * (Bachelors/Masters/PhD/Postgraduate)
4. Academic Background *
5. Academic Achievements
6. Work/Research Experience
7. Research Interests
8. Career Goals *
9. Why This Program? *
10. Why This University? *
11. Unique Strengths/Skills
12. Additional Information

(*required fields)

### Styling
**Location:** `frontend/src/styles/SOPHelper.css`

**Design Features:**
- Dark gradient background (#0a1628 to #1a2f4a)
- Two-column layout (form on left, output on right)
- Professional green color scheme (#10b981, #059669)
- Responsive design for mobile/tablet
- Smooth animations and transitions
- Accessible form controls with icons
- Tips section with best practices

### Backend API

#### 1. Generate SOP Endpoint
**Route:** `POST /api/ai/generate-sop`
**File:** `backend/controllers/aiController.js`
**Access:** Protected (requires authentication)

**Request Body:**
```javascript
{
  targetUniversity: String (required),
  program: String (required),
  degreeLevel: String (required),
  background: String (required),
  academicAchievements: String,
  workExperience: String,
  researchInterests: String,
  careerGoals: String (required),
  whyThisProgram: String (required),
  whyThisUniversity: String (required),
  uniqueStrengths: String,
  additionalInfo: String
}
```

**Response:**
```javascript
{
  success: true,
  sop: "Generated SOP content..." (800-1000 words)
}
```

**AI Prompt Structure:**
- Expert SOP writer persona
- Comprehensive writing guidelines (7 sections)
- Professional writing style requirements
- 800-1000 word length
- University and program-specific customization
- No generic templates or clichés

#### 2. Save SOP to Profile
**Route:** `POST /api/profile/save-sop`
**File:** `backend/routes/user.js`
**Access:** Protected (requires authentication)

**Request Body:**
```javascript
{
  sopContent: String (required),
  targetUniversity: String,
  program: String,
  degreeLevel: String
}
```

**Response:**
```javascript
{
  success: true,
  message: "SOP saved successfully",
  sopId: "ObjectId"
}
```

#### 3. Get Saved SOPs
**Route:** `GET /api/profile/sop-drafts`
**Access:** Protected

**Response:**
```javascript
{
  success: true,
  sopDrafts: [
    {
      _id: "ObjectId",
      sopContent: String,
      targetUniversity: String,
      program: String,
      degreeLevel: String,
      createdAt: Date,
      updatedAt: Date
    }
  ]
}
```

#### 4. Delete SOP Draft
**Route:** `DELETE /api/profile/sop-drafts/:sopId`
**Access:** Protected

**Response:**
```javascript
{
  success: true,
  message: "SOP draft deleted successfully"
}
```

### Database Schema Updates
**File:** `backend/models/User.js`

**New Field Added:**
```javascript
sopDrafts: [{
  sopContent: {
    type: String,
    required: true
  },
  targetUniversity: String,
  program: String,
  degreeLevel: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}]
```

### Routing
**File:** `frontend/src/App.jsx`

**Route:**
```jsx
<Route path="/sop-cv" element={
  <ProtectedRoute>
    <SOPHelper />
  </ProtectedRoute>
} />
```

**Access:** Protected route - requires user login

### Navigation Integration
- Added to main navbar (desktop and mobile)
- Visible only to authenticated users
- Link: `/sop-cv`
- Updated HomePage feature cards
- Updated footer links

## User Journey

1. **Access:** User must be logged in to access SOP Assistant
2. **Fill Form:** User fills in their information (12 fields, 6 required)
3. **Generate:** Click "Generate SOP" button
4. **Review:** AI generates personalized 800-1000 word SOP
5. **Edit:** User can edit the generated content in the text area
6. **Save Options:**
   - **Download to PC:** Downloads as `.txt` file with format: `SOP_UniversityName_YYYY-MM-DD.txt`
   - **Save to Account:** Saves to database, retrievable later
7. **Manage:** User can view all saved SOPs from their profile

## AI Generation Quality

The Gemini AI is prompted to create SOPs with:
- **Compelling opening hooks** (no generic intros)
- **Specific academic achievements** with quantification
- **Relevant professional/research experience**
- **Program-specific research and faculty mentions**
- **Clear career goals** (short-term and long-term)
- **Strong conclusions** with forward-looking vision
- **Professional academic tone** (not arrogant)
- **Active voice** and specific examples
- **No clichés or resume repetition**

## Tips Provided to Users

1. Be specific about goals and program alignment
2. Highlight relevant experiences and achievements
3. Show genuine interest in university and program
4. Keep it concise (500-1000 words typically)
5. Proofread carefully before submission
6. Customize for each university

## Acceptance Criteria Fulfillment

✅ **User can fill out the form** - 12 comprehensive fields with validation
✅ **Generate structured SOP draft** - AI generates 800-1000 word professional SOP
✅ **Save to account** - Saves to MongoDB user profile with metadata
✅ **Save to PC** - Downloads as .txt file with proper naming
✅ **Editable text area** - Full WYSIWYG editing before saving
✅ **Protected route** - Requires authentication
✅ **Error handling** - Comprehensive error messages
✅ **Loading states** - Visual feedback during generation/saving
✅ **Professional design** - Matches app design language

## Technical Stack

- **Frontend:** React 18, React Router v7
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **AI:** Google Gemini 1.5 Flash API
- **Styling:** Custom CSS with dark gradient theme
- **Authentication:** JWT-based auth middleware

## File Structure

```
frontend/
  src/
    components/
      SOPHelper.jsx          # Main component
    styles/
      SOPHelper.css          # Component styles

backend/
  controllers/
    aiController.js          # generateSOP function
  routes/
    user.js                  # Save/Get/Delete SOP routes
  models/
    User.js                  # sopDrafts schema field
```

## Future Enhancements (Optional)

- PDF export with formatted styling
- Multiple SOP templates/styles
- Version history for edits
- Plagiarism checker integration
- Word count and readability metrics
- AI suggestions for improvements
- Comparison tool for multiple SOPs
- Email sharing functionality
- CV/Resume generator (separate feature)

## Testing Checklist

- [ ] Form validation works correctly
- [ ] AI generates relevant SOPs
- [ ] Edit functionality preserves changes
- [ ] Download creates proper .txt file
- [ ] Save to account persists data
- [ ] Protected route redirects unauthenticated users
- [ ] Error messages display correctly
- [ ] Loading states show during async operations
- [ ] Mobile responsive design works
- [ ] Multiple SOPs can be saved per user

## Notes

- SOP generation typically takes 10-20 seconds
- Generated content is ~800-1000 words
- Each save creates a new draft (no update functionality yet)
- Requires valid Gemini API key in backend .env
- No limit on number of SOPs a user can save
- Download filename format: `SOP_UniversityName_YYYY-MM-DD.txt`
