const routes = {
  '/': { page: 'home', title: 'Home | CampusGuide' },
  '/about': { page: 'about', title: 'About Us | CampusGuide' },
  '/programmes': { page: 'programmes', title: 'Academic Programmes | CampusGuide' },
  '/campus-life': { page: 'campus-life', title: 'Campus Life | CampusGuide' },
  '/contact': { page: 'contact', title: 'Contact Us | CampusGuide' }
};

const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');
const pageViews = [...document.querySelectorAll('.page-view')];
const routeLinks = [...document.querySelectorAll('[data-route-link]')];

function routeFor(pathname) {
  return routes[pathname] || routes['/'];
}

function renderRoute(pathname, shouldScroll = true) {
  const route = routeFor(pathname);
  pageViews.forEach((view) => view.classList.toggle('active', view.dataset.page === route.page));
  document.title = route.title;
  routeLinks.forEach((link) => {
    const linkPath = new URL(link.href, window.location.origin).pathname;
    const isCurrent = linkPath === pathname || (pathname === '/' && linkPath === '/');
    link.classList.toggle('active', isCurrent && link.dataset.route);
    if (isCurrent && link.dataset.route) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  primaryNav?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  if (shouldScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
}

routeLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const url = new URL(link.href, window.location.origin);
    if (url.origin !== window.location.origin) return;
    event.preventDefault();
    if (url.pathname !== window.location.pathname) history.pushState({}, '', url.pathname);
    renderRoute(url.pathname);
  });
});

window.addEventListener('popstate', () => renderRoute(window.location.pathname));
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

renderRoute(window.location.pathname, false);
