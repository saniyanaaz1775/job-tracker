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
    // Build full preferences form with save/load to localStorage
    app.innerHTML = '';
    const container = document.createElement('section');
    container.className = 'card';
    const heading = document.createElement('h1');
    heading.className = 'ph-title';
    heading.textContent = 'Settings';
    container.appendChild(heading);

    const prefs = getPreferencesOrDefaults();

    const form = document.createElement('div');
    form.className = 'form';

    // Role keywords (comma-separated)
    const row1 = document.createElement('div');
    row1.className = 'form-row';
    const label1 = document.createElement('label');
    label1.textContent = 'Role keywords (comma-separated)';
    const input1 = document.createElement('input');
    input1.className = 'input';
    input1.placeholder = 'e.g., Product Manager, Backend Engineer';
    input1.value = Array.isArray(prefs.roleKeywords) ? prefs.roleKeywords.join(', ') : (prefs.roleKeywords || '');
    row1.appendChild(label1);
    row1.appendChild(input1);
    form.appendChild(row1);

    // Preferred locations (multi-select)
    const row2 = document.createElement('div');
    row2.className = 'form-row';
    const label2 = document.createElement('label');
    label2.textContent = 'Preferred locations (multi-select)';
    const selLoc = document.createElement('select');
    selLoc.className = 'input';
    selLoc.multiple = true;
    const allLocs = uniqueValues(JOBS, 'location');
    allLocs.forEach(l => {
      const o = document.createElement('option');
      o.value = l;
      o.textContent = l;
      if (prefs.preferredLocations && prefs.preferredLocations.includes(l)) o.selected = true;
      selLoc.appendChild(o);
    });
    row2.appendChild(label2);
    row2.appendChild(selLoc);
    form.appendChild(row2);

    // preferredMode (checkboxes)
    const row3 = document.createElement('div');
    row3.className = 'form-row';
    const label3 = document.createElement('label');
    label3.textContent = 'Preferred mode';
    const modesWrap = document.createElement('div');
    modesWrap.className = 'radio-group';
    ['Remote', 'Hybrid', 'Onsite'].forEach((m) => {
      const wrap = document.createElement('label');
      wrap.className = 'radio';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.value = m;
      if (prefs.preferredMode && prefs.preferredMode.includes(m)) cb.checked = true;
      const span = document.createElement('span');
      span.textContent = m;
      wrap.appendChild(cb);
      wrap.appendChild(span);
      modesWrap.appendChild(wrap);
    });
    row3.appendChild(label3);
    row3.appendChild(modesWrap);
    form.appendChild(row3);

    // experienceLevel dropdown (values match job.experience)
    const row4 = document.createElement('div');
    row4.className = 'form-row';
    const label4 = document.createElement('label');
    label4.textContent = 'Experience level';
    const selExp = document.createElement('select');
    selExp.className = 'input';
    ['', 'Fresher','0-1','1-3','3-5'].forEach(v=>{ const o=document.createElement('option'); o.value=v; o.textContent=v||'Any'; selExp.appendChild(o);});
    selExp.value = prefs.experienceLevel || '';
    row4.appendChild(label4);
    row4.appendChild(selExp);
    form.appendChild(row4);

    // skills (comma-separated)
    const row5 = document.createElement('div');
    row5.className = 'form-row';
    const label5 = document.createElement('label');
    label5.textContent = 'Skills (comma-separated)';
    const input5 = document.createElement('input');
    input5.className = 'input';
    input5.placeholder = 'e.g., React, Node.js, SQL';
    input5.value = Array.isArray(prefs.skills) ? prefs.skills.join(', ') : (prefs.skills || '');
    row5.appendChild(label5);
    row5.appendChild(input5);
    form.appendChild(row5);

    // minMatchScore slider
    const row6 = document.createElement('div');
    row6.className = 'form-row';
    const label6 = document.createElement('label');
    label6.textContent = 'Minimum match score threshold';
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 100;
    slider.value = prefs.minMatchScore || 40;
    slider.className = 'input';
    const sliderVal = document.createElement('div');
    sliderVal.textContent = slider.value;
    slider.addEventListener('input', ()=>{ sliderVal.textContent = slider.value; });
    row6.appendChild(label6);
    row6.appendChild(slider);
    row6.appendChild(sliderVal);
    form.appendChild(row6);

    // Save button
    const saveRow = document.createElement('div');
    saveRow.className = 'form-row';
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn--primary';
    saveBtn.textContent = 'Save preferences';
    saveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const prefsOut = {
        roleKeywords: input1.value.split(',').map(s=>s.trim()).filter(Boolean),
        preferredLocations: Array.from(selLoc.selectedOptions).map(o=>o.value),
        preferredMode: Array.from(modesWrap.querySelectorAll('input[type=checkbox]')).filter(i=>i.checked).map(i=>i.value),
        experienceLevel: selExp.value,
        skills: input5.value.split(',').map(s=>s.trim()).filter(Boolean),
        minMatchScore: Number(slider.value)
      };
      savePreferences(prefsOut);
      // immediate feedback: recompute match scores if on dashboard
      if (location.hash === '#/dashboard' || location.hash === '#/') {
        handleRoute();
      }
    });
    saveRow.appendChild(saveBtn);
    form.appendChild(saveRow);

    const note = document.createElement('p');
    note.className = 'muted';
    note.textContent = 'Preferences are stored locally in your browser.';
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
    const prefs = loadPreferences();
    if (prefs) computeAllMatchScores();
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
    const prefs = loadPreferences();
    const container = document.createElement('div');
    container.className = 'digest-container';

    if (!prefs || !prefs.roleKeywords || prefs.roleKeywords.length === 0) {
      const block = document.createElement('div');
      block.className = 'card';
      block.style.padding = '16px';
      const msg = document.createElement('div');
      msg.textContent = 'Set preferences to generate a personalized digest.';
      block.appendChild(msg);
      container.appendChild(block);
      app.appendChild(container);
      return;
    }

    // header + actions
    const header = document.createElement('div');
    header.className = 'digest-header';
    const title = document.createElement('h2');
    title.className = 'title';
    title.textContent = 'Top 10 Jobs For You — 9AM Digest';
    const date = document.createElement('p');
    date.className = 'date';
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth()+1).padStart(2,'0');
    const dd = String(today.getDate()).padStart(2,'0');
    const isoDay = `${yyyy}-${mm}-${dd}`;
    date.textContent = `Date: ${isoDay}`;
    header.appendChild(title);
    header.appendChild(date);

    const actions = document.createElement('div');
    actions.className = 'digest-actions';
    const genBtn = document.createElement('button');
    genBtn.className = 'btn btn--primary';
    genBtn.textContent = `Generate Today's 9AM Digest (Simulated)`;
    actions.appendChild(genBtn);
    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn btn--secondary';
    copyBtn.textContent = 'Copy Digest to Clipboard';
    copyBtn.disabled = true;
    actions.appendChild(copyBtn);
    const mailBtn = document.createElement('button');
    mailBtn.className = 'btn btn--ghost';
    mailBtn.textContent = 'Create Email Draft';
    mailBtn.disabled = true;
    actions.appendChild(mailBtn);

    container.appendChild(header);
    container.appendChild(actions);

    const note = document.createElement('div');
    note.className = 'digest-note';
    note.textContent = 'Demo Mode: Daily 9AM trigger simulated manually.';
    container.appendChild(note);

    // load existing digest if present
    const storageKey = `jobTrackerDigest_${isoDay}`;
    let digest = null;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) digest = JSON.parse(raw);
    } catch (e) {
      digest = null;
    }

    function renderDigestFromList(list) {
      // remove old list if any
      const existing = container.querySelectorAll('.digest-job, .digest-footer');
      existing.forEach(n => n.remove());
      if (!list || !list.length) {
        const empty = document.createElement('div');
        empty.className = 'placeholder card';
        const t = document.createElement('h3');
        t.className = 'ph-title';
        t.textContent = 'No matching roles today. Check again tomorrow.';
        empty.appendChild(t);
        container.appendChild(empty);
        return;
      }
      list.forEach((job) => {
        const row = document.createElement('div');
        row.className = 'digest-job';
        const left = document.createElement('div');
        left.className = 'left';
        const jt = document.createElement('div');
        jt.className = 'title';
        jt.textContent = job.title;
        const jm = document.createElement('p');
        jm.className = 'meta';
        jm.textContent = `${job.company} • ${job.location} • ${job.experience}`;
        left.appendChild(jt);
        left.appendChild(jm);
        const right = document.createElement('div');
        right.className = 'right';
        const score = document.createElement('div');
        score.className = 'badge badge-score';
        score.textContent = `${job._matchScore || 0}`;
        if ((job._matchScore || 0) >= 80) score.classList.add('badge-score--green');
        else if ((job._matchScore || 0) >= 60) score.classList.add('badge-score--amber');
        else if ((job._matchScore || 0) >= 40) score.classList.add('badge-score--neutral');
        else score.classList.add('badge-score--muted');
        const apply = document.createElement('button');
        apply.className = 'btn btn--primary';
        apply.textContent = 'Apply';
        apply.addEventListener('click', ()=> window.open(job.applyUrl, '_blank'));
        right.appendChild(score);
        right.appendChild(apply);
        row.appendChild(left);
        row.appendChild(right);
        container.appendChild(row);
      });

      const footer = document.createElement('div');
      footer.className = 'digest-footer';
      footer.textContent = 'This digest was generated based on your preferences.';
      container.appendChild(footer);
    }

    function formatDigestText(list) {
      const headerLine = `Top 10 Jobs For You — 9AM Digest\nDate: ${isoDay}\n\n`;
      const body = list.map((job, i) => {
        return `${i+1}. ${job.title} — ${job.company}\n   ${job.location} | ${job.experience} | Match: ${job._matchScore || 0}\n   Apply: ${job.applyUrl}\n`;
      }).join('\n');
      return headerLine + body + `\nThis digest was generated based on your preferences.\n`;
    }

    function generateAndStoreDigest() {
      // ensure match scores computed
      computeAllMatchScores();
      // select top 10 sorted by matchScore desc, postedDaysAgo asc
      const list = JOBS.slice().sort((a,b)=>{
        const s = (b._matchScore || 0) - (a._matchScore || 0);
        if (s !== 0) return s;
        return a.postedDaysAgo - b.postedDaysAgo;
      }).slice(0,10);
      const payload = { createdAt: new Date().toISOString(), jobs: list };
      try {
        localStorage.setItem(storageKey, JSON.stringify(payload));
        digest = payload;
      } catch (e) {
        // ignore
      }
      return list;
    }

    // wire up buttons
    if (digest && digest.jobs && digest.jobs.length) {
      // render existing
      renderDigestFromList(digest.jobs);
      copyBtn.disabled = false;
      mailBtn.disabled = false;
    }

    genBtn.addEventListener('click', ()=> {
      if (!prefs) {
        alert('Set preferences to generate personalized digest.');
        return;
      }
      // if already exists, load existing instead
      if (digest) {
        renderDigestFromList(digest.jobs);
        copyBtn.disabled = false;
        mailBtn.disabled = false;
        return;
      }
      const list = generateAndStoreDigest();
      renderDigestFromList(list);
      copyBtn.disabled = false;
      mailBtn.disabled = false;
    });

    copyBtn.addEventListener('click', async ()=> {
      const current = digest && digest.jobs ? digest.jobs : null;
      if (!current) return;
      const text = formatDigestText(current);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          // subtle feedback
          copyBtn.textContent = 'Copied';
          setTimeout(()=> copyBtn.textContent = 'Copy Digest to Clipboard', 1500);
        } catch (e) {
          // fallback
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
    });

    mailBtn.addEventListener('click', ()=> {
      const current = digest && digest.jobs ? digest.jobs : null;
      if (!current) return;
      const body = formatDigestText(current);
      const subject = 'My 9AM Job Digest';
      const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
    });

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

  /* --- Preferences (localStorage) --- */
  const PREF_KEY = 'jobTrackerPreferences';

  function loadPreferences() {
    try {
      const raw = localStorage.getItem(PREF_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function savePreferences(prefs) {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
    } catch (e) {
      // ignore
    }
  }

  function getPreferencesOrDefaults() {
    const p = loadPreferences() || {};
    return {
      roleKeywords: Array.isArray(p.roleKeywords) ? p.roleKeywords : (p.roleKeywords ? p.roleKeywords : ''),
      preferredLocations: Array.isArray(p.preferredLocations) ? p.preferredLocations : (p.preferredLocations || []),
      preferredMode: Array.isArray(p.preferredMode) ? p.preferredMode : (p.preferredMode || []),
      experienceLevel: p.experienceLevel || '',
      skills: Array.isArray(p.skills) ? p.skills : (p.skills || ''),
      minMatchScore: typeof p.minMatchScore === 'number' ? p.minMatchScore : 40
    };
  }

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
    // match score badge (if present)
    if (typeof job._matchScore === 'number') {
      const ms = document.createElement('div');
      ms.className = 'badge badge-score';
      const s = job._matchScore;
      ms.textContent = `${s}`;
      if (s >= 80) ms.classList.add('badge-score--green');
      else if (s >= 60) ms.classList.add('badge-score--amber');
      else if (s >= 40) ms.classList.add('badge-score--neutral');
      else ms.classList.add('badge-score--muted');
      badges.appendChild(ms);
    }
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
    sort: 'latest',
    showOnlyMatches: false
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
    // Sorting: latest, oldest, match, salary
    if (filters.sort === 'latest') {
      out.sort((a,b)=> a.postedDaysAgo - b.postedDaysAgo);
    } else if (filters.sort === 'oldest') {
      out.sort((a,b)=> b.postedDaysAgo - a.postedDaysAgo);
    } else if (filters.sort === 'match') {
      out.sort((a,b)=> (b._matchScore || 0) - (a._matchScore || 0));
    } else if (filters.sort === 'salary') {
      out.sort((a,b)=> salaryToLPA(b) - salaryToLPA(a));
    }
    return out;
  }

  function uniqueValues(list, key) {
    return Array.from(new Set(list.map(j => j[key]))).filter(Boolean).sort();
  }

  /* --- Matching engine --- */
  function normalizeText(s) {
    return (s || '').toString().toLowerCase();
  }

  function skillsArray(input) {
    if (!input) return [];
    if (Array.isArray(input)) return input.map(s=>s.toLowerCase());
    return input.split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
  }

  function computeMatchScore(job, prefs) {
    let score = 0;
    const roleKeywords = Array.isArray(prefs.roleKeywords) ? prefs.roleKeywords.map(s=>s.toLowerCase()) : skillsArray(prefs.roleKeywords);
    const jobTitle = normalizeText(job.title);
    const jobDesc = normalizeText(job.description);
    // +25 if any roleKeyword appears in job.title (case-insensitive)
    if (roleKeywords.some(k => k && jobTitle.includes(k))) score += 25;
    // +15 if any roleKeyword appears in job.description
    if (roleKeywords.some(k => k && jobDesc.includes(k))) score += 15;
    // +15 if job.location matches preferredLocations
    if (prefs.preferredLocations && prefs.preferredLocations.includes(job.location)) score += 15;
    // +10 if job.mode matches preferredMode (any)
    if (prefs.preferredMode && prefs.preferredMode.includes(job.mode)) score += 10;
    // +10 if job.experience matches experienceLevel
    if (prefs.experienceLevel && prefs.experienceLevel === job.experience) score += 10;
    // +15 if overlap between job.skills and user.skills
    const userSkills = skillsArray(prefs.skills);
    const jobSkills = (job.skills || []).map(s=>s.toLowerCase());
    if (userSkills.length && jobSkills.some(js => userSkills.includes(js))) score += 15;
    // +5 if postedDaysAgo <= 2
    if (typeof job.postedDaysAgo === 'number' && job.postedDaysAgo <= 2) score += 5;
    // +5 if source is LinkedIn
    if (job.source === 'LinkedIn') score += 5;
    if (score > 100) score = 100;
    return score;
  }

  function computeAllMatchScores() {
    const prefs = loadPreferences() || {};
    JOBS.forEach(job => {
      job._matchScore = computeMatchScore(job, prefs);
    });
  }

  function salaryToLPA(job) {
    if (!job || !job.salaryRange) return 0;
    const s = job.salaryRange;
    // examples: "3–5 LPA", "10–18 LPA", "₹15k–₹40k/month Internship"
    // extract all numbers with optional k
    const parts = s.match(/(\d+(?:\.\d+)?k?)/g);
    if (!parts || parts.length === 0) return 0;
    const nums = parts.map(p => {
      if (p.toLowerCase().endsWith('k')) {
        return parseFloat(p.slice(0,-1)) * 1000; // rupees
      }
      return parseFloat(p);
    });
    // determine if range in LPA or rupees/month by presence of 'LPA' or '/month'
    if (s.toLowerCase().includes('lpa')) {
      // nums are in lakhs (e.g., 3,5)
      const avg = nums.reduce((a,b)=>a+b,0)/nums.length;
      return avg; // already in LPA
    } else if (s.toLowerCase().includes('/month') || s.toLowerCase().includes('month')) {
      // nums are in rupees per month, convert to annual LPA
      const avgRupees = nums.reduce((a,b)=>a+b,0)/nums.length;
      const annual = avgRupees * 12;
      return Math.round((annual / 100000) * 100)/100;
    } else {
      // fallback: treat numbers as LPA if reasonable (>10 treat as rupees)
      const avg = nums.reduce((a,b)=>a+b,0)/nums.length;
      if (avg > 1000) {
        // rupees annual, convert
        return Math.round((avg / 100000) * 100)/100;
      }
      return avg;
    }
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

    // preferences check banner
    const prefs = loadPreferences();
    if (!prefs) {
      const banner = document.createElement('div');
      banner.className = 'card';
      banner.style.borderLeft = `4px solid ${getComputedStyle(document.documentElement).getPropertyValue('--color-accent')}`;
      banner.style.padding = '12px';
      banner.style.marginBottom = '16px';
      const btext = document.createElement('div');
      btext.textContent = 'Set your preferences to activate intelligent matching.';
      banner.appendChild(btext);
      container.appendChild(banner);
    } else {
      // compute match scores when preferences exist
      computeAllMatchScores();
    }

    // filter bar
    const filterBar = document.createElement('div');
    filterBar.className = 'filter-bar';

    // show only matches toggle
    const fiMatchToggle = document.createElement('div');
    fiMatchToggle.className = 'filter-item';
    const labMatchToggle = document.createElement('label');
    labMatchToggle.textContent = 'Show only jobs above my threshold';
    const toggleInput = document.createElement('input');
    toggleInput.type = 'checkbox';
    toggleInput.style.marginLeft = '8px';
    toggleInput.checked = !!filters.showOnlyMatches;
    toggleInput.addEventListener('change', (e)=>{ filters.showOnlyMatches = e.target.checked; renderJobList(); });
    fiMatchToggle.appendChild(labMatchToggle);
    fiMatchToggle.appendChild(toggleInput);
    filterBar.appendChild(fiMatchToggle);

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
    const sMatch = document.createElement('option'); sMatch.value='match'; sMatch.textContent='Match score';
    const sSalary = document.createElement('option'); sSalary.value='salary'; sSalary.textContent='Salary';
    selSort.appendChild(sLatest); selSort.appendChild(sOld); selSort.appendChild(sMatch); selSort.appendChild(sSalary);
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
    if (!listWrap) return;
    const filtered = applyFilters(JOBS);
    // compute match scores if preferences set
    computeAllMatchScores();
    // apply showOnlyMatches if enabled and preferences exist
    const prefs = loadPreferences();
    let finalList = filtered;
    if (filters.showOnlyMatches && prefs) {
      const threshold = Number(prefs.minMatchScore || 40);
      finalList = finalList.filter(j => (j._matchScore || 0) >= threshold);
    }
    // performance: avoid re-render when IDs identical
    const newIds = finalList.map(j=>j.id).join(',');
    if (renderJobList._lastIds === newIds) return;
    renderJobList._lastIds = newIds;
    listWrap.innerHTML = '';
    if (!finalList.length) {
      const empty = document.createElement('div');
      empty.className = 'placeholder card';
      const title = document.createElement('h2');
      title.className = 'ph-title';
      // Edge case: preferences exist but no matches
      if (prefs && filters.showOnlyMatches) {
        title.textContent = 'No roles match your criteria. Adjust filters or lower threshold.';
      } else {
        title.textContent = 'No jobs match your search.';
      }
      empty.appendChild(title);
      listWrap.appendChild(empty);
      return;
    }
    finalList.forEach(job => {
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

