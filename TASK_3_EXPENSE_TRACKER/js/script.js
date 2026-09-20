/**
 * SpendWise - Expense Tracker (CodSoft Task 3)
 * Full CRUD, Local Storage Persistence, Dynamic Balance / Income / Expense Calculations,
 * Category Filtering, Search, Sorting, and Dark Mode.
 */

(function () {
    'use strict';

    // --- Storage Keys ---
    const STORAGE_KEY_TRANSACTIONS = 'codsoft_transactions';
    const STORAGE_KEY_THEME = 'codsoft_expense_theme';

    // --- Category Definitions ---
    const CATEGORIES = {
        expense: [
            'Food & Dining',
            'Shopping',
            'Utilities & Bills',
            'Transportation',
            'Entertainment',
            'Health & Fitness',
            'Other Expense'
        ],
        income: [
            'Salary',
            'Freelance',
            'Investment',
            'Business',
            'Other Income'
        ]
    };

    // --- State ---
    let transactions = [];
    let activeTypeFilter = 'all'; // 'all' | 'income' | 'expense'
    let activeCategoryFilter = 'all';
    let activeSort = 'dateDesc';
    let searchQuery = '';
    let txPendingDeleteId = null;

    // --- DOM Elements ---
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById('themeToggleBtn');

    // Summary Elements
    const totalBalanceEl = document.getElementById('totalBalance');
    const totalIncomeEl = document.getElementById('totalIncome');
    const totalExpensesEl = document.getElementById('totalExpenses');

    // Form Elements
    const transactionForm = document.getElementById('transactionForm');
    const transactionTypeInput = document.getElementById('transactionType');
    const btnTypeExpense = document.getElementById('btnTypeExpense');
    const btnTypeIncome = document.getElementById('btnTypeIncome');
    const txDescriptionInput = document.getElementById('txDescription');
    const txAmountInput = document.getElementById('txAmount');
    const txCategorySelect = document.getElementById('txCategory');
    const txDateInput = document.getElementById('txDate');

    const descError = document.getElementById('descError');
    const amountError = document.getElementById('amountError');
    const dateError = document.getElementById('dateError');

    // History Controls
    const historySearch = document.getElementById('historySearch');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const filterCategorySelect = document.getElementById('filterCategorySelect');
    const sortBySelect = document.getElementById('sortBySelect');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    const emptyResetBtn = document.getElementById('emptyResetBtn');
    const historyCounter = document.getElementById('historyCounter');

    // List & Empty State
    const transactionList = document.getElementById('transactionList');
    const emptyState = document.getElementById('emptyState');

    // Edit Modal
    const editModal = document.getElementById('editModal');
    const editTxForm = document.getElementById('editTxForm');
    const editTxIdInput = document.getElementById('editTxId');
    const editTransactionTypeInput = document.getElementById('editTransactionType');
    const editBtnTypeExpense = document.getElementById('editBtnTypeExpense');
    const editBtnTypeIncome = document.getElementById('editBtnTypeIncome');
    const editTxDescriptionInput = document.getElementById('editTxDescription');
    const editTxAmountInput = document.getElementById('editTxAmount');
    const editTxCategorySelect = document.getElementById('editTxCategory');
    const editTxDateInput = document.getElementById('editTxDate');

    const editDescError = document.getElementById('editDescError');
    const editAmountError = document.getElementById('editAmountError');
    const editDateError = document.getElementById('editDateError');

    const closeEditModalBtn = document.getElementById('closeEditModalBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    // Delete Modal
    const deleteModal = document.getElementById('deleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    // Toast
    const toastContainer = document.getElementById('toastContainer');

    // --- Demo Transactions ---
    const defaultDemoTransactions = [
        {
            id: 'tx_demo_1',
            type: 'income',
            description: 'Monthly Engineering Salary',
            amount: 3500.00,
            category: 'Salary',
            date: getFormattedDateOffset(-2),
            createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
        },
        {
            id: 'tx_demo_2',
            type: 'expense',
            description: 'Apartment Rent & Utilities',
            amount: 1200.00,
            category: 'Utilities & Bills',
            date: getFormattedDateOffset(-3),
            createdAt: new Date(Date.now() - 3600000 * 72).toISOString()
        },
        {
            id: 'tx_demo_3',
            type: 'income',
            description: 'Frontend UI Client Contract',
            amount: 850.00,
            category: 'Freelance',
            date: getFormattedDateOffset(-4),
            createdAt: new Date(Date.now() - 3600000 * 96).toISOString()
        },
        {
            id: 'tx_demo_4',
            type: 'expense',
            description: 'Organic Groceries & Produce',
            amount: 145.80,
            category: 'Food & Dining',
            date: getFormattedDateOffset(-1),
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
        },
        {
            id: 'tx_demo_5',
            type: 'expense',
            description: 'Subway & Transit Pass',
            amount: 60.00,
            category: 'Transportation',
            date: getFormattedDateOffset(0),
            createdAt: new Date().toISOString()
        }
    ];

    function getFormattedDateOffset(daysOffset) {
        const d = new Date();
        d.setDate(d.getDate() + daysOffset);
        return d.toISOString().split('T')[0];
    }

    // --- Initialization ---
    function init() {
        initTheme();
        setDefaultDate();
        loadTransactions();
        populateCategoryOptions(txCategorySelect, 'expense');
        populateFilterCategoryDropdown();
        bindEvents();
        render();
    }

    // --- Theme Management ---
    function initTheme() {
        const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
        if (savedTheme) {
            htmlElement.setAttribute('data-theme', savedTheme);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            htmlElement.setAttribute('data-theme', 'dark');
        } else {
            htmlElement.setAttribute('data-theme', 'light');
        }
    }

    function toggleTheme() {
        const current = htmlElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', next);
        localStorage.setItem(STORAGE_KEY_THEME, next);
        showToast(`Switched to ${next} mode`, 'info');
    }

    function setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        txDateInput.value = today;
    }

    // --- Local Storage Management ---
    function loadTransactions() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    transactions = parsed;
                    return;
                }
            }
        } catch (e) {
            console.error('Failed to load transactions:', e);
        }
        transactions = [...defaultDemoTransactions];
        saveTransactions();
    }

    function saveTransactions() {
        try {
            localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
        } catch (e) {
            console.error('Failed to save transactions:', e);
            showToast('Warning: Could not save to local storage', 'danger');
        }
    }

    // --- Dynamic Form Categories ---
    function populateCategoryOptions(selectElement, type) {
        selectElement.innerHTML = '';
        const list = CATEGORIES[type] || CATEGORIES.expense;
        list.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            selectElement.appendChild(opt);
        });
    }

    function populateFilterCategoryDropdown() {
        const previousVal = filterCategorySelect.value;
        filterCategorySelect.innerHTML = '<option value="all">All Categories</option>';

        const allCats = new Set();
        CATEGORIES.expense.forEach(c => allCats.add(c));
        CATEGORIES.income.forEach(c => allCats.add(c));

        allCats.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.textContent = cat;
            filterCategorySelect.appendChild(opt);
        });

        if (previousVal && allCats.has(previousVal)) {
            filterCategorySelect.value = previousVal;
        }
    }

    // --- CRUD Operations ---
    function handleAddTransaction(e) {
        e.preventDefault();

        const type = transactionTypeInput.value;
        const desc = txDescriptionInput.value.trim();
        const amount = parseFloat(txAmountInput.value);
        const category = txCategorySelect.value;
        const date = txDateInput.value;

        let isValid = true;

        // Validation
        if (!desc) {
            descError.classList.add('show');
            txDescriptionInput.focus();
            isValid = false;
        } else {
            descError.classList.remove('show');
        }

        if (isNaN(amount) || amount <= 0) {
            amountError.classList.add('show');
            if (isValid) txAmountInput.focus();
            isValid = false;
        } else {
            amountError.classList.remove('show');
        }

        if (!date) {
            dateError.classList.add('show');
            if (isValid) txDateInput.focus();
            isValid = false;
        } else {
            dateError.classList.remove('show');
        }

        if (!isValid) return;

        const newTx = {
            id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
            type: type,
            description: desc,
            amount: amount,
            category: category,
            date: date,
            createdAt: new Date().toISOString()
        };

        transactions.unshift(newTx);
        saveTransactions();
        render();

        // Reset form
        txDescriptionInput.value = '';
        txAmountInput.value = '';
        setDefaultDate();
        txDescriptionInput.focus();

        showToast(`${type === 'income' ? 'Income' : 'Expense'} added successfully!`, 'success');
    }

    function openEditModal(txId) {
        const tx = transactions.find(t => t.id === txId);
        if (!tx) return;

        editTxIdInput.value = tx.id;
        editTransactionTypeInput.value = tx.type;
        setEditTypeToggle(tx.type);

        editTxDescriptionInput.value = tx.description;
        editTxAmountInput.value = tx.amount;
        populateCategoryOptions(editTxCategorySelect, tx.type);
        editTxCategorySelect.value = tx.category;
        editTxDateInput.value = tx.date;

        editDescError.classList.remove('show');
        editAmountError.classList.remove('show');
        editDateError.classList.remove('show');

        editModal.classList.remove('hidden');
        editTxDescriptionInput.focus();
    }

    function closeEditModal() {
        editModal.classList.add('hidden');
        editTxForm.reset();
    }

    function handleSaveEdit(e) {
        e.preventDefault();
        const txId = editTxIdInput.value;
        const type = editTransactionTypeInput.value;
        const desc = editTxDescriptionInput.value.trim();
        const amount = parseFloat(editTxAmountInput.value);
        const category = editTxCategorySelect.value;
        const date = editTxDateInput.value;

        let isValid = true;

        if (!desc) {
            editDescError.classList.add('show');
            editTxDescriptionInput.focus();
            isValid = false;
        } else {
            editDescError.classList.remove('show');
        }

        if (isNaN(amount) || amount <= 0) {
            editAmountError.classList.add('show');
            if (isValid) editTxAmountInput.focus();
            isValid = false;
        } else {
            editAmountError.classList.remove('show');
        }

        if (!date) {
            editDateError.classList.add('show');
            if (isValid) editTxDateInput.focus();
            isValid = false;
        } else {
            editDateError.classList.remove('show');
        }

        if (!isValid) return;

        const txIndex = transactions.findIndex(t => t.id === txId);
        if (txIndex === -1) return;

        transactions[txIndex].type = type;
        transactions[txIndex].description = desc;
        transactions[txIndex].amount = amount;
        transactions[txIndex].category = category;
        transactions[txIndex].date = date;

        saveTransactions();
        closeEditModal();
        render();
        showToast('Transaction updated successfully!', 'success');
    }

    function openDeleteModal(txId) {
        txPendingDeleteId = txId;
        deleteModal.classList.remove('hidden');
        confirmDeleteBtn.focus();
    }

    function closeDeleteModal() {
        txPendingDeleteId = null;
        deleteModal.classList.add('hidden');
    }

    function handleConfirmDelete() {
        if (!txPendingDeleteId) return;
        transactions = transactions.filter(t => t.id !== txPendingDeleteId);
        saveTransactions();
        closeDeleteModal();
        render();
        showToast('Transaction deleted', 'danger');
    }

    // --- Calculation & Summaries ---
    function updateSummaries() {
        let totalIncome = 0;
        let totalExpenses = 0;

        transactions.forEach(tx => {
            if (tx.type === 'income') {
                totalIncome += tx.amount;
            } else if (tx.type === 'expense') {
                totalExpenses += tx.amount;
            }
        });

        const currentBalance = totalIncome - totalExpenses;

        totalIncomeEl.textContent = formatCurrency(totalIncome);
        totalExpensesEl.textContent = formatCurrency(totalExpenses);

        totalBalanceEl.textContent = (currentBalance < 0 ? '-' : '') + formatCurrency(Math.abs(currentBalance));
        totalBalanceEl.style.color = currentBalance >= 0 ? 'var(--income-color)' : 'var(--expense-color)';
    }

    function formatCurrency(num) {
        return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // --- Filter, Search & Sort Logic ---
    function getFilteredAndSortedTransactions() {
        const filtered = transactions.filter(tx => {
            // Type filter
            if (activeTypeFilter !== 'all' && tx.type !== activeTypeFilter) return false;

            // Category filter
            if (activeCategoryFilter !== 'all' && tx.category !== activeCategoryFilter) return false;

            // Search query
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchDesc = tx.description.toLowerCase().includes(q);
                const matchCat = tx.category.toLowerCase().includes(q);
                if (!matchDesc && !matchCat) return false;
            }

            return true;
        });

        // Sort
        filtered.sort((a, b) => {
            switch (activeSort) {
                case 'dateDesc':
                    return b.date.localeCompare(a.date) || new Date(b.createdAt) - new Date(a.createdAt);
                case 'dateAsc':
                    return a.date.localeCompare(b.date) || new Date(a.createdAt) - new Date(b.createdAt);
                case 'amountHigh':
                    return b.amount - a.amount;
                case 'amountLow':
                    return a.amount - b.amount;
                default:
                    return 0;
            }
        });

        return filtered;
    }

    // --- Rendering ---
    function render() {
        updateSummaries();

        const visibleTx = getFilteredAndSortedTransactions();
        historyCounter.textContent = `Showing ${visibleTx.length} of ${transactions.length} transactions`;

        if (visibleTx.length === 0) {
            transactionList.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        transactionList.innerHTML = '';
        const fragment = document.createDocumentFragment();

        visibleTx.forEach(tx => {
            const item = document.createElement('div');
            item.className = `tx-item tx-${tx.type}`;
            item.setAttribute('role', 'listitem');
            item.setAttribute('data-id', tx.id);

            const isIncome = tx.type === 'income';
            const iconSvg = isIncome
                ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>'
                : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>';

            const amountSign = isIncome ? '+' : '-';

            item.innerHTML = `
                <div class="tx-left">
                    <div class="tx-icon-badge" aria-hidden="true">${iconSvg}</div>
                    <div class="tx-info">
                        <div class="tx-desc">${escapeHTML(tx.description)}</div>
                        <div class="tx-meta">
                            <span class="tx-category-badge">${escapeHTML(tx.category)}</span>
                            <span>${formatDisplayDate(tx.date)}</span>
                        </div>
                    </div>
                </div>

                <div class="tx-right">
                    <span class="tx-amount">${amountSign} ${formatCurrency(tx.amount)}</span>
                    <div class="tx-actions">
                        <button type="button" class="action-btn edit-btn" aria-label="Edit transaction '${escapeHTML(tx.description)}'" title="Edit">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button type="button" class="action-btn delete-btn" aria-label="Delete transaction '${escapeHTML(tx.description)}'" title="Delete">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            `;

            item.querySelector('.edit-btn').addEventListener('click', () => openEditModal(tx.id));
            item.querySelector('.delete-btn').addEventListener('click', () => openDeleteModal(tx.id));

            fragment.appendChild(item);
        });

        transactionList.appendChild(fragment);
    }

    function formatDisplayDate(dateStr) {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        const year = parts[0];
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[monthIndex]} ${day}, ${year}`;
    }

    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 2600);
    }

    // --- Type Toggle Helpers ---
    function setTypeToggle(type) {
        transactionTypeInput.value = type;
        if (type === 'expense') {
            btnTypeExpense.classList.add('active-expense');
            btnTypeExpense.setAttribute('aria-checked', 'true');
            btnTypeIncome.classList.remove('active-income');
            btnTypeIncome.setAttribute('aria-checked', 'false');
        } else {
            btnTypeIncome.classList.add('active-income');
            btnTypeIncome.setAttribute('aria-checked', 'true');
            btnTypeExpense.classList.remove('active-expense');
            btnTypeExpense.setAttribute('aria-checked', 'false');
        }
        populateCategoryOptions(txCategorySelect, type);
    }

    function setEditTypeToggle(type) {
        editTransactionTypeInput.value = type;
        if (type === 'expense') {
            editBtnTypeExpense.classList.add('active-expense');
            editBtnTypeIncome.classList.remove('active-income');
        } else {
            editBtnTypeIncome.classList.add('active-income');
            editBtnTypeExpense.classList.remove('active-expense');
        }
    }

    // --- Event Listeners Binding ---
    function bindEvents() {
        themeToggleBtn.addEventListener('click', toggleTheme);

        // Type toggle buttons
        btnTypeExpense.addEventListener('click', () => setTypeToggle('expense'));
        btnTypeIncome.addEventListener('click', () => setTypeToggle('income'));

        // Edit Type toggle buttons
        editBtnTypeExpense.addEventListener('click', () => {
            setEditTypeToggle('expense');
            populateCategoryOptions(editTxCategorySelect, 'expense');
        });
        editBtnTypeIncome.addEventListener('click', () => {
            setEditTypeToggle('income');
            populateCategoryOptions(editTxCategorySelect, 'income');
        });

        // Add Transaction Form
        transactionForm.addEventListener('submit', handleAddTransaction);

        // Real-time validation clearing
        txDescriptionInput.addEventListener('input', () => {
            if (txDescriptionInput.value.trim()) descError.classList.remove('show');
        });
        txAmountInput.addEventListener('input', () => {
            if (parseFloat(txAmountInput.value) > 0) amountError.classList.remove('show');
        });
        txDateInput.addEventListener('change', () => {
            if (txDateInput.value) dateError.classList.remove('show');
        });

        // Search Input
        historySearch.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            clearSearchBtn.classList.toggle('show', !!searchQuery);
            render();
        });

        clearSearchBtn.addEventListener('click', () => {
            historySearch.value = '';
            searchQuery = '';
            clearSearchBtn.classList.remove('show');
            historySearch.focus();
            render();
        });

        // Filter Tabs
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
                activeTypeFilter = tab.getAttribute('data-filter');
                render();
            });
        });

        // Category Filter
        filterCategorySelect.addEventListener('change', (e) => {
            activeCategoryFilter = e.target.value;
            render();
        });

        // Sort By
        sortBySelect.addEventListener('change', (e) => {
            activeSort = e.target.value;
            render();
        });

        // Reset Filters
        const handleReset = () => {
            historySearch.value = '';
            searchQuery = '';
            clearSearchBtn.classList.remove('show');

            activeTypeFilter = 'all';
            filterTabs.forEach(t => {
                const isAll = t.getAttribute('data-filter') === 'all';
                t.classList.toggle('active', isAll);
                t.setAttribute('aria-selected', isAll ? 'true' : 'false');
            });

            activeCategoryFilter = 'all';
            filterCategorySelect.value = 'all';

            activeSort = 'dateDesc';
            sortBySelect.value = 'dateDesc';

            render();
            showToast('All filters have been reset', 'info');
        };

        resetFiltersBtn.addEventListener('click', handleReset);
        emptyResetBtn.addEventListener('click', handleReset);

        // Edit Modal Events
        editTxForm.addEventListener('submit', handleSaveEdit);
        closeEditModalBtn.addEventListener('click', closeEditModal);
        cancelEditBtn.addEventListener('click', closeEditModal);
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) closeEditModal();
        });

        // Delete Modal Events
        cancelDeleteBtn.addEventListener('click', closeDeleteModal);
        confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
        deleteModal.addEventListener('click', (e) => {
            if (e.target === deleteModal) closeDeleteModal();
        });

        // Global Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (!editModal.classList.contains('hidden')) closeEditModal();
                if (!deleteModal.classList.contains('hidden')) closeDeleteModal();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
