/* ============================================
   Primer Chicago — Site JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ---- Mobile Menu Toggle ----
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      if (navOverlay) navOverlay.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', function () {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 768) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // ---- FAQ Accordion ----
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var wasActive = item.classList.contains('active');

      // Close all FAQ items in the same list
      var parent = item.closest('.faq-list');
      if (parent) {
        parent.querySelectorAll('.faq-item').forEach(function (fi) {
          fi.classList.remove('active');
        });
      }

      // Toggle the clicked one
      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });

  // ---- Scroll Animations ----
  var fadeEls = document.querySelectorAll('.fade-in');

  if (fadeEls.length > 0 && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ---- Contact Form Handler (Formspree) ----
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var formData = new FormData(contactForm);
      var data = {};
      formData.forEach(function (value, key) {
        data[key] = value;
      });

      // Validate
      if (!data.name || !data.email || !data.message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
      }

      if (!isValidEmail(data.email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
      }

      // Submit to Formspree
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          showFormMessage('Thank you! We\'ll get back to you within 24 hours.', 'success');
          contactForm.reset();
        } else {
          showFormMessage('Something went wrong. Please call us at (773) 555-0198.', 'error');
        }
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }).catch(function () {
        showFormMessage('Connection error. Please call us at (773) 555-0198.', 'error');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFormMessage(msg, type) {
    var existing = document.querySelector('.form-message');
    if (existing) existing.remove();

    var div = document.createElement('div');
    div.className = 'form-message';
    div.textContent = msg;
    div.style.cssText = 'padding:14px 20px;border-radius:6px;margin-top:16px;font-weight:500;font-size:0.95rem;';

    if (type === 'success') {
      div.style.background = '#E8F5E9';
      div.style.color = '#2E7D32';
      div.style.border = '1px solid #A5D6A7';
    } else {
      div.style.background = '#FFEBEE';
      div.style.color = '#C62828';
      div.style.border = '1px solid #EF9A9A';
    }

    contactForm.appendChild(div);

    setTimeout(function () {
      div.remove();
    }, 5000);
  }

  // ---- Sticky Nav Shadow ----
  var nav = document.querySelector('.site-nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        nav.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
      } else {
        nav.style.boxShadow = 'none';
      }
    });
  }

});
