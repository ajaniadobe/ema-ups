/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: UPS About section breaks and section-metadata.
 * Runs in afterTransform only. Uses payload.template.sections.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const template = payload && payload.template;
    if (!template || !template.sections || template.sections.length < 2) {
      return;
    }

    const document = element.ownerDocument;
    const sections = template.sections;

    // Process sections in reverse order to avoid shifting issues
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];

      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) continue;

      // Add section-metadata block if section has a style
      if (section.style) {
        const sectionMetadataBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.parentNode.insertBefore(sectionMetadataBlock, sectionEl.nextSibling);
      }

      // Add section break (<hr>) before section (except first)
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    }
  }
}
