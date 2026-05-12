import { localizeUrl } from '../../scripts/site-config.js';
import ENV from '../../scripts/utils/env.js';
import { loadFragment } from '../fragment/fragment.js';

async function removeSchedule(a, e) {
  if (ENV === 'prod') {
    a.remove();
    return;
  }
  if (e) console.error(e);
  // eslint-disable-next-line no-console
  console.log(`Could not load: ${a.href}`);
}

async function loadLocalizedEvent(event) {
  const url = new URL(event.fragment);
  const localized = localizeUrl(url);
  const path = localized?.pathname || url.pathname;

  try {
    const fragment = await loadFragment(path);
    return fragment;
  } catch {
    // eslint-disable-next-line no-console
    console.log(`Error fetching ${path} fragment`);
    return null;
  }
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

async function loadEvent(a, event, defEvent) {
  if (!event.fragment) {
    a.remove();
    return;
  }

  let fragment = await loadLocalizedEvent(event);
  if (!fragment) fragment = await loadLocalizedEvent(defEvent);
  if (!fragment) {
    removeSchedule(a);
    return;
  }
  const elToReplace = getReplaceEl(a);
  const sections = fragment.querySelectorAll(':scope > .section');
  const children = sections.length === 1
    ? fragment.querySelectorAll(':scope > *')
    : [fragment];
  for (const child of children) {
    elToReplace.insertAdjacentElement('afterend', child);
  }
  elToReplace.remove();
}

function getDate() {
  const now = Date.now();
  if (ENV === 'prod') return now;

  const sim = localStorage.getItem('aem-schedule')
   || new URL(window.location.href).searchParams.get('schedule');
  return sim * 1000 || now;
}

export default async function init(a) {
  const resp = await fetch(a.href);
  if (!resp.ok) {
    await removeSchedule(a);
    return;
  }
  const { data } = await resp.json();
  data.reverse();
  const now = getDate();
  const found = data.find((evt) => {
    try {
      const start = Date.parse(evt.start);
      const end = Date.parse(evt.end);
      return now > start && now < end;
    } catch {
      // eslint-disable-next-line no-console
      console.log(`Could not get scheduled event: ${evt.name}`);
      return false;
    }
  });

  const defEvent = data.find((evt) => !(evt.start && evt.end));
  const event = found || defEvent;
  if (!event) {
    await removeSchedule(a);
    return;
  }

  await loadEvent(a, event, defEvent);
}
