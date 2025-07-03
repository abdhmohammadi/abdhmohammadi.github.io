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

function showCommentForm(entryId) {
    const container = document.getElementById(`comments-${entryId}`);
    container.innerHTML = `
        <form onsubmit="submitComment(event, '${entryId}')">
            <input type="text" placeholder="Your name" required>
            <textarea placeholder="Your comment" required></textarea>
            <button type="submit">Submit via GitHub</button>
        </form>
    `;
}

function submitComment(event, entryId) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector('input').value;
    const text = form.querySelector('textarea').value;
    
    // Create GitHub Issue URL
    const issueUrl = `https://github.com/${config.repo}/issues/new?` +
        `title=Comment on Post ${entryId}&` +
        `body=Name: ${name}%0AComment: ${text}%0A%0APost ID: ${entryId}`;
    
    window.open(issueUrl, '_blank');
    form.reset();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', loadBlog);
