// Custom Cursor Animation
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

if (cursor && follower && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        follower.style.left = e.clientX + 'px';
        follower.style.top = e.clientY + 'px';
    });

    document.addEventListener('mouseenter', (e) => {
        if (e.target.closest('.btn, .project-card, .filter-tab, .carousel-nav')) {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        }
    }, true);

    document.addEventListener('mouseleave', (e) => {
        if (e.target.closest('.btn, .project-card, .filter-tab, .carousel-nav')) {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    }, true);
}

// Navbar Scroll Effect
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

// GSAP Animations
if (window.gsap) {
    window.addEventListener('load', () => {
        gsap.from('.hero h1', {
            duration: 1.2,
            y: 80,
            opacity: 0,
            ease: 'power4.out'
        });

        gsap.from('.hero-subtitle', {
            duration: 1,
            y: 40,
            opacity: 0,
            delay: 0.2,
            ease: 'power3.out'
        });

        gsap.from('.stats-bar .stat-item', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            delay: 0.4,
            ease: 'power3.out'
        });

        gsap.from('.filter-tab', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            delay: 0.6,
            ease: 'power3.out'
        });

        gsap.from('.project-card', {
            duration: 1,
            y: 60,
            opacity: 0,
            stagger: 0.15,
            delay: 0.8,
            ease: 'power3.out'
        });
    });
}