const locales = {
  '': { lang: 'en' },
  '/de': { lang: 'de' },
  '/es': { lang: 'es' },
  '/fr': { lang: 'fr' },
  '/hi': { lang: 'hi' },
  '/ja': { lang: 'ja' },
  '/zh': { lang: 'zh' },
};

function getLocalePrefix() {
  const { pathname } = window.location;
  const matches = Object.keys(locales).filter((l) => l && pathname.startsWith(`${l}/`));
  return matches.sort((a, b) => b.length - a.length)?.[0] || '';
}

export const locale = { prefix: getLocalePrefix() };

export function localizeUrl(url) {
  if (locale.prefix === '') return null;
  const { origin, pathname, search, hash } = url;
  if (pathname.startsWith(`${locale.prefix}/`)) return null;
  const localized = Object.keys(locales).some(
    (key) => key !== '' && pathname.startsWith(`${key}/`),
  );
  if (localized) return null;
  return new URL(`${origin}${locale.prefix}${pathname}${search}${hash}`);
}
