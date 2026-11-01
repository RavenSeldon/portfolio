(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const label = toggle.querySelector('.theme-label');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let explicitChoice = false;
  try {
    explicitChoice = ['light', 'dark'].includes(localStorage.getItem('portfolio-theme'));
  } catch (_) {}

  function themeText(key, fallback) { return window.PortfolioI18n?.t(key) ?? fallback; }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const dark = theme === 'dark';
    toggle.setAttribute('aria-label', themeText(dark ? 'toLight' : 'toDark', `Switch to ${dark ? 'light' : 'dark'} mode`));
    label.textContent = themeText(dark ? 'light' : 'dark', dark ? 'Light' : 'Dark');
    toggle.title = toggle.getAttribute('aria-label');
    themeColor.content = dark ? '#0d1024' : '#f6f7fc';
  }

  document.addEventListener('portfolio:languagechange', () => applyTheme(root.dataset.theme));
  applyTheme(root.dataset.theme);
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    explicitChoice = true;
    applyTheme(theme);
    try { localStorage.setItem('portfolio-theme', theme); } catch (_) {}
  });
  systemTheme.addEventListener('change', event => {
    if (!explicitChoice) applyTheme(event.matches ? 'dark' : 'light');
  });

  const navLinks = [...document.querySelectorAll('.section-nav a')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href')));
  let scheduled = false;
  function updateCurrentSection() {
    const marker = document.querySelector('.section-nav').getBoundingClientRect().height + 90;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= marker) current = section;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5) {
      current = sections[sections.length - 1];
    }
    navLinks.forEach((link, index) => {
      if (sections[index] === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  }
  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateCurrentSection);
  }
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  updateCurrentSection();
})();
