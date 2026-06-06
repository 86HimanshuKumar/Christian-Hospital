/* ============================================
   CHS School of Nursing — Page JavaScript
   Inquiry form has been removed.
   This file handles smooth-scroll for anchor links.
   ============================================ */
'use strict';

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var header  = document.querySelector('.site-header');
        var headerH = header ? header.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - headerH - 20;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
});
