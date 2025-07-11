let currentIndex = 0;
let wrapper, items, totalItems;
const transitionDuration = 15000; // duration of slide transition in ms (15 seconds)
const displayPause = 1000;        // pause between slides in ms (1 second)
let sliderTimeout;

// Show slide at given index
function showSlide(index) 
{
  const isEnglish = document.documentElement.lang === 'en';
  wrapper.style.transition = `transform ${transitionDuration}ms linear`;

  if (isEnglish) {
    wrapper.style.transform = `translateX(-${index * 100}%)`;
  } else {
    wrapper.style.transform = `translateX(${index * 100}%)`;
  }
}

// Reset slider to first item instantly (no animation)
function resetToFirst() 
{
  wrapper.style.transition = 'none';
  wrapper.style.transform = `translateX(0%)`;
  currentIndex = 0;
}

// Step function to move slider forward
function startSlider() {
  clearTimeout(sliderTimeout);

  function step() {
    currentIndex++;
    if (currentIndex < totalItems) {
      showSlide(currentIndex);
      sliderTimeout = setTimeout(step, transitionDuration + displayPause);
    } else {
      // After last slide, reset to first then go to second slide
      sliderTimeout = setTimeout(() => {
        resetToFirst();
        // Reapply transition after reset, then show second slide
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            showSlide(1);
            currentIndex = 1;
            sliderTimeout = setTimeout(step, transitionDuration + displayPause);
          });
        });
      }, transitionDuration + displayPause);
    }
  }

  // Start slider immediately
  showSlide(0);
  sliderTimeout = setTimeout(step, transitionDuration + displayPause);
}

// Initialize the news slider
function initNewsSlider() {
  wrapper = document.querySelector('.news-items-wrapper');
  items = document.querySelectorAll('.news-item');
  totalItems = items.length;
  currentIndex = 0;
  resetToFirst();
  startSlider();
}

// Language toggle handler
function toggleLanguage() {
  const isEnglish = document.documentElement.lang === 'en';
  document.documentElement.lang = isEnglish ? 'fa' : 'en';
  document.documentElement.dir = isEnglish ? 'rtl' : 'ltr';
  applyLanguage();
  initNewsSlider(); // restart slider on language change
}

// Apply language changes to elements with data-en and data-fa attributes
function applyLanguage() 
{
  const isEnglish = document.documentElement.lang === 'en';
  document.documentElement.dir = isEnglish ? 'ltr' : 'rtl';
  document.body.classList.toggle('rtl-layout', !isEnglish);

  document.querySelectorAll('[data-en]').forEach(el => {
    const content = isEnglish ? el.getAttribute('data-en') : el.getAttribute('data-fa');
    if (content) el.innerHTML = content;
  });

  updateLanguageToggleButton(isEnglish);
}

// Update the language toggle button flag icons
function updateLanguageToggleButton(isEnglish) {
  const btn = document.getElementById('langToggle');
  if (btn) {
    btn.innerHTML = isEnglish
      ? `<img src="https://flagcdn.com/w80/ir.png" alt="فارسی" class="flag-icon"> | 
         <img src="https://flagcdn.com/w80/gb.png" alt="English" class="flag-icon">`
      : `<img src="https://flagcdn.com/w80/gb.png" alt="English" class="flag-icon"> | 
         <img src="https://flagcdn.com/w80/ir.png" alt="فارسی" class="flag-icon">`;
  }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
    const targetPosition = target.offsetTop - headerHeight;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });
});

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  applyLanguage();
  initNewsSlider();

  const themeToggleBtn = document.getElementById('theme-toggle');
   const body = document.body;

  // Check for saved theme in localStorage, default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  body.setAttribute('data-theme', savedTheme);

  themeToggleBtn.addEventListener('click', () => {
                if (body.getAttribute('data-theme') === 'dark') {
                    body.setAttribute('data-theme', 'light');
                    localStorage.setItem('theme', 'light');
                } else {
                    body.setAttribute('data-theme', 'dark');
                    localStorage.setItem('theme', 'dark');
                }
            });
});
