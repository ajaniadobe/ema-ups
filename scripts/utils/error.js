import { loadCSS } from '../aem.js';
import ENV from './env.js';

export default async function error(ex, el) {
  // eslint-disable-next-line no-console
  console.log(ex);
  if (el && ENV !== 'prod') {
    await loadCSS(`${window.hlx.codeBasePath}/styles/error.css`);
    const wrapper = document.createElement('div');
    wrapper.className = 'has-error';

    const title = document.createElement('p');
    title.className = 'title';
    title.textContent = 'Error';
    el.insertAdjacentElement('afterend', wrapper);
    wrapper.append(title, el);
  }
}
