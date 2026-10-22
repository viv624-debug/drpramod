(function () {
  'use strict';

  var config = window.SITE_CONFIG || {};
  var analytics = config.analytics || {};

  /* ---------- Privacy-conscious analytics ----------
     Only event names and fixed, non-identifying labels are ever passed.
     Nothing is sent unless analytics.enabled is true. */
  var ALLOWED_PARAMS = ['label', 'method', 'video_id'];
  function track(eventName, params) {
    if (!analytics.enabled) return;
    var clean = {};
    ALLOWED_PARAMS.forEach(function (k) { if (params && params[k]) clean[k] = String(params[k]).slice(0, 60); });
    try {
      if (analytics.provider === 'gtag' && typeof window.gtag === 'function') window.gtag('event', eventName, clean);
      else if (analytics.provider === 'plausible' && typeof window.plausible === 'function') window.plausible(eventName, { props: clean });
    } catch (e) { /* analytics must never break the page */ }
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('a, button');
    if (!el) return;
    var href = el.getAttribute('href') || '';
    if (el.dataset.track === 'cta') track('cta_click', { label: el.dataset.trackLabel });
    if (href.indexOf('tel:') === 0) track('contact_click', { method: 'phone' });
    else if (href.indexOf('mailto:') === 0) track('contact_click', { method: 'email' });
    else if (href.indexOf('https://wa.me') === 0) track('contact_click', { method: 'whatsapp' });
    if (el.classList.contains('video-card')) track('video_open', { video_id: el.dataset.videoId });
  });

  /* ---------- Header: shadow on scroll ---------- */
  var header = document.getElementById('site-header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  function setNav(open) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  }
  toggle.addEventListener('click', function () { setNav(toggle.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setNav(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 961px)').addEventListener('change', function (mq) { if (mq.matches) setNav(false); });

  /* ---------- Current-section highlight in nav ---------- */
  // The nav target whose top most recently passed 40% of the viewport is "current"
  // (nav order differs from page order, so compare positions, not indexes).
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('ul a'));
  var navTargets = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  var navTicking = false;
  function updateCurrent() {
    navTicking = false;
    var line = window.innerHeight * 0.4, current = 0, best = -Infinity;
    navTargets.forEach(function (t, i) {
      var top = t ? t.getBoundingClientRect().top : Infinity;
      if (top <= line && top > best) { best = top; current = i; }
    });
    navLinks.forEach(function (a, i) {
      if (i === current) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', function () {
    if (!navTicking) { navTicking = true; window.requestAnimationFrame(updateCurrent); }
  }, { passive: true });
  updateCurrent();

  /* ---------- Reveal on scroll (disabled for reduced motion via CSS) ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.05 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Mobile CTA: hide while the hero buttons or the form are on screen ---------- */
  var mobileCta = document.getElementById('mobile-cta');
  var ctaBlockers = [document.querySelector('.hero .btn-row'), document.getElementById('appointment')];
  if (mobileCta && 'IntersectionObserver' in window) {
    var visibleBlockers = new Set();
    var blockerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visibleBlockers.add(entry.target); else visibleBlockers.delete(entry.target);
      });
      mobileCta.classList.toggle('is-hidden', visibleBlockers.size > 0);
    }, { threshold: 0.05 });
    ctaBlockers.forEach(function (el) { if (el) blockerObserver.observe(el); });
  }

  /* ---------- Education videos: show only cards with an approved URL ---------- */
  var videoSection = document.getElementById('videos');
  if (videoSection) {
    var available = 0;
    videoSection.querySelectorAll('.video-card').forEach(function (card) {
      var url = (card.dataset.videoUrl || '').trim();
      if (/^https:\/\//.test(url)) { card.href = url; available++; }
      else card.hidden = true;
    });
    if (available > 0) videoSection.hidden = false;
  }

  /* ---------- Appointment form ---------- */
  var form = document.getElementById('appointment-form');
  if (!form) return;

  var endpoint = (config.formEndpoint || '').trim();
  var backendReady = /^https:\/\//.test(endpoint);
  var statusEl = document.getElementById('form-status');
  var successEl = document.getElementById('form-success');
  var submitBtn = form.querySelector('button[type="submit"]');
  var loadedAt = Date.now();
  var started = false;

  if (!backendReady) document.getElementById('form-preview-notice').hidden = false;

  form.addEventListener('focusin', function () {
    if (!started) { started = true; track('form_start', { label: 'appointment' }); }
  });

  function normaliseMobile(value) {
    var digits = value.replace(/[\s\-().]/g, '');
    digits = digits.replace(/^(\+91|0091|91(?=\d{10}$)|0(?=\d{10}$))/, '');
    return digits;
  }

  var rules = {
    name: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your full name.'; },
    mobile: function (v) {
      if (!v.trim()) return 'Please enter your mobile number.';
      return /^[6-9]\d{9}$/.test(normaliseMobile(v)) ? '' : 'Please enter a valid 10-digit Indian mobile number.';
    },
    email: function (v) {
      if (!v.trim()) return '';
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email address, or leave this field blank.';
    },
    city: function (v) { return v.trim() ? '' : 'Please enter your city.'; },
    location: function () { return form.querySelector('input[name="location"]:checked') ? '' : 'Please choose Pune or Mumbai.'; },
    consent: function () { return form.consent.checked ? '' : 'Please confirm that you agree to be contacted.'; }
  };
  var errorIds = { name: 'f-name-err', mobile: 'f-mobile-err', email: 'f-email-err', city: 'f-city-err', location: 'f-location-err', consent: 'f-consent-err' };

  function fieldFor(name) {
    return name === 'location' ? form.querySelectorAll('input[name="location"]') : [form.elements[name]];
  }

  function validateField(name) {
    var value = name === 'location' || name === 'consent' ? '' : form.elements[name].value;
    var message = rules[name](value);
    document.getElementById(errorIds[name]).textContent = message;
    Array.prototype.forEach.call(fieldFor(name), function (el) {
      if (message) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    });
    return message;
  }

  Object.keys(rules).forEach(function (name) {
    Array.prototype.forEach.call(fieldFor(name), function (el) {
      el.addEventListener(el.type === 'radio' || el.type === 'checkbox' ? 'change' : 'blur', function () {
        if (el.type === 'radio' || el.type === 'checkbox' || el.value || el.hasAttribute('aria-invalid')) validateField(name);
      });
    });
  });

  function showStatus(kind, html) {
    statusEl.className = 'form__status alert alert--' + kind;
    statusEl.innerHTML = html;
    statusEl.hidden = false;
  }

  function setBusy(busy) {
    submitBtn.disabled = busy;
    submitBtn.textContent = busy ? 'Sending…' : 'Request Appointment';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    statusEl.hidden = true;

    var firstInvalid = null;
    Object.keys(rules).forEach(function (name) {
      if (validateField(name) && !firstInvalid) firstInvalid = fieldFor(name)[0];
    });
    if (firstInvalid) {
      showStatus('error', '<strong>Please check the highlighted fields.</strong>');
      firstInvalid.focus();
      return;
    }

    // Spam protection: honeypot and minimum fill time.
    if (form.company.value) {
      showStatus('error', '<strong>Your request could not be sent.</strong> Please try again later.');
      return;
    }
    if (Date.now() - loadedAt < 3000) {
      showStatus('error', '<strong>Please review your details</strong> and press “Request Appointment” again.');
      loadedAt = 0;
      return;
    }

    if (!backendReady) {
      showStatus('info', '<strong>Your details have not been sent.</strong> Online appointment requests are not connected yet. This form is in preview while the secure enquiry service is set up.');
      statusEl.setAttribute('tabindex', '-1');
      statusEl.focus();
      return;
    }

    var data = new FormData(form);
    data.delete('company');
    data.set('mobile', normaliseMobile(data.get('mobile')));
    data.set('_subject', 'New spine consultation request');

    setBusy(true);
    fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.hidden = true;
        successEl.hidden = false;
        successEl.focus();
        form.reset();
        track('form_submit_success', { label: 'appointment' });
      })
      .catch(function () {
        showStatus('error', '<strong>We couldn’t send your request.</strong> Your details are still in the form — please check your connection and try again.');
        statusEl.setAttribute('tabindex', '-1');
        statusEl.focus();
      })
      .then(function () { setBusy(false); });
  });
})();
