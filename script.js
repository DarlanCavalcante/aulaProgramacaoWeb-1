/* mobile & responsive helpers */
const MOBILE_BREAKPOINT = 768;

function ensureNavId() {
    if (!document.getElementById('navMenu')) {
        const alt = document.querySelector('.nav-menu, .menu, #menu, nav');
        if (alt) alt.id = 'navMenu';
    }
}

function updateHeaderHeight() {
    const header = document.querySelector('header, #header, .site-header');
    const computed = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
    const fallback = computed ? parseInt(computed, 10) : 70;
    const h = header ? header.offsetHeight : (fallback || 70);
    document.documentElement.style.setProperty('--header-height', `${h}px`);
    window.__HEADER_HEIGHT = h;
}

function setupMobileToggle() {
    const toggle = document.getElementById('mobileToggle') || document.querySelector('.mobile-toggle');
    const menu = document.getElementById('navMenu') || document.querySelector('.nav-menu, .menu, #menu');
    if (!menu && toggle) return;
    if (menu && !menu.id) menu.id = 'navMenu';

    if (toggle) {
        toggle.addEventListener('click', () => {
            const m = document.getElementById('navMenu');
            if (m) m.classList.toggle('active');
        });

        // close menu when clicking outside
        document.addEventListener('click', (e) => {
            const m = document.getElementById('navMenu');
            if (!m) return;
            if (!m.contains(e.target) && !toggle.contains(e.target)) m.classList.remove('active');
        });
    }
}

// Replace scrollActive after DOM is ready so it uses dynamic header height
document.addEventListener('DOMContentLoaded', () => {
    ensureNavId();
    updateHeaderHeight();
    setupMobileToggle();

    window.addEventListener('resize', () => {
        // throttle not necessary for small projects; add if needed
        updateHeaderHeight();
    });

    // Override the existing scrollActive to use dynamic header height
    window.scrollActive = function (sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const headerHeight = window.__HEADER_HEIGHT || parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 70;
        const sectionTop = section.offsetTop - headerHeight;
        window.scrollTo({ top: sectionTop, behavior: 'smooth' });

        const menu = document.getElementById('navMenu');
        if (menu) menu.classList.remove('active');
    };
});
function toggleMenu() {
    const menu = document.getElementById('navMenu');
    if (menu) menu.classList.toggle('active');
}

/* scroll level */
function scrollActive(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const headerHeight = 70;
    const sectionTop = section.offsetTop - headerHeight;
    window.scrollTo({ top: sectionTop, behavior: 'smooth' });

    const menu = document.getElementById('navMenu');
    if (menu) menu.classList.remove('active');
}

function handleSubmit(event) {
    event.preventDefault();
    const form = event.target || document.getElementById('contactForm');
    if (!form) return;

    const formData = {
        name: form.name ? form.name.value : '',
        email: form.email ? form.email.value : '',
        telefone: form.telefone ? form.telefone.value : '',
        idade: form.idade ? form.idade.value : '',
        disponibilidade: form.disponibilidade ? form.disponibilidade.value : '',
        areadeinteresse: form.areadeinteresse ? form.areadeinteresse.value : '',
        experiencia: form.experiencia ? form.experiencia.value : '',
        motivacao: form.motivacao ? form.motivacao.value : '',
        dataCadastro: new Date().toLocaleDateString()
    };

    const voluntarios = JSON.parse(localStorage.getItem('voluntarios')) || [];
    voluntarios.push(formData);
    localStorage.setItem('voluntarios', JSON.stringify(voluntarios));

    const successMessage = document.querySelector('.success-message');
    if (successMessage) {
        successMessage.classList.add('show');
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => successMessage.classList.remove('show'), 5000);
    }

    form.reset();
    exibirVoluntarios();
}

function exibirVoluntarios() {
    const voluntarios = JSON.parse(localStorage.getItem('voluntarios')) || [];
    const voluntariosList = document.getElementById('voluntariosList');
    if (!voluntariosList) return;
    voluntariosList.innerHTML = '';
    voluntarios.forEach((v, i) => {
        const li = document.createElement('li');
        li.textContent = `${i + 1}. ${v.name || ''} — ${v.email || ''} — ${v.dataCadastro || ''}`;
        voluntariosList.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (form) form.addEventListener('submit', handleSubmit);
    exibirVoluntarios();
});