const { useState, useEffect, useRef } = React;

function ThreeScene() {
    const mountRef = useRef(null);
    
    useEffect(() => {
        if (!window.THREE) return;
        
        const mount = mountRef.current;
        if (!mount) return;
        
        try {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            
            renderer.setSize(mount.clientWidth, mount.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            mount.appendChild(renderer.domElement);
            
            // Mehrere Filament-Schichten für Druck-Effekt
            const layers = [];
            const layerCount = 8;
            
            for (let i = 0; i < layerCount; i++) {
                const radius = 1.5;
                const height = i * 0.3 - 1.2;
                const segments = 64;
                const points = [];
                
                for (let j = 0; j <= segments; j++) {
                    const angle = (j / segments) * Math.PI * 2;
                    const x = Math.cos(angle) * radius;
                    const z = Math.sin(angle) * radius;
                    const y = height + Math.sin(angle * 3) * 0.2;
                    points.push(new THREE.Vector3(x, y, z));
                }
                
                const curve = new THREE.CatmullRomCurve3(points);
                curve.closed = true;
                
                // Tube für Filament-Effekt
                const tubeGeometry = new THREE.TubeGeometry(curve, 128, 0.05, 8, true);
                const hue = (i / layerCount) * 0.1 + 0.7; // Lila-Violett Farbverlauf
                const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
                
                const tubeMaterial = new THREE.MeshStandardMaterial({
                    color: color,
                    metalness: 0.7,
                    roughness: 0.3,
                    emissive: color,
                    emissiveIntensity: 0.2
                });
                
                const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
                scene.add(tube);
                layers.push(tube);
            }
            
            // Partikelsystem für Druck-Effekt
            const particlesGeometry = new THREE.BufferGeometry();
            const particlesCount = 100;
            const positions = new Float32Array(particlesCount * 3);
            
            for (let i = 0; i < particlesCount * 3; i += 3) {
                const angle = Math.random() * Math.PI * 2;
                const radius = 1 + Math.random() * 1.5;
                positions[i] = Math.cos(angle) * radius;
                positions[i + 1] = (Math.random() - 0.5) * 3;
                positions[i + 2] = Math.sin(angle) * radius;
            }
            
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const particlesMaterial = new THREE.PointsMaterial({
                color: 0x8B5CF6,
                size: 0.05,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending
            });
            const particles = new THREE.Points(particlesGeometry, particlesMaterial);
            scene.add(particles);
            
            // Beleuchtung
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(5, 5, 5);
            scene.add(directionalLight);
            
            const pointLight1 = new THREE.PointLight(0x8B5CF6, 1.5);
            pointLight1.position.set(-3, 2, 2);
            scene.add(pointLight1);
            
            const pointLight2 = new THREE.PointLight(0xA78BFA, 1.5);
            pointLight2.position.set(3, -2, -2);
            scene.add(pointLight2);
            
            camera.position.z = 5;
            camera.position.y = 0.5;
            
            let mouseX = 0;
            let mouseY = 0;
            let targetX = 0;
            let targetY = 0;
            
            const handleMouseMove = (e) => {
                mouseX = (e.clientX / window.innerWidth) * 2 - 1;
                mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
            };
            
            window.addEventListener('mousemove', handleMouseMove);
            
            let animationId;
            const animate = () => {
                animationId = requestAnimationFrame(animate);
                
                targetX += (mouseX * 0.5 - targetX) * 0.05;
                targetY += (mouseY * 0.3 - targetY) * 0.05;
                
                // Schichten rotieren unterschiedlich schnell
                layers.forEach((layer, i) => {
                    layer.rotation.y += 0.002 * (1 + i * 0.1);
                    layer.position.x = targetX * (1 - i * 0.05);
                    layer.position.y = targetY * (1 - i * 0.05);
                });
                
                particles.rotation.y += 0.001;
                
                renderer.render(scene, camera);
            };
            
            animate();
            
            const handleResize = () => {
                camera.aspect = mount.clientWidth / mount.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(mount.clientWidth, mount.clientHeight);
            };
            
            window.addEventListener('resize', handleResize);
            
            return () => {
                cancelAnimationFrame(animationId);
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('resize', handleResize);
                if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
                    mount.removeChild(renderer.domElement);
                }
                layers.forEach(layer => {
                    layer.geometry.dispose();
                    layer.material.dispose();
                });
                particlesGeometry.dispose();
                particlesMaterial.dispose();
                renderer.dispose();
            };
        } catch (error) {
            console.error('Three.js error:', error);
        }
    }, []);
    
    return React.createElement('div', { ref: mountRef, style: { width: '100%', height: '100%' } });
}

