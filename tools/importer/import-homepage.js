/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroFeaturedStoryParser from './parsers/hero-featured-story.js';
import cardsStoryTeaserParser from './parsers/cards-story-teaser.js';
import heroFactsParser from './parsers/hero-facts.js';
import columnsShowcaseParser from './parsers/columns-showcase.js';

// TRANSFORMER IMPORTS
import upsCleanupTransformer from './transformers/ups-cleanup.js';
import upsSectionsTransformer from './transformers/ups-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-featured-story': heroFeaturedStoryParser,
  'cards-story-teaser': cardsStoryTeaserParser,
  'hero-facts': heroFactsParser,
  'columns-showcase': columnsShowcaseParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Main homepage with hero, featured content, and corporate overview',
  urls: ['https://about.ups.com/us/en/home.html'],
  blocks: [
    {
      name: 'hero-featured-story',
      instances: ['.hero.aem-GridColumn .upspr-heroimage:not(.vertical-hero)'],
    },
    {
      name: 'cards-story-teaser',
      instances: ['.pr04-threecolumnteaser .upspr-three-column-teaser'],
    },
    {
      name: 'hero-facts',
      instances: ['.hero.aem-GridColumn .vertical-hero'],
    },
    {
      name: 'columns-showcase',
      instances: ['.sectioncard .upspr-xd-card'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Headline',
      selector: '.headline.aem-GridColumn .upspr-headline',
      style: null,
      blocks: [],
      defaultContent: ['.upspr-headline h1'],
    },
    {
      id: 'section-2',
      name: 'Hero Image with Story Card',
      selector: '.pr24-background-colour:nth-of-type(1) .hero',
      style: null,
      blocks: ['hero-featured-story'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Latest Stories',
      selector: '.pr24-background-colour .pr04-threecolumnteaser',
      style: null,
      blocks: ['cards-story-teaser'],
      defaultContent: ['.upspr-latest-stories-cta a'],
    },
    {
      id: 'section-4',
      name: 'About Us CTA',
      selector: '.headline.aem-GridColumn:nth-of-type(2) .upspr-headline',
      style: null,
      blocks: [],
      defaultContent: ['.upspr-headline h4', '.upspr-headline h2', '.headline-cta a'],
    },
    {
      id: 'section-5',
      name: 'Facts and Statistics',
      selector: '.hero.aem-GridColumn .round-corner-hero',
      style: null,
      blocks: ['hero-facts'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Our Impact Section Card',
      selector: '.sectioncard',
      style: null,
      blocks: ['columns-showcase'],
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
