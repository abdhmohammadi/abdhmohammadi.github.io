





document.addEventListener('DOMContentLoaded', function () 
{
  const inner = document.querySelector('.carousel-inner');
  const slides = document.querySelectorAll('.carousel-slide');
  const indicators = document.querySelectorAll('.carousel-indicator');
  //const dirToggle = document.getElementById('dirToggle');
  const body = document.body;
  const dropdowns = document.querySelectorAll(".dropdown-content");

  let currentSlide = 0;
  let slideInterval;
  const totalSlides = slides.length;
  
  // Save/Restore RTL preference
  if (localStorage.getItem('dir') === 'rtl') 
  {
    body.classList.add('rtl');
    dropdowns.forEach(dropdown => 
    {
      const parent = dropdown.parentElement;
      dropdown.style.left = "auto";
      dropdown.style.right = "0"; // Align dropdown correctly in RTL
      
    });
  }else
  {
    dropdowns.forEach(dropdown => 
    {
      const parent = dropdown.parentElement;
      dropdown.style.left = "0";
      dropdown.style.right = "auto"; // Default LTR alignment
    });
  }

  function isRTL() 
  {
    return body.classList.contains('rtl');
  }

  function showSlide(index) 
  {
    currentSlide = index;
    const directionMultiplier = isRTL() ? 1 : -1;
    const offset = index * 100 * directionMultiplier;
    inner.style.transform = `translateX(${offset}%)`;

    indicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === index);
    });
  }

  function nextSlide() 
  {
    let next = isRTL()
      ? (currentSlide - 1 + totalSlides) % totalSlides
      : (currentSlide + 1) % totalSlides;
    showSlide(next);
  }

  function startSlideShow() 
  {
    slideInterval = setInterval(nextSlide, 4000);
  }

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      clearInterval(slideInterval);
      showSlide(index);
      startSlideShow();
    });
  });

  //dirToggle.addEventListener('click', () => {
  //  body.classList.toggle('rtl');
  //  localStorage.setItem('dir', isRTL() ? 'rtl' : 'ltr');
  //  showSlide(currentSlide); // re-render position
  //});

  showSlide(currentSlide);
  startSlideShow();

  
// Language toggle handler
function toggleLanguage() 
{
  const isEnglish = document.documentElement.lang === 'en';
  document.documentElement.lang = isEnglish ? 'fa' : 'en';
  document.documentElement.dir = isEnglish ? 'rtl' : 'ltr';
  applyLanguage();
  initNewsSlider(); // restart slider on language change
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

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => 
  {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      const headerHeight = document.querySelector('header')?.offsetHeight || 0;
      const targetPosition = target.offsetTop - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
});
