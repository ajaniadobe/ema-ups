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

  // tools/importer/import-corporate-page.js
  var import_corporate_page_exports = {};
  __export(import_corporate_page_exports, {
    default: () => import_corporate_page_default
  });

  // tools/importer/parsers/cards-leadership.js
  function parse(element, { document }) {
    const cards = element.querySelectorAll(".upspr-stories-list__item");
    const cells = [];
    cards.forEach((card) => {
      var _a, _b, _c;
      const img = card.querySelector(".upspr-tile-image, .upspr-content-tile__image img, img");
      const source = card.querySelector('.upspr-content-tile__image picture source[media*="992"]');
      const imgFrag = document.createDocumentFragment();
      if (img || source) {
        imgFrag.appendChild(document.createComment(" field:image "));
        const newImg = document.createElement("img");
        const imgSrc = (source == null ? void 0 : source.getAttribute("srcset")) || (img == null ? void 0 : img.getAttribute("src")) || ((_c = (_b = (_a = img == null ? void 0 : img.getAttribute("srcset")) == null ? void 0 : _a.split(",")[0]) == null ? void 0 : _b.trim()) == null ? void 0 : _c.split(/\s+/)[0]) || "";
        newImg.src = imgSrc;
        newImg.alt = (img == null ? void 0 : img.alt) || "";
        imgFrag.appendChild(newImg);
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      const name = card.querySelector("h3");
      const title = card.querySelector("p.upspr-job-title, .upspr-job-title");
      const link = card.querySelector("a.upspr-content-tile__link, a.upspr-content-tile__inner");
      if (name) {
        const h = document.createElement("h3");
        if (link) {
          const a = document.createElement("a");
          a.href = link.href || link.getAttribute("href");
          a.textContent = name.textContent.trim();
          h.appendChild(a);
        } else {
          h.textContent = name.textContent.trim();
        }
        textFrag.appendChild(h);
      }
      if (title) {
        const p = document.createElement("p");
        p.textContent = title.textContent.trim();
        textFrag.appendChild(p);
      }
      cells.push([imgFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-leadership", cells });
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

  // tools/importer/import-corporate-page.js
  var parsers = {
    "cards-leadership": parse
  };
  var PAGE_TEMPLATE = {
    name: "corporate-page",
    description: "Corporate information page such as leadership, company overview",
    urls: ["https://about.ups.com/us/en/our-company/leadership.html"],
    blocks: [
      {
        name: "cards-leadership",
        instances: [
          "#executive-leadership-team .upspr-stories-list",
          "#board-of-directors .upspr-stories-list"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Headline",
        selector: ".headline.aem-GridColumn .upspr-headline",
        style: "light-grey",
        blocks: [],
        defaultContent: [".upspr-headline h1"]
      },
      {
        id: "section-2",
        name: "Executive Leadership",
        selector: "#executive-leadership-team",
        style: null,
        blocks: ["cards-leadership"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Board of Directors",
        selector: "#board-of-directors",
        style: null,
        blocks: ["cards-leadership"],
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
  var import_corporate_page_default = {
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
  return __toCommonJS(import_corporate_page_exports);
})();
