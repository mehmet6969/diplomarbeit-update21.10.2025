// Warte bis alle Bibliotheken geladen sind
window.addEventListener('DOMContentLoaded', () => {
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
        console.error('React ist nicht geladen!');
        return;
    }
    
    const { useState, useEffect, useRef } = React;

    // Three.js Scene Component
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
                
                const nodeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
                const nodeMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0xc9a961,
                    transparent: true,
                    opacity: 0.8
                });
                
                const nodes = [];
                const connections = [];
                
                for (let layer = 0; layer < 4; layer++) {
                    const nodeCount = layer === 0 || layer === 3 ? 3 : 5;
                    for (let i = 0; i < nodeCount; i++) {
                        const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
                        const x = (layer - 1.5) * 2;
                        const y = (i - nodeCount / 2) * 1.5;
                        const z = Math.random() * 0.5 - 0.25;
                        node.position.set(x, y, z);
                        nodes.push(node);
                        scene.add(node);
                    }
                }
                
                const lineMaterial = new THREE.LineBasicMaterial({ 
                    color: 0x888888,
                    transparent: true,
                    opacity: 0.3
                });
                
                for (let i = 0; i < nodes.length - 5; i++) {
                    for (let j = 0; j < 3; j++) {
                        const points = [];
                        points.push(nodes[i].position);
                        points.push(nodes[Math.min(i + 3 + j, nodes.length - 1)].position);
                        const geometry = new THREE.BufferGeometry().setFromPoints(points);
                        const line = new THREE.Line(geometry, lineMaterial);
                        connections.push(line);
                        scene.add(line);
                    }
                }
                
                const particlesCount = 50;
                const particlesGeometry = new THREE.BufferGeometry();
                const positions = new Float32Array(particlesCount * 3);
                
                for (let i = 0; i < particlesCount * 3; i++) {
                    positions[i] = (Math.random() - 0.5) * 10;
                }
                
                particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                const particlesMaterial = new THREE.PointsMaterial({
                    color: 0xc9a961,
                    size: 0.02,
                    transparent: true,
                    opacity: 0.6
                });
                const particles = new THREE.Points(particlesGeometry, particlesMaterial);
                scene.add(particles);
                
                const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
                scene.add(ambientLight);
                
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
                    
                    scene.rotation.y += 0.001;
                    scene.rotation.x = mouseY * 0.1;
                    
                    nodes.forEach((node, i) => {
                        node.material.opacity = 0.5 + Math.sin(Date.now() * 0.001 + i) * 0.3;
                    });
                    
                    particles.rotation.y += 0.002;
                    
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
            title: "Quantum Neural Network",
            image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop",
            description: "Revolutionäres Quantencomputing-basiertes neuronales Netzwerk für komplexe Optimierungsprobleme.",
            category: "Quantum AI",
            badge: "Featured",
            complexity: 5,
            year: "2025",
            duration: "12 Monate",
            team: "8 Personen",
            technologies: ["Qiskit", "TensorFlow Quantum", "IBM Quantum", "Cirq", "Python"],
            tags: ["Quantum", "Deep Learning", "Optimization"],
            features: [
                "Hybride klassisch-quantum Architektur",
                "Exponentiell schnellere Berechnungen",
                "Molekularsimulation in Echtzeit",
                "Fehlerkorrektur-Algorithmen",
                "Cloud-basierte Quantum Processing Units"
            ],
            challenges: "Integration von Quantum- und klassischen Systemen bei minimaler Dekohärenz",
            outcome: "Durchbruch in der Medikamentenforschung, 1000x schnellere Molekülanalyse"
        },
        {
            id: 2,
            title: "Autonomous Vision System",
            image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
            description: "Fortschrittliches Computer Vision System mit Multi-Sensor-Fusion für autonome Fahrzeuge.",
            category: "Computer Vision",
            badge: "Innovation",
            complexity: 5,
            year: "2024",
            duration: "10 Monate",
            team: "6 Personen",
            technologies: ["YOLO v8", "OpenCV", "CUDA", "ROS2", "TensorFlow"],
            tags: ["Vision", "Autonomous", "Real-time"],
            features: [
                "Echtzeit-Objekterkennung mit 99.8% Genauigkeit",
                "Multi-Sensor-Fusion (LiDAR, Radar, Kameras)",
                "3D-Umgebungsrekonstruktion",
                "Spurerkennung und Verkehrszeichenerkennung",
                "Fußgängererkennung mit Intentionsanalyse"
            ],
            challenges: "Verarbeitung massiver Datenströme in Echtzeit bei variablen Wetterbedingungen",
            outcome: "Erfolgreiche Tests auf öffentlichen Straßen, Level 4 Autonomie erreicht"
        },
        {
            id: 3,
            title: "Cognitive Language Model",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
            description: "Mehrsprachiges Transformer-Modell mit 175B Parametern für kontextbewusste Textgenerierung.",
            category: "NLP",
            badge: "LLM",
            complexity: 5,
            year: "2024",
            duration: "18 Monate",
            team: "12 Personen",
            technologies: ["GPT Architecture", "JAX", "TPU v4", "Kubernetes", "Ray"],
            tags: ["NLP", "Transformer", "LLM"],
            features: [
                "175 Milliarden Parameter",
                "Unterstützung für 95 Sprachen",
                "Kontextfenster von 128k Token",
                "Fine-tuning für spezifische Domänen",
                "Reinforcement Learning from Human Feedback"
            ],
            challenges: "Training und Deployment eines massiven Modells mit begrenzten Ressourcen",
            outcome: "State-of-the-art Performance in 15 NLP-Benchmarks"
        },
        {
            id: 4,
            title: "Financial Forecasting Engine",
            image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop",
            description: "Hochpräzises Vorhersagesystem für Finanzmärkte mit Ensemble-Learning.",
            category: "Predictive Analytics",
            badge: "FinTech",
            complexity: 4,
            year: "2024",
            duration: "9 Monate",
            team: "5 Personen",
            technologies: ["XGBoost", "Prophet", "Apache Spark", "Kafka", "PostgreSQL"],
            tags: ["Finance", "ML", "Analytics"],
            features: [
                "Vorhersagegenauigkeit von 94%",
                "Echtzeit-Marktanalyse",
                "Risk Assessment mit Monte Carlo",
                "Sentiment-Analyse von News",
                "Automatisches Portfolio-Rebalancing"
            ],
            challenges: "Umgang mit Black Swan Events und Marktmanipulation",
            outcome: "15% höhere Returns im Backtest, in Produktion bei 3 Hedge Funds"
        },
        {
            id: 5,
            title: "Adaptive Robotics Control",
            image: "https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?w=800&h=600&fit=crop",
            description: "Selbstlernendes Robotersteuerungssystem mit Deep Reinforcement Learning.",
            category: "Robotics AI",
            badge: "RL",
            complexity: 5,
            year: "2025",
            duration: "14 Monate",
            team: "7 Personen",
            technologies: ["MuJoCo", "Stable Baselines3", "IsaacGym", "PyBullet", "ROS"],
            tags: ["Robotics", "RL", "Control"],
            features: [
                "Sim-to-Real Transfer Learning",
                "Adaptive Grip Control",
                "Collision Avoidance mit 3D Vision",
                "Multi-Agent Coordination",
                "Self-Supervised Learning"
            ],
            challenges: "Überbrückung der Sim-to-Real Gap für präzise Manipulation",
            outcome: "90% Erfolgsrate bei komplexen Montageaufgaben"
        },
        {
            id: 6,
            title: "Neural Design Synthesis",
            image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=600&fit=crop",
            description: "KI-gesteuerte Designgenerierung mit GANs für industrielle Anwendungen.",
            category: "Generative AI",
            badge: "Creative AI",
            complexity: 4,
            year: "2024",
            duration: "8 Monate",
            team: "4 Personen",
            technologies: ["StyleGAN3", "DALL-E 2", "Stable Diffusion", "Houdini", "Blender API"],
            tags: ["Generative", "Design", "3D"],
            features: [
                "Text-to-3D Model Generation",
                "Style Transfer für CAD-Modelle",
                "Parametrische Optimierung",
                "Physics-aware Design Generation",
                "Real-time Design Iteration"
            ],
            challenges: "Balance zwischen Kreativität und technischer Machbarkeit",
            outcome: "50% Zeitersparnis im Designprozess, 3 Patente angemeldet"
        },
        {
            id: 7,
            title: "Medical Diagnosis Platform",
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
            description: "Deep Learning Platform für medizinische Bildanalyse und Diagnostik.",
            category: "Medical AI",
            badge: "Healthcare",
            complexity: 5,
            year: "2025",
            duration: "16 Monate",
            team: "10 Personen",
            technologies: ["ResNet-152", "MONAI", "DICOM", "FastAPI", "Docker"],
            tags: ["Medical", "Vision", "Diagnosis"],
            features: [
                "99.2% Genauigkeit bei Tumorerkennung",
                "3D-Rekonstruktion aus MRT-Scans",
                "Automatische Reportgenerierung",
                "FDA-konforme Datenverarbeitung",
                "Multi-Modal Fusion (CT, MRT, PET)"
            ],
            challenges: "Erfüllung regulatorischer Anforderungen bei Innovation",
            outcome: "FDA-Zulassung erhalten, Deployment in 5 Kliniken"
        }
    ];

    // Main App Component
    function App() {
        const [activeFilter, setActiveFilter] = useState('Alle');
        const [selectedProject, setSelectedProject] = useState(null);
        const [visibleProjects, setVisibleProjects] = useState(6);

        const categories = ['Alle', 'Quantum AI', 'Computer Vision', 'NLP', 'Robotics AI'];
        
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
                    React.createElement('h1', null, 'Artificial Intelligence'),
                    React.createElement('p', { className: 'hero-subtitle' }, 'Innovative KI-Projekte'),
                    React.createElement('div', { className: 'stats-bar' },
                        React.createElement('div', { className: 'stat-item' },
                            React.createElement('div', { className: 'stat-number' }, '7'),
                            React.createElement('div', { className: 'stat-label' }, 'Projekte')
                        ),
                        React.createElement('div', { className: 'stat-item' },
                            React.createElement('div', { className: 'stat-number' }, '175B'),
                            React.createElement('div', { className: 'stat-label' }, 'Parameter')
                        ),
                        React.createElement('div', { className: 'stat-item' },
                            React.createElement('div', { className: 'stat-number' }, '99%'),
                            React.createElement('div', { className: 'stat-label' }, 'Genauigkeit')
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
                                    border: '1px solid var(--silver)',
                                    color: 'var(--silver)',
                                    fontSize: '0.9rem',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                },
                                onMouseEnter: (e) => {
                                    e.target.style.background = 'var(--graphite)';
                                    e.target.style.color = 'var(--white)';
                                },
                                onMouseLeave: (e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = 'var(--silver)';
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
                            React.createElement('p', { style: { color: 'var(--pearl)', lineHeight: '1.8' } },
                                selectedProject.challenges
                            )
                        ),

                        React.createElement('div', { className: 'modal-section' },
                            React.createElement('h3', null, 'Ergebnis'),
                            React.createElement('p', { style: { color: 'var(--pearl)', lineHeight: '1.8' } },
                                selectedProject.outcome
                            )
                        )
                    )
                )
            ),

            React.createElement('footer', null,
                React.createElement('div', { className: 'footer-content' },
                    React.createElement('div', { className: 'footer-column' },
                        React.createElement('h4', null, 'AI Lab'),
                        React.createElement('ul', null,
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Über uns')),
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Forschung')),
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Publikationen'))
                        )
                    ),
                    React.createElement('div', { className: 'footer-column' },
                        React.createElement('h4', null, 'Technologien'),
                        React.createElement('ul', null,
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Machine Learning')),
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Deep Learning')),
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Quantum Computing'))
                        )
                    ),
                    React.createElement('div', { className: 'footer-column' },
                        React.createElement('h4', null, 'Anwendungen'),
                        React.createElement('ul', null,
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Computer Vision')),
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Natural Language')),
                            React.createElement('li', null, React.createElement('a', { href: '#' }, 'Robotics'))
                        )
                    ),
                    React.createElement('div', { className: 'footer-column' },
                        React.createElement('h4', null, 'Kontakt'),
                        React.createElement('ul', null,
                            React.createElement('li', null, 'ai.lab@htldornbirn.at'),
                            React.createElement('li', null, '+43 5572 58900'),
                            React.createElement('li', null, 'Höchsterstraße 73, 6850 Dornbirn')
                        )
                    )
                ),
                React.createElement('div', { className: 'footer-bottom' },
                    React.createElement('p', null, '© 2025 AI Lab HTL Dornbirn. Advancing Intelligence.')
                )
            )
        );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(App));

    // Animations and interactions - Custom Cursor
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    if (cursor && follower && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            follower.style.left = e.clientX + 'px';
            follower.style.top = e.clientY + 'px';
        });
    }

    // Navbar Scroll Effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        const currentScroll = window.pageYOffset;
        
        if (navbar) {
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        }
    });

    // GSAP Animations
    if (window.gsap) {
        if (window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
        }
        
        const timeline = gsap.timeline();
        
        timeline
            .from('.hero h1', {
                duration: 1.5,
                y: 100,
                opacity: 0,
                ease: 'power4.out'
            })
            .from('.hero-subtitle', {
                duration: 1.2,
                opacity: 0,
                y: 30,
                ease: 'power3.out'
            }, '-=1')
            .from('.stats-bar .stat-item', {
                duration: 1,
                y: 50,
                opacity: 0,
                stagger: 0.2,
                ease: 'power3.out'
            }, '-=0.8')
            .from('#canvas-container', {
                duration: 2,
                opacity: 0,
                scale: 0.8,
                ease: 'power2.out'
            }, '-=1.5');
    }
});