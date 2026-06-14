const { useState, useEffect, useRef } = React;

// ============================================
// EMAILJS KONFIGURATION
// ============================================

const EMAILJS_CONFIG = {
    serviceId: 'service_v351y86',
    backupServiceId: 'service_s4pcyvf',
    templateId: 'template_nce99x6',
    publicKey: 'IIsxauIOXV1SLgD-O'
};

// Manuelle Whitelist für Ausnahmen (z.B. Gmail, Direktor ohne Punkt)
const AUTHORIZED_EMAILS = [
    'mehmet.saygin@student.htldornbirn.at',
    'msaygin29@gmail.com',
    'direktor@htldornbirn.at',
    'dominik.ferles@student.htldornbirn.at',
    'kenan.bayar@htldornbirn.at'
];

// EmailJS initialisieren
if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function isEmailAuthorized(email) {
    const trimmed = email.toLowerCase().trim();
    
    // 1. Prüfe ob in der manuellen Whitelist
    if (AUTHORIZED_EMAILS.some(e => e.toLowerCase() === trimmed)) {
        return true;
    }
    
    // 2. Prüfe Muster: vorname.nachname@htldornbirn.at (Lehrer)
    const htlPattern = /^[a-zäöüß]+\.[a-zäöüß]+@htldornbirn\.at$/i;
    if (htlPattern.test(trimmed)) {
        return true;
    }
    
    // 3. Prüfe auch student E-Mails: vorname.nachname@student.htldornbirn.at
    const studentPattern = /^[a-zäöüß]+\.[a-zäöüß]+@student\.htldornbirn\.at$/i;
    if (studentPattern.test(trimmed)) {
        return true;
    }
    
    return false;
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
    localStorage.setItem('3ddruck_auth_session', JSON.stringify(session));
}

function loadSession() {
    try {
        const sessionData = localStorage.getItem('3ddruck_auth_session');
        if (!sessionData) return null;

        const session = JSON.parse(sessionData);

        if (Date.now() > session.expiresAt) {
            localStorage.removeItem('3ddruck_auth_session');
            return null;
        }

        if (!isEmailAuthorized(session.email)) {
            localStorage.removeItem('3ddruck_auth_session');
            return null;
        }

        return session;
    } catch (e) {
        localStorage.removeItem('3ddruck_auth_session');
        return null;
    }
}

function clearSession() {
    localStorage.removeItem('3ddruck_auth_session');
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
    if (!window.emailjs) {
        console.error('EmailJS nicht geladen');
        return { success: false, error: 'EmailJS nicht verfügbar' };
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
        await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams
        );
        return { success: true };
    } catch (primaryError) {
        console.warn('Primärer Service fehlgeschlagen:', primaryError);
        if (EMAILJS_CONFIG.backupServiceId) {
            try {
                await emailjs.send(
                    EMAILJS_CONFIG.backupServiceId,
                    EMAILJS_CONFIG.templateId,
                    templateParams
                );
                return { success: true };
            } catch (backupError) {
                return { success: false, error: backupError.message };
            }
        }
        return { success: false, error: primaryError.message || 'Unbekannter Fehler' };
    }
}

// ============================================
// DEMO FALLBACK (optional)
// ============================================

const initialProjectsData = [
    {
        id: 1,
        title: "Bionik-Prothese",
        image: "../../static/images/3dpic_1.jpg",
        description: "3D-gedruckte Handprothese mit flexiblen TPU-Gelenken und individueller Anpassung für optimalen Tragekomfort.",
        category: "FDM",
        badge: "Medizintechnik",
        complexity: 5,
        year: "2024",
        duration: "6 Monate",
        material: "TPU + PLA",
        technologies: ["FDM Multi-Material", "Topology Optimization", "CAD Anpassung", "Nachbearbeitung"],
        tags: ["Medizin", "Bionik", "Custom"],
        features: [
            "Individuelle Anpassung per 3D-Scan",
            "Flexible Gelenke aus TPU",
            "Gewichtsoptimierung durch Topologie",
            "Antimikrobielle Oberflächenbeschichtung",
            "Modulares Design für Austausch"
        ],
        challenges: "Kombination von starren und flexiblen Materialien in einem Druck mit biokompatiblen Eigenschaften",
        outcome: "Erfolgreiche Anpassung, deutlich günstiger als konventionelle Prothesen",
        attachments: []
    }
];