function App() {
    const [stats, setStats] = useState([
        { number: 0, label: 'Drucker', target: 10, suffix: '+' },
        { number: 0, label: 'Materialien', target: 25, suffix: '+' },
        { number: 0, label: 'Drucke/Jahr', target: 300, suffix: '+' },
        { number: 0, label: 'Präzision', target: 0.1, suffix: 'mm' }
    ]);

    const statsRef = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !hasAnimated.current) {
                        hasAnimated.current = true;
                        
                        const duration = 2500;
                        const frames = 60;
                        const frameDuration = duration / frames;
                        let frame = 0;

                        const timer = setInterval(() => {
                            frame++;
                            const progress = frame / frames;
                            const easeProgress = 1 - Math.pow(1 - progress, 3);
                            
                            setStats(prev => prev.map(stat => ({
                                ...stat,
                                number: stat.target * easeProgress
                            })));

                            if (frame >= frames) {
                                clearInterval(timer);
                                setStats(prev => prev.map(stat => ({
                                    ...stat,
                                    number: stat.target
                                })));
                            }
                        }, frameDuration);
                    }
                });
            },
            { threshold: 0.3 }
        );

        const current = statsRef.current;
        if (current) {
            observer.observe(current);
        }

        return () => {
            if (current) {
                observer.unobserve(current);
            }
        };
    }, []);

    const technologies = [
        {
            id: 'fdm',
            icon: '🎯',
            title: 'FDM Technologie',
            description: 'Fused Deposition Modeling für robuste Prototypen und Funktionsteile mit vielseitigen Materialien.',
            features: ['PLA, PETG, ABS, TPU', 'Große Bauräume bis 400x400mm', 'Multi-Material Druck', 'Wasserlösliche Stützen']
        },
        {
            id: 'sla',
            icon: '💎',
            title: 'SLA/Resin Druck',
            description: 'Höchste Detailgenauigkeit und glatte Oberflächen für anspruchsvolle Anwendungen.',
            features: ['0.025mm Schichtauflösung', 'Transparente & flexible Harze', 'Biokompatible Materialien', 'Nachbearbeitung & Aushärtung']
        },
        {
            id: 'design',
            icon: '🎨',
            title: 'CAD & Design',
            description: 'Professionelle 3D-Modellierung und Optimierung für perfekte Druckergebnisse.',
            features: ['Fusion 360 & SolidWorks', 'Topology Optimization', 'Slicing & Parameter-Tuning', 'Support-Generierung']
        }
    ];

    return (
        <React.Fragment>
            <section className="hero">
                <div id="canvas-container">
                    <ThreeScene />
                </div>
                <div className="hero-content">
                    <h1>3D-Druck</h1>
                    <p className="hero-subtitle">
                        Additive Fertigung für Prototypen und Endprodukte mit modernster Technologie
                    </p>
                    <div className="cta-buttons">
                        <a href="#tech" className="btn btn-primary">Mehr entdecken</a>
                        <a href="#" className="btn btn-secondary">Projekte ansehen</a>
                    </div>
                </div>
            </section>

            <section id="tech" className="tech-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">Unsere Expertise</div>
                        <h2 className="section-title">3D-Druck Technologien</h2>
                        <p className="section-description">
                            Modernste additive Fertigungsverfahren für vielfältigste Anwendungen
                        </p>
                    </div>
                    
                    <div className="tech-grid">
                        {technologies.map(tech => (
                            <div key={tech.id} className="tech-card">
                                <div className="tech-icon">{tech.icon}</div>
                                <h3>{tech.title}</h3>
                                <p>{tech.description}</p>
                                <ul>
                                    {tech.features.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    ))}
                                </ul>
                                <a href="#" className="tech-link">
                                    Mehr erfahren →
                                </a>
                            </div>
                        ))}
                    </div>

                    <div className="stats-grid" ref={statsRef}>
                        {stats.map((stat, i) => (
                            <div key={i} className="stat-card">
                                <div className="stat-content">
                                    <div className="stat-number">
                                        {stat.suffix === 'mm' ? `±${stat.number.toFixed(1)}` : Math.floor(stat.number)}{stat.suffix}
                                    </div>
                                    <div className="stat-label">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="container">
                    <div className="feature-showcase">
                        <div className="feature-content">
                            <h3>Von der Idee zum fertigen Objekt</h3>
                            <p>
                                Unsere 3D-Drucker ermöglichen die schnelle Umsetzung komplexer Designs. 
                                Mit verschiedenen Druckverfahren und Materialien fertigen wir Prototypen, 
                                Kleinserien und individuelle Einzelstücke – von der Konzeption bis zur Nachbearbeitung.
                            </p>
                            <a href="#" className="btn btn-primary">Unsere Projekte</a>
                        </div>
                        <div className="feature-visual">
                            <div className="floating-shape" style={{ width: '280px', height: '280px', top: '10%', left: '5%' }}></div>
                            <div className="floating-shape" style={{ width: '220px', height: '220px', bottom: '15%', right: '8%', animationDelay: '3s' }}></div>
                            <div className="floating-shape" style={{ width: '160px', height: '160px', top: '45%', left: '45%', animationDelay: '6s' }}></div>
                        </div>
                    </div>
                </div>
            </section>

            <footer>
                <div className="footer-content">
                    <div className="footer-column">
                        <h4>IEM 3D-Druck</h4>
                        <ul>
                            <li><a href="#">Über uns</a></li>
                            <li><a href="#">Team</a></li>
                            <li><a href="#">Karriere</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Services</h4>
                        <ul>
                            <li><a href="#">FDM Druck</a></li>
                            <li><a href="#">SLA/Resin Druck</a></li>
                            <li><a href="#">CAD Design</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Materialien</h4>
                        <ul>
                            <li><a href="#">Kunststoffe</a></li>
                            <li><a href="#">Flexible Materialien</a></li>
                            <li><a href="#">Harze</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Kontakt</h4>
                        <ul>
                            <li>mehmet.saygin@student.htldornbirn.com</li>
                            <li>+43 999 99999</li>
                            <li>Höchsterstraße 73, 6850 Dornbirn</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2025 IEM HTL Dornbirn. Additive Manufacturing.</p>
                </div>
            </footer>
        </React.Fragment>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));

// Loader
setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('hidden');
    }
}, 1000);

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

// Smooth Scroll
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

// Tech Card Hover
const techCards = document.querySelectorAll('.tech-card');
techCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});