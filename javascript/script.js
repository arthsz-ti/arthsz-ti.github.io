// Navegação mobile
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Destaca o link ativo no menu conforme a seção visível
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
});

// Formulário de contato — abre o cliente de email com os dados preenchidos
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        const mailtoLink = `mailto:arthursaraiva51@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`)}`;
        window.location.href = mailtoLink;

        showNotification('Email preparado — seu cliente de email vai abrir em instantes.', 'success');
        this.reset();
    });
}

function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close" aria-label="Fechar">&times;</button>
        </div>
    `;
    document.body.appendChild(notification);

    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });

    const close = () => {
        notification.style.transform = 'translateX(420px)';
        setTimeout(() => notification.remove(), 300);
    };

    notification.querySelector('.notification-close').addEventListener('click', close);
    setTimeout(close, 5000);
}
