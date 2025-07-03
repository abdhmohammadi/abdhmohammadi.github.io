const CONFIG = {
  csvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQkAgbOLO9NA6TKeRlMAYOGPW2gRtmlUZjBqD2-tQsKwVryGC3pIzLWg844P8ysrfRc2wpy6GSAPrVF/pub?output=csv',
  commentApiUrl: 'https://script.google.com/macros/s/AKfycbyDUH9YU78MSin6Itg88aJhb6eZsf2AMatJCNVxuzdt8PE0-lL5TAggPGwUQO0fyxAV/exec',
  contactInfo: '📧 abdhmohammady@gmail.com'
};

document.addEventListener('DOMContentLoaded', async () => {
  const posts = await fetchPosts();
  renderPosts(posts);
});

async function fetchPosts() {
  const res = await fetch(CONFIG.csvUrl);
  const csv = await res.text();
  const lines = csv.trim().split('\n');
  const [header, ...rows] = lines.map(l => l.split(','));
  return rows.map((row, i) => ({
    id: row[0],
    title: row[1],
    content: row[2],
    date: row[3]
  }));
}

function renderPosts(posts) {
  const container = document.getElementById('blog-entries');
  container.innerHTML = '';
  posts.forEach(post => {
    const article = document.createElement('div');
    article.className = 'blog-post';
    article.innerHTML = `
      ${post.title ? `<h2>${post.title}</h2>` : ''}
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

    // Load comments for this post immediately after rendering
    loadComments(post.id);
  });
}

function loadComments(postId) {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonp_callback_${postId}_${Date.now()}`;

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
      console.error('Error loading comments via JSONP');
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


function formatDate(dateString) {
  if (!dateString) return '';

  try {
    // Try to parse ISO string, fallback to original if fails
    const date = new Date(dateString);
    if (isNaN(date)) throw new Error('Invalid date');

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    console.warn('Unparseable date:', dateString);
    return dateString;
  }
}



async function toggleComments(postId) {
  const section = document.querySelector(`#comments-${postId} .comments`);
  const btn = document.querySelector(`#comments-${postId} .toggle-btn`);
  if (section.style.display === 'none') {
    const comments = await fetch(`${CONFIG.commentApiUrl}?postId=${postId}`).then(res => res.json());
    section.innerHTML = comments.map(c =>
      `<div class="comment"><strong>${c.name}</strong><br/>${c.text}<br/><em>${formatDate(c.date)}</em></div>`
    ).join('');
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
  const name = form.name.value;
  const text = form.text.value;

  const res = await fetch(CONFIG.commentApiUrl, {
    method: 'POST',
    body: JSON.stringify({ postId, name, text }),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json());

  if (res.success) {
    alert("Comment added!");
    toggleComments(postId);  // Refresh
  } else {
    alert("Error: " + res.message);
  }
}
