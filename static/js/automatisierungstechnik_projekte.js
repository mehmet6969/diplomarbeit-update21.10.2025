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
            
            const geometry = new THREE.IcosahedronGeometry(2, 1);
            const material = new THREE.MeshStandardMaterial({
                color: 0xE63946,
                metalness: 0.8,
                roughness: 0.2,
                wireframe: false
            });
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
            
            const wireframeGeometry = new THREE.IcosahedronGeometry(2.1, 1);
            const wireframeMaterial = new THREE.MeshBasicMaterial({
                color: 0xF1616D,
                wireframe: true,
                transparent: true,
                opacity: 0.3
            });
            const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
            scene.add(wireframeMesh);
            
            const particlesGeometry = new THREE.BufferGeometry();
            const particlesCount = 100;
            const positions = new Float32Array(particlesCount * 3);
            
            for (let i = 0; i < particlesCount * 3; i++) {
                positions[i] = (Math.random() - 0.5) * 10;
            }
            
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const particlesMaterial = new THREE.PointsMaterial({
                color: 0xE63946,
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
            
            const pointLight = new THREE.PointLight(0xE63946, 2);
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

const projectsData = [
    {
        id: 1,
        title: "Smart Factory System",
        image: "../../static/images/3dpic_1.jpg",
        description: "IoT-basiertes Produktionssteuerungssystem mit Echtzeit-Monitoring und prädiktiver Wartung.",
        category: "SPS-Programmierung",
        badge: "Preisgekrönt",
        complexity: 5,
        year: "2024",
        duration: "9 Monate",
        team: "4 Personen",
        technologies: ["Siemens S7-1500", "TIA Portal", "WinCC", "Node-RED", "MQTT"],
        tags: ["IoT", "Industrie 4.0", "Cloud"],
        features: [
            "Echtzeit-Datenerfassung von 50+ Sensoren",
            "Predictive Maintenance mit Machine Learning",
            "OEE-Berechnung und Dashboard-Visualisierung",
            "Automatische Alarmierung bei Anomalien",
            "Integration mit ERP-System"
        ],
        challenges: "Integration verschiedener Protokolle in ein einheitliches System mit niedriger Latenz",
        outcome: "Platz beim österreichischen Automatisierungswettbewerb, 15 Prozent Effizienzsteigerung"
    },
    {
        id: 2,
        title: "Autonomer Lager-Roboter",
        image: "../../static/images/3dpic_2.jpg",
        description: "Vollautomatisches Warehouse-Management mit selbstnavigierenden AGVs und Pick-and-Place System.",
        category: "Robotik",
        badge: "Innovation",
        complexity: 5,
        year: "2024",
        duration: "12 Monate",
        team: "5 Personen",
        technologies: ["ABB IRB", "RobotStudio", "Vision System", "ROS", "SLAM"],
        tags: ["AGV", "Computer Vision", "Navigation"],
        features: [
            "Autonome Navigation mit SLAM-Algorithmus",
            "3D-Vision für präzise Objekterkennung",
            "Kollisionsvermeidung in Echtzeit",
            "Dynamische Routenoptimierung",
            "Integration mit Warehouse Management System"
        ],
        challenges: "Entwicklung eines robusten Navigationssystems in dynamischer Umgebung mit wechselnden Hindernissen",
        outcome: "Prototyp erfolgreich getestet, 40 Prozent schnellere Kommissionierung"
    },
    {
        id: 3,
        title: "Energiemanagement-System",
        image: "../../static/images/3dpic_3.jpg",
        description: "Intelligentes System zur Optimierung des Energieverbrauchs in Produktionsanlagen mit KI-Unterstützung.",
        category: "SPS-Programmierung",
        badge: "Nachhaltig",
        complexity: 4,
        year: "2024",
        duration: "6 Monate",
        team: "3 Personen",
        technologies: ["Beckhoff TwinCAT", "Python", "InfluxDB", "Grafana", "TensorFlow"],
        tags: ["Energie", "KI", "Monitoring"],
        features: [
            "Lastganganalyse und Verbrauchsprognose",
            "Automatische Leistungsoptimierung",
            "Peak-Shaving zur Kostenreduzierung",
            "CO2-Bilanzierung in Echtzeit",
            "Predictive Analytics für Energiebedarf"
        ],
        challenges: "Balance zwischen Produktionsanforderungen und Energieeffizienz ohne Beeinträchtigung der Leistung",
        outcome: "25 Prozent Energieeinsparung, ROI nach 18 Monaten"
    },
    {
        id: 4,
        title: "Qualitätskontrolle mit AI Vision",
        image: "../../static/images/3dpic_1.jpg",
        description: "Automatisiertes Inspektionssystem mit Deep Learning für 100 Prozent Inline-Qualitätskontrolle.",
        category: "Robotik",
        badge: "KI-gestützt",
        complexity: 5,
        year: "2025",
        duration: "8 Monate",
        team: "4 Personen",
        technologies: ["Cognex Vision", "YOLO v8", "OpenCV", "Fanuc Robot", "PyTorch"],
        tags: ["Computer Vision", "Deep Learning", "QA"],
        features: [
            "Fehlererkennungsrate über 99,5 Prozent",
            "Verarbeitung von 120 Teilen pro Minute",
            "Multi-Kamera-System für 360 Grad Inspektion",
            "Automatisches Nachtraining des Modells",
            "Defektklassifizierung in 15 Kategorien"
        ],
        challenges: "Training des Modells mit limitierter Menge an Fehlteilen und Handling variabler Lichtverhältnisse",
        outcome: "Ausschussrate um 60 Prozent reduziert, Projekt läuft in Produktion"
    },
    {
        id: 5,
        title: "Kollaborativer Montage-Roboter",
        image: "../../static/images/3dpic_2.jpg",
        description: "Mensch-Roboter-Kollaboration für flexible Montageaufgaben mit adaptiver Kraftregelung.",
        category: "Robotik",
        badge: "Cobot",
        complexity: 4,
        year: "2024",
        duration: "7 Monate",
        team: "3 Personen",
        technologies: ["Universal Robots", "FT Sensor", "ROS", "Python", "Arduino"],
        tags: ["Cobot", "HRC", "Sicherheit"],
        features: [
            "Kraft-Momenten-Regelung für sichere Kollaboration",
            "Teach-by-Demonstration Programmierung",
            "Dynamische Geschwindigkeitsanpassung",
            "Sicherheitszonen mit Laserscannerüberwachung",
            "Werkzeugwechselsystem für Flexibilität"
        ],
        challenges: "Erfüllung der Sicherheitsanforderungen bei maximaler Produktivität und Flexibilität",
        outcome: "Taktzeit um 30 Prozent reduziert bei voller Arbeitssicherheit"
    },
    {
        id: 6,
        title: "Digitaler Zwilling Produktionslinie",
        image: "../../static/images/3dpic_3.jpg",
        description: "Virtuelles Abbild einer Produktionslinie für Simulation, Optimierung und Predictive Maintenance.",
        category: "SPS-Programmierung",
        badge: "Industrie 4.0",
        complexity: 5,
        year: "2024",
        duration: "10 Monate",
        team: "6 Personen",
        technologies: ["Siemens NX MCD", "OPC UA", "Unity", "Azure", "SQL"],
        tags: ["Digital Twin", "Simulation", "Cloud"],
        features: [
            "Echtzeit-Synchronisation mit physischer Anlage",
            "What-if-Szenarien und Prozessoptimierung",
            "Virtual Commissioning für Risikominimierung",
            "Predictive Maintenance mit Anomalieerkennung",
            "AR-Visualisierung für Wartungspersonal"
        ],
        challenges: "Aufbau eines hochpräzisen Modells mit akzeptabler Performance und Datensynchronisation",
        outcome: "Inbetriebnahmezeit um 40 Prozent reduziert, Planungsgenauigkeit erhöht"
    }
];

function App() {
    const [activeFilter, setActiveFilter] = useState('Alle');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedProject, setSelectedProject] = useState(null);

    const categories = ['Alle', 'SPS-Programmierung', 'Robotik'];
    
    const filteredProjects = activeFilter === 'Alle' 
        ? projectsData 
        : projectsData.filter(p => p.category === activeFilter);

    const itemsPerSlide = window.innerWidth > 768 ? 3 : 1;
    const maxSlides = Math.ceil(filteredProjects.length / itemsPerSlide);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % maxSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
    };

    useEffect(() => {
        setCurrentSlide(0);
    }, [activeFilter]);

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [currentSlide, maxSlides]);

    return (
        <React.Fragment>
            <section className="hero">
                <div id="canvas-container">
                    <ThreeScene />
                </div>
                <div className="hero-content">
                    <h1>Automatisierung</h1>
                    <p className="hero-subtitle">
                        Innovative Automatisierungsprojekte von der Konzeption bis zur Realisierung – Industrie 4.0 in der Praxis
                    </p>
                    <div className="stats-bar">
                        <div className="stat-item">
                            <div className="stat-number">6</div>
                            <div className="stat-label">Projekte</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">25</div>
                            <div className="stat-label">Studierende</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">50+</div>
                            <div className="stat-label">Technologien</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="filter-section">
                <div className="container">
                    <div className="filter-tabs">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`filter-tab ${activeFilter === cat ? 'active' : ''}`}
                                onClick={() => setActiveFilter(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="carousel-section">
                <div className="container">
                    <div className="carousel-container">
                        <div className="carousel-nav prev" onClick={prevSlide}>‹</div>
                        <div 
                            className="carousel-track"
                            style={{
                                transform: `translateX(-${currentSlide * (100 / itemsPerSlide)}%)`
                            }}
                        >
                            {filteredProjects.map(project => (
                                <div 
                                    key={project.id} 
                                    className="project-card"
                                    onClick={() => setSelectedProject(project)}
                                >
                                    <div className="project-image" style={{backgroundImage: `url(${project.image})`}}>
                                        <img src={project.image} alt={project.title} />
                                        <div className="project-badge">{project.badge}</div>
                                        <div className="complexity-indicator">
                                            {[...Array(5)].map((_, i) => (
                                                <div 
                                                    key={i} 
                                                    className={`complexity-dot ${i < project.complexity ? 'active' : ''}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="project-content">
                                        <h3 className="project-title">{project.title}</h3>
                                        <p className="project-description">{project.description}</p>
                                        <div className="project-meta">
                                            <div className="meta-item">
                                                <span className="meta-icon">📅</span>
                                                <span>{project.year}</span>
                                            </div>
                                            <div className="meta-item">
                                                <span className="meta-icon">⏱</span>
                                                <span>{project.duration}</span>
                                            </div>
                                            <div className="meta-item">
                                                <span className="meta-icon">👥</span>
                                                <span>{project.team}</span>
                                            </div>
                                        </div>
                                        <div className="project-tags">
                                            {project.tags.map((tag, i) => (
                                                <span key={i} className="project-tag">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="carousel-nav next" onClick={nextSlide}>›</div>
                    </div>
                    <div className="carousel-dots">
                        {[...Array(maxSlides)].map((_, i) => (
                            <div
                                key={i}
                                className={`carousel-dot ${currentSlide === i ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(i)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <div className={`modal-overlay ${selectedProject ? 'active' : ''}`} onClick={() => setSelectedProject(null)}>
                {selectedProject && (
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-close" onClick={() => setSelectedProject(null)}>×</div>
                        <div className="modal-image" style={{backgroundImage: `url(${selectedProject.image})`}}>
                            <img src={selectedProject.image} alt={selectedProject.title} />
                        </div>
                        <div className="modal-body">
                            <div className="modal-header">
                                <h2 className="modal-title">{selectedProject.title}</h2>
                                <p className="modal-description">{selectedProject.description}</p>
                                <div className="project-tags">
                                    {selectedProject.tags.map((tag, i) => (
                                        <span key={i} className="project-tag">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="modal-details">
                                <div className="detail-item">
                                    <div className="detail-label">Jahr</div>
                                    <div className="detail-value">{selectedProject.year}</div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">Dauer</div>
                                    <div className="detail-value">{selectedProject.duration}</div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">Team</div>
                                    <div className="detail-value">{selectedProject.team}</div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">Kategorie</div>
                                    <div className="detail-value">{selectedProject.category}</div>
                                </div>
                            </div>

                            <div className="modal-section">
                                <h3>Technologien</h3>
                                <div className="tech-stack">
                                    {selectedProject.technologies.map((tech, i) => (
                                        <div key={i} className="tech-item">{tech}</div>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-section">
                                <h3>Features & Highlights</h3>
                                <ul>
                                    {selectedProject.features.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="modal-section">
                                <h3>Herausforderungen</h3>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.05rem', paddingLeft: '1.5rem' }}>
                                    {selectedProject.challenges}
                                </p>
                            </div>

                            <div className="modal-section">
                                <h3>Ergebnis</h3>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.05rem', paddingLeft: '1.5rem' }}>
                                    {selectedProject.outcome}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <footer>
                <div className="footer-content">
                    <div className="footer-column">
                        <h4>IEM Automatisierung</h4>
                        <ul>
                            <li><a href="#">Über uns</a></li>
                            <li><a href="#">Team</a></li>
                            <li><a href="#">Karriere</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Services</h4>
                        <ul>
                            <li><a href="#">SPS-Programmierung</a></li>
                            <li><a href="#">Robotik</a></li>
                            <li><a href="#">Industrie 4.0</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Technologien</h4>
                        <ul>
                            <li><a href="#">Siemens</a></li>
                            <li><a href="#">ABB Robotics</a></li>
                            <li><a href="#">Beckhoff</a></li>
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
                    <p>© 2025 IEM HTL Dornbirn. Automation Excellence.</p>
                </div>
            </footer>
        </React.Fragment>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));