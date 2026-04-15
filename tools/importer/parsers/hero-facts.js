/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-facts.
 * Base: hero. Source: https://about.ups.com/us/en/home.html
 * Selector: .hero.aem-GridColumn .vertical-hero
 *
 * Hero block: 1 column, 2 rows.
 * Row 1: background image (field: image)
 * Row 2: stats list + CTA (field: text)
 */
export default function parse(element, { document }) {
  const img = element.querySelector('img.upspr-heroimage_img, picture img, img');
  const source = element.querySelector('picture source[media*="992"]');

  const cells = [];

  // Row 1: Background image
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

  // Row 2: Stats content + CTA
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));

  // Extract individual fact items
  const factItems = element.querySelectorAll('.upspr-facts__content, .upspr-facts > li');
  if (factItems.length > 0) {
    const ul = document.createElement('ul');
    factItems.forEach((item) => {
      const fact = item.querySelector('.upspr-facts__content--fact, h4');
      const label = item.querySelector('.upspr-facts__content--label, p');
      if (fact || label) {
        const li = document.createElement('li');
        if (fact) {
          const strong = document.createElement('strong');
          strong.textContent = fact.textContent.trim();
          li.appendChild(strong);
        }
        if (label) {
          li.appendChild(document.createTextNode(' ' + label.textContent.trim()));
        }
        ul.appendChild(li);
      }
    });
    textFrag.appendChild(ul);
  }

  const cta = element.querySelector('.upspr-read-the-story a');
  if (cta) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = cta.getAttribute('href') || '';
    a.textContent = cta.textContent.trim();
    p.appendChild(a);
    textFrag.appendChild(p);
  }
  cells.push([textFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-facts', cells });
  element.replaceWith(block);
}
