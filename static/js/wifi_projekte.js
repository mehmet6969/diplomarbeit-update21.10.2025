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
    'msaygin29@gmail.com',
    'direktor@htldornbirn.at',
    // Füge weitere Lehrer hier hinzu:
    // 'vorname.nachname@htldornbirn.at',
];

// ============================================
// AUTHENTIFIZIERUNG SYSTEM
// ============================================

// EmailJS initialisieren
if (window.emailjs) {
    emailjs.init(EMAILJS_CONFIG.publicKey);
}

// Prüft ob E-Mail in der Whitelist ist
function isEmailAuthorized(email) {
    return AUTHORIZED_EMAILS.some(
        authorizedEmail => authorizedEmail.toLowerCase() === email.toLowerCase()
    );
}

// Generiert 6-stelligen Verifizierungscode
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Speichert Session im localStorage
function saveSession(email) {
    const session = {
        email: email,
        timestamp: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 Stunden gültig
    };
    localStorage.setItem('drehen_auth_session', JSON.stringify(session));
}

// Lädt Session aus localStorage
function loadSession() {
    try {
        const sessionData = localStorage.getItem('drehen_auth_session');
        if (!sessionData) return null;
        
        const session = JSON.parse(sessionData);
        
        if (Date.now() > session.expiresAt) {
            localStorage.removeItem('drehen_auth_session');
            return null;
        }
        
        if (!isEmailAuthorized(session.email)) {
            localStorage.removeItem('drehen_auth_session');
            return null;
        }
        
        return session;
    } catch (e) {
        localStorage.removeItem('drehen_auth_session');
        return null;
    }
}

// Löscht Session
function clearSession() {
    localStorage.removeItem('drehen_auth_session');
}

// Extrahiert Namen aus E-Mail
function getNameFromEmail(email) {
    const localPart = email.split('@')[0];
    const parts = localPart.split('.');
    if (parts.length >= 2) {
        return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    }
    return localPart;
}

// Sendet Verifizierungs-E-Mail
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
    
    // Versuche primären Service (Outlook)
    try {
        await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams
        );
        console.log('E-Mail gesendet über primären Service');
        return { success: true };
    } catch (primaryError) {
        console.warn('Primärer Service fehlgeschlagen, versuche Backup...', primaryError);
        
        // Versuche Backup Service (Gmail)
        if (EMAILJS_CONFIG.backupServiceId) {
            try {
                await emailjs.send(
                    EMAILJS_CONFIG.backupServiceId,
                    EMAILJS_CONFIG.templateId,
                    templateParams
                );
                console.log('E-Mail gesendet über Backup Service');
                return { success: true };
            } catch (backupError) {
                console.error('Beide Services fehlgeschlagen:', backupError);
                return { success: false, error: backupError.message };
            }
        }
        
        return { success: false, error: primaryError.message };
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
            
            const geometry = new THREE.TorusGeometry(2, 0.6, 16, 100);
            const material = new THREE.MeshStandardMaterial({
                color: 0x2E5EAA,
                metalness: 0.8,
                roughness: 0.2,
                wireframe: false
            });
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
            
            const wireframeGeometry = new THREE.TorusGeometry(2.1, 0.6, 16, 100);
            const wireframeMaterial = new THREE.MeshBasicMaterial({
                color: 0x4A7BC8,
                wireframe: true,
                transparent: true,
                opacity: 0.3
            });
            const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
            scene.add(wireframeMesh);
            
            const particlesGeometry = new THREE.BufferGeometry();
            const particlesCount = 150;
            const positions = new Float32Array(particlesCount * 3);
            
            for (let i = 0; i < particlesCount * 3; i++) {
                positions[i] = (Math.random() - 0.5) * 10;
            }
            
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const particlesMaterial = new THREE.PointsMaterial({
                color: 0x2E5EAA,
                size: 0.05,
                transparent: true,
                opacity: 0.6
            });
            const particles = new THREE.Points(particlesGeometry, particlesMaterial);
            scene.add(particles);
            
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(5, 5, 5);
            scene.add(directionalLight);
            
            const pointLight = new THREE.PointLight(0x2E5EAA, 2);
            pointLight.position.set(-5, -5, -5);
            scene.add(pointLight);
            
            camera.position.z = 6;
            
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
                
                targetX += (mouseX * 0.3 - targetX) * 0.05;
                targetY += (mouseY * 0.3 - targetY) * 0.05;
                
                mesh.rotation.x += 0.002;
                mesh.rotation.y += 0.003;
                wireframeMesh.rotation.x += 0.002;
                wireframeMesh.rotation.y += 0.003;
                particles.rotation.y += 0.001;
                
                mesh.position.x = targetX;
                mesh.position.y = targetY;
                wireframeMesh.position.x = targetX;
                wireframeMesh.position.y = targetY;
                
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
                geometry.dispose();
                material.dispose();
                wireframeGeometry.dispose();
                wireframeMaterial.dispose();
                particlesGeometry.dispose();
                particlesMaterial.dispose();
                renderer.dispose();
            };
        } catch (error) {
            console.error('Three.js error:', error);
        }
    }, []);
    
    return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}

