// Custom Cursor (optional, da nicht im Original-Code)
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

if (cursor && follower && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        follower.style.left = e.clientX + 'px';
        follower.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('.btn, .project-card, .filter-tab').forEach(el => {
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

// GSAP Animations
if (window.gsap) {
    window.addEventListener('load', () => {
        gsap.from('.hero h1', {
            duration: 1.2,
            y: 100,
            opacity: 0,
            ease: 'power4.out'
        });

        gsap.from('.hero-subtitle', {
            duration: 1,
            y: 50,
            opacity: 0,
            delay: 0.3,
            ease: 'power3.out'
        });

        gsap.from('.stats-bar', {
            duration: 1,
            y: 50,
            opacity: 0,
            delay: 0.5,
            ease: 'power3.out'
        });

        gsap.from('.filter-pill', {
            duration: 0.6,
            scale: 0,
            opacity: 0,
            stagger: 0.05,
            delay: 0.8,
            ease: 'back.out(1.7)'
        });
    });
}
