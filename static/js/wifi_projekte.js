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
    
    return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}

const projectsData = [
    {
        id: 1,
        title: "Präzisions-Turbinenwelle",
        image: "../../static/images/pexels1.jpg",
        description: "Hochpräzise Turbinenwelle aus Inconel 718 mit komplexer Geometrie und extremen Toleranzen für Luftfahrtanwendung.",
        category: "CNC-Drehen",
        badge: "Luft & Raumfahrt",
        precision: "±0.005mm",
        year: "2024",
        duration: "4 Monate",
        material: "Inconel 718",
        specs: {
            durchmesser: "Ø 120mm",
            laenge: "450mm",
            toleranz: "IT6",
            oberflaeche: "Ra 0.8"
        },
        tags: ["Aerospace", "Hochpräzision", "Sondermaterial"],
        features: [
            "5-Achs simultane Bearbeitung",
            "Prozessstabile Zerspanung von Inconel",
            "In-Prozess Messtechnik zur Qualitätssicherung",
            "Thermische Kompensation während Bearbeitung",
            "Vibrationsgedämpfte Aufspannung"
        ],
        challenges: "Bearbeitung von schwer zerspanbarem Inconel bei höchsten Toleranzanforderungen und komplexer Geometrie",
        outcome: "Alle Toleranzen eingehalten, Qualifizierung für Serienfertigung erfolgreich"
    },
    {
        id: 2,
        title: "Medizinisches Implantat-System",
        image: "../../static/images/pexels2.jpg",
        description: "Biokompatibles Hüftimplantat aus Titan Grade 5 mit komplexer Oberflächenstruktur für optimale Osseointegration.",
        category: "CNC-Fräsen",
        badge: "Medizintechnik",
        precision: "±0.01mm",
        year: "2024",
        duration: "6 Monate",
        material: "Titan Grade 5",
        specs: {
            durchmesser: "Ø 45mm",
            laenge: "180mm",
            toleranz: "IT7",
            oberflaeche: "Ra 0.4"
        },
        tags: ["Medizin", "Biokompatibel", "5-Achs"],
        features: [
            "5-Achs Simultanfräsen für organische Formen",
            "Spezielle Oberflächenstruktur für Knochenwachstum",
            "100 Prozent Qualitätskontrolle mit Koordinatenmessgerät",
            "Reinraumfertigung nach ISO 13485",
            "Rückverfolgbarkeit über Seriennummer"
        ],
        challenges: "Titanbearbeitung mit extremer Präzision bei komplexer 3D-Geometrie und strengsten Hygieneanforderungen",
        outcome: "Medizinische Zulassung erhalten, in klinischer Erprobung"
    },
    {
        id: 3,
        title: "Hochleistungs-Zahnrad",
        image: "../../static/images/pexels3.jpg",
        description: "Präzisionszahnrad für Industriegetriebe mit gehärteten Flanken und optimierter Verzahnungsgeometrie.",
        category: "CNC-Fräsen",
        badge: "Antriebstechnik",
        precision: "±0.008mm",
        year: "2024",
        duration: "5 Monate",
        material: "16MnCr5",
        specs: {
            modul: "m = 4",
            zaehnezahl: "z = 48",
            toleranz: "DIN 5",
            haerte: "58-62 HRC"
        },
        tags: ["Verzahnung", "Wälzfräsen", "Gehärtet"],
        features: [
            "Wälzfräsen mit Profilkorrektur",
            "Induktive Randschichthärtung",
            "Zahnflankenmesstechnik mit Verzahnungsmessgerät",
            "Optimierte Evolventengeometrie",
            "Laufgeräuschoptimierung durch Mikrogeometrie"
        ],
        challenges: "Einhaltung höchster Verzahnungsqualität bei gleichzeitiger Randschichthärtung ohne Verzug",
        outcome: "Geräuschreduzierung um 40 Prozent, Lebensdauer verdoppelt"
    },
    {
        id: 4,
        title: "Motorsport Kurbelwelle",
        image: "../../static/images/pexels4.jpg",
        description: "Leichtbau-Kurbelwelle für Rennmotor aus geschmiedetem Chrom-Molybdän-Stahl mit integrierten Ausgleichsgewichten.",
        category: "CNC-Drehen",
        badge: "Motorsport",
        precision: "±0.003mm",
        year: "2025",
        duration: "7 Monate",
        material: "42CrMo4",
        specs: {
            hubzapfen: "Ø 58mm",
            gesamtlaenge: "520mm",
            gewicht: "12.8 kg",
            oberflaeche: "Ra 0.6"
        },
        tags: ["Racing", "Leichtbau", "Hochdrehzahl"],
        features: [
            "Gewichtsoptimierung durch Topologieanalyse",
            "Dynamische Auswuchtung bis 12000 U/min",
            "Mikropolierte Lagerflächen",
            "FEM-gestützte Konstruktion",
            "Röntgenprüfung auf innere Defekte"
        ],
        challenges: "Maximale Gewichtsreduktion bei Sicherstellung der Festigkeit unter extremen Drehzahlen",
        outcome: "Gewichtsersparnis 25 Prozent, erfolgreich im Renneinsatz getestet"
    },
    {
        id: 5,
        title: "Optik-Präzisionsträger",
        image: "../../static/images/pexels5.jpg",
        description: "Ultra-präziser Linsenträger für Astronomie-Teleskop mit nanometer-genauer Positionierung.",
        category: "CNC-Fräsen",
        badge: "Optik",
        precision: "±0.002mm",
        year: "2024",
        duration: "8 Monate",
        material: "Invar 36",
        specs: {
            durchmesser: "Ø 280mm",
            parallelitaet: "0.003mm",
            ebenheit: "0.002mm",
            oberflaeche: "Ra 0.2"
        },
        tags: ["Ultrapräzision", "Astronomie", "Invar"],
        features: [
            "Temperaturkompensation durch Invar-Werkstoff",
            "Diamantfeinbearbeitung für optische Oberflächen",
            "Interferometrische Vermessung",
            "Klimatisierte Fertigung bei 20±0.5°C",
            "Schwingungsgedämpfte Aufstellung"
        ],
        challenges: "Nanometer-Präzision über große Flächen bei minimalen thermischen Einflüssen",
        outcome: "Spezifikationen übertroffen, Installation in Observatorium erfolgt"
    },
    {
        id: 6,
        title: "Hydraulik-Ventilblock",
        image: "../../static/images/pexels1.jpg",
        description: "Komplexer Mehrfach-Ventilblock mit über 40 Bohrungen und innenliegenden Kanälen für Baumaschine.",
        category: "CNC-Fräsen",
        badge: "Hydraulik",
        precision: "±0.02mm",
        year: "2024",
        duration: "5 Monate",
        material: "34CrNiMo6",
        specs: {
            abmessungen: "320x180x140mm",
            bohrungen: "48 Stück",
            druck: "350 bar",
            gewicht: "42 kg"
        },
        tags: ["Hydraulik", "Komplex", "Hochdruck"],
        features: [
            "Tiefbohren mit Innenkühlung",
            "Kreuzbohrungen mit Entgratung",
            "Druckprüfung bei 525 bar (1.5x Betriebsdruck)",
            "3D-koordinatengesteuerte Bohrpositionen",
            "Oberflächenversiegelung gegen Korrosion"
        ],
        challenges: "Positionsgenaue Kreuzbohrungen ohne Kollision bei kompakter Bauweise",
        outcome: "Alle Drucktests bestanden, Serie läuft mit null Reklamationen"
    }
];