// ============================================
// PROJECT DATA
// ============================================

const initialProjectsData = [
    {
        id: 1,
        title: "Präzisions-Turbinenwelle",
        image: "../../static/images/pexels1.jpg",
        description: "Hochpräzise Turbinenwelle aus Inconel 718 mit komplexer Geometrie und extremen Toleranzen für Luftfahrtanwendung.",
        category: "CNC-Drehen",
        badge: "Luft & Raumfahrt",
        precision: "±0.005mm",
        year: "2024",
        duration: "4 Monate",
        material: "Inconel 718",
        specs: {
            durchmesser: "Ø 120mm",
            laenge: "450mm",
            toleranz: "IT6",
            oberflaeche: "Ra 0.8"
        },
        tags: ["Aerospace", "Hochpräzision", "Sondermaterial"],
        features: [
            "5-Achs simultane Bearbeitung",
            "Prozessstabile Zerspanung von Inconel",
            "In-Prozess Messtechnik zur Qualitätssicherung",
            "Thermische Kompensation während Bearbeitung",
            "Vibrationsgedämpfte Aufspannung"
        ],
        challenges: "Bearbeitung von schwer zerspanbarem Inconel bei höchsten Toleranzanforderungen und komplexer Geometrie",
        outcome: "Alle Toleranzen eingehalten, Qualifizierung für Serienfertigung erfolgreich",
        attachments: []
    },
    {
        id: 2,
        title: "Medizinisches Implantat-System",
        image: "../../static/images/pexels2.jpg",
        description: "Biokompatibles Hüftimplantat aus Titan Grade 5 mit komplexer Oberflächenstruktur für optimale Osseointegration.",
        category: "CNC-Fräsen",
        badge: "Medizintechnik",
        precision: "±0.01mm",
        year: "2024",
        duration: "6 Monate",
        material: "Titan Grade 5",
        specs: {
            durchmesser: "Ø 45mm",
            laenge: "180mm",
            toleranz: "IT7",
            oberflaeche: "Ra 0.4"
        },
        tags: ["Medizin", "Biokompatibel", "5-Achs"],
        features: [
            "5-Achs Simultanfräsen für organische Formen",
            "Spezielle Oberflächenstruktur für Knochenwachstum",
            "100 Prozent Qualitätskontrolle mit Koordinatenmessgerät",
            "Reinraumfertigung nach ISO 13485",
            "Rückverfolgbarkeit über Seriennummer"
        ],
        challenges: "Titanbearbeitung mit extremer Präzision bei komplexer 3D-Geometrie und strengsten Hygieneanforderungen",
        outcome: "Medizinische Zulassung erhalten, in klinischer Erprobung",
        attachments: []
    },
    {
        id: 3,
        title: "Hochleistungs-Zahnrad",
        image: "../../static/images/pexels3.jpg",
        description: "Präzisionszahnrad für Industriegetriebe mit gehärteten Flanken und optimierter Verzahnungsgeometrie.",
        category: "CNC-Fräsen",
        badge: "Antriebstechnik",
        precision: "±0.008mm",
        year: "2024",
        duration: "5 Monate",
        material: "16MnCr5",
        specs: {
            modul: "m = 4",
            zaehnezahl: "z = 48",
            toleranz: "DIN 5",
            haerte: "58-62 HRC"
        },
        tags: ["Verzahnung", "Wälzfräsen", "Gehärtet"],
        features: [
            "Wälzfräsen mit Profilkorrektur",
            "Induktive Randschichthärtung",
            "Zahnflankenmesstechnik mit Verzahnungsmessgerät",
            "Optimierte Evolventengeometrie",
            "Laufgeräuschoptimierung durch Mikrogeometrie"
        ],
        challenges: "Einhaltung höchster Verzahnungsqualität bei gleichzeitiger Randschichthärtung ohne Verzug",
        outcome: "Geräuschreduzierung um 40 Prozent, Lebensdauer verdoppelt",
        attachments: []
    },
    {
        id: 4,
        title: "Motorsport Kurbelwelle",
        image: "../../static/images/pexels4.jpg",
        description: "Leichtbau-Kurbelwelle für Rennmotor aus geschmiedetem Chrom-Molybdän-Stahl mit integrierten Ausgleichsgewichten.",
        category: "CNC-Drehen",
        badge: "Motorsport",
        precision: "±0.003mm",
        year: "2025",
        duration: "7 Monate",
        material: "42CrMo4",
        specs: {
            hubzapfen: "Ø 58mm",
            gesamtlaenge: "520mm",
            gewicht: "12.8 kg",
            oberflaeche: "Ra 0.6"
        },
        tags: ["Racing", "Leichtbau", "Hochdrehzahl"],
        features: [
            "Gewichtsoptimierung durch Topologieanalyse",
            "Dynamische Auswuchtung bis 12000 U/min",
            "Mikropolierte Lagerflächen",
            "FEM-gestützte Konstruktion",
            "Röntgenprüfung auf innere Defekte"
        ],
        challenges: "Maximale Gewichtsreduktion bei Sicherstellung der Festigkeit unter extremen Drehzahlen",
        outcome: "Gewichtsersparnis 25 Prozent, erfolgreich im Renneinsatz getestet",
        attachments: []
    },
    {
        id: 5,
        title: "Optik-Präzisionsträger",
        image: "../../static/images/pexels5.jpg",
        description: "Ultra-präziser Linsenträger für Astronomie-Teleskop mit nanometer-genauer Positionierung.",
        category: "CNC-Fräsen",
        badge: "Optik",
        precision: "±0.002mm",
        year: "2024",
        duration: "8 Monate",
        material: "Invar 36",
        specs: {
            durchmesser: "Ø 280mm",
            parallelitaet: "0.003mm",
            ebenheit: "0.002mm",
            oberflaeche: "Ra 0.2"
        },
        tags: ["Ultrapräzision", "Astronomie", "Invar"],
        features: [
            "Temperaturkompensation durch Invar-Werkstoff",
            "Diamantfeinbearbeitung für optische Oberflächen",
            "Interferometrische Vermessung",
            "Klimatisierte Fertigung bei 20±0.5°C",
            "Schwingungsgedämpfte Aufstellung"
        ],
        challenges: "Nanometer-Präzision über große Flächen bei minimalen thermischen Einflüssen",
        outcome: "Spezifikationen übertroffen, Installation in Observatorium erfolgt",
        attachments: []
    },
    {
        id: 6,
        title: "Hydraulik-Ventilblock",
        image: "../../static/images/pexels1.jpg",
        description: "Komplexer Mehrfach-Ventilblock mit über 40 Bohrungen und innenliegenden Kanälen für Baumaschine.",
        category: "CNC-Fräsen",
        badge: "Hydraulik",
        precision: "±0.02mm",
        year: "2024",
        duration: "5 Monate",
        material: "34CrNiMo6",
        specs: {
            abmessungen: "320x180x140mm",
            bohrungen: "48 Stück",
            druck: "350 bar",
            gewicht: "42 kg"
        },
        tags: ["Hydraulik", "Komplex", "Hochdruck"],
        features: [
            "Tiefbohren mit Innenkühlung",
            "Kreuzbohrungen mit Entgratung",
            "Druckprüfung bei 525 bar (1.5x Betriebsdruck)",
            "3D-koordinatengesteuerte Bohrpositionen",
            "Oberflächenversiegelung gegen Korrosion"
        ],
        challenges: "Positionsgenaue Kreuzbohrungen ohne Kollision bei kompakter Bauweise",
        outcome: "Alle Drucktests bestanden, Serie läuft mit null Reklamationen",
        attachments: []
    }
];

