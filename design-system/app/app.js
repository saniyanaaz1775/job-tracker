/* Minimal SPA routing for the design-system shell (hash-based) */
(function () {
  const routes = ['/', '/dashboard', '/settings', '/saved', '/digest', '/proof'];

  const app = document.getElementById('app');
  const navList = document.getElementById('nav-list');
  const navToggle = document.getElementById('nav-toggle');

  function normalize(path) {
    if (!path) return '/';
    // ensure leading slash
    const p = path.replace(/^#/, '').replace(/^\/?/, '/');
    // strip trailing slash except root
    if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1);
    return p;
  }

  function renderPlaceholder(name) {
    app.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'placeholder card';
    const title = document.createElement('h1');
    title.className = 'ph-title';
    title.textContent = name;
    const sub = document.createElement('p');
    sub.className = 'ph-sub muted';
    sub.textContent = 'This section will be built in the next step.';
    container.appendChild(title);
    container.appendChild(sub);
    app.appendChild(container);
  }

  function render404() {
    app.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'placeholder card';
    const title = document.createElement('h1');
    title.className = 'ph-title';
    title.textContent = 'Page Not Found';
    const sub = document.createElement('p');
    sub.className = 'ph-sub muted';
    sub.textContent = 'The page you are looking for does not exist.';
    container.appendChild(title);
    container.appendChild(sub);
    app.appendChild(container);
  }

  function setActiveLink(path) {
    const links = document.querySelectorAll('.nav__link');
    links.forEach((a) => {
      // consider root and /dashboard equivalent for active state
      const href = a.getAttribute('href') || '';
      const target = normalize(href);
      if ((path === '/' && target === '/dashboard') || path === target) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  function handleRoute() {
    const raw = location.hash || '#/';
    const path = normalize(raw);
    if (path === '/' || path === '/dashboard') {
      renderPlaceholder('Dashboard');
    } else if (routes.includes(path)) {
      // render title from path
      const name = path.replace('/', '') || 'Home';
      renderPlaceholder(capitalize(name));
    } else {
      render404();
    }
    setActiveLink(path);
    // close mobile nav if open
    if (navList.getAttribute('data-mobile') === 'true') {
      toggleMobileNav(false);
    }
  }

  function capitalize(s) {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function toggleMobileNav(open) {
    const mobile = document.querySelector('.nav-list--mobile');
    if (!mobile) return;
    if (open) {
      mobile.setAttribute('aria-hidden', 'false');
      navToggle.setAttribute('aria-expanded', 'true');
    } else {
      mobile.setAttribute('aria-hidden', 'true');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  // Build mobile nav clone for small screens
  function ensureMobileNav() {
    if (document.querySelector('.nav-list--mobile')) return;
    const mobile = navList.cloneNode(true);
    mobile.classList.add('nav-list--mobile');
    mobile.setAttribute('aria-hidden', 'true');
    // attach click handlers to links to close menu
    mobile.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => toggleMobileNav(false));
    });
    document.body.appendChild(mobile);
  }

  // Setup
  ensureMobileNav();

  // Mobile toggle behavior
  navToggle.addEventListener('click', function () {
    const mobile = document.querySelector('.nav-list--mobile');
    const isHidden = mobile.getAttribute('aria-hidden') === 'true';
    toggleMobileNav(isHidden);
  });

  // Prevent full page reload when clicking nav links (hash links don't reload)
  navList.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      // allow default hash change; SPA will handle rendering
      // ensure no focus flicker by preventing any full page navigation
      e.preventDefault();
      const href = e.target.getAttribute('href');
      location.hash = href;
    }
  });

  // Also handle clicks on brand
  document.getElementById('brand').addEventListener('click', (e) => {
    e.preventDefault();
    location.hash = '#/';
  });

  // Listen to hash changes
  window.addEventListener('hashchange', handleRoute);
  // Initial render
  handleRoute();
})();

