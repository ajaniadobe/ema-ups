/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-featured-story.
 * Base: hero. Source: https://about.ups.com/us/en/home.html
 * Selector: .hero.aem-GridColumn .upspr-heroimage
 *
 * Hero block: 1 column, 2 rows.
 * Row 1: background image (field: image)
 * Row 2: text content (field: text)
 */
export default function parse(element, { document }) {
  // Extract image - handle srcset and picture/source elements
  const img = element.querySelector('img.upspr-heroimage_img, picture img, img');
  const source = element.querySelector('picture source[media*="992"]');

  const cells = [];

  // Row 1: Background image
  const imgFrag = document.createDocumentFragment();
  imgFrag.appendChild(document.createComment(' field:image '));
  if (img || source) {
    const newImg = document.createElement('img');
    // Prefer largest source, then img src, then img srcset
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

  const eyebrow = element.querySelector('.upspr-eyebrow-text');
  const heading = element.querySelector('h4.upspr-heroimage_msg--title, .upspr-heroimage_msg h4, .upspr-heroimage_msg h3, .upspr-heroimage_msg h2');
  const description = element.querySelector('.upspr-heroimage_msg > p');
  const cta = element.querySelector('.upspr-read-the-story a');

  if (eyebrow) {
    const p = document.createElement('p');
    p.textContent = eyebrow.textContent.trim();
    textFrag.appendChild(p);
  }
  if (heading) textFrag.appendChild(heading.cloneNode(true));
  if (description) textFrag.appendChild(description.cloneNode(true));
  if (cta) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = cta.getAttribute('href') || '';
    a.textContent = cta.textContent.trim();
    p.appendChild(a);
    textFrag.appendChild(p);
  }
  cells.push([textFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-featured-story', cells });
  element.replaceWith(block);
}
