(() => {
  const dictionaries = window.PORTFOLIO_TRANSLATIONS;
  if (!dictionaries) return;
  const supported = ['en', 'fr', 'nl', 'zh-Hans', 'ja'];
  const select = document.querySelector('#language-select');
  const bindings = [];
  const attributes = ['aria-label', 'alt', 'content'];
  document.querySelectorAll('[data-i18n], [data-i18n-aria-label], [data-i18n-alt], [data-i18n-content]').forEach(element => {
    if (element.dataset.i18n) bindings.push({ element, key: element.dataset.i18n, original: element.textContent });
    attributes.forEach(attribute => {
      const key = element.getAttribute(`data-i18n-${attribute}`);
      if (key) bindings.push({ element, key, attribute, original: element.getAttribute(attribute) });
    });
  });
  let language = 'en';
  function t(key) {
    return dictionaries[language]?.[key] ?? dictionaries.en[key] ?? key;
  }
  function applyLanguage(next, persist = false) {
    language = supported.includes(next) ? next : 'en';
    document.documentElement.lang = language;
    select.value = language;
    bindings.forEach(({ element, key, attribute, original }) => {
      const translated = language === 'en' ? original : dictionaries[language]?.[key];
      const text = translated ?? original;
      if (attribute) element.setAttribute(attribute, text);
      else element.textContent = text;
      // A future untranslated project remains readable, with the correct screen-reader language.
      if (!attribute || attribute === 'alt' || attribute === 'aria-label') {
        if (language !== 'en' && translated === undefined) element.setAttribute('lang', 'en');
        else element.removeAttribute('lang');
      }
    });
    if (persist) {
      try { localStorage.setItem('portfolio-language', language); } catch (_) {}
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', language);
        history.replaceState(null, '', url);
      } catch (_) {}
    }
    document.dispatchEvent(new CustomEvent('portfolio:languagechange'));
    window.dispatchEvent(new Event('resize'));
  }
  window.PortfolioI18n = { t, get language() { return language; } };
  let saved;
  try { saved = localStorage.getItem('portfolio-language'); } catch (_) {}
  const requested = new URLSearchParams(window.location.search).get('lang');
  applyLanguage(supported.includes(requested) ? requested : saved);
  select.addEventListener('change', () => applyLanguage(select.value, true));
  select.closest('.language-control').hidden = false;
})();