// ============================================
// THREE.JS SCENE (dein ThreeScene war in anderem File; falls du es hast -> lassen)
// Hier als NO-OP fallback, damit der Code nicht crasht, wenn ThreeScene nicht existiert.
// ============================================
function ThreeScene() {
    return <div style={{ width: '100%', height: '100%' }} />;
}

// ============================================
// Tags Input Component
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
// Features Editor Component
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
// Login Modal Component
// ============================================

function LoginModal({ isOpen, onClose, onSuccess }) {
    const [step, setStep] = useState('email');
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [generatedCode, setGeneratedCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const codeInputsRef = useRef([]);

    useEffect(() => {
        if (!isOpen) {
            setStep('email');
            setEmail('');
            setVerificationCode(['', '', '', '', '', '']);
            setGeneratedCode('');
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
            setError('Diese E-Mail-Adresse ist nicht berechtigt. Verwenden Sie eine HTL Dornbirn E-Mail (vorname.nachname@htldornbirn.at).');
            return;
        }

        setLoading(true);
        const code = generateVerificationCode();
        setGeneratedCode(code);

        const result = await sendVerificationEmail(trimmedEmail, code);
        setLoading(false);

        if (result.success) {
            setStep('code');
            setResendTimer(60);
            setSuccess('Code wurde gesendet!');
        } else {
            setError(`Fehler beim Senden: ${result.error || 'Unbekannter Fehler'}`);
        }
    };

    const handleCodeChange = (index, value) => {
        if (value.length > 1) return;

        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);

        if (value && index < 5) {
            codeInputsRef.current[index + 1]?.focus();
        }
    };

    const handleCodeKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
            codeInputsRef.current[index - 1]?.focus();
        }
    };

    const verifyCode = () => {
        const enteredCode = verificationCode.join('');
        if (enteredCode === generatedCode) {
            const okEmail = email.trim().toLowerCase();
            saveSession(okEmail);
            onSuccess(okEmail);
            onClose();
        } else {
            setError('Ungültiger Code. Bitte versuchen Sie es erneut.');
            setVerificationCode(['', '', '', '', '', '']);
            codeInputsRef.current[0]?.focus();
        }
    };

    const handleResend = async () => {
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
            setSuccess('Neuer Code gesendet!');
        } else {
            setError('Fehler beim erneuten Senden.');
        }
    };

    const resetModal = () => {
        setStep('email');
        setEmail('');
        setVerificationCode(['', '', '', '', '', '']);
        setGeneratedCode('');
        setError('');
        setSuccess('');
        setResendTimer(0);
    };

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
            <div className="modal-content login-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-close" onClick={onClose}>×</div>
                <div className="modal-body">
                    {step === 'email' ? (
                        <>
                            <div className="login-header">
                                <div className="lock-icon">🔒</div>
                                <h2>Anmeldung</h2>
                                <p>Melden Sie sich mit Ihrer HTL Dornbirn E-Mail an</p>
                            </div>
                            <div className="form-group full-width">
                                <label>E-Mail-Adresse</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="vorname.nachname@htldornbirn.at"
                                />
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            <button
                                className="login-btn"
                                onClick={handleEmailSubmit}
                                disabled={!email || loading}
                            >
                                {loading ? 'Wird gesendet...' : 'Code senden'}
                            </button>
                          
                        </>
                    ) : (
                        <>
                            <div className="login-header">
                                <div className="lock-icon">📧</div>
                                <h2>Bestätigungscode eingeben</h2>
                                <p>Code wurde an {email} gesendet</p>
                            </div>
                            {success && <p className="success-message">{success}</p>}
                            <div className="verification-code-inputs">
                                {verificationCode.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (codeInputsRef.current[index] = el)}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                                    />
                                ))}
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            <button
                                className="login-btn"
                                onClick={verifyCode}
                                disabled={verificationCode.join('').length !== 6}
                            >
                                Code bestätigen
                            </button>
                            <button className="login-btn back-btn" onClick={resetModal}>
                                Zurück
                            </button>
                            <div className="resend-code">
                                <button onClick={handleResend} disabled={resendTimer > 0}>
                                    {resendTimer > 0
                                        ? `Code erneut senden (${resendTimer}s)`
                                        : 'Code erneut senden'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// ============================================
// Import Modal Component
// ============================================

function ImportModal({ isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'FDM',
        badge: '',
        complexity: 3,
        year: new Date().getFullYear().toString(),
        duration: '',
        material: '',
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

    const categories = ['FDM', 'SLA', 'Sonstiges'];

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
        const newAttachments = files.map(file => ({
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            type: file.type
        }));
        setAttachments(prev => [...prev, ...newAttachments]);
    };

    const removeAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        const newProject = {
            ...formData,
            attachments: attachments
        };
        onSave(newProject);

        setFormData({
            title: '',
            description: '',
            category: 'FDM',
            badge: '',
            complexity: 3,
            year: new Date().getFullYear().toString(),
            duration: '',
            material: '',
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
                        <div className="form-group full-width">
                            <label>Projektbild</label>
                            <div
                                className={`image-upload-area ${formData.image ? 'has-image' : ''}`}
                                onClick={() => imageInputRef.current.click()}
                            >
                                {formData.image ? (
                                    <img src={formData.image} alt="Preview" />
                                ) : (
                                    <>
                                        <div className="upload-icon">📷</div>
                                        <p className="upload-text">
                                            Klicken zum <span>Hochladen</span>
                                        </p>
                                    </>
                                )}
                            </div>
                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleImageUpload}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Projekttitel</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                placeholder="z.B. Bionik-Prothese"
                            />
                        </div>

                        <div className="form-group">
                            <label>Badge</label>
                            <input
                                type="text"
                                value={formData.badge}
                                onChange={(e) => handleChange('badge', e.target.value)}
                                placeholder="z.B. Medizintechnik, Innovation"
                            />
                        </div>

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

                        <div className="form-group">
                            <label>Komplexität (1-5)</label>
                            <div className="complexity-selector">
                                {[1, 2, 3, 4, 5].map(num => (
                                    <button
                                        key={num}
                                        type="button"
                                        className={`complexity-btn ${formData.complexity >= num ? 'active' : ''}`}
                                        onClick={() => handleChange('complexity', num)}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Jahr</label>
                            <input
                                type="text"
                                value={formData.year}
                                onChange={(e) => handleChange('year', e.target.value)}
                                placeholder="2025"
                            />
                        </div>

                        <div className="form-group">
                            <label>Dauer</label>
                            <input
                                type="text"
                                value={formData.duration}
                                onChange={(e) => handleChange('duration', e.target.value)}
                                placeholder="z.B. 6 Monate"
                            />
                        </div>

                        <div className="form-group">
                            <label>Material</label>
                            <input
                                type="text"
                                value={formData.material}
                                onChange={(e) => handleChange('material', e.target.value)}
                                placeholder="z.B. TPU + PLA"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Beschreibung</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Kurze Projektbeschreibung..."
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Tags (Enter zum Hinzufügen)</label>
                            <TagsInput
                                tags={formData.tags}
                                setTags={(tags) => handleChange('tags', tags)}
                                placeholder="z.B. Medizin, Bionik..."
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Technologien (Enter zum Hinzufügen)</label>
                            <TagsInput
                                tags={formData.technologies}
                                setTags={(tech) => handleChange('technologies', tech)}
                                placeholder="z.B. FDM Multi-Material..."
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Features & Highlights</label>
                            <FeaturesEditor
                                features={formData.features}
                                setFeatures={(features) => handleChange('features', features)}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Herausforderungen</label>
                            <textarea
                                value={formData.challenges}
                                onChange={(e) => handleChange('challenges', e.target.value)}
                                placeholder="Welche Herausforderungen gab es?"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Ergebnis</label>
                            <textarea
                                value={formData.outcome}
                                onChange={(e) => handleChange('outcome', e.target.value)}
                                placeholder="Was wurde erreicht?"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Dateien anhängen</label>
                            <div className="file-attachments">
                                {attachments.length > 0 && (
                                    <div className="file-list">
                                        {attachments.map((file, index) => (
                                            <span key={index} className="file-chip">
                                                📎 {file.name} ({file.size})
                                                <span
                                                    className="remove-file"
                                                    onClick={() => removeAttachment(index)}
                                                >
                                                    {' ×'}
                                                </span>
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
// Project Detail Modal Component + ADMIN BUTTONS
// ============================================

function ProjectModal({ project, onClose, isAuthenticated, onDelete, onToggleVisibility }) {
    if (!project) return null;

    return (
        <div className={`modal-overlay ${project ? 'active' : ''}`} onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-close" onClick={onClose}>×</div>
                <div className="modal-image" style={{ backgroundImage: `url(${project.image})` }}>
                    <img src={project.image} alt={project.title} />
                </div>
                <div className="modal-body">
                    <div className="modal-header">
                        <h2 className="modal-title">{project.title}</h2>
                        <p className="modal-description">{project.description}</p>

                        {isAuthenticated && (
                            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
                                <button className="btn btn-secondary" type="button" onClick={() => onDelete(project)}>
                                    🗑 Löschen
                                </button>
                                <button className="btn btn-primary" type="button" onClick={() => onToggleVisibility(project)}>
                                    {((project.visibility || "public") === "restricted")
                                        ? "🔓 Öffentlich machen"
                                        : "🔒 Sperrvermerk"}
                                </button>
                            </div>
                        )}

                        <div className="project-tags" style={{ marginTop: "1rem" }}>
                            {(project.tags || []).map((tag, i) => (
                                <span key={i} className="project-tag">{tag}</span>
                            ))}
                        </div>
                    </div>

                    <div className="modal-details">
                        <div className="detail-item">
                            <div className="detail-label">Jahr</div>
                            <div className="detail-value">{project.year}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Dauer</div>
                            <div className="detail-value">{project.duration}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Material</div>
                            <div className="detail-value">{project.material}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Kategorie</div>
                            <div className="detail-value">{project.category}</div>
                        </div>
                    </div>

                    {project.technologies && project.technologies.length > 0 && (
                        <div className="modal-section">
                            <h3>Technologien</h3>
                            <div className="tech-stack">
                                {project.technologies.map((tech, i) => (
                                    <div key={i} className="tech-item">{tech}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {project.features && project.features.filter(f => f).length > 0 && (
                        <div className="modal-section">
                            <h3>Features & Highlights</h3>
                            <ul>
                                {project.features.filter(f => f).map((feature, i) => (
                                    <li key={i}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {project.challenges && (
                        <div className="modal-section">
                            <h3>Herausforderungen</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.05rem', paddingLeft: '1.5rem' }}>
                                {project.challenges}
                            </p>
                        </div>
                    )}

                    {project.outcome && (
                        <div className="modal-section">
                            <h3>Ergebnis</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.05rem', paddingLeft: '1.5rem' }}>
                                {project.outcome}
                            </p>
                        </div>
                    )}

                    {project.attachments && project.attachments.length > 0 && (
                        <div className="modal-section">
                            <h3>Anhänge</h3>
                            <div className="attachments-list">
                                {project.attachments.map((file, i) => (
                                    <div key={i} className="attachment-item">
                                        <div className="attachment-info">
                                            <span className="attachment-icon">📎</span>
                                            <div className="attachment-details">
                                                <div className="attachment-name">{file.name}</div>
                                                <div className="attachment-size">{file.size}</div>
                                            </div>
                                        </div>
                                        <a href="#" className="download-btn" onClick={(e) => e.preventDefault()}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                            </svg>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ============================================
// Navigation Component
// ============================================

function Navigation({ isAuthenticated, userEmail, onLogout, onImportClick }) {
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

    return (
        <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
            <div className="nav-content">
                <div className="logo">🖨️ IEM</div>
                <ul className="nav-links">
                    <li><a href="/" className="nav-link">Home</a></li>
                    <li><a href="/3d_druck_projekte" className="nav-link active">Projekte</a></li>
                    <li><a href="/3d_druck_info" className="nav-link">Info</a></li>
                    <li>
                        <span className="nav-link" onClick={onImportClick} style={{ cursor: 'pointer' }}>
                            Import
                        </span>
                    </li>
                    {isAuthenticated && (
                        <li>
                            <div className="user-badge">
                                <div className="avatar">{userInitials}</div>
                                <div className="user-info">
                                    <div className="user-name">{userName}</div>
                                    <div className="user-role">Angemeldet</div>
                                </div>
                                <button className="logout-btn" onClick={onLogout} title="Abmelden">
                                    ⏻
                                </button>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}

// ============================================
// Main App Component (MongoDB + module=3d_druck)
// ============================================

function App() {
    const [projects, setProjects] = useState([]);
    const [activeFilter, setActiveFilter] = useState('Alle');
    const [selectedProject, setSelectedProject] = useState(null);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [collapsedYears, setCollapsedYears] = useState({});

    const categories = ['Alle', 'FDM', 'SLA'];

    const reloadProjects = async (emailOrEmpty) => {
        try {
            const res = await fetch("/api/projects?module=3d_druck", {
                headers: emailOrEmpty ? { "X-User-Email": emailOrEmpty } : {}
            });
            const data = await res.json();
            setProjects(data);
        } catch (e) {
            console.error("Konnte Projekte nicht laden:", e);
            setProjects(initialProjectsData); // fallback optional
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

    // Years
    const years = [...new Set(projects.map(p => p.year))].sort((a, b) => b - a);

    // ========== SPERRVERMERK FILTER ==========
    // Wenn NICHT angemeldet: Nur öffentliche Projekte zeigen
    // Wenn angemeldet: Alle Projekte zeigen
    const visibleProjectsForUser = isAuthenticated 
        ? projects 
        : projects.filter(p => p.visibility !== 'restricted');

    // Filter by category
    const filteredProjects = activeFilter === 'Alle'
        ? visibleProjectsForUser
        : visibleProjectsForUser.filter(p => p.category === activeFilter);

    // Group by year
    const projectsByYear = years.reduce((acc, year) => {
        acc[year] = filteredProjects.filter(p => p.year === year);
        return acc;
    }, {});

    const toggleYear = (year) => {
        setCollapsedYears(prev => ({
            ...prev,
            [year]: !prev[year]
        }));
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

    const addProject = async (newProject) => {
        try {
            if (!userEmail) {
                alert("Nicht angemeldet.");
                return;
            }

            const payload = { ...newProject, module: "3d_druck" };

            const res = await fetch("/api/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-User-Email": userEmail
                },
                body: JSON.stringify(payload),
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

    // Stats - zeige korrekte Anzahl basierend auf Auth-Status
    const publicProjectCount = projects.filter(p => p.visibility !== 'restricted').length;
    const totalProjects = isAuthenticated ? projects.length : publicProjectCount;
    const totalMaterials = [...new Set(visibleProjectsForUser.map(p => p.material).filter(Boolean))].length;

    return (
        <React.Fragment>
            <Navigation
                isAuthenticated={isAuthenticated}
                userEmail={userEmail}
                onLogout={handleLogout}
                onImportClick={handleImportClick}
            />

            <section className="hero">
                <div id="canvas-container">
                    <ThreeScene />
                </div>
                <div className="hero-content">
                    <h1>3D-Druck</h1>
                    <p className="hero-subtitle">
                        Innovative 3D-Druck-Projekte von Prototypen bis Endprodukte – Additive Fertigung in Perfektion
                    </p>
                    <div className="stats-bar">
                        <div className="stat-item">
                            <div className="stat-number">{totalProjects}</div>
                            <div className="stat-label">Projekte</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">{totalMaterials}+</div>
                            <div className="stat-label">Materialien</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">300+</div>
                            <div className="stat-label">Drucke</div>
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

            <section className="projects-section">
                <div className="container">
                    {years.map(year => {
                        const yearProjects = projectsByYear[year];
                        if (!yearProjects || yearProjects.length === 0) return null;

                        const isCollapsed = collapsedYears[year];

                        return (
                            <div key={year} className="year-group">
                                <div
                                    className={`year-header ${isCollapsed ? 'collapsed' : ''}`}
                                    onClick={() => toggleYear(year)}
                                >
                                    <h2>{year}</h2>
                                    <span className="project-count">
                                        {yearProjects.length} Projekt{yearProjects.length !== 1 ? 'e' : ''}
                                    </span>
                                    <span className="toggle-icon">{isCollapsed ? '▸' : '▾'}</span>
                                </div>
                                <div
                                    className={`year-projects ${isCollapsed ? 'collapsed' : ''}`}
                                    style={{ maxHeight: isCollapsed ? '0' : `${yearProjects.length * 600}px` }}
                                >
                                    <div className="projects-grid">
                                        {yearProjects.map((project) => (
                                            <div
                                                key={project.id}
                                                className="project-card"
                                                onClick={() => setSelectedProject(project)}
                                            >
                                                <div className="project-image" style={{ backgroundImage: `url(${project.image})` }}>
                                                    <img src={project.image} alt={project.title} />
                                                    <div className="project-badge">
                                                        {project.visibility === "restricted" ? "🔒 Gesperrt" : project.badge}
                                                    </div>
                                                    <div className="complexity-indicator">
                                                        {[...Array(5)].map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className={`complexity-dot ${i < project.complexity ? 'active' : ''}`}
                                                            />
                                                        ))}
                                                    </div>
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
                                                            <span className="meta-icon">🧪</span>
                                                            <span>{project.material}</span>
                                                        </div>
                                                    </div>
                                                    <div className="project-tags">
                                                        {(project.tags || []).map((tag, i) => (
                                                            <span key={i} className="project-tag">{tag}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {filteredProjects.length === 0 && (
                        <div className="no-projects">
                            <h3>Keine Projekte gefunden</h3>
                            <p>Versuchen Sie einen anderen Filter oder fügen Sie neue Projekte hinzu.</p>
                        </div>
                    )}
                </div>
            </section>

            <ProjectModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
                isAuthenticated={isAuthenticated}
                onDelete={deleteProject}
                onToggleVisibility={toggleVisibility}
            />

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSuccess={handleLoginSuccess}
            />

            <ImportModal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                onSave={addProject}
            />

            <footer>
                <div className="footer-content">
                    <div className="footer-column">
                        <h4>IEM 3D-Druck</h4>
                        <ul>
                            <li><a href="#">Über uns</a></li>
                            <li><a href="#">Team</a></li>
                            <li><a href="#">Karriere</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Services</h4>
                        <ul>
                            <li><a href="#">FDM Druck</a></li>
                            <li><a href="#">SLA/Resin Druck</a></li>
                            <li><a href="#">CAD Design</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Materialien</h4>
                        <ul>
                            <li><a href="#">Kunststoffe</a></li>
                            <li><a href="#">Flexible Materialien</a></li>
                            <li><a href="#">Harze</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h4>Kontakt</h4>
                        <ul>
                            <li>mehmet.saygin@student.htldornbirn.at</li>
                            <li>HTL Dornbirn</li>
                            <li>Höchsterstraße 73, 6850 Dornbirn</li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2025 IEM HTL Dornbirn. Additive Manufacturing.</p>
                </div>
            </footer>
        </React.Fragment>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));