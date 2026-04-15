/* eslint-disable */
/* global WebImporter */
/** Parser for advanced-tabs-awards. Source: about.ups.com awards page */
export default function parse(element, { document }) {
  const tabList = element.querySelectorAll('.cmp-tabs__tab');
  const tabPanels = element.querySelectorAll('.cmp-tabs__tabpanel');
  const cells = [];

  tabList.forEach((tab, index) => {
    const tabLabel = tab.textContent.trim();
    const panel = tabPanels[index];

    const contentFrag = document.createDocumentFragment();
    if (panel) {
      const items = panel.querySelectorAll('.upspr-recognition__item');
      items.forEach((item) => {
        const eyebrow = item.querySelector('.upspr-eyebrow-text');
        const title = item.querySelector('h3');
        const date = item.querySelector('.upspr-story-date');
        const desc = item.querySelector('.content-block > p, .result-description p');
        const link = item.querySelector('a.award-read-more');

        if (title) {
          const h = document.createElement('h3');
          h.textContent = title.textContent.trim();
          contentFrag.appendChild(h);
        }
        if (eyebrow) {
          const em = document.createElement('em');
          em.textContent = eyebrow.textContent.trim();
          contentFrag.appendChild(em);
        }
        if (date) {
          const small = document.createElement('p');
          small.textContent = date.textContent.trim();
          contentFrag.appendChild(small);
        }
        if (desc) {
          const p = document.createElement('p');
          p.textContent = desc.textContent.trim();
          contentFrag.appendChild(p);
        }
        if (link) {
          const a = document.createElement('p');
          const anchor = document.createElement('a');
          anchor.href = link.href || link.getAttribute('href');
          anchor.textContent = link.textContent.trim() || 'Read More';
          a.appendChild(anchor);
          contentFrag.appendChild(a);
        }
        contentFrag.appendChild(document.createElement('hr'));
      });
    }

    cells.push([tabLabel, contentFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'advanced-tabs-awards', cells });
  element.replaceWith(block);
}
