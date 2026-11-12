// Navegação mobile
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');

function setMenu(open) {
    hamburger.classList.toggle('active', open);
    navMenu.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
}

hamburger.addEventListener('click', () => setMenu(!navMenu.classList.contains('active')));
navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// Destaca o link ativo no menu e marca a navbar quando a página rola
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 8);

    let current = 'home';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 140) current = section.id;
    });
    // no fim da página, a última seção é a ativa
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        current = sections[sections.length - 1].id;
    }
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Revela os blocos suavemente ao entrar na tela
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('js-reveal');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
}

// Ano no rodapé
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Formulário de contato — envia de verdade via FormSubmit (sem backend)
const CONTACT_EMAIL = 'arthursaraiva51@gmail.com';
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const btnLabel = submitBtn.querySelector('.btn-label');
    const statusEl = contactForm.querySelector('.form-status');

    const setStatus = (type, html) => {
        statusEl.className = `form-status ${type || ''}`;
        statusEl.innerHTML = html || '';
    };

    const mailtoFallback = (data) =>
        `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(`Nome: ${data.name}\nEmail: ${data.email}\n\n${data.message}`)}`;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // validação com mensagens próprias
        let firstInvalid = null;
        contactForm.querySelectorAll('[required]').forEach(field => {
            const ok = field.checkValidity();
            field.closest('.form-group').classList.toggle('invalid', !ok);
            if (!ok && !firstInvalid) firstInvalid = field;
        });
        if (firstInvalid) {
            setStatus('error', 'Preencha todos os campos com um email válido.');
            firstInvalid.focus();
            return;
        }

        const fd = new FormData(contactForm);
        if (fd.get('_honey')) return; // bot

        const data = {
            name: fd.get('name').trim(),
            email: fd.get('email').trim(),
            subject: fd.get('subject').trim(),
            message: fd.get('message').trim(),
        };

        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        btnLabel.textContent = 'Enviando…';
        setStatus('', '');

        try {
            const res = await fetch(FORM_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    _replyto: data.email,
                    _subject: `[Portfólio] ${data.subject}`,
                    assunto: data.subject,
                    mensagem: data.message,
                    _template: 'table',
                    _captcha: 'false',
                }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok || String(json.success) !== 'true') throw new Error(json.message || 'Falha no envio');

            contactForm.reset();
            setStatus('success', '<i class="fas fa-circle-check" aria-hidden="true"></i> Mensagem enviada! Obrigado pelo contato, retorno em breve.');
        } catch (err) {
            setStatus('error', `Não foi possível enviar agora. <a href="${mailtoFallback(data)}">Enviar pelo seu app de email</a> ou escreva para ${CONTACT_EMAIL}.`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            btnLabel.textContent = 'Enviar mensagem';
        }
    });

    // limpa o estado de erro enquanto a pessoa digita
    contactForm.addEventListener('input', e => {
        const group = e.target.closest('.form-group');
        if (group && e.target.checkValidity()) group.classList.remove('invalid');
    });
}
