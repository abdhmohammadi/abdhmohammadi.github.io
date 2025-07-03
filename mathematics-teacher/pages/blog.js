// blog.js (final cleaned version)

const CONFIG = {
  csvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQkAgbOLO9NA6TKeRlMAYOGPW2gRtmlUZjBqD2-tQsKwVryGC3pIzLWg844P8ysrfRc2wpy6GSAPrVF/pub?output=csv',
  commentApiUrl: 'https://script.google.com/macros/s/AKfycbwq83MUqFugMl_MaZQSHozy-aRvrf3EkoKKLiPMOUhcNBPAO8J3oeAiBhFlXmMkE9-B/exec',
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

function submitComment(postId, name, text) {
  const commentData = {
    postId: postId,
    name: name,
    text: text
  };

  fetch("https://script.google.com/macros/s/AKfycbwq83MUqFugMl_MaZQSHozy-aRvrf3EkoKKLiPMOUhcNBPAO8J3oeAiBhFlXmMkE9-B/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(commentData)
  })
  .then(async (res) => {
    const text = await res.text();               // inspect raw response
    console.log("Raw response:", text);
    try {
      const json = JSON.parse(text);             // safe parse
      if (json.success) {
        alert("✅ Comment added successfully");
        loadComments(postId); // reload comments
      } else {
        console.error("[Comment Error]", json.message);
        alert("❌ Failed to add comment: " + json.message);
      }
    } catch (err) {
      console.error("[Comment Error] Invalid JSON:", text);
    }
  })
  .catch(err => {
    console.error("[Comment Error] Network error:", err);
  });
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
