/**
 * DevChronicles - Blog Website (CodSoft Task 5)
 * Homepage Application Logic: Search, Category Filtering,
 * Load More Pagination, Theme Toggle, and Mobile Navigation.
 */

(function () {
    'use strict';

    // --- Storage Keys ---
    const STORAGE_KEY_THEME = 'codsoft_blog_theme';

    // --- State ---
    let activeCategory = 'all';
    let searchQuery = '';
    const POSTS_PER_PAGE = 3;
    let visibleCount = POSTS_PER_PAGE;

    // --- DOM Elements ---
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    // Hero Section
    const heroArticleCard = document.getElementById('heroArticleCard');

    // Search & Filters
    const blogSearchInput = document.getElementById('blogSearchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const categoryPills = document.querySelectorAll('.cat-pill');

    // Articles Grid & Pagination
    const blogGrid = document.getElementById('blogGrid');
    const articleCountText = document.getElementById('articleCountText');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    const emptyState = document.getElementById('emptyState');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');

    // Toast
    const blogToast = document.getElementById('blogToast');

    // --- Initialization ---
    function init() {
        initTheme();
        bindEvents();
        renderHero();
        renderArticles();
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
        showToast(`Switched to ${next} mode`);
    }

    // --- Hero Article Rendering ---
    function renderHero() {
        if (!heroArticleCard) return;

        // Find primary featured post, fallback to first post
        const featuredPost = BLOG_POSTS.find(p => p.featured) || BLOG_POSTS[0];
        if (!featuredPost) return;

        heroArticleCard.innerHTML = `
            <div class="hero-img-wrapper">
                <img src="${featuredPost.image}" alt="${escapeHTML(featuredPost.title)}" class="hero-img" loading="eager">
                <span class="hero-badge-featured">Featured Story</span>
            </div>
            <div class="hero-content">
                <div class="hero-meta">
                    <span class="hero-category">${escapeHTML(featuredPost.category)}</span>
                    <span>•</span>
                    <span>${formatDate(featuredPost.publishDate)}</span>
                    <span>•</span>
                    <span>${escapeHTML(featuredPost.readTime)}</span>
                </div>
                <h2 class="hero-title">
                    <a href="blog.html?id=${featuredPost.slug}">${escapeHTML(featuredPost.title)}</a>
                </h2>
                <p class="hero-excerpt">${escapeHTML(featuredPost.excerpt)}</p>
                <div class="hero-author-row">
                    <div class="author-media">
                        <img src="${featuredPost.author.avatar}" alt="${escapeHTML(featuredPost.author.name)}" class="author-avatar-img">
                        <div>
                            <div class="author-name-text">${escapeHTML(featuredPost.author.name)}</div>
                            <div class="author-role-text">${escapeHTML(featuredPost.author.role)}</div>
                        </div>
                    </div>
                    <a href="blog.html?id=${featuredPost.slug}" class="btn btn-primary btn-sm">
                        Read Story
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </a>
                </div>
            </div>
        `;
    }

    // --- Filter & Search Articles ---
    function getFilteredPosts() {
        return BLOG_POSTS.filter(post => {
            // Category filter
            if (activeCategory !== 'all' && post.category !== activeCategory) {
                return false;
            }

            // Search query filter
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchTitle = post.title.toLowerCase().includes(q);
                const matchExcerpt = post.excerpt.toLowerCase().includes(q);
                const matchTags = post.tags.some(t => t.toLowerCase().includes(q));
                const matchAuthor = post.author.name.toLowerCase().includes(q);
                if (!matchTitle && !matchExcerpt && !matchTags && !matchAuthor) {
                    return false;
                }
            }

            return true;
        });
    }

    // --- Render Articles Grid ---
    function renderArticles() {
        const filtered = getFilteredPosts();
        const total = filtered.length;

        // Manage Empty State
        if (total === 0) {
            blogGrid.innerHTML = '';
            emptyState.classList.remove('hidden');
            loadMoreContainer.style.display = 'none';
            articleCountText.textContent = 'Showing 0 articles';
            return;
        }

        emptyState.classList.add('hidden');

        // Slice posts for Load More pagination
        const postsToShow = filtered.slice(0, visibleCount);
        articleCountText.textContent = `Showing ${postsToShow.length} of ${total} articles`;

        // Manage Load More button visibility
        if (postsToShow.length >= total) {
            loadMoreContainer.style.display = 'none';
        } else {
            loadMoreContainer.style.display = 'flex';
        }

        // Render Cards
        blogGrid.innerHTML = '';
        const fragment = document.createDocumentFragment();

        postsToShow.forEach(post => {
            const card = document.createElement('article');
            card.className = 'blog-card';
            card.setAttribute('role', 'listitem');

            card.innerHTML = `
                <a href="blog.html?id=${post.slug}" class="card-img-link" tabindex="-1" aria-hidden="true">
                    <img src="${post.image}" alt="${escapeHTML(post.title)}" class="card-img" loading="lazy">
                    <span class="card-category-badge">${escapeHTML(post.category)}</span>
                </a>
                <div class="card-content">
                    <div class="card-meta-row">
                        <span>${formatDate(post.publishDate)}</span>
                        <span>•</span>
                        <span>${escapeHTML(post.readTime)}</span>
                    </div>
                    <h3 class="card-title">
                        <a href="blog.html?id=${post.slug}">${escapeHTML(post.title)}</a>
                    </h3>
                    <p class="card-excerpt">${escapeHTML(post.excerpt)}</p>
                    <div class="card-footer">
                        <div class="card-author-media">
                            <img src="${post.author.avatar}" alt="${escapeHTML(post.author.name)}" class="card-author-avatar">
                            <span class="card-author-name">${escapeHTML(post.author.name)}</span>
                        </div>
                        <a href="blog.html?id=${post.slug}" class="card-read-link" aria-label="Read full article: ${escapeHTML(post.title)}">
                            Read
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </a>
                    </div>
                </div>
            `;

            fragment.appendChild(card);
        });

        blogGrid.appendChild(fragment);
    }

    // --- Helpers ---
    function formatDate(dateStr) {
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

    function showToast(msg) {
        if (!blogToast) return;
        blogToast.textContent = msg;
        blogToast.classList.add('show');
        setTimeout(() => {
            blogToast.classList.remove('show');
        }, 2500);
    }

    // --- Event Listeners ---
    function bindEvents() {
        // Theme Toggle
        themeToggleBtn.addEventListener('click', toggleTheme);

        // Mobile Menu Toggle
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', (!isExpanded).toString());
            navMenu.classList.toggle('mobile-open', !isExpanded);
        });

        // Search Input
        blogSearchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            clearSearchBtn.classList.toggle('show', !!searchQuery);
            visibleCount = POSTS_PER_PAGE;
            renderArticles();
        });

        clearSearchBtn.addEventListener('click', () => {
            blogSearchInput.value = '';
            searchQuery = '';
            clearSearchBtn.classList.remove('show');
            blogSearchInput.focus();
            visibleCount = POSTS_PER_PAGE;
            renderArticles();
        });

        // Category Pills
        categoryPills.forEach(pill => {
            pill.addEventListener('click', () => {
                categoryPills.forEach(p => {
                    p.classList.remove('active');
                    p.setAttribute('aria-selected', 'false');
                });
                pill.classList.add('active');
                pill.setAttribute('aria-selected', 'true');
                activeCategory = pill.getAttribute('data-category');
                visibleCount = POSTS_PER_PAGE;
                renderArticles();
            });
        });

        // Footer Category Links
        document.querySelectorAll('.footer-list a[data-cat]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetCat = link.getAttribute('data-cat');
                categoryPills.forEach(p => {
                    const match = p.getAttribute('data-category') === targetCat;
                    p.classList.toggle('active', match);
                    p.setAttribute('aria-selected', match ? 'true' : 'false');
                });
                activeCategory = targetCat;
                visibleCount = POSTS_PER_PAGE;
                renderArticles();
                document.getElementById('categoriesSection').scrollIntoView({ behavior: 'smooth' });
            });
        });

        // Load More Button
        loadMoreBtn.addEventListener('click', () => {
            visibleCount += POSTS_PER_PAGE;
            renderArticles();
        });

        // Reset Filters Button
        const handleReset = () => {
            blogSearchInput.value = '';
            searchQuery = '';
            clearSearchBtn.classList.remove('show');
            activeCategory = 'all';
            categoryPills.forEach(p => {
                const isAll = p.getAttribute('data-category') === 'all';
                p.classList.toggle('active', isAll);
                p.setAttribute('aria-selected', isAll ? 'true' : 'false');
            });
            visibleCount = POSTS_PER_PAGE;
            renderArticles();
            showToast('Filters have been reset');
        };

        resetFiltersBtn.addEventListener('click', handleReset);
    }

    // Execute on DOM Ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
