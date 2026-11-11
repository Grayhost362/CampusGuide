const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');

const currentPath = window.location.pathname.endsWith('/') ? '/index.html' : window.location.pathname;
primaryNav?.querySelectorAll('a[href]').forEach((link) => {
  const linkPath = new URL(link.href, window.location.origin).pathname;
  const isCurrent = linkPath === currentPath;
  link.classList.toggle('active', isCurrent);
  if (isCurrent) link.setAttribute('aria-current', 'page');
});

menuToggle?.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelector('#contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.querySelector('#form-status');
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();

  if (!name || !email || !message) {
    status.textContent = 'Please complete your name, email, and message first.';
    status.className = 'form-status error';
    (!name ? form.elements.name : !email ? form.elements.email : form.elements.message).focus();
    return;
  }

  if (!form.elements.email.checkValidity()) {
    status.textContent = 'Please check that your email address is written correctly.';
    status.className = 'form-status error';
    form.elements.email.focus();
    return;
  }

  status.textContent = `Thanks, ${name.split(' ')[0]} — your message is ready to be sent. This sample form does not store submissions.`;
  status.className = 'form-status';
  form.reset();
});
