// CAD Projekte Animations
// GSAP and UI Animations for CAD Projects Page

// Loader
setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hidden');
    }
}, 1000);

// Custom Cursor
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
    document.addEventListener('mouseenter', (e) => {
        if (e.target.closest('.btn, .project-card, .filter-tab, .load-more-btn')) {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        }
    }, true);
    
    document.addEventListener('mouseleave', (e) => {
        if (e.target.closest('.btn, .project-card, .filter-tab, .load-more-btn')) {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    }, true);
}

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

        gsap.from('.stats-bar .stat-item', {
            duration: 1,
            y: 40,
            opacity: 0,
            stagger: 0.15,
            delay: 0.5,
            ease: 'power3.out'
        });

        // Filter tabs animation
        gsap.from('.filter-tab', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            delay: 0.7,
            ease: 'power3.out'
        });

        // Project cards animation on scroll
        const projectsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gsap.from(entry.target.querySelectorAll('.project-card'), {
                        duration: 1,
                        y: 80,
                        opacity: 0,
                        stagger: 0.15,
                        ease: 'power3.out'
                    });
                    projectsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            projectsObserver.observe(projectsGrid);
        }

        // Footer animation
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gsap.from('.footer-column', {
                        duration: 1,
                        y: 50,
                        opacity: 0,
                        stagger: 0.1,
                        ease: 'power3.out'
                    });
                    footerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        const footer = document.querySelector('footer');
        if (footer) {
            footerObserver.observe(footer);
        }
    });
}

// Project card hover effect
document.addEventListener('mouseenter', (e) => {
    const card = e.target.closest('.project-card');
    if (card) {
        card.style.zIndex = '10';
    }
}, true);

document.addEventListener('mouseleave', (e) => {
    const card = e.target.closest('.project-card');
    if (card) {
        card.style.zIndex = '1';
    }
}, true);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
    }
});