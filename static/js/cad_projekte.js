// Warte bis alle Bibliotheken geladen sind
window.addEventListener('DOMContentLoaded', () => {
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
        console.error('React ist nicht geladen!');
        return;
    }
    
    const { useState, useEffect, useRef } = React;

    // ============================================
    // KONFIGURATION - HIER ANPASSEN
    // ============================================
    
    // EmailJS Konfiguration (von emailjs.com)
    const EMAILJS_CONFIG = {
        serviceId: 'service_v351y86',      // Primär: Outlook
        backupServiceId: 'service_s4pcyvf', // Backup: Gmail
        templateId: 'template_nce99x6',
        publicKey: 'IIsxauIOXV1SLgD-O'
    };
    
    // Whitelist der erlaubten E-Mail-Adressen
    const AUTHORIZED_EMAILS = [
        'mehmet.saygin@student.htldornbirn.at',
        'maria.musterfrau@htldornbirn.at',
        'test@htldornbirn.at',
        'admin@htldornbirn.at',
    ];
    
    // ============================================
    // AUTHENTIFIZIERUNG SYSTEM
    // ============================================
    
    // EmailJS initialisieren
    if (window.emailjs) {
        emailjs.init(EMAILJS_CONFIG.publicKey);
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
        localStorage.setItem('cad_auth_session', JSON.stringify(session));
    }
    
    function loadSession() {
        try {
            const sessionData = localStorage.getItem('cad_auth_session');
            if (!sessionData) return null;
            
            const session = JSON.parse(sessionData);
            
            if (Date.now() > session.expiresAt) {
                localStorage.removeItem('cad_auth_session');
                return null;
            }
            
            if (!isEmailAuthorized(session.email)) {
                localStorage.removeItem('cad_auth_session');
                return null;
            }
            
            return session;
        } catch (e) {
            localStorage.removeItem('cad_auth_session');
            return null;
        }
    }
    
    function clearSession() {
        localStorage.removeItem('cad_auth_session');
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
        
        try {
            await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateId,
                {
                    to_email: email,
                    to_name: getNameFromEmail(email),
                    verification_code: code,
                    valid_minutes: '10'
                }
            );
            return { success: true };
        } catch (error) {
            console.error('E-Mail Fehler:', error);
            return { success: false, error: error.message };
        }
    }

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

    // Login Modal Component
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
                setError('Diese E-Mail-Adresse ist nicht für den Import berechtigt. Bitte kontaktieren Sie den Administrator.');
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
                    setSuccess('ENTWICKLUNGSMODUS: Code wurde in der Browser-Konsole angezeigt (F12)');
                } else {
                    setSuccess('Verifizierungscode wurde an ' + trimmedEmail + ' gesendet.');
                }
            } else {
                setError('Fehler beim Senden der E-Mail. Bitte versuchen Sie es erneut.');
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
                setError('Bitte geben Sie den vollständigen 6-stelligen Code ein.');
                return;
            }
            
            if (enteredCode === generatedCode) {
                saveSession(email.trim().toLowerCase());
                onLoginSuccess(email.trim().toLowerCase());
                onClose();
            } else {
                setError('Ungültiger Code. Bitte überprüfen Sie Ihre Eingabe.');
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
                if (result.devMode) {
                    setSuccess('Neuer Code in der Browser-Konsole (F12)');
                } else {
                    setSuccess('Neuer Code wurde gesendet.');
                }
            } else {
                setError('Fehler beim Senden. Bitte versuchen Sie es erneut.');
            }
        };
        
        if (!isOpen) return null;
        
        return React.createElement('div', {
            className: `modal-overlay ${isOpen ? 'active' : ''}`,
            onClick: onClose
        },
            React.createElement('div', {
                className: 'modal-content login-modal',
                onClick: (e) => e.stopPropagation()
            },
                React.createElement('div', {
                    className: 'modal-close',
                    onClick: onClose
                }, '×'),
                
                React.createElement('div', { className: 'modal-body' },
                    React.createElement('div', { className: 'login-header' },
                        React.createElement('div', { className: 'lock-icon' }, '🔐'),
                        React.createElement('h2', null, 
                            step === 'email' ? 'Lehrer-Anmeldung' : 'Code eingeben'
                        ),
                        React.createElement('p', null,
                            step === 'email' 
                                ? 'Melden Sie sich mit Ihrer autorisierten Schul-E-Mail an, um Projekte zu importieren.'
                                : 'Geben Sie den 6-stelligen Code ein, den wir an Ihre E-Mail gesendet haben.'
                        )
                    ),
                    
                    step === 'email' && React.createElement('form', {
                        className: 'login-form',
                        onSubmit: handleEmailSubmit
                    },
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'E-Mail-Adresse'),
                            React.createElement('input', {
                                type: 'email',
                                value: email,
                                onChange: (e) => setEmail(e.target.value),
                                placeholder: 'vorname.nachname@htldornbirn.at',
                                className: error ? 'error' : '',
                                autoFocus: true
                            })
                        ),
                        
                        error && React.createElement('div', { className: 'error-message' },
                            '⚠️ ', error
                        ),
                        
                        React.createElement('button', {
                            type: 'submit',
                            className: `login-btn ${loading ? 'loading' : ''}`,
                            disabled: loading
                        }, loading ? '' : 'Code anfordern')
                    ),
                    
                    step === 'verify' && React.createElement('div', { className: 'login-form' },
                        React.createElement('button', {
                            type: 'button',
                            className: 'login-btn back-btn',
                            onClick: () => setStep('email')
                        }, '← Zurück'),
                        
                        success && React.createElement('div', { className: 'success-message' },
                            '✓ ', success
                        ),
                        
                        React.createElement('div', {
                            className: 'verification-code-inputs',
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
                                    className: digit ? 'filled' : '',
                                    autoFocus: index === 0
                                })
                            )
                        ),
                        
                        error && React.createElement('div', { className: 'error-message', style: { textAlign: 'center', justifyContent: 'center' } },
                            '⚠️ ', error
                        ),
                        
                        React.createElement('button', {
                            type: 'button',
                            className: `login-btn ${loading ? 'loading' : ''}`,
                            onClick: handleVerifyCode,
                            disabled: loading || verificationCode.join('').length !== 6
                        }, 'Verifizieren'),
                        
                        React.createElement('div', { className: 'resend-code' },
                            resendTimer > 0
                                ? React.createElement('span', { className: 'resend-timer' },
                                    'Code erneut senden in ', resendTimer, 's'
                                )
                                : React.createElement('button', {
                                    type: 'button',
                                    onClick: handleResendCode,
                                    disabled: loading
                                }, 'Code erneut senden')
                        )
                    ),
                    
                    React.createElement('div', { className: 'login-footer' },
                        React.createElement('p', null, 
                            'Nur autorisierte Lehrkräfte können Projekte importieren.'
                        )
                    )
                )
            )
        );
    }

    // Tags Input Component
    function TagsInput({ tags, setTags, placeholder }) {
        const [inputValue, setInputValue] = useState('');
        
        const handleKeyDown = (e) => {
            if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                const newTag = inputValue.trim();
                if (newTag && !tags.includes(newTag)) {
                    setTags([...tags, newTag]);
                }
                setInputValue('');
            } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
                setTags(tags.slice(0, -1));
            }
        };
        
        const removeTag = (indexToRemove) => {
            setTags(tags.filter((_, index) => index !== indexToRemove));
        };
        
        return React.createElement('div', { className: 'tags-input-container' },
            tags.map((tag, index) =>
                React.createElement('span', { key: index, className: 'tag-chip' },
                    tag,
                    React.createElement('span', {
                        className: 'remove-tag',
                        onClick: () => removeTag(index)
                    }, '×')
                )
            ),
            React.createElement('input', {
                type: 'text',
                value: inputValue,
                onChange: (e) => setInputValue(e.target.value),
                onKeyDown: handleKeyDown,
                placeholder: tags.length === 0 ? placeholder : ''
            })
        );
    }

    // Features Editor Component
    function FeaturesEditor({ features, setFeatures }) {
        const addFeature = () => {
            setFeatures([...features, '']);
        };
        
        const updateFeature = (index, value) => {
            const newFeatures = [...features];
            newFeatures[index] = value;
            setFeatures(newFeatures);
        };
        
        const removeFeature = (index) => {
            setFeatures(features.filter((_, i) => i !== index));
        };
        
        return React.createElement('div', { className: 'features-editor' },
            features.map((feature, index) =>
                React.createElement('div', { key: index, className: 'feature-item-edit' },
                    React.createElement('input', {
                        type: 'text',
                        value: feature,
                        onChange: (e) => updateFeature(index, e.target.value),
                        placeholder: `Feature ${index + 1}`
                    }),
                    React.createElement('button', {
                        type: 'button',
                        onClick: () => removeFeature(index)
                    }, '×')
                )
            ),
            React.createElement('button', {
                type: 'button',
                className: 'add-feature-btn',
                onClick: addFeature
            }, '+ Feature hinzufügen')
        );
    }

    // Import Modal Component
    function ImportModal({ isOpen, onClose, onSave }) {
        const [formData, setFormData] = useState({
            title: '',
            description: '',
            category: 'Fusion 360',
            badge: '',
            complexity: 3,
            year: new Date().getFullYear().toString(),
            duration: '',
            team: '',
            image: '',
            tags: [],
            technologies: [],
            features: [''],
            challenges: '',
            outcome: ''
        });
        const [attachments, setAttachments] = useState([]);
        const fileInputRef = useRef(null);
        const imageInputRef = useRef(null);
        
        const categories = ['Fusion 360', 'SolidWorks', 'Inventor', 'Sonstiges'];
        
        const handleChange = (field, value) => {
            setFormData(prev => ({ ...prev, [field]: value }));
        };
        
        const handleImageUpload = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    handleChange('image', reader.result);
                };
                reader.readAsDataURL(file);
            }
        };
        
        const handleFileUpload = (e) => {
            const files = Array.from(e.target.files);
            
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const newAttachment = {
                        name: file.name,
                        size: (file.size / 1024).toFixed(1) + ' KB',
                        type: file.type,
                        data: reader.result
                    };
                    setAttachments(prev => [...prev, newAttachment]);
                };
                reader.readAsDataURL(file);
            });
        };
        
        const removeAttachment = (index) => {
            setAttachments(prev => prev.filter((_, i) => i !== index));
        };
        
        const handleSubmit = () => {
            const newProject = {
                ...formData,
                id: Date.now(),
                attachments: attachments
            };
            onSave(newProject);
            setFormData({
                title: '',
                description: '',
                category: 'Fusion 360',
                badge: '',
                complexity: 3,
                year: new Date().getFullYear().toString(),
                duration: '',
                team: '',
                image: '',
                tags: [],
                technologies: [],
                features: [''],
                challenges: '',
                outcome: ''
            });
            setAttachments([]);
            onClose();
        };
        
        if (!isOpen) return null;
        
        return React.createElement('div', {
            className: `modal-overlay ${isOpen ? 'active' : ''}`,
            onClick: onClose
        },
            React.createElement('div', {
                className: 'modal-content import-modal',
                onClick: (e) => e.stopPropagation()
            },
                React.createElement('div', {
                    className: 'modal-close',
                    onClick: onClose
                }, '×'),
                
                React.createElement('div', { className: 'modal-body' },
                    React.createElement('div', { className: 'import-header' },
                        React.createElement('h2', null, 'Neues Projekt importieren'),
                        React.createElement('p', null, 'Fügen Sie alle Projektdetails hinzu')
                    ),
                    
                    React.createElement('div', { className: 'form-grid' },
                        React.createElement('div', { className: 'form-group full-width' },
                            React.createElement('label', null, 'Projektbild'),
                            React.createElement('div', {
                                className: `image-upload-area ${formData.image ? 'has-image' : ''}`,
                                onClick: () => imageInputRef.current.click()
                            },
                                formData.image
                                    ? React.createElement('img', { src: formData.image, alt: 'Preview' })
                                    : React.createElement(React.Fragment, null,
                                        React.createElement('div', { className: 'upload-icon' }, '📷'),
                                        React.createElement('p', { className: 'upload-text' },
                                            'Klicken zum ',
                                            React.createElement('span', null, 'Hochladen'),
                                            ' oder Drag & Drop'
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
                        
                        React.createElement('div', { className: 'form-group full-width' },
                            React.createElement('label', null, 'Projekttitel'),
                            React.createElement('input', {
                                type: 'text',
                                value: formData.title,
                                onChange: (e) => handleChange('title', e.target.value),
                                placeholder: 'z.B. Hydraulischer Roboterarm'
                            })
                        ),
                        
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'Badge (Hervorhebung)'),
                            React.createElement('input', {
                                type: 'text',
                                value: formData.badge,
                                onChange: (e) => handleChange('badge', e.target.value),
                                placeholder: 'z.B. Neu, Innovation, Prototyp'
                            })
                        ),
                        
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'Kategorie'),
                            React.createElement('select', {
                                value: formData.category,
                                onChange: (e) => handleChange('category', e.target.value)
                            },
                                categories.map(cat =>
                                    React.createElement('option', { key: cat, value: cat }, cat)
                                )
                            )
                        ),
                        
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'Schulstufe (1-5)'),
                            React.createElement('div', { className: 'complexity-selector' },
                                [1, 2, 3, 4, 5].map(num =>
                                    React.createElement('button', {
                                        key: num,
                                        type: 'button',
                                        className: `complexity-btn ${formData.complexity >= num ? 'active' : ''}`,
                                        onClick: () => handleChange('complexity', num)
                                    }, num)
                                )
                            )
                        ),
                        
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'Jahr'),
                            React.createElement('input', {
                                type: 'text',
                                value: formData.year,
                                onChange: (e) => handleChange('year', e.target.value),
                                placeholder: '2025'
                            })
                        ),
                        
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'Dauer'),
                            React.createElement('input', {
                                type: 'text',
                                value: formData.duration,
                                onChange: (e) => handleChange('duration', e.target.value),
                                placeholder: 'z.B. 6 Monate'
                            })
                        ),
                        
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'Teamgröße'),
                            React.createElement('input', {
                                type: 'text',
                                value: formData.team,
                                onChange: (e) => handleChange('team', e.target.value),
                                placeholder: 'z.B. 4 Personen'
                            })
                        ),
                        
                        React.createElement('div', { className: 'form-group full-width' },
                            React.createElement('label', null, 'Beschreibung'),
                            React.createElement('textarea', {
                                value: formData.description,
                                onChange: (e) => handleChange('description', e.target.value),
                                placeholder: 'Kurze Projektbeschreibung...'
                            })
                        ),
                        
                        React.createElement('div', { className: 'form-group full-width' },
                            React.createElement('label', null, 'Tags (Enter zum Hinzufügen)'),
                            React.createElement(TagsInput, {
                                tags: formData.tags,
                                setTags: (tags) => handleChange('tags', tags),
                                placeholder: 'z.B. Mechanik, Hydraulik...'
                            })
                        ),
                        
                        React.createElement('div', { className: 'form-group full-width' },
                            React.createElement('label', null, 'Technologien (Enter zum Hinzufügen)'),
                            React.createElement(TagsInput, {
                                tags: formData.technologies,
                                setTags: (tech) => handleChange('technologies', tech),
                                placeholder: 'z.B. Fusion 360, AutoCAD...'
                            })
                        ),
                        
                        React.createElement('div', { className: 'form-section-title' }, 'Projektdetails'),
                        
                        React.createElement('div', { className: 'form-group full-width' },
                            React.createElement('label', null, 'Features & Highlights'),
                            React.createElement(FeaturesEditor, {
                                features: formData.features,
                                setFeatures: (features) => handleChange('features', features)
                            })
                        ),
                        
                        React.createElement('div', { className: 'form-group full-width' },
                            React.createElement('label', null, 'Herausforderungen'),
                            React.createElement('textarea', {
                                value: formData.challenges,
                                onChange: (e) => handleChange('challenges', e.target.value),
                                placeholder: 'Welche Herausforderungen gab es?'
                            })
                        ),
                        
                        React.createElement('div', { className: 'form-group full-width' },
                            React.createElement('label', null, 'Ergebnis'),
                            React.createElement('textarea', {
                                value: formData.outcome,
                                onChange: (e) => handleChange('outcome', e.target.value),
                                placeholder: 'Was wurde erreicht?'
                            })
                        ),
                        
                        React.createElement('div', { className: 'form-group full-width' },
                            React.createElement('label', null, 'Dateien anhängen'),
                            React.createElement('div', { className: 'file-attachments' },
                                attachments.length > 0 && React.createElement('div', { className: 'file-list' },
                                    attachments.map((file, index) =>
                                        React.createElement('span', { key: index, className: 'file-chip' },
                                            '📎 ', file.name, ' (', file.size, ')',
                                            React.createElement('span', {
                                                className: 'remove-file',
                                                onClick: () => removeAttachment(index)
                                            }, ' ×')
                                        )
                                    )
                                ),
                                React.createElement('button', {
                                    type: 'button',
                                    className: 'add-feature-btn',
                                    onClick: () => fileInputRef.current.click()
                                }, '+ Dateien hinzufügen'),
                                React.createElement('input', {
                                    ref: fileInputRef,
                                    type: 'file',
                                    multiple: true,
                                    style: { display: 'none' },
                                    onChange: handleFileUpload
                                })
                            )
                        )
                    ),
                    
                    React.createElement('div', { className: 'form-actions' },
                        React.createElement('button', {
                            type: 'button',
                            className: 'btn btn-secondary',
                            onClick: onClose
                        }, 'Abbrechen'),
                        React.createElement('button', {
                            type: 'button',
                            className: 'btn btn-primary',
                            onClick: handleSubmit
                        }, 'Projekt speichern')
                    )
                )
            )
        );
    }

    // Project Detail Modal Component
    function ProjectModal({ project, onClose }) {
        if (!project) return null;
        
        return React.createElement('div', {
            className: `modal-overlay ${project ? 'active' : ''}`,
            onClick: onClose
        },
            React.createElement('div', {
                className: 'modal-content',
                onClick: (e) => e.stopPropagation()
            },
                React.createElement('div', {
                    className: 'modal-close',
                    onClick: onClose
                }, '×'),
                React.createElement('div', { className: 'modal-image' },
                    React.createElement('img', { src: project.image, alt: project.title })
                ),
                React.createElement('div', { className: 'modal-body' },
                    React.createElement('h2', { className: 'modal-title' }, project.title),
                    React.createElement('p', { className: 'modal-description' }, project.description),
                    
                    React.createElement('div', { className: 'modal-details' },
                        React.createElement('div', { className: 'detail-item' },
                            React.createElement('div', { className: 'detail-label' }, 'Jahr'),
                            React.createElement('div', { className: 'detail-value' }, project.year)
                        ),
                        React.createElement('div', { className: 'detail-item' },
                            React.createElement('div', { className: 'detail-label' }, 'Dauer'),
                            React.createElement('div', { className: 'detail-value' }, project.duration)
                        ),
                        React.createElement('div', { className: 'detail-item' },
                            React.createElement('div', { className: 'detail-label' }, 'Team'),
                            React.createElement('div', { className: 'detail-value' }, project.team)
                        ),
                        React.createElement('div', { className: 'detail-item' },
                            React.createElement('div', { className: 'detail-label' }, 'Software'),
                            React.createElement('div', { className: 'detail-value' }, project.category)
                        )
                    ),

                    React.createElement('div', { className: 'modal-section' },
                        React.createElement('h3', null, 'Technologien'),
                        React.createElement('div', { className: 'tech-stack' },
                            project.technologies.map((tech, i) =>
                                React.createElement('div', { key: i, className: 'tech-item' }, tech)
                            )
                        )
                    ),

                    React.createElement('div', { className: 'modal-section' },
                        React.createElement('h3', null, 'Features & Spezifikationen'),
                        React.createElement('ul', null,
                            project.features.filter(f => f).map((feature, i) =>
                                React.createElement('li', { key: i }, feature)
                            )
                        )
                    ),

                    React.createElement('div', { className: 'modal-section' },
                        React.createElement('h3', null, 'Herausforderungen'),
                        React.createElement('p', { className: 'modal-text' },
                            project.challenges
                        )
                    ),

                    React.createElement('div', { className: 'modal-section' },
                        React.createElement('h3', null, 'Ergebnis'),
                        React.createElement('p', { className: 'modal-text' },
                            project.outcome
                        )
                    ),
                    
                    project.attachments && project.attachments.length > 0 && React.createElement('div', { className: 'modal-section' },
                        React.createElement('h3', null, 'Anhänge'),
                        React.createElement('div', { className: 'attachments-list' },
                            project.attachments.map((file, i) =>
                                React.createElement('div', { 
                                    key: i, 
                                    className: 'attachment-item'
                                },
                                    React.createElement('div', { className: 'attachment-info' },
                                        React.createElement('span', { className: 'attachment-icon' }, 
                                            file.type && file.type.includes('pdf') ? '📄' :
                                            file.type && file.type.includes('image') ? '🖼️' :
                                            file.type && file.type.includes('video') ? '🎬' :
                                            '📎'
                                        ),
                                        React.createElement('div', { className: 'attachment-details' },
                                            React.createElement('span', { className: 'attachment-name' }, file.name),
                                            React.createElement('span', { className: 'attachment-size' }, file.size)
                                        )
                                    ),
                                    React.createElement('a', { 
                                        className: 'download-btn',
                                        href: file.data,
                                        download: file.name,
                                        onClick: (e) => e.stopPropagation(),
                                        title: 'Herunterladen'
                                    },
                                        React.createElement('svg', {
                                            xmlns: 'http://www.w3.org/2000/svg',
                                            viewBox: '0 0 24 24',
                                            fill: 'none',
                                            stroke: 'currentColor',
                                            strokeWidth: '2'
                                        },
                                            React.createElement('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
                                            React.createElement('polyline', { points: '7 10 12 15 17 10' }),
                                            React.createElement('line', { x1: '12', y1: '15', x2: '12', y2: '3' })
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        );
    }

    // Navigation Component
    function Navigation({ onImportClick, isAuthenticated, userEmail, onLogout }) {
        const [scrolled, setScrolled] = useState(false);
        
        useEffect(() => {
            const handleScroll = () => {
                setScrolled(window.scrollY > 50);
            };
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }, []);
        
        const userName = userEmail ? getNameFromEmail(userEmail) : '';
        const userInitials = userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase() : '';
        
        return React.createElement('nav', { id: 'navbar', className: scrolled ? 'scrolled' : '' },
            React.createElement('div', { className: 'nav-content' },
                React.createElement('div', { className: 'logo' }, '📐 IEM CAD'),
                React.createElement('ul', { className: 'nav-links' },
                    React.createElement('li', null, React.createElement('a', { href: '#', className: 'nav-link' }, 'Home')),
                    React.createElement('li', null, React.createElement('a', { href: '#', className: 'nav-link active' }, 'Projekte')),
                    React.createElement('li', null, React.createElement('a', { href: '#', className: 'nav-link' }, 'Info')),
                    React.createElement('li', null, 
                        React.createElement('span', { 
                            className: 'nav-link',
                            onClick: onImportClick,
                            style: { cursor: 'pointer' }
                        }, 'Import')
                    ),
                    isAuthenticated && React.createElement('li', null,
                        React.createElement('div', { className: 'user-badge' },
                            React.createElement('div', { className: 'avatar' }, userInitials),
                            React.createElement('div', { className: 'user-info' },
                                React.createElement('span', { className: 'user-name' }, userName),
                                React.createElement('span', { className: 'user-role' }, 'Lehrkraft')
                            ),
                            React.createElement('button', {
                                className: 'logout-btn',
                                onClick: onLogout,
                                title: 'Abmelden'
                            }, '⏻')
                        )
                    )
                )
            )
        );
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
        const [projects, setProjects] = useState(projectsData);
        const [activeFilter, setActiveFilter] = useState('Alle');
        const [selectedProject, setSelectedProject] = useState(null);
        const [showImportModal, setShowImportModal] = useState(false);
        const [showLoginModal, setShowLoginModal] = useState(false);
        
        // Auth State
        const [isAuthenticated, setIsAuthenticated] = useState(false);
        const [userEmail, setUserEmail] = useState('');
        
        useEffect(() => {
            const session = loadSession();
            if (session) {
                setIsAuthenticated(true);
                setUserEmail(session.email);
            }
        }, []);

        const categories = ['Alle', 'Fusion 360', 'SolidWorks', 'Inventor'];
        
        const filteredProjects = activeFilter === 'Alle' 
            ? projects 
            : projects.filter(p => p.category === activeFilter || p.tags.some(tag => tag.toLowerCase().includes(activeFilter.toLowerCase())));

        const addProject = (newProject) => {
            setProjects(prev => [newProject, ...prev]);
        };
        
        const handleImportClick = () => {
            if (isAuthenticated) {
                setShowImportModal(true);
            } else {
                setShowLoginModal(true);
            }
        };
        
        const handleLoginSuccess = (email) => {
            setIsAuthenticated(true);
            setUserEmail(email);
            setShowImportModal(true);
        };
        
        const handleLogout = () => {
            clearSession();
            setIsAuthenticated(false);
            setUserEmail('');
        };

        return React.createElement(React.Fragment, null,
            React.createElement(Navigation, { 
                onImportClick: handleImportClick,
                isAuthenticated: isAuthenticated,
                userEmail: userEmail,
                onLogout: handleLogout
            }),
            
            React.createElement('section', { className: 'hero' },
                React.createElement('div', { id: 'canvas-container' },
                    React.createElement(ThreeScene)
                ),
                React.createElement('div', { className: 'hero-content' },
                    React.createElement('h1', null, 'CAD Design'),
                    React.createElement('p', { className: 'hero-subtitle' }, 'Computer Aided Design'),
                    React.createElement('div', { className: 'stats-bar' },
                        React.createElement('div', { className: 'stat-item' },
                            React.createElement('div', { className: 'stat-number' }, projects.length),
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
                        filteredProjects.map((project, index) =>
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
                    
                    filteredProjects.length === 0 && React.createElement('div', { className: 'no-projects' },
                        React.createElement('h3', null, 'Keine Projekte gefunden'),
                        React.createElement('p', null, 'Versuchen Sie einen anderen Filter oder fügen Sie neue Projekte hinzu.')
                    )
                )
            ),

            React.createElement(ProjectModal, {
                project: selectedProject,
                onClose: () => setSelectedProject(null)
            }),

            React.createElement(ImportModal, {
                isOpen: showImportModal,
                onClose: () => setShowImportModal(false),
                onSave: addProject
            }),
            
            React.createElement(LoginModal, {
                isOpen: showLoginModal,
                onClose: () => setShowLoginModal(false),
                onLoginSuccess: handleLoginSuccess
            }),

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