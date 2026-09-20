/**
 * Blog Articles Dataset - CodSoft Task 5 Blog Website
 * Contains comprehensive, high-quality tech & web development articles.
 */

const BLOG_POSTS = [
    {
        id: 'mastering-modern-css-grid-flexbox',
        slug: 'mastering-modern-css-grid-flexbox',
        title: 'Mastering Modern CSS: When to Use Grid vs. Flexbox in 2026',
        excerpt: 'Understand the architectural philosophies behind CSS Grid and Flexbox, and discover how to combine both for resilient, future-proof responsive layouts.',
        category: 'Frontend',
        tags: ['CSS', 'Responsive Design', 'Web Development'],
        author: {
            name: 'Alex Rivera',
            role: 'Lead UI Engineer',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        },
        publishDate: '2026-03-15',
        readTime: '6 min read',
        featured: true,
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=900&auto=format&fit=crop&q=80',
        content: `
            <p class="lead">For years, web developers debated whether CSS Grid would replace Flexbox. Today, modern frontend engineering treats them not as competitors, but as harmonious partners in layout design.</p>
            
            <h2>The Fundamental Distinction: 1D vs. 2D</h2>
            <p>The golden rule of modern CSS layout is straightforward: <strong>Flexbox is one-dimensional</strong>, whereas <strong>Grid is two-dimensional</strong>.</p>
            <p>Flexbox excels when laying out items along a single axis—either a row or a column. Think navigation bars, button clusters, or card headers where content determines width. CSS Grid, by contrast, gives you orchestrating power over both rows and columns simultaneously.</p>

            <blockquote>
                "Flexbox is content-first; CSS Grid is layout-first. Understanding this single mental model resolves 90% of layout conundrums."
            </blockquote>

            <h2>When to Reach for CSS Grid</h2>
            <p>CSS Grid is unrivaled when you require strict geometric alignment across multiple axes:</p>
            <ul>
                <li><strong>Page-level shells:</strong> Headers, sidebars, main content areas, and footers.</li>
                <li><strong>Dynamic photo & card galleries:</strong> Using <code>grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))</code> creates responsive cards without a single media query.</li>
                <li><strong>Overlapping elements:</strong> Positioning hero banners, badges, or overlays without resorting to brittle <code>position: absolute</code> hacks.</li>
            </ul>

            <h2>When to Reach for Flexbox</h2>
            <p>Flexbox remains the champion for micro-layouts within individual components:</p>
            <ul>
                <li>Centering content vertically and horizontally with <code>justify-content: center</code> and <code>align-items: center</code>.</li>
                <li>Distributing navigation links evenly across a header.</li>
                <li>Building tag pills, button groups, and media object patterns (avatar alongside text).</li>
            </ul>

            <h2>Conclusion</h2>
            <p>The most resilient web applications combine both techniques: use CSS Grid for the macro scaffolding of your pages, and Flexbox for the micro arrangement inside your components.</p>
        `
    },
    {
        id: 'javascript-event-loop-deep-dive',
        slug: 'javascript-event-loop-deep-dive',
        title: 'Deconstructing the JavaScript Event Loop: Microtasks, Macrotasks, and Rendering',
        excerpt: 'A visual and conceptual deep dive into how asynchronous JavaScript really works under the hood, from call stacks to Promise queues and browser repaint cycles.',
        category: 'JavaScript',
        tags: ['JavaScript', 'Async', 'Performance'],
        author: {
            name: 'Sarah Chen',
            role: 'Runtime Architect',
            avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
        },
        publishDate: '2026-03-10',
        readTime: '8 min read',
        featured: true,
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=80',
        content: `
            <p class="lead">JavaScript is single-threaded, yet modern web applications handle animations, user clicks, network requests, and streaming data without freezing. How? The secret lies in the Event Loop.</p>

            <h2>The Core Architecture</h2>
            <p>To master asynchronous JavaScript, we must examine four distinct actors in the browser runtime:</p>
            <ol>
                <li><strong>Call Stack:</strong> Where synchronous code executes in a Last-In, First-Out (LIFO) order.</li>
                <li><strong>Web APIs:</strong> Browser threads handling timers (<code>setTimeout</code>), fetch requests, and DOM events.</li>
                <li><strong>Microtask Queue:</strong> High-priority queue holding <code>Promise</code> callbacks (<code>.then</code>, <code>async/await</code>) and <code>MutationObserver</code>.</li>
                <li><strong>Macrotask (Task) Queue:</strong> Standard queue holding <code>setTimeout</code>, <code>setInterval</code>, and I/O callbacks.</li>
            </ol>

            <h2>The Priority Hierarchy</h2>
            <p>Whenever the Call Stack empties, the event loop does NOT jump straight to the macrotask queue. Instead, it systematically flushes <strong>all</strong> pending microtasks until the microtask queue is completely drained.</p>

            <pre><code>// Order of Execution Example:
console.log('1: Synchronous');

setTimeout(() => console.log('2: Macrotask (Timeout)'), 0);

Promise.resolve().then(() => console.log('3: Microtask (Promise)'));

console.log('4: Synchronous End');

// Output:
// 1: Synchronous
// 4: Synchronous End
// 3: Microtask (Promise)
// 2: Macrotask (Timeout)</code></pre>

            <h2>Impact on UI Smoothness</h2>
            <p>Because the browser rendering pipeline (recalculation, layout, paint) only runs between task cycles, starving the runtime with recursive microtasks can freeze the UI. Write lean async handlers to keep your frames at a steady 60–120 FPS.</p>
        `
    },
    {
        id: 'designing-accessible-web-interfaces',
        slug: 'designing-accessible-web-interfaces',
        title: 'Designing Accessible Web Interfaces: Beyond WCAG Checklists',
        excerpt: 'Accessibility is not an afterthought or a compliance checkbox. Learn practical techniques to make your web products genuinely usable for everyone.',
        category: 'UI/UX Design',
        tags: ['Accessibility', 'UX Design', 'HTML5', 'A11y'],
        author: {
            name: 'Marcus Vance',
            role: 'Accessibility Specialist',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        },
        publishDate: '2026-03-05',
        readTime: '5 min read',
        featured: false,
        image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=900&auto=format&fit=crop&q=80',
        content: `
            <p class="lead">Building accessible web applications is one of the highest expressions of engineering craftsmanship. Over 15% of the world's population lives with some form of disability.</p>

            <h2>Semantic HTML: The 90% Solution</h2>
            <p>Before introducing complex <code>aria-*</code> attributes, ensure your HTML semantic foundation is solid. Screen readers and assistive tools already understand standard HTML elements out of the box:</p>
            <ul>
                <li>Use <code>&lt;button&gt;</code> instead of <code>&lt;div onclick="..."&gt;</code> to gain keyboard focus, Enter/Space activation, and correct screen reader announcements for free.</li>
                <li>Use proper heading hierarchy (<code>&lt;h1&gt;</code> through <code>&lt;h6&gt;</code>) to allow screen reader users to skim page landmarks.</li>
                <li>Always supply meaningful <code>alt</code> text on informative images, and empty <code>alt=""</code> on purely decorative illustrations.</li>
            </ul>

            <h2>Color Contrast and Focus Indicators</h2>
            <p>Never eliminate focus outlines with <code>outline: none</code> without supplying a high-contrast replacement. Keyboard users rely entirely on focus rings to know where they are on your page.</p>
            <p>Ensure a minimum contrast ratio of <strong>4.5:1</strong> for normal text and <strong>3:1</strong> for large text against background colors.</p>
        `
    },
    {
        id: 'web-performance-core-web-vitals-2026',
        slug: 'web-performance-core-web-vitals-2026',
        title: 'Optimizing for Core Web Vitals: LCP, INP, and CLS Explained',
        excerpt: 'How to diagnose, measure, and optimize your web app for Google Core Web Vitals, including the Interaction to Next Paint (INP) metric.',
        category: 'Web Performance',
        tags: ['Performance', 'SEO', 'Web Vitals'],
        author: {
            name: 'Elena Rostova',
            role: 'Web Performance Architect',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
        },
        publishDate: '2026-02-28',
        readTime: '7 min read',
        featured: false,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80',
        content: `
            <p class="lead">Speed is a feature. In this guide, we break down Google's Core Web Vitals and provide actionable code-level fixes to dramatically improve your search rankings and conversion rates.</p>

            <h2>1. Largest Contentful Paint (LCP)</h2>
            <p>LCP measures perceived loading speed—specifically, when the largest image or text block in the viewport finishes rendering. Target: <strong>&lt; 2.5 seconds</strong>.</p>
            <p>Optimization strategies:</p>
            <ul>
                <li>Preload critical hero images using <code>&lt;link rel="preload" as="image" href="..."&gt;</code>.</li>
                <li>Use modern image formats such as WebP and AVIF.</li>
                <li>Avoid lazy-loading above-the-fold images.</li>
            </ul>

            <h2>2. Interaction to Next Paint (INP)</h2>
            <p>INP replaced FID (First Input Delay) to measure the overall responsiveness of a page throughout the user entire lifecycle. Target: <strong>&lt; 200 milliseconds</strong>.</p>
            <p>Break up long tasks using <code>requestAnimationFrame</code> or <code>scheduler.yield()</code> so the main thread can respond swiftly to user input.</p>

            <h2>3. Cumulative Layout Shift (CLS)</h2>
            <p>CLS measures visual stability. We have all experienced frustrating accidental clicks when a late-loading advertisement or unsized image shifts content. Target: <strong>&lt; 0.1</strong>.</p>
            <p>Always specify explicit <code>width</code> and <code>height</code> attributes or CSS <code>aspect-ratio</code> on all images and media containers.</p>
        `
    },
    {
        id: 'frontend-career-roadmap-junior-to-senior',
        slug: 'frontend-career-roadmap-junior-to-senior',
        title: 'From Junior to Senior Frontend Developer: The Skills That Actually Matter',
        excerpt: 'Technical excellence is only half the equation. Discover the systems thinking, communication habits, and architectural mindset that drive career progression.',
        category: 'Career',
        tags: ['Career', 'Software Engineering', 'Mentorship'],
        author: {
            name: 'Alex Rivera',
            role: 'Lead UI Engineer',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        },
        publishDate: '2026-02-20',
        readTime: '6 min read',
        featured: false,
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80',
        content: `
            <p class="lead">Early in your career, success is measured by how quickly you can complete a ticket. As you advance toward senior roles, success is measured by how effectively you eliminate ambiguity and elevate your team.</p>

            <h2>The Shift from Implementation to Architecture</h2>
            <p>Junior engineers ask: <em>"How do I write this function?"</em> Senior engineers ask: <em>"Should we be building this feature, what are the failure modes, and how will this code evolve over the next two years?"</em></p>

            <h2>Three Pillars of Senior Engineers</h2>
            <ol>
                <li><strong>Technical Judgment:</strong> Resisting the urge to rewrite everything in the newest framework. Choosing boring, reliable technology when appropriate.</li>
                <li><strong>Empathy and Communication:</strong> Writing clean documentation, conducting constructive code reviews, and mentoring peers.</li>
                <li><strong>Business Alignment:</strong> Understanding how your frontend decisions impact user acquisition, retention, and revenue.</li>
            </ol>
        `
    },
    {
        id: 'modern-javascript-clean-code-patterns',
        slug: 'modern-javascript-clean-code-patterns',
        title: 'Modern JavaScript Clean Code Patterns: Writing Maintainable Logic',
        excerpt: 'Elevate your JavaScript code with functional patterns, early returns, defensive programming, and readable data structures.',
        category: 'JavaScript',
        tags: ['JavaScript', 'Clean Code', 'Best Practices'],
        author: {
            name: 'Sarah Chen',
            role: 'Runtime Architect',
            avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
        },
        publishDate: '2026-02-12',
        readTime: '5 min read',
        featured: false,
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&auto=format&fit=crop&q=80',
        content: `
            <p class="lead">Any developer can write code that a computer understands. Great developers write code that humans can effortlessly maintain and extend.</p>

            <h2>Guard Clauses and Early Returns</h2>
            <p>Deeply nested <code>if/else</code> statements create cognitive overload. Flatten your logic by handling edge cases and errors upfront:</p>

            <pre><code>// Avoid nested indentation:
function processPayment(user, order) {
    if (!user.isActive) {
        return { success: false, reason: 'Inactive account' };
    }
    if (order.total &lt;= 0) {
        return { success: false, reason: 'Invalid total' };
    }

    // Happy path remains flat and clear
    return executeTransaction(user, order);
}</code></pre>

            <h2>Immutability and Pure Functions</h2>
            <p>Whenever practical, treat data as immutable. Prefer array methods like <code>.map()</code>, <code>.filter()</code>, and <code>.reduce()</code> over mutating arrays in place. This eliminates side effects and makes debugging predictable.</p>
        `
    }
];

// Helper to retrieve all categories
function getAllCategories() {
    const cats = new Set();
    BLOG_POSTS.forEach(p => cats.add(p.category));
    return Array.from(cats);
}

// Helper to retrieve all tags
function getAllTags() {
    const tags = new Set();
    BLOG_POSTS.forEach(p => p.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
}
