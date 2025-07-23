import {
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  getMetadata
} from './aem.js';

import {
  initMartech,
  updateUserConsent,
  martechEager,
  martechLazy,
  martechDelayed,
} from '../plugins/martech/src/index.js';


const AUDIENCES = {
  mobile: () => window.innerWidth < 600,
  desktop: () => window.innerWidth >= 600,
  // define your custom audiences here as needed
};

let pageType = 'CMS';

const isConsentGiven = true;
const martechLoadedPromise = initMartech(
  // The WebSDK config
  // Documentation: https://experienceleague.adobe.com/en/docs/experience-platform/web-sdk/commands/configure/overview#configure-js
  {
    datastreamId: "0a2e588b-244b-434f-9d7c-6da642f88b89",
    orgId: "0E061E2D61F93F260A495FD6@AdobeOrg",
    defaultConsent: 'in',
    onBeforeEventSend: (payload) => {
      // set custom Target params
      // see doc at https://experienceleague.adobe.com/en/docs/platform-learn/migrate-target-to-websdk/send-parameters#parameter-mapping-summary
      payload.data.__adobe.target ||= {};

      // set custom Analytics params
      // see doc at https://experienceleague.adobe.com/en/docs/analytics/implementation/aep-edge/data-var-mapping
      payload.data.__adobe.analytics ||= {};
    },

    // set custom datastream overrides
    // see doc at:
    // - https://experienceleague.adobe.com/en/docs/experience-platform/web-sdk/commands/datastream-overrides
    // - https://experienceleague.adobe.com/en/docs/experience-platform/datastreams/overrides
    edgeConfigOverrides: {
      // Override the datastream id
      // datastreamId: '...'

      // Override AEP event datasets
      // com_adobe_experience_platform: {
      //   datasets: {
      //     event: {
      //       datasetId: '...'
      //     }
      //   }
      // },

      // Override the Analytics report suites
      // com_adobe_analytics: {
      //   reportSuites: ['...']
      // },

      // Override the Target property token
      // com_adobe_target: {
      //   propertyToken: '...'
      // }
    },
  },
  // The library config
  {
    launchUrls: ["https://assets.adobedtm.com/59610d662d36/7a8753ffe928/launch-91b245998a62-development.min.js"],
    personalization: !!getMetadata('target') && isConsentGiven,
  },
);


/**
 * Moves all the attributes from a given elmenet to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveAttributes(from, to, attributes) {
  if (!attributes) {
    // eslint-disable-next-line no-param-reassign
    attributes = [...from.attributes].map(({ nodeName }) => nodeName);
  }
  attributes.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to?.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Move instrumentation attributes from a given element to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveInstrumentation(from, to) {
  moveAttributes(
    from,
    to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter((attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')),
  );
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks() {
  try {
    // TODO: add auto block, if needed
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await Promise.all([
      martechLoadedPromise.then(martechEager),
      loadSection(main.querySelector('.section'), waitForFirstImage)
    ]);
  }



  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  await martechLazy();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
  window.setTimeout(() => {
    martechDelayed();
    return import('./delayed.js');
  }, 3000);
}

window.adobeDataLayer.push({
  pageContext: {
    pageType,
    pageName: document.title,
    eventType: 'visibilityHidden',
    maxXOffset: 0,
    maxYOffset: 0,
    minXOffset: 0,
    minYOffset: 0,
  },
  _demosystem4: {
    identification:{
      core:{
        ecid: '36662526972022812694144525040584891102'
      }
    }
  },
  web: {
    webPageDetails:{
      name: document.title,
      URL: window.location.href
    }
  }
});


async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();