// ==================== DOM CONTENT LOADED ====================
document.addEventListener('DOMContentLoaded', () => {
  
  // ==================== NAVIGATION ====================
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  
  // Mobile menu toggle
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
  
  // Close mobile menu when clicking nav links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });
  
  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
  
  // ==================== THEME TOGGLE ====================
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;
  const themeIcon = themeToggle.querySelector('i');
  
  // Check for saved theme preference
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    body.classList.add('dark-theme');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  }
  
  // Theme toggle handler
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    
    if (body.classList.contains('dark-theme')) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
      localStorage.setItem('theme', 'dark');
    } else {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
      localStorage.setItem('theme', 'light');
    }
  });
  
  // ==================== TYPING EFFECT ====================
  const typedTextElement = document.querySelector('.typed-text');
  
  if (typedTextElement) {
    const textsToType = [
      'Frontend Engginer',
      'Web Developer',
      'Software Engineer',
      'Full Stack Developer',
      'Bussiness Intelegence & Data Analyst'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 200;
    const deletingDelay = 100;
    const pauseDelay = 2000;
    
    function type() {
      const currentText = textsToType[textIndex];
      
      if (isDeleting) {
        typedTextElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typedTextElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
      }
      
      if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingDelay = pauseDelay;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textsToType.length;
        typingDelay = 500;
      } else {
        typingDelay = isDeleting ? deletingDelay : 200;
      }
      
      setTimeout(type, typingDelay);
    }
    
    // Start typing effect
    setTimeout(type, 1000);
  }
  
  // ==================== SCROLL TO TOP BUTTON ====================
  const scrollToTopBtn = document.querySelector('.scroll-to-top');
  
  if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // ==================== SMOOTH SCROLL ====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Skip if href is just "#"
      if (href === '#') return;
      
      e.preventDefault();
      
      const target = document.querySelector(href);
      if (target) {
        const offsetTop = target.offsetTop - 80;
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // ==================== INTERSECTION OBSERVER FOR ANIMATIONS ====================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, observerOptions);
  
  // Observe all elements with reveal class
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => observer.observe(el));
  
  // Observe project cards
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    observer.observe(card);
  });
  
  // ==================== CONTACT FORM ====================
  const contactForm = document.querySelector('#contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('.btn-submit');
      const formMessage = contactForm.querySelector('.form-message');
      
      // Get form data
      const formData = new FormData(contactForm);
      
      // Validate required fields
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');
      
      if (!name || !email || !message) {
        showFormMessage('error', 'Please fill in all required fields.');
        return;
      }
      
      // Show loading state
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      
      // Submit to Web3Forms
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Show success message
          showFormMessage('success', 'Thank you! Your message has been sent successfully.');
          
          // Reset form
          contactForm.reset();
          clearFormErrors();
        } else {
          throw new Error(data.message || 'Failed to send message');
        }
        
      } catch (error) {
        console.error('Error:', error);
        showFormMessage('error', 'Sorry, there was an error sending your message. Please try again or contact me directly at oloanngln03@gmail.com');
      } finally {
        // Remove loading state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    });
    
    // Form validation
    function validateForm(data) {
      let isValid = true;
      clearFormErrors();
      
      // Validate name
      if (data.name.trim().length < 2) {
        showFieldError('name', 'Nama harus minimal 2 karakter');
        isValid = false;
      }
      
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        showFieldError('email', 'Email tidak valid');
        isValid = false;
      }
      
      // Validate subject
      if (data.subject.trim().length < 3) {
        showFieldError('subject', 'Subject harus minimal 3 karakter');
        isValid = false;
      }
      
      // Validate message
      if (data.message.trim().length < 10) {
        showFieldError('message', 'Pesan harus minimal 10 karakter');
        isValid = false;
      }
      
      return isValid;
    }
    
    // Show field error
    function showFieldError(fieldId, message) {
      const field = document.querySelector(`#${fieldId}`);
      const formGroup = field.closest('.form-group');
      const errorMessage = formGroup.querySelector('.error-message');
      
      formGroup.classList.add('error');
      errorMessage.textContent = message;
    }
    
    // Clear all form errors
    function clearFormErrors() {
      const formGroups = contactForm.querySelectorAll('.form-group');
      formGroups.forEach(group => {
        group.classList.remove('error');
        const errorMessage = group.querySelector('.error-message');
        if (errorMessage) {
          errorMessage.textContent = '';
        }
      });
    }
    
    // Show form message
    function showFormMessage(type, message) {
      const formMessage = contactForm.querySelector('.form-message');
      formMessage.className = `form-message ${type}`;
      formMessage.textContent = message;
      
      // Hide message after 5 seconds
      setTimeout(() => {
        formMessage.style.display = 'none';
        setTimeout(() => {
          formMessage.className = 'form-message';
          formMessage.textContent = '';
          formMessage.style.display = 'block';
        }, 300);
      }, 5000);
    }
  }
  
  // ==================== CURRENT YEAR ====================
  const yearElement = document.querySelector('#year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // ==================== LAZY LOADING IMAGES ====================
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
  
  // ==================== PROJECT FILTER (Optional) ====================
  // If you want to add filtering functionality to portfolio section
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter projects
        const projects = document.querySelectorAll('.project-card');
        projects.forEach(project => {
          if (filter === 'all' || project.getAttribute('data-category') === filter) {
            project.style.display = 'block';
            setTimeout(() => {
              project.style.opacity = '1';
              project.style.transform = 'scale(1)';
            }, 10);
          } else {
            project.style.opacity = '0';
            project.style.transform = 'scale(0.8)';
            setTimeout(() => {
              project.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }
  
  // ==================== PRELOADER (Optional) ====================
  const preloader = document.querySelector('.preloader');
  
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 300);
      }, 500);
    });
  }
  
  // ==================== PARALLAX EFFECT (Optional) ====================
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(element => {
      const speed = element.getAttribute('data-speed') || 0.5;
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
  
  // ==================== COUNTER ANIMATION (Optional) ====================
  const counters = document.querySelectorAll('.counter');
  
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target'));
          const duration = 2000;
          const step = target / (duration / 16);
          let current = 0;
          
          const updateCounter = () => {
            current += step;
            if (current < target) {
              counter.textContent = Math.floor(current);
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          };
          
          updateCounter();
          counterObserver.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
  }
  
  // ==================== CONSOLE MESSAGE ====================
  console.log('%c🚀 Portfolio Website', 'color: #6366f1; font-size: 20px; font-weight: bold;');
  console.log('%cDesigned & Developed with ❤️', 'color: #8b5cf6; font-size: 14px;');
  console.log('%cInterested in the code? Feel free to reach out!', 'color: #06b6d4; font-size: 12px;');
  
});

// ==================== UTILITY FUNCTIONS ====================

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Add animation class when element is in viewport
function animateOnScroll() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  elements.forEach(element => {
    if (isInViewport(element)) {
      element.classList.add('animated');
    }
  });
}

// Call animateOnScroll on scroll with throttle
window.addEventListener('scroll', throttle(animateOnScroll, 100));

// ==================== PREVENT CONSOLE ERRORS ====================
window.addEventListener('error', (e) => {
  if (e.message.includes('ResizeObserver')) {
    e.stopImmediatePropagation();
  }
});
