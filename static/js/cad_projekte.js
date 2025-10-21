const { useState, useEffect, useRef } = React;

const projectsData = [
  {
    id: 1,
    title: "Hydraulischer Roboterarm",
    image: "../../static/images/bildcad1.jpg",
    description: "Entwicklung eines präzisen Roboterarms mit hydraulischem Antrieb für industrielle Anwendungen.",
    category: "Fusion 360",
    badge: "Neu",
    year: "2024",
    duration: "6 Monate",
    software: "Fusion 360, AutoCAD",
    tags: ["Mechanik", "Hydraulik", "Automation"],
    features: [
      "6-achsige Bewegungsfreiheit",
      "Präzision bis 0.1mm",
      "Maximale Traglast: 25kg",
      "Integrierte Sensortechnik"
    ],
    challenges: "Integration komplexer hydraulischer Systeme mit elektronischer Steuerung",
    outcome: "Erfolgreiche Implementierung mit 30% höherer Effizienz als geplant"
  },
  {
    id: 2,
    title: "Elektromobil Chassis",
    image: "../../static/images/bildcad2.jpg",
    description: "Leichtbau-Chassis für ein innovatives Elektrofahrzeug mit optimierter Gewichtsverteilung.",
    category: "SolidWorks",
    badge: "Ausgezeichnet",
    year: "2024",
    duration: "8 Monate",
    software: "SolidWorks, ANSYS",
    tags: ["Automotive", "Leichtbau", "E-Mobilität"],
    features: [
      "Aluminium-Konstruktion",
      "FEM-optimierte Struktur",
      "Gewichtsreduktion um 40%",
      "Crashtest-zertifiziert"
    ],
    challenges: "Balance zwischen Gewichtsreduktion und struktureller Integrität",
    outcome: "Preis für Innovation beim Landeswettbewerb"
  },
  {
    id: 3,
    title: "Präzisions-Getriebe",
    image: "../../static/images/bildcad4.jpg",
    description: "Hochpräzises Planetengetriebe für Robotikanwendungen mit minimalem Spiel.",
    category: "Inventor",
    badge: "Prototyp",
    year: "2025",
    duration: "4 Monate",
    software: "Inventor, Matlab",
    tags: ["Antriebstechnik", "Präzision", "Robotik"],
    features: [
      "Übersetzung 1:100",
      "Spielfrei durch Vorspannung",
      "Wirkungsgrad >95%",
      "Wartungsfrei"
    ],
    challenges: "Minimierung des Rückspiels bei hoher Drehmomentübertragung",
    outcome: "Funktionaler Prototyp in Testphase"
  },
  {
    id: 4,
    title: "Drohnen-Landegestell",
    image: "../../static/images/bildcad1.jpg",
    description: "Adaptives Landegestell mit Stoßdämpfung für verschiedene Untergründe.",
    category: "Fusion 360",
    badge: "Innovation",
    year: "2024",
    duration: "3 Monate",
    software: "Fusion 360",
    tags: ["Luftfahrt", "Dämpfung", "Adaptiv"],
    features: [
      "Automatische Niveauanpassung",
      "Federweg: 150mm",
      "Carbon-Fiber Konstruktion",
      "Sensor-gesteuert"
    ],
    challenges: "Entwicklung eines leichten aber robusten Dämpfungssystems",
    outcome: "Patent angemeldet für adaptive Mechanik"
  },
  {
    id: 5,
    title: "CNC-Fräsmaschine",
    image: "../../static/images/bildcad4.jpg",
    description: "Kompakte 3-Achs CNC-Fräse für Prototyping und Kleinserien.",
    category: "SolidWorks",
    badge: "Prototyp",
    year: "2024",
    duration: "10 Monate",
    software: "SolidWorks, Fusion 360",
    tags: ["CNC", "Fertigung", "Automation"],
    features: [
      "Arbeitsbereich: 400x300x200mm",
      "Wiederholgenauigkeit ±0.05mm",
      "Spindeldrehzahl bis 24.000 U/min",
      "Automatischer Werkzeugwechsel"
    ],
    challenges: "Steifigkeit der Portalstruktur bei kompakten Abmessungen",
    outcome: "Erfolgreich in Schulwerkstatt implementiert"
  },
  {
    id: 6,
    title: "Industrieller Greifer",
    image: "../../static/images/bildcad3.jpg",
    description: "Pneumatischer Parallelgreifer mit adaptiver Kraftregelung.",
    category: "Inventor",
    badge: "Serie",
    year: "2023",
    duration: "5 Monate",
    software: "Inventor, Creo",
    tags: ["Pneumatik", "Handling", "Sensorik"],
    features: [
      "Greifkraft regelbar 10-500N",
      "Hub: 80mm",
      "Kraft-Feedback System",
      "Schutzart IP65"
    ],
    challenges: "Integration sensibler Kraft-Sensorik in robuster Umgebung",
    outcome: "Lizenziert an lokales Unternehmen"
  }
];

