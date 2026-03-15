// Animation Controller for Nakoda Metal Industries Website

class AnimationController {
    constructor() {
        this.init();
    }

    init() {
        this.initAOS();
        this.initCustomAnimations();
        this.setupPerformanceOptimizations();
        this.initParallaxEffects();
        this.initHoverAnimations();
    }

    initAOS() {
        if (typeof AOS === 'undefined') return;
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        AOS.init({
            duration: isIOS ? 400 : 800,
            easing: 'ease-out',
            once: true,
            offset: isIOS ? 50 : 100,
            delay: 0,
            anchorPlacement: 'top-bottom',
            disable: () => isIOS && window.innerWidth < 768
        });
        if (isIOS) setTimeout(() => AOS.refresh(), 100);
    }

    initCustomAnimations() {
        this.createScrollRevealAnimations();
        this.createTypewriterEffect();
        this.createFloatingElements();
        this.initTeamCardAnimations();
        this.initProductCardAnimations();
    }

    createScrollRevealAnimations() {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(el => observer.observe(el));
    }

    createTypewriterEffect() {
        document.querySelectorAll('.typewriter').forEach(element => {
            const text = element.textContent;
            element.textContent = '';

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.typeWriter(element, text, 50);
                        observer.unobserve(element);
                    }
                });
            });
            observer.observe(element);
        });
    }

    typeWriter(element, text, speed) {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i++);
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    createFloatingElements() {
        document.querySelectorAll('.floating').forEach((element, index) => {
            element.style.animationDelay = `${index * 0.5}s`;
            element.classList.add('floating-animation');
        });
    }

    initTeamCardAnimations() {
        document.querySelectorAll('.team-card').forEach(card => {
            const cardInner = card.querySelector('.team-card-inner');
            if (!cardInner) return;

            card.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) cardInner.style.transform = 'rotateY(180deg) scale(1.02)';
            });
            card.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) cardInner.style.transform = 'rotateY(0deg) scale(1)';
            });

            let touchStartTime = 0;
            card.addEventListener('touchstart', () => { touchStartTime = Date.now(); });
            card.addEventListener('touchend', () => {
                if (Date.now() - touchStartTime < 500) card.classList.toggle('mobile-flipped');
            });
        });
    }

    initProductCardAnimations() {
        document.querySelectorAll('.product-card').forEach(card => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => entry.target.classList.add('animate-in'), Math.random() * 300);
                        observer.unobserve(entry.target);
                    }
                });
            });
            observer.observe(card);

            card.addEventListener('mouseenter', () => this.animateProductCard(card, 'enter'));
            card.addEventListener('mouseleave', () => this.animateProductCard(card, 'leave'));
        });
    }

    animateProductCard(card, action) {
        const img = card.querySelector('.product-img');
        const content = card.querySelector('.product-content');

        if (action === 'enter') {
            card.style.transform = 'translateY(-10px) scale(1.02)';
            if (img) img.style.transform = 'scale(1.1)';
            if (content) content.style.transform = 'translateY(-5px)';
        } else {
            card.style.transform = 'translateY(0) scale(1)';
            if (img) img.style.transform = 'scale(1)';
            if (content) content.style.transform = 'translateY(0)';
        }
    }

    initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax');
        if (parallaxElements.length === 0) return;

        window.addEventListener('scroll', this.throttle(() => {
            const rate = window.pageYOffset * -0.5;
            parallaxElements.forEach(el => { el.style.transform = `translateY(${rate}px)`; });
        }, 16));
    }

    initHoverAnimations() {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('mouseenter', () => { button.style.transform = 'translateY(-2px) scale(1.02)'; });
            button.addEventListener('mouseleave', () => { button.style.transform = 'translateY(0) scale(1)'; });
            button.addEventListener('mousedown', () => { button.style.transform = 'translateY(0) scale(0.98)'; });
            button.addEventListener('mouseup', () => { button.style.transform = 'translateY(-2px) scale(1.02)'; });
        });

        document.querySelectorAll('.image-placeholder, .team-photo').forEach(img => {
            img.addEventListener('mouseenter', () => { img.style.transform = 'scale(1.05)'; });
            img.addEventListener('mouseleave', () => { img.style.transform = 'scale(1)'; });
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('mouseenter', () => { link.style.transform = 'translateY(-2px)'; });
            link.addEventListener('mouseleave', () => { link.style.transform = 'translateY(0)'; });
        });
    }

    setupPerformanceOptimizations() {
        if (navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2) {
            document.querySelectorAll('.heavy-animation').forEach(el => el.classList.add('reduced-animation'));
        }

        document.addEventListener('visibilitychange', () => {
            document.body.classList.toggle('animations-paused', document.hidden);
        });

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            if (typeof AOS !== 'undefined') AOS.init({ disable: true });
            document.body.classList.add('reduced-motion');
        }
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

    refresh() {
        if (typeof AOS !== 'undefined') AOS.refresh();
    }
}

// iOS Safari flip card fix
class iOSAnimationFix {
    constructor() {
        if (/iPad|iPhone|iPod/.test(navigator.userAgent) || /^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
            this.initIOSFixes();
        }
    }

    initIOSFixes() {
        document.querySelectorAll('.team-card').forEach(card => {
            card.addEventListener('touchstart', (e) => { this._touchStart = Date.now(); }, { passive: true });
            card.addEventListener('touchend', (e) => {
                if (Date.now() - this._touchStart < 500) {
                    card.classList.toggle('mobile-flipped');
                }
            }, { passive: true });
            card.style.webkitTransform = 'translate3d(0,0,0)';
            card.style.transform = 'translate3d(0,0,0)';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new iOSAnimationFix();
    window.animationController = new AnimationController();
});

window.AnimationController = AnimationController;