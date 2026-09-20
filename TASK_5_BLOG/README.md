# DevChronicles - Modern Editorial Blog Website

**CodSoft Frontend Development Internship — Task 5**  
*A responsive editorial publication featuring dynamic search, category filtering, paginated articles, rich article detail views, an interactive comment system, and dark mode.*

---

## 🚀 Overview

**DevChronicles** is a production-grade frontend blog platform built with clean semantic HTML5, modern CSS3, and modular vanilla JavaScript. It delivers an engaging reading experience with curated articles on frontend engineering, JavaScript runtime internals, UI/UX architecture, and web performance.

---

## ✨ Features Checklist

### Official Required Features
- [x] **Attractive Homepage:** Modern editorial layout with header, hero section, card grid, and newsletter subscription.
- [x] **Featured Blog Posts:** Highlighting top stories with prominent imagery and metadata.
- [x] **Responsive Blog Cards:** Image, category badge, publish date, title, excerpt, reading time, and author.
- [x] **Blog Card Images:** High-resolution optimized imagery with subtle hover zoom effects.
- [x] **Blog Titles & Excerpts:** Clear typography hierarchy with optimal line heights and line clamping.
- [x] **Publish Dates:** Formatted human-readable dates for all publications.
- [x] **Categories & Tags:** Filter articles across multiple categories (*Frontend*, *JavaScript*, *UI/UX Design*, *Web Performance*, *Career*).
- [x] **Individual Blog Detail Pages (`blog.html`):** Dynamic article view with hero banner, editorial typography, blockquotes, and code snippets.
- [x] **Responsive Navigation Bar:** Sticky header with active state links and working mobile hamburger navigation.
- [x] **Responsive Footer:** Comprehensive footer with category shortcuts, internship tasks navigation, and copyright information.
- [x] **Search Functionality:** Live, multi-field search across titles, excerpts, tags, and authors with instant count updates.
- [x] **Load More Pagination:** Incrementally load articles with an article count status indicator.
- [x] **Cross-Device & Browser Compatibility:** Fully tested across desktop, tablet, and mobile viewports.

### Bonus Features Implemented
- [x] **Dark Mode Support:** Clean dark theme with persistent preference stored in `localStorage` across both homepage and detail pages.
- [x] **Interactive Comment Section:** Frontend-only discussion system with name/comment validation, XSS sanitization, timestamps, and `localStorage` persistence.
- [x] **Social Sharing Buttons:** Instant sharing to **Copy Link** (with toast feedback), **WhatsApp**, **LinkedIn**, and **X / Twitter**.
- [x] **Related Article Recommendations:** Contextual reading suggestions based on matching categories and tags (excluding current post).
- [x] **Robust 404 Error State:** Friendly not-found screen when an invalid or missing article slug is requested.

---

## 📁 File Structure

```
TASK_5_BLOG/
├── index.html        # Homepage with hero section, search/filters, and card grid
├── blog.html         # Dedicated article detail page with comments and sharing
├── css/
│   └── style.css     # Design system, light/dark themes, editorial typography
├── js/
│   ├── script.js     # Homepage search, filtering, Load More, theme toggle
│   └── blog.js       # Detail page dynamic reader, comments, social sharing
├── data/
│   └── posts.js      # Comprehensive catalog of rich technical articles
└── README.md         # Full project documentation
```

---

## 🛠️ How to Run

1. Open `TASK_5_BLOG/index.html` directly in your browser.
2. Or serve via any local development server:
   ```bash
   # Python 3
   python -m http.server 3000
   ```
3. Navigate to `http://localhost:3000/TASK_5_BLOG/index.html`.
4. Click any article card or "Read Story" button to open its dedicated view (`blog.html?id=...`).
