/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: UPS About site cleanup.
 * Selectors from captured DOM of about.ups.com/us/en/home.html
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Cookie consent banner (found: #onetrust-consent-sdk, #onetrust-banner-sdk, #onetrust-pc-sdk)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '#onetrust-pc-sdk',
      '[class*="onetrust"]',
    ]);

    // Language selector modal (found: #upspr-language-selector-modal)
    WebImporter.DOMUtils.remove(element, [
      '#upspr-language-selector-modal',
      '.upspr-lang-select',
    ]);

    // Tracking pixels and iframes (found: #db-sync, #db_lr_pixel_ad)
    WebImporter.DOMUtils.remove(element, [
      '#db-sync',
      '#db_lr_pixel_ad',
      '#ZN_dpzhr48CPI7BKES',
    ]);

    // Remove overflow hidden if set
    if (element.style && element.style.overflow === 'hidden') {
      element.style.overflow = 'scroll';
    }
  }

  if (hookName === H.after) {
    // Header/navigation (found: .cmp-experiencefragment--upspr-header-fragment, #uspsr-navContainer)
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--upspr-header-fragment',
      '#uspsr-navContainer',
      '#upspr-headerWrap',
    ]);

    // Footer (found: .cmp-experiencefragment--upspr-footer-fragment, .upspr-footer)
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--upspr-footer-fragment',
      '.upspr-footer',
      '#global-forms',
    ]);

    // Overlay elements (found: .upspr-overlay, .upspr-overlay-global)
    WebImporter.DOMUtils.remove(element, [
      '.upspr-overlay',
      '.upspr-overlay-global',
    ]);

    // Hidden inputs and non-content elements
    WebImporter.DOMUtils.remove(element, [
      'input[type="hidden"]',
      'input#authorModeState',
      'input#searchResultsPagePathId',
      'input#noSearchResultsPageId',
      'input#upsStoriesPathId',
      'input#site-name',
      'link',
      'noscript',
      'iframe',
    ]);

    // Clean tracking attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
      el.removeAttribute('data-lang-region');
    });

    // Normalize absolute UPS URLs to relative paths
    element.querySelectorAll('a[href*="about.ups.com"]').forEach((a) => {
      try {
        const url = new URL(a.href || a.getAttribute('href'), 'https://about.ups.com');
        if (url.hostname === 'about.ups.com') {
          a.setAttribute('href', url.pathname + url.search + url.hash);
        }
      } catch (e) { /* skip malformed URLs */ }
    });

    // Remove breadcrumb (auto-generated in EDS)
    WebImporter.DOMUtils.remove(element, [
      '.upspr-breadcrumb-container',
      '.upspr-breadcrumb',
      '.cmp-experiencefragment--breadcrumbExperienceFragment',
    ]);

    // Remove social share sidebar (not migrated as content)
    WebImporter.DOMUtils.remove(element, [
      '.upspr-social-share',
      '.upspr-socialmedia',
    ]);

    // Remove form modals (handled separately)
    WebImporter.DOMUtils.remove(element, [
      '.upspr-form-modal',
      '#requestSpeakerModal',
      '#filterModal',
    ]);

    // Remove all remaining input elements
    WebImporter.DOMUtils.remove(element, [
      'input',
    ]);
  }
}
