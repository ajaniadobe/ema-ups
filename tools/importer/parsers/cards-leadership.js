/* eslint-disable */
/* global WebImporter */
/** Parser for cards-leadership. Source: about.ups.com leadership page */
export default function parse(element, { document }) {
  const cards = element.querySelectorAll('.upspr-stories-list__item');
  const cells = [];
  cards.forEach((card) => {
    const img = card.querySelector('.upspr-tile-image, .upspr-content-tile__image img, img');
    const source = card.querySelector('.upspr-content-tile__image picture source[media*="992"]');
    const imgFrag = document.createDocumentFragment();
    if (img || source) {
      imgFrag.appendChild(document.createComment(' field:image '));
      const newImg = document.createElement('img');
      const imgSrc = source?.getAttribute('srcset')
        || img?.getAttribute('src')
        || img?.getAttribute('srcset')?.split(',')[0]?.trim()?.split(/\s+/)[0]
        || '';
      newImg.src = imgSrc;
      newImg.alt = img?.alt || '';
      imgFrag.appendChild(newImg);
    }
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    const name = card.querySelector('h3');
    const title = card.querySelector('p.upspr-job-title, .upspr-job-title');
    const link = card.querySelector('a.upspr-content-tile__link, a.upspr-content-tile__inner');
    if (name) {
      const h = document.createElement('h3');
      if (link) {
        const a = document.createElement('a');
        a.href = link.href || link.getAttribute('href');
        a.textContent = name.textContent.trim();
        h.appendChild(a);
      } else {
        h.textContent = name.textContent.trim();
      }
      textFrag.appendChild(h);
    }
    if (title) {
      const p = document.createElement('p');
      p.textContent = title.textContent.trim();
      textFrag.appendChild(p);
    }
    cells.push([imgFrag, textFrag]);
  });
  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-leadership', cells });
  element.replaceWith(block);
}
