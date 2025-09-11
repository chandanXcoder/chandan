// Smooth scroll for internal links
document.addEventListener('click', (e) => {
    const target = e.target.closest('a[href^="#"]');
    if (!target) return;
    const href = target.getAttribute('href');
    const section = document.querySelector(href);
    if (section) {
        e.preventDefault();
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile nav if open
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
    }
});

// Sticky nav toggle for mobile
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });
}

// Typewriter effect
(function typewriter(){
    const element = document.getElementById('typewriter-text');
    if (!element) return;
    const phrases = [
        'Web Developer & CSE Student',
        'Front-End Enthusiast',
        'Learning React.js',
        'Exploring AI Projects'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 70;
    const deletingSpeed = 40;
    const pauseBetween = 1200;

    function tick(){
        const current = phrases[phraseIndex % phrases.length];
        charIndex += isDeleting ? -1 : 1;
        element.textContent = current.slice(0, charIndex);

        if (!isDeleting && charIndex === current.length){
            setTimeout(() => { isDeleting = true; }, pauseBetween);
        } else if (isDeleting && charIndex === 0){
            isDeleting = false;
            phraseIndex++;
        }
        const delta = isDeleting ? deletingSpeed : typingSpeed;
        setTimeout(tick, delta);
    }
    tick();
})();

// Scroll reveal animations
const revealEls = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting){
            entry.target.classList.add('is-visible');
            // Animate skill meters when their card becomes visible
            if (entry.target.classList.contains('skill-card')){
                const meters = entry.target.querySelectorAll('.meter');
                meters.forEach((m) => {
                    const level = Number(m.getAttribute('data-level') || 0);
                    const bar = m.querySelector('.bar i');
                    if (bar){
                        bar.animate([
                            { inset: '0 100% 0 0' },
                            { inset: `0 ${100 - level}% 0 0` }
                        ], { duration: 900, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards', delay: 120 });
                    }
                });
            }
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.16 });
revealEls.forEach((el) => obs.observe(el));

// Scrollspy: highlight active nav link based on section in view
const sectionIds = ['home','about','skills','portfolio','contact'];
const sectionEls = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
const links = Array.from(document.querySelectorAll('.site-nav .nav-link'));
const linkById = new Map(links.map(l => [l.getAttribute('href').slice(1), l]));

const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const id = entry.target.id;
        const link = linkById.get(id);
        if (!link) return;
        if (entry.intersectionRatio > 0.6){
            links.forEach(a => a.classList.remove('active'));
            link.classList.add('active');
        }
    });
}, { threshold: [0.6, 0.9] });
sectionEls.forEach(el => spy.observe(el));

// Card hover spotlight position
document.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', mx + '%');
    card.style.setProperty('--my', my + '%');
});
// Contact form simple validation + fake submit handler
const form = document.getElementById('contact-form');
if (form){
    const status = document.getElementById('form-status');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const name = (data.get('name') || '').toString().trim();
        const email = (data.get('email') || '').toString().trim();
        const message = (data.get('message') || '').toString().trim();

        if (!name || !email || !message){
            status.hidden = false;
            status.textContent = 'Please fill out all fields.';
            return;
        }

        status.hidden = false;
        status.textContent = 'Sending…';

        // Simulate async request
        await new Promise(r => setTimeout(r, 1000));
        status.textContent = 'Thanks! I will get back to you soon.';
        form.reset();
    });
}


