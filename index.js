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
    updateStats();
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
    
    fadeElements.forEach((el, index) => {
        el.classList.add('fade-in');
        // Staggered reveal: each element delays slightly after its peers
        el.style.setProperty('--reveal-delay', `${(index % 8) * 70}ms`);
        observer.observe(el);
    });
}

// ============================================
// Scroll Effects for Navigation Bar + Progress Bar
// ============================================
function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    const progressBar = document.getElementById('scroll-progress');
    
    window.addEventListener('scroll', () => {
        if (navbar && window.scrollY > 50) {
            navbar.classList.add('solid');
        } else if (navbar) {
            navbar.classList.remove('solid');
        }
        
        if (progressBar) {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
            progressBar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
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
                
                // Scroll to the section heading (not the section edge) so the
                // title sits right below the fixed navbar at the top of the page.
                let scrollTarget = targetElement;
                if (targetId !== 'myPage') {
                    const heading = targetElement.querySelector('h3') || targetElement.querySelector('h2');
                    if (heading) scrollTarget = heading;
                }
                
                const elementPosition = scrollTarget.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - 20;
                const targetTop = navbarHeight + 20;
                
                window.scrollTo({
                    top: Math.max(offsetPosition, 0),
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });

                // Correction pass: late-loading fonts/images can shift sections
                // mid-scroll. Keep watching until the heading sits where it
                // should (or we run out of time), nudging as needed.
                const settleStart = Date.now();
                let corrections = 0;
                const settleCheck = () => {
                    const currentTop = scrollTarget.getBoundingClientRect().top;
                    const onTarget = Math.abs(currentTop - targetTop) <= 8;
                    const elapsed = Date.now() - settleStart;
                    if (!onTarget && corrections < 4 && elapsed < 3000) {
                        corrections++;
                        window.scrollTo({
                            top: window.scrollY + (currentTop - targetTop),
                            behavior: 'instant'
                        });
                        setTimeout(settleCheck, 350);
                    } else if (!onTarget && elapsed < 3000) {
                        // On target soon enough; keep watching briefly
                        setTimeout(settleCheck, 350);
                    }
                };
                setTimeout(settleCheck, 600);

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
// Auto-update current year in footer
// ============================================
function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ============================================
// Dynamic stats — derived from page content so they never drift
// ============================================
function updateStats() {
    // Companies: count experience cards on the page
    const companiesEl = document.getElementById('stat-companies');
    if (companiesEl) {
        companiesEl.textContent = document.querySelectorAll('#experience .experience-card').length;
    }

    // Projects: count portfolio cards across all tabs
    const projectsEl = document.getElementById('stat-projects');
    if (projectsEl) {
        const count = document.querySelectorAll('#personal .portfolio-card').length;
        projectsEl.textContent = count + '+';
    }

    // Years: compute from the earliest start date in the experience section
    const yearsEl = document.getElementById('stat-years');
    if (yearsEl) {
        const dates = [...document.querySelectorAll('#experience .date')];
        let earliestYear = Infinity;
        dates.forEach(el => {
            const match = el.textContent.match(/(19|20)\d{2}/);
            if (match) {
                const year = parseInt(match[0], 10);
                if (year < earliestYear) earliestYear = year;
            }
        });
        if (earliestYear !== Infinity) {
            yearsEl.textContent = (new Date().getFullYear() - earliestYear) + '+';
        }
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