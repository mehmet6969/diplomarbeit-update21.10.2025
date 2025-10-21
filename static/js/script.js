// Warte, bis der DOM vollständig geladen ist
document.addEventListener('DOMContentLoaded', function() {
  // Modal-Event-Listener
  const modal = document.getElementById("modal"); 
  if (modal) {
    modal.addEventListener("click", function(event) {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  // Schließen-Button
  const closeBtn = document.querySelector(".close");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  // ESC-Taste zum Schließen des Modals
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      const modal = document.getElementById("modal");
      if (modal && modal.style.display === "flex") {
        closeModal();
      }
    }
  });

  // Smooth Scrolling für Navigation (nur für Anchor-Links)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    // Nur verarbeiten wenn es ein echter Anchor-Link ist (beginnt mit #)
    if (href.startsWith('#') && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

  // Parallax-Effekt beim Scrollen
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
      hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });

  // Image Slider
  const slider = document.querySelector('.image-slider');
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.prev-arrow');
  const nextBtn = document.querySelector('.next-arrow');
  const dotsContainer = document.querySelector('.slider-dots');
  
  if (slider && slides.length > 0) {
    let currentSlide = 0;
    const slideCount = slides.length;
    
    // Create dots
    for (let i = 0; i < slideCount; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
    
    const dots = document.querySelectorAll('.dot');
    
    // Initialize slider
    updateSlider();
    
    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Auto slide
    let slideInterval = setInterval(nextSlide, 5000);
    
    const sliderContainer = document.querySelector('.slider-container');
    
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
      });
      
      sliderContainer.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
      });
    }
    
    // Functions
    function updateSlider() {
      slider.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    }
    
    function nextSlide() {
      currentSlide = (currentSlide + 1) % slideCount;
      updateSlider();
    }
    
    function prevSlide() {
      currentSlide = (currentSlide - 1 + slideCount) % slideCount;
      updateSlider();
    }
    
    function goToSlide(index) {
      currentSlide = index;
      updateSlider();
    }
  }
  
  // Intersection Observer für Animationen
  const animatedElements = document.querySelectorAll('.animate-in');
  
  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      observer.observe(el);
    });
  }
  
  // Navigation Active State
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
});

// Daten für die Module
const moduleData = [
  {
    title: "Drehen",
    description: "Hier kannst du ausführliche Informationen zu Drehen einfügen. Rotationssymmetrische Bearbeitung ist ein wichtiger Teil der Werkstattarbeit.",
    additional: "Zusätzliche Informationen oder Details zu Drehen.",
    image: "static/images/bild1.jpg",
    moreInfoUrl: "drehen_info",
    projectsUrl: "wifi_projekte"
  },
  {
    title: "Automatisierungstechnik",
    description: "Hier kannst du detaillierte Informationen zum Fräsen einfügen. Zerspanende Verfahren wie Fräsen sind essenziell.",
    additional: "Zusätzliche Informationen oder Details zu Fräsen.",
    image: "static/images/bild_aut.jpg",
    moreInfoUrl: "automatisierungstechnik_info",
    projectsUrl: "automatisierungstechnik_projekte"
  },
  {
    title: "3D-Druck",
    description: "3D-Druck ermöglicht schichtweises und innovatives Arbeiten. Hier sind alle wichtigen Details dazu.",
    additional: "Zusätzliche Informationen oder Details zu 3D-Druck.",
    image: "static/images/bild3.jpg",
    moreInfoUrl: "3d_druck_info",
    projectsUrl: "3d_druck_projekte"
  },
  {
    title: "CAD",
    description: "CAD bietet präzise Konstruktionen. Details zu den Grundlagen und wichtigen Projekten findest du hier.",
    additional: "Zusätzliche Informationen oder Details zu CAD.",
    image: "static/images/bild4.jpg",
    moreInfoUrl: "cad_info",
    projectsUrl: "cad_projekte"
  },
  {
    title: "Über uns",
    description: "Hier findest du Informationen über die Idee und das Team hinter diesem Projekt.",
    additional: "Zusätzliche Informationen oder Details zu Über uns.",
    image: "static/images/bild5.jpg",
    moreInfoUrl: "ueber_uns_info",
    projectsUrl: "wifi_projekte"
  },
  {
    title: "AI-Assistent",
    description: "Hier findest du Informationen über unseren AI-Assistenten.",
    additional: "Weitere Details zu unserem AI-Assistenten.",
    image: "static/images/bild7.jpg",
    moreInfoUrl: "artificial_intelligence_info",
    projectsUrl: "artificial_intelligence_projekte"
  },
  {
    title: "CAE",
    description: "Informationen zu CAE, Simulation und Analyse.",
    additional: "Weitere Details zu CAE.",
    image: "static/images/bild8.png",
    moreInfoUrl: "cae_info",
    projectsUrl: "cae_projekte"
  },
  {
    title: "Lasertechnik",
    description: "Hier erfährst du alles über unsere Lasertechnik.",
    additional: "Weitere Details zur Lasertechnik.",
    image: "static/images/bild6.jpg",
    moreInfoUrl: "lasertechnik_info",
    projectsUrl: "lasertechnik_projekte"
  }
];

// Modal öffnen
function openModal(index) {
  const modal = document.getElementById("modal");
  const modalTitle = modal.querySelector("#modal-title");
  const modalDescription = modal.querySelector("#modal-description");
  const modalAdditional = modal.querySelector("#modal-additional");
  const modalImage = modal.querySelector("#modal-image");
  const moreInfoLink = modal.querySelector("#more-info-link");
  const projectsLink = modal.querySelector("#projects-link");

  const data = moduleData[index];
  modalTitle.textContent = data.title;
  modalDescription.textContent = data.description;
  modalAdditional.textContent = data.additional || "";
  modalImage.src = data.image;

  // Slash vor die URLs hinzufügen für korrekte Flask-Routen
  moreInfoLink.href = "/" + data.moreInfoUrl;
  projectsLink.href = "/" + data.projectsUrl;

  modal.style.display = "flex";
}

// Modal schließen
function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
}

// Funktionen global verfügbar machen
window.openModal = openModal;
window.closeModal = closeModal;