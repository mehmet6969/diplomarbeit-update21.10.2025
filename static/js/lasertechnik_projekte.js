window.addEventListener('DOMContentLoaded', () => {
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

                function createGear(radius, teeth, innerRadius) {
                    const shape = new THREE.Shape();
                    const outerRadius = radius;
                    
                    for (let i = 0; i <= teeth * 4; i++) {
                        const angle = (i / (teeth * 4)) * Math.PI * 2;
                        const toothPhase = (i % 4) / 4;
                        
                        let r;
                        if (toothPhase < 0.4) r = outerRadius;
                        else if (toothPhase < 0.5) r = outerRadius - (toothPhase - 0.4) * (outerRadius - innerRadius) * 10;
                        else if (toothPhase < 0.9) r = innerRadius;
                        else r = innerRadius + (toothPhase - 0.9) * (outerRadius - innerRadius) * 10;
                        
                        const x = r * Math.cos(angle);
                        const y = r * Math.sin(angle);
                        
                        if (i === 0) shape.moveTo(x, y);
                        else shape.lineTo(x, y);
                    }
                    
                    const holePath = new THREE.Path();
                    const holeRadius = radius * 0.25;
                    for (let i = 0; i <= 32; i++) {
                        const angle = (i / 32) * Math.PI * 2;
                        const x = holeRadius * Math.cos(angle);
                        const y = holeRadius * Math.sin(angle);
                        if (i === 0) holePath.moveTo(x, y);
                        else holePath.lineTo(x, y);
                    }
                    shape.holes.push(holePath);
                    
                    return shape;
                }

                const extrudeSettings = {
                    depth: 0.15,
                    bevelEnabled: true,
                    bevelThickness: 0.02,
                    bevelSize: 0.02,
                    bevelSegments: 2
                };

                const gearGroup = new THREE.Group();
                
                const gear1Shape = createGear(1.5, 16, 1.2);
                const gear1Geo = new THREE.ExtrudeGeometry(gear1Shape, extrudeSettings);
                const gear1Mat = new THREE.MeshStandardMaterial({ color: 0x8B6F47, metalness: 0.2, roughness: 0.8 });
                const gear1 = new THREE.Mesh(gear1Geo, gear1Mat);
                gear1.position.set(0, 0, 0);
                gearGroup.add(gear1);

                const gear2Shape = createGear(1.0, 12, 0.8);
                const gear2Geo = new THREE.ExtrudeGeometry(gear2Shape, extrudeSettings);
                const gear2Mat = new THREE.MeshStandardMaterial({ color: 0xB89968, metalness: 0.2, roughness: 0.8 });
                const gear2 = new THREE.Mesh(gear2Geo, gear2Mat);
                gear2.position.set(2.2, 0.8, 0.1);
                gearGroup.add(gear2);

                const gear3Shape = createGear(0.8, 10, 0.65);
                const gear3Geo = new THREE.ExtrudeGeometry(gear3Shape, extrudeSettings);
                const gear3Mat = new THREE.MeshStandardMaterial({ color: 0xC4A574, metalness: 0.2, roughness: 0.8 });
                const gear3 = new THREE.Mesh(gear3Geo, gear3Mat);
                gear3.position.set(-2.0, -0.8, -0.1);
                gearGroup.add(gear3);

                scene.add(gearGroup);

                const ambLight = new THREE.AmbientLight(0xffffff, 0.6);
                scene.add(ambLight);
                
                const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
                dirLight.position.set(5, 5, 5);
                scene.add(dirLight);
                
                const pointLight1 = new THREE.PointLight(0xC4A574, 1);
                pointLight1.position.set(-4, 3, 4);
                scene.add(pointLight1);

                camera.position.set(0, 0, 8);

                let mouseX = 0, mouseY = 0;
                
                const handleMouseMove = (e) => {
                    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
                    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
                };
                
                window.addEventListener('mousemove', handleMouseMove);

                let animationId;
                const animate = () => {
                    animationId = requestAnimationFrame(animate);
                    
                    gear1.rotation.z += 0.01;
                    gear2.rotation.z -= 0.01 * (16/12);
                    gear3.rotation.z -= 0.01 * (16/10);
                    
                    gearGroup.rotation.x = mouseY * 0.3;
                    gearGroup.rotation.y = mouseX * 0.3;
                    
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

    const projectsData = [
        {
            id: 1,
            title: "Architekturmodell Villa",
            category: "Modelle",
            description: "Detailliertes Architekturmodell im Maßstab 1:50 mit präzisen Schnitten und perfekter Passgenauigkeit.",
            image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop",
            badge: "Featured",
            complexity: 5,
            material: "Sperrholz 3mm",
            tech: "CO2 Laser",
            cutTime: "2.5h",
            weight: "180g",
            technologies: ["RDWorks", "AutoCAD", "CO2 Lasercutter", "Sperrholz"],
            tags: ["Architektur", "Präzision", "Detailreich"],
            features: [
                "Maßstabsgetreu 1:50",
                "Alle Details enthalten",
                "Perfekte Passgenauigkeit",
                "Mehrschichtige Konstruktion"
            ],
            challenges: "Herstellung feinster Details bei gleichbleibender Stabilität",
            outcome: "Erfolgreich für 5 Architekturpräsentationen eingesetzt"
        },
        {
            id: 2,
            title: "Geometrische Wanddeko",
            category: "Dekorativ",
            description: "Moderne Wanddekoration mit komplexen geometrischen Mustern und verschiedenen Ebenen.",
            image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&h=600&fit=crop",
            badge: "Design",
            complexity: 3,
            material: "MDF 6mm",
            tech: "CO2 Laser",
            cutTime: "1.5h",
            weight: "320g",
            technologies: ["Inkscape", "CO2 Lasercutter", "MDF", "Oberflächenbehandlung"],
            tags: ["Design", "Wandkunst", "Modern"],
            features: [
                "Mehrdimensionales Design",
                "Einfache Montage",
                "Verschiedene Holztöne",
                "Lichtspiel-Effekte"
            ],
            challenges: "Balance zwischen filigranen Details und Stabilität",
            outcome: "Verkauft in 15+ Einheiten"
        },
        {
            id: 3,
            title: "Zahnrad-Uhrwerk",
            category: "Funktional",
            description: "Funktionsfähiges mechanisches Uhrwerk mit präzise geschnittenen Zahnrädern.",
            image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&h=600&fit=crop",
            badge: "Mechanik",
            complexity: 5,
            material: "Sperrholz 4mm",
            tech: "CO2 Laser",
            cutTime: "3h",
            weight: "220g",
            technologies: ["Fusion 360", "Getriebeberechnung", "CO2 Lasercutter"],
            tags: ["Mechanisch", "Funktional", "Komplex"],
            features: [
                "Funktionierendes Getriebe",
                "Präzise Zahnräder",
                "Sichtbare Mechanik",
                "Batteriebetrieben"
            ],
            challenges: "Präzise Zahnradberechnung und Toleranzmanagement",
            outcome: "Funktioniert seit 6 Monaten fehlerfrei"
        },
        {
            id: 4,
            title: "Mandala Lichtbox",
            category: "Kunst",
            description: "Kunstvolle Mandala-Muster mit LED-Hintergrundbeleuchtung für stimmungsvolles Ambiente.",
            image: "https://images.unsplash.com/photo-1544306094-e2dcf9479da3?w=800&h=600&fit=crop",
            badge: "LED",
            complexity: 4,
            material: "Acryl 3mm",
            tech: "CO2 Laser",
            cutTime: "2h",
            weight: "150g",
            technologies: ["Adobe Illustrator", "LED-Technik", "Acryl", "Elektronik"],
            tags: ["Kunst", "Beleuchtung", "Filigran"],
            features: [
                "RGB LED-Beleuchtung",
                "Filigrane Details",
                "Stufenlos dimmbar",
                "16 Millionen Farben"
            ],
            challenges: "Gleichmäßige Lichtverteilung bei filigranen Strukturen",
            outcome: "Bestseller mit 30+ verkauften Einheiten"
        },
        {
            id: 5,
            title: "Organizer Box",
            category: "Funktional",
            description: "Modularer Schreibtisch-Organizer mit individuellen Fächern und Stifthaltern.",
            image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop",
            badge: "Praktisch",
            complexity: 2,
            material: "MDF 3mm",
            tech: "CO2 Laser",
            cutTime: "1h",
            weight: "280g",
            technologies: ["SolidWorks", "CO2 Lasercutter", "MDF", "Stecksystem"],
            tags: ["Praktisch", "Modular", "Alltag"],
            features: [
                "Modulare Fächer",
                "Werkzeugloses Stecksystem",
                "Platz für Stifte & Smartphone",
                "Stabile Konstruktion"
            ],
            challenges: "Entwicklung eines stabilen Stecksystems ohne Klebstoff",
            outcome: "Erfolgreich im Schulshop verkauft, 50+ Einheiten"
        },
        {
            id: 6,
            title: "Puzzle Game Board",
            category: "Funktional",
            description: "Interaktives Puzzle-Spiel mit verzahnten Teilen und versteckten Mechanismen.",
            image: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=800&h=600&fit=crop",
            badge: "Spiel",
            complexity: 4,
            material: "Sperrholz 5mm",
            tech: "CO2 Laser",
            cutTime: "2h",
            weight: "400g",
            technologies: ["Inkscape", "Puzzle-Design", "CO2 Lasercutter", "Spielmechanik"],
            tags: ["Spiel", "Interaktiv", "Knobel"],
            features: [
                "Verzahnte Mechanik",
                "Versteckte Elemente",
                "Für alle Altersgruppen",
                "Hochwertiges Finish"
            ],
            challenges: "Balance zwischen Schwierigkeit und Lösbarkeit",
            outcome: "Bereits 20 Stück produziert"
        },
        {
            id: 7,
            title: "Topografische Karte",
            category: "Kunst",
            description: "3D-Höhenlinien-Karte einer Berglandschaft aus 15 gestapelten Schichten.",
            image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&h=600&fit=crop",
            badge: "3D-Effekt",
            complexity: 5,
            material: "Sperrholz 4mm",
            tech: "CO2 Laser",
            cutTime: "4h",
            weight: "520g",
            technologies: ["QGIS", "Geodaten", "CO2 Lasercutter", "Kartografie"],
            tags: ["Topografie", "3D-Effekt", "Detailliert"],
            features: [
                "15-schichtige Konstruktion",
                "Echte SRTM-Geodaten",
                "Handkolorierbar",
                "Wandmontage"
            ],
            challenges: "Präzise Ausrichtung von 15 Schichten",
            outcome: "Ausgestellt in Schulvitrine"
        }
    ];

    function App() {
        const [activeFilter, setActiveFilter] = useState('Alle');
        const [selectedProject, setSelectedProject] = useState(null);
        const [visibleProjects, setVisibleProjects] = useState(6);

        const categories = ['Alle', 'Funktional', 'Dekorativ', 'Modelle', 'Kunst'];
        
        const filteredProjects = activeFilter === 'Alle' 
            ? projectsData 
            : projectsData.filter(p => p.category === activeFilter);

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
                    React.createElement('h1', null, 'LASERTECHNIK'),
                    React.createElement('p', { className: 'hero-subtitle' }, 'Präzises CO2-Lasercutting für Holz'),
                    React.createElement('div', { className: 'stats-bar' },
                        React.createElement('div', { className: 'stat-item' },
                            React.createElement('div', { className: 'stat-number' }, '7'),
                            React.createElement('div', { className: 'stat-label' }, 'Projekte')
                        ),
                        React.createElement('div', { className: 'stat-item' },
                            React.createElement('div', { className: 'stat-number' }, '0.5mm'),
                            React.createElement('div', { className: 'stat-label' }, 'Präzision')
                        ),
                        React.createElement('div', { className: 'stat-item' },
                            React.createElement('div', { className: 'stat-number' }, '50W'),
                            React.createElement('div', { className: 'stat-label' }, 'CO2 Laser')
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
                                            React.createElement('span', null, `📦 ${project.material}`)
                                        ),
                                        React.createElement('div', { className: 'meta-item' },
                                            React.createElement('span', null, `⚡ ${project.cutTime}`)
                                        ),
                                        React.createElement('div', { className: 'meta-item' },
                                            React.createElement('span', null, `⚖️ ${project.weight}`)
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
                                className: 'load-more-btn'
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
                                React.createElement('div', { className: 'detail-label' }, 'Material'),
                                React.createElement('div', { className: 'detail-value' }, selectedProject.material)
                            ),
                            React.createElement('div', { className: 'detail-item' },
                                React.createElement('div', { className: 'detail-label' }, 'Schnittzeit'),
                                React.createElement('div', { className: 'detail-value' }, selectedProject.cutTime)
                            ),
                            React.createElement('div', { className: 'detail-item' },
                                React.createElement('div', { className: 'detail-label' }, 'Gewicht'),
                                React.createElement('div', { className: 'detail-value' }, selectedProject.weight)
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
                            React.createElement('p', { style: { color: 'var(--text-muted)', lineHeight: '1.8' } },
                                selectedProject.challenges
                            )
                        ),

                        React.createElement('div', { className: 'modal-section' },
                            React.createElement('h3', null, 'Ergebnis'),
                            React.createElement('p', { style: { color: 'var(--text-muted)', lineHeight: '1.8' } },
                                selectedProject.outcome
                            )
                        )
                    )
                )
            ),

            React.createElement('footer', null,
                React.createElement('div', { className: 'footer-content' },
                    React.createElement('div', { className: 'footer-column' },
                        React.createElement('h4', null, 'Lasertechnik Lab'),
                        React.createElement('ul', null,
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Über uns')),
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Team')),
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Karriere'))
                        )
                    ),
                    React.createElement('div', { className: 'footer-column' },
                        React.createElement('h4', null, 'Services'),
                        React.createElement('ul', null,
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'CO2 Lasercutting')),
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Holzgravur')),
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Acrylschnitt'))
                        )
                    ),
                    React.createElement('div', { className: 'footer-column' },
                        React.createElement('h4', null, 'Materialien'),
                        React.createElement('ul', null,
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Sperrholz')),
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'MDF')),
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Acryl'))
                        )
                    ),
                    React.createElement('div', { className: 'footer-column' },
                        React.createElement('h4', null, 'Kontakt'),
                        React.createElement('ul', null,
                            React.createElement('li', null, 'laser.lab@htldornbirn.at'),
                            React.createElement('li', null, '+43 5572 58900'),
                            React.createElement('li', null, 'Höchsterstraße 73, 6850 Dornbirn')
                        )
                    )
                ),
                React.createElement('div', { className: 'footer-bottom' },
                    React.createElement('p', null, '© 2025 Lasertechnik Lab HTL Dornbirn. Precision Engineering.')
                )
            )
        );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(App));
});