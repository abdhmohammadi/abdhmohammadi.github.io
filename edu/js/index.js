document.addEventListener('DOMContentLoaded', function () {
  // ========== CAROUSEL FUNCTIONALITY ==========
  const inner = document.querySelector('.carousel-inner');
  const slides = document.querySelectorAll('.carousel-slide');
  const indicators = document.querySelectorAll('.carousel-indicator');
  
  let currentSlide = 0;
  let slideInterval;
  const totalSlides = slides.length;

  function showSlide(index) {
    currentSlide = index;
    const offset = -index * 100; // Negative for RTL direction
    inner.style.transform = `translateX(${offset}%)`;

    indicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === index);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  }

  function startSlideShow() {
    if (totalSlides > 1) {
      slideInterval = setInterval(nextSlide, 5000);
    }
  }

  // Add click events to indicators
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      clearInterval(slideInterval);
      showSlide(index);
      startSlideShow();
    });
  });

  // Initialize carousel
  if (slides.length > 0) {
    showSlide(currentSlide);
    startSlideShow();
  }

  // ========== SMOOTH SCROLLING ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return; // Skip empty anchors
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;
      
      const headerHeight = document.querySelector('header')?.offsetHeight || 0;
      const targetPosition = target.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });

  // ========== MOBILE MENU TOGGLE ==========
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent event bubbling
      navLinks.classList.toggle('active');
      
      // Change icon
      const icon = menuToggle.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
    
    // Close menu when clicking on a link
    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (menuToggle.querySelector('i')) {
          menuToggle.querySelector('i').classList.remove('fa-times');
          menuToggle.querySelector('i').classList.add('fa-bars');
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        if (menuToggle.querySelector('i')) {
          menuToggle.querySelector('i').classList.remove('fa-times');
          menuToggle.querySelector('i').classList.add('fa-bars');
        }
      }
    });
  }

  // ========== MOBILE DROPDOWN HANDLING ==========
  const dropdownButtons = document.querySelectorAll('.dropbtn');

  dropdownButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        
        const dropdown = this.nextElementSibling;
        if (dropdown && dropdown.classList.contains('dropdown-content')) {
          // Toggle this dropdown
          const isVisible = dropdown.style.display === 'block';
          
          // Close all other dropdowns
          document.querySelectorAll('.dropdown-content').forEach(dd => {
            if (dd !== dropdown) {
              dd.style.display = 'none';
            }
          });
          
          // Toggle current dropdown
          dropdown.style.display = isVisible ? 'none' : 'block';
        }
      }
    });
  });



  // Close dropdowns when clicking outside on mobile
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      const dropdowns = document.querySelectorAll('.dropdown-content');
      let clickedInsideDropdown = false;
      
      // Check if click is inside any dropdown or its button
      dropdowns.forEach(dropdown => {
        const button = dropdown.previousElementSibling;
        if (dropdown.contains(e.target) || (button && button.contains(e.target))) {
          clickedInsideDropdown = true;
        }
      });
      
      // Also check if click is inside nav links (mobile menu)
      const navLinks = document.querySelector('.nav-links');
      if (navLinks && navLinks.contains(e.target)) {
        clickedInsideDropdown = true;
      }
      
      // Close dropdowns if clicked outside
      if (!clickedInsideDropdown) {
        dropdowns.forEach(dropdown => {
          dropdown.style.display = 'none';
        });
      }
    }
});

  // ========== WINDOW RESIZE HANDLER ==========
  function handleResize() {
    // Reset dropdowns on desktop
    if (window.innerWidth > 768) {
      document.querySelectorAll('.dropdown-content').forEach(dd => {
        dd.style.display = '';
      });
      
      // Close mobile menu if open
      if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        if (menuToggle && menuToggle.querySelector('i')) {
          menuToggle.querySelector('i').classList.remove('fa-times');
          menuToggle.querySelector('i').classList.add('fa-bars');
        }
      }
    }
  }

  // Listen for resize events
  window.addEventListener('resize', handleResize);
  handleResize(); // Run once on load
});