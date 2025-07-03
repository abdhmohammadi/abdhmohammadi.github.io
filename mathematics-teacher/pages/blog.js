const CONFIG = {
  csvUrl: 'https://docs.google.com/spreadsheets/d/1NNVySRVX6Uh_7xIaejKfdQ_MzS3AseiaRNpxYeyhiHU/export?format=csv',
  commentApiUrl: 'https://script.google.com/macros/s/YOUR_DEPLOYED_ID/exec',
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
  });
}

function formatDate(dt) {
  const date = new Date(dt);
  return date.toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });
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
