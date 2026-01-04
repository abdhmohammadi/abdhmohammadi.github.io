document.addEventListener('DOMContentLoaded', function () {
  // ========== THEME SWITCHING FUNCTIONALITY ==========
  const themeToggle = document.getElementById('themeToggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Get saved theme from localStorage or use system preference
  function getSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return prefersDarkScheme.matches ? 'dark' : 'light';
  }
  
  // Set theme
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme toggle icon
    if (themeToggle) {
      const lightIcon = themeToggle.querySelector('.light-icon');
      const darkIcon = themeToggle.querySelector('.dark-icon');
      if (lightIcon && darkIcon) {
        lightIcon.style.display = theme === 'dark' ? 'block' : 'none';
        darkIcon.style.display = theme === 'dark' ? 'none' : 'block';
      }
    }
  }
  
  // Initialize theme
  const currentTheme = getSavedTheme();
  setTheme(currentTheme);
  
  // Toggle theme when button is clicked
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    });
  }
  
  // Listen for system theme changes
  prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ========== CAROUSEL FUNCTIONALITY ==========
  const inner = document.querySelector('.carousel-inner');
  const slides = document.querySelectorAll('.carousel-slide');
  const indicators = document.querySelectorAll('.carousel-indicator');
  //const dirToggle = document.getElementById('dirToggle');
  const body = document.body;
  const dropdowns = document.querySelectorAll(".dropdown-content");

  let currentSlide = 0;
  let slideInterval;
  const totalSlides = slides.length;
  
  function showSlide(index) 
  {
    currentSlide = index;
    const directionMultiplier =1;// isRTL() ? 1 : -1;
    const offset = index * 100 * directionMultiplier;
    if (inner) inner.style.transform = `translateX(${offset}%)`;

    indicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === index);
    });
  }

  function nextSlide() 
  {
    let next = true//isRTL()
      ? (currentSlide - 1 + totalSlides) % totalSlides
      : (currentSlide + 1) % totalSlides;
    showSlide(next);
  }

  function startSlideShow() 
  {
    if (totalSlides > 1) {
      slideInterval = setInterval(nextSlide, 6000);
    }
  }

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      clearInterval(slideInterval);
      showSlide(index);
      startSlideShow();
    });
  });

  if (slides.length > 0 && inner) {
    showSlide(currentSlide);
    startSlideShow();
  }

  // ========== DESKTOP DROPDOWN FUNCTIONALITY ==========
  // Close dropdown when clicking outside
  document.addEventListener('click', function(event) {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('show');
      }
    });
  });

  // Toggle dropdown on click for desktop
  document.querySelectorAll('.dropdown > a').forEach(link => {
    link.addEventListener('click', function(e) {
      if (window.innerWidth <= 992) {
        e.preventDefault();
        const dropdown = this.parentElement;
        dropdown.classList.toggle('show');
      }
    });
  });

  // ========== SMOOTH SCROLLING ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;
      
      const headerHeight = document.querySelector('header')?.offsetHeight || 0;
      const targetPosition = target.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Close mobile menu if open
      closeMobileMenu();
    });
  });

  // ========== MOBILE SIDE MENU ==========
  const menuToggle = document.getElementById('menuToggle');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  
  function openMobileMenu() {
    if (mobileOverlay) mobileOverlay.classList.add('active');
    if (mobileMenu) mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
    menuToggle.style.display ='none';
    themeToggle.style.display='none';
  }
  
  function closeMobileMenu() {
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    if (mobileMenu) mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
    menuToggle.style.display ='';
    themeToggle.style.display='block';
    // Close all submenus
    document.querySelectorAll('.mobile-menu-item').forEach(item => {
      item.classList.remove('active');
    });
  }
  
  // Open menu when clicking hamburger
  if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      openMobileMenu();
    });
  }
  
  // Close menu with close button
  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileMenu);
  }
  
  // Close menu when clicking overlay
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }
  
  // Close menu with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });
  
  // Mobile submenu toggle
  document.querySelectorAll('.mobile-menu-toggle').forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const parent = this.parentElement;
      parent.classList.toggle('active');
      
      // Close other submenus
      document.querySelectorAll('.mobile-menu-item').forEach(item => {
        if (item !== parent) {
          item.classList.remove('active');
        }
      });
    });
  });
  
  // Close menu when clicking on mobile menu links
  document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
      if (!this.classList.contains('mobile-menu-toggle') && 
          !this.classList.contains('disabled')) {
        closeMobileMenu();
      }
    });
  });

  // ========== WINDOW RESIZE HANDLER ==========
  function handleResize() {
    // Close mobile menu on desktop
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  }
  
  window.addEventListener('resize', handleResize);

  // ========== SET ACTIVE NAV LINK ==========
  function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-nav-links a').forEach(link => {
      const linkHref = link.getAttribute('href');
      if (linkHref === currentPage || 
          (currentPage === '' && linkHref === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  setActiveNavLink();
});