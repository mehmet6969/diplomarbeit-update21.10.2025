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

    document.querySelectorAll('.team-member, .value-card, .timeline-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
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
        gsap.from('.hero-label', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            ease: 'power3.out'
        });

        gsap.from('.hero h1', {
            duration: 1.2,
            y: 50,
            opacity: 0,
            delay: 0.2,
            ease: 'power4.out'
        });

        gsap.from('.hero-subtitle', {
            duration: 1,
            y: 30,
            opacity: 0,
            delay: 0.4,
            ease: 'power3.out'
        });

        // Team Members Animation
        const teamObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gsap.from(entry.target.querySelectorAll('.team-member'), {
                        duration: 0.8,
                        y: 60,
                        opacity: 0,
                        stagger: 0.2,
                        ease: 'power3.out'
                    });
                    teamObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        const teamGrid = document.querySelector('.team-grid');
        if (teamGrid) {
            teamObserver.observe(teamGrid);
        }

        // Timeline Animation
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gsap.from(entry.target.querySelectorAll('.timeline-item'), {
                        duration: 0.8,
                        x: -60,
                        opacity: 0,
                        stagger: 0.2,
                        ease: 'power3.out'
                    });
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        const timeline = document.querySelector('.timeline');
        if (timeline) {
            timelineObserver.observe(timeline);
        }

        // Values Animation
        const valuesObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    gsap.from(entry.target.querySelectorAll('.value-card'), {
                        duration: 0.8,
                        y: 40,
                        opacity: 0,
                        stagger: 0.15,
                        ease: 'power3.out'
                    });
                    valuesObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        const valuesGrid = document.querySelector('.values-grid');
        if (valuesGrid) {
            valuesObserver.observe(valuesGrid);
        }
    });
}