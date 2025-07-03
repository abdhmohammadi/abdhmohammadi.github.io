// blog.js (final cleaned version)

const CONFIG = {
  csvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQkAgbOLO9NA6TKeRlMAYOGPW2gRtmlUZjBqD2-tQsKwVryGC3pIzLWg844P8ysrfRc2wpy6GSAPrVF/pub?output=csv',
  commentApiUrl: 'https://script.google.com/macros/s/AKfycbyDUH9YU78MSin6Itg88aJhb6eZsf2AMatJCNVxuzdt8PE0-lL5TAggPGwUQO0fyxAV/exec',
  contactInfo: '📧 abdhmohammady@gmail.com',
  debug: true
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
  const [header, ...rows] = lines;

  return rows.map((line, idx) => {
    const fields = parseCsvLine(line);
    return {
      id: fields[0],
      title: fields[1],
      content: fields[2],
      date: fields[3]
    };
  });
}

function parseCsvLine(line) {
  const result = [];
  let insideQuote = false;
  let value = '';

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && insideQuote && nextChar === '"') {
      // Escaped quote ("")
      value += '"';
      i++;
    } else if (char === '"') {
      insideQuote = !insideQuote;
    } else if (char === ',' && !insideQuote) {
      result.push(value.trim());
      value = '';
    } else {
      value += char;
    }
  }
  result.push(value.trim());
  return result;
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
    const callbackName = `jsonp_callback_${postId}_${Date.now()}`;

    window[callbackName] = function(data) {
      delete window[callbackName];
      document.head.removeChild(script);

      console.log(`[DEBUG] Comments loaded for post ${postId}:`, data); // ✅ Debug print

      renderComments(postId, data);
      resolve();
    };

    const script = document.createElement('script');
    script.src = `${CONFIG.commentApiUrl}?postId=${postId}&callback=${callbackName}`;
    script.onerror = function() {
      delete window[callbackName];
      document.head.removeChild(script);
      console.error(`[ERROR] Failed to load comments for post ${postId} via JSONP`);
      reject(new Error('Failed to load comments'));
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
