// Main JavaScript for Nakoda Metal Industries Website

class NakodaMetalIndustries {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeNavigation();
        this.initializeScrollEffects();
        this.initializeBackToTop();
        this.initializeProductFilters();
        this.initializeTeamCards();
        this.initializeScrollIndicator();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => this.handleDOMReady());
        window.addEventListener('load', () => this.handleWindowLoad());
        window.addEventListener('scroll', this.throttle(() => this.handleScroll(), 16));
        window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));
    }

    handleDOMReady() {
        this.updateActiveNavLink();
        this.setupMobileMenu();
        this.initializeCounters();
    }

    handleWindowLoad() {
        this.hideLoadingStates();
        this.initializePerformanceOptimizations();
    }

    initializeNavigation() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.smoothScrollTo(href);
                    if (navMenu && navMenu.classList.contains('active')) {
                        this.toggleMobileMenu();
                    }
                }
            });
        });

        this.setupIntersectionObserver();
    }

    setupMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        if (!hamburger || !navMenu) return;

        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                if (navMenu.classList.contains('active')) this.toggleMobileMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) this.toggleMobileMenu();
        });
    }

    toggleMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        if (!hamburger || !navMenu) return;

        const isActive = navMenu.classList.contains('active');
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', !isActive);
        document.body.style.overflow = isActive ? 'auto' : 'hidden';
    }

    setupIntersectionObserver() {
        const sections = document.querySelectorAll('section[id]');
        if (sections.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) this.updateActiveNavLink(entry.target.getAttribute('id'));
            });
        }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });

        sections.forEach(section => observer.observe(section));
    }

    updateActiveNavLink(activeId = null) {
        document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
            const id = link.getAttribute('href').substring(1);
            if (activeId === id) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }

    handleScroll() {
        const navbar = document.getElementById('navbar');
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 100);
        this.updateBackToTop();
        this.updateScrollProgress();
    }

    updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        document.dispatchEvent(new CustomEvent('scrollProgress', {
            detail: { percent: scrollTop / docHeight, scrollTop }
        }));
    }

    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (!element) return;
        const navbar = document.getElementById('navbar');
        window.scrollTo({
            top: element.offsetTop - (navbar ? navbar.offsetHeight : 80) - 20,
            behavior: 'smooth'
        });
    }

    initializeScrollEffects() {
        const elements = document.querySelectorAll('.scroll-animate');
        if (elements.length === 0) return;

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('animated');
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        elements.forEach(el => scrollObserver.observe(el));
    }

    initializeBackToTop() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    updateBackToTop() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;
        btn.classList.toggle('show', window.scrollY > window.innerHeight * 0.8);
    }

    initializeCounters() {
        document.querySelectorAll('.stat-number').forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            if (isNaN(target)) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(counter, 0, target, 2000);
                        observer.unobserve(counter);
                    }
                });
            });
            observer.observe(counter);
        });
    }

    animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        const suffix = element.textContent.replace(/[\d\s]/g, '');

        const update = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            element.textContent = Math.floor(start + (end - start) * this.easeOutCubic(progress)).toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    }

    initializeProductFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const productCards = document.querySelectorAll('.filter-item');
        const productsContainer = document.getElementById('products-container');

        if (filterBtns.length === 0 || productCards.length === 0) return;

        productsContainer.classList.add('products-loading');
        setTimeout(() => {
            productsContainer.classList.remove('products-loading');
            if (typeof AOS !== 'undefined') AOS.refresh();
        }, 1000);

        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = btn.getAttribute('data-filter');
                if (productsContainer.classList.contains('products-filtering')) return;

                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                productsContainer.classList.add('products-filtering');

                productCards.forEach(card => {
                    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                });

                productCards.forEach((card, index) => {
                    const shouldShow = filter === 'all' || card.classList.contains(filter);
                    if (shouldShow) {
                        card.classList.remove('filter-hide');
                        card.style.display = 'block';
                        setTimeout(() => card.classList.add('filter-show'), index * 50);
                    } else {
                        card.classList.remove('filter-show');
                        card.classList.add('filter-hide');
                        setTimeout(() => {
                            if (card.classList.contains('filter-hide')) card.style.display = 'none';
                        }, 300);
                    }
                });

                setTimeout(() => {
                    productsContainer.classList.remove('products-filtering');
                    productCards.forEach(card => { card.style.transition = ''; });
                    if (typeof AOS !== 'undefined') AOS.refresh();
                }, 800);
            });
        });

        productCards.forEach(card => card.classList.add('filter-show'));
    }

    initializeTeamCards() {
        document.querySelectorAll('.team-card').forEach(card => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', 'Click to view team member details');

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.classList.toggle('flipped');
                }
            });

            card.addEventListener('click', () => {
                if (window.innerWidth <= 768) card.classList.toggle('flipped');
            });
        });
    }

    handleResize() {
        const navMenu = document.getElementById('nav-menu');
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
            this.toggleMobileMenu();
        }
        this.updateScrollProgress();
    }

    hideLoadingStates() {
        document.querySelectorAll('.loading').forEach(el => el.classList.remove('loading'));
    }

    initializePerformanceOptimizations() {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = 'images/logo.webp';
        document.head.appendChild(link);
    }

    throttle(func, limit) {
        let inThrottle;
        return function () {
            if (!inThrottle) {
                func.apply(this, arguments);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        return function () {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, arguments), wait);
        };
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    scrollToSection(sectionId) {
        this.smoothScrollTo(`#${sectionId}`);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position:fixed; top:20px; right:20px; padding:1rem 1.5rem;
            background:var(--copper-primary); color:white; border-radius:8px;
            box-shadow:var(--shadow-medium); z-index:10000;
            transform:translateX(100%); transition:transform 0.3s ease;
        `;
        document.body.appendChild(notification);
        setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 100);
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => { if (document.body.contains(notification)) document.body.removeChild(notification); }, 300);
        }, 3000);
    }

    initializeScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        const heroSection = document.querySelector('#home');
        if (!scrollIndicator || !heroSection) return;

        scrollIndicator.addEventListener('click', () => {
            if (document.querySelector('#about')) this.smoothScrollTo('#about');
        });

        window.addEventListener('scroll', this.throttle(() => {
            scrollIndicator.classList.toggle('hidden', window.scrollY > heroSection.offsetHeight * 0.7);
        }, 16));
    }
}

const nakodaMetalIndustries = new NakodaMetalIndustries();
window.NakodaMetalIndustries = nakodaMetalIndustries;