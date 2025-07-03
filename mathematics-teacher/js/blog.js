// Configuration
const CONFIG = {
    blogEntriesUrl: '../data/blog_entries.csv',
    googleSheetId: 'YOUR_GOOGLE_SHEET_ID', // Replace with your actual Sheet ID
    googleScriptUrl: 'YOUR_GOOGLE_SCRIPT_URL' // Replace with your deployed Web App URL
};

// DOM Elements
let currentPostId = null;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadBlog();
        document.getElementById('submit-comment').addEventListener('click', submitComment);
    } catch (error) {
        console.error('Error initializing blog:', error);
        document.getElementById('blog-entries').innerHTML = 
            '<p class="error">Failed to load blog. Please refresh the page.</p>';
    }
});

// Load and display blog entries
async function loadBlog() {
    try {
        const entries = await fetchCsv(CONFIG.blogEntriesUrl);
        displayEntries(entries);
    } catch (error) {
        throw new Error('Failed to load blog entries: ' + error.message);
    }
}

// Fetch CSV data
async function fetchCsv(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch CSV');
    const text = await response.text();
    return parseCsv(text);
}

// Parse CSV to JSON
function parseCsv(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
        const values = line.split(',');
        const entry = {};
        headers.forEach((header, i) => {
            entry[header] = values[i] ? values[i].trim() : '';
        });
        return entry;
    }).filter(entry => entry.id); // Filter out empty lines
}

// Display blog entries
async function displayEntries(entries) {
    const container = document.getElementById('blog-entries');
    
    if (!entries.length) {
        container.innerHTML = '<p>No blog posts found.</p>';
        return;
    }
    
    container.innerHTML = await Promise.all(entries.map(async entry => {
        const comments = await loadComments(entry.id);
        return `
            <div class="entry" data-id="${entry.id}">
                <div class="entry-content">
                    <h2>${escapeHtml(entry.title)}</h2>
                    <p>${escapeHtml(entry.content)}</p>
                    <small>Posted: ${entry.date}</small>
                </div>
                <div class="sub-bar">
                    <span>${comments.length} comments</span>
                    <button onclick="showCommentForm('${entry.id}')">Add Comment</button>
                </div>
                <div class="comments-container" id="comments-${entry.id}">
                    ${renderComments(comments)}
                </div>
            </div>
        `;
    })).then(html => html.join(''));
}

// Load comments from Google Sheet
async function loadComments(postId) {
    try {
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${CONFIG.googleSheetId}/gviz/tq?tqx=out:json`;
        const response = await fetch(sheetUrl);
        const text = await response.text();
        const json = JSON.parse(text.substr(47).slice(0, -2));
        
        return json.table.rows.map(row => ({
            entryId: row.c[0]?.v,
            name: row.c[1]?.v,
            text: row.c[2]?.v,
            date: formatDate(row.c[3]?.v)
        })).filter(c => c.entryId === postId);
    } catch (error) {
        console.error('Error loading comments:', error);
        return [];
    }
}

// Render comments HTML
function renderComments(comments) {
    if (!comments.length) return '<p>No comments yet. Be the first to comment!</p>';
    
    return comments.map(comment => `
        <div class="comment">
            <div class="comment-meta">
                <strong>${escapeHtml(comment.name)}</strong> • ${comment.date}
            </div>
            <p>${escapeHtml(comment.text)}</p>
        </div>
    `).join('');
}

// Show comment form
function showCommentForm(postId) {
    currentPostId = postId;
    document.getElementById('comment-form-container').style.display = 'block';
    document.getElementById('comment-name').value = '';
    document.getElementById('comment-text').value = '';
    window.scrollTo(0, document.body.scrollHeight);
}

// Hide comment form
function hideCommentForm() {
    document.getElementById('comment-form-container').style.display = 'none';
    currentPostId = null;
}

// Submit new comment
async function submitComment() {
    const name = document.getElementById('comment-name').value.trim();
    const text = document.getElementById('comment-text').value.trim();
    
    if (!name || !text) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch(CONFIG.googleScriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                entryId: currentPostId,
                name: name,
                text: text
            })
        });
        
        if (!response.ok) throw new Error('Failed to submit comment');
        
        alert('Comment submitted successfully!');
        hideCommentForm();
        await loadBlog(); // Refresh to show new comment
    } catch (error) {
        console.error('Error submitting comment:', error);
        alert('Failed to submit comment. Please try again.');
    }
}

// Helper function to escape HTML
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
}

// Format date
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}
