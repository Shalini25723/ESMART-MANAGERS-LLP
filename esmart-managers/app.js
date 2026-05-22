document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initCounters();
  initTestimonialSlider();
  initContactForm();
});

/* ==========================================
   STICKY NAVBAR & ACTIVE NAV LINK
   ========================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    // Sticky Scroll
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active Link Highlight
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================
   MOBILE MENU TOGGLE
   ========================================== */
function initMobileMenu() {
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const navLinksItems = document.querySelectorAll('.nav-links a');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      
      // Animate Hamburger Icon
      const spans = menuBtn.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close mobile menu when clicking a link
    navLinksItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const spans = menuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }
}

/* ==========================================
   SCROLL REVEAL (FRAMER-MOTION STYLE)
   ========================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-scale');
  
  const observerOptions = {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once visible, stop observing to keep animation static
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    observer.observe(el);
  });
}

/* ==========================================
   STATS COUNTER ANIMATION
   ========================================== */
function initCounters() {
  const counterElements = document.querySelectorAll('.counter-number');
  
  const animate = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const speed = 1000; // Animation speed in ms
    const increment = target / (speed / 16); // 60 FPS approx
    
    let current = 0;
    
    const updateCount = () => {
      current += increment;
      if (current < target) {
        el.innerText = Math.floor(current) + suffix;
        requestAnimationFrame(updateCount);
      } else {
        el.innerText = target + suffix;
      }
    };
    
    updateCount();
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => observer.observe(el));
}

/* ==========================================
   TESTIMONIAL SLIDER
   ========================================== */
function initTestimonialSlider() {
  const track = document.querySelector('.testimonials-track');
  const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
  const prevBtn = document.querySelector('.testimonial-nav.prev');
  const nextBtn = document.querySelector('.testimonial-nav.next');
  const dotsContainer = document.querySelector('.testimonial-dots');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoplayTimer = null;

  // Create indicator dots dynamically
  slides.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.classList.add('testimonial-dot');
    if (idx === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(idx));
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.querySelectorAll('.testimonial-dot'));

  function updateSlides() {
    // Translate the track
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Toggle active class on slides and dots
    slides.forEach((slide, idx) => {
      if (idx === currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    updateSlides();
    resetAutoplay();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlides();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlides();
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

  // Autoplay
  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, 6000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  // Initialize slides setup
  updateSlides();
  startAutoplay();

  // Swiping support for touch screens
  let touchStartX = 0;
  let touchEndX = 0;
  
  track.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
  }, { passive: true });

  function handleGesture() {
    if (touchStartX - touchEndX > 50) {
      nextSlide();
      resetAutoplay();
    }
    if (touchEndX - touchStartX > 50) {
      prevSlide();
      resetAutoplay();
    }
  }
}

/* ==========================================
   CONTACT FORM & TOAST NOTIFICATION
   ========================================== */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  const toast = document.querySelector('.toast');

  if (form && toast) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simple frontend mock validation
      const name = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();
      const phone = form.querySelector('#phone').value.trim();
      const message = form.querySelector('#message').value.trim();

      if (!name || !email || !phone || !message) {
        alert('Please fill out all fields.');
        return;
      }

      // Simulate API request and show toast
      const submitBtn = form.querySelector('.btn-submit');
      const originalText = submitBtn.innerText;
      
      submitBtn.disabled = true;
      submitBtn.innerText = 'Sending Message...';

      setTimeout(() => {
        // Success response
        submitBtn.disabled = false;
        submitBtn.innerText = originalText;
        form.reset();
        
        // Trigger custom toast notification
        showToast("Thank you! Your message has been sent successfully.");
      }, 1500);
    });
  }

  function showToast(message) {
    const toastText = toast.querySelector('.toast-text');
    if (toastText) toastText.innerText = message;
    
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
}


