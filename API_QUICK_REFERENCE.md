# 🔍 University Search API - Quick Reference

## Search Examples

### 1. Basic Search
```bash
# Search all universities
GET /api/universities/search

# Search by country
GET /api/universities/search?country=USA

# Search by text
GET /api/universities/search?searchQuery=computer%20science
```

### 2. Advanced Filtering
```bash
# Computer Science Master's in Canada under $50k
GET /api/universities/search?country=Canada&degreeType=Master's&fieldOfStudy=Computer%20Science&maxTuition=50000

# Top 100 QS ranked universities with IELTS requirement
GET /api/universities/search?maxRanking=100&rankingType=QS&languageTest=IELTS

# Programs with deadlines after March 2025
GET /api/universities/search?deadlineAfter=2025-03-01
```

### 3. Autocomplete
```bash
# Get suggestions for "comp"
GET /api/universities/autocomplete?query=comp

Response:
{
  "success": true,
  "suggestions": [
    {
      "type": "program",
      "text": "Computer Science at MIT",
      "value": "program_id",
      "universityId": "uni_id"
    },
    {
      "type": "university",
      "text": "University of Computer Science - City, Country",
      "value": "uni_id"
    }
  ]
}
```

### 4. AI Recommendations (Protected)
```bash
POST /api/universities/recommendations
Headers: {
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
Body: {
  "budget": 50000,
  "preferredCountries": ["Canada", "Germany", "USA"],
  "fieldOfStudy": "Computer Science",
  "currentGPA": 3.5,
  "languageScores": {
    "IELTS": "7.0",
    "GRE": "320"
  }
}

Response:
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "universityId": "...",
        "universityName": "University of Toronto",
        "matchPercentage": 85,
        "recommendedPrograms": ["Data Science", "CS Master's"],
        "reasoning": "Strong match based on GPA and budget...",
        "keyConsiderations": ["Apply early", "IELTS score meets requirement"]
      }
    ],
    "alternativeOptions": ["Consider UK universities", "Look into scholarships"],
    "generalAdvice": "Your profile is competitive for top programs..."
  }
}
```

## Filter Options

### Available Filters

| Filter | Type | Values |
|--------|------|--------|
| `country` | String/Array | USA, UK, Canada, Australia, Germany, France, Netherlands, Sweden, Singapore, Japan |
| `degreeType` | String | Bachelor's, Master's, PhD, Diploma, Short Course |
| `fieldOfStudy` | String | Any field (regex search) |
| `minTuition` | Number | Minimum fee in USD |
| `maxTuition` | Number | Maximum fee in USD |
| `languageTest` | String | IELTS, TOEFL, PTE, GRE, GMAT |
| `rankingType` | String | QS, THE, ARWU |
| `minRanking` | Number | Minimum rank (lower is better) |
| `maxRanking` | Number | Maximum rank (e.g., top 100) |
| `deadlineAfter` | Date | ISO date string |
| `searchQuery` | String | Full-text search |
| `page` | Number | Page number (default: 1) |
| `limit` | Number | Results per page (default: 12) |

### Get Filter Options
```bash
GET /api/universities/filter-options

Response:
{
  "success": true,
  "data": {
    "countries": ["Australia", "Canada", "France", ...],
    "degreeTypes": ["Bachelor's", "Master's", ...],
    "fieldsOfStudy": ["Computer Science", "Engineering", ...],
    "languageTests": ["IELTS", "TOEFL", "PTE", "GRE", "GMAT"],
    "rankingTypes": ["QS", "THE", "ARWU"]
  }
}
```

## Response Structure

### Search Response
```json
{
  "success": true,
  "data": [
    {
      "_id": "university_id",
      "name": "MIT",
      "logo": "https://...",
      "country": "USA",
      "city": "Cambridge",
      "state": "Massachusetts",
      "rankings": {
        "QS": 1,
        "THE": 5,
        "year": 2024
      },
      "programs": [
        {
          "_id": "program_id",
          "name": "Computer Science",
          "degreeType": "Master's",
          "tuitionFeePerYear": 55878,
          "applicationDeadline": "2025-12-15T00:00:00.000Z",
          "scholarshipsAvailable": [...]
        }
      ],
      "estimatedLivingCost": {
        "perMonth": 2500,
        "perYear": 30000
      }
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "pages": 5
  }
}
```

