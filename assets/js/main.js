(function () {
  "use strict";

  // Mobile nav toggle
  var navToggle = document.getElementById('navToggle');
  var header = document.getElementById('header');
  if (navToggle && header) {
    navToggle.addEventListener('click', function () {
      header.classList.toggle('nav-open');
    });
    document.querySelectorAll('.nav-menu a').forEach(function (link) {
      link.addEventListener('click', function () {
        header.classList.remove('nav-open');
      });
    });
  }

  // Read more / read less panels
  document.querySelectorAll('.readmore-toggle').forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute('data-target'));
    if (!panel) return;
    btn.addEventListener('click', function () {
      var open = panel.classList.toggle('is-open');
      btn.classList.toggle('is-open', open);
    });
  });

  // Accordion
  document.querySelectorAll('.accordion-item').forEach(function (item) {
    var trigger = item.querySelector('.accordion-trigger');
    trigger.addEventListener('click', function () {
      var alreadyOpen = item.classList.contains('is-open');
      item.parentElement.querySelectorAll('.accordion-item').forEach(function (i) {
        i.classList.remove('is-open');
      });
      if (!alreadyOpen) item.classList.add('is-open');
    });
  });

  // Active nav link on scroll
  var sections = Array.from(document.querySelectorAll('main section[id], #hero'));
  var navLinks = document.querySelectorAll('.nav-menu a');
  function setActive() {
    var scrollPos = window.scrollY + 140;
    var current = sections[0];
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) current = sec;
    });
    navLinks.forEach(function (link) {
      var li = link.parentElement;
      li.classList.toggle('active', link.getAttribute('href') === '#' + current.id);
    });
  }
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  // Back to top
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('is-visible', window.scrollY > 500);
    }, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Contact form — submits to the /api/contact Vercel serverless function (Resend)
  var form = document.getElementById('contactForm');
  if (form) {
    var btn = form.querySelector('button[type="submit"]');
    var status = document.getElementById('formStatus');
    var btnLabel = btn.textContent;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        subject: form.subject.value.trim(),
        message: form.message.value.trim(),
        company: form.company.value.trim() // honeypot
      };

      btn.disabled = true;
      btn.textContent = 'Sending…';
      status.textContent = '';
      status.className = 'form-status';

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          return res.json().then(function (body) { return { ok: res.ok, body: body }; });
        })
        .then(function (result) {
          if (result.ok) {
            form.reset();
            status.textContent = 'Message sent — we\'ll get back to you soon.';
            status.className = 'form-status is-success';
          } else {
            status.textContent = (result.body && result.body.error) || 'Something went wrong. Please try again.';
            status.className = 'form-status is-error';
          }
        })
        .catch(function () {
          status.textContent = 'Network error — please try again.';
          status.className = 'form-status is-error';
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = btnLabel;
        });
    });
  }
})();
