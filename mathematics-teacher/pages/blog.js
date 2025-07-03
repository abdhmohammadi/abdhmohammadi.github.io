const CONFIG = {
  csvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQkAgbOLO9NA6TKeRlMAYOGPW2gRtmlUZjBqD2-tQsKwVryGC3pIzLWg844P8ysrfRc2wpy6GSAPrVF/pub?output=csv',
  commentApiUrl: 'https://script.google.com/macros/s/AKfycbyDUH9YU78MSin6Itg88aJhb6eZsf2AMatJCNVxuzdt8PE0-lL5TAggPGwUQO0fyxAV/exec',
  contactInfo: '📧 abdhmohammady@gmail.com'
};


// MAIN ENTRY POINT
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const posts = await fetchPosts();
    renderPosts(posts);
  } catch (error) {
    console.error('[Blog] Failed to initialize:', error);
    document.getElementById('blog-entries').innerHTML = '<p>Failed to load posts.</p>';
  }
});

// FETCH POSTS FROM CSV
async function fetchPosts() {
  const res = await fetch(CONFIG.csvUrl);
  const csv = await res.text();
  const [header, ...rows] = csv.trim().split('\n').map(line => line.split(','));
  const posts = [];

  for (const row of rows) {
    if (row.length < 4) continue;
    const [id, title, content, date] = row;
    posts.push({ id: id.trim(), title: title.trim(), content: content.trim(), date: date.trim() });
  }

  return posts;
}

// RENDER POSTS AND COMMENTS
function renderPosts(posts) {
  const container = document.getElementById('blog-entries');
  container.innerHTML = '';

  posts.forEach(post => {
    const article = document.createElement('div');
    article.className = 'blog-post';
    article.innerHTML = `
      ${post.title ? `<h2>${escapeHtml(post.title)}</h2>` : ''}
      <div>${post.content}</div>
      <div class="sub-bar">
        <div>${formatDate(post.date)}</div>
        <div>${CONFIG.contactInfo}</div>
      </div>
      <div class="comment-section" id="comments-${post.id}">
        <div class="toggle-btn" onclick="toggleComments(${post.id})">Show Comments</div>
        <div class="comments" style="display:none;"></div>
        <form class="comment-form" onsubmit="submitComment(event, ${post.id})">
          <input type="text" name="name" placeholder="Your name" required />
          <textarea name="text" placeholder="Your comment" required></textarea>
          <button type="submit">Post</button>
        </form>
      </div>
    `;
    container.appendChild(article);

    // Preload comments safely
    loadComments(post.id).catch(err => console.warn(`Post ${post.id}:`, err.message));
  });
}

function formatDate(dateString) {
  try {
    const parsed = new Date(dateString);
    if (isNaN(parsed)) throw new Error('Invalid date');
    return parsed.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  } catch (e) {
    console.warn('Unparseable date:', dateString);
    return '';
  }
}

function loadComments(postId) {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonp_cb_${postId}_${Date.now()}`;
    window[callbackName] = function(data) {
      delete window[callbackName];
      document.head.removeChild(script);
      renderComments(postId, data);
      resolve();
    };

    const script = document.createElement('script');
    script.src = `${CONFIG.commentApiUrl}?postId=${postId}&callback=${callbackName}`;
    script.onerror = function() {
      delete window[callbackName];
      document.head.removeChild(script);
      reject(new Error('Failed to load comments'));
    };

    document.head.appendChild(script);
  });
}

function renderComments(postId, comments) {
  const container = document.querySelector(`#comments-${postId} .comments`);
  if (!container) return;
  if (!comments || comments.length === 0) {
    container.innerHTML = '<p>No comments yet.</p>';
    return;
  }
  container.innerHTML = comments.map(c => `
    <div class="comment">
      <div class="comment-meta">${escapeHtml(c.name)} - ${formatDate(c.date)}</div>
      <div class="comment-text">${escapeHtml(c.text)}</div>
    </div>
  `).join('');
}

function toggleComments(postId) {
  const section = document.querySelector(`#comments-${postId} .comments`);
  const btn = document.querySelector(`#comments-${postId} .toggle-btn`);
  if (section.style.display === 'none') {
    section.style.display = 'block';
    btn.textContent = 'Hide Comments';
  } else {
    section.style.display = 'none';
    btn.textContent = 'Show Comments';
  }
}

async function submitComment(e, postId) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const text = form.text.value.trim();

  if (!name || !text) return;

  const res = await fetch(CONFIG.commentApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postId, name, text })
  });

  const result = await res.json();
  if (result.success) {
    alert('Comment added!');
    form.reset();
    loadComments(postId);
  } else {
    alert('Failed to add comment: ' + result.message);
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