function App() {
  const [activeFilter, setActiveFilter] = useState('Alle');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [itemsPerSlide, setItemsPerSlide] = useState(window.innerWidth > 768 ? 3 : 1);
  const carouselRef = useRef(null);

  const categories = ['Alle', 'Fusion 360', 'SolidWorks', 'Inventor'];

  // Responsive items per slide
  useEffect(() => {
    const onResize = () => {
      const ips = window.innerWidth > 1024 ? 3 : (window.innerWidth > 768 ? 2 : 1);
      setItemsPerSlide(ips);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const filteredProjects = activeFilter === 'Alle'
    ? projectsData
    : projectsData.filter(p => p.category === activeFilter);

  const maxSlides = Math.max(1, Math.ceil(filteredProjects.length / itemsPerSlide));

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % maxSlides);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + maxSlides) % maxSlides);

  // Reset slide when filter changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [activeFilter, itemsPerSlide, filteredProjects.length]);

  // Auto-play
  useEffect(() => {
    const id = setInterval(nextSlide, 10000);
    return () => clearInterval(id);
  }, [maxSlides]);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Unsere Projekte</h1>
          <p className="hero-subtitle">
            Entdecken Sie die innovativen CAD-Projekte unserer Studierenden – von der Konzeption bis zur Realisierung
          </p>
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
              ref={carouselRef}
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {filteredProjects.map(project => (
                <div
                  key={project.id}
                  className="project-card"
                  style={{ flex: `0 0 calc((100% - ${(itemsPerSlide - 1) * 2}rem) / ${itemsPerSlide})` }}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="project-image" style={{backgroundImage: `url(${project.image})`}}>
                    <img src={project.image} alt={project.title} />
                    <div className="project-badge">{project.badge}</div>
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
                        <span className="meta-icon">💻</span>
                        <span>{project.category}</span>
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
            {Array.from({ length: maxSlides }).map((_, i) => (
              <div
                key={i}
                className={`carousel-dot ${currentSlide === i ? 'active' : ''}`}
                onClick={() => setCurrentSlide(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <div
        className={`modal-overlay ${selectedProject ? 'active' : ''}`}
        onClick={() => setSelectedProject(null)}
      >
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
                  <div className="detail-label">Software</div>
                  <div className="detail-value">{selectedProject.software}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Kategorie</div>
                  <div className="detail-value">{selectedProject.category}</div>
                </div>
              </div>

              <div className="modal-section">
                <h3>Features & Spezifikationen</h3>
                <ul>
                  {selectedProject.features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>

              <div className="modal-section">
                <h3>Herausforderungen</h3>
                <p style={{color:'var(--text-muted)',lineHeight:'1.8',fontSize:'1.05rem',paddingLeft:'1.5rem'}}>
                  {selectedProject.challenges}
                </p>
              </div>

              <div className="modal-section">
                <h3>Ergebnis</h3>
                <p style={{color:'var(--text-muted)',lineHeight:'1.8',fontSize:'1.05rem',paddingLeft:'1.5rem'}}>
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

// ANIMATIONS

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