### University Detail Response
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "MIT",
    "aboutUniversity": "World-renowned...",
    "rankings": {...},
    "programs": [...],
    "admissionRequirements": {
      "bangladeshiStudents": [
        "HSC or A-Level certificate",
        "Strong SAT/ACT scores"
      ]
    },
    "contactInfo": {
      "email": "admissions@mit.edu",
      "internationalOffice": "..."
    },
    "officialWebsite": "https://mit.edu"
  }
}
```

### Program Detail Response
```json
{
  "success": true,
  "data": {
    "university": {
      "_id": "...",
      "name": "MIT",
      "logo": "...",
      "country": "USA",
      "city": "Cambridge"
    },
    "program": {
      "_id": "...",
      "name": "Computer Science and Engineering",
      "degreeType": "Master's",
      "description": "...",
      "eligibilityCriteria": {
        "minimumGPA": 3.5,
        "languageRequirements": [
          { "test": "TOEFL", "minimumScore": "100" }
        ]
      },
      "requiredDocuments": ["Transcripts", "SOP", ...],
      "scholarshipsAvailable": [...],
      "careerProspects": [...],
      "courseCurriculum": [...]
    }
  }
}
```

## Common Use Cases

### 1. Find Affordable Programs
```bash
# Programs under $20,000/year in any country
GET /api/universities/search?maxTuition=20000

# Free education in Germany
GET /api/universities/search?country=Germany&maxTuition=500
```

### 2. Search by Ranking
```bash
# Top 50 QS ranked universities
GET /api/universities/search?rankingType=QS&maxRanking=50

# Top 100 in THE ranking
GET /api/universities/search?rankingType=THE&maxRanking=100
```

### 3. Find Programs by Field
```bash
# All Computer Science programs
GET /api/universities/search?fieldOfStudy=Computer%20Science

# Engineering programs in USA/Canada
GET /api/universities/search?fieldOfStudy=Engineering&country=USA,Canada
```

### 4. Search by Language Requirements
```bash
# Programs accepting IELTS
GET /api/universities/search?languageTest=IELTS

# Master's programs with GRE requirement
GET /api/universities/search?degreeType=Master's&languageTest=GRE
```

### 5. Deadline-Based Search
```bash
# Programs with deadlines after June 2025
GET /api/universities/search?deadlineAfter=2025-06-01

# Fall 2025 intakes (approx deadlines Dec-Mar)
GET /api/universities/search?deadlineAfter=2024-12-01&deadlineBefore=2025-03-31
```

## Error Handling

### Common Errors
```json
// 404 - Not Found
{
  "success": false,
  "message": "University not found"
}

// 500 - Server Error
{
  "success": false,
  "message": "Error searching universities",
  "error": "Database connection failed"
}

// 401 - Unauthorized (for protected endpoints)
{
  "success": false,
  "message": "Authentication required"
}
```

## Rate Limiting & Best Practices

### Best Practices
1. **Use pagination**: Don't request all results at once
2. **Cache filter options**: They don't change frequently
3. **Debounce autocomplete**: Wait 300ms after user stops typing
4. **Combine filters**: More specific = faster results
5. **Use text search wisely**: Combine with other filters for better results

### Performance Tips
```bash
# Good: Specific query
GET /api/universities/search?country=Canada&degreeType=Master's&page=1&limit=12

# Bad: Too broad, returns too much data
GET /api/universities/search?limit=1000

# Good: Use autocomplete for suggestions
GET /api/universities/autocomplete?query=comput

# Bad: Full text search without filters
GET /api/universities/search?searchQuery=computer
```

## Integration Examples

### Frontend (React)
```javascript
import { searchUniversities, getAutocomplete } from '../utils/apiHelpers';

// Search with filters
const handleSearch = async () => {
  const results = await searchUniversities({
    country: 'Canada',
    degreeType: "Master's",
    maxTuition: 50000,
    page: 1,
    limit: 12
  });
  
  setUniversities(results.data);
  setPagination(results.pagination);
};

// Autocomplete
const handleAutocomplete = async (query) => {
  if (query.length < 2) return;
  const suggestions = await getAutocomplete(query);
  setSuggestions(suggestions);
};
```

### Using fetch
```javascript
// Search
const response = await fetch('/api/universities/search?country=USA');
const data = await response.json();

// With auth token (for recommendations)
const response = await fetch('/api/universities/recommendations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    budget: 50000,
    preferredCountries: ['Canada'],
    fieldOfStudy: 'Computer Science'
  })
});
```

---

**Quick Tip**: Start with broad filters and narrow down based on results!
