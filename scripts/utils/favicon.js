import { getMetadata } from '../aem.js';

(async function loadFavicon() {
  const codeBase = window.hlx.codeBasePath;
  const name = getMetadata('favicon') || 'favicon';
  const favBase = `${codeBase}/img/favicons/${name}`;

  const tags = `<link rel="apple-touch-icon" href="${favBase}-180.png">
                <link rel="manifest" href="${favBase}.webmanifest">`;
  document.head.insertAdjacentHTML('beforeend', tags);

  const favicon = document.head.querySelector('link[href="data:,"]');
  if (favicon) favicon.href = `${favBase}.ico`;
}());
