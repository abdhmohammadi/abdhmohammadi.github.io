// Configuration
const config = {
    entriesUrl: '../data/blog_entries.csv',
    commentsUrl: '../data/comments.csv',
    repo: 'abdhmohammadi/abdhmohammadi.github.io'
};

// Load and display blog entries
async function loadBlog() {
    try {
        const [entries, comments] = await Promise.all([
            fetchCsv(config.entriesUrl),
            fetchCsv(config.commentsUrl)
        ]);
        displayEntries(entries, comments);
    } catch (error) {
        document.getElementById('blog-entries').innerHTML = 
            '<p class="error">Failed to load blog posts. Please refresh.</p>';
    }
}

// Helper function to fetch CSV
async function fetchCsv(url) {
    const response = await fetch(url);
    const text = await response.text();
    return parseCsv(text);
}

// Display entries with comments
function displayEntries(entries, comments) {
    const container = document.getElementById('blog-entries');
    container.innerHTML = entries.map(entry => `
        <div class="entry" data-id="${entry.id}">
            <div class="entry-content">
                <h2>${entry.title}</h2>
                <p>${entry.content}</p>
                <small>Posted: ${entry.date}</small>
            </div>
            <div class="sub-bar">
                <div class="comment-count">
                    ${comments.filter(c => c.entryId === entry.id).length} comments
                </div>
                <button onclick="showCommentForm('${entry.id}')">Add Comment</button>
            </div>
            <div id="comments-${entry.id}" class="comments-container"></div>
        </div>
    `).join('');
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', loadBlog);
