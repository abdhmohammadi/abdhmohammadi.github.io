// Publications Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const publicationCards = document.querySelectorAll('.publication-card');
    const citationModal = document.getElementById('citationModal');
    const modalClose = document.getElementById('modalClose');
    const copyCitationBtn = document.getElementById('copyCitation');
    const formatButtons = document.querySelectorAll('.format-btn');
    const citeButtons = document.querySelectorAll('.cite-btn');
    
    // Filter publications
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Show/hide publications based on filter
            publicationCards.forEach(card => {
                const categories = card.getAttribute('data-categories');
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'block';
                    // Add animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            // Update URL hash
            history.pushState(null, null, `#${filter}`);
        });
    });
    
    // Check URL for filter parameter on page load
    const hash = window.location.hash.substring(1);
    if (hash && ['all', 'journal', 'conference', 'thesis', 'persian'].includes(hash)) {
        const correspondingButton = document.querySelector(`.filter-btn[data-filter="${hash}"]`);
        if (correspondingButton) {
            correspondingButton.click();
        }
    }
    
    // Citation modal functionality
    function showCitationModal(title, authors, venue, year, type) {
        const citationText = document.getElementById('citationText');
        
        // Generate APA citation
        const apaCitation = generateAPACitation(title, authors, venue, year, type);
        citationText.textContent = apaCitation;
        
        // Store citation data for format switching
        citationText.dataset.title = title;
        citationText.dataset.authors = authors;
        citationText.dataset.venue = venue;
        citationText.dataset.year = year;
        citationText.dataset.type = type;
        citationText.dataset.currentFormat = 'apa';
        
        // Show modal
        citationModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function generateAPACitation(title, authors, venue, year, type) {
        if (type === 'persian') {
            return `${authors} (${year}). ${title}. ${venue}.`;
        } else {
            return `${authors} (${year}). ${title}. ${venue}.`;
        }
    }
    
    function generateBibTeXCitation(title, authors, venue, year, type) {
        const key = authors.split(' ')[0].toLowerCase() + year;
        return `@article{${key},\n  title={${title}},\n  author={${authors}},\n  journal={${venue}},\n  year={${year}}\n}`;
    }
    
    function generateMLACitation(title, authors, venue, year, type) {
        return `${authors}. "${title}." ${venue}, ${year}.`;
    }
    
    // Handle cite button clicks
    citeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.publication-card');
            const title = card.querySelector('.pub-title').textContent;
            const authors = card.querySelector('.pub-authors').textContent;
            const venue = card.querySelector('.pub-venue').textContent.replace(/^[^a-zA-Z0-9]*/, ''); // Remove icon text
            const year = card.closest('.year-section').querySelector('.year-title').textContent;
            const type = card.getAttribute('data-categories').includes('persian') ? 'persian' : 'english';
            
            showCitationModal(title, authors, venue, year, type);
        });
    });
    
    // Handle modal close
    modalClose.addEventListener('click', function() {
        citationModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking outside
    citationModal.addEventListener('click', function(e) {
        if (e.target === citationModal) {
            citationModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && citationModal.classList.contains('active')) {
            citationModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Handle citation format switching
    formatButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all format buttons
            formatButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get current citation data
            const citationText = document.getElementById('citationText');
            const title = citationText.dataset.title;
            const authors = citationText.dataset.authors;
            const venue = citationText.dataset.venue;
            const year = citationText.dataset.year;
            const type = citationText.dataset.type;
            const format = this.getAttribute('data-format');
            
            // Generate citation in selected format
            let newCitation;
            switch (format) {
                case 'apa':
                    newCitation = generateAPACitation(title, authors, venue, year, type);
                    break;
                case 'bibtex':
                    newCitation = generateBibTeXCitation(title, authors, venue, year, type);
                    break;
                case 'mla':
                    newCitation = generateMLACitation(title, authors, venue, year, type);
                    break;
                default:
                    newCitation = generateAPACitation(title, authors, venue, year, type);
            }
            
            citationText.textContent = newCitation;
            citationText.dataset.currentFormat = format;
        });
    });
    
    // Handle copy citation
    copyCitationBtn.addEventListener('click', function() {
        const citationText = document.getElementById('citationText').textContent;
        
        // Try using modern Clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(citationText).then(() => {
                showCopySuccess(this);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                fallbackCopy(citationText, this);
            });
        } else {
            // Fallback for older browsers
            fallbackCopy(citationText, this);
        }
    });
    
    function fallbackCopy(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            showCopySuccess(button);
        } catch (err) {
            console.error('Fallback copy failed: ', err);
            alert('Failed to copy citation. Please copy manually.');
        }
        
        document.body.removeChild(textArea);
    }
    
    function showCopySuccess(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.style.backgroundColor = '#10b981';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.backgroundColor = '';
        }, 2000);
    }
    
    // Add animation to publication cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Initialize animation for all publication cards
    publicationCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Smooth scroll for year headers
    document.querySelectorAll('.year-title').forEach(header => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', function() {
            const yearSection = this.closest('.year-section');
            const headerHeight = document.querySelector('.navbar').offsetHeight;
            const sectionTop = yearSection.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });
        });
    });
    
    // Highlight active filter based on scroll position
    function highlightActiveYear() {
        const yearSections = document.querySelectorAll('.year-section');
        const scrollPosition = window.scrollY + 100;
        
        yearSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const year = section.querySelector('.year-title').textContent;
                // You could add active state highlighting here if needed
            }
        });
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', highlightActiveYear);
    
    // Initialize on load
    highlightActiveYear();
});