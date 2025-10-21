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
            
            // Torus Knot - komplexe Geometrie
            const geometry = new THREE.TorusKnotGeometry(1.5, 0.5, 100, 16);
            const material = new THREE.MeshStandardMaterial({
                color: 0x04E824,
                wireframe: true,
                transparent: true,
                opacity: 0.6
            });
            const torusKnot = new THREE.Mesh(geometry, material);
            scene.add(torusKnot);
            
            // Sphere with vertices
            const sphereGeom = new THREE.SphereGeometry(2.5, 32, 32);
            const sphereMat = new THREE.PointsMaterial({
                color: 0x18FF6D,
                size: 0.03,
                transparent: true,
                opacity: 0.4
            });
            const sphere = new THREE.Points(sphereGeom, sphereMat);
            scene.add(sphere);
            
            // Particles
            const particlesCount = 100;
            const particlesGeometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particlesCount * 3);
            
            for (let i = 0; i < particlesCount * 3; i++) {
                positions[i] = (Math.random() - 0.5) * 15;
            }
            
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const particlesMaterial = new THREE.PointsMaterial({
                color: 0x138A36,
                size: 0.05,
                transparent: true,
                opacity: 0.5
            });
            const particles = new THREE.Points(particlesGeometry, particlesMaterial);
            scene.add(particles);
            
            // Lights
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            
            const pointLight = new THREE.PointLight(0x04E824, 2);
            pointLight.position.set(5, 5, 5);
            scene.add(pointLight);
            
            camera.position.z = 8;
            
            let mouseX = 0;
            let mouseY = 0;
            
            const handleMouseMove = (e) => {
                mouseX = (e.clientX / window.innerWidth) * 2 - 1;
                mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
            };
            
            window.addEventListener('mousemove', handleMouseMove);
            
            let animationId;
            const animate = () => {
                animationId = requestAnimationFrame(animate);
                
                torusKnot.rotation.x += 0.005;
                torusKnot.rotation.y += 0.008;
                
                sphere.rotation.y += 0.001;
                
                particles.rotation.y += 0.002;
                particles.rotation.x += 0.001;
                
                camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
                camera.position.y += (mouseY * 2 - camera.position.y) * 0.05;
                camera.lookAt(scene.position);
                
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
        { number: 0, label: 'AR/VR Projekte', target: 15, suffix: '+' },
        { number: 0, label: 'Scan-Genauigkeit', target: 0.05, suffix: 'mm' },
        { number: 0, label: 'FEA Simulationen', target: 200, suffix: '+' },
        { number: 0, label: 'Digital Twins', target: 8, suffix: '' }
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
            id: 'vuforia',
            icon: '📱',
            title: 'Vuforia Studio & AR',
            description: 'Professionelle Augmented Reality Entwicklung mit Vuforia Studio. Erstellen Sie immersive AR-Erlebnisse für industrielle Anwendungen, Wartung und Training.',
            features: ['Model Targets & Image Recognition', 'Spatial Anchors & Tracking', 'Step-by-Step AR Instructions', '3D Animations & Interaktionen', 'Enterprise Cloud Integration']
        },
        {
            id: 'facescan',
            icon: '👤',
            title: '3D Face Scanning',
            description: 'Hochpräzise 3D-Gesichtsscan-Technologie mit photogrammetrischen Methoden. Von der Erfassung bis zur fertigen 3D-Skulptur.',
            features: ['Photogrammetrie & Structure from Motion', '0.1mm Scan-Genauigkeit', 'Automatische Mesh-Verarbeitung', 'Multi-Kamera Erfassung', '3D-Druck & CNC Export']
        },
        {
            id: 'fea',
            icon: '🔬',
            title: 'FEA Simulation',
            description: 'Finite Elemente Analyse für strukturmechanische, thermische und strömungstechnische Probleme. Optimieren Sie Ihre Designs vor der Produktion.',
            features: ['ANSYS & COMSOL Integration', 'Multiphysik-Simulationen', 'Nichtlineare Materialmodelle', 'Topologie-Optimierung', 'HPC Cluster Computing']
        }
    ];

    return (
        <React.Fragment>
            <section className="hero">
                <div id="canvas-container">
                    <ThreeScene />
                </div>
                <div className="hero-content">
                    <h1>CAE</h1>
                    <p className="hero-subtitle">
                        Computer Aided Engineering
                    </p>
                    <div className="cta-buttons">
                        <a href="#tech" className="btn btn-primary">Mehr entdecken</a>
                        <a href="/cae_projekte" className="btn btn-secondary">Projekte ansehen</a>
                    </div>
                </div>
            </section>

            <section id="tech" className="tech-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">Unsere Expertise</div>
                        <h2 className="section-title">CAE Technologien</h2>
                        <p className="section-description">
                            Von 3D-Scanning und AR-Visualisierung bis zu komplexen FEA-Simulationen – 
                            wir entwickeln Engineering-Lösungen für die digitale Produktentwicklung
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
                                        {stat.suffix === 'mm' ? stat.number.toFixed(2) : Math.floor(stat.number)}{stat.suffix}
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
                            <h3>Von der Idee zur virtuellen Realität</h3>
                            <p>
                                Unsere CAE-Experten entwickeln maßgeschneiderte Lösungen für Ihre Engineering-Herausforderungen. 
                                Mit fundiertem Wissen in Simulation, Messtechnik und AR/VR realisieren wir 
                                zukunftssichere Engineering-Systeme – von der Konzeption bis zur Implementierung.
                            </p>
                            <a href="/cae_projekte" className="btn btn-primary">Unsere Projekte</a>
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
                        <h4>CAE Lab</h4>
                        <ul>
                            <li><a href="#">Über uns</a></li>
                            <li><a href="#">Forschung</a></li>
                            <li><a href="#">Publikationen</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Services</h4>
                        <ul>
                            <li><a href="#">FEA Simulation</a></li>
                            <li><a href="#">3D Scanning</a></li>
                            <li><a href="#">AR/VR Lösungen</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Technologien</h4>
                        <ul>
                            <li><a href="#">Vuforia Studio</a></li>
                            <li><a href="#">ANSYS</a></li>
                            <li><a href="#">Photogrammetrie</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Kontakt</h4>
                        <ul>
                            <li>cae.lab@htldornbirn.at</li>
                            <li>+43 5572 58900</li>
                            <li>Höchsterstraße 73, 6850 Dornbirn</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2025 CAE Lab HTL Dornbirn. Engineering Excellence.</p>
                </div>
            </footer>
        </React.Fragment>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));