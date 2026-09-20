# TaskFlow - To-Do List Application

**CodSoft Frontend Development Internship — Task 2**  
*A modern, responsive, and feature-rich daily task management application.*

---

## 🚀 Overview

**TaskFlow** is an interactive and accessible productivity application designed to help users organize, prioritize, and track their daily activities. Built with clean semantic HTML5, modern CSS3, and vanilla JavaScript, it stores all tasks locally in the browser and requires no external framework dependencies.

---

## ✨ Features Checklist

### Official Required Features
- [x] **Clean & Responsive UI:** Mobile-first layout with smooth transitions, modern typography, and glassmorphic card design.
- [x] **Add New Tasks with Validation:** Required title, whitespace trimming, and clear user-facing validation errors.
- [x] **Edit Existing Tasks:** Edit title, notes/description, category, priority, and due date via an accessible modal dialog.
- [x] **Delete Tasks:** Confirmation modal dialog to prevent accidental deletion.
- [x] **Mark Tasks Completed / Pending:** Instant completion toggle with clear visual distinction (strikethrough, badge styling, subtle opacity).
- [x] **Local Storage Persistence:** All tasks and settings persist reliably across page reloads and browser sessions.
- [x] **Total Counts Dashboard:** Real-time counters for Total, Pending, Completed, and Overdue tasks.
- [x] **Task Search:** Live dynamic search across task titles, notes, and categories.
- [x] **Multi-Dimensional Task Filtering:** Filter by status (All, Pending, Completed, Overdue), category, and priority.

### Bonus Features Implemented
- [x] **Task Categories:** Organize tasks into *Work*, *Study*, *Personal*, *Health*, *Finance*, and *Other* with distinct color badges.
- [x] **Priority Levels:** Assign *High* (Red), *Medium* (Yellow), and *Low* (Green) priority accents with left-border visual indicators.
- [x] **Due Dates & Overdue Detection:** Automatic calculation of overdue tasks (with pulsing warning indicator) and tasks due today.
- [x] **Dark Mode Support:** Sleek dark theme toggle with state persisted in `localStorage`.

---

## 📁 File Structure

```
TASK_2_TODO/
├── index.html       # Semantic HTML5 markup and accessible modals
├── css/
│   └── style.css    # CSS custom properties, dark/light themes, responsive layout
├── js/
│   └── script.js    # Task data model, CRUD operations, filtering, sorting, local storage
└── README.md        # Comprehensive project documentation
```

---

## 🛠️ How to Run

1. Open `TASK_2_TODO/index.html` directly in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
2. Or use a local development server such as VS Code Live Server or Python's HTTP server:
   ```bash
   # Python 3
   python -m http.server 3000
   ```
3. Navigate to `http://localhost:3000/TASK_2_TODO/index.html`.

---

## ⌨️ Usability & Keyboard Support

- **Enter:** Submit new task form or save edits.
- **Escape:** Close any open modal dialog (Edit / Delete).
- **Tab / Shift+Tab:** Full keyboard navigation through all inputs, buttons, and task cards.
- **Clickable Stat Cards:** Click any statistic card (Total, Pending, Completed, Overdue) to filter the list instantly.
