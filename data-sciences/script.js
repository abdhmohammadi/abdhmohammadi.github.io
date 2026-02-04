
document.addEventListener('DOMContentLoaded', function () 
{
  const inner = document.querySelector('.carousel-inner');
  const slides = document.querySelectorAll('.carousel-slide');
  const indicators = document.querySelectorAll('.carousel-indicator');
  const body = document.body;
  const dropdowns = document.querySelectorAll(".dropdown-content");

  let currentSlide = 0;
  let slideInterval;
  const totalSlides = slides.length;
  
    dropdowns.forEach(dropdown => 
    {
      const parent = dropdown.parentElement;
      dropdown.style.left = "0";
      dropdown.style.right = "auto"; // Default LTR alignment
    });

  function showSlide(index) 
  {
    currentSlide = index;
   
    const offset = index * 100 * (-1);
    inner.style.transform = `translateX(${offset}%)`;

    indicators.forEach((ind, i) => 
      {
      ind.classList.toggle('active', i === index);
    });
  }

  function nextSlide() 
  {
    let next = (currentSlide + 1) % totalSlides;
    showSlide(next);
  }

  function startSlideShow() {
    slideInterval = setInterval(nextSlide, 4000);
  }

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      clearInterval(slideInterval);
      showSlide(index);
      startSlideShow();
    });
  });

  dirToggle.addEventListener('click', () => {
    body.classList.toggle('rtl');
    showSlide(currentSlide); // re-render position
  });

  showSlide(currentSlide);
  startSlideShow();

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
