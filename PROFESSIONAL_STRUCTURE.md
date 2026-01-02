# UniVerse Project - Professional File Structure Documentation

## 📁 Project Architecture

```
universe-app/
├── frontend/
│   ├── src/
│   │   ├── components/          # React Components (JSX)
│   │   │   └── Navbar.jsx       # Navigation component
│   │   ├── pages/               # Page Components (JSX)
│   │   │   ├── HomePage.jsx     # Home page component
│   │   │   └── ScholarshipInfo.jsx  # Scholarship page component
│   │   ├── styles/              # CSS Stylesheets
│   │   │   ├── Navbar.css       # Navbar styles
│   │   │   ├── HomePage.css     # Homepage styles
│   │   │   └── ScholarshipInfo.css  # Scholarship page styles
│   │   ├── utils/               # JavaScript Utilities
│   │   │   └── api.js           # API utility functions
│   │   ├── App.jsx              # Main app component
│   │   ├── App.css              # Global app styles
│   │   ├── index.css            # Tailwind & global styles
│   │   └── main.jsx             # App entry point
│   ├── public/                  # Static assets
│   ├── index.html               # HTML template
│   └── package.json             # Dependencies
│
└── backend/
    ├── server.js                # Express server
    ├── .env                     # Environment variables
    └── package.json             # Dependencies
```

---

## 🎯 Separation of Concerns

### **1. HTML (Structure)**
**Location:** `frontend/index.html` and JSX components

**Purpose:** Defines the structure and semantic meaning of content

**Example:**
```html
<!-- index.html - HTML Template -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>UniVerse - Study Abroad Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

### **2. CSS (Presentation)**
**Location:** `frontend/src/styles/` directory

**Purpose:** Controls visual appearance, layout, and styling

**File Organization:**
- ✅ **Component-specific CSS:** Each component has its own CSS file
- ✅ **Modular approach:** Styles are organized by feature
- ✅ **Naming conventions:** BEM-like class names for clarity
- ✅ **Comments:** Well-documented sections

**Example Structure:**
```css
/* Navbar.css */
/* =============================================
   NAVBAR STYLES
   ============================================= */

.navbar {
  background-color: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.navbar-container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
}
```

---

### **3. JavaScript (Behavior)**
**Location:** `frontend/src/` - `.jsx` and `.js` files

**Purpose:** Handles logic, interactivity, and data management

**File Types:**

#### **a) React Components (.jsx)**
- Contains component logic and structure
- Imports CSS for styling
- Manages state and props

```jsx
// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';  // Import CSS

const Navbar = () => {
  // Component logic here
  return (
    <nav className="navbar">
      {/* JSX structure */}
    </nav>
  );
};
```

#### **b) Utility Functions (.js)**
- Pure JavaScript logic
- API calls, helpers, constants
- No UI components

```javascript
// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL,
});

export default api;
```

---

## 📊 File Naming Conventions

### **Components (JSX)**
- **Format:** PascalCase
- **Examples:** `Navbar.jsx`, `HomePage.jsx`, `ScholarshipInfo.jsx`
- **Rule:** Component files use capital first letter

### **Styles (CSS)**
- **Format:** PascalCase matching component name
- **Examples:** `Navbar.css`, `HomePage.css`, `ScholarshipInfo.css`
- **Rule:** CSS file names match their component

### **Utilities (JS)**
- **Format:** camelCase
- **Examples:** `api.js`, `helpers.js`, `constants.js`
- **Rule:** Utility files use lowercase first letter

---

## 🔗 Import Structure

### **Proper Import Order:**
```jsx
// 1. React and third-party libraries
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// 2. CSS imports
import '../styles/ComponentName.css';

// 3. Local utilities
import api from '../utils/api';

// 4. Component definition
const ComponentName = () => {
  // ...
};
```

---

## 🎨 CSS Architecture

### **1. Component-Scoped Styles**
Each component has its own CSS file with:
- Clear section headers
- Organized by element hierarchy
- Responsive design patterns
- Hover states and transitions

### **2. Class Naming Convention**
```css
/* Component Name */
.component-name { }

/* Component Elements */
.component-name-element { }
.component-name-sub-element { }

/* Modifiers */
.component-name--modifier { }

/* States */
.component-name:hover { }
.component-name.is-active { }
```

### **3. Responsive Design**
```css
/* Mobile First Approach */
.element {
  /* Base mobile styles */
}

@media (min-width: 768px) {
  .element {
    /* Tablet styles */
  }
}

@media (min-width: 1024px) {
  .element {
    /* Desktop styles */
  }
}
```

---

## 🔧 Best Practices Implemented

### ✅ **Separation of Concerns**
- HTML/JSX for structure
- CSS for presentation
- JavaScript for behavior

### ✅ **Modularity**
- Each component is self-contained
- Easy to find and update styles
- Reusable code patterns

### ✅ **Maintainability**
- Clear file organization
- Consistent naming conventions
- Well-commented code

### ✅ **Scalability**
- Easy to add new components
- CSS doesn't conflict between components
- Clear import paths

### ✅ **Performance**
- CSS is loaded per component
- Tree-shaking optimization
- Minimal CSS duplication

---

## 📝 File Relationships

### **Navbar Component Example:**
```
Navbar.jsx  ←→  Navbar.css
    ↓
Uses classes from CSS:
- .navbar
- .navbar-container
- .nav-link
- .auth-buttons
```

### **Scholarship Page Example:**
```
ScholarshipInfo.jsx  ←→  ScholarshipInfo.css
    ↓
Uses classes from CSS:
- .scholarship-page
- .scholarship-card
- .card-header
- .visit-button
```

---

## 🎓 Professional Standards Met

✅ **Industry Standard Structure:** Follows React best practices
✅ **Clean Code:** Separation of HTML, CSS, and JS
✅ **Scalable:** Easy to add new features
✅ **Maintainable:** Clear organization and naming
✅ **Documented:** Comments and documentation
✅ **Responsive:** Mobile-first design approach
✅ **Accessible:** Semantic HTML and ARIA labels
✅ **Performance:** Optimized imports and CSS

---

## 🚀 Benefits of This Structure

1. **Easy Navigation:** Find files quickly by feature
2. **No Style Conflicts:** Component-scoped CSS
3. **Team Collaboration:** Clear file ownership
4. **Testing:** Each component can be tested independently
5. **Debugging:** Easy to locate styling issues
6. **Refactoring:** Change one component without affecting others

---

## 📖 Quick Reference

**Need to style the Navbar?**
→ Edit `frontend/src/styles/Navbar.css`

**Need to add logic to Scholarship page?**
→ Edit `frontend/src/pages/ScholarshipInfo.jsx`

**Need to add a new API endpoint?**
→ Edit `frontend/src/utils/api.js`

**Need to change global styles?**
→ Edit `frontend/src/index.css`

---

**Last Updated:** November 3, 2025
**Author:** UniVerse Development Team
