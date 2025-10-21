// Three.js Scene
const container = document.getElementById('canvas-container');
if (container && window.THREE) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Create network of connected nodes
    const nodeGroup = new THREE.Group();
    const nodes = [];
    const connections = [];
    
    // Create nodes
    for (let i = 0; i < 4; i++) {
        const geometry = new THREE.SphereGeometry(0.3, 32, 32);
        const material = new THREE.MeshStandardMaterial({ 
            color: i === 0 ? 0xCA9CE1 : 0xF2BEFC,
            metalness: 0.3,
            roughness: 0.7
        });
        const node = new THREE.Mesh(geometry, material);
        
        const angle = (i / 4) * Math.PI * 2;
        const radius = 2;
        node.position.x = Math.cos(angle) * radius;
        node.position.y = Math.sin(angle) * radius;
        node.position.z = (Math.random() - 0.5) * 2;
        
        nodes.push(node);
        nodeGroup.add(node);
    }
    
    // Create connections
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const points = [];
            points.push(nodes[i].position);
            points.push(nodes[j].position);
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({ 
                color: 0xCA9CE1,
                opacity: 0.3,
                transparent: true
            });
            const line = new THREE.Line(geometry, material);
            connections.push(line);
            nodeGroup.add(line);
        }
    }

    scene.add(nodeGroup);

    // Add particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const positions = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 15;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xF2BEFC,
        size: 0.05,
        transparent: true,
        opacity: 0.6
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);
    
    const pointLight = new THREE.PointLight(0xCA9CE1, 1);
    pointLight.position.set(-4, 3, 4);
    scene.add(pointLight);

    camera.position.set(0, 0, 8);

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
        requestAnimationFrame(animate);
        
        nodeGroup.rotation.y += 0.005;
        nodeGroup.rotation.x = mouseY * 0.3;
        
        particles.rotation.y += 0.001;
        
        // Animate nodes
        nodes.forEach((node, i) => {
            node.scale.x = node.scale.y = node.scale.z = 
                1 + Math.sin(Date.now() * 0.001 + i) * 0.1;
        });
        
        // Update connections
        connections.forEach((line, index) => {
            const i = Math.floor(index / (nodes.length - 1));
            const j = index % (nodes.length - 1) + i + 1;
            
            if (i < nodes.length && j < nodes.length) {
                const points = [];
                points.push(nodes[i].position);
                points.push(nodes[j].position);
                line.geometry.setFromPoints(points);
            }
        });
        
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });
}

// Stats Counter Animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.querySelectorAll('.stat-number').forEach(stat => {
                const target = parseInt(stat.dataset.target);
                const suffix = stat.dataset.suffix;
                let current = 0;
                const increment = target / 60;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target + suffix;
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current) + suffix;
                    }
                }, 30);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const statsGrid = document.getElementById('stats-grid');
if (statsGrid) statsObserver.observe(statsGrid);

// GSAP Animations
if (window.gsap) {
    window.addEventListener('load', () => {
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
        
        gsap.from('.team-member', { 
            duration: 1, 
            y: 50, 
            opacity: 0, 
            stagger: 0.2, 
            delay: 0.5,
            scrollTrigger: '.team-section'
        });
        
        gsap.from('.timeline-item', { 
            duration: 1, 
            opacity: 0, 
            x: (index) => index % 2 === 0 ? -100 : 100,
            stagger: 0.3,
            scrollTrigger: '.timeline-section'
        });
    });
}