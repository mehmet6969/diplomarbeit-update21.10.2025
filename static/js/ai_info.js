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
            
            const nodeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
            const nodeMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xc9a961,
                transparent: true,
                opacity: 0.8
            });
            
            const nodes = [];
            
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

function App() {
    const [stats, setStats] = useState([
        { number: 0, label: 'AI-Modelle', target: 50, suffix: '+' },
        { number: 0, label: 'Trainingsstunden', target: 10000, suffix: '+' },
        { number: 0, label: 'Datensätze', target: 100, suffix: '+' },
        { number: 0, label: 'Genauigkeit', target: 99, suffix: '%' }
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
            id: 'ml',
            icon: '🤖',
            title: 'Machine Learning',
            description: 'Entwicklung intelligenter Systeme, die aus Daten lernen und Muster erkennen. Von klassischen Algorithmen bis zu neuesten Deep Learning Architekturen.',
            features: ['Supervised Learning', 'Unsupervised Learning', 'Ensemble Methods', 'Feature Engineering', 'Model Optimization']
        },
        {
            id: 'dl',
            icon: '🧠',
            title: 'Deep Learning',
            description: 'Neuronale Netzwerke mit mehreren Schichten für komplexe Aufgaben. State-of-the-art Architekturen für Computer Vision, NLP und mehr.',
            features: ['Convolutional Networks', 'Transformers', 'GANs', 'Autoencoders', 'Transfer Learning']
        },
        {
            id: 'nlp',
            icon: '💬',
            title: 'Natural Language Processing',
            description: 'Verarbeitung und Verstehen menschlicher Sprache. Von Sentiment-Analyse bis zu fortgeschrittenen Konversationssystemen.',
            features: ['Text Classification', 'Named Entity Recognition', 'Language Models', 'Sentiment Analysis', 'Question Answering']
        }
    ];

    return (
        <React.Fragment>
            <section className="hero">
                <div id="canvas-container">
                    <ThreeScene />
                </div>
                <div className="hero-content">
                    <h1>Artificial Intelligence</h1>
                    <p className="hero-subtitle">
                        Intelligente Systeme für die Zukunft – Von Machine Learning bis Deep Learning
                    </p>
                    <div className="cta-buttons">
                        <a href="#tech" className="btn btn-primary">Mehr entdecken</a>
                        <a href="/artificial_intelligence_projekte" className="btn btn-secondary">Projekte ansehen</a>
                    </div>
                </div>
            </section>

            <section id="tech" className="tech-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">Unsere Expertise</div>
                        <h2 className="section-title">AI Technologien</h2>
                        <p className="section-description">
                            Von grundlegenden Machine Learning Algorithmen bis zu hochmodernen Deep Learning Architekturen – 
                            wir entwickeln intelligente Lösungen für komplexe Herausforderungen
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
                            <h3>Von der Theorie zur intelligenten Anwendung</h3>
                            <p>
                                Unsere AI-Experten entwickeln maßgeschneiderte Lösungen für Ihre Herausforderungen. 
                                Mit fundiertem Wissen in Machine Learning, Deep Learning und NLP realisieren wir 
                                zukunftssichere AI-Systeme – von der Konzeption bis zum Deployment.
                            </p>
                            <a href="/artificial_intelligence_projekte" className="btn btn-primary">Unsere Projekte</a>
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
                        <h4>AI Lab</h4>
                        <ul>
                            <li><a href="#">Über uns</a></li>
                            <li><a href="#">Forschung</a></li>
                            <li><a href="#">Publikationen</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Technologien</h4>
                        <ul>
                            <li><a href="#">Machine Learning</a></li>
                            <li><a href="#">Deep Learning</a></li>
                            <li><a href="#">Natural Language</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Anwendungen</h4>
                        <ul>
                            <li><a href="#">Computer Vision</a></li>
                            <li><a href="#">Predictive Analytics</a></li>
                            <li><a href="#">Robotics</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Kontakt</h4>
                        <ul>
                            <li>ai.lab@htldornbirn.at</li>
                            <li>+43 5572 58900</li>
                            <li>Höchsterstraße 73, 6850 Dornbirn</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2025 AI Lab HTL Dornbirn. Advancing Intelligence.</p>
                </div>
            </footer>
        </React.Fragment>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));