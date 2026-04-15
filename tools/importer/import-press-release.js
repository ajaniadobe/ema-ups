/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroArticleParser from './parsers/hero-article.js';
import cardsStoryTeaserParser from './parsers/cards-story-teaser.js';

// TRANSFORMER IMPORTS
import upsCleanupTransformer from './transformers/ups-cleanup.js';
import upsSectionsTransformer from './transformers/ups-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-article': heroArticleParser,
  'cards-story-teaser': cardsStoryTeaserParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'press-release',
  description: 'Press release article page for financial and corporate announcements',
  urls: ['https://about.ups.com/us/en/newsroom/press-releases/financials/ups-releases-4q-2025-earnings-and-provides-2026-guidance.html'],
  blocks: [
    {
      name: 'hero-article',
      instances: ['.pr15-details .upspr-two-column_header'],
    },
    {
      name: 'cards-story-teaser',
      instances: ['.pr04-threecolumnteaser .upspr-three-column-teaser'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Article Hero',
      selector: '.pr15-details',
      style: null,
      blocks: ['hero-article'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Article Body',
      selector: '.upspr-two-column_inner .par',
      style: null,
      blocks: [],
      defaultContent: ['.cmp-text', '.articleText'],
    },
    {
      id: 'section-3',
      name: 'Related Stories',
      selector: '.pr24-background-colour .pr04-threecolumnteaser',
      style: 'light-grey',
      blocks: ['cards-story-teaser'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  upsCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [upsSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
