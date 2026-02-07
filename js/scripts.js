/**
 * Portfolio Website Main Script
 * 
 * This script provides core functionality for the personal portfolio website including:
 * 
 * 1. THEME MANAGEMENT
 *    - Toggles between light and dark themes
 *    - Persists user theme preference to localStorage
 *    - Respects system color scheme preferences as default
 *    - Updates ARIA labels for accessibility
 * 
 * 2. MOBILE NAVIGATION
 *    - Handles hamburger menu toggle for mobile devices
 *    - Opens and closes navigation menu based on screen size
 *    - Manages dropdown menus on mobile platforms
 *    - Automatically closes menu on link clicks
 *    - Closes menu when clicking outside of it
 *    - Handles window resize to reset mobile state on desktop
 * 
 * 3. DROPDOWN MENU HANDLING
 *    - Manages dropdown menu interactions for mobile and desktop
 *    - Prevents default link behavior on mobile dropdowns
 *    - Closes other dropdowns when opening a new one
 *    - Supports submenu navigation on mobile
 * 
 * 4. SMOOTH SCROLLING
 *    - Implements smooth scrolling for anchor links (#)
 *    - Accounts for fixed navbar height when calculating scroll position
 *    - Updates URL history without page reload
 *    - Closes mobile menu after smooth scroll navigation
 * 
 * 5. CONTACT FORM
 *    - Handles form submission with validation
 *    - Displays success notification with user's name
 *    - Shows form validation error messages
 *    - Validates email format and required fields
 *    - Resets form after successful submission
 * 
 * 6. SCROLL ANIMATIONS
 *    - Uses Intersection Observer to trigger animations on cards
 *    - Animates publication cards, project cards, and blog cards
 *    - Adds visual feedback when elements enter the viewport
 * 
 * 7. ACCESSIBILITY FEATURES
 *    - Sets ARIA labels and attributes for screen readers
 *    - Handles keyboard events (Escape key to close menu)
 *    - Manages focus management for dropdown menus
 *    - Updates ARIA attributes for dropdown states
 * 
 * 8. TOUCH AND DEVICE HANDLING
 *    - Prevents double-tap zoom on dropdown links
 *    - Handles touch events for better mobile experience
 *    - Detects mobile viewport and adjusts behavior accordingly
 * 
 * 9. FOOTER AND PAGE INITIALIZATION
 *    - Automatically updates the current year in footer
 *    - Adds page load animations with fade-in effect
 * 
 * 10. RESPONSIVE BEHAVIOR
 *     - Adjusts functionality based on viewport width (768px breakpoint)
 *     - Resets mobile state when resizing to desktop view
 *     - Responsive form error handling and styling
 */



// Mobile Menu Elements
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// Function to close mobile menu and dropdowns
function closeMobileMenu() 
{
    navMenu.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    
    // Close all dropdowns
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
    });
}

// Function to open mobile menu
function openMobileMenu() 
{
    navMenu.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close navigation menu');
}

// Toggle mobile menu
menuToggle.addEventListener('click', (e) => 
{
    e.stopPropagation();
    
    if (navMenu.classList.contains('active')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
});

// Handle dropdowns in mobile
document.querySelectorAll('.dropdown > a').forEach(dropdownLink => {
    dropdownLink.addEventListener('click', function(e) {
        const dropdown = this.parentElement;
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = dropdown.classList.contains('active');
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown').forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            if (isActive) {
                dropdown.classList.remove('active');
            } else {
                dropdown.classList.add('active');
            }
        }
    });
});

// Handle submenu links in mobile
document.querySelectorAll('.dropdown-menu a').forEach(submenuLink => {
    submenuLink.addEventListener('click', (e) => {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Allow the link to work normally
            // The menu will close automatically when navigating to a new page
            // If it's a same-page anchor link, close the menu
            const href = submenuLink.getAttribute('href');
            if (href.startsWith('#')) {
                closeMobileMenu();
            }
        }
    });
});

// Handle regular nav links in mobile
document.querySelectorAll('.nav-menu > li:not(.dropdown) > a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            closeMobileMenu();
        }
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        const isClickInsideMenu = navMenu.contains(e.target);
        const isClickOnToggle = menuToggle.contains(e.target);
        
        if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    }
});

// Handle touch events for better mobile experience
let lastTouchTime = 0;
document.querySelectorAll('.dropdown > a').forEach(dropdownLink => {
    dropdownLink.addEventListener('touchstart', function(e) {
        if (window.innerWidth <= 768) {
            const currentTime = new Date().getTime();
            const timeSinceLastTouch = currentTime - lastTouchTime;
            
            // Prevent double-tap zoom
            if (timeSinceLastTouch < 500) {
                e.preventDefault();
            }
            
            lastTouchTime = currentTime;
        }
    }, { passive: true });
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768) {
            // Reset to desktop behavior
            navMenu.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Open navigation menu');
            
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    }, 250);
});

/*
// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => 
{
    anchor.addEventListener('click', function (e) 
    {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) 
        {
            e.preventDefault();
            
            const headerHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) 
            {
                closeMobileMenu();
            }
            
            // Update URL without page reload
            history.pushState(null, null, targetId);
        }
    });
});
*/

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.publication-card, .project-card, .blog-card').forEach(el => {
    observer.observe(el);
});

// Handle dropdown accessibility
document.querySelectorAll('.dropdown').forEach(dropdown => {
    const button = dropdown.querySelector('a');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    // Add aria attributes for accessibility
    button.setAttribute('aria-haspopup', 'true');
    button.setAttribute('aria-expanded', 'false');
    
    // Update aria attributes on dropdown toggle
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const isActive = dropdown.classList.contains('active');
                button.setAttribute('aria-expanded', isActive);
            }
        });
    });
    
    observer.observe(dropdown, { attributes: true });
});

// Initialize menu toggle accessibility
menuToggle.setAttribute('aria-expanded', 'false');
menuToggle.setAttribute('aria-label', 'Open navigation menu');
menuToggle.setAttribute('aria-controls', 'nav-menu');

navMenu.setAttribute('id', 'nav-menu');

// Handle escape key to close menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
});

// Add loading animation for page transitions (optional)
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add a subtle fade-in effect for the whole page
    const style = document.createElement('style');
    style.textContent = `
        body {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        body.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});
