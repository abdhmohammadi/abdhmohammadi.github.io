
// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme or use preferred scheme
function getCurrentTheme() 
{
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return prefersDarkScheme.matches ? 'dark' : 'light';
}

// Set theme on page load
function setTheme(theme) 
{
    // Apply the theme to UI
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update ARIA label for accessibility
    const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    themeToggle.setAttribute('aria-label', label);
}

// Initialize theme
setTheme(getCurrentTheme());

// Toggle theme on button click
themeToggle.addEventListener('click', () => 
{
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    recolorAllBadges();
});
  // ---------- 2. Theme‑based lightness range ----------
    // Light theme → darker colors (20%–50% lightness)
    // Dark theme  → lighter colors (60%–90% lightness)
    function getLightnessRange(theme) 
    {
      if (theme === 'dark') {
        return { min: 60, max: 90 }; // light colors
      } else {
        return { min: 20, max: 50 }; // darker colors
      }
    }


    // ---------- 3. Apply random color to a badge ----------
    function colorBadge(badge) 
    {
      const theme = getCurrentTheme();
      const { min, max } = getLightnessRange(theme);
      
      // Generate random HSL values
      const hue = Math.floor(Math.random() * 360);
      const saturation = 70; // keep colors rich (adjust if needed)
      const lightness = Math.floor(Math.random() * (max - min + 1)) + min;
      
      badge.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

      // Choose text color based on lightness (better contrast)
      // Light background (≥60% lightness) → black text, otherwise white
      badge.style.color = lightness >= 60 ? '#000' : '#fff';
    }
    // ---------- 3. Apply random color to a badge ----------
    function colorCard(card) 
    {
      const theme = getCurrentTheme();
      const { min, max } = getLightnessRange(theme);
      
      // Generate random HSL values
      const hue = Math.floor(Math.random() * 360);
      const saturation = 100; // keep colors rich (adjust if needed)
      const lightness = Math.floor(Math.random() * (max - min + 1)) + min;
      
      card.style.borderLeft = `5px solid hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }
// ---------- 6. Optional: update if theme changes dynamically ----------
    // If you change the theme class at runtime, you may want to recolor all badges.
    // This part is optional – uncomment if needed.
    
    function recolorAllBadges() 
    {
      document.querySelectorAll('.badge').forEach(colorBadge);
      document.querySelectorAll('.card').forEach(colorCard);
    }
    
    
    
(function() 
  {

    // ---------- 4. Color all existing badges ----------
    //document.querySelectorAll('.badge').forEach(colorBadge);
    //document.querySelectorAll('.card').forEach(colorCard);
    recolorAllBadges();
    // ---------- 5. Watch for dynamically added badges ----------
    
    const observer = new MutationObserver(mutations => 
    {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // element node
            if (node.matches?.('.badge')) colorBadge(node);
            if (node.matches?.('.card')) colorCard(node);
            node.querySelectorAll?.('.badge').forEach(colorBadge);
            node.querySelectorAll?.('.card').forEach(colorCard);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    // Example: listen for theme toggle events (customize to your implementation)
    //window.addEventListener('themeChanged', recolorAllBadges);
    
  })();
