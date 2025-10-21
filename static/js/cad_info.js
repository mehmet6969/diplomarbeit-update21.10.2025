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
            
            const geometry = new THREE.TorusKnotGeometry(1.5, 0.5, 128, 16);
            const material = new THREE.MeshStandardMaterial({
                color: 0xC4A962,
                metalness: 0.7,
                roughness: 0.3,
                wireframe: false
            });
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
            
            const wireframeGeometry = new THREE.TorusKnotGeometry(1.5, 0.5, 128, 16);
            const wireframeMaterial = new THREE.MeshBasicMaterial({
                color: 0xD4BE7F,
                wireframe: true,
                transparent: true,
                opacity: 0.3
            });
            const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
            scene.add(wireframeMesh);
            
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(5, 5, 5);
            scene.add(directionalLight);
            
            const pointLight = new THREE.PointLight(0xC4A962, 2);
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
                
                targetX += (mouseX * 0.5 - targetX) * 0.05;
                targetY += (mouseY * 0.5 - targetY) * 0.05;
                
                mesh.rotation.x += 0.003;
                mesh.rotation.y += 0.005;
                wireframeMesh.rotation.x += 0.003;
                wireframeMesh.rotation.y += 0.005;
                
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
                renderer.dispose();
            };
        } catch (error) {
            console.error('Three.js error:', error);
        }
    }, []);
    
    return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}

function App() {
    const [stats, setStats] = useState([
        { number: 0, label: 'Software Pakete', target: 15, suffix: '+' },
        { number: 0, label: 'Jahre Erfahrung', target: 8, suffix: '' },
        { number: 0, label: 'Projekte/Jahr', target: 200, suffix: '+' },
        { number: 0, label: 'Zufriedenheit', target: 100, suffix: '%' }
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
            id: 'fusion',
            icon: '🔧',
            title: 'Fusion 360',
            description: 'Cloudbasiertes CAD für parametrisches Design, Simulation und Fertigung. Ideal für komplexe Baugruppen und Zusammenarbeit im Team.',
            features: ['Parametrisches Modeling', 'CAM Integration', 'Cloud Kollaboration', 'Simulation & Analyse']
        },
        {
            id: 'solidworks',
            icon: '⚙️',
            title: 'SolidWorks',
            description: 'Professionelle 3D-CAD Software für Produktentwicklung mit leistungsstarken Werkzeugen für Konstruktion und Engineering.',
            features: ['3D Baugruppen', 'Technische Zeichnungen', 'FEM Analyse', 'Rendering']
        },
        {
            id: 'inventor',
            icon: '🎯',
            title: 'Autodesk Inventor',
            description: 'Professionelle Konstruktionssoftware für mechanisches Design, Dokumentation und Produktsimulation mit BIM-Integration.',
            features: ['Mechanische Konstruktion', 'Sheet Metal Design', 'Rohrleitung & Kabel', 'DWG Integration']
        }
    ];

    return (
        <>
            <section className="hero">
                <div id="canvas-container">
                    <ThreeScene />
                </div>
                <div className="hero-content">
                    <h1>CAD</h1>
                    <p className="hero-subtitle">
                        Innovative Lösungen für Drehprozesse mit modernster Technologie und höchster Präzision
                    </p>
                    <div className="cta-buttons">
                        <a href="#tech" className="btn btn-primary">Mehr entdecken</a>
                        <a href="/cad_projekte" className="btn btn-secondary">Projekte ansehen</a>
                    </div>
                </div>
            </section>

            <section id="tech" className="tech-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">Unsere Expertise</div>
                        <h2 className="section-title">CAD Software & Tools</h2>
                        <p className="section-description">
                            Professionelle Konstruktionslösungen mit branchenführender Software für präzises Design und effiziente Entwicklung
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
                                        {Math.floor(stat.number)}{stat.suffix}
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
                            <h3>Von der Skizze zum fertigen Produkt</h3>
                            <p>
                                Unsere CAD-Experten verwandeln Ihre Ideen in präzise 3D-Modelle. 
                                Mit modernsten Software-Tools und jahrelanger Erfahrung entwickeln wir 
                                maßgeschneiderte Lösungen für jede Anforderung – von einfachen Bauteilen 
                                bis hin zu komplexen Baugruppen.
                            </p>
                            <a href="#" className="btn btn-primary">Unser Portfolio</a>
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
                        <h4>IEM CAD Design</h4>
                        <ul>
                            <li><a href="#">Über uns</a></li>
                            <li><a href="#">Team</a></li>
                            <li><a href="#">Karriere</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Services</h4>
                        <ul>
                            <li><a href="#">3D Modellierung</a></li>
                            <li><a href="#">Technische Zeichnungen</a></li>
                            <li><a href="#">Konstruktionsberatung</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Software</h4>
                        <ul>
                            <li><a href="#">Fusion 360</a></li>
                            <li><a href="#">SolidWorks</a></li>
                            <li><a href="#">Autodesk Inventor</a></li>
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
                    <p>© 2025 IEM HTL Dornbirn. Engineering Excellence.</p>
                </div>
            </footer>
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);