/**
 * Qingbo Jiang Portfolio - Main JavaScript
 * Handles animations, interactions, and dynamic functionality
 */

// ============================================
// DOM Content Loaded Handler
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeScrollEffects();
    initializeSmoothScroll();
    initializeTabEnhancements();
    updateCurrentYear();
    initializeArrowBounce();
    initializeMobileMenu();
    initializeScrollSpy();
});

// ============================================
// Animation System using Intersection Observer
// ============================================
function initializeAnimations() {
    const fadeElements = document.querySelectorAll('.portfolio-card, .skill-category, .experience-card, .about-list li');
    
    // Respect users who prefer reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        fadeElements.forEach(el => el.classList.add('visible'));
        return;
    }
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// ============================================
// Scroll Effects for Navigation Bar
// ============================================
function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('solid');
        } else {
            navbar.classList.remove('solid');
        }
    }, { passive: true });
}

// ============================================
// Smooth Scroll with Offset
// ============================================
function initializeSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - 20;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });

                // Close mobile menu after clicking a nav link
                const navbarCollapse = document.getElementById('myNavbar');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const toggleButton = document.querySelector('.navbar-toggler');
                    if (toggleButton) {
                        toggleButton.click();
                    }
                }
            }
        });
    });
}

// ============================================
// Tab Enhancement - Add active state animation
// ============================================
function initializeTabEnhancements() {
    const tabLinks = document.querySelectorAll('[data-bs-toggle="tab"]');
    
    tabLinks.forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(e) {
            const targetContent = document.querySelector(e.target.getAttribute('data-bs-target'));
            
            // Add fade-in animation to the newly shown content
            const cards = targetContent.querySelectorAll('.portfolio-card, .skill-category, .experience-card');
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });
    });
}

// ============================================
// Mobile Menu Enhancement
// ============================================
function initializeMobileMenu() {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (!navbarCollapse) return;
    
    // Lock body scroll when menu is open, unlock when closed
    // NOTE: Do NOT use { once: true } — this must work every time
    navbarCollapse.addEventListener('show.bs.collapse', function() {
        document.body.style.overflow = 'hidden';
    });
    
    navbarCollapse.addEventListener('hidden.bs.collapse', function() {
        document.body.style.overflow = '';
    });
}

// ============================================
// Scroll Spy for active nav highlighting
// ============================================
function initializeScrollSpy() {
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    // Only track sections that have nav links
    const trackedIds = Array.from(navLinks).map(link => link.getAttribute('href').substring(1));
    const trackedSections = Array.from(sections).filter(section => trackedIds.includes(section.id));
    
    if (trackedSections.length === 0) return;
    
    const observerOptions = {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    trackedSections.forEach(section => observer.observe(section));
}

// ============================================
// Video Popup Functionality
// ============================================
function onVideoClick(videoSrc) {
    const popup = document.getElementById('video_pop');
    const existingVideo = popup.querySelector('video');
    
    if (existingVideo) {
        existingVideo.pause();
        popup.style.display = 'none';
        return;
    }
    
    popup.innerHTML = `
        <video controls autoplay>
            <source src="${videoSrc}" type="video/webm">
            Your browser does not support the video tag.
        </video>
    `;
    popup.style.display = 'flex';
    // Lock body scroll when video is open
    document.body.style.overflow = 'hidden';
}

// Close popup when clicking outside video
const videoPop = document.getElementById('video_pop');
if (videoPop) {
    videoPop.addEventListener('click', function(e) {
        if (e.target === this) {
            const video = this.querySelector('video');
            if (video) {
                video.pause();
            }
            this.innerHTML = '';
            this.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}

// Global function for onclick handlers
window.onPopClick = function() {
    const popup = document.getElementById('video_pop');
    const video = popup.querySelector('video');
    if (video) {
        video.pause();
    }
    popup.innerHTML = '';
    popup.style.display = 'none';
    document.body.style.overflow = '';
};

// ============================================
// Add keyboard navigation for accessibility
// ============================================
document.addEventListener('keydown', function(e) {
    // Close video popup with Escape key
    if (e.key === 'Escape') {
        const popup = document.getElementById('video_pop');
        if (popup.style.display !== 'none') {
            const video = popup.querySelector('video');
            if (video) {
                video.pause();
            }
            popup.innerHTML = '';
            popup.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
});

// ============================================
// Auto-update current year in footer
// ============================================
function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ============================================
// Restore bounce animation for scroll-down arrow
// ============================================
function initializeArrowBounce() {
    const arrow = document.getElementById('bottm-center');
    if (arrow) {
        // Completely remove any inline transform that might interfere with CSS animation
        delete arrow.style.transform;
    }
}

// ============================================
// Console Easter Egg - Portfolio Developer Message
// ============================================
console.log('%c Hello! 👋 ', 'background: #2563eb; color: white; font-size: 20px; padding: 10px; border-radius: 5px;');
console.log('%c Looking for Qingbo Jiang? ', 'font-size: 16px;');
console.log('%c Check out the portfolio! ', 'font-size: 16px; color: #10b981;');
console.log('%c ', 'font-size: 10px;');
console.log('Built with ❤️ using modern web technologies.');