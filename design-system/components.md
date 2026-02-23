# Component guidelines — Job Notification App

Follow these rules precisely for consistent UI.

Tokens
- Import variables from `styles.css` or use `tokens.json` programmatically.

Border radius
- Use `--radius-base` everywhere.

Buttons
- Primary: solid deep red (#8B0000). Use `.btn.btn--primary`.
- Secondary: outlined. Use `.btn.btn--secondary`.
- Ghost: minimal, for low-priority actions `.btn--ghost`.
- Disabled: lower opacity, disabled pointer events.

Inputs
- Clean 1px border, border color `--color-border-muted`.
- Focus: subtle ring using the accent with low alpha.
- Error: `.input--error` with `--color-warning` border and a clear message that explains how to fix the issue (never blame the user).

Cards
- Subtle border, white surface, no drop shadows. Use `.card`.
- Title: `.card__title`, Body: `.card__body`.
- Keep internal spacing to `--space-md` or `--space-sm`.

Layout structure
- Top Bar: `.topbar` contains brand (left), progress (center), status (right).
- Context header: `.context-header` large serif headline, one-line subtext.
- Page grid: `.page` with 70% / 30% columns.
- Secondary panel: `.secondary` contains step explanation, prompt box, copy buttons.
- Proof footer: `.proof-footer` checklist style.

Interaction rules
- Transitions 150–200ms, ease-in-out (see `--motion-duration` and `--motion-easing`).
- No bounce, no parallax, no noisy or decorative motion.

Error & empty states
- Title explaining the situation (serif headline).
- One-line explanation of cause and next step (actionable).
- Provide a primary action where relevant (e.g., "Retry", "Create first notification").

Examples

Basic Top Bar + Header:

```html
<header class="topbar">
  <div class="topbar__brand">Job Notification App</div>
  <div class="topbar__progress">Step 1 / 3</div>
  <div class="topbar__status">Not Started</div>
</header>

<section class="context-header">
  <h1 class="context-header__title">Notify candidates about new openings</h1>
  <p class="context-header__sub">One-line description explaining the purpose and next step.</p>
</section>
```

Primary + Secondary layout:

```html
<main class="page">
  <section class="card">
    <h2 class="card__title">Primary workspace</h2>
    <p class="card__body">Main working area. Keep content 720px or less for text blocks.</p>
    <div style="margin-top:var(--space-md)">
      <button class="btn btn--primary">Shipped</button>
      <button class="btn btn--secondary">Save draft</button>
    </div>
  </section>

  <aside class="secondary">
    <div class="card">
      <h3 class="card__title">Step explanation</h3>
      <div class="prompt-box">Copyable prompt or step description goes here.</div>
      <button class="btn copy-btn">Copy</button>
    </div>
  </aside>
</main>
```

Proof footer:

```html
<footer class="proof-footer">
  <div class="proof-footer__item">□ UI Built</div>
  <div class="proof-footer__item">□ Logic Working</div>
  <div class="proof-footer__item">□ Test Passed</div>
  <div class="proof-footer__item">□ Deployed</div>
</footer>
```

Notes
- Keep spacing only from the defined scale (8, 16, 24, 40, 64). Use tokens, never hard-coded intermediate values.
- Headings must use the serif heading font and generous spacing.
- Avoid decorative fonts and random sizes.

