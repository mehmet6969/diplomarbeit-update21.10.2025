window.addEventListener('DOMContentLoaded', () => {
    const { useState, useEffect, useRef } = React;

    // ============================================
    // KONFIGURATION
    // ============================================

    const EMAILJS_CONFIG = {
        serviceId: 'service_v351y86',
        backupServiceId: 'service_s4pcyvf',
        templateId: 'template_nce99x6',
        publicKey: 'IIsxauIOXV1SLgD-O'
    };

   const AUTHORIZED_EMAILS = [
        'mehmet.saygin@student.htldornbirn.at',
        'msaygin29@gmail.com',
        'direktor@htldornbirn.at',
        'dominik.ferles@student.htldornbirn.at',
        'kenan.bayar@htldornbirn.at'
    ];

    // ============================================
    // AUTH SYSTEM
    // ============================================

    // EmailJS Initialisierung
    if (window.emailjs) {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('EmailJS erfolgreich initialisiert');
    } else {
        console.error('EmailJS nicht geladen!');
    }

    function isEmailAuthorized(email) {
        return AUTHORIZED_EMAILS.some(
            authorizedEmail => authorizedEmail.toLowerCase() === email.toLowerCase()
        );
    }

    function generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    function saveSession(email) {
        const session = {
            email: email,
            timestamp: Date.now(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000)
        };
        localStorage.setItem('laser_auth_session', JSON.stringify(session));
    }

    function loadSession() {
        try {
            const sessionData = localStorage.getItem('laser_auth_session');
            if (!sessionData) return null;
            
            const session = JSON.parse(sessionData);
            
            if (Date.now() > session.expiresAt) {
                localStorage.removeItem('laser_auth_session');
                return null;
            }
            
            if (!isEmailAuthorized(session.email)) {
                localStorage.removeItem('laser_auth_session');
                return null;
            }
            
            return session;
        } catch (e) {
            localStorage.removeItem('laser_auth_session');
            return null;
        }
    }

    function clearSession() {
        localStorage.removeItem('laser_auth_session');
    }

    function getNameFromEmail(email) {
        const localPart = email.split('@')[0];
        const parts = localPart.split('.');
        if (parts.length >= 2) {
            return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
        }
        return localPart;
    }

    async function sendVerificationEmail(email, code) {
        if (EMAILJS_CONFIG.serviceId === 'YOUR_SERVICE_ID') {
            console.log('========================================');
            console.log('ENTWICKLUNGSMODUS - E-Mail nicht gesendet');
            console.log('Verifizierungscode für', email + ':', code);
            console.log('========================================');
            return { success: true, devMode: true };
        }
        
        const expiryTime = new Date(Date.now() + 10 * 60 * 1000);
        const timeString = expiryTime.toLocaleString('de-AT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const templateParams = {
            email: email,
            passcode: code,
            time: timeString
        };
        
        try {
            await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams);
            return { success: true };
        } catch (primaryError) {
            console.warn('Primärer Service fehlgeschlagen:', primaryError);
            if (EMAILJS_CONFIG.backupServiceId) {
                try {
                    await emailjs.send(EMAILJS_CONFIG.backupServiceId, EMAILJS_CONFIG.templateId, templateParams);
                    return { success: true };
                } catch (backupError) {
                    return { success: false, error: backupError.text || backupError.message };
                }
            }
            return { success: false, error: primaryError.text || primaryError.message };
        }
    }

    // ============================================
    // THREE.JS SCENE
    // ============================================

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

    // ============================================
    // LOGIN MODAL
    // ============================================

    function LoginModal({ isOpen, onClose, onLoginSuccess }) {
        const [step, setStep] = useState('email');
        const [email, setEmail] = useState('');
        const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
        const [generatedCode, setGeneratedCode] = useState('');
        const [error, setError] = useState('');
        const [success, setSuccess] = useState('');
        const [loading, setLoading] = useState(false);
        const [resendTimer, setResendTimer] = useState(0);
        const codeInputRefs = useRef([]);
        
        useEffect(() => {
            if (!isOpen) {
                setStep('email');
                setEmail('');
                setVerificationCode(['', '', '', '', '', '']);
                setError('');
                setSuccess('');
                setLoading(false);
            }
        }, [isOpen]);
        
        useEffect(() => {
            if (resendTimer > 0) {
                const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
                return () => clearTimeout(timer);
            }
        }, [resendTimer]);
        
        const handleEmailSubmit = async (e) => {
            e.preventDefault();
            setError('');
            setSuccess('');
            
            const trimmedEmail = email.trim().toLowerCase();
            
            if (!trimmedEmail || !trimmedEmail.includes('@')) {
                setError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
                return;
            }
            
            if (!isEmailAuthorized(trimmedEmail)) {
                setError('Diese E-Mail-Adresse ist nicht für den Import berechtigt.');
                return;
            }
            
            setLoading(true);
            const code = generateVerificationCode();
            setGeneratedCode(code);
            const result = await sendVerificationEmail(trimmedEmail, code);
            setLoading(false);
            
            if (result.success) {
                setStep('verify');
                setResendTimer(60);
                if (result.devMode) {
                    setSuccess('ENTWICKLUNGSMODUS: Code in Browser-Konsole (F12)');
                } else {
                    setSuccess('Verifizierungscode wurde gesendet.');
                }
            } else {
                setError('Fehler beim Senden der E-Mail.');
            }
        };
        
        const handleCodeInput = (index, value) => {
            if (value && !/^\d$/.test(value)) return;
            const newCode = [...verificationCode];
            newCode[index] = value;
            setVerificationCode(newCode);
            if (value && index < 5) {
                codeInputRefs.current[index + 1]?.focus();
            }
        };
        
        const handleCodeKeyDown = (index, e) => {
            if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
                codeInputRefs.current[index - 1]?.focus();
            }
        };
        
        const handleCodePaste = (e) => {
            e.preventDefault();
            const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
            if (pasted.length === 6) {
                setVerificationCode(pasted.split(''));
            }
        };
        
        const handleVerifyCode = () => {
            setError('');
            const enteredCode = verificationCode.join('');
            
            if (enteredCode.length !== 6) {
                setError('Bitte vollständigen Code eingeben.');
                return;
            }
            
            if (enteredCode === generatedCode) {
                saveSession(email.trim().toLowerCase());
                onLoginSuccess(email.trim().toLowerCase());
                onClose();
            } else {
                setError('Ungültiger Code.');
                setVerificationCode(['', '', '', '', '', '']);
                codeInputRefs.current[0]?.focus();
            }
        };
        
        const handleResendCode = async () => {
            if (resendTimer > 0) return;
            setError('');
            setLoading(true);
            const code = generateVerificationCode();
            setGeneratedCode(code);
            const result = await sendVerificationEmail(email.trim().toLowerCase(), code);
            setLoading(false);
            
            if (result.success) {
                setResendTimer(60);
                setVerificationCode(['', '', '', '', '', '']);
                setSuccess(result.devMode ? 'Neuer Code in Konsole' : 'Neuer Code gesendet.');
            } else {
                setError('Fehler beim Senden.');
            }
        };
        
        if (!isOpen) return null;
        
        return React.createElement('div', {
            className: `modal-overlay ${isOpen ? 'active' : ''}`,
            onClick: onClose
        },
            React.createElement('div', {
                className: 'modal-content login-modal',
                onClick: (e) => e.stopPropagation(),
                style: { maxWidth: '500px' }
            },
                React.createElement('div', { className: 'modal-close', onClick: onClose }, '×'),
                React.createElement('div', { className: 'modal-body' },
                    React.createElement('div', { style: { textAlign: 'center', marginBottom: '2rem' } },
                        React.createElement('div', { 
                            style: { 
                                width: '80px', height: '80px', 
                                background: 'var(--brown)', 
                                borderRadius: '50%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                margin: '0 auto 1.5rem',
                                fontSize: '2rem'
                            } 
                        }, '🔐'),
                        React.createElement('h2', { style: { color: 'var(--dark)', marginBottom: '0.5rem' } }, 
                            step === 'email' ? 'Lehrer-Anmeldung' : 'Code eingeben'
                        ),
                        React.createElement('p', { style: { color: 'var(--text-muted)' } },
                            step === 'email' 
                                ? 'Melden Sie sich mit Ihrer autorisierten E-Mail an.'
                                : 'Geben Sie den 6-stelligen Code ein.'
                        )
                    ),
                    
                    step === 'email' && React.createElement('form', { onSubmit: handleEmailSubmit },
                        React.createElement('div', { style: { marginBottom: '1.5rem' } },
                            React.createElement('label', { 
                                style: { 
                                    display: 'block', 
                                    color: 'var(--brown)', 
                                    fontSize: '0.75rem', 
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.15em',
                                    marginBottom: '0.5rem'
                                } 
                            }, 'E-Mail-Adresse'),
                            React.createElement('input', {
                                type: 'email',
                                value: email,
                                onChange: (e) => setEmail(e.target.value),
                                placeholder: 'vorname.nachname@htldornbirn.at',
                                style: {
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'var(--beige)',
                                    border: error ? '2px solid #ff4757' : '2px solid var(--brown-light)',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    color: 'var(--dark)'
                                },
                                autoFocus: true
                            })
                        ),
                        error && React.createElement('div', { 
                            style: { color: '#ff4757', fontSize: '0.85rem', marginBottom: '1rem' } 
                        }, '⚠️ ' + error),
                        React.createElement('button', {
                            type: 'submit',
                            disabled: loading,
                            style: {
                                width: '100%',
                                padding: '1rem',
                                background: 'var(--brown)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1
                            }
                        }, loading ? 'Wird gesendet...' : 'Code anfordern')
                    ),
                    
                    step === 'verify' && React.createElement('div', null,
                        React.createElement('button', {
                            type: 'button',
                            onClick: () => setStep('email'),
                            style: {
                                width: '100%',
                                padding: '1rem',
                                background: 'transparent',
                                color: 'var(--brown)',
                                border: '2px solid var(--brown)',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                marginBottom: '1rem'
                            }
                        }, '← Zurück'),
                        success && React.createElement('div', { 
                            style: { color: '#2ED573', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' } 
                        }, '✓ ' + success),
                        React.createElement('div', {
                            style: { display: 'flex', gap: '0.5rem', justifyContent: 'center', margin: '1.5rem 0' },
                            onPaste: handleCodePaste
                        },
                            verificationCode.map((digit, index) =>
                                React.createElement('input', {
                                    key: index,
                                    ref: (el) => codeInputRefs.current[index] = el,
                                    type: 'text',
                                    inputMode: 'numeric',
                                    maxLength: 1,
                                    value: digit,
                                    onChange: (e) => handleCodeInput(index, e.target.value),
                                    onKeyDown: (e) => handleCodeKeyDown(index, e),
                                    style: {
                                        width: '50px',
                                        height: '60px',
                                        textAlign: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: '700',
                                        background: digit ? 'rgba(139,111,71,0.1)' : 'var(--beige)',
                                        border: digit ? '2px solid var(--brown)' : '2px solid var(--brown-light)',
                                        borderRadius: '8px',
                                        color: 'var(--dark)'
                                    },
                                    autoFocus: index === 0
                                })
                            )
                        ),
                        error && React.createElement('div', { 
                            style: { color: '#ff4757', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' } 
                        }, '⚠️ ' + error),
                        React.createElement('button', {
                            type: 'button',
                            onClick: handleVerifyCode,
                            disabled: loading || verificationCode.join('').length !== 6,
                            style: {
                                width: '100%',
                                padding: '1rem',
                                background: 'var(--brown)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                opacity: verificationCode.join('').length !== 6 ? 0.7 : 1
                            }
                        }, 'Verifizieren'),
                        React.createElement('div', { style: { textAlign: 'center', marginTop: '1.5rem' } },
                            resendTimer > 0
                                ? React.createElement('span', { style: { color: 'var(--text-muted)', fontSize: '0.85rem' } }, 
                                    'Erneut senden in ' + resendTimer + 's')
                                : React.createElement('button', {
                                    type: 'button',
                                    onClick: handleResendCode,
                                    disabled: loading,
                                    style: {
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--brown)',
                                        textDecoration: 'underline',
                                        cursor: 'pointer'
                                    }
                                }, 'Code erneut senden')
                        )
                    ),
                    
                    React.createElement('div', { 
                        style: { 
                            textAlign: 'center', 
                            paddingTop: '1.5rem', 
                            borderTop: '1px solid var(--beige)',
                            marginTop: '2rem'
                        } 
                    },
                        React.createElement('p', { style: { color: 'var(--text-muted)', fontSize: '0.8rem' } },
                            'Nur autorisierte Lehrkräfte können Projekte importieren.'
                        )
                    )
                )
            )
        );
    }

    // ============================================
    // IMPORT MODAL
    // ============================================

    function ImportModal({ isOpen, onClose, onSave }) {
        const [formData, setFormData] = useState({
            title: '',
            description: '',
            category: 'Funktional',
            badge: '',
            complexity: 3,
            material: '',
            tech: 'CO2 Laser',
            cutTime: '',
            weight: '',
            image: '',
            technologies: [],
            tags: [],
            features: [''],
            challenges: '',
            outcome: ''
        });
        const [tagInput, setTagInput] = useState('');
        const [techInput, setTechInput] = useState('');
        const imageInputRef = useRef(null);
        
        const categories = ['Funktional', 'Dekorativ', 'Modelle', 'Kunst'];
        
        const handleChange = (field, value) => {
            setFormData(prev => ({ ...prev, [field]: value }));
        };
        
        const handleImageUpload = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => handleChange('image', reader.result);
                reader.readAsDataURL(file);
            }
        };

        const addTag = () => {
            if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
                handleChange('tags', [...formData.tags, tagInput.trim()]);
                setTagInput('');
            }
        };

        const removeTag = (index) => {
            handleChange('tags', formData.tags.filter((_, i) => i !== index));
        };

        const addTech = () => {
            if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
                handleChange('technologies', [...formData.technologies, techInput.trim()]);
                setTechInput('');
            }
        };

        const removeTech = (index) => {
            handleChange('technologies', formData.technologies.filter((_, i) => i !== index));
        };

        const addFeature = () => {
            handleChange('features', [...formData.features, '']);
        };

        const updateFeature = (index, value) => {
            const newFeatures = [...formData.features];
            newFeatures[index] = value;
            handleChange('features', newFeatures);
        };

        const removeFeature = (index) => {
            handleChange('features', formData.features.filter((_, i) => i !== index));
        };
        
        const handleSubmit = () => {
            const newProject = { ...formData };
            onSave(newProject);
            setFormData({
                title: '', description: '', category: 'Funktional', badge: '',
                complexity: 3, material: '', tech: 'CO2 Laser', cutTime: '',
                weight: '', image: '', technologies: [], tags: [],
                features: [''], challenges: '', outcome: ''
            });
            onClose();
        };
        
        if (!isOpen) return null;
        
        const inputStyle = {
            width: '100%',
            padding: '0.8rem',
            background: 'var(--beige)',
            border: '2px solid var(--brown-light)',
            borderRadius: '8px',
            fontSize: '0.95rem',
            color: 'var(--dark)'
        };

        const labelStyle = {
            display: 'block',
            color: 'var(--brown)',
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: '0.5rem'
        };
        
        return React.createElement('div', {
            className: `modal-overlay ${isOpen ? 'active' : ''}`,
            onClick: onClose
        },
            React.createElement('div', {
                className: 'modal-content',
                onClick: (e) => e.stopPropagation(),
                style: { maxWidth: '900px', maxHeight: '95vh' }
            },
                React.createElement('div', { className: 'modal-close', onClick: onClose }, '×'),
                React.createElement('div', { className: 'modal-body' },
                    React.createElement('h2', { 
                        style: { fontSize: '2.5rem', color: 'var(--brown)', marginBottom: '0.5rem', textAlign: 'center' } 
                    }, 'Neues Projekt importieren'),
                    React.createElement('p', { 
                        style: { color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' } 
                    }, 'Fügen Sie alle Projektdetails hinzu'),
                    
                    React.createElement('div', { 
                        style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' } 
                    },
                        // Image Upload
                        React.createElement('div', { style: { gridColumn: '1 / -1' } },
                            React.createElement('label', { style: labelStyle }, 'Projektbild'),
                            React.createElement('div', {
                                onClick: () => imageInputRef.current.click(),
                                style: {
                                    border: '2px dashed var(--brown)',
                                    borderRadius: '8px',
                                    padding: formData.image ? '1rem' : '3rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    background: 'var(--beige)'
                                }
                            },
                                formData.image
                                    ? React.createElement('img', { 
                                        src: formData.image, 
                                        alt: 'Preview',
                                        style: { maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }
                                    })
                                    : React.createElement('div', null,
                                        React.createElement('div', { style: { fontSize: '3rem', marginBottom: '1rem' } }, '📷'),
                                        React.createElement('p', { style: { color: 'var(--text-muted)' } }, 
                                            'Klicken zum ', 
                                            React.createElement('span', { style: { color: 'var(--brown)', textDecoration: 'underline' } }, 'Hochladen')
                                        )
                                    )
                            ),
                            React.createElement('input', {
                                ref: imageInputRef,
                                type: 'file',
                                accept: 'image/*',
                                style: { display: 'none' },
                                onChange: handleImageUpload
                            })
                        ),
                        
                        // Title
                        React.createElement('div', { style: { gridColumn: '1 / -1' } },
                            React.createElement('label', { style: labelStyle }, 'Projekttitel'),
                            React.createElement('input', {
                                type: 'text',
                                value: formData.title,
                                onChange: (e) => handleChange('title', e.target.value),
                                placeholder: 'z.B. Architekturmodell Villa',
                                style: inputStyle
                            })
                        ),
                        
                        // Badge
                        React.createElement('div', null,
                            React.createElement('label', { style: labelStyle }, 'Badge'),
                            React.createElement('input', {
                                type: 'text',
                                value: formData.badge,
                                onChange: (e) => handleChange('badge', e.target.value),
                                placeholder: 'z.B. Featured, Design',
                                style: inputStyle
                            })
                        ),
                        
                        // Category
                        React.createElement('div', null,
                            React.createElement('label', { style: labelStyle }, 'Kategorie'),
                            React.createElement('select', {
                                value: formData.category,
                                onChange: (e) => handleChange('category', e.target.value),
                                style: { ...inputStyle, cursor: 'pointer' }
                            },
                                categories.map(cat => React.createElement('option', { key: cat, value: cat }, cat))
                            )
                        ),
                        
                        // Complexity
                        React.createElement('div', null,
                            React.createElement('label', { style: labelStyle }, 'Komplexität (1-5)'),
                            React.createElement('input', {
                                type: 'number',
                                min: 1,
                                max: 5,
                                value: formData.complexity,
                                onChange: (e) => handleChange('complexity', parseInt(e.target.value) || 1),
                                style: inputStyle
                            })
                        ),
                        
                        // Material
                        React.createElement('div', null,
                            React.createElement('label', { style: labelStyle }, 'Material'),
                            React.createElement('input', {
                                type: 'text',
                                value: formData.material,
                                onChange: (e) => handleChange('material', e.target.value),
                                placeholder: 'z.B. Sperrholz 3mm',
                                style: inputStyle
                            })
                        ),
                        
                        // Cut Time
                        React.createElement('div', null,
                            React.createElement('label', { style: labelStyle }, 'Schnittzeit'),
                            React.createElement('input', {
                                type: 'text',
                                value: formData.cutTime,
                                onChange: (e) => handleChange('cutTime', e.target.value),
                                placeholder: 'z.B. 2.5h',
                                style: inputStyle
                            })
                        ),
                        
                        // Weight
                        React.createElement('div', null,
                            React.createElement('label', { style: labelStyle }, 'Gewicht'),
                            React.createElement('input', {
                                type: 'text',
                                value: formData.weight,
                                onChange: (e) => handleChange('weight', e.target.value),
                                placeholder: 'z.B. 180g',
                                style: inputStyle
                            })
                        ),
                        
                        // Description
                        React.createElement('div', { style: { gridColumn: '1 / -1' } },
                            React.createElement('label', { style: labelStyle }, 'Beschreibung'),
                            React.createElement('textarea', {
                                value: formData.description,
                                onChange: (e) => handleChange('description', e.target.value),
                                placeholder: 'Projektbeschreibung...',
                                style: { ...inputStyle, minHeight: '100px', resize: 'vertical' }
                            })
                        ),
                        
                        // Tags
                        React.createElement('div', { style: { gridColumn: '1 / -1' } },
                            React.createElement('label', { style: labelStyle }, 'Tags'),
                            React.createElement('div', { style: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' } },
                                formData.tags.map((tag, i) => 
                                    React.createElement('span', {
                                        key: i,
                                        style: {
                                            padding: '0.4rem 0.8rem',
                                            background: 'var(--brown)',
                                            color: 'white',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }
                                    },
                                        tag,
                                        React.createElement('span', {
                                            onClick: () => removeTag(i),
                                            style: { cursor: 'pointer' }
                                        }, '×')
                                    )
                                )
                            ),
                            React.createElement('div', { style: { display: 'flex', gap: '0.5rem' } },
                                React.createElement('input', {
                                    type: 'text',
                                    value: tagInput,
                                    onChange: (e) => setTagInput(e.target.value),
                                    onKeyDown: (e) => e.key === 'Enter' && (e.preventDefault(), addTag()),
                                    placeholder: 'Tag hinzufügen...',
                                    style: { ...inputStyle, flex: 1 }
                                }),
                                React.createElement('button', {
                                    type: 'button',
                                    onClick: addTag,
                                    style: {
                                        padding: '0.8rem 1.5rem',
                                        background: 'var(--brown)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }
                                }, '+')
                            )
                        ),
                        
                        // Technologies
                        React.createElement('div', { style: { gridColumn: '1 / -1' } },
                            React.createElement('label', { style: labelStyle }, 'Technologien'),
                            React.createElement('div', { style: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' } },
                                formData.technologies.map((tech, i) => 
                                    React.createElement('span', {
                                        key: i,
                                        style: {
                                            padding: '0.4rem 0.8rem',
                                            background: 'var(--brown-light)',
                                            color: 'var(--dark)',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }
                                    },
                                        tech,
                                        React.createElement('span', {
                                            onClick: () => removeTech(i),
                                            style: { cursor: 'pointer' }
                                        }, '×')
                                    )
                                )
                            ),
                            React.createElement('div', { style: { display: 'flex', gap: '0.5rem' } },
                                React.createElement('input', {
                                    type: 'text',
                                    value: techInput,
                                    onChange: (e) => setTechInput(e.target.value),
                                    onKeyDown: (e) => e.key === 'Enter' && (e.preventDefault(), addTech()),
                                    placeholder: 'Technologie hinzufügen...',
                                    style: { ...inputStyle, flex: 1 }
                                }),
                                React.createElement('button', {
                                    type: 'button',
                                    onClick: addTech,
                                    style: {
                                        padding: '0.8rem 1.5rem',
                                        background: 'var(--brown)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }
                                }, '+')
                            )
                        ),
                        
                        // Features
                        React.createElement('div', { style: { gridColumn: '1 / -1' } },
                            React.createElement('label', { style: labelStyle }, 'Features'),
                            formData.features.map((feature, index) =>
                                React.createElement('div', { 
                                    key: index, 
                                    style: { display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' } 
                                },
                                    React.createElement('input', {
                                        type: 'text',
                                        value: feature,
                                        onChange: (e) => updateFeature(index, e.target.value),
                                        placeholder: `Feature ${index + 1}`,
                                        style: { ...inputStyle, flex: 1 }
                                    }),
                                    React.createElement('button', {
                                        type: 'button',
                                        onClick: () => removeFeature(index),
                                        style: {
                                            padding: '0 1rem',
                                            background: 'transparent',
                                            border: '2px solid var(--brown)',
                                            borderRadius: '8px',
                                            color: 'var(--brown)',
                                            cursor: 'pointer'
                                        }
                                    }, '×')
                                )
                            ),
                            React.createElement('button', {
                                type: 'button',
                                onClick: addFeature,
                                style: {
                                    width: '100%',
                                    padding: '0.8rem',
                                    background: 'transparent',
                                    border: '2px dashed var(--brown)',
                                    borderRadius: '8px',
                                    color: 'var(--brown)',
                                    cursor: 'pointer'
                                }
                            }, '+ Feature hinzufügen')
                        ),
                        
                        // Challenges
                        React.createElement('div', { style: { gridColumn: '1 / -1' } },
                            React.createElement('label', { style: labelStyle }, 'Herausforderungen'),
                            React.createElement('textarea', {
                                value: formData.challenges,
                                onChange: (e) => handleChange('challenges', e.target.value),
                                placeholder: 'Welche Herausforderungen gab es?',
                                style: { ...inputStyle, minHeight: '80px', resize: 'vertical' }
                            })
                        ),
                        
                        // Outcome
                        React.createElement('div', { style: { gridColumn: '1 / -1' } },
                            React.createElement('label', { style: labelStyle }, 'Ergebnis'),
                            React.createElement('textarea', {
                                value: formData.outcome,
                                onChange: (e) => handleChange('outcome', e.target.value),
                                placeholder: 'Was wurde erreicht?',
                                style: { ...inputStyle, minHeight: '80px', resize: 'vertical' }
                            })
                        )
                    ),
                    
                    // Actions
                    React.createElement('div', { 
                        style: { 
                            display: 'flex', 
                            gap: '1rem', 
                            justifyContent: 'flex-end', 
                            marginTop: '2rem',
                            paddingTop: '2rem',
                            borderTop: '1px solid var(--beige)'
                        } 
                    },
                        React.createElement('button', {
                            type: 'button',
                            onClick: onClose,
                            style: {
                                padding: '1rem 2.5rem',
                                background: 'transparent',
                                border: '2px solid var(--brown)',
                                borderRadius: '8px',
                                color: 'var(--brown)',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }
                        }, 'Abbrechen'),
                        React.createElement('button', {
                            type: 'button',
                            onClick: handleSubmit,
                            style: {
                                padding: '1rem 2.5rem',
                                background: 'var(--brown)',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }
                        }, 'Projekt speichern')
                    )
                )
            )
        );
    }

    // ============================================
    // PROJECT MODAL
    // ============================================

    function ProjectModal({ project, onClose, isAuthenticated, onDelete, onToggleVisibility }) {
        if (!project) return null;
        
        return React.createElement('div', {
            className: `modal-overlay ${project ? 'active' : ''}`,
            onClick: onClose
        },
            React.createElement('div', {
                className: 'modal-content',
                onClick: (e) => e.stopPropagation()
            },
                React.createElement('div', { className: 'modal-close', onClick: onClose }, '×'),
                React.createElement('div', { className: 'modal-image' },
                    React.createElement('img', { src: project.image, alt: project.title })
                ),
                React.createElement('div', { className: 'modal-body' },
                    React.createElement('h2', { className: 'modal-title' }, project.title),
                    React.createElement('p', { className: 'modal-description' }, project.description),
                    
                    isAuthenticated && React.createElement('div', { 
                        style: { display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' } 
                    },
                        React.createElement('button', {
                            onClick: () => onDelete(project),
                            style: {
                                padding: '0.8rem 1.5rem',
                                background: 'transparent',
                                border: '2px solid var(--brown)',
                                borderRadius: '8px',
                                color: 'var(--brown)',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }
                        }, '🗑 Löschen'),
                        React.createElement('button', {
                            onClick: () => onToggleVisibility(project),
                            style: {
                                padding: '0.8rem 1.5rem',
                                background: 'var(--brown)',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }
                        }, (project.visibility || 'public') === 'restricted' ? '🔓 Öffentlich machen' : '🔒 Sperrvermerk')
                    ),
                    
                    React.createElement('div', { className: 'modal-details' },
                        React.createElement('div', { className: 'detail-item' },
                            React.createElement('div', { className: 'detail-label' }, 'Material'),
                            React.createElement('div', { className: 'detail-value' }, project.material)
                        ),
                        React.createElement('div', { className: 'detail-item' },
                            React.createElement('div', { className: 'detail-label' }, 'Schnittzeit'),
                            React.createElement('div', { className: 'detail-value' }, project.cutTime)
                        ),
                        React.createElement('div', { className: 'detail-item' },
                            React.createElement('div', { className: 'detail-label' }, 'Gewicht'),
                            React.createElement('div', { className: 'detail-value' }, project.weight)
                        ),
                        React.createElement('div', { className: 'detail-item' },
                            React.createElement('div', { className: 'detail-label' }, 'Kategorie'),
                            React.createElement('div', { className: 'detail-value' }, project.category)
                        )
                    ),

                    project.technologies && project.technologies.length > 0 && React.createElement('div', { className: 'modal-section' },
                        React.createElement('h3', null, 'Technologien'),
                        React.createElement('div', { className: 'tech-stack' },
                            project.technologies.map((tech, i) =>
                                React.createElement('div', { key: i, className: 'tech-item' }, tech)
                            )
                        )
                    ),

                    project.features && project.features.filter(f => f).length > 0 && React.createElement('div', { className: 'modal-section' },
                        React.createElement('h3', null, 'Features & Highlights'),
                        React.createElement('ul', null,
                            project.features.filter(f => f).map((feature, i) =>
                                React.createElement('li', { key: i }, feature)
                            )
                        )
                    ),

                    project.challenges && React.createElement('div', { className: 'modal-section' },
                        React.createElement('h3', null, 'Herausforderungen'),
                        React.createElement('p', { style: { color: 'var(--text-muted)', lineHeight: '1.8' } },
                            project.challenges
                        )
                    ),

                    project.outcome && React.createElement('div', { className: 'modal-section' },
                        React.createElement('h3', null, 'Ergebnis'),
                        React.createElement('p', { style: { color: 'var(--text-muted)', lineHeight: '1.8' } },
                            project.outcome
                        )
                    )
                )
            )
        );
    }

    // ============================================
    // MAIN APP (mit MongoDB + module=laser)
    // ============================================

    function App() {
        const [projects, setProjects] = useState([]);
        const [activeFilter, setActiveFilter] = useState('Alle');
        const [selectedProject, setSelectedProject] = useState(null);
        const [visibleProjects, setVisibleProjects] = useState(6);
        const [showImportModal, setShowImportModal] = useState(false);
        const [showLoginModal, setShowLoginModal] = useState(false);
        const [isAuthenticated, setIsAuthenticated] = useState(false);
        const [userEmail, setUserEmail] = useState('');

        const categories = ['Alle', 'Funktional', 'Dekorativ', 'Modelle', 'Kunst'];

        // ========== MongoDB Integration ==========
        const reloadProjects = async (emailOrEmpty) => {
            try {
                const res = await fetch("/api/projects?module=laser", {
                    headers: emailOrEmpty ? { "X-User-Email": emailOrEmpty } : {}
                });
                const data = await res.json();
                setProjects(data);
            } catch (e) {
                console.error("Konnte Projekte nicht laden:", e);
                setProjects([]);
            }
        };

        useEffect(() => {
            const session = loadSession();
            const email = session?.email || "";

            if (session) {
                setIsAuthenticated(true);
                setUserEmail(session.email);
            }

            reloadProjects(email);
        }, []);
        
        const filteredProjects = activeFilter === 'Alle' 
            ? projects 
            : projects.filter(p => p.category === activeFilter);

        const displayedProjects = filteredProjects.slice(0, visibleProjects);

        const loadMore = () => {
            setVisibleProjects(prev => prev + 3);
        };

        useEffect(() => {
            setVisibleProjects(6);
        }, [activeFilter]);

        // ========== CRUD Operations ==========
        const addProject = async (newProject) => {
            try {
                if (!userEmail) {
                    alert("Nicht angemeldet.");
                    return;
                }

                const res = await fetch("/api/projects", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-User-Email": userEmail
                    },
                    body: JSON.stringify({ ...newProject, module: "laser" }),
                });

                const saved = await res.json();

                if (!res.ok) {
                    console.error(saved);
                    alert(saved?.error || "Speichern fehlgeschlagen");
                    return;
                }

                setProjects(prev => [saved, ...prev]);
            } catch (e) {
                console.error("Speichern fehlgeschlagen:", e);
                alert("Speichern fehlgeschlagen (siehe Konsole).");
            }
        };

        const deleteProject = async (project) => {
            try {
                if (!userEmail) return alert("Nicht angemeldet.");

                const ok = confirm(`Projekt wirklich löschen?\n\n"${project.title}"`);
                if (!ok) return;

                const res = await fetch(`/api/projects/${project.id}`, {
                    method: "DELETE",
                    headers: { "X-User-Email": userEmail }
                });

                const out = await res.json();

                if (!res.ok) {
                    console.error(out);
                    alert(out?.error || "Löschen fehlgeschlagen");
                    return;
                }

                setProjects(prev => prev.filter(p => p.id !== project.id));
                setSelectedProject(null);
            } catch (e) {
                console.error("Löschen fehlgeschlagen:", e);
                alert("Löschen fehlgeschlagen (siehe Konsole).");
            }
        };

        const toggleVisibility = async (project) => {
            try {
                if (!userEmail) return alert("Nicht angemeldet.");

                const current = project.visibility || "public";
                const next = current === "restricted" ? "public" : "restricted";

                const res = await fetch(`/api/projects/${project.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "X-User-Email": userEmail
                    },
                    body: JSON.stringify({ visibility: next })
                });

                const updated = await res.json();

                if (!res.ok) {
                    console.error(updated);
                    alert(updated?.error || "Update fehlgeschlagen");
                    return;
                }

                setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)));
                setSelectedProject(updated);
            } catch (e) {
                console.error("Toggle fehlgeschlagen:", e);
                alert("Toggle fehlgeschlagen (siehe Konsole).");
            }
        };

        const handleImportClick = () => {
            if (isAuthenticated) {
                setShowImportModal(true);
            } else {
                setShowLoginModal(true);
            }
        };

        const handleLoginSuccess = async (email) => {
            setIsAuthenticated(true);
            setUserEmail(email);
            setShowLoginModal(false);
            setShowImportModal(true);
            await reloadProjects(email);
        };

        const handleLogout = async () => {
            clearSession();
            setIsAuthenticated(false);
            setUserEmail('');
            setSelectedProject(null);
            await reloadProjects("");
        };

        const userName = userEmail ? getNameFromEmail(userEmail) : '';
        const userInitials = userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase() : '';

        return React.createElement(React.Fragment, null,
            // Navigation
            React.createElement('nav', { id: 'navbar' },
                React.createElement('div', { className: 'nav-content' },
                    React.createElement('div', { className: 'logo' }, '⚡ Laser Lab'),
                    React.createElement('ul', { className: 'nav-links' },
                        React.createElement('li', null, React.createElement('a', { href: '/', className: 'nav-link' }, 'Home')),
                        React.createElement('li', null, React.createElement('a', { href: '/lasertechnik_projekte', className: 'nav-link active' }, 'Projekte')),
                        React.createElement('li', null, React.createElement('a', { href: '/lasertechnik_info', className: 'nav-link' }, 'Info')),
                        React.createElement('li', null, 
                            React.createElement('span', { 
                                className: 'nav-link', 
                                onClick: handleImportClick, 
                                style: { cursor: 'pointer' } 
                            }, 'Import')
                        ),
                        isAuthenticated && React.createElement('li', null,
                            React.createElement('div', {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.8rem',
                                    padding: '0.5rem 1rem',
                                    background: 'rgba(139,111,71,0.1)',
                                    border: '1px solid var(--brown-light)',
                                    borderRadius: '8px'
                                }
                            },
                                React.createElement('div', {
                                    style: {
                                        width: '32px',
                                        height: '32px',
                                        background: 'var(--brown)',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '700',
                                        fontSize: '0.85rem',
                                        borderRadius: '50%'
                                    }
                                }, userInitials),
                                React.createElement('div', { style: { display: 'flex', flexDirection: 'column' } },
                                    React.createElement('span', { style: { color: 'var(--dark)', fontSize: '0.85rem', fontWeight: '500' } }, userName),
                                    React.createElement('span', { style: { color: 'var(--brown)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' } }, 'Lehrkraft')
                                ),
                                React.createElement('button', {
                                    onClick: handleLogout,
                                    title: 'Abmelden',
                                    style: {
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem'
                                    }
                                }, '⏻')
                            )
                        )
                    )
                )
            ),

            // Hero Section
            React.createElement('section', { className: 'hero' },
                React.createElement('div', { id: 'canvas-container' },
                    React.createElement(ThreeScene)
                ),
                React.createElement('div', { className: 'hero-content' },
                    React.createElement('h1', null, 'LASERTECHNIK'),
                    React.createElement('p', { className: 'hero-subtitle' }, 'Präzises CO2-Lasercutting für Holz'),
                    React.createElement('div', { className: 'stats-bar' },
                        React.createElement('div', { className: 'stat-item' },
                            React.createElement('div', { className: 'stat-number' }, projects.length),
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

            // Filter Section
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

            // Projects Section
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
                                    React.createElement('div', { className: 'project-badge' }, 
                                        project.visibility === 'restricted' ? '🔒 Gesperrt' : project.badge
                                    ),
                                    React.createElement('div', { className: 'complexity-indicator' },
                                        [...Array(5)].map((_, i) =>
                                            React.createElement('div', {
                                                key: i,
                                                className: `complexity-dot ${i < (project.complexity || 0) ? 'active' : ''}`
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
                                            React.createElement('span', null, `📦 ${project.material || '-'}`)
                                        ),
                                        React.createElement('div', { className: 'meta-item' },
                                            React.createElement('span', null, `⚡ ${project.cutTime || '-'}`)
                                        ),
                                        React.createElement('div', { className: 'meta-item' },
                                            React.createElement('span', null, `⚖️ ${project.weight || '-'}`)
                                        )
                                    ),
                                    React.createElement('div', { className: 'project-tags' },
                                        (project.tags || []).map((tag, i) =>
                                            React.createElement('span', { key: i, className: 'project-tag' }, tag)
                                        )
                                    )
                                )
                            )
                        )
                    ),
                    
                    filteredProjects.length === 0 && React.createElement('div', { 
                        style: { textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' } 
                    },
                        React.createElement('h3', null, 'Keine Projekte gefunden'),
                        React.createElement('p', null, 'Fügen Sie neue Projekte hinzu oder wählen Sie einen anderen Filter.')
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

            // Project Detail Modal
            React.createElement(ProjectModal, {
                project: selectedProject,
                onClose: () => setSelectedProject(null),
                isAuthenticated: isAuthenticated,
                onDelete: deleteProject,
                onToggleVisibility: toggleVisibility
            }),

            // Import Modal
            React.createElement(ImportModal, {
                isOpen: showImportModal,
                onClose: () => setShowImportModal(false),
                onSave: addProject
            }),

            // Login Modal
            React.createElement(LoginModal, {
                isOpen: showLoginModal,
                onClose: () => setShowLoginModal(false),
                onLoginSuccess: handleLoginSuccess
            }),

            // Footer
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
                            React.createElement('li', null, 'mehmet.saygin@student.htldornbirn.at'),
                            React.createElement('li', null, 'HTL Dornbirn'),
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
});