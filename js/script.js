// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme or use preferred scheme
function getCurrentTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return prefersDarkScheme.matches ? 'dark' : 'light';
}

// Set theme on page load
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update ARIA label for accessibility
    const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    themeToggle.setAttribute('aria-label', label);
}

// Initialize theme
setTheme(getCurrentTheme());

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// Mobile Menu Elements
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// Function to close mobile menu and dropdowns
function closeMobileMenu() {
    navMenu.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    
    // Close all dropdowns
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
    });
}

// Function to open mobile menu
function openMobileMenu() {
    navMenu.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close navigation menu');
}

// Toggle mobile menu
menuToggle.addEventListener('click', (e) => {
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

// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            
            const headerHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
            
            // Update URL without page reload
            history.pushState(null, null, targetId);
        }
    });
});

// Form submission handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name') || 'User';
        
        // In a real application, you would send the form data to a server
        // For now, we'll just show a success message
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        //submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        //submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            contactForm.reset();
            
            // Show a more subtle notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--primary-color);
                color: white;
                padding: 12px 20px;
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-lg);
                z-index: 10000;
                animation: slideIn 0.3s ease;
            `;
            notification.innerHTML = `<i class="fas fa-check-circle"></i> Thank you for your message, ${name}!`;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }, 1500);
    });
}

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

// Handle contact form validation
if (contactForm) {
    const inputs = contactForm.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('invalid', (e) => {
            e.preventDefault();
            
            // Add error styling
            input.style.borderColor = '#ef4444';
            
            // Show error message
            let errorMsg = input.nextElementSibling;
            if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.style.cssText = `
                    color: #ef4444;
                    font-size: 0.875rem;
                    margin-top: 4px;
                `;
                input.parentNode.appendChild(errorMsg);
            }
            
            if (input.validity.valueMissing) {
                errorMsg.textContent = 'This field is required';
            } else if (input.validity.typeMismatch) {
                errorMsg.textContent = 'Please enter a valid email address';
            }
        });
        
        input.addEventListener('input', () => {
            // Remove error styling when user starts typing
            input.style.borderColor = '';
            
            const errorMsg = input.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.remove();
            }
        });
    });
}
