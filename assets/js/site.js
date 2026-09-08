// Mobile navigation toggle
(function () {
  var btn = document.querySelector('.menu-btn');
  var links = document.querySelector('.navlinks');
  if (!btn || !links) return;

  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.addEventListener('click', function (e) {
    if (!links.contains(e.target) && !btn.contains(e.target)) {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

// Before/after reveal: mirror the range input onto the --pos custom property,
// which drives both the clip on the old screenshot and the divider position.
(function () {
  var reveals = document.querySelectorAll('[data-reveal]');
  for (var i = 0; i < reveals.length; i++) {
    (function (el) {
      var range = el.querySelector('.reveal-range');
      if (!range) return;
      var sync = function () {
        el.style.setProperty('--pos', range.value + '%');
      };
      range.addEventListener('input', sync);
      sync();
    })(reveals[i]);
  }
})();

// Contact form: submit directly via FormSubmit AJAX, show inline success/error.
(function () {
  var form = document.querySelector('form[data-contact]');
  if (!form) return;

  var btn = form.querySelector('[type=submit]');
  var note = form.querySelector('.form-note');

  function val(name) {
    var el = form.elements[name];
    return el ? el.value.trim() : '';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) return;

    var org = val('organisation');
    var data = new FormData(form);
    data.set('_subject', 'Website enquiry' + (org ? ' from ' + org : '') + ' – Renovatio IT');

    btn.disabled = true;
    btn.textContent = 'Sending…';

    fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' }
    })
    .then(function (res) { return res.json(); })
    .then(function (json) {
      if (json.success === 'true' || json.success === true) {
        form.innerHTML = '<p style="padding:24px 0;font-size:1.1rem">Thank you — we\'ll be in touch within two working days.</p>';
      } else {
        throw new Error();
      }
    })
    .catch(function () {
      btn.disabled = false;
      btn.textContent = 'Send message';
      if (note) note.textContent = 'Something went wrong. Please email us directly at contact@renovatioit.com.';
    });
  });
})();

// Mark the current page in the nav
(function () {
  var here = location.pathname.split('/').pop() || 'index.html';
  var links = document.querySelectorAll('.navlinks a[href]');
  for (var i = 0; i < links.length; i++) {
    if (links[i].getAttribute('href') === here) {
      links[i].classList.add('is-active');
      links[i].setAttribute('aria-current', 'page');
    }
  }
})();
