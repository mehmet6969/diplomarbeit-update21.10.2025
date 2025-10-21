// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// GSAP Animations
if (window.gsap) {
    window.addEventListener('load', () => {
        // Hero animations
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

        // Filter tabs animation
        gsap.from('.filter-tab', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            delay: 0.4,
            ease: 'power3.out'
        });

        // Project cards animation
        gsap.from('.project-card', {
            duration: 1,
            y: 60,
            opacity: 0,
            stagger: 0.15,
            delay: 0.6,
            ease: 'power3.out'
        });
    });
}