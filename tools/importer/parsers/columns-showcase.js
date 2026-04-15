/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-showcase.
 * Base: columns. Source: https://about.ups.com/us/en/home.html
 * Selector: .sectioncard .upspr-xd-card
 *
 * Columns block: 2 columns, 1 row.
 * Col 1: image. Col 2: eyebrow + heading + paragraph + CTA
 * Note: Columns blocks do NOT require field hints (per xwalk hinting rules)
 */
export default function parse(element, { document }) {
  // Column 1: Image - handle picture/source/srcset
  const img = element.querySelector('img.upspr-xd-card_image, picture img, img');
  const source = element.querySelector('picture source[media*="992"]');

  const col1Frag = document.createDocumentFragment();
  if (img || source) {
    const newImg = document.createElement('img');
    const imgSrc = source?.getAttribute('srcset')
      || img?.getAttribute('src')
      || img?.getAttribute('srcset')?.split(',')[0]?.trim()?.split(/\s+/)[0]
      || '';
    newImg.src = imgSrc;
    newImg.alt = img?.alt || '';
    col1Frag.appendChild(newImg);
  }

  // Column 2: Content
  const col2Frag = document.createDocumentFragment();
  const eyebrow = element.querySelector('.upspr-xd-card_eyebrow');
  const heading = element.querySelector('.upspr-xd-card_content h2, h2');
  const description = element.querySelector('.upspr-xd-card_content > p');
  const cta = element.querySelector('.upspr-xd-card_content a.btn, a.btn-secondary');

  if (eyebrow) {
    const p = document.createElement('p');
    p.textContent = eyebrow.textContent.trim();
    col2Frag.appendChild(p);
  }
  if (heading) col2Frag.appendChild(heading.cloneNode(true));
  if (description) col2Frag.appendChild(description.cloneNode(true));
  if (cta) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = cta.getAttribute('href') || '';
    if (cta.getAttribute('title')) a.title = cta.getAttribute('title');
    a.textContent = cta.textContent.trim();
    p.appendChild(a);
    col2Frag.appendChild(p);
  }

  const cells = [[col1Frag, col2Frag]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-showcase', cells });
  element.replaceWith(block);
}
