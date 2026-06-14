// ==================== LOADER ====================
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('hidden');
    }, 800);
});

// ==================== NAVBAR SCROLL ====================
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) {
        if (window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    }
});

// ==================== THREE.JS HERO ====================
(function initThree() {
    if (!window.THREE) return;

    const mount = document.getElementById('canvas-container');
    if (!mount) return;

    try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        // Soft floating spheres
        const spheres = [];
        const colors = [0xCA9CE1, 0xF2BEFC, 0xEAD5E6];
        for (let i = 0; i < 5; i++) {
            const geo = new THREE.SphereGeometry(0.4 + Math.random() * 0.6, 32, 32);
            const mat = new THREE.MeshStandardMaterial({
                color: colors[i % 3],
                transparent: true,
                opacity: 0.4,
                roughness: 0.3,
                metalness: 0.1
            });
            const sphere = new THREE.Mesh(geo, mat);
            sphere.position.set(
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 4
            );
            sphere.userData = {
                speedX: (Math.random() - 0.5) * 0.003,
                speedY: (Math.random() - 0.5) * 0.003,
                initY: sphere.position.y
            };
            scene.add(sphere);
            spheres.push(sphere);
        }

        // Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const count = 200;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * 15;
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            color: 0xCA9CE1, size: 0.04, transparent: true, opacity: 0.5
        });
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(5, 5, 5);
        scene.add(dirLight);

        camera.position.z = 6;

        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        const animate = () => {
            requestAnimationFrame(animate);
            const t = Date.now() * 0.001;

            spheres.forEach((sphere, i) => {
                sphere.rotation.x += 0.003;
                sphere.rotation.y += 0.004;
                sphere.position.y = sphere.userData.initY + Math.sin(t + i) * 0.3;
                sphere.position.x += sphere.userData.speedX;
                if (Math.abs(sphere.position.x) > 5) sphere.userData.speedX *= -1;
            });

            particles.rotation.y += 0.001;
            camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.03;
            camera.position.y += (mouseY * 1 - camera.position.y) * 0.03;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = mount.clientWidth / mount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mount.clientWidth, mount.clientHeight);
        });

    } catch (e) {
        console.error('Three.js error:', e);
    }
})();

// ==================== SYNERGY NETWORK ====================
(function initSynergy() {
    const synergyContainer = document.getElementById('synergy-container');
    if (!synergyContainer) return;

    const members = [
        { name: 'Mehmet', icon: '💻', angle: 0, role: 'Leitung & Code' },
        { name: 'Tümer', icon: '🔧', angle: Math.PI / 2, role: 'CNC & CAD' },
        { name: 'Fabian', icon: '⚙️', angle: Math.PI, role: 'Produktion' },
        { name: 'Luca', icon: '🎯', angle: Math.PI * 1.5, role: 'Support' }
    ];

    const centerX = synergyContainer.offsetWidth / 2;
    const centerY = synergyContainer.offsetHeight / 2;
    const radius = Math.min(centerX, centerY) * 0.6;

    members.forEach((member, i) => {
        const memberDiv = document.createElement('div');
        memberDiv.className = 'synergy-member';
        memberDiv.innerHTML = `
            <div style="font-size: 2rem;">${member.icon}</div>
            <div class="synergy-member-name">${member.name}</div>
            <div class="synergy-member-role">${member.role}</div>
        `;
        const x = centerX + Math.cos(member.angle) * radius - 75;
        const y = centerY + Math.sin(member.angle) * radius - 75;
        memberDiv.style.left = x + 'px';
        memberDiv.style.top = y + 'px';
        synergyContainer.appendChild(memberDiv);

        const connection = document.createElement('div');
        connection.className = 'synergy-connection';
        connection.style.cssText = `position:absolute;width:${radius}px;left:${centerX}px;top:${centerY}px;transform:rotate(${member.angle}rad);transform-origin:left center;animation-delay:${i * 0.2}s;`;
        synergyContainer.appendChild(connection);

        // Animated particles along connection lines
        for (let j = 0; j < 3; j++) {
            const particle = document.createElement('div');
            particle.style.cssText = 'position:absolute;width:8px;height:8px;background:var(--wisteria);border-radius:50%;box-shadow:0 0 10px var(--wisteria);z-index:5;';
            synergyContainer.appendChild(particle);

            const animateParticle = () => {
                const t = (Date.now() / 1000 + i * 0.1 + j * 0.33) % 1;
                const px = centerX + (x + 75 - centerX) * t;
                const py = centerY + (y + 75 - centerY) * t;
                particle.style.left = px + 'px';
                particle.style.top = py + 'px';
                particle.style.opacity = 0.8 * (1 - t);
                requestAnimationFrame(animateParticle);
            };
            animateParticle();
        }
    });

    // Workflow step click interaction
    document.querySelectorAll('.workflow-step').forEach(step => {
        step.addEventListener('click', () => {
            document.querySelectorAll('.workflow-step').forEach(s => s.classList.remove('active'));
            step.classList.add('active');
        });
    });
})();

// ==================== GSAP ANIMATIONS ====================
if (typeof gsap !== 'undefined') {
    if (gsap.registerPlugin && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    window.addEventListener('load', () => {
        gsap.from('.hero h1', { duration: 0.5, y: 100, opacity: 0, ease: 'power4.out' });
        gsap.from('.hero-subtitle', { duration: 0.4, y: 50, opacity: 0, delay: 0.1 });
        gsap.from('.cta-buttons', { duration: 0.4, y: 50, opacity: 0, delay: 0.15 });

        const scrollElements = '.team-member, .expertise-card, .workflow-step, .metric-item';
        document.querySelectorAll(scrollElements).forEach(el => {
            if (typeof ScrollTrigger !== 'undefined') {
                gsap.from(el, {
                    scrollTrigger: { trigger: el, start: 'top 95%', toggleActions: 'play none none none' },
                    y: 20, opacity: 0, duration: 0.3
                });
            }
        });
    });
}