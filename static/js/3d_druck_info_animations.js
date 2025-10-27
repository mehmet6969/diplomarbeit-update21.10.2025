const { useEffect, useRef } = React;

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
            
            const layers = [];
            const layerCount = 8;
            
            for (let i = 0; i < layerCount; i++) {
                const radius = 1.5;
                const height = i * 0.3 - 1.2;
                const segments = 64;
                const points = [];
                
                for (let j = 0; j <= segments; j++) {
                    const angle = (j / segments) * Math.PI * 2;
                    const x = Math.cos(angle) * radius;
                    const z = Math.sin(angle) * radius;
                    const y = height + Math.sin(angle * 3) * 0.2;
                    points.push(new THREE.Vector3(x, y, z));
                }
                
                const curve = new THREE.CatmullRomCurve3(points);
                curve.closed = true;
                
                const tubeGeometry = new THREE.TubeGeometry(curve, 128, 0.05, 8, true);
                const hue = (i / layerCount) * 0.1 + 0.7;
                const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
                
                const tubeMaterial = new THREE.MeshStandardMaterial({
                    color: color,
                    metalness: 0.7,
                    roughness: 0.3,
                    emissive: color,
                    emissiveIntensity: 0.2
                });
                
                const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
                scene.add(tube);
                layers.push(tube);
            }
            
            const particlesGeometry = new THREE.BufferGeometry();
            const particlesCount = 100;
            const positions = new Float32Array(particlesCount * 3);
            
            for (let i = 0; i < particlesCount * 3; i += 3) {
                const angle = Math.random() * Math.PI * 2;
                const radius = 1 + Math.random() * 1.5;
                positions[i] = Math.cos(angle) * radius;
                positions[i + 1] = (Math.random() - 0.5) * 3;
                positions[i + 2] = Math.sin(angle) * radius;
            }
            
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const particlesMaterial = new THREE.PointsMaterial({
                color: 0x8B5CF6,
                size: 0.05,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending
            });
            const particles = new THREE.Points(particlesGeometry, particlesMaterial);
            scene.add(particles);
            
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(5, 5, 5);
            scene.add(directionalLight);
            
            const pointLight1 = new THREE.PointLight(0x8B5CF6, 1.5);
            pointLight1.position.set(-3, 2, 2);
            scene.add(pointLight1);
            
            const pointLight2 = new THREE.PointLight(0xA78BFA, 1.5);
            pointLight2.position.set(3, -2, -2);
            scene.add(pointLight2);
            
            camera.position.z = 5;
            camera.position.y = 0.5;
            
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
                
                targetX += (mouseX * 0.5 - targetX) * 0.05;
                targetY += (mouseY * 0.3 - targetY) * 0.05;
                
                layers.forEach((layer, i) => {
                    layer.rotation.y += 0.002 * (1 + i * 0.1);
                    layer.position.x = targetX * (1 - i * 0.05);
                    layer.position.y = targetY * (1 - i * 0.05);
                });
                
                particles.rotation.y += 0.001;
                
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
                layers.forEach(layer => {
                    layer.geometry.dispose();
                    layer.material.dispose();
                });
                particlesGeometry.dispose();
                particlesMaterial.dispose();
                renderer.dispose();
            };
        } catch (error) {
            console.error('Three.js error:', error);
        }
    }, []);
    
    return React.createElement('div', { ref: mountRef, id: 'canvas-container' });
}