/**
 * Modern High-Performance Script for Snapsec Blog
 * Uses requestAnimationFrame throttling and passive event listeners for silky smooth scrolling.
 */
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // 1. Optimized Header Scroll Hide/Show using GPU-accelerated transforms
    var navbar = document.querySelector('nav.mediumnavigation');
    if (navbar) {
        var lastScrollTop = 0;
        var delta = 10;
        var ticking = false;

        function updateNavbar() {
            var st = window.pageYOffset || document.documentElement.scrollTop;
            
            // Avoid negative scrolling bounce (iOS)
            if (st < 0) st = 0;

            if (Math.abs(lastScrollTop - st) > delta) {
                if (st > lastScrollTop && st > 100) {
                    // Scrolling down - hide navbar smoothly
                    navbar.classList.add('nav-hidden');
                    navbar.classList.remove('nav-visible');
                } else {
                    // Scrolling up - show navbar
                    navbar.classList.remove('nav-hidden');
                    navbar.classList.add('nav-visible');
                }
                lastScrollTop = st;
            }
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        }, { passive: true });
    }

    // 2. Throttled Alertbar Toggle
    var alertbar = document.querySelector('.alertbar');
    if (alertbar) {
        var alertTicking = false;
        window.addEventListener('scroll', function() {
            if (!alertTicking) {
                window.requestAnimationFrame(function() {
                    var y = window.pageYOffset || document.documentElement.scrollTop;
                    if (y > 280) {
                        alertbar.classList.add('show');
                    } else {
                        alertbar.classList.remove('show');
                    }
                    alertTicking = false;
                });
                alertTicking = true;
            }
        }, { passive: true });
    }

    // 3. Spoiler click handler
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('spoiler')) {
            e.target.classList.remove('spoiler');
        }
    });
});
