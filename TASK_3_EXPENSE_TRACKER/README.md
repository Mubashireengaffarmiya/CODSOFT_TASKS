# SpendWise - Personal Expense Tracker

**CodSoft Frontend Development Internship — Task 3**  
*A modern, responsive personal finance and expense tracking application.*

---

## 🚀 Overview

**SpendWise** is a personal expense tracker built with semantic HTML5, modern CSS3, and vanilla JavaScript. It empowers users to manage their income and expenses, monitor current balances in real time, categorize cash flows, and persist transaction records locally in the browser.

---

## ✨ Features Checklist

### Official Required Features
- [x] **Responsive & User-Friendly Interface:** Mobile-first responsive layout with clean cards and accessible controls.
- [x] **Add Income & Expense Transactions:** Instant toggling between Income and Expense with dynamic category updates.
- [x] **Transaction History:** Displays detailed records with date, category badge, and color-coded amounts.
- [x] **Automatic Calculations:** Real-time updates for Total Income, Total Expenses, and Current Balance.
- [x] **Local Storage Persistence:** All records and theme preferences persist after page refreshes and browser restarts.
- [x] **Edit Transactions:** Modal dialog to modify description, amount, type, category, and date.
- [x] **Delete Transactions:** Confirmation modal dialog to prevent accidental data loss.
- [x] **Category-Based Filtering:** Multi-category filter covering both income and expense categories.
- [x] **Summary Cards:** 3 prominent summary cards (Current Balance, Total Income, Total Expenses).
- [x] **Dynamic Search & Sorting:** Real-time search across descriptions and categories, with multi-option sorting.
- [x] **Dark Mode Support:** Clean dark theme with persistent preference in `localStorage`.

---

## 📁 File Structure

```
TASK_3_EXPENSE_TRACKER/
├── index.html       # Semantic HTML5 markup, summary cards, modals
├── css/
│   └── style.css    # Responsive grid, color-coded income/expense tokens, dark mode
├── js/
│   └── script.js    # Financial calculations, CRUD operations, filtering, local storage
└── README.md        # Comprehensive documentation
```

---

## 🛠️ How to Run

1. Open `TASK_3_EXPENSE_TRACKER/index.html` directly in any web browser.
2. Or serve via any local development server:
   ```bash
   # Python 3
   python -m http.server 3000
   ```
3. Navigate to `http://localhost:3000/TASK_3_EXPENSE_TRACKER/index.html`.
