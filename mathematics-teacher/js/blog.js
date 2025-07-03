/**
 * Mathematics Teacher Weblog - Dynamic Loader
 * Version 2.1 (GitHub CSV + Google Sheets Comments)
 */

// ========================
// CONFIGURATION
// ========================
const CONFIG = {
    // CSV data paths (try multiple fallbacks)
    blogEntriesUrls: [
        'https://abdhmohammadi.github.io/mathematics-teacher/pages/blog-data/blog_entries.csv',
        '/mathematics-teacher/pages/blog-data/blog_entries.csv',
        '../blog-data/blog_entries.csv'
    ],    
    // Google Sheets integration (for comments)
    // Replace with your actual Sheet ID
    googleSheetId: '1_uuyiehQZbnibhZt_jtvI53jFH1zkp1Bv8xheM4PVlA', 
    // Replace with your deployed Web App URL    
    googleScriptUrl: 'https://script.google.com/macros/s/AKfycbyDUH9YU78MSin6Itg88aJhb6eZsf2AMatJCNVxuzdt8PE0-lL5TAggPGwUQO0fyxAV/exec', 
    // Display settings
    postsPerPage: 10,
    enableComments: true
};

// ========================
// STATE MANAGEMENT
// ========================
let currentState = {
    posts: [],
    currentPage: 1,
    isLoading: false,
    lastError: null
};

// ========================
// CORE INITIALIZATION
// ========================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[Blog] Initializing...');
    
    try {
        // Load and display posts
        await loadPosts();
        
        // Setup UI event listeners
        setupEventListeners();
        
        console.log('[Blog] Initialized successfully');
    } catch (error) {
        console.error('[Blog] Critical initialization error:', error);
        showFatalError(error);
    }
});

// ========================
// DATA LOADING FUNCTIONS
// ========================
async function loadPosts() {
    if (currentState.isLoading) return;
    currentState.isLoading = true;
    
    try {
        showLoader();
        
        // Try all possible CSV URLs until one works
        for (const url of CONFIG.blogEntriesUrls) {
            try {
                const csvData = await fetchWithTimeout(url, {
                    cache: 'no-store',
                    headers: {
                        'Content-Type': 'text/csv; charset=utf-8'
                    }
                });
                
                currentState.posts = parseCsv(await csvData.text());
                
                if (currentState.posts.length > 0) {
                    console.log(`[Blog] Successfully loaded ${currentState.posts.length} posts from ${url}`);
                    renderPosts();
                    return;
                }
            } catch (error) {
                console.warn(`[Blog] Failed to load from ${url}:`, error.message);
                continue;
            }
        }
        
        throw new Error('All data source attempts failed');
    } catch (error) {
        currentState.lastError = error;
        console.error('[Blog] Post loading failed:', error);
        showError(error);
        throw error;
    } finally {
        currentState.isLoading = false;
        hideLoader();
    }
}

function parseCsv(csvText) {
    try {
        const lines = csvText
            .replace(/\r\n/g, '\n')
            .split('\n')
            .filter(line => line.trim() !== '');

        if (lines.length < 2) {
            throw new Error('CSV file is empty or has no data rows');
        }

        // ✅ Trim header fields to avoid issues like 'date '
        const headers = lines[0].split(',').map(h => h.trim());

        return lines.slice(1).map((line, index) => {
            const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            const post = { id: index + 1 };

            headers.forEach((header, i) => {
                const key = header.toLowerCase();
                post[key] = values[i]
                    ? values[i].trim().replace(/^"|"$/g, '')
                    : '';
            });

            return post;
        });
    } catch (error) {
        console.error('[Blog] CSV parsing error:', error);
        throw new Error(`Failed to parse CSV data: ${error.message}`);
    }
}