// ============================================
// LOGIN MODAL COMPONENT
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
    
    return (
        <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
            <div className="modal-content login-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-close" onClick={onClose}>×</div>
                
                <div className="modal-body">
                    <div className="login-header">
                        <div className="lock-icon">🔐</div>
                        <h2>{step === 'email' ? 'Lehrer-Anmeldung' : 'Code eingeben'}</h2>
                        <p>
                            {step === 'email' 
                                ? 'Melden Sie sich mit Ihrer autorisierten Schul-E-Mail an, um Projekte zu importieren.'
                                : 'Geben Sie den 6-stelligen Code ein, den wir an Ihre E-Mail gesendet haben.'
                            }
                        </p>
                    </div>
                    
                    {step === 'email' && (
                        <form className="login-form" onSubmit={handleEmailSubmit}>
                            <div className="form-group">
                                <label>E-Mail-Adresse</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="vorname.nachname@htldornbirn.at"
                                    className={error ? 'error' : ''}
                                    autoFocus
                                />
                            </div>
                            
                            {error && <div className="error-message">⚠️ {error}</div>}
                            
                            <button
                                type="submit"
                                className={`login-btn ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? '' : 'Code anfordern'}
                            </button>
                        </form>
                    )}
                    
                    {step === 'verify' && (
                        <div className="login-form">
                            <button
                                type="button"
                                className="login-btn back-btn"
                                onClick={() => setStep('email')}
                            >
                                ← Zurück
                            </button>
                            
                            {success && <div className="success-message">✓ {success}</div>}
                            
                            <div className="verification-code-inputs" onPaste={handleCodePaste}>
                                {verificationCode.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => codeInputRefs.current[index] = el}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleCodeInput(index, e.target.value)}
                                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                                        className={digit ? 'filled' : ''}
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>
                            
                            {error && <div className="error-message" style={{ textAlign: 'center', justifyContent: 'center' }}>⚠️ {error}</div>}
                            
                            <button
                                type="button"
                                className={`login-btn ${loading ? 'loading' : ''}`}
                                onClick={handleVerifyCode}
                                disabled={loading || verificationCode.join('').length !== 6}
                            >
                                Verifizieren
                            </button>
                            
                            <div className="resend-code">
                                {resendTimer > 0
                                    ? <span className="resend-timer">Code erneut senden in {resendTimer}s</span>
                                    : <button type="button" onClick={handleResendCode} disabled={loading}>Code erneut senden</button>
                                }
                            </div>
                        </div>
                    )}
                    
                    <div className="login-footer">
                        <p>Nur autorisierte Lehrkräfte können Projekte importieren.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// TAGS INPUT COMPONENT
// ============================================

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
    
    return (
        <div className="tags-input-container">
            {tags.map((tag, index) => (
                <span key={index} className="tag-chip">
                    {tag}
                    <span className="remove-tag" onClick={() => removeTag(index)}>×</span>
                </span>
            ))}
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tags.length === 0 ? placeholder : ''}
            />
        </div>
    );
}

// ============================================
// FEATURES EDITOR COMPONENT
// ============================================

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
    
    return (
        <div className="features-editor">
            {features.map((feature, index) => (
                <div key={index} className="feature-item-edit">
                    <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder={`Feature ${index + 1}`}
                    />
                    <button type="button" onClick={() => removeFeature(index)}>×</button>
                </div>
            ))}
            <button type="button" className="add-feature-btn" onClick={addFeature}>
                + Feature hinzufügen
            </button>
        </div>
    );
}

// ============================================
// SPECS EDITOR COMPONENT
// ============================================

function SpecsEditor({ specs, setSpecs }) {
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');
    
    const addSpec = () => {
        if (newKey.trim() && newValue.trim()) {
            setSpecs({ ...specs, [newKey.trim()]: newValue.trim() });
            setNewKey('');
            setNewValue('');
        }
    };
    
    const removeSpec = (key) => {
        const newSpecs = { ...specs };
        delete newSpecs[key];
        setSpecs(newSpecs);
    };
    
    return (
        <div className="specs-editor">
            {Object.entries(specs).map(([key, value]) => (
                <div key={key} className="spec-item-edit">
                    <span className="spec-key">{key}:</span>
                    <span className="spec-value">{value}</span>
                    <button type="button" onClick={() => removeSpec(key)}>×</button>
                </div>
            ))}
            <div className="add-spec-row">
                <input
                    type="text"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="Name (z.B. Durchmesser)"
                />
                <input
                    type="text"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="Wert (z.B. Ø 120mm)"
                />
                <button type="button" className="add-spec-btn" onClick={addSpec}>+</button>
            </div>
        </div>
    );
}

// ============================================
// IMPORT MODAL COMPONENT
// ============================================

function ImportModal({ isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'CNC-Drehen',
        badge: '',
        precision: '',
        year: new Date().getFullYear().toString(),
        duration: '',
        material: '',
        image: '',
        tags: [],
        specs: {},
        features: [''],
        challenges: '',
        outcome: ''
    });
    const [attachments, setAttachments] = useState([]);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    
    const categories = ['CNC-Drehen', 'CNC-Fräsen'];
    
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
        // Reset form
        setFormData({
            title: '',
            description: '',
            category: 'CNC-Drehen',
            badge: '',
            precision: '',
            year: new Date().getFullYear().toString(),
            duration: '',
            material: '',
            image: '',
            tags: [],
            specs: {},
            features: [''],
            challenges: '',
            outcome: ''
        });
        setAttachments([]);
        onClose();
    };
    
    if (!isOpen) return null;
    
    return (
        <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
            <div className="modal-content import-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-close" onClick={onClose}>×</div>
                
                <div className="modal-body">
                    <div className="import-header">
                        <h2>Neues Projekt importieren</h2>
                        <p>Fügen Sie alle Projektdetails hinzu</p>
                    </div>
                    
                    <div className="form-grid">
                        {/* Image Upload */}
                        <div className="form-group full-width">
                            <label>Projektbild</label>
                            <div
                                className={`image-upload-area ${formData.image ? 'has-image' : ''}`}
                                onClick={() => imageInputRef.current.click()}
                            >
                                {formData.image
                                    ? <img src={formData.image} alt="Preview" />
                                    : <>
                                        <div className="upload-icon">📷</div>
                                        <p className="upload-text">
                                            Klicken zum <span>Hochladen</span> oder Drag & Drop
                                        </p>
                                    </>
                                }
                            </div>
                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleImageUpload}
                            />
                        </div>
                        
                        {/* Title */}
                        <div className="form-group full-width">
                            <label>Projekttitel</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                placeholder="z.B. Präzisions-Turbinenwelle"
                            />
                        </div>
                        
                        {/* Badge */}
                        <div className="form-group">
                            <label>Badge (Hervorhebung)</label>
                            <input
                                type="text"
                                value={formData.badge}
                                onChange={(e) => handleChange('badge', e.target.value)}
                                placeholder="z.B. Luft & Raumfahrt, Medizintechnik"
                            />
                        </div>
                        
                        {/* Category */}
                        <div className="form-group">
                            <label>Kategorie</label>
                            <select
                                value={formData.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Precision */}
                        <div className="form-group">
                            <label>Präzision</label>
                            <input
                                type="text"
                                value={formData.precision}
                                onChange={(e) => handleChange('precision', e.target.value)}
                                placeholder="z.B. ±0.005mm"
                            />
                        </div>
                        
                        {/* Year */}
                        <div className="form-group">
                            <label>Jahr</label>
                            <input
                                type="text"
                                value={formData.year}
                                onChange={(e) => handleChange('year', e.target.value)}
                                placeholder="2025"
                            />
                        </div>
                        
                        {/* Duration */}
                        <div className="form-group">
                            <label>Dauer</label>
                            <input
                                type="text"
                                value={formData.duration}
                                onChange={(e) => handleChange('duration', e.target.value)}
                                placeholder="z.B. 4 Monate"
                            />
                        </div>
                        
                        {/* Material */}
                        <div className="form-group">
                            <label>Material</label>
                            <input
                                type="text"
                                value={formData.material}
                                onChange={(e) => handleChange('material', e.target.value)}
                                placeholder="z.B. Inconel 718, Titan Grade 5"
                            />
                        </div>
                        
                        {/* Description */}
                        <div className="form-group full-width">
                            <label>Beschreibung</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Kurze Projektbeschreibung..."
                            />
                        </div>
                        
                        {/* Tags */}
                        <div className="form-group full-width">
                            <label>Tags (Enter zum Hinzufügen)</label>
                            <TagsInput
                                tags={formData.tags}
                                setTags={(tags) => handleChange('tags', tags)}
                                placeholder="z.B. Aerospace, Hochpräzision..."
                            />
                        </div>
                        
                        {/* Section Divider */}
                        <div className="form-section-title">Technische Spezifikationen</div>
                        
                        {/* Specs */}
                        <div className="form-group full-width">
                            <label>Spezifikationen</label>
                            <SpecsEditor
                                specs={formData.specs}
                                setSpecs={(specs) => handleChange('specs', specs)}
                            />
                        </div>
                        
                        {/* Section Divider */}
                        <div className="form-section-title">Projektdetails</div>
                        
                        {/* Features */}
                        <div className="form-group full-width">
                            <label>Features & Besonderheiten</label>
                            <FeaturesEditor
                                features={formData.features}
                                setFeatures={(features) => handleChange('features', features)}
                            />
                        </div>
                        
                        {/* Challenges */}
                        <div className="form-group full-width">
                            <label>Herausforderungen</label>
                            <textarea
                                value={formData.challenges}
                                onChange={(e) => handleChange('challenges', e.target.value)}
                                placeholder="Welche Herausforderungen gab es?"
                            />
                        </div>
                        
                        {/* Outcome */}
                        <div className="form-group full-width">
                            <label>Ergebnis</label>
                            <textarea
                                value={formData.outcome}
                                onChange={(e) => handleChange('outcome', e.target.value)}
                                placeholder="Was wurde erreicht?"
                            />
                        </div>
                        
                        {/* File Attachments */}
                        <div className="form-group full-width">
                            <label>Dateien anhängen</label>
                            <div className="file-attachments">
                                {attachments.length > 0 && (
                                    <div className="file-list">
                                        {attachments.map((file, index) => (
                                            <span key={index} className="file-chip">
                                                📎 {file.name} ({file.size})
                                                <span className="remove-file" onClick={() => removeAttachment(index)}> ×</span>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <button
                                    type="button"
                                    className="add-feature-btn"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    + Dateien hinzufügen
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    style={{ display: 'none' }}
                                    onChange={handleFileUpload}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Abbrechen
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                            Projekt speichern
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// MAIN APP COMPONENT
// ============================================

function App() {
    const [projects, setProjects] = useState(initialProjectsData);
    const [activeFilter, setActiveFilter] = useState('Alle');
    const [selectedProject, setSelectedProject] = useState(null);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    
    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    
    // Check for existing session on mount
    useEffect(() => {
        const session = loadSession();
        if (session) {
            setIsAuthenticated(true);
            setUserEmail(session.email);
        }
    }, []);

    const categories = ['Alle', 'CNC-Drehen', 'CNC-Fräsen'];
    
    const filteredProjects = activeFilter === 'Alle' 
        ? projects 
        : projects.filter(p => p.category === activeFilter);

    const addProject = (newProject) => {
        setProjects(prev => [newProject, ...prev]);
    };
    
    // Import Click Handler
    const handleImportClick = () => {
        if (isAuthenticated) {
            setShowImportModal(true);
        } else {
            setShowLoginModal(true);
        }
    };
    
    // Login Success Handler
    const handleLoginSuccess = (email) => {
        setIsAuthenticated(true);
        setUserEmail(email);
        setShowImportModal(true);
    };
    
    // Logout Handler
    const handleLogout = () => {
        clearSession();
        setIsAuthenticated(false);
        setUserEmail('');
    };
    
    const userName = userEmail ? getNameFromEmail(userEmail) : '';
    const userInitials = userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase() : '';

    return (
        <>
            {/* Navigation with Import and User Badge */}
            <nav id="navbar">
                <div className="nav-content">
                    <div className="logo">🔧 IEM</div>
                    <ul className="nav-links">
                        <li><a href="/" className="nav-link">Home</a></li>
                        <li><a href="/wifi_projekte" className="nav-link active">Projekte</a></li>
                        <li><a href="/drehen_info" className="nav-link">Info</a></li>
                        <li>
                            <span className="nav-link" onClick={handleImportClick} style={{ cursor: 'pointer' }}>
                                Import
                            </span>
                        </li>
                        {isAuthenticated && (
                            <li>
                                <div className="user-badge">
                                    <div className="avatar">{userInitials}</div>
                                    <div className="user-info">
                                        <span className="user-name">{userName}</span>
                                        <span className="user-role">Lehrkraft</span>
                                    </div>
                                    <button className="logout-btn" onClick={handleLogout} title="Abmelden">⏻</button>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>

            <section className="hero">
                <div id="canvas-container">
                    <ThreeScene />
                </div>
                <div className="hero-content">
                    <h1>Drehen/Fräsen</h1>
                    <p className="hero-subtitle">
                        Meisterhafte CNC-Fertigung mit höchster Präzision – Von der Einzelteilfertigung bis zur Serienproduktion
                    </p>
                    <div className="stats-bar">
                        <div className="stat-item">
                            <div className="stat-number">{projects.length}</div>
                            <div className="stat-label">Projekte</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">±0.002mm</div>
                            <div className="stat-label">Höchste Präzision</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">12</div>
                            <div className="stat-label">Werkstoffe</div>
                        </div>
                    </div>
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
                        <div className="carousel-track">
                            {filteredProjects.map(project => (
                                <div 
                                    key={project.id} 
                                    className="project-card"
                                    onClick={() => setSelectedProject(project)}
                                >
                                    <div className="project-image" style={{backgroundImage: `url(${project.image})`}}>
                                        <img src={project.image} alt={project.title} />
                                        <div className="project-badge">{project.badge}</div>
                                        <div className="precision-indicator">{project.precision}</div>
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
                                                <span className="meta-icon">🔩</span>
                                                <span>{project.material}</span>
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
                    </div>
                </div>
            </section>

            {/* Project Detail Modal */}
            <div className={`modal-overlay ${selectedProject ? 'active' : ''}`} onClick={() => setSelectedProject(null)}>
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
                                    <div className="detail-label">Material</div>
                                    <div className="detail-value">{selectedProject.material}</div>
                                </div>
                                <div className="detail-item">
                                    <div className="detail-label">Präzision</div>
                                    <div className="detail-value">{selectedProject.precision}</div>
                                </div>
                            </div>

                            <div className="modal-section">
                                <h3>Technische Spezifikationen</h3>
                                <div className="specs-grid">
                                    {Object.entries(selectedProject.specs).map(([key, value]) => (
                                        <div key={key} className="spec-item">
                                            <div className="spec-label">{key}</div>
                                            <div className="spec-value">{value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-section">
                                <h3>Features & Besonderheiten</h3>
                                <ul>
                                    {selectedProject.features.filter(f => f).map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="modal-section">
                                <h3>Herausforderungen</h3>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.05rem', paddingLeft: '1.5rem' }}>
                                    {selectedProject.challenges}
                                </p>
                            </div>

                            <div className="modal-section">
                                <h3>Ergebnis</h3>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.05rem', paddingLeft: '1.5rem' }}>
                                    {selectedProject.outcome}
                                </p>
                            </div>
                            
                            {selectedProject.attachments && selectedProject.attachments.length > 0 && (
                                <div className="modal-section">
                                    <h3>Anhänge</h3>
                                    <div className="attachments-list">
                                        {selectedProject.attachments.map((file, i) => (
                                            <div key={i} className="attachment-item">
                                                <div className="attachment-info">
                                                    <span className="attachment-icon">
                                                        {file.type?.includes('pdf') ? '📄' :
                                                         file.type?.includes('image') ? '🖼️' :
                                                         file.type?.includes('video') ? '🎬' : '📎'}
                                                    </span>
                                                    <div className="attachment-details">
                                                        <span className="attachment-name">{file.name}</span>
                                                        <span className="attachment-size">{file.size}</span>
                                                    </div>
                                                </div>
                                                <a
                                                    className="download-btn"
                                                    href={file.data}
                                                    download={file.name}
                                                    onClick={(e) => e.stopPropagation()}
                                                    title="Herunterladen"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                        <polyline points="7 10 12 15 17 10" />
                                                        <line x1="12" y1="15" x2="12" y2="3" />
                                                    </svg>
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Import Modal */}
            <ImportModal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                onSave={addProject}
            />
            
            {/* Login Modal */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLoginSuccess={handleLoginSuccess}
            />

            <footer>
                <div className="footer-content">
                    <div className="footer-column">
                        <h4>IEM Drehen/Fräsen</h4>
                        <ul>
                            <li><a href="#">Über uns</a></li>
                            <li><a href="#">Team</a></li>
                            <li><a href="#">Karriere</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Services</h4>
                        <ul>
                            <li><a href="#">CNC-Drehen</a></li>
                            <li><a href="#">CNC-Fräsen</a></li>
                            <li><a href="#">5-Achs Bearbeitung</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Bereiche</h4>
                        <ul>
                            <li><a href="#">Luftfahrt</a></li>
                            <li><a href="#">Medizintechnik</a></li>
                            <li><a href="#">Automotive</a></li>
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
                    <p>© 2025 IEM HTL Dornbirn. Precision Engineering.</p>
                </div>
            </footer>
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

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

// GSAP Animations
if (window.gsap) {
    window.addEventListener('load', () => {
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

        gsap.from('.stats-bar .stat-item', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            delay: 0.4,
            ease: 'power3.out'
        });

        gsap.from('.filter-tab', {
            duration: 0.8,
            y: 30,
            opacity: 0,
            stagger: 0.1,
            delay: 0.6,
            ease: 'power3.out'
        });

        gsap.from('.project-card', {
            duration: 1,
            y: 60,
            opacity: 0,
            stagger: 0.15,
            delay: 0.8,
            ease: 'power3.out'
        });
    });
}