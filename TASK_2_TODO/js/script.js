/**
 * TaskFlow - CodSoft Task 2 To-Do List Application
 * Features: Full CRUD, Local Storage, Dynamic Search, Multi-Filter,
 * Priority, Categories, Due Dates, Overdue Detection, Dark Mode.
 */

(function () {
    'use strict';

    // --- Storage Keys ---
    const STORAGE_KEY_TASKS = 'codsoft_tasks';
    const STORAGE_KEY_THEME = 'codsoft_todo_theme';

    // --- State ---
    let tasks = [];
    let activeStatusFilter = 'all'; // 'all' | 'pending' | 'completed' | 'overdue'
    let activeCategoryFilter = 'all';
    let activePriorityFilter = 'all';
    let activeSort = 'pendingFirst';
    let searchQuery = '';
    let taskPendingDeleteId = null;

    // --- DOM Elements ---
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    
    // Stats Elements
    const totalTasksCountEl = document.getElementById('totalTasksCount');
    const pendingTasksCountEl = document.getElementById('pendingTasksCount');
    const completedTasksCountEl = document.getElementById('completedTasksCount');
    const overdueTasksCountEl = document.getElementById('overdueTasksCount');
    const visibleTasksCountEl = document.getElementById('visibleTasksCount');

    // Stat Cards (clickable filters)
    const statCardTotal = document.getElementById('statCardTotal');
    const statCardPending = document.getElementById('statCardPending');
    const statCardCompleted = document.getElementById('statCardCompleted');
    const statCardOverdue = document.getElementById('statCardOverdue');

    // Tab Badges
    const tabBadgeAll = document.getElementById('tabBadgeAll');
    const tabBadgePending = document.getElementById('tabBadgePending');
    const tabBadgeCompleted = document.getElementById('tabBadgeCompleted');
    const tabBadgeOverdue = document.getElementById('tabBadgeOverdue');

    // Form Elements
    const taskForm = document.getElementById('taskForm');
    const taskTitleInput = document.getElementById('taskTitle');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const taskCategoryInput = document.getElementById('taskCategory');
    const taskPriorityInput = document.getElementById('taskPriority');
    const taskDueDateInput = document.getElementById('taskDueDate');
    const titleError = document.getElementById('titleError');

    // Controls Elements
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const filterCategorySelect = document.getElementById('filterCategory');
    const filterPrioritySelect = document.getElementById('filterPriority');
    const sortBySelect = document.getElementById('sortBy');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');

    // List & Empty States
    const taskListContainer = document.getElementById('taskList');
    const emptyStateNoTasks = document.getElementById('emptyStateNoTasks');
    const emptyStateNoResults = document.getElementById('emptyStateNoResults');
    const emptyResetBtn = document.getElementById('emptyResetBtn');

    // Edit Modal Elements
    const editModal = document.getElementById('editModal');
    const editTaskForm = document.getElementById('editTaskForm');
    const editTaskIdInput = document.getElementById('editTaskId');
    const editTaskTitleInput = document.getElementById('editTaskTitle');
    const editTaskDescriptionInput = document.getElementById('editTaskDescription');
    const editTaskCategoryInput = document.getElementById('editTaskCategory');
    const editTaskPriorityInput = document.getElementById('editTaskPriority');
    const editTaskDueDateInput = document.getElementById('editTaskDueDate');
    const editTitleError = document.getElementById('editTitleError');
    const closeEditModalBtn = document.getElementById('closeEditModalBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    // Delete Modal Elements
    const deleteModal = document.getElementById('deleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    // Toast Container
    const toastContainer = document.getElementById('toastContainer');

    // --- Demo Tasks for Initial Demonstration ---
    const defaultDemoTasks = [
        {
            id: 'task_demo_1',
            title: 'Complete CodSoft Task 2 To-Do List Application',
            description: 'Implement full CRUD, dynamic search, categories, priority, due dates and dark mode.',
            category: 'Study',
            priority: 'High',
            dueDate: getFormattedDateOffset(1),
            completed: false,
            createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'task_demo_2',
            title: 'Prepare CodSoft Task 4 Music Player Assets',
            description: 'Source audio tracks and design responsive vinyl audio player layout.',
            category: 'Work',
            priority: 'Medium',
            dueDate: getFormattedDateOffset(2),
            completed: false,
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'task_demo_3',
            title: 'Review Task 1 Portfolio Website',
            description: 'Check navigation links, contact form validation, and responsive mobile view.',
            category: 'Personal',
            priority: 'Low',
            dueDate: getFormattedDateOffset(-1), // overdue for demo
            completed: false,
            createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'task_demo_4',
            title: 'Setup Git repository for CodSoft Internship submission',
            description: 'Organize folder structure for all 5 internship tasks.',
            category: 'Work',
            priority: 'High',
            dueDate: getFormattedDateOffset(-2),
            completed: true,
            createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];

    // Helper: format YYYY-MM-DD offset from today
    function getFormattedDateOffset(daysOffset) {
        const d = new Date();
        d.setDate(d.getDate() + daysOffset);
        return d.toISOString().split('T')[0];
    }

    // Helper: get today's date as YYYY-MM-DD in local time
    function getTodayDateString() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // --- Initialization ---
    function init() {
        initTheme();
        loadTasks();
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
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem(STORAGE_KEY_THEME, newTheme);
        showToast(`Switched to ${newTheme} theme`, 'info');
    }

    // --- Local Storage Management ---
    function loadTasks() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_TASKS);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    tasks = parsed;
                    return;
                }
            }
        } catch (e) {
            console.error('Failed to load tasks from localStorage, resetting to demo tasks:', e);
        }
        // If empty or malformed, populate with initial demo tasks
        tasks = [...defaultDemoTasks];
        saveTasks();
    }

    function saveTasks() {
        try {
            localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
        } catch (e) {
            console.error('Failed to save tasks to localStorage:', e);
            showToast('Warning: Could not save tasks to local storage.', 'danger');
        }
    }

    // --- Task CRUD Logic ---

    // 1. Add Task
    function handleAddTask(e) {
        e.preventDefault();
        const rawTitle = taskTitleInput.value;
        const title = rawTitle.trim();

        if (!title) {
            taskTitleInput.classList.add('input-error');
            titleError.classList.add('show');
            taskTitleInput.focus();
            return;
        }

        taskTitleInput.classList.remove('input-error');
        titleError.classList.remove('show');

        const newTask = {
            id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
            title: title,
            description: taskDescriptionInput.value.trim(),
            category: taskCategoryInput.value || 'Other',
            priority: taskPriorityInput.value || 'Medium',
            dueDate: taskDueDateInput.value || '',
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        tasks.unshift(newTask);
        saveTasks();
        render();

        // Reset form
        taskForm.reset();
        taskCategoryInput.value = 'Personal';
        taskPriorityInput.value = 'Medium';
        taskTitleInput.focus();

        showToast('Task added successfully!', 'success');
    }

    // 2. Toggle Task Completion
    function toggleTaskCompletion(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        task.completed = !task.completed;
        task.updatedAt = new Date().toISOString();
        saveTasks();
        render();

        const msg = task.completed ? 'Task marked as completed! 🎉' : 'Task marked as pending';
        showToast(msg, 'info');
    }

    // 3. Open Edit Modal
    function openEditModal(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        editTaskIdInput.value = task.id;
        editTaskTitleInput.value = task.title;
        editTaskDescriptionInput.value = task.description || '';
        editTaskCategoryInput.value = task.category || 'Other';
        editTaskPriorityInput.value = task.priority || 'Medium';
        editTaskDueDateInput.value = task.dueDate || '';

        editTaskTitleInput.classList.remove('input-error');
        editTitleError.classList.remove('show');

        editModal.classList.remove('hidden');
        editTaskTitleInput.focus();
    }

    function closeEditModal() {
        editModal.classList.add('hidden');
        editTaskForm.reset();
    }

    // 4. Save Edit
    function handleSaveEdit(e) {
        e.preventDefault();
        const taskId = editTaskIdInput.value;
        const rawTitle = editTaskTitleInput.value;
        const title = rawTitle.trim();

        if (!title) {
            editTaskTitleInput.classList.add('input-error');
            editTitleError.classList.add('show');
            editTaskTitleInput.focus();
            return;
        }

        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;

        tasks[taskIndex].title = title;
        tasks[taskIndex].description = editTaskDescriptionInput.value.trim();
        tasks[taskIndex].category = editTaskCategoryInput.value;
        tasks[taskIndex].priority = editTaskPriorityInput.value;
        tasks[taskIndex].dueDate = editTaskDueDateInput.value;
        tasks[taskIndex].updatedAt = new Date().toISOString();

        saveTasks();
        closeEditModal();
        render();
        showToast('Task updated successfully!', 'success');
    }

    // 5. Open Delete Modal
    function openDeleteModal(taskId) {
        taskPendingDeleteId = taskId;
        deleteModal.classList.remove('hidden');
        confirmDeleteBtn.focus();
    }

    function closeDeleteModal() {
        taskPendingDeleteId = null;
        deleteModal.classList.add('hidden');
    }

    // 6. Confirm Delete
    function handleConfirmDelete() {
        if (!taskPendingDeleteId) return;

        tasks = tasks.filter(t => t.id !== taskPendingDeleteId);
        saveTasks();
        closeDeleteModal();
        render();
        showToast('Task deleted successfully', 'danger');
    }

    // 7. Clear All Completed Tasks
    function handleClearCompleted() {
        const completedCount = tasks.filter(t => t.completed).length;
        if (completedCount === 0) {
            showToast('No completed tasks to clear.', 'info');
            return;
        }

        if (confirm(`Are you sure you want to remove all ${completedCount} completed tasks?`)) {
            tasks = tasks.filter(t => !t.completed);
            saveTasks();
            render();
            showToast(`Cleared ${completedCount} completed tasks`, 'info');
        }
    }

    // --- Filtering, Searching & Sorting Logic ---
    function getFilteredAndSortedTasks() {
        const todayStr = getTodayDateString();

        // 1. Filter
        const filtered = tasks.filter(task => {
            // Status filter
            if (activeStatusFilter === 'pending' && task.completed) return false;
            if (activeStatusFilter === 'completed' && !task.completed) return false;
            if (activeStatusFilter === 'overdue') {
                if (task.completed || !task.dueDate || task.dueDate >= todayStr) return false;
            }

            // Category filter
            if (activeCategoryFilter !== 'all' && task.category !== activeCategoryFilter) {
                return false;
            }

            // Priority filter
            if (activePriorityFilter !== 'all' && task.priority !== activePriorityFilter) {
                return false;
            }

            // Search query filter
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchTitle = task.title.toLowerCase().includes(q);
                const matchDesc = (task.description || '').toLowerCase().includes(q);
                const matchCategory = (task.category || '').toLowerCase().includes(q);
                if (!matchTitle && !matchDesc && !matchCategory) return false;
            }

            return true;
        });

        // 2. Sort
        const sorted = [...filtered].sort((a, b) => {
            switch (activeSort) {
                case 'pendingFirst':
                    if (a.completed !== b.completed) return a.completed ? 1 : -1;
                    // Then by due date
                    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
                    if (a.dueDate) return -1;
                    if (b.dueDate) return 1;
                    return new Date(b.createdAt) - new Date(a.createdAt);

                case 'dueDateAsc':
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return a.dueDate.localeCompare(b.dueDate);

                case 'dueDateDesc':
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return b.dueDate.localeCompare(a.dueDate);

                case 'priorityHigh': {
                    const priorityWeights = { High: 3, Medium: 2, Low: 1 };
                    const diff = (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
                    if (diff !== 0) return diff;
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }

                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);

                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);

                case 'alphabetical':
                    return a.title.localeCompare(b.title);

                default:
                    return 0;
            }
        });

        return sorted;
    }

    // --- Due Date Helper ---
    function getDueDateStatus(dueDateStr, isCompleted) {
        if (!dueDateStr) return null;

        const todayStr = getTodayDateString();

        if (isCompleted) {
            return {
                label: formatDisplayDate(dueDateStr),
                isOverdue: false,
                isToday: false
            };
        }

        if (dueDateStr < todayStr) {
            return {
                label: `Overdue: ${formatDisplayDate(dueDateStr)}`,
                isOverdue: true,
                isToday: false
            };
        } else if (dueDateStr === todayStr) {
            return {
                label: 'Due Today',
                isOverdue: false,
                isToday: true
            };
        } else {
            return {
                label: `Due ${formatDisplayDate(dueDateStr)}`,
                isOverdue: false,
                isToday: false
            };
        }
    }

    function formatDisplayDate(dateStr) {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        const year = parts[0];
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[monthIndex]} ${day}, ${year}`;
    }

    // --- Render Logic ---
    function render() {
        updateStats();

        const visibleTasks = getFilteredAndSortedTasks();
        visibleTasksCountEl.textContent = visibleTasks.length;

        // Manage Empty States
        if (tasks.length === 0) {
            taskListContainer.innerHTML = '';
            emptyStateNoTasks.classList.remove('hidden');
            emptyStateNoResults.classList.add('hidden');
            return;
        }

        emptyStateNoTasks.classList.add('hidden');

        if (visibleTasks.length === 0) {
            taskListContainer.innerHTML = '';
            emptyStateNoResults.classList.remove('hidden');
            return;
        }

        emptyStateNoResults.classList.add('hidden');

        // Render Task Items
        taskListContainer.innerHTML = '';
        const fragment = document.createDocumentFragment();

        visibleTasks.forEach(task => {
            const card = createTaskCardElement(task);
            fragment.appendChild(card);
        });

        taskListContainer.appendChild(fragment);
    }

    function createTaskCardElement(task) {
        const card = document.createElement('div');
        card.className = `task-card priority-${task.priority.toLowerCase()} ${task.completed ? 'completed' : ''}`;
        card.setAttribute('data-id', task.id);
        card.setAttribute('role', 'listitem');

        const dueDateInfo = getDueDateStatus(task.dueDate, task.completed);

        // Escape helper for safe HTML
        const safeTitle = escapeHTML(task.title);
        const safeDesc = task.description ? escapeHTML(task.description) : '';
        const categoryClass = `badge-category-${task.category.toLowerCase()}`;
        const priorityClass = `badge-priority-${task.priority.toLowerCase()}`;

        let dueDateBadgeHTML = '';
        if (dueDateInfo) {
            const statusClass = dueDateInfo.isOverdue ? 'is-overdue' : (dueDateInfo.isToday ? 'is-today' : '');
            dueDateBadgeHTML = `
                <span class="badge badge-due-date ${statusClass}" title="${dueDateInfo.isOverdue ? 'Task is overdue!' : ''}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    ${dueDateInfo.label}
                </span>
            `;
        }

        card.innerHTML = `
            <div class="task-checkbox-wrapper">
                <button 
                    type="button" 
                    class="task-checkbox" 
                    aria-label="${task.completed ? 'Mark task as pending' : 'Mark task as completed'}"
                    title="${task.completed ? 'Mark as pending' : 'Mark as completed'}"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </button>
            </div>

            <div class="task-card-content">
                <h3 class="task-card-title">${safeTitle}</h3>
                ${safeDesc ? `<p class="task-card-desc">${safeDesc}</p>` : ''}
                
                <div class="task-card-meta">
                    <span class="badge ${categoryClass}">
                        ${getCategoryIcon(task.category)} ${task.category}
                    </span>
                    <span class="badge ${priorityClass}">
                        ${task.priority} Priority
                    </span>
                    ${dueDateBadgeHTML}
                </div>
            </div>

            <div class="task-card-actions">
                <button type="button" class="action-btn edit-btn" aria-label="Edit task '${safeTitle}'" title="Edit task">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button type="button" class="action-btn delete-btn" aria-label="Delete task '${safeTitle}'" title="Delete task">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `;

        // Event delegation handlers for card
        const checkbox = card.querySelector('.task-checkbox');
        checkbox.addEventListener('click', () => toggleTaskCompletion(task.id));

        const editBtn = card.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => openEditModal(task.id));

        const deleteBtn = card.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => openDeleteModal(task.id));

        return card;
    }

    function getCategoryIcon(cat) {
        switch (cat) {
            case 'Work': return '💼';
            case 'Study': return '📚';
            case 'Personal': return '👤';
            case 'Health': return '💪';
            case 'Finance': return '💰';
            default: return '📌';
        }
    }

    function escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // --- Statistics Updating ---
    function updateStats() {
        const todayStr = getTodayDateString();
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const overdue = tasks.filter(t => !t.completed && t.dueDate && t.dueDate < todayStr).length;

        totalTasksCountEl.textContent = total;
        pendingTasksCountEl.textContent = pending;
        completedTasksCountEl.textContent = completed;
        overdueTasksCountEl.textContent = overdue;

        tabBadgeAll.textContent = total;
        tabBadgePending.textContent = pending;
        tabBadgeCompleted.textContent = completed;
        tabBadgeOverdue.textContent = overdue;
    }

    // --- Toast Notifications ---
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let iconSvg = '';
        if (type === 'success') {
            iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        } else if (type === 'danger') {
            iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
        } else {
            iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
        }

        toast.innerHTML = `${iconSvg} <span>${escapeHTML(message)}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // --- Event Listeners Binding ---
    function bindEvents() {
        // Theme toggle
        themeToggleBtn.addEventListener('click', toggleTheme);

        // Task Form submission
        taskForm.addEventListener('submit', handleAddTask);

        // Real-time title validation clearing
        taskTitleInput.addEventListener('input', () => {
            if (taskTitleInput.value.trim()) {
                taskTitleInput.classList.remove('input-error');
                titleError.classList.remove('show');
            }
        });

        // Search Input
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            if (searchQuery) {
                clearSearchBtn.classList.add('show');
            } else {
                clearSearchBtn.classList.remove('show');
            }
            render();
        });

        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchQuery = '';
            clearSearchBtn.classList.remove('show');
            searchInput.focus();
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
                activeStatusFilter = tab.getAttribute('data-status');
                render();
            });
        });

        // Clickable Stats Cards triggering Tabs
        const setupStatCardClick = (cardEl, status) => {
            const clickHandler = () => {
                activeStatusFilter = status;
                filterTabs.forEach(t => {
                    const match = t.getAttribute('data-status') === status;
                    t.classList.toggle('active', match);
                    t.setAttribute('aria-selected', match ? 'true' : 'false');
                });
                render();
            };
            cardEl.addEventListener('click', clickHandler);
            cardEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    clickHandler();
                }
            });
        };

        setupStatCardClick(statCardTotal, 'all');
        setupStatCardClick(statCardPending, 'pending');
        setupStatCardClick(statCardCompleted, 'completed');
        setupStatCardClick(statCardOverdue, 'overdue');

        // Category Filter
        filterCategorySelect.addEventListener('change', (e) => {
            activeCategoryFilter = e.target.value;
            render();
        });

        // Priority Filter
        filterPrioritySelect.addEventListener('change', (e) => {
            activePriorityFilter = e.target.value;
            render();
        });

        // Sort By
        sortBySelect.addEventListener('change', (e) => {
            activeSort = e.target.value;
            render();
        });

        // Reset Filters Button
        const handleResetFilters = () => {
            searchInput.value = '';
            searchQuery = '';
            clearSearchBtn.classList.remove('show');

            activeStatusFilter = 'all';
            filterTabs.forEach(t => {
                const isAll = t.getAttribute('data-status') === 'all';
                t.classList.toggle('active', isAll);
                t.setAttribute('aria-selected', isAll ? 'true' : 'false');
            });

            activeCategoryFilter = 'all';
            filterCategorySelect.value = 'all';

            activePriorityFilter = 'all';
            filterPrioritySelect.value = 'all';

            activeSort = 'pendingFirst';
            sortBySelect.value = 'pendingFirst';

            render();
            showToast('All filters have been reset', 'info');
        };

        resetFiltersBtn.addEventListener('click', handleResetFilters);
        emptyResetBtn.addEventListener('click', handleResetFilters);

        // Clear Completed Tasks
        clearCompletedBtn.addEventListener('click', handleClearCompleted);

        // Edit Modal Events
        editTaskForm.addEventListener('submit', handleSaveEdit);
        closeEditModalBtn.addEventListener('click', closeEditModal);
        cancelEditBtn.addEventListener('click', closeEditModal);
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) closeEditModal();
        });

        editTaskTitleInput.addEventListener('input', () => {
            if (editTaskTitleInput.value.trim()) {
                editTaskTitleInput.classList.remove('input-error');
                editTitleError.classList.remove('show');
            }
        });

        // Delete Modal Events
        cancelDeleteBtn.addEventListener('click', closeDeleteModal);
        confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
        deleteModal.addEventListener('click', (e) => {
            if (e.target === deleteModal) closeDeleteModal();
        });

        // Global Keydown (Escape closes open modals)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (!editModal.classList.contains('hidden')) closeEditModal();
                if (!deleteModal.classList.contains('hidden')) closeDeleteModal();
            }
        });
    }

    // Execute on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
