/* Minimal SPA routing for the design-system shell (hash-based) */
(function () {
  const routes = ['/', '/dashboard', '/settings', '/saved', '/digest', '/proof'];

  const app = document.getElementById('app');
  const navList = document.getElementById('nav-list');
  const navToggle = document.getElementById('nav-toggle');

  function normalize(path) {
    if (!path) return '/';
    const p = path.replace(/^#/, '').replace(/^\/?/, '/');
    if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1);
    return p;
  }

  function renderHome() {
    app.innerHTML = '';
    const container = document.createElement('section');
    container.className = 'landing-hero';

    const title = document.createElement('h1');
    title.className = 'headline';
    title.textContent = 'Stop Missing The Right Jobs.';

    const sub = document.createElement('p');
    sub.className = 'sub';
    sub.textContent = 'Precision-matched job discovery delivered daily at 9AM.';

    const ctaWrap = document.createElement('div');
    ctaWrap.className = 'cta';
    const cta = document.createElement('button');
    cta.className = 'btn btn--primary';
    cta.textContent = 'Start Tracking';
    cta.addEventListener('click', (e) => {
      e.preventDefault();
      location.hash = '#/settings';
    });

    ctaWrap.appendChild(cta);
    container.appendChild(title);
    container.appendChild(sub);
    container.appendChild(ctaWrap);
    app.appendChild(container);
    title.focus && title.setAttribute('tabindex', '-1') && title.focus();
  }

  function renderSettings() {
    app.innerHTML = '';
    const container = document.createElement('section');
    container.className = 'card';
    const heading = document.createElement('h1');
    heading.className = 'ph-title';
    heading.textContent = 'Settings';
    container.appendChild(heading);

    const form = document.createElement('div');
    form.className = 'form';

    // Role keywords
    const row1 = document.createElement('div');
    row1.className = 'form-row';
    const label1 = document.createElement('label');
    label1.textContent = 'Role keywords';
    const input1 = document.createElement('input');
    input1.className = 'input';
    input1.placeholder = 'e.g., Product Manager, Backend Engineer';
    row1.appendChild(label1);
    row1.appendChild(input1);
    form.appendChild(row1);

    // Preferred locations
    const row2 = document.createElement('div');
    row2.className = 'form-row';
    const label2 = document.createElement('label');
    label2.textContent = 'Preferred locations';
    const input2 = document.createElement('input');
    input2.className = 'input';
    input2.placeholder = 'e.g., New York, Remote, London';
    row2.appendChild(label2);
    row2.appendChild(input2);
    form.appendChild(row2);

    // Mode
    const row3 = document.createElement('div');
    row3.className = 'form-row';
    const label3 = document.createElement('label');
    label3.textContent = 'Mode';
    const radioGroup = document.createElement('div');
    radioGroup.className = 'radio-group';
    ['Remote', 'Hybrid', 'Onsite'].forEach((mode) => {
      const wrap = document.createElement('label');
      wrap.className = 'radio';
      const r = document.createElement('input');
      r.type = 'radio';
      r.name = 'mode';
      r.disabled = true; // placeholder UI only
      const span = document.createElement('span');
      span.textContent = mode;
      wrap.appendChild(r);
      wrap.appendChild(span);
      radioGroup.appendChild(wrap);
    });
    row3.appendChild(label3);
    row3.appendChild(radioGroup);
    form.appendChild(row3);

    // Experience level
    const row4 = document.createElement('div');
    row4.className = 'form-row';
    const label4 = document.createElement('label');
    label4.textContent = 'Experience level';
    const sel = document.createElement('select');
    sel.className = 'input';
    ['Entry', 'Mid', 'Senior', 'Director'].forEach((opt) => {
      const o = document.createElement('option');
      o.value = opt.toLowerCase();
      o.textContent = opt;
      sel.appendChild(o);
    });
    sel.disabled = true; // placeholder only
    row4.appendChild(label4);
    row4.appendChild(sel);
    form.appendChild(row4);

    const note = document.createElement('p');
    note.className = 'muted';
    note.textContent = 'This page shows preference placeholders. No saving is implemented.';
    form.appendChild(note);

    container.appendChild(form);
    app.appendChild(container);
  }

  function renderDashboard() {
    app.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'placeholder card';
    const title = document.createElement('h1');
    title.className = 'ph-title';
    title.textContent = 'Dashboard';
    const sub = document.createElement('p');
    sub.className = 'ph-sub muted';
    sub.textContent = 'No jobs yet. In the next step, you will load a realistic dataset.';
    container.appendChild(title);
    container.appendChild(sub);
    app.appendChild(container);
  }

  function renderSaved() {
    app.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'placeholder card';
    const title = document.createElement('h1');
    title.className = 'ph-title';
    title.textContent = 'Saved';
    const sub = document.createElement('p');
    sub.className = 'ph-sub muted';
    sub.textContent = 'Your saved jobs will appear here. For now, this premium space is ready for your first saves.';
    container.appendChild(title);
    container.appendChild(sub);
    app.appendChild(container);
  }

  function renderDigest() {
    app.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'placeholder card';
    const title = document.createElement('h1');
    title.className = 'ph-title';
    title.textContent = 'Digest';
    const sub = document.createElement('p');
    sub.className = 'ph-sub muted';
    sub.textContent = 'Daily summary coming soon — a concise digest delivered at 9AM.';
    container.appendChild(title);
    container.appendChild(sub);
    app.appendChild(container);
  }

  function renderProof() {
    app.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'placeholder card';
    const title = document.createElement('h1');
    title.className = 'ph-title';
    title.textContent = 'Proof';
    const sub = document.createElement('p');
    sub.className = 'ph-sub muted';
    sub.textContent = 'Use this area to collect artifacts and exportables for compliance and review.';
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
    const allLinks = Array.from(document.querySelectorAll('.nav__link'));
    // include mobile links if present
    const mobile = document.querySelectorAll('.nav-list--mobile .nav__link');
    mobile.forEach((m) => allLinks.push(m));
    allLinks.forEach((a) => {
      const href = a.getAttribute('href') || '';
      const target = normalize(href);
      if (path === target) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  function handleRoute() {
    const raw = location.hash || '#/';
    const path = normalize(raw);
    if (path === '/') {
      renderHome();
    } else if (path === '/settings') {
      renderSettings();
    } else if (path === '/dashboard') {
      renderDashboard();
    } else if (path === '/saved') {
      renderSaved();
    } else if (path === '/digest') {
      renderDigest();
    } else if (path === '/proof') {
      renderProof();
    } else {
      render404();
    }
    setActiveLink(path);
    // close mobile nav if open
    const mobile = document.querySelector('.nav-list--mobile');
    if (mobile && mobile.getAttribute('aria-hidden') === 'false') {
      toggleMobileNav(false);
    }
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
    // attach click handlers to links to close menu and navigate
    mobile.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const href = a.getAttribute('href') || '#/';
        location.hash = href;
        toggleMobileNav(false);
      });
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

  // Prevent full page reload when clicking desktop nav links (hash links don't reload)
  navList.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      e.preventDefault();
      const href = e.target.getAttribute('href') || '#/';
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

