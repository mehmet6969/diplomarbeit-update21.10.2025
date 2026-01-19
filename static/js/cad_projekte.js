// Warte bis alle Bibliotheken geladen sind
window.addEventListener('DOMContentLoaded', () => {
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
        console.error('React ist nicht geladen!');
        return;
    }
    
    const { useState, useEffect, useRef } = React;

    // Three.js Scene Component - Elegant Gold Wireframe Animation
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
                
                // Icosahedron - elegante geometrische Form
                const icoGeometry = new THREE.IcosahedronGeometry(2, 1);
                const icoMaterial = new THREE.MeshStandardMaterial({
                    color: 0xC4A962,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.7
                });
                const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
                scene.add(icosahedron);
                
                // Outer ring - Torus
                const torusGeometry = new THREE.TorusGeometry(3.5, 0.02, 16, 100);
                const torusMaterial = new THREE.MeshStandardMaterial({
                    color: 0xD4BE7F,
                    transparent: true,
                    opacity: 0.5
                });
                const torus = new THREE.Mesh(torusGeometry, torusMaterial);
                torus.rotation.x = Math.PI / 2;
                scene.add(torus);
                
                // Second ring
                const torus2 = new THREE.Mesh(
                    new THREE.TorusGeometry(3, 0.02, 16, 100),
                    new THREE.MeshStandardMaterial({
                        color: 0xA68B3F,
                        transparent: true,
                        opacity: 0.4
                    })
                );
                torus2.rotation.x = Math.PI / 3;
                torus2.rotation.y = Math.PI / 4;
                scene.add(torus2);
                
                // Floating particles
                const particlesCount = 150;
                const particlesGeometry = new THREE.BufferGeometry();
                const positions = new Float32Array(particlesCount * 3);
                
                for (let i = 0; i < particlesCount * 3; i++) {
                    positions[i] = (Math.random() - 0.5) * 20;
                }
                
                particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                const particlesMaterial = new THREE.PointsMaterial({
                    color: 0xC4A962,
                    size: 0.05,
                    transparent: true,
                    opacity: 0.6
                });
                const particles = new THREE.Points(particlesGeometry, particlesMaterial);
                scene.add(particles);
                
                // Lights
                const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
                scene.add(ambientLight);
                
                const pointLight1 = new THREE.PointLight(0xC4A962, 2);
                pointLight1.position.set(5, 5, 5);
                scene.add(pointLight1);
                
                const pointLight2 = new THREE.PointLight(0xD4BE7F, 1.5);
                pointLight2.position.set(-5, -5, -5);
                scene.add(pointLight2);
                
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
                    
                    // Smooth rotations
                    icosahedron.rotation.x += 0.003;
                    icosahedron.rotation.y += 0.005;
                    
                    torus.rotation.z += 0.002;
                    torus2.rotation.z -= 0.003;
                    torus2.rotation.x += 0.001;
                    
                    particles.rotation.y += 0.001;
                    particles.rotation.x += 0.0005;
                    
                    // Mouse interaction
                    camera.position.x += (mouseX * 2 - camera.position.x) * 0.03;
                    camera.position.y += (mouseY * 2 - camera.position.y) * 0.03;
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

    // Project Data
    const projectsData = [
        {
            id: 1,
            title: "Hydraulischer Roboterarm",
            image: "../../static/images/bildcad1.jpg",
            description: "Entwicklung eines präzisen Roboterarms mit hydraulischem Antrieb für industrielle Anwendungen.",
            category: "Fusion 360",
            badge: "Neu",
            complexity: 5,
            year: "2024",
            duration: "6 Monate",
            team: "4 Personen",
            technologies: ["Fusion 360", "AutoCAD", "FEM-Analyse", "Hydraulik-Simulation"],
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
            complexity: 5,
            year: "2024",
            duration: "8 Monate",
            team: "5 Personen",
            technologies: ["SolidWorks", "ANSYS", "CFD-Simulation", "Topologie-Optimierung"],
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
            complexity: 4,
            year: "2025",
            duration: "4 Monate",
            team: "3 Personen",
            technologies: ["Inventor", "Matlab", "Zahnrad-Berechnung", "3D-Druck"],
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
            complexity: 4,
            year: "2024",
            duration: "3 Monate",
            team: "2 Personen",
            technologies: ["Fusion 360", "Carbon-Fiber Design", "Dämpfungsanalyse"],
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
            complexity: 5,
            year: "2024",
            duration: "10 Monate",
            team: "6 Personen",
            technologies: ["SolidWorks", "Fusion 360", "G-Code", "Steuerungstechnik"],
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
            complexity: 4,
            year: "2023",
            duration: "5 Monate",
            team: "3 Personen",
            technologies: ["Inventor", "Creo", "Pneumatik-Simulation", "Sensorintegration"],
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

    // Main App Component
    function App() {
        const [activeFilter, setActiveFilter] = useState('Alle');
        const [selectedProject, setSelectedProject] = useState(null);
        const [visibleProjects, setVisibleProjects] = useState(6);

        const categories = ['Alle', 'Fusion 360', 'SolidWorks', 'Inventor'];
        
        const filteredProjects = activeFilter === 'Alle' 
            ? projectsData 
            : projectsData.filter(p => p.category === activeFilter || p.tags.some(tag => tag.toLowerCase().includes(activeFilter.toLowerCase())));

        const displayedProjects = filteredProjects.slice(0, visibleProjects);

        const loadMore = () => {
            setVisibleProjects(prev => prev + 3);
        };

        useEffect(() => {
            setVisibleProjects(6);
        }, [activeFilter]);

        return React.createElement(React.Fragment, null,
            React.createElement('section', { className: 'hero' },
                React.createElement('div', { id: 'canvas-container' },
                    React.createElement(ThreeScene)
                ),
                React.createElement('div', { className: 'hero-content' },
                    React.createElement('h1', null, 'CAD Design'),
                    React.createElement('p', { className: 'hero-subtitle' }, 'Computer Aided Design'),
                    React.createElement('div', { className: 'stats-bar' },
                        React.createElement('div', { className: 'stat-item' },
                            React.createElement('div', { className: 'stat-number' }, '6'),
                            React.createElement('div', { className: 'stat-label' }, 'Projekte')
                        ),
                        React.createElement('div', { className: 'stat-item' },
                            React.createElement('div', { className: 'stat-number' }, '0.05mm'),
                            React.createElement('div', { className: 'stat-label' }, 'Präzision')
                        ),
                        React.createElement('div', { className: 'stat-item' },
                            React.createElement('div', { className: 'stat-number' }, '3+'),
                            React.createElement('div', { className: 'stat-label' }, 'CAD-Programme')
                        )
                    )
                )
            ),

            React.createElement('section', { className: 'filter-section' },
                React.createElement('div', { className: 'container' },
                    React.createElement('div', { className: 'filter-tabs' },
                        categories.map(cat =>
                            React.createElement('button', {
                                key: cat,
                                className: `filter-tab ${activeFilter === cat ? 'active' : ''}`,
                                onClick: () => setActiveFilter(cat)
                            }, cat)
                        )
                    )
                )
            ),

            React.createElement('section', { className: 'projects-section' },
                React.createElement('div', { className: 'container' },
                    React.createElement('div', { className: 'projects-grid' },
                        displayedProjects.map((project, index) =>
                            React.createElement('div', {
                                key: project.id,
                                className: 'project-card',
                                onClick: () => setSelectedProject(project)
                            },
                                React.createElement('div', { className: 'project-image' },
                                    React.createElement('img', { src: project.image, alt: project.title }),
                                    React.createElement('div', { className: 'project-badge' }, project.badge),
                                    React.createElement('div', { className: 'complexity-indicator' },
                                        [...Array(5)].map((_, i) =>
                                            React.createElement('div', {
                                                key: i,
                                                className: `complexity-dot ${i < project.complexity ? 'active' : ''}`
                                            })
                                        )
                                    ),
                                    React.createElement('div', { className: 'project-number' },
                                        String(index + 1).padStart(2, '0')
                                    )
                                ),
                                React.createElement('div', { className: 'project-content' },
                                    React.createElement('p', { className: 'project-category' }, project.category),
                                    React.createElement('h3', { className: 'project-title' }, project.title),
                                    React.createElement('p', { className: 'project-description' }, project.description),
                                    React.createElement('div', { className: 'project-meta' },
                                        React.createElement('div', { className: 'meta-item' },
                                            React.createElement('span', null, project.year)
                                        ),
                                        React.createElement('div', { className: 'meta-item' },
                                            React.createElement('span', null, project.duration)
                                        ),
                                        React.createElement('div', { className: 'meta-item' },
                                            React.createElement('span', null, project.team)
                                        )
                                    ),
                                    React.createElement('div', { className: 'project-tags' },
                                        project.tags.map((tag, i) =>
                                            React.createElement('span', { key: i, className: 'project-tag' }, tag)
                                        )
                                    )
                                )
                            )
                        )
                    ),
                    
                    visibleProjects < filteredProjects.length &&
                        React.createElement('div', { className: 'load-more-container' },
                            React.createElement('button', {
                                className: 'load-more-btn',
                                onClick: loadMore
                            }, 'Mehr laden')
                        )
                )
            ),

            React.createElement('div', {
                className: `modal-overlay ${selectedProject ? 'active' : ''}`,
                onClick: () => setSelectedProject(null)
            },
                selectedProject && React.createElement('div', {
                    className: 'modal-content',
                    onClick: (e) => e.stopPropagation()
                },
                    React.createElement('div', {
                        className: 'modal-close',
                        onClick: () => setSelectedProject(null)
                    }, '×'),
                    React.createElement('div', { className: 'modal-image' },
                        React.createElement('img', { src: selectedProject.image, alt: selectedProject.title })
                    ),
                    React.createElement('div', { className: 'modal-body' },
                        React.createElement('h2', { className: 'modal-title' }, selectedProject.title),
                        React.createElement('p', { className: 'modal-description' }, selectedProject.description),
                        
                        React.createElement('div', { className: 'modal-details' },
                            React.createElement('div', { className: 'detail-item' },
                                React.createElement('div', { className: 'detail-label' }, 'Jahr'),
                                React.createElement('div', { className: 'detail-value' }, selectedProject.year)
                            ),
                            React.createElement('div', { className: 'detail-item' },
                                React.createElement('div', { className: 'detail-label' }, 'Dauer'),
                                React.createElement('div', { className: 'detail-value' }, selectedProject.duration)
                            ),
                            React.createElement('div', { className: 'detail-item' },
                                React.createElement('div', { className: 'detail-label' }, 'Team'),
                                React.createElement('div', { className: 'detail-value' }, selectedProject.team)
                            ),
                            React.createElement('div', { className: 'detail-item' },
                                React.createElement('div', { className: 'detail-label' }, 'Software'),
                                React.createElement('div', { className: 'detail-value' }, selectedProject.category)
                            )
                        ),

                        React.createElement('div', { className: 'modal-section' },
                            React.createElement('h3', null, 'Technologien'),
                            React.createElement('div', { className: 'tech-stack' },
                                selectedProject.technologies.map((tech, i) =>
                                    React.createElement('div', { key: i, className: 'tech-item' }, tech)
                                )
                            )
                        ),

                        React.createElement('div', { className: 'modal-section' },
                            React.createElement('h3', null, 'Features & Spezifikationen'),
                            React.createElement('ul', null,
                                selectedProject.features.map((feature, i) =>
                                    React.createElement('li', { key: i }, feature)
                                )
                            )
                        ),

                        React.createElement('div', { className: 'modal-section' },
                            React.createElement('h3', null, 'Herausforderungen'),
                            React.createElement('p', { className: 'modal-text' },
                                selectedProject.challenges
                            )
                        ),

                        React.createElement('div', { className: 'modal-section' },
                            React.createElement('h3', null, 'Ergebnis'),
                            React.createElement('p', { className: 'modal-text' },
                                selectedProject.outcome
                            )
                        )
                    )
                )
            ),

            React.createElement('footer', null,
                React.createElement('div', { className: 'footer-content' },
                    React.createElement('div', { className: 'footer-column' },
                        React.createElement('h4', null, 'IEM CAD Design'),
                        React.createElement('ul', null,
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Über uns')),
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Team')),
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Karriere'))
                        )
                    ),
                    React.createElement('div', { className: 'footer-column' },
                        React.createElement('h4', null, 'Services'),
                        React.createElement('ul', null,
                            React.createElement('li', null, React.createElement('a', { href: '#' }, '3D Modellierung')),
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Technische Zeichnungen')),
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Konstruktionsberatung'))
                        )
                    ),
                    React.createElement('div', { className: 'footer-column' },
                        React.createElement('h4', null, 'Software'),
                        React.createElement('ul', null,
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Fusion 360')),
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'SolidWorks')),
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Autodesk Inventor'))
                        )
                    ),
                    React.createElement('div', { className: 'footer-column' },
                        React.createElement('h4', null, 'Kontakt'),
                        React.createElement('ul', null,
                            React.createElement('li', null, 'cad.iem@htldornbirn.at'),
                            React.createElement('li', null, '+43 5572 58900'),
                            React.createElement('li', null, 'Höchsterstraße 73, 6850 Dornbirn')
                        )
                    )
                ),
                React.createElement('div', { className: 'footer-bottom' },
                    React.createElement('p', null, '© 2025 IEM HTL Dornbirn. Engineering Excellence.')
                )
            )
        );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(App));
});