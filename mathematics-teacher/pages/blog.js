// blog.js (final cleaned version)

const CONFIG = {
  csvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQkAgbOLO9NA6TKeRlMAYOGPW2gRtmlUZjBqD2-tQsKwVryGC3pIzLWg844P8ysrfRc2wpy6GSAPrVF/pub?output=csv',
  commentApiUrl: 'https://script.google.com/macros/s/AKfycbyDUH9YU78MSin6Itg88aJhb6eZsf2AMatJCNVxuzdt8PE0-lL5TAggPGwUQO0fyxAV/exec',
  contactInfo: '📧 abdhmohammady@gmail.com'
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const posts = await fetchPosts();
    renderPosts(posts);
  } catch (error) {
    console.error("[Blog] Load failure:", error);
    document.getElementById('blog-entries').innerHTML = '<p>Error loading blog.</p>';
  }
});

async function fetchPosts() {
  const res = await fetch(CONFIG.csvUrl);
  const csv = await res.text();
  const lines = csv.trim().split('\n');
  const [headers, ...rows] = lines.map(line => line.split(','));

  return rows.map((cols, i) => {
    const post = {
      id: cols[0]?.trim(),
      title: cols[1]?.trim(),
      content: cols[2]?.trim(),
      date: cols[3]?.trim()
    };
    return post;
  }).filter(p => p.content); // Skip malformed
}

function renderPosts(posts) {
  const container = document.getElementById('blog-entries');
  container.innerHTML = '';

  posts.forEach(post => {
    const article = document.createElement('div');
    article.className = 'blog-post';
    article.innerHTML = `
      ${post.title ? `<h2>${escapeHtml(post.title)}</h2>` : ''}
      <div class="content">${post.content}</div>
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
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}

function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    if (isNaN(date)) throw new Error("Invalid date");
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    console.warn("Unparseable date:", dateString);
    return '';
  }
}

function toggleComments(postId) {
  const section = document.querySelector(`#comments-${postId} .comments`);
  const btn = document.querySelector(`#comments-${postId} .toggle-btn`);

  if (section.style.display === 'none') {
    loadComments(postId).then(comments => {
      section.innerHTML = renderCommentList(comments);
      section.style.display = 'block';
      btn.textContent = 'Hide Comments';
    }).catch(err => {
      section.innerHTML = '<p>Error loading comments.</p>';
      section.style.display = 'block';
    });
  } else {
    section.style.display = 'none';
    btn.textContent = 'Show Comments';
  }
}

function loadComments(postId) {
  return new Promise((resolve, reject) => {
    const callbackName = `cb_${Date.now()}_${Math.random().toString().slice(2)}`;
    window[callbackName] = function(data) {
      resolve(data);
      cleanup();
    };
    function cleanup() {
      delete window[callbackName];
      script.remove();
    }
    const script = document.createElement('script');
    script.src = `${CONFIG.commentApiUrl}?postId=${postId}&callback=${callbackName}`;
    script.onerror = () => {
      reject();
      cleanup();
    };
    document.head.appendChild(script);
  });
}

function renderCommentList(comments) {
  if (!comments || !comments.length) return '<p>No comments yet.</p>';
  return comments.map(c => `
    <div class="comment">
      <div class="comment-meta">${escapeHtml(c.name)} - ${formatDate(c.date)}</div>
      <div class="comment-text">${escapeHtml(c.text)}</div>
    </div>
  `).join('');
}

async function submitComment(e, postId) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value;
  const text = form.text.value;

  try {
    const res = await fetch(CONFIG.commentApiUrl, {
      method: 'POST',
      body: JSON.stringify({ postId, name, text }),
      headers: { 'Content-Type': 'application/json' }
    });
    const result = await res.json();
    if (result.success) {
      alert('Comment added!');
      form.reset();
      toggleComments(postId); // refresh view
    } else {
      throw new Error(result.message);
    }
  } catch (err) {
    alert('Failed to submit comment.');
    console.error('[Comment Error]', err);
  }
}
