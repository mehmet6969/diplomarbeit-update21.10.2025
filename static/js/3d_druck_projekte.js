const { useState, useEffect } = React;

const projectsData = [
    {
        id: 1,
        title: "Bionik-Prothese",
        image: "../../static/images/3dpic_1.jpg",
        description: "3D-gedruckte Handprothese mit flexiblen TPU-Gelenken und individueller Anpassung für optimalen Tragekomfort.",
        category: "FDM",
        badge: "Medizintechnik",
        complexity: 5,
        year: "2024",
        duration: "6 Monate",
        material: "TPU + PLA",
        technologies: ["FDM Multi-Material", "Topology Optimization", "CAD Anpassung", "Nachbearbeitung"],
        tags: ["Medizin", "Bionik", "Custom"],
        features: [
            "Individuelle Anpassung per 3D-Scan",
            "Flexible Gelenke aus TPU",
            "Gewichtsoptimierung durch Topologie",
            "Antimikrobielle Oberflächenbeschichtung",
            "Modulares Design für Austausch"
        ],
        challenges: "Kombination von starren und flexiblen Materialien in einem Druck mit biokompatiblen Eigenschaften",
        outcome: "Erfolgreiche Anpassung, deutlich günstiger als konventionelle Prothesen"
    },
    {
        id: 2,
        title: "Architekturmodell Smart City",
        image: "../../static/images/3dpic_2.jpg",
        description: "Detailliertes Stadtmodell mit integrierten LED-Beleuchtungen, gedruckt in mehreren Materialien für Präsentationszwecke.",
        category: "SLA",
        badge: "Architektur",
        complexity: 4,
        year: "2024",
        duration: "4 Monate",
        material: "Resin transparent + weiß",
        technologies: ["SLA High-Resolution", "Multi-Material", "LED Integration", "Aushärtung"],
        tags: ["Architektur", "Präsentation", "LED"],
        features: [
            "0.025mm Schichtauflösung für Details",
            "Transparente Gebäude mit LED-Beleuchtung",
            "Maßstab 1:500",
            "Modularer Aufbau für Transport",
            "UV-gehärtete Oberfläche"
        ],
        challenges: "Extreme Detailgenauigkeit bei gleichzeitiger Stabilität und Integration von Elektronik",
        outcome: "Preisgekröntes Modell bei Architektur-Wettbewerb"
    },
    {
        id: 3,
        title: "Leichtbau-Drohnenrahmen",
        image: "../../static/images/3dpic_3.jpg",
        description: "Optimierter Quadcopter-Frame aus Carbon-verstärktem Nylon für maximale Stabilität bei minimalem Gewicht.",
        category: "FDM",
        badge: "Luft & Raumfahrt",
        complexity: 5,
        year: "2024",
        duration: "5 Monate",
        material: "Carbon-Nylon",
        technologies: ["FDM High-Temp", "Generative Design", "FEM-Analyse", "Vibrationsdämpfung"],
        tags: ["Aerospace", "Leichtbau", "Carbon"],
        features: [
            "Gewichtsreduzierung um 40%",
            "Carbon-Faserverstärkung",
            "Integrierte Vibrationsdämpfer",
            "Crash-optimierte Struktur",
            "Modular erweiterbar"
        ],
        challenges: "Balance zwischen minimalem Gewicht und ausreichender Steifigkeit bei hohen Vibrationen",
        outcome: "Flugzeit um 25% erhöht, erfolgreich im Dauereinsatz"
    },
    {
        id: 4,
        title: "Schmuckkollektion Organics",
        image: "../../static/images/3dpic_1.jpg",
        description: "Filigrane Schmuckstücke mit organischen Formen, gedruckt in Castable Resin für Edelmetall-Guss.",
        category: "SLA",
        badge: "Schmuck",
        complexity: 5,
        year: "2025",
        duration: "3 Monate",
        material: "Castable Resin",
        technologies: ["SLA Ultra-Detail", "Lost-Wax Casting", "Post-Processing", "Polieren"],
        tags: ["Schmuck", "Kunst", "Guss"],
        features: [
            "Detailauflösung unter 0.01mm",
            "Komplexe organische Geometrien",
            "Brennbare Harze für Guss",
            "Perfekte Oberflächenqualität",
            "Unikate durch parametrisches Design"
        ],
        challenges: "Ultrafeine Details ohne Stützstrukturen und perfekte Brenneigenschaften",
        outcome: "Erfolgreiche Kollektion, 15 Stück verkauft"
    },
    {
        id: 5,
        title: "Ergonomischer Werkzeuggriff",
        image: "../../static/images/3dpic_2.jpg",
        description: "Individuell angepasster Werkzeuggriff aus weichem TPU für Spezialwerkzeug mit Dauerbelastung.",
        category: "FDM",
        badge: "Industrie",
        complexity: 3,
        year: "2024",
        duration: "2 Monate",
        material: "TPU Shore 85A",
        technologies: ["FDM Flexible", "Ergonomie-Scan", "Infill-Optimierung", "Grip-Texture"],
        tags: ["Ergonomie", "Industrie", "Custom"],
        features: [
            "Handscanning für perfekte Passform",
            "Griffige Oberflächentextur",
            "Shore 85A für optimale Dämpfung",
            "Variable Wandstärken",
            "Chemikalienbeständig"
        ],
        challenges: "Gleichmäßige TPU-Verarbeitung ohne Warping bei komplexer Geometrie",
        outcome: "Reduzierung von Ermüdungserscheinungen um 60%"
    },
    {
        id: 6,
        title: "Funktionsprototyp E-Motor-Gehäuse",
        image: "../../static/images/3dpic_3.jpg",
        description: "Hitzebeständiges Gehäuse für E-Motor-Prototyp mit integrierten Kühlrippen und Kabelführungen.",
        category: "FDM",
        badge: "Automotive",
        complexity: 4,
        year: "2024",
        duration: "4 Monate",
        material: "PC-ABS + PETG",
        technologies: ["FDM Engineering", "Thermal Management", "Multi-Material", "Gewinde-Insert"],
        tags: ["Automotive", "Prototyping", "Thermal"],
        features: [
            "Temperaturbeständig bis 120°C",
            "Optimierte Kühlrippen-Geometrie",
            "Integrierte Kabelkanäle",
            "Gewinde-Inserts für Verschraubung",
            "CFD-simulierte Luftführung"
        ],
        challenges: "Hohe Temperaturen bei gleichzeitiger Maßhaltigkeit und Integration von Metallteilen",
        outcome: "Prototyp erfolgreich getestet, Serie in Vorbereitung"
    }
];

function App() {
    const [activeFilter, setActiveFilter] = useState('Alle');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedProject, setSelectedProject] = useState(null);

    const categories = ['Alle', 'FDM', 'SLA'];
    
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
                    <h1>3D-Druck</h1>
                    <p className="hero-subtitle">
                        Innovative 3D-Druck-Projekte von Prototypen bis Endprodukte – Additive Fertigung in Perfektion
                    </p>
                    <div className="stats-bar">
                        <div className="stat-item">
                            <div className="stat-number">6</div>
                            <div className="stat-label">Projekte</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">25+</div>
                            <div className="stat-label">Materialien</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">300+</div>
                            <div className="stat-label">Drucke</div>
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
                                                <span className="meta-icon">🧪</span>
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