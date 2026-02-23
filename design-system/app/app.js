/* Minimal SPA routing for the design-system shell (hash-based) */
(function () {
  const routes = ['/', '/dashboard', '/settings', '/saved', '/digest', '/proof'];

  const app = document.getElementById('app');
  const navList = document.getElementById('nav-list');
  const navToggle = document.getElementById('nav-toggle');
  const modal = document.getElementById('modal');

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
    const container = document.createElement('section');
    container.className = 'card';
    const heading = document.createElement('h1');
    heading.className = 'ph-title';
    heading.textContent = 'Saved';
    container.appendChild(heading);

    const ids = getSavedIds();
    if (!ids.length) {
      const empty = document.createElement('div');
      empty.className = 'placeholder card';
      const title = document.createElement('h2');
      title.className = 'ph-title';
      title.textContent = 'No saved jobs yet';
      const sub = document.createElement('p');
      sub.className = 'ph-sub muted';
      sub.textContent = 'Save jobs from the Dashboard to view them here. Your saved items persist across reloads.';
      empty.appendChild(title);
      empty.appendChild(sub);
      app.appendChild(empty);
      return;
    }

    const listWrap = document.createElement('div');
    listWrap.className = 'jobs-grid';
    const savedJobs = JOBS.filter(j => ids.includes(j.id));
    savedJobs.forEach(j => {
      const card = renderJobCard(j);
      listWrap.appendChild(card);
    });
    container.appendChild(listWrap);
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

  /* --- JOB DATA + UTILITIES --- */
  const JOBS = window.JOBS || [];

  function getSavedIds() {
    try {
      const raw = localStorage.getItem('savedJobs');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function setSavedIds(ids) {
    try {
      localStorage.setItem('savedJobs', JSON.stringify(ids));
    } catch (e) {
      // ignore
    }
  }

  function isSaved(id) {
    return getSavedIds().includes(id);
  }

  function toggleSave(id) {
    const ids = getSavedIds();
    const idx = ids.indexOf(id);
    if (idx === -1) {
      ids.push(id);
    } else {
      ids.splice(idx, 1);
    }
    setSavedIds(ids);
    // re-render current route
    handleRoute();
  }

  function openModal(job) {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'false');
    modal.innerHTML = '';
    const panel = document.createElement('div');
    panel.className = 'modal__panel card';
    const h = document.createElement('h2');
    h.className = 'modal__title';
    h.textContent = `${job.title} — ${job.company}`;
    panel.appendChild(h);

    const meta = document.createElement('p');
    meta.className = 'job-meta';
    meta.textContent = `${job.location} • ${job.mode} • ${job.experience} • ${job.salaryRange}`;
    panel.appendChild(meta);

    const desc = document.createElement('div');
    desc.className = 'modal__section';
    const pre = document.createElement('p');
    pre.textContent = job.description;
    desc.appendChild(pre);
    panel.appendChild(desc);

    const skills = document.createElement('div');
    skills.className = 'modal__section';
    const skHead = document.createElement('div');
    skHead.textContent = 'Skills';
    skHead.style.fontWeight = 600;
    skills.appendChild(skHead);
    const list = document.createElement('div');
    list.className = 'skills-list';
    job.skills.forEach((s) => {
      const sp = document.createElement('div');
      sp.className = 'skill';
      sp.textContent = s;
      list.appendChild(sp);
    });
    skills.appendChild(list);
    panel.appendChild(skills);

    const actions = document.createElement('div');
    actions.className = 'job-actions';
    const apply = document.createElement('button');
    apply.className = 'btn btn--primary';
    apply.textContent = 'Apply';
    apply.addEventListener('click', () => {
      window.open(job.applyUrl, '_blank');
    });
    const close = document.createElement('button');
    close.className = 'btn btn--ghost';
    close.textContent = 'Close';
    close.addEventListener('click', closeModal);
    actions.appendChild(apply);
    actions.appendChild(close);
    panel.appendChild(actions);

    modal.appendChild(panel);
    // focus on panel for accessibility
    panel.setAttribute('tabindex', '-1');
    panel.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = '';
  }

  // close modal on outside click or Esc
  document.addEventListener('click', (e) => {
    if (!modal) return;
    if (modal.getAttribute('aria-hidden') === 'false' && e.target === modal) {
      closeModal();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (!modal) return;
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });

  /* --- JOB LIST RENDERING + FILTERS --- */
  function renderJobCard(job) {
    const card = document.createElement('article');
    card.className = 'job-card';
    const header = document.createElement('div');
    header.className = 'job-card__header';
    const title = document.createElement('h3');
    title.className = 'job-title';
    title.textContent = job.title;
    const badges = document.createElement('div');
    badges.className = 'job-badges';
    const source = document.createElement('div');
    source.className = 'badge source';
    source.textContent = job.source;
    badges.appendChild(source);
    header.appendChild(title);
    header.appendChild(badges);
    card.appendChild(header);

    const meta = document.createElement('div');
    meta.className = 'job-meta';
    meta.textContent = `${job.company} • ${job.location} • ${job.mode}`;
    card.appendChild(meta);

    const details = document.createElement('div');
    details.className = 'job-meta';
    details.textContent = `${job.experience} • ${job.salaryRange} • ${job.postedDaysAgo} days ago`;
    card.appendChild(details);

    const actions = document.createElement('div');
    actions.className = 'job-actions';
    const view = document.createElement('button');
    view.className = 'btn';
    view.textContent = 'View';
    view.addEventListener('click', () => openModal(job));
    const save = document.createElement('button');
    save.className = 'btn btn--secondary';
    save.textContent = isSaved(job.id) ? 'Saved' : 'Save';
    save.addEventListener('click', () => toggleSave(job.id));
    const apply = document.createElement('button');
    apply.className = 'btn btn--primary';
    apply.textContent = 'Apply';
    apply.addEventListener('click', () => window.open(job.applyUrl, '_blank'));
    actions.appendChild(view);
    actions.appendChild(save);
    actions.appendChild(apply);
    card.appendChild(actions);
    return card;
  }

  // Filters and state (local only)
  let filters = {
    q: '',
    location: '',
    mode: '',
    experience: '',
    source: '',
    sort: 'latest'
  };

  function applyFilters(list) {
    let out = list.slice();
    const q = filters.q.trim().toLowerCase();
    if (q) {
      out = out.filter(j => (j.title + ' ' + j.company).toLowerCase().includes(q));
    }
    if (filters.location) {
      out = out.filter(j => j.location === filters.location);
    }
    if (filters.mode) {
      out = out.filter(j => j.mode === filters.mode);
    }
    if (filters.experience) {
      out = out.filter(j => j.experience === filters.experience);
    }
    if (filters.source) {
      out = out.filter(j => j.source === filters.source);
    }
    if (filters.sort === 'latest') {
      out.sort((a,b)=> a.postedDaysAgo - b.postedDaysAgo);
    } else {
      out.sort((a,b)=> b.postedDaysAgo - a.postedDaysAgo);
    }
    return out;
  }

  function uniqueValues(list, key) {
    return Array.from(new Set(list.map(j => j[key]))).filter(Boolean).sort();
  }

  function renderDashboard() {
    app.innerHTML = '';
    const container = document.createElement('section');
    container.className = 'card';
    // heading
    const heading = document.createElement('h1');
    heading.className = 'ph-title';
    heading.textContent = 'Dashboard';
    container.appendChild(heading);

    // filter bar
    const filterBar = document.createElement('div');
    filterBar.className = 'filter-bar';

    // search
    const fiSearch = document.createElement('div');
    fiSearch.className = 'filter-item';
    const labSearch = document.createElement('label');
    labSearch.textContent = 'Keyword';
    const inputSearch = document.createElement('input');
    inputSearch.className = 'filter-input';
    inputSearch.placeholder = 'Title or company';
    inputSearch.value = filters.q;
    inputSearch.addEventListener('input', (e)=>{ filters.q = e.target.value; renderJobList(); });
    fiSearch.appendChild(labSearch);
    fiSearch.appendChild(inputSearch);
    filterBar.appendChild(fiSearch);

    // location
    const fiLoc = document.createElement('div');
    fiLoc.className = 'filter-item';
    const labLoc = document.createElement('label');
    labLoc.textContent = 'Location';
    const selLoc = document.createElement('select');
    selLoc.className = 'filter-select';
    const locs = uniqueValues(JOBS, 'location');
    const optAny = document.createElement('option'); optAny.value=''; optAny.textContent='Any';
    selLoc.appendChild(optAny);
    locs.forEach(l => { const o=document.createElement('option'); o.value=l; o.textContent=l; selLoc.appendChild(o);});
    selLoc.value = filters.location;
    selLoc.addEventListener('change', (e)=>{ filters.location = e.target.value; renderJobList(); });
    fiLoc.appendChild(labLoc);
    fiLoc.appendChild(selLoc);
    filterBar.appendChild(fiLoc);

    // mode
    const fiMode = document.createElement('div');
    fiMode.className = 'filter-item';
    const labMode = document.createElement('label');
    labMode.textContent = 'Mode';
    const selMode = document.createElement('select');
    selMode.className = 'filter-select';
    ['','Remote','Hybrid','Onsite'].forEach(m=>{ const o=document.createElement('option'); o.value=m; o.textContent=m||'Any'; selMode.appendChild(o);});
    selMode.value = filters.mode;
    selMode.addEventListener('change', (e)=>{ filters.mode = e.target.value; renderJobList(); });
    fiMode.appendChild(labMode);
    fiMode.appendChild(selMode);
    filterBar.appendChild(fiMode);

    // experience
    const fiExp = document.createElement('div');
    fiExp.className = 'filter-item';
    const labExp = document.createElement('label');
    labExp.textContent = 'Experience';
    const selExp = document.createElement('select');
    selExp.className = 'filter-select';
    ['', 'Fresher','0-1','1-3','3-5'].forEach(v=>{ const o=document.createElement('option'); o.value=v; o.textContent=v||'Any'; selExp.appendChild(o);});
    selExp.value = filters.experience;
    selExp.addEventListener('change', (e)=>{ filters.experience = e.target.value; renderJobList(); });
    fiExp.appendChild(labExp);
    fiExp.appendChild(selExp);
    filterBar.appendChild(fiExp);

    // source
    const fiSrc = document.createElement('div');
    fiSrc.className = 'filter-item';
    const labSrc = document.createElement('label');
    labSrc.textContent = 'Source';
    const selSrc = document.createElement('select');
    selSrc.className = 'filter-select';
    const srcs = uniqueValues(JOBS, 'source');
    const optAny2 = document.createElement('option'); optAny2.value=''; optAny2.textContent='Any';
    selSrc.appendChild(optAny2);
    srcs.forEach(s => { const o=document.createElement('option'); o.value=s; o.textContent=s; selSrc.appendChild(o);});
    selSrc.value = filters.source;
    selSrc.addEventListener('change', (e)=>{ filters.source = e.target.value; renderJobList(); });
    fiSrc.appendChild(labSrc);
    fiSrc.appendChild(selSrc);
    filterBar.appendChild(fiSrc);

    // sort
    const fiSort = document.createElement('div');
    fiSort.className = 'filter-item';
    const labSort = document.createElement('label');
    labSort.textContent = 'Sort';
    const selSort = document.createElement('select');
    selSort.className = 'filter-select';
    const sLatest = document.createElement('option'); sLatest.value='latest'; sLatest.textContent='Latest';
    const sOld = document.createElement('option'); sOld.value='oldest'; sOld.textContent='Oldest';
    selSort.appendChild(sLatest); selSort.appendChild(sOld);
    selSort.value = filters.sort;
    selSort.addEventListener('change', (e)=>{ filters.sort = e.target.value; renderJobList(); });
    fiSort.appendChild(labSort);
    fiSort.appendChild(selSort);
    filterBar.appendChild(fiSort);

    container.appendChild(filterBar);

    // job list area
    const listWrap = document.createElement('div');
    listWrap.id = 'jobs-list';
    listWrap.className = 'jobs-grid';
    container.appendChild(listWrap);

    app.appendChild(container);

    // initial render of list
    renderJobList();
  }

  function renderJobList() {
    const listWrap = document.getElementById('jobs-list');
    listWrap.innerHTML = '';
    const filtered = applyFilters(JOBS);
    if (!filtered.length) {
      const empty = document.createElement('div');
      empty.className = 'placeholder card';
      const title = document.createElement('h2');
      title.className = 'ph-title';
      title.textContent = 'No jobs match your search.';
      empty.appendChild(title);
      listWrap.appendChild(empty);
      return;
    }
    filtered.forEach(job => {
      const card = renderJobCard(job);
      listWrap.appendChild(card);
    });
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

