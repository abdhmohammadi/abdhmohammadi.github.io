/*
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

  // ========== MOBILE DROPDOWN TOGGLE ==========
  document.querySelectorAll('.dropbtn').forEach(button => {
    button.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        
        const dropdown = this.nextElementSibling;
        if (dropdown && dropdown.classList.contains('dropdown-content')) {
          // Toggle mobile-open class
          const isOpen = dropdown.classList.contains('mobile-open');
          
          // Close all other dropdowns
          document.querySelectorAll('.dropdown-content').forEach(d => {
            d.classList.remove('mobile-open');
          });
          
          // Open current if it was closed
          if (!isOpen) {
            dropdown.classList.add('mobile-open');
          }
        }
      }
    });
  });
  
  // Close dropdowns when clicking outside on mobile
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      // Check if click is NOT inside a dropdown or dropdown button
      const clickedInDropdown = e.target.closest('.dropdown-content');
      const clickedOnDropdownBtn = e.target.closest('.dropbtn');
      
      if (!clickedInDropdown && !clickedOnDropdownBtn) {
        // Close all dropdowns
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
          dropdown.classList.remove('mobile-open');
        });
      }
    }
  });

  // ========== WINDOW RESIZE HANDLER ==========
  function handleResize() {
    // Reset dropdowns on desktop
    if (window.innerWidth > 768) {
      document.querySelectorAll('.dropdown-content').forEach(dropdown => {
        dropdown.classList.remove('mobile-open');
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

*/

/*
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
    const offset = -index * 100;
    if (inner) inner.style.transform = `translateX(${offset}%)`;

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
  if (slides.length > 0 && inner) {
    showSlide(currentSlide);
    startSlideShow();
  }

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
    });
  });

  // ========== MOBILE MENU TOGGLE ==========
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
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
    
    // Close menu when clicking on a link (except dropdown buttons)
    const navItems = navLinks.querySelectorAll('a:not(.dropbtn)');
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

  // ========== MOBILE DROPDOWN FIX ==========
  function setupMobileDropdowns() {
    const dropdownButtons = document.querySelectorAll('.dropbtn');
    
    dropdownButtons.forEach(button => {
      // Remove any existing listeners
      button.replaceWith(button.cloneNode(true));
    });
    
    // Re-select after cloning
    document.querySelectorAll('.dropbtn').forEach(button => {
      button.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation();
          
          const dropdown = this.nextElementSibling;
          if (dropdown && dropdown.classList.contains('dropdown-content')) {
            // Toggle THIS dropdown only
            const isOpen = dropdown.classList.contains('mobile-open');
            
            // Toggle current dropdown
            if (isOpen) {
              dropdown.classList.remove('mobile-open');
            } else {
              dropdown.classList.add('mobile-open');
            }
          }
        }
      });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        const isDropdownBtn = e.target.classList.contains('dropbtn') || 
                             e.target.closest('.dropbtn');
        const isInDropdown = e.target.closest('.dropdown-content');
        
        if (!isDropdownBtn && !isInDropdown) {
          document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            dropdown.classList.remove('mobile-open');
          });
        }
      }
    });
  }

  // ========== WINDOW RESIZE HANDLER ==========
  function handleResize() {
    // Reset dropdowns and menu on desktop
    if (window.innerWidth > 768) {
      document.querySelectorAll('.dropdown-content').forEach(dropdown => {
        dropdown.classList.remove('mobile-open');
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
    
    // Re-setup dropdowns on mobile
    if (window.innerWidth <= 768) {
      setupMobileDropdowns();
    }
  }

  // Initialize
  setupMobileDropdowns();
  window.addEventListener('resize', handleResize);
  handleResize(); // Run once on load
});
*/
/*
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
    const offset = -index * 100;
    if (inner) inner.style.transform = `translateX(${offset}%)`;

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
    });
  });

  // ========== MOBILE MENU TOGGLE ==========
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      navLinks.classList.toggle('active');
      
      const icon = menuToggle.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }

  // ========== SIMPLE MOBILE DROPDOWN ==========
  document.querySelectorAll('.dropbtn').forEach(button => {
    button.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        
        const dropdown = this.nextElementSibling;
        if (dropdown && dropdown.classList.contains('dropdown-content')) {
          // Toggle only this dropdown
          dropdown.classList.toggle('mobile-open');
          
          // Optional: Close other dropdowns
          document.querySelectorAll('.dropdown-content').forEach(other => {
            if (other !== dropdown) {
              other.classList.remove('mobile-open');
            }
          });
        }
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      const isDropdownBtn = e.target.classList.contains('dropbtn') || 
                           e.target.closest('.dropbtn');
      const isInDropdown = e.target.closest('.dropdown-content');
      
      if (!isDropdownBtn && !isInDropdown) {
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
          dropdown.classList.remove('mobile-open');
        });
      }
    }
  });

  // ========== WINDOW RESIZE ==========
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      // Reset on desktop
      document.querySelectorAll('.dropdown-content').forEach(dropdown => {
        dropdown.classList.remove('mobile-open');
      });
      
      if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        if (menuToggle && menuToggle.querySelector('i')) {
          menuToggle.querySelector('i').classList.remove('fa-times');
          menuToggle.querySelector('i').classList.add('fa-bars');
        }
      }
    }
  });

  
});
*/
document.addEventListener('DOMContentLoaded', function () {
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
  // Save/Restore RTL preference
  /*if (localStorage.getItem('dir') === 'rtl') 
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
  //}

  function isRTL() 
  {
    return body.classList.contains('rtl');
  }
*/
  function showSlide(index) 
  {
    currentSlide = index;
    const directionMultiplier =1;// isRTL() ? 1 : -1;
    const offset = index * 100 * directionMultiplier;
    inner.style.transform = `translateX(${offset}%)`;

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
    slideInterval = setInterval(nextSlide, 6000);
  }

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      clearInterval(slideInterval);
      showSlide(index);
      startSlideShow();
    });
  });

  showSlide(currentSlide);
  startSlideShow();

  /*const inner = document.querySelector('.carousel-inner');
  const slides = document.querySelectorAll('.carousel-slide');
  const indicators = document.querySelectorAll('.carousel-indicator');
  
  let currentSlide = 0;
  let slideInterval;
  const totalSlides = slides.length;

  function showSlide(index) {
    currentSlide = index;
    const offset = -index * 100;
    if (inner) inner.style.transform = `translateX(${offset}%)`;

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
*/
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
    mobileOverlay.classList.add('active');
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeMobileMenu() {
    mobileOverlay.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
    
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
});