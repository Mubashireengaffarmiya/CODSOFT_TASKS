/**
 * DevChronicles - Article Detail Application Logic (CodSoft Task 5)
 * Handles dynamic article loading, related posts, social sharing,
 * and persistent XSS-sanitized comment system.
 */

(function () {
    'use strict';

    // --- Storage Keys ---
    const STORAGE_KEY_THEME = 'codsoft_blog_theme';
    const STORAGE_KEY_COMMENTS_PREFIX = 'codsoft_blog_comments_';

    // --- DOM Elements ---
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    // Article Elements
    const articleView = document.getElementById('articleView');
    const articleNotFound = document.getElementById('articleNotFound');

    const breadcrumbCategory = document.getElementById('breadcrumbCategory');
    const breadcrumbTitle = document.getElementById('breadcrumbTitle');

    const articleCategory = document.getElementById('articleCategory');
    const articleTitle = document.getElementById('articleTitle');
    const articleExcerpt = document.getElementById('articleExcerpt');
    const authorAvatar = document.getElementById('authorAvatar');
    const authorName = document.getElementById('authorName');
    const authorRole = document.getElementById('authorRole');
    const publishDateText = document.getElementById('publishDateText');
    const readTimeText = document.getElementById('readTimeText');
    const articleImage = document.getElementById('articleImage');
    const articleBody = document.getElementById('articleBody');
    const articleTagsList = document.getElementById('articleTagsList');

    // Social Share Buttons
    const shareCopyBtn = document.getElementById('shareCopyBtn');
    const shareTwitterBtn = document.getElementById('shareTwitterBtn');
    const shareLinkedInBtn = document.getElementById('shareLinkedInBtn');
    const shareWhatsAppBtn = document.getElementById('shareWhatsAppBtn');

    // Related Posts
    const relatedArticlesGrid = document.getElementById('relatedArticlesGrid');

    // Comments
    const commentsCountEl = document.getElementById('commentsCount');
    const commentForm = document.getElementById('commentForm');
    const commentAuthorInput = document.getElementById('commentAuthor');
    const commentContentInput = document.getElementById('commentContent');
    const nameError = document.getElementById('nameError');
    const commentError = document.getElementById('commentError');
    const commentsList = document.getElementById('commentsList');

    // Toast
    const blogToast = document.getElementById('blogToast');

    // Active Post
    let currentPost = null;

    // --- Initialization ---
    function init() {
        initTheme();
        bindThemeAndNav();
        loadArticle();
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

    function bindThemeAndNav() {
        themeToggleBtn.addEventListener('click', toggleTheme);

        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
                mobileMenuBtn.setAttribute('aria-expanded', (!isExpanded).toString());
                navMenu.classList.toggle('mobile-open', !isExpanded);
            });
        }
    }

    // --- Load Article Logic ---
    function loadArticle() {
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');

        if (!articleId) {
            show404();
            return;
        }

        // Search by slug or id
        currentPost = BLOG_POSTS.find(p => p.slug === articleId || p.id === articleId);

        if (!currentPost) {
            show404();
            return;
        }

        renderArticle(currentPost);
        renderRelatedArticles(currentPost);
        initSocialSharing(currentPost);
        initComments(currentPost);
    }

    function show404() {
        if (articleView) articleView.classList.add('hidden');
        if (articleNotFound) articleNotFound.classList.remove('hidden');
        document.title = 'Article Not Found | DevChronicles';
    }

    function renderArticle(post) {
        document.title = `${post.title} | DevChronicles`;

        breadcrumbCategory.textContent = post.category;
        breadcrumbTitle.textContent = post.title;

        articleCategory.textContent = post.category;
        articleTitle.textContent = post.title;
        articleExcerpt.textContent = post.excerpt;

        authorAvatar.src = post.author.avatar;
        authorAvatar.alt = `${post.author.name} avatar`;
        authorName.textContent = post.author.name;
        authorRole.textContent = post.author.role;

        publishDateText.textContent = formatDate(post.publishDate);
        readTimeText.textContent = post.readTime;

        articleImage.src = post.image;
        articleImage.alt = `${post.title} cover`;

        // Render full content
        articleBody.innerHTML = post.content;

        // Render tags
        articleTagsList.innerHTML = '';
        post.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'tag-badge';
            tagSpan.textContent = `#${tag}`;
            articleTagsList.appendChild(tagSpan);
        });
    }

    // --- Related Articles Recommendations ---
    function renderRelatedArticles(post) {
        // Find posts sharing the same category or tags, excluding current post
        const related = BLOG_POSTS.filter(p => {
            if (p.id === post.id) return false;
            const sameCategory = p.category === post.category;
            const sharedTags = p.tags.some(t => post.tags.includes(t));
            return sameCategory || sharedTags;
        }).slice(0, 2);

        relatedArticlesGrid.innerHTML = '';

        if (related.length === 0) {
            // Fallback to any 2 other posts
            const fallback = BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 2);
            fallback.forEach(item => appendRelatedCard(item));
            return;
        }

        related.forEach(item => appendRelatedCard(item));
    }

    function appendRelatedCard(item) {
        const card = document.createElement('a');
        card.href = `blog.html?id=${item.slug}`;
        card.className = 'related-card';

        card.innerHTML = `
            <img src="${item.image}" alt="${escapeHTML(item.title)}" class="related-card-img" loading="lazy">
            <div class="related-card-body">
                <span class="related-card-cat">${escapeHTML(item.category)}</span>
                <h4 class="related-card-title">${escapeHTML(item.title)}</h4>
            </div>
        `;

        relatedArticlesGrid.appendChild(card);
    }

    // --- Social Sharing Toolbar ---
    function initSocialSharing(post) {
        const currentUrl = window.location.href;
        const encodedUrl = encodeURIComponent(currentUrl);
        const encodedTitle = encodeURIComponent(post.title);

        // Copy Link
        shareCopyBtn.addEventListener('click', () => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(currentUrl).then(() => {
                    showToast('Article link copied to clipboard! 📋');
                }).catch(() => {
                    fallbackCopy(currentUrl);
                });
            } else {
                fallbackCopy(currentUrl);
            }
        });

        // Twitter / X
        shareTwitterBtn.addEventListener('click', () => {
            const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
            window.open(twitterUrl, '_blank', 'noopener,noreferrer');
        });

        // LinkedIn
        shareLinkedInBtn.addEventListener('click', () => {
            const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
            window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
        });

        // WhatsApp
        shareWhatsAppBtn.addEventListener('click', () => {
            const waUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        });
    }

    function fallbackCopy(text) {
        const temp = document.createElement('textarea');
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast('Article link copied to clipboard! 📋');
    }

    // --- Interactive Comments System ---
    function initComments(post) {
        const storageKey = STORAGE_KEY_COMMENTS_PREFIX + post.id;
        let comments = [];

        try {
            const raw = localStorage.getItem(storageKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) comments = parsed;
            }
        } catch (e) {
            comments = [];
        }

        // If no comments exist yet, add one friendly starter comment
        if (comments.length === 0) {
            comments.push({
                id: 'comment_init_' + post.id,
                author: 'DevCommunity Bot',
                content: 'Welcome to the discussion! Share your questions, real-world experiences, or alternative approaches with the community.',
                timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
            });
            saveComments(storageKey, comments);
        }

        renderComments(comments);

        // Form submission
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const author = commentAuthorInput.value.trim();
            const content = commentContentInput.value.trim();

            let isValid = true;

            if (!author) {
                nameError.classList.add('show');
                commentAuthorInput.focus();
                isValid = false;
            } else {
                nameError.classList.remove('show');
            }

            if (!content) {
                commentError.classList.add('show');
                if (isValid) commentContentInput.focus();
                isValid = false;
            } else {
                commentError.classList.remove('show');
            }

            if (!isValid) return;

            // Create new comment safely
            const newComment = {
                id: 'comm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                author: author,
                content: content,
                timestamp: new Date().toISOString()
            };

            comments.unshift(newComment);
            saveComments(storageKey, comments);
            renderComments(comments);

            // Reset form
            commentForm.reset();
            showToast('Your comment was posted successfully! 💬');
        });

        // Real-time validation clearing
        commentAuthorInput.addEventListener('input', () => {
            if (commentAuthorInput.value.trim()) nameError.classList.remove('show');
        });

        commentContentInput.addEventListener('input', () => {
            if (commentContentInput.value.trim()) commentError.classList.remove('show');
        });
    }

    function saveComments(key, comments) {
        try {
            localStorage.setItem(key, JSON.stringify(comments));
        } catch (e) {
            console.error('Failed to save comments:', e);
        }
    }

    function renderComments(comments) {
        commentsCountEl.textContent = comments.length;
        commentsList.innerHTML = '';

        const fragment = document.createDocumentFragment();

        comments.forEach(c => {
            const item = document.createElement('div');
            item.className = 'comment-item';
            item.setAttribute('role', 'listitem');

            const initials = getInitials(c.author);
            const safeAuthor = escapeHTML(c.author);
            const safeContent = escapeHTML(c.content);
            const timeAgo = formatTimeAgo(c.timestamp);

            item.innerHTML = `
                <div class="comment-avatar" aria-hidden="true">${initials}</div>
                <div class="comment-body">
                    <div class="comment-header">
                        <span class="comment-author-name">${safeAuthor}</span>
                        <span class="comment-time">${timeAgo}</span>
                    </div>
                    <p class="comment-text">${safeContent}</p>
                </div>
            `;

            fragment.appendChild(item);
        });

        commentsList.appendChild(fragment);
    }

    // --- Helpers ---
    function getInitials(name) {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substr(0, 2).toUpperCase();
    }

    function formatTimeAgo(isoString) {
        if (!isoString) return 'recently';
        const date = new Date(isoString);
        const diffMs = Date.now() - date.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 1) return 'just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'yesterday';
        if (diffDays < 30) return `${diffDays}d ago`;

        return formatDate(isoString.split('T')[0]);
    }

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

    // Execute on DOM Ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
