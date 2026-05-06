/* ============================================
   České Budějovice Routes - JavaScript
   ============================================ */

(function () {
  'use strict';

  /* --- 1. Theme Toggle (Light/Dark) --- */
  var themeBtn = document.getElementById('theme-toggle');
  var body = document.body;
  var savedTheme = localStorage.getItem('cb-theme');

  if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
    if (themeBtn) themeBtn.textContent = '☀ Light Theme';
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      body.classList.toggle('dark-theme');
      var isDark = body.classList.contains('dark-theme');
      localStorage.setItem('cb-theme', isDark ? 'dark' : 'light');
      themeBtn.textContent = isDark ? '☀ Light Theme' : '🌙 Dark Theme';
    });
  }

  /* --- 2. Responsive Menu (Hamburger) --- */
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close menu when clicking a link
    var links = navLinks.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    }
  }

  /* --- 3. Gallery Lightbox --- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxCaption = document.getElementById('lightbox-caption');
  var galleryItems = document.querySelectorAll('.gallery-item');
  var currentIndex = 0;

  function openLightbox(index) {
    if (!lightbox || !lightboxImg || !galleryItems.length) return;
    currentIndex = index;
    var img = galleryItems[currentIndex].querySelector('img');
    var title = galleryItems[currentIndex].getAttribute('data-title') || '';
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    if (lightboxCaption) lightboxCaption.textContent = title;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateLightbox(dir) {
    if (!galleryItems.length) return;
    currentIndex = (currentIndex + dir + galleryItems.length) % galleryItems.length;
    var img = galleryItems[currentIndex].querySelector('img');
    var title = galleryItems[currentIndex].getAttribute('data-title') || '';
    if (lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    }
    if (lightboxCaption) lightboxCaption.textContent = title;
  }

  for (var g = 0; g < galleryItems.length; g++) {
    (function (idx) {
      galleryItems[idx].addEventListener('click', function () {
        openLightbox(idx);
      });
    })(g);
  }

  var closeBtn = document.querySelector('.lightbox-close');
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  var prevBtn = document.querySelector('.lightbox-prev');
  if (prevBtn) prevBtn.addEventListener('click', function () { navigateLightbox(-1); });

  var nextBtn = document.querySelector('.lightbox-next');
  if (nextBtn) nextBtn.addEventListener('click', function () { navigateLightbox(1); });

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard
  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  /* --- 4. Contact Form Validation --- */
  var form = document.getElementById('contact-form');
  var successMsg = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var isValid = true;

      // Clear errors
      var groups = form.querySelectorAll('.form-group');
      for (var fg = 0; fg < groups.length; fg++) {
        groups[fg].classList.remove('error');
      }

      // Validate name
      var nombre = form.querySelector('#nombre');
      if (nombre && nombre.value.trim().length < 2) {
        nombre.closest('.form-group').classList.add('error');
        isValid = false;
      }

      // Validate email
      var email = form.querySelector('#email');
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email.value.trim())) {
        email.closest('.form-group').classList.add('error');
        isValid = false;
      }

      // Validate subject
      var asunto = form.querySelector('#asunto');
      if (asunto && asunto.value.trim().length < 3) {
        asunto.closest('.form-group').classList.add('error');
        isValid = false;
      }

      // Validate message
      var mensaje = form.querySelector('#mensaje');
      if (mensaje && mensaje.value.trim().length < 10) {
        mensaje.closest('.form-group').classList.add('error');
        isValid = false;
      }

      if (isValid) {
        form.reset();
        if (successMsg) {
          successMsg.style.display = 'block';
          setTimeout(function () {
            successMsg.style.display = 'none';
          }, 5000);
        }
      }
    });
  }

  /* --- 5. Scroll Animations (Intersection Observer) --- */
  var fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      for (var e = 0; e < entries.length; e++) {
        if (entries[e].isIntersecting) {
          entries[e].target.classList.add('visible');
          observer.unobserve(entries[e].target);
        }
      }
    }, { threshold: 0.15 });

    for (var f = 0; f < fadeElements.length; f++) {
      observer.observe(fadeElements[f]);
    }
  } else {
    // Fallback: show all
    for (var fb = 0; fb < fadeElements.length; fb++) {
      fadeElements[fb].classList.add('visible');
    }
  }

  /* --- 6. Smooth scroll for internal links --- */
  var smoothLinks = document.querySelectorAll('a[href^="#"]');
  for (var s = 0; s < smoothLinks.length; s++) {
    smoothLinks[s].addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId && targetId.length > 1) {
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

})();
