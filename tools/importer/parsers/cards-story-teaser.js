/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-story-teaser.
 * Base: cards. Source: https://about.ups.com/us/en/home.html
 * Selector: .pr04-threecolumnteaser .upspr-three-column-teaser
 *
 * Cards block: 2 columns, N rows (one per card).
 * Each row = 1 card: col1 = image (field: image), col2 = text (field: text)
 */
export default function parse(element, { document }) {
  // Use only .upspr-stories-list__item to avoid duplicates (upspr-content-tile is nested inside)
  const cards = element.querySelectorAll('.upspr-stories-list__item');
  const cells = [];

  cards.forEach((card) => {
    // Column 1: Card image - handle srcset images
    const img = card.querySelector('.upspr-tile-image, .upspr-content-tile__image img');
    const imgFrag = document.createDocumentFragment();
    if (img) {
      imgFrag.appendChild(document.createComment(' field:image '));
      const newImg = document.createElement('img');
      // Use src first, fall back to srcset
      newImg.src = img.src || img.getAttribute('srcset')?.split(',')[0]?.trim()?.split(/\s+/)[0] || '';
      newImg.alt = img.alt || '';
      imgFrag.appendChild(newImg);
    }

    // Column 2: Card text content
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    // Get the details link (second .upspr-content-tile__link has the h3)
    const detailsLink = card.querySelector('.upspr-content-tile__details .upspr-content-tile__link');
    const heading = card.querySelector('.upspr-content-tile__details h3');
    const eyebrow = card.querySelector('.upspr-eyebrow-text');
    const desc = card.querySelector('.upspr-description');

    if (heading) {
      const h = document.createElement('h3');
      if (detailsLink) {
        const a = document.createElement('a');
        a.href = detailsLink.getAttribute('href') || '';
        a.textContent = heading.textContent.trim();
        h.appendChild(a);
      } else {
        h.textContent = heading.textContent.trim();
      }
      textFrag.appendChild(h);
    }
    if (eyebrow) {
      const p = document.createElement('p');
      p.textContent = eyebrow.textContent.trim();
      textFrag.appendChild(p);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textFrag.appendChild(p);
    }

    cells.push([imgFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-story-teaser', cells });
  element.replaceWith(block);
}
