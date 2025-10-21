// Loader
setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hidden');
    }
}, 1000);

/* Custom Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

if (cursor && follower && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        follower.style.left = e.clientX + 'px';
        follower.style.top = e.clientY + 'px';
    });

    // Cursor interactions
    document.querySelectorAll('.btn, .tech-card, .tech-link').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
} */

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// GSAP Animations
if (window.gsap) {
    window.addEventListener('load', () => {
        // Hero animations
        gsap.from('.hero h1', {
            duration: 1.5,
            y: 100,
            opacity: 0,
            ease: 'power4.out'
        });

        gsap.from('.hero-subtitle', {
            duration: 1.2,
            y: 50,
            opacity: 0,
            delay: 0.3,
            ease: 'power3.out'
        });

        gsap.from('.cta-buttons', {
            duration: 1.2,
            y: 50,
            opacity: 0,
            delay: 0.5,
            ease: 'power3.out'
        });

        // Tech cards animation on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gsap.from(entry.target.querySelectorAll('.tech-card'), {
                        duration: 1,
                        y: 80,
                        opacity: 0,
                        stagger: 0.15,
                        ease: 'power3.out'
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        const techGrid = document.querySelector('.tech-grid');
        if (techGrid) {
            observer.observe(techGrid);
        }

        // Feature showcase animation
        const featureObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gsap.from('.feature-content', {
                        duration: 1,
                        x: -80,
                        opacity: 0,
                        ease: 'power3.out'
                    });
                    gsap.from('.feature-visual', {
                        duration: 1,
                        x: 80,
                        opacity: 0,
                        ease: 'power3.out'
                    });
                    featureObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const featureShowcase = document.querySelector('.feature-showcase');
        if (featureShowcase) {
            featureObserver.observe(featureShowcase);
        }
    });
}

// Tech card hover effect
const techCards = document.querySelectorAll('.tech-card');
techCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});