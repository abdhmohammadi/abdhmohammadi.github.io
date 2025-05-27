
let currentIndex = 0;
let wrapper, items, totalItems;
let transitionDuration = 15000; // in ms
let displayPause = 1; // short delay between items
let sliderTimeout;

function showSlide(index) 
{
    const isEnglish = document.documentElement.lang === 'en';
    wrapper.style.transition = `transform ${transitionDuration}ms linear`;

    if(isEnglish)
    {
      wrapper.style.transform = `translateX(-${index * 100}%)`;
    }
    else
    {
      wrapper.style.transform = `translateX(${index * 100}%)`;
    }
}

function resetToFirst() {
  wrapper.style.transition = 'none';
  wrapper.style.transform = `translateX(0%)`;
  currentIndex = 0;
}

function startSlider() {
  clearTimeout(sliderTimeout);

  function step() {
    currentIndex++;
    if (currentIndex < totalItems) {
      showSlide(currentIndex);
      sliderTimeout = setTimeout(step, transitionDuration + displayPause);
    } else {
      // Last one is done, wait and reset
      sliderTimeout = setTimeout(() => {
        resetToFirst();
        // Small async delay to reapply transition
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            showSlide(1); // Slide to second (index 1)
            currentIndex = 1;
            sliderTimeout = setTimeout(step, transitionDuration + displayPause);
          });
        });
      }, transitionDuration + displayPause);
    }
  }

  // Start immediately
  showSlide(0);
  sliderTimeout = setTimeout(step, transitionDuration + displayPause);
}

function initNewsSlider() {
  wrapper = document.querySelector('.news-items-wrapper');
  items = document.querySelectorAll('.news-item');
  totalItems = items.length;
  currentIndex = 0;
  resetToFirst();
  startSlider();
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  applyLanguage();
  initNewsSlider();
});

// Language toggle
function toggleLanguage() {
  const isEnglish = document.documentElement.lang === 'en';
  document.documentElement.lang = isEnglish ? 'fa' : 'en';
  document.documentElement.dir = isEnglish ? 'rtl' : 'ltr';
  applyLanguage();
  initNewsSlider(); // restart slider after language change
}

function applyLanguage() {
  const isEnglish = document.documentElement.lang === 'en';
  document.documentElement.dir = isEnglish ? 'ltr' : 'rtl';
  document.body.classList.toggle('rtl-layout', !isEnglish);

  document.querySelectorAll('[data-en]').forEach(el => {
    const content = isEnglish ? el.getAttribute('data-en') : el.getAttribute('data-fa');
    if (content) el.innerHTML = content;
  });

  updateLanguageToggleButton(isEnglish);
}

function updateLanguageToggleButton(isEnglish) {
  let btn = document.getElementById('langToggle');
  if (btn) {
    btn.innerHTML = isEnglish
            ? `<img src="https://flagcdn.com/w80/ir.png" alt="فارسی" class="flag-icon"> | 
               <img src="https://flagcdn.com/w80/gb.png" alt="English" class="flag-icon">`
            : `<img src="https://flagcdn.com/w80/gb.png" alt="English" class="flag-icon"> | 
               <img src="https://flagcdn.com/w80/ir.png" alt="فارسی" class="flag-icon">`;
  }
}



/*
document.addEventListener("DOMContentLoaded", () => {
  
  const wrapper = document.querySelector('.news-items-wrapper');
  const items = document.querySelectorAll('.news-item');
  const totalItems = items.length;
  let currentIndex = 0;

  const transitionDuration = 10000; // 1s
  const displayDuration = 0;    // 3s per item (not counting transition)

  function showSlide(index) {
    wrapper.style.transition = `transform ${transitionDuration}ms linear`;
    wrapper.style.transform = `translateX(-${index * 100}%)`;
  }

  function resetToFirstSlide() {
    // Instantly jump back to first (without transition)
    wrapper.style.transition = 'none';
    wrapper.style.transform = 'translateX(0%)';
    currentIndex = 0;
  }

  function startSlider() {
    setTimeout(() => {
      currentIndex++;
      if (currentIndex < totalItems) {
        showSlide(currentIndex);
        startSlider();
      } else {
        // Wait, then reset
        setTimeout(() => {
          resetToFirstSlide();
          startSlider(); // Restart after reset
        }, displayDuration);
      }
    }, displayDuration + transitionDuration);
  }

  startSlider();
});

function toggleLanguage() 
{
    const isEnglish = document.documentElement.lang === 'en';
    
    // Set language and direction
    document.documentElement.lang = isEnglish ? 'fa' : 'en';
    document.documentElement.dir = isEnglish ? 'rtl' : 'ltr';
    applyLanguage();
}

function applyLanguage() 
{

    const isEnglish = document.documentElement.lang === 'en';

    // Apply text direction
    document.documentElement.dir = isEnglish ? 'ltr' : 'rtl';

    // Add/remove RTL class
    document.body.classList.toggle('rtl-layout', !isEnglish);

    // Update all elements with language-specific content
    document.querySelectorAll('[data-en]').forEach(element => {
        const newHTML = isEnglish ? element.getAttribute('data-en') : element.getAttribute('data-fa');
        if (newHTML) {
            element.innerHTML = newHTML;
        }
    });
}
function updateLanguageToggleButton(isEnglish) 
{
    let langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.innerHTML = isEnglish
            ? `<img src="https://flagcdn.com/w80/ir.png" alt="فارسی" class="flag-icon"> | 
               <img src="https://flagcdn.com/w80/gb.png" alt="English" class="flag-icon">`
            : `<img src="https://flagcdn.com/w80/gb.png" alt="English" class="flag-icon"> | 
               <img src="https://flagcdn.com/w80/ir.png" alt="فارسی" class="flag-icon">`;
    }
}
*/