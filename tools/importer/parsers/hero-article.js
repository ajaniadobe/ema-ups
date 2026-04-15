/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-article.
 * Base: hero. Source: about.ups.com story pages
 * Selector: .pr15-details .upspr-two-column
 *
 * Hero block: 1 column, 2 rows.
 * Row 1: hero image. Row 2: eyebrow + title + date + subtitle
 */
export default function parse(element, { document }) {
  const img = element.querySelector('.upspr-heroimage_img, picture img, img');
  const source = element.querySelector('picture source[media*="992"]');
  const eyebrow = element.querySelector('.upspr-eyebrow-text');
  const heading = element.querySelector('.upspr-two-column_title h1, h1');
  const date = element.querySelector('.upspr-story-date');
  const subtitle = element.querySelector('.upspr-two-column_subtext p, .upspr-two-column_subtext');

  const cells = [];

  // Row 1: Image - handle srcset
  const imgFrag = document.createDocumentFragment();
  imgFrag.appendChild(document.createComment(' field:image '));
  if (img || source) {
    const newImg = document.createElement('img');
    const imgSrc = source?.getAttribute('srcset')
      || img?.getAttribute('src')
      || img?.getAttribute('srcset')?.split(',')[0]?.trim()?.split(/\s+/)[0]
      || '';
    newImg.src = imgSrc;
    newImg.alt = img?.alt || '';
    imgFrag.appendChild(newImg);
  }
  cells.push([imgFrag]);

  // Row 2: Text content
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));
  if (eyebrow) {
    const p = document.createElement('p');
    p.textContent = eyebrow.textContent.trim();
    textFrag.appendChild(p);
  }
  if (heading) textFrag.appendChild(heading.cloneNode(true));
  if (date) {
    const p = document.createElement('p');
    p.textContent = date.textContent.trim();
    textFrag.appendChild(p);
  }
  if (subtitle) {
    const p = document.createElement('p');
    p.textContent = subtitle.textContent?.trim() || '';
    textFrag.appendChild(p);
  }
  cells.push([textFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-article', cells });
  element.replaceWith(block);
}