function App() {
    const [activeFilter, setActiveFilter] = useState('Alle');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedProject, setSelectedProject] = useState(null);

    const categories = ['Alle', 'CNC-Drehen', 'CNC-Fräsen'];
    
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
        <>
            <section className="hero">
                <div id="canvas-container">
                    <ThreeScene />
                </div>
                <div className="hero-content">
                    <h1>Drehen/Fräsen</h1>
                    <p className="hero-subtitle">
                        Meisterhafte CNC-Fertigung mit höchster Präzision – Von der Einzelteilfertigung bis zur Serienproduktion
                    </p>
                    <div className="stats-bar">
                        <div className="stat-item">
                            <div className="stat-number">6</div>
                            <div className="stat-label">Projekte</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">±0.002mm</div>
                            <div className="stat-label">Höchste Präzision</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">12</div>
                            <div className="stat-label">Werkstoffe</div>
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
                                        <div className="precision-indicator">{project.precision}</div>
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
                                                <span className="meta-icon">🔩</span>
                                                <span>{project.material}</span>
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
                                    <div className="detail-label">Material</div>
                                    <div className="detail-value">{selectedProject.material}</div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">Präzision</div>
                                    <div className="detail-value">{selectedProject.precision}</div>
                                </div>
                            </div>

                            <div className="modal-section">
                                <h3>Technische Spezifikationen</h3>
                                <div className="specs-grid">
                                    {Object.entries(selectedProject.specs).map(([key, value]) => (
                                        <div key={key} className="spec-item">
                                            <div className="spec-label">{key}</div>
                                            <div className="spec-value">{value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-section">
                                <h3>Features & Besonderheiten</h3>
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
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Navbar scroll effect
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

        gsap.from('.stats-bar .stat-item', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            delay: 0.4,
            ease: 'power3.out'
        });

        gsap.from('.filter-tab', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            delay: 0.6,
            ease: 'power3.out'
        });

        gsap.from('.project-card', {
            duration: 1,
            y: 60,
            opacity: 0,
            stagger: 0.15,
            delay: 0.8,
            ease: 'power3.out'
        });
    });
}