// ========================
// RENDERING FUNCTIONS
// ========================
function renderPosts() {
  const container = document.getElementById('blog-entries');
  if (!container) {
    throw new Error('Blog entries container not found');
  }

  // Calculate pagination
  const startIdx = (currentState.currentPage - 1) * CONFIG.postsPerPage;
  const endIdx = startIdx + CONFIG.postsPerPage;
  const visiblePosts = currentState.posts.slice(startIdx, endIdx);

  // Generate HTML
  container.innerHTML = visiblePosts.map(post => `
    <article class="entry blog-post" data-post-id="${post.id}">
      <div class="post-content">
        <h2>${escapeHtml(post.title)}</h2>
        <div>${paragraphize(escapeHtml(post.content))}</div>
      </div>
      <div class="sub-bar">
        <div class="post-date">${new Date(post.date).toUTCString()}</div>
        <div class="post-contact">Contact: your.email@example.com</div>
      </div>
    </article>
  `).join('');

  if (currentState.posts.length > CONFIG.postsPerPage) {
    renderPagination();
  }
}

function renderCommentSection(postId) {
    return `
        <section class="comments-section">
            <h3>Comments</h3>
            <div class="comments-container" id="comments-${postId}">
                <p>Loading comments...</p>
            </div>
            <form class="comment-form" onsubmit="handleCommentSubmit(event, ${postId})">
                <input type="text" name="name" placeholder="Your name" required>
                <textarea name="comment" placeholder="Your thoughts" required></textarea>
                <button type="submit">Post Comment</button>
            </form>
        </section>
    `;
}

// ========================
// UTILITY FUNCTIONS
// ========================
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function paragraphize(text) {
    return text.split('\n').filter(p => p.trim()).map(p => `<p>${p}</p>`).join('');
}

function formatDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch {
        return dateString;
    }
}

async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 5000 } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(resource, {
        ...options,
        signal: controller.signal  
    });
    
    clearTimeout(id);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
}

// ========================
// ERROR HANDLING
// ========================
function showFatalError(error) {
    document.getElementById('blog-entries').innerHTML = `
        <div class="error fatal-error">
            <h2>Blog Unavailable</h2>
            <p>We couldn't load the blog content. Please try again later.</p>
            <button onclick="window.location.reload()">Retry</button>
            ${DEBUG_MODE ? `<div class="technical-details">${error.message}</div>` : ''}
        </div>
    `;
}

function showLoader() {
    document.getElementById('blog-entries').innerHTML = `
        <div class="loading-indicator">
            <div class="spinner"></div>
            <p>Loading blog posts...</p>
        </div>
    `;
}

function hideLoader() {
    const loader = document.querySelector('.loading-indicator');
    if (loader) loader.remove();
}

// ========================
// EVENT HANDLERS
// ========================
function setupEventListeners() {
    // Comment form submission
    document.querySelectorAll('.comment-form').forEach(form => {
        form.addEventListener('submit', handleCommentSubmit);
    });
    
    // Pagination controls
    document.querySelector('.pagination')?.addEventListener('click', handlePagination);
}

function handleCommentSubmit(event, postId) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate inputs
    if (!formData.get('name') || !formData.get('comment')) {
        alert('Please fill in all fields');
        return;
    }
    
    submitComment(postId, {
        name: formData.get('name'),
        text: formData.get('comment')
    });
}

// ========================
// COMMENT SYSTEM
// ========================
async function submitComment(postId, { name, text }) {
    try {
        if (!CONFIG.googleScriptUrl.includes('http')) {
            throw new Error('Google Script URL not configured');
        }
        
        const response = await fetch(CONFIG.googleScriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                entryId: postId,
                name: name,
                text: text
            })
        });
        
        if (!response.ok) {
            throw new Error(`Comment submission failed: ${response.status}`);
        }
        
        alert('Comment submitted successfully!');
        loadComments(postId); // Refresh comments
    } catch (error) {
        console.error('Comment submission error:', error);
        alert('Failed to submit comment. Please try again later.');
    }
}

// Initialize debug mode
const DEBUG_MODE = true;
if (DEBUG_MODE) {
    console.log('[Blog] Debug mode enabled');
    window.blogDebug = {
        state: () => currentState,
        reload: () => loadPosts(),
        testComment: (postId) => submitComment(postId, {
            name: 'Test User',
            text: 'This is a test comment'
        })
    };
}
