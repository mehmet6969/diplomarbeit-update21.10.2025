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
                    if (toothPhase < 0.4) {
                        r = outerRadius;
                    } else if (toothPhase < 0.5) {
                        r = outerRadius - (toothPhase - 0.4) * (outerRadius - innerRadius) * 10;
                    } else if (toothPhase < 0.9) {
                        r = innerRadius;
                    } else {
                        r = innerRadius + (toothPhase - 0.9) * (outerRadius - innerRadius) * 10;
                    }
                    
                    const x = r * Math.cos(angle);
                    const y = r * Math.sin(angle);
                    
                    if (i === 0) {
                        shape.moveTo(x, y);
                    } else {
                        shape.lineTo(x, y);
                    }
                }
                
                const holePath = new THREE.Path();
                const holeRadius = radius * 0.25;
                for (let i = 0; i <= 32; i++) {
                    const angle = (i / 32) * Math.PI * 2;
                    const x = holeRadius * Math.cos(angle);
                    const y = holeRadius * Math.sin(angle);
                    if (i === 0) {
                        holePath.moveTo(x, y);
                    } else {
                        holePath.lineTo(x, y);
                    }
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
            const gear1Mat = new THREE.MeshStandardMaterial({
                color: 0x8B6F47,
                metalness: 0.2,
                roughness: 0.8
            });
            const gear1 = new THREE.Mesh(gear1Geo, gear1Mat);
            gear1.position.set(0, 0, 0);
            gearGroup.add(gear1);

            const gear2Shape = createGear(1.0, 12, 0.8);
            const gear2Geo = new THREE.ExtrudeGeometry(gear2Shape, extrudeSettings);
            const gear2Mat = new THREE.MeshStandardMaterial({
                color: 0xB89968,
                metalness: 0.2,
                roughness: 0.8
            });
            const gear2 = new THREE.Mesh(gear2Geo, gear2Mat);
            gear2.position.set(2.2, 0.8, 0.1);
            gearGroup.add(gear2);

            const gear3Shape = createGear(0.8, 10, 0.65);
            const gear3Geo = new THREE.ExtrudeGeometry(gear3Shape, extrudeSettings);
            const gear3Mat = new THREE.MeshStandardMaterial({
                color: 0xC4A574,
                metalness: 0.2,
                roughness: 0.8
            });
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

            const pointLight2 = new THREE.PointLight(0x8B6F47, 0.8);
            pointLight2.position.set(4, -3, 3);
            scene.add(pointLight2);

            camera.position.set(0, 0, 8);

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

function App() {
    const [stats, setStats] = useState([
        { number: 0, label: 'Projekte', target: 50, suffix: '+' },
        { number: 0, label: 'Schnittmeter', target: 5000, suffix: '+' },
        { number: 0, label: 'Materialien', target: 15, suffix: '+' },
        { number: 0, label: 'Präzision', target: 99, suffix: '%' }
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
            id: 'co2',
            icon: '⚡',
            title: 'CO2 Lasercutting',
            description: 'Hochpräzises Schneiden von Holz, Acryl und anderen Materialien mit modernster CO2-Lasertechnologie für perfekte Ergebnisse.',
            features: ['50W CO2 Laserröhre', 'Schnittgenauigkeit 0.1mm', 'Arbeitsbereich 600x400mm', 'RDWorks Software', 'Luftunterstützung']
        },
        {
            id: 'gravur',
            icon: '✒️',
            title: 'Lasergravur',
            description: 'Detaillierte Gravuren auf verschiedenen Materialien. Von filigranen Mustern bis zu fotorealistischen Bildern.',
            features: ['Graustufengravur', 'Vektorgravur', 'Fotorealistische Bilder', 'Individuelle Tiefe', 'Mehrere Durchgänge']
        },
        {
            id: 'materialien',
            icon: '📦',
            title: 'Materialvielfalt',
            description: 'Bearbeitung von über 15 verschiedenen Materialien. Von Holz über Acryl bis zu Textilien – für jedes Projekt das richtige Material.',
            features: ['Sperrholz & MDF', 'Acryl (klar & farbig)', 'Karton & Pappe', 'Textilien & Leder', 'Kork & Filz']
        }
    ];

    return React.createElement(React.Fragment, null,
        React.createElement('section', { className: 'hero' },
            React.createElement('div', { id: 'canvas-container' },
                React.createElement(ThreeScene)
            ),
            React.createElement('div', { className: 'hero-content' },
                React.createElement('h1', null, 'LASERTECHNIK'),
                React.createElement('p', { className: 'hero-subtitle' },
                    'Präzises Lasercutting und Gravieren – Von der Idee zum perfekten Schnitt'
                ),
                React.createElement('div', { className: 'cta-buttons' },
                    React.createElement('a', { href: '#tech', className: 'btn btn-primary' }, 'Mehr entdecken'),
                    React.createElement('a', { href: '#', className: 'btn btn-secondary' }, 'Projekte ansehen')
                )
            )
        ),

        React.createElement('section', { id: 'tech', className: 'tech-section' },
            React.createElement('div', { className: 'container' },
                React.createElement('div', { className: 'section-header' },
                    React.createElement('div', { className: 'section-label' }, 'Unsere Expertise'),
                    React.createElement('h2', { className: 'section-title' }, 'Lasertechnologien'),
                    React.createElement('p', { className: 'section-description' },
                        'Von präzisem CO2-Lasercutting bis zu detaillierten Gravuren – wir realisieren Ihre Projekte mit höchster Präzision und Qualität'
                    )
                ),
                
                React.createElement('div', { className: 'tech-grid' },
                    technologies.map(tech =>
                        React.createElement('div', { key: tech.id, className: 'tech-card' },
                            React.createElement('div', { className: 'tech-icon' }, tech.icon),
                            React.createElement('h3', null, tech.title),
                            React.createElement('p', null, tech.description),
                            React.createElement('ul', null,
                                tech.features.map((feature, i) =>
                                    React.createElement('li', { key: i }, feature)
                                )
                            ),
                            React.createElement('a', { href: '#', className: 'tech-link' },
                                'Mehr erfahren →'
                            )
                        )
                    )
                ),

                React.createElement('div', { className: 'stats-grid', ref: statsRef },
                    stats.map((stat, i) =>
                        React.createElement('div', { key: i, className: 'stat-card' },
                            React.createElement('div', { className: 'stat-content' },
                                React.createElement('div', { className: 'stat-number' },
                                    Math.floor(stat.number) + stat.suffix
                                ),
                                React.createElement('div', { className: 'stat-label' }, stat.label)
                            )
                        )
                    )
                )
            )
        ),

        React.createElement('section', { className: 'features-section' },
            React.createElement('div', { className: 'container' },
                React.createElement('div', { className: 'feature-showcase' },
                    React.createElement('div', { className: 'feature-content' },
                        React.createElement('h3', null, 'Von der Skizze zum Meisterwerk'),
                        React.createElement('p', null,
                            'Unsere Lasertechnik-Experten verwandeln Ihre Ideen in präzise gefertigte Werkstücke. Mit modernster CO2-Lasertechnologie, fundiertem Materialwissen und jahrelanger Erfahrung realisieren wir Projekte vom ersten Entwurf bis zum fertigen Produkt – präzise, zuverlässig und in höchster Qualität.'
                        ),
                        React.createElement('a', { href: '#', className: 'btn btn-primary' }, 'Unsere Projekte')
                    ),
                    React.createElement('div', { className: 'feature-visual' },
                        React.createElement('div', { className: 'floating-shape', style: { width: '280px', height: '280px', top: '10%', left: '5%' } }),
                        React.createElement('div', { className: 'floating-shape', style: { width: '220px', height: '220px', bottom: '15%', right: '8%', animationDelay: '3s' } }),
                        React.createElement('div', { className: 'floating-shape', style: { width: '160px', height: '160px', top: '45%', left: '45%', animationDelay: '6s' } })
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
                    React.createElement('h4', null, 'Technologien'),
                    React.createElement('ul', null,
                        React.createElement('li', null, React.createElement('a', { href: '#' }, 'CO2 Lasercutting')),
                        React.createElement('li', null, React.createElement('a', { href: '#' }, 'Lasergravur')),
                        React.createElement('li', null, React.createElement('a', { href: '#' }, 'Materialbearbeitung'))
                    )
                ),
                React.createElement('div', { className: 'footer-column' },
                    React.createElement('h4', null, 'Services'),
                    React.createElement('ul', null,
                        React.createElement('li', null, React.createElement('a', { href: '#' }, 'Prototypenbau')),
                        React.createElement('li', null, React.createElement('a', { href: '#' }, 'Serienproduktion')),
                        React.createElement('li', null, React.createElement('a', { href: '#' }, 'Individuelle Designs'))
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
                React.createElement('p', null, '© 2025 Lasertechnik Lab HTL Dornbirn. Precision Craftsmanship.')
            )
        )
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));