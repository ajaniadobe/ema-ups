var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-story-article.js
  var import_story_article_exports = {};
  __export(import_story_article_exports, {
    default: () => import_story_article_default
  });

  // tools/importer/parsers/hero-article.js
  function parse(element, { document }) {
    var _a, _b, _c, _d;
    const img = element.querySelector(".upspr-heroimage_img, picture img, img");
    const source = element.querySelector('picture source[media*="992"]');
    const eyebrow = element.querySelector(".upspr-eyebrow-text");
    const heading = element.querySelector(".upspr-two-column_title h1, h1");
    const date = element.querySelector(".upspr-story-date");
    const subtitle = element.querySelector(".upspr-two-column_subtext p, .upspr-two-column_subtext");
    const cells = [];
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(" field:image "));
    if (img || source) {
      const newImg = document.createElement("img");
      const imgSrc = (source == null ? void 0 : source.getAttribute("srcset")) || (img == null ? void 0 : img.getAttribute("src")) || ((_c = (_b = (_a = img == null ? void 0 : img.getAttribute("srcset")) == null ? void 0 : _a.split(",")[0]) == null ? void 0 : _b.trim()) == null ? void 0 : _c.split(/\s+/)[0]) || "";
      newImg.src = imgSrc;
      newImg.alt = (img == null ? void 0 : img.alt) || "";
      imgFrag.appendChild(newImg);
    }
    cells.push([imgFrag]);
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(" field:text "));
    if (eyebrow) {
      const p = document.createElement("p");
      p.textContent = eyebrow.textContent.trim();
      textFrag.appendChild(p);
    }
    if (heading) textFrag.appendChild(heading.cloneNode(true));
    if (date) {
      const p = document.createElement("p");
      p.textContent = date.textContent.trim();
      textFrag.appendChild(p);
    }
    if (subtitle) {
      const p = document.createElement("p");
      p.textContent = ((_d = subtitle.textContent) == null ? void 0 : _d.trim()) || "";
      textFrag.appendChild(p);
    }
    cells.push([textFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-story-teaser.js
  function parse2(element, { document }) {
    const cards = element.querySelectorAll(".upspr-stories-list__item");
    const cells = [];
    cards.forEach((card) => {
      var _a, _b, _c;
      const img = card.querySelector(".upspr-tile-image, .upspr-content-tile__image img");
      const imgFrag = document.createDocumentFragment();
      if (img) {
        imgFrag.appendChild(document.createComment(" field:image "));
        const newImg = document.createElement("img");
        newImg.src = img.src || ((_c = (_b = (_a = img.getAttribute("srcset")) == null ? void 0 : _a.split(",")[0]) == null ? void 0 : _b.trim()) == null ? void 0 : _c.split(/\s+/)[0]) || "";
        newImg.alt = img.alt || "";
        imgFrag.appendChild(newImg);
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      const detailsLink = card.querySelector(".upspr-content-tile__details .upspr-content-tile__link");
      const heading = card.querySelector(".upspr-content-tile__details h3");
      const eyebrow = card.querySelector(".upspr-eyebrow-text");
      const desc = card.querySelector(".upspr-description");
      if (heading) {
        const h = document.createElement("h3");
        if (detailsLink) {
          const a = document.createElement("a");
          a.href = detailsLink.getAttribute("href") || "";
          a.textContent = heading.textContent.trim();
          h.appendChild(a);
        } else {
          h.textContent = heading.textContent.trim();
        }
        textFrag.appendChild(h);
      }
      if (eyebrow) {
        const p = document.createElement("p");
        p.textContent = eyebrow.textContent.trim();
        textFrag.appendChild(p);
      }
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        textFrag.appendChild(p);
      }
      cells.push([imgFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-story-teaser", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/ups-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        "#onetrust-pc-sdk",
        '[class*="onetrust"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#upspr-language-selector-modal",
        ".upspr-lang-select"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#db-sync",
        "#db_lr_pixel_ad",
        "#ZN_dpzhr48CPI7BKES"
      ]);
      if (element.style && element.style.overflow === "hidden") {
        element.style.overflow = "scroll";
      }
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        ".cmp-experiencefragment--upspr-header-fragment",
        "#uspsr-navContainer",
        "#upspr-headerWrap"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".cmp-experiencefragment--upspr-footer-fragment",
        ".upspr-footer",
        "#global-forms"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".upspr-overlay",
        ".upspr-overlay-global"
      ]);
      WebImporter.DOMUtils.remove(element, [
        'input[type="hidden"]',
        "input#authorModeState",
        "input#searchResultsPagePathId",
        "input#noSearchResultsPageId",
        "input#upsStoriesPathId",
        "input#site-name",
        "link",
        "noscript",
        "iframe"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
        el.removeAttribute("data-lang-region");
      });
      element.querySelectorAll('a[href*="about.ups.com"]').forEach((a) => {
        try {
          const url = new URL(a.href || a.getAttribute("href"), "https://about.ups.com");
          if (url.hostname === "about.ups.com") {
            a.setAttribute("href", url.pathname + url.search + url.hash);
          }
        } catch (e) {
        }
      });
      WebImporter.DOMUtils.remove(element, [
        ".upspr-breadcrumb-container",
        ".upspr-breadcrumb",
        ".cmp-experiencefragment--breadcrumbExperienceFragment"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".upspr-social-share",
        ".upspr-socialmedia"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".upspr-form-modal",
        "#requestSpeakerModal",
        "#filterModal"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "input"
      ]);
    }
  }

  // tools/importer/transformers/ups-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const template = payload && payload.template;
      if (!template || !template.sections || template.sections.length < 2) {
        return;
      }
      const document = element.ownerDocument;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadataBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.parentNode.insertBefore(sectionMetadataBlock, sectionEl.nextSibling);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      }
    }
  }

  // tools/importer/import-story-article.js
  var parsers = {
    "hero-article": parse,
    "cards-story-teaser": parse2
  };
  var PAGE_TEMPLATE = {
    name: "story-article",
    description: "Long-form story article page featuring customer and company narratives",
    urls: ["https://about.ups.com/us/en/our-stories/customer-first/a-peek-into-peak-shipping-season-at-ups.html"],
    blocks: [
      {
        name: "hero-article",
        instances: [".pr15-details .upspr-two-column_header"]
      },
      {
        name: "cards-story-teaser",
        instances: [".pr04-threecolumnteaser .upspr-three-column-teaser"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Article Hero",
        selector: ".pr15-details",
        style: null,
        blocks: ["hero-article"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Article Body",
        selector: ".upspr-two-column_inner .par",
        style: null,
        blocks: [],
        defaultContent: [".cmp-text", ".articleText"]
      },
      {
        id: "section-3",
        name: "Related Stories",
        selector: ".pr24-background-colour .pr04-threecolumnteaser",
        style: "light-grey",
        blocks: ["cards-story-teaser"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_story_article_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_story_article_exports);
})();
