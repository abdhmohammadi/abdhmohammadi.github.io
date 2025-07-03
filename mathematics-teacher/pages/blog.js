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

  const parsed = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true
  });

  return parsed.data.map((row, idx) => {
    if (!row.id || !row.content) {
      if (CONFIG.debug) {
        console.warn(`[WARN] Skipping row ${idx + 2}`, row);
      }
      return null;
    }

    return {
      id: row.id.trim(),
      title: row.title?.trim() || '',
      content: row.content?.trim() || '',
      date: row.date?.trim() || ''
    };
  }).filter(Boolean);
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
        <div class="comments"></div>
        <form class="comment-form" onsubmit="submitComment(event, ${post.id})">
          <input type="text" name="name" placeholder="Your name" required />
          <textarea name="text" placeholder="Your comment" required></textarea>
          <button type="submit">Post</button>
        </form>
      </div>
    `;

    container.appendChild(article);
    loadComments(post.id).then(comments => {
      const commentsContainer = document.querySelector(`#comments-${post.id} .comments`);
      commentsContainer.innerHTML = renderCommentList(comments);
    }).catch(err => {
      const commentsContainer = document.querySelector(`#comments-${post.id} .comments`);
      commentsContainer.innerHTML = '<p>Error loading comments.</p>';
    });
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
// Replace loadComments() with this CORS version
async function loadComments(postId) {
  try {
    const url = new URL(CONFIG.commentApiUrl);
    url.searchParams.append('postId', postId);
    
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    const data = await res.json();
    if (CONFIG.debug) console.log(`Comments loaded for post ${postId}:`, data);
    return data;
  } catch (error) {
    console.error(`Failed to load comments for post ${postId}:`, error);
    return [];
  }
}
<!--
function loadComments(postId) {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonp_callback_${postId}_${Date.now()}`;

    window[callbackName] = function(data) {
      delete window[callbackName];
      document.head.removeChild(script);

      if (CONFIG.debug) {
        console.log(`[DEBUG] Comments loaded for post ${postId}:`, data);
      }

      resolve(data);
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
} -->

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
      loadComments(postId).then(comments => {
        const section = document.querySelector(`#comments-${postId} .comments`);
        section.innerHTML = renderCommentList(comments);
      });
    } else {
      throw new Error(result.message);
    }
  } catch (err) {
    alert('Failed to submit comment.');
    console.error('[Comment Error]', err);
  }
}
