import {
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  loadSections,
} from '../../scripts/aem.js';

function replaceDotMedia(path, doc) {
  const resetAttributeBase = (tag, attr) => {
    doc.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((el) => {
      el[attr] = new URL(el.getAttribute(attr), new URL(path, window.location)).href;
    });
  };
  resetAttributeBase('img', 'src');
  resetAttributeBase('source', 'srcset');
}

/**
 * Loads a fragment.
 * @param {string} path The path to the fragment
 * @returns {HTMLElement} The root element of the fragment
 */
export async function loadFragment(path) {
  const resp = await fetch(`${path}.plain.html`);
  if (!resp.ok) throw Error(`Couldn't fetch ${path}`);

  const html = await resp.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');

  let sections = doc.body.querySelectorAll('main > div');
  if (!sections.length) sections = doc.body.querySelectorAll(':scope > div');
  const fragment = document.createElement('div');
  fragment.classList.add('fragment-content');
  fragment.append(...sections);

  replaceDotMedia(path, doc);

  const main = document.createElement('main');
  main.append(fragment);
  decorateButtons(main);
  decorateIcons(main);
  decorateSections(main);
  decorateBlocks(main);
  await loadSections(main);

  fragment.remove();
  main.remove();

  return fragment;
}

function getReplaceEl(a) {
  let current = a;
  const ancestor = a.closest('.section');
  while (current && current !== ancestor) {
    const childCount = current.parentElement.children.length;
    if (childCount <= 1) {
      current = current.parentElement;
    } else {
      break;
    }
  }
  return current;
}

function getRequestPath(a) {
  const { hostname, pathname } = a;
  const href = a.getAttribute('href');
  if (href.startsWith('/')) return pathname;
  if (hostname === window.location.hostname) return pathname;
  const isAem = ['.da.', '.aem.', 'local'].some((host) => hostname.includes(host));
  if (isAem) {
    const [aemOrg, aemSite] = hostname.split('.')[0].split('--').reverse();
    const [winOrg, winSite] = window.location.hostname.split('.')[0].split('--').reverse();
    if ((aemOrg === winOrg) && (aemSite === winSite)) return pathname;
  }
  return a.href;
}

export default async function init(a) {
  const path = getRequestPath(a);

  const fragment = await loadFragment(path);
  if (fragment) {
    const elToReplace = getReplaceEl(a);
    const sections = fragment.querySelectorAll(':scope > .section');
    const children = sections.length === 1
      ? fragment.querySelectorAll(':scope > *')
      : [fragment];
    for (const [idx, child] of children.entries()) {
      if (path.startsWith('/')) child.id = btoa(encodeURIComponent(`${path}/${idx + 1}`));
      elToReplace.insertAdjacentElement('afterend', child);
    }
    elToReplace.remove();
  }
}
