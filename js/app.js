/* ============================================================
   app.js — Interacciones generales de la página
   Proyecto 6 · Sistemas ERP con Odoo · EduIA
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. NAVBAR: sombra al hacer scroll + enlace activo
     ---------------------------------------------------------- */
  var nav = document.getElementById('mainNav');
  var progress = document.getElementById('readProgress');
  var toTop = document.getElementById('toTop');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;

    if (nav) nav.classList.toggle('scrolled', y > 20);
    if (toTop) toTop.classList.toggle('show', y > 520);

    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var pct = h > 0 ? (y / h) * 100 : 0;
      progress.style.width = Math.min(100, Math.max(0, pct)) + '%';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------
     2. APARICIÓN SUAVE DE LAS SECCIONES
     ---------------------------------------------------------- */
  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          // pequeño retraso escalonado para elegancia
          setTimeout(function () {
            entry.target.classList.add('in');
          }, Math.min(i * 70, 280));
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ----------------------------------------------------------
     3. NAVEGACIÓN: marcar sección activa
     ---------------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.navbar .nav-link'));
  var sections = navLinks
    .map(function (a) {
      var id = a.getAttribute('href');
      if (!id || id.charAt(0) !== '#') return null;
      var el = document.querySelector(id);
      return el ? { link: a, el: el } : null;
    })
    .filter(Boolean);

  function markActive() {
    var pos = window.scrollY + 130;
    var current = null;

    sections.forEach(function (s) {
      if (s.el.offsetTop <= pos) current = s;
    });

    navLinks.forEach(function (a) { a.classList.remove('active'); });
    if (current) current.link.classList.add('active');
  }

  window.addEventListener('scroll', markActive, { passive: true });
  markActive();

  /* ----------------------------------------------------------
     4. CERRAR EL MENÚ MÓVIL AL ELEGIR UN ENLACE
     ---------------------------------------------------------- */
  var collapseEl = document.getElementById('navMenu');

  document.querySelectorAll('#navMenu .nav-link, #navMenu .btn-corp').forEach(function (a) {
    a.addEventListener('click', function () {
      if (collapseEl && collapseEl.classList.contains('show') && window.bootstrap) {
        var inst = window.bootstrap.Collapse.getOrCreateInstance(collapseEl);
        inst.hide();
      }
    });
  });

  /* ----------------------------------------------------------
     5. BOTÓN VOLVER ARRIBA
     ---------------------------------------------------------- */
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------
     6. CONTADORES ANIMADOS (hero stats)
     ---------------------------------------------------------- */
  function animateCount(el, target, suffix) {
    var start = 0;
    var dur = 1200;
    var t0 = performance.now();

    function frame(now) {
      var p = Math.min(1, (now - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(start + (target - start) * eased);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var statBlocks = document.querySelectorAll('.hero-stats .st b');
  if (statBlocks.length && 'IntersectionObserver' in window) {
    var statIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var txt = e.target.textContent.trim();
        var num = parseInt(txt.replace(/\D/g, ''), 10);
        var suffix = txt.replace(/[0-9]/g, '');
        if (!isNaN(num)) animateCount(e.target, num, suffix);
        statIO.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    statBlocks.forEach(function (b) { statIO.observe(b); });
  }

  /* ----------------------------------------------------------
     7. AÑO DINÁMICO EN EL PIE DE PÁGINA
     ---------------------------------------------------------- */
  document.querySelectorAll('.js-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
