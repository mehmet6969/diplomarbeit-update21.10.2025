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
            
            const geometry = new THREE.TorusGeometry(2, 0.6, 16, 100);
            const material = new THREE.MeshStandardMaterial({
                color: 0x2E5EAA,
                metalness: 0.8,
                roughness: 0.2,
                wireframe: false
            });
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
            
            const wireframeGeometry = new THREE.TorusGeometry(2.1, 0.6, 16, 100);
            const wireframeMaterial = new THREE.MeshBasicMaterial({
                color: 0x4A7BC8,
                wireframe: true,
                transparent: true,
                opacity: 0.3
            });
            const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
            scene.add(wireframeMesh);
            
            const particlesGeometry = new THREE.BufferGeometry();
            const particlesCount = 150;
            const positions = new Float32Array(particlesCount * 3);
            
            for (let i = 0; i < particlesCount * 3; i++) {
                positions[i] = (Math.random() - 0.5) * 10;
            }
            
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const particlesMaterial = new THREE.PointsMaterial({
                color: 0x2E5EAA,
                size: 0.05,
                transparent: true,
                opacity: 0.6
            });
            const particles = new THREE.Points(particlesGeometry, particlesMaterial);
            scene.add(particles);
            
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(5, 5, 5);
            scene.add(directionalLight);
            
            const pointLight = new THREE.PointLight(0x2E5EAA, 2);
            pointLight.position.set(-5, -5, -5);
            scene.add(pointLight);
            
            camera.position.z = 6;
            
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
                
                targetX += (mouseX * 0.3 - targetX) * 0.05;
                targetY += (mouseY * 0.3 - targetY) * 0.05;
                
                mesh.rotation.x += 0.002;
                mesh.rotation.y += 0.003;
                wireframeMesh.rotation.x += 0.002;
                wireframeMesh.rotation.y += 0.003;
                particles.rotation.y += 0.001;
                
                mesh.position.x = targetX;
                mesh.position.y = targetY;
                wireframeMesh.position.x = targetX;
                wireframeMesh.position.y = targetY;
                
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
                geometry.dispose();
                material.dispose();
                wireframeGeometry.dispose();
                wireframeMaterial.dispose();
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
        { number: 0, label: 'CNC-Maschinen', target: 15, suffix: '+' },
        { number: 0, label: 'Jahre Erfahrung', target: 12, suffix: '+' },
        { number: 0, label: 'Werkstücke/Jahr', target: 500, suffix: '+' },
        { number: 0, label: 'Präzision', target: 0.002, suffix: 'mm' }
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
            id: 'cnc-drehen',
            icon: '🔄',
            title: 'CNC-Drehen',
            description: 'Hochpräzise Drehbearbeitung für rotationssymmetrische Bauteile. Von einfachen Wellen bis zu komplexen Turbinenschaufeln mit Multi-Achs-Technologie.',
            features: ['Rundtisch-Bearbeitung', 'Live-Tooling', 'Y-Achsen-Technologie', 'Stangenlader-Automation', 'In-Prozess-Messtechnik']
        },
        {
            id: 'cnc-fraesen',
            icon: '⚙️',
            title: 'CNC-Fräsen',
            description: 'Komplexe 3D-Bearbeitung mit modernsten 5-Achs-Fräszentren. Für höchste Anforderungen in Luft & Raumfahrt, Medizintechnik und Automotive.',
            features: ['5-Achs Simultanfräsen', 'Hochgeschwindigkeitsfräsen', 'Mikrofräsen', 'Hartfräsen bis 65 HRC', 'CAM-Programmierung']
        },
        {
            id: 'qualitaet',
            icon: '📐',
            title: 'Qualitätssicherung',
            description: 'Modernste Messtechnik für höchste Präzision. Koordinatenmessgeräte, optische Messsysteme und In-Prozess-Kontrolle garantieren perfekte Ergebnisse.',
            features: ['3D-Koordinatenmessung', 'Optische Messtechnik', 'Rauheitsmessung', 'Härteprüfung', 'Erstmusterprüfung']
        }
    ];

    return (
        <React.Fragment>
            <section className="hero">
                <div id="canvas-container">
                    <ThreeScene />
                </div>
                <div className="hero-content">
                    <h1>Drehen/Fräsen</h1>
                    <p className="hero-subtitle">
                        Meisterhafte CNC-Fertigung mit höchster Präzision für anspruchsvollste Bauteile
                    </p>
                    <div className="cta-buttons">
                        <a href="#tech" className="btn btn-primary">Mehr entdecken</a>
                        <a href="/wifi_projekte" className="btn btn-secondary">Projekte ansehen</a>
                    </div>
                </div>
            </section>

            <section id="tech" className="tech-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">Unsere Expertise</div>
                        <h2 className="section-title">CNC-Fertigungstechnologien</h2>
                        <p className="section-description">
                            Professionelle Zerspanung mit modernsten CNC-Maschinen für Präzisionsteile in Luft & Raumfahrt, Medizintechnik und Automotive
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
                                        {stat.suffix === 'mm' ? `±${stat.number.toFixed(3)}` : Math.floor(stat.number)}{stat.suffix !== 'mm' ? stat.suffix : 'mm'}
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
                            <h3>Von der Zeichnung zum Präzisionsteil</h3>
                            <p>
                                Unsere CNC-Spezialisten verwandeln technische Zeichnungen in perfekt gefertigte Bauteile. 
                                Mit modernsten Bearbeitungszentren und jahrelanger Erfahrung fertigen wir Präzisionsteile 
                                für höchste Ansprüche – von Prototypen bis zur Großserie.
                            </p>
                            <a href="/wifi_projekte" className="btn btn-primary">Unsere Projekte</a>
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
                        <h4>IEM Drehen/Fräsen</h4>
                        <ul>
                            <li><a href="#">Über uns</a></li>
                            <li><a href="#">Team</a></li>
                            <li><a href="#">Karriere</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Services</h4>
                        <ul>
                            <li><a href="#">CNC-Drehen</a></li>
                            <li><a href="#">CNC-Fräsen</a></li>
                            <li><a href="#">5-Achs Bearbeitung</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Bereiche</h4>
                        <ul>
                            <li><a href="#">Luftfahrt</a></li>
                            <li><a href="#">Medizintechnik</a></li>
                            <li><a href="#">Automotive</a></li>
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
                    <p>© 2025 IEM HTL Dornbirn. Precision Engineering.</p>
                </div>
            </footer>
        </React.Fragment>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));