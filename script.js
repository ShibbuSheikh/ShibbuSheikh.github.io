/* ===== Particle Background ===== */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.4 + 0.1;
    }
    update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(108,99,255,${this.opacity})`; ctx.fill();
    }
}
for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(108,99,255,${0.08 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5; ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

/* ===== Custom Cursor ===== */
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px'; cursorDot.style.top = mouseY + 'px';
});
function animateCursor() {
    ringX += (mouseX - ringX) * 0.15; ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = ringX + 'px'; cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .doc-card, .file-label').forEach(el => {
    el.addEventListener('mouseenter', () => { cursorRing.style.width = '50px'; cursorRing.style.height = '50px'; cursorRing.style.borderColor = '#00d4aa'; });
    el.addEventListener('mouseleave', () => { cursorRing.style.width = '36px'; cursorRing.style.height = '36px'; cursorRing.style.borderColor = '#6c63ff'; });
});

/* ===== Mobile Nav Toggle ===== */
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('active'));
});

/* ===== Active Nav Link on Scroll ===== */
const sections = document.querySelectorAll('.section');
const navItems = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) current = s.getAttribute('id'); });
    navItems.forEach(n => {
        n.classList.remove('active');
        if (n.getAttribute('href') === '#' + current) n.classList.add('active');
    });
});

/* ===== Typing Effect ===== */
const typedEl = document.getElementById('typed-text');
const titles = ['Mechanical Engineer', 'CAD Designer', 'BIS Trained Professional', 'Problem Solver'];
let titleIdx = 0, charIdx = 0, isDeleting = false;
function typeEffect() {
    const current = titles[titleIdx];
    typedEl.textContent = isDeleting ? current.substring(0, charIdx--) : current.substring(0, charIdx++);
    let speed = isDeleting ? 40 : 80;
    if (!isDeleting && charIdx > current.length) { speed = 2000; isDeleting = true; }
    if (isDeleting && charIdx < 0) { isDeleting = false; titleIdx = (titleIdx + 1) % titles.length; speed = 500; }
    setTimeout(typeEffect, speed);
}
typeEffect();

/* ===== Scroll Animations ===== */
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.animate-in, .glass-card, .exp-card, .project-card, .skill-category, .doc-card, .contact-card').forEach(el => {
    el.classList.add('animate-in');
    observer.observe(el);
});

/* ===== Skill Bar Animation ===== */
const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.skill-fill').forEach(bar => {
                bar.style.width = bar.dataset.width + '%';
            });
        }
    });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));

/* ===== Stat Counter ===== */
const statObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.stat-number').forEach(num => {
                const target = parseFloat(num.dataset.target);
                const isDecimal = target % 1 !== 0;
                let current = 0;
                const step = target / 60;
                const counter = setInterval(() => {
                    current += step;
                    if (current >= target) { current = target; clearInterval(counter); }
                    num.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);
                }, 25);
            });
            statObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.hero-stats').forEach(el => statObserver.observe(el));

/* ===== Hardcoded Document Paths ===== */
const docPaths = {
    marksheet: 'Marksheet.pdf',
    bis: 'bis-certificate.pdf',
    railways: 'railway-training-certificate.pdf'
};

/* ===== Document Viewer (opens PDF in modal) ===== */
function viewDocument(key) {
    const path = docPaths[key];
    const viewer = document.getElementById('viewer-content');
    const title = document.getElementById('viewer-title');
    const names = { marksheet: 'Marksheet', bis: 'BIS Training Certificate', railways: 'Railways Training Certificate' };
    title.textContent = names[key] || 'Document';

    viewer.innerHTML = `<embed src="${path}" type="application/pdf" width="100%" height="100%" />`;
    document.getElementById('viewer-modal').classList.add('active');
}

function closeViewerModal() { document.getElementById('viewer-modal').classList.remove('active'); }

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('active');
    });
});
