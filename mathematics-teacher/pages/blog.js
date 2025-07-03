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

async function loadComments(postId) {
  try {
    const url = new URL(CONFIG.commentApiUrl);
    url.searchParams.append('postId', postId);
    
    // Add cache-buster to prevent tracking prevention
    url.searchParams.append('t', Date.now());
    
    const res = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store'
    });
    
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    return await res.json();
  } catch (error) {
    console.error(`Comments load error (${postId}):`, error);
    
    // Fallback to JSONP if CORS fails
    if (CONFIG.debug) {
      console.warn('Attempting JSONP fallback');
      return loadCommentsJsonp(postId);
    }
    
    return [];
  }
}

// JSONP fallback (keep as backup)
function loadCommentsJsonp(postId) {
  return new Promise((resolve) => {
    const callbackName = `jsonp_${Date.now()}`;
    window[callbackName] = (data) => {
      delete window[callbackName];
      resolve(data);
      document.head.removeChild(script);
    };
    
    const script = document.createElement('script');
    script.src = `${CONFIG.commentApiUrl}?postId=${postId}&callback=${callbackName}&t=${Date.now()}`;
    script.onerror = () => resolve([]);
    
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

// This is the updated submitComment function for your blog.js file.
// Replace your existing submitComment function with this one.

// Submit a new comment
async function submitComment(e, postId) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value;
  const text = form.text.value;
  
  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;
  submitBtn.textContent = 'Posting...';
  submitBtn.disabled = true;
  
  // Get the comment section to display messages
  const commentSection = form.closest('.comment-section');
  // Remove any previous success/error messages
  const existingMessage = commentSection.querySelector('.message');
  if (existingMessage) {
    existingMessage.remove();
  }

  try {
    // Using FormData to avoid CORS preflight for application/json
    const formData = new FormData();
    formData.append('postId', postId);
    formData.append('name', name);
    formData.append('text', text);
    
    const res = await fetch(CONFIG.commentApiUrl, {
      method: 'POST',
      body: formData,
      // redirect: 'follow' is generally not needed if the Apps Script returns JSON directly
      // and doesn't perform a browser-level redirect.
    });
    
    // Check if the HTTP response itself was successful (e.g., 200 OK)
    if (!res.ok) {
        const errorBody = await res.text(); // Get raw response for debugging
        throw new Error(`HTTP error! Status: ${res.status}, Response: ${errorBody}`);
    }

    // Parse the response as JSON. Apps Script will now always return JSON.
    const data = await res.json();
    
    if (data.success) {
      // Show success message
      const successMsg = document.createElement('div');
      successMsg.className = 'message success'; // Added 'message' class
      successMsg.textContent = 'Comment added successfully!';
      commentSection.insertBefore(successMsg, form);
      
      // Clear form
      form.reset();
      
      // Reload comments to show the new one
      loadComments(postId).then(comments => {
        const commentsContainer = commentSection.querySelector('.comments');
        commentsContainer.innerHTML = renderCommentList(comments);
      }).catch(err => {
        console.error(`[Blog] Failed to reload comments for post ${postId}:`, err);
        const commentsContainer = commentSection.querySelector('.comments');
        commentsContainer.innerHTML = '<p>Error reloading comments.</p>';
      });
    } else {
      // Apps Script returned success: false with an error message
      throw new Error(data.message || 'Failed to submit comment from server.');
    }
  } catch (err) {
    console.error('[Comment Error]', err);
    // Display error message in the UI instead of an alert
    const errorMsg = document.createElement('div');
    errorMsg.className = 'message error'; // Added 'message' class
    errorMsg.textContent = `Failed to submit comment: ${err.message || 'Unknown error'}. Please try again.`;
    commentSection.insertBefore(errorMsg, form);
  } finally {
    // Reset button state
    submitBtn.textContent = originalBtnText;
    submitBtn.disabled = false;
  }
  
  // Prevent default form submission
  return false;
}

// Utility functions
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.innerText = text;
      return div.innerHTML;
    }


function formatDate(dateString) {
      try {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date)) throw new Error("Invalid date");
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      } catch {
        console.warn("Unparseable date:", dateString);
        return dateString || '';
      }
    }

// Simulated Papa Parse for demo purposes
    function simulatePapaParse(csv) {
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const data = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length !== headers.length) continue;
        
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index].trim();
        });
        data.push(row);
      }
      
      return { data };
    }

    // Make submitComment available globally
    window.submitComment = submitComment;
