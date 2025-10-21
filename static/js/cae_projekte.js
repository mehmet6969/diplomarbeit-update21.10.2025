// Warte bis alle Bibliotheken geladen sind
window.addEventListener('DOMContentLoaded', () => {
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
        console.error('React ist nicht geladen!');
        return;
    }
    
    const { useState, useEffect, useRef } = React;

    // Three.js Scene Component - Wireframe Mesh Animation
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

    // Project Data
    const projectsData = [
        {
            id: 1,
            title: "3D Face Scan Sculpture Generator",
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop",
            description: "Hochpräzise Gesichtsscan-Technologie mit photogrammetrischer Erfassung zur Erstellung detaillierter 3D-Skulpturen.",
            category: "Messtechnik",
            badge: "Featured",
            complexity: 5,
            year: "2025",
            duration: "11 Monate",
            team: "6 Personen",
            technologies: ["Structure from Motion", "Blender", "CloudCompare", "Photogrammetrie", "3D Printing"],
            tags: ["3D Scan", "Messtechnik", "Photogrammetrie"],
            features: [
                "Photogrammetrische 3D-Erfassung mit 0.1mm Genauigkeit",
                "Automatische Mesh-Optimierung und Texturierung",
                "Multi-Kamera-Setup für 360° Erfassung",
                "KI-gestützte Gesichtserkennung und -segmentierung",
                "Direkter Export für 3D-Druck und CNC-Fräsen"
            ],
            challenges: "Erfassung feiner Gesichtsdetails bei variablen Lichtverhältnissen und Hauttypen",
            outcome: "99.2% Detailgenauigkeit erreicht, 25 Skulpturen erfolgreich produziert"
        },
        {
            id: 2,
            title: "AR Product Visualization Platform",
            image: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&h=600&fit=crop",
            description: "Augmented Reality System zur Projektion und Visualisierung von Produkten in realer Umgebung mit Echtzeit-Interaktion.",
            category: "Augmented Reality",
            badge: "Innovation",
            complexity: 5,
            year: "2024",
            duration: "9 Monate",
            team: "5 Personen",
            technologies: ["Unity", "ARKit", "ARCore", "Vuforia", "WebXR"],
            tags: ["AR", "Visualisierung", "Real-time"],
            features: [
                "Markerlose AR-Tracking mit SLAM-Technologie",
                "Echtzeit-Beleuchtungsanpassung und Schatten",
                "Multi-User Collaboration in AR-Räumen",
                "Physikbasierte Material-Simulation",
                "Cloud-basierte 3D-Asset-Verwaltung"
            ],
            challenges: "Präzise Objektplatzierung und realistische Darstellung bei unterschiedlichen Lichtverhältnissen",
            outcome: "Erfolgreicher Einsatz bei 3 Industriekunden, 40% schnellere Produktpräsentation"
        },
        {
            id: 3,
            title: "Finite Element Analysis Suite",
            image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
            description: "Umfassende FEA-Simulationsplattform für strukturmechanische, thermische und strömungstechnische Analysen.",
            category: "Simulation",
            badge: "FEA",
            complexity: 5,
            year: "2024",
            duration: "14 Monate",
            team: "8 Personen",
            technologies: ["ANSYS", "COMSOL", "Python", "ParaView", "HPC Cluster"],
            tags: ["FEA", "Simulation", "Strukturanalyse"],
            features: [
                "Multiphysik-Simulation mit 10+ Millionen Elementen",
                "Nichtlineare Material- und Kontaktmodellierung",
                "Optimierungsalgorithmen für Leichtbau",
                "Automatisierte Mesh-Generierung mit Adaptivität",
                "Echtzeit-Visualisierung auf HPC-Cluster"
            ],
            challenges: "Balance zwischen Simulationsgenauigkeit und Rechenzeit bei komplexen Geometrien",
            outcome: "15% Materialreduktion bei gleichbleibender Festigkeit in Praxistests"
        },
        {
            id: 4,
            title: "Digital Twin Manufacturing",
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop",
            description: "Digitaler Zwilling für Produktionsanlagen mit Echtzeit-Monitoring und prädiktiver Wartung.",
            category: "Digital Twin",
            badge: "Industrie 4.0",
            complexity: 5,
            year: "2025",
            duration: "12 Monate",
            team: "7 Personen",
            technologies: ["IoT Sensors", "Azure Digital Twins", "Unity", "TensorFlow", "MQTT"],
            tags: ["Digital Twin", "IoT", "Predictive"],
            features: [
                "Echtzeit-Synchronisation mit physischer Anlage",
                "Predictive Maintenance mit 95% Genauigkeit",
                "3D-Visualisierung mit Live-Sensordaten",
                "What-if-Szenarien und Prozessoptimierung",
                "Anomalieerkennung mit Machine Learning"
            ],
            challenges: "Integration heterogener Datenquellen und Sicherstellung der Datensynchronität",
            outcome: "30% Reduktion ungeplanter Ausfallzeiten, ROI nach 18 Monaten"
        },
        {
            id: 5,
            title: "CFD Flow Optimization System",
            image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop",
            description: "Computational Fluid Dynamics System zur Strömungsoptimierung und Aerodynamik-Analyse.",
            category: "Simulation",
            badge: "CFD",
            complexity: 5,
            year: "2024",
            duration: "10 Monate",
            team: "6 Personen",
            technologies: ["OpenFOAM", "STAR-CCM+", "Python", "GPU Computing", "Machine Learning"],
            tags: ["CFD", "Aerodynamik", "Optimierung"],
            features: [
                "Turbulenzmodellierung mit LES und RANS",
                "GPU-beschleunigte Berechnungen (50x schneller)",
                "Automatische Topologie-Optimierung",
                "Multi-Phase-Flow Simulation",
                "KI-gestützte Parameteroptimierung"
            ],
            challenges: "Reduzierung der Rechenzeit bei Beibehaltung hoher Genauigkeit",
            outcome: "25% Effizienzsteigerung bei Strömungsdesigns, 3 Patente angemeldet"
        },
        {
            id: 6,
            title: "VR Engineering Collaboration Space",
            image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&h=600&fit=crop",
            description: "Virtual Reality Plattform für kollaboratives Engineering und Remote-Design-Reviews.",
            category: "Virtual Reality",
            badge: "VR",
            complexity: 4,
            year: "2024",
            duration: "8 Monate",
            team: "5 Personen",
            technologies: ["Unity", "Oculus SDK", "Photon Networking", "CAD Integration", "Voice Chat"],
            tags: ["VR", "Collaboration", "Design Review"],
            features: [
                "Multi-User VR-Räume mit bis zu 12 Teilnehmern",
                "Direkter Import von CAD-Modellen (STEP, IGES)",
                "Echtzeit-Annotations und Markup-Tools",
                "Maßstabsgetreue 1:1 Visualisierung",
                "Cross-Platform Support (PC VR, Quest)"
            ],
            challenges: "Minimierung von VR-Latenz bei komplexen CAD-Modellen in Multi-User Sessions",
            outcome: "60% Zeitersparnis bei Design-Reviews, internationale Zusammenarbeit ermöglicht"
        },
        {
            id: 7,
            title: "Reverse Engineering Scanner Suite",
            image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop",
            description: "Professionelles 3D-Scanning und Reverse Engineering System für Legacy-Komponenten.",
            category: "Messtechnik",
            badge: "3D Scan",
            complexity: 4,
            year: "2025",
            duration: "7 Monate",
            team: "4 Personen",
            technologies: ["Structured Light", "Laser Scanning", "Geomagic", "SolidWorks", "Point Cloud"],
            tags: ["3D Scan", "Reverse Engineering", "CAD"],
            features: [
                "Hochauflösender Structured-Light-Scanner (0.05mm)",
                "Automatische Feature-Erkennung mit AI",
                "Direkte CAD-Modell-Generierung",
                "Qualitätskontrolle mit Soll-Ist-Vergleich",
                "Batch-Processing für Serienteile"
            ],
            challenges: "Erfassung von reflektierenden und transparenten Oberflächen",
            outcome: "Erfolgreiche Reproduktion von 150+ Legacy-Teilen, 70% Zeitersparnis"
        }
    ];

    // Main App Component
    function App() {
        const [activeFilter, setActiveFilter] = useState('Alle');
        const [selectedProject, setSelectedProject] = useState(null);
        const [visibleProjects, setVisibleProjects] = useState(6);

        const categories = ['Alle', 'Messtechnik', 'Simulation', 'Augmented Reality', 'Virtual Reality'];
        
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
                    React.createElement('h1', null, 'CAE Engineering'),
                    React.createElement('p', { className: 'hero-subtitle' }, 'Computer Aided Engineering'),
                    React.createElement('div', { className: 'stats-bar' },
                        React.createElement('div', { className: 'stat-item' },
                            React.createElement('div', { className: 'stat-number' }, '7'),
                            React.createElement('div', { className: 'stat-label' }, 'Projekte')
                        ),
                        React.createElement('div', { className: 'stat-item' },
                            React.createElement('div', { className: 'stat-number' }, '10M+'),
                            React.createElement('div', { className: 'stat-label' }, 'FEA Elemente')
                        ),
                        React.createElement('div', { className: 'stat-item' },
                            React.createElement('div', { className: 'stat-number' }, '0.05mm'),
                            React.createElement('div', { className: 'stat-label' }, 'Scan-Genauigkeit')
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
                        React.createElement('div', { style: { textAlign: 'center', marginTop: '4rem' } },
                            React.createElement('button', {
                                onClick: loadMore,
                                style: {
                                    padding: '1rem 3rem',
                                    background: 'transparent',
                                    border: '2px solid #138A36',
                                    color: '#04E824',
                                    fontSize: '0.9rem',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    fontWeight: '600'
                                },
                                onMouseEnter: (e) => {
                                    e.target.style.background = '#138A36';
                                    e.target.style.color = '#ffffff';
                                },
                                onMouseLeave: (e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = '#04E824';
                                }
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
                                React.createElement('div', { className: 'detail-label' }, 'Kategorie'),
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
                            React.createElement('h3', null, 'Features & Highlights'),
                            React.createElement('ul', null,
                                selectedProject.features.map((feature, i) =>
                                    React.createElement('li', { key: i }, feature)
                                )
                            )
                        ),

                        React.createElement('div', { className: 'modal-section' },
                            React.createElement('h3', null, 'Herausforderungen'),
                            React.createElement('p', { style: { color: 'rgba(255,255,255,0.7)', lineHeight: '1.8' } },
                                selectedProject.challenges
                            )
                        ),

                        React.createElement('div', { className: 'modal-section' },
                            React.createElement('h3', null, 'Ergebnis'),
                            React.createElement('p', { style: { color: 'rgba(255,255,255,0.7)', lineHeight: '1.8' } },
                                selectedProject.outcome
                            )
                        )
                    )
                )
            ),

            React.createElement('footer', null,
                React.createElement('div', { className: 'footer-content' },
                    React.createElement('div', { className: 'footer-column' },
                        React.createElement('h4', null, 'CAE Lab'),
                        React.createElement('ul', null,
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Über uns')),
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Forschung')),
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Publikationen'))
                        )
                    ),
                    React.createElement('div', { className: 'footer-column' },
                        React.createElement('h4', null, 'Services'),
                        React.createElement('ul', null,
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'FEA Simulation')),
                            React.createElement('li', null, React.createElement('a', { href: '#' }, '3D Scanning')),
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'AR/VR Lösungen'))
                        )
                    ),
                    React.createElement('div', { className: 'footer-column' },
                        React.createElement('h4', null, 'Technologien'),
                        React.createElement('ul', null,
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'ANSYS')),
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Unity')),
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Photogrammetrie'))
                        )
                    ),
                    React.createElement('div', { className: 'footer-column' },
                        React.createElement('h4', null, 'Kontakt'),
                        React.createElement('ul', null,
                            React.createElement('li', null, 'cae.lab@htldornbirn.at'),
                            React.createElement('li', null, '+43 5572 58900'),
                            React.createElement('li', null, 'Höchsterstraße 73, 6850 Dornbirn')
                        )
                    )
                ),
                React.createElement('div', { className: 'footer-bottom' },
                    React.createElement('p', null, '© 2025 CAE Lab HTL Dornbirn. Engineering Excellence.')
                )
            )
        );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(App));
});