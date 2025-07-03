// blog.js (final cleaned version)

const CONFIG = {
  csvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQkAgbOLO9NA6TKeRlMAYOGPW2gRtmlUZjBqD2-tQsKwVryGC3pIzLWg844P8ysrfRc2wpy6GSAPrVF/pub?output=csv',
  commentApiUrl: 'https://script.google.com/macros/s/AKfycbz4p2gSAD-rxAU7QlVMifW1UtctjKv3X17mDzuB49Px9Tfkn7UzBVxHiAQZpUJSxLTp/exec',
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
async function loadComments(postId) {
  try {
    const url = new URL(CONFIG.commentApiUrl);
    url.searchParams.append('postId', postId);
    
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load comments');
    
    const data = await res.json();
    
    // Handle Google Script errors
    if (data.error) {
      throw new Error(data.message);
    }
    
    return data;
  } catch (error) {
    console.error(`[ERROR] Comments load failed (${postId}):`, error);
    
    // Return sample data for debugging
    if (CONFIG.debug) {
      console.warn('Using sample comments for debugging');
      return [
        {name: 'Test User', text: 'Sample comment for debugging', date: new Date().toISOString()}
      ];
    }
    
    return []; // Return empty array for production
  }
}
/*
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
} */

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
