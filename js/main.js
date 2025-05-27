

document.addEventListener('DOMContentLoaded', function () 
{
    applyLanguage(); // Ensure correct language on first load
    initNewsSlider(); // Initialize news slider
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

function initNewsSlider() {
    const newsItems = document.querySelectorAll('.news-item');
    if (newsItems.length === 0) return;

    let currentIndex = 0;

    function showNextNews() {
        newsItems[currentIndex].classList.remove('active');
        newsItems[currentIndex].style.display = 'none';
        currentIndex = (currentIndex + 1) % newsItems.length;
        newsItems[currentIndex].classList.add('active');
        newsItems[currentIndex].style.display = 'block';
    }

    newsItems[0].classList.add('active');
    newsItems[0].style.display = 'block';

    setInterval(showNextNews, 5000);
}

/*
document.addEventListener('DOMContentLoaded', function () {
    applyLanguage(); // Ensure correct language on first load
});

function toggleLanguage() {
    const isEnglish = document.documentElement.lang === 'en';
    document.documentElement.lang = isEnglish ? 'fa' : 'en';
    
    applyLanguage(); // Apply language to all elements
}

function applyLanguage() {
    const isEnglish = document.documentElement.lang === 'en';

    document.querySelectorAll('[data-en]').forEach(element => {
        const newHTML = isEnglish ? element.getAttribute('data-en') : element.getAttribute('data-fa');
        if (newHTML) {
            element.innerHTML = newHTML; // Use innerHTML to correctly render spans
        }
    });
}



// Update page text based on selected language
function updateTextContent(language) {
    document.querySelectorAll('[data-en]').forEach(element => {
        element.textContent = (language === 'fa') ? element.getAttribute('data-fa') : element.getAttribute('data-en');
    });

    // Show/hide language-specific sections
    document.querySelectorAll('.fa-text').forEach(el => el.style.display = (language === 'fa') ? 'block' : 'none');
    document.querySelectorAll('.en-text').forEach(el => el.style.display = (language === 'en') ? 'block' : 'none');

    // Update the language toggle button (flag images)
    let langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.innerHTML = (language === 'fa')
            ? `<img src="https://flagcdn.com/w80/gb.png" alt="English" class="flag-icon en-flag"> | 
               <img src="https://flagcdn.com/w80/ir.png" alt="فارسی" class="flag-icon fa-flag">`
            : `<img src="https://flagcdn.com/w80/ir.png" alt="فارسی" class="flag-icon fa-flag"> | 
               <img src="https://flagcdn.com/w80/gb.png" alt="English" class="flag-icon en-flag">`;
    }
}

function initNewsSlider() {
    const newsItems = document.querySelectorAll('.news-item');
    if (newsItems.length === 0) {
        console.warn("No news items found!");
        return; // Exit if there are no news items
    }

    let currentIndex = 0;

    function showNextNews() {
        // Remove active class from current item
        newsItems[currentIndex].classList.remove('active');
        newsItems[currentIndex].style.display = 'none'; // Hide current item

        // Move to next item
        currentIndex = (currentIndex + 1) % newsItems.length;

        // Add active class to next item
        newsItems[currentIndex].classList.add('active');
        newsItems[currentIndex].style.display = 'block'; // Show next item
    }

    // Show first news item initially
    newsItems[0].classList.add('active');
    newsItems[0].style.display = 'block';

    // Cycle through news items every 5 seconds
    setInterval(showNextNews, 5000);
}
*/
/*
document.addEventListener('DOMContentLoaded', function () {
    // Check if the default language is Farsi (fa) when the page loads
    if (document.documentElement.lang === 'fa') {
        // Set the page to Farsi if not already
        document.body.classList.add('fa-lang');
        
        // Show the Farsi text and hide the English text
        document.querySelectorAll('.fa-text').forEach(element => {
            element.style.display = 'block'; // Show Farsi text
        });
        document.querySelectorAll('.en-text').forEach(element => {
            element.style.display = 'none'; // Hide English text
        });
    }
   initNewsSlider()
   //toggleLanguage()

});

// Language Toggle Function
function toggleLanguage() 
{
    const isEnglish = document.documentElement.lang === 'en'; // Check if language is currently English
    
    // Switch language and update the lang attribute
    document.documentElement.lang = isEnglish ? 'fa' : 'en';
    document.body.classList.toggle('fa-lang');
    
    // Update the text content based on language
    document.querySelectorAll('[data-en]').forEach(element => {
        element.textContent = isEnglish ? element.getAttribute('data-fa') : element.getAttribute('data-en');
    });

    // Toggle visibility of English and Farsi text
    if (isEnglish) {
        // Show Farsi and hide English
        document.querySelectorAll('.fa-text').forEach(element => {
            element.style.display = 'block';
        });
        document.querySelectorAll('.en-text').forEach(element => {
            element.style.display = 'none';
        });
    } else {
        // Show English and hide Farsi
        document.querySelectorAll('.fa-text').forEach(element => {
            element.style.display = 'none';
        });
        document.querySelectorAll('.en-text').forEach(element => {
            element.style.display = 'block';
        });
    }
}



// News Slider Functionality
function initNewsSlider() 
{
    const newsItems = document.querySelectorAll('.news-item');
    let currentIndex = 0;
    
    function showNextNews() 
    {
        // Remove active class from current item
        newsItems[currentIndex].classList.remove('active');
        
        // Move to next item
        currentIndex = (currentIndex + 1) % newsItems.length;
        
        // Add active class to next item
        newsItems[currentIndex].classList.add('active');
    }
    
    // Show first news item
    newsItems[0].classList.add('active');
    
    // Cycle through news items every 5 seconds
    setInterval(showNextNews, 5000);
}
*/
/*
// Language Toggle Function
function toggleLanguage() 
{
    const isEnglish = document.documentElement.lang === 'en';
    document.documentElement.lang = isEnglish ? 'fa' : 'en';
    document.body.classList.toggle('fa-lang');
    
    // Update text content based on language
    document.querySelectorAll('[data-en]').forEach(element => {
        element.textContent = isEnglish ? element.getAttribute('data-fa') : element.getAttribute('data-en');
    });
}
// News Slider Functionality
function initNewsSlider() {
    const newsItems = document.querySelectorAll('.news-item');
    let currentIndex = 0;
    
    function showNextNews() {
        // Remove active class from current item
        newsItems[currentIndex].classList.remove('active');
        
        // Move to next item
        currentIndex = (currentIndex + 1) % newsItems.length;
        
        // Add active class to next item
        newsItems[currentIndex].classList.add('active');
    }
    
    // Show first news item
    newsItems[0].classList.add('active');
    
    // Cycle through news items every 5 seconds
    setInterval(showNextNews, 5000);
}

// Initialize news slider when DOM is loaded
document.addEventListener('DOMContentLoaded', initNewsSlider); 
*/