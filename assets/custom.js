/**
 * DEVELOPER DOCUMENTATION
 *
 * Include your custom JavaScript here.
 *
 * The theme Focal has been developed to be easily extensible through the usage of a lot of different JavaScript
 * events, as well as the usage of custom elements (https://developers.google.com/web/fundamentals/web-components/customelements)
 * to easily extend the theme and re-use the theme infrastructure for your own code.
 *
 * The technical documentation is summarized here.
 *
 * ------------------------------------------------------------------------------------------------------------
 * BEING NOTIFIED WHEN A VARIANT HAS CHANGED
 * ------------------------------------------------------------------------------------------------------------
 *
 * This event is fired whenever a the user has changed the variant in a selector. The target get you the form
 * that triggered this event.
 *
 * Example:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   let variant = event.detail.variant; // Gives you access to the whole variant details
 *   let form = event.target;
 * });
 *
 * ------------------------------------------------------------------------------------------------------------
 * MANUALLY CHANGE A VARIANT
 * ------------------------------------------------------------------------------------------------------------
 *
 * You may want to manually change the variant, and let the theme automatically adjust all the selectors. To do
 * that, you can get the DOM element of type "<product-variants>", and call the selectVariant method on it with
 * the variant ID.
 *
 * Example:
 *
 * const productVariantElement = document.querySelector('product-variants');
 * productVariantElement.selectVariant(12345);
 *
 * ------------------------------------------------------------------------------------------------------------
 * BEING NOTIFIED WHEN A NEW VARIANT IS ADDED TO THE CART
 * ------------------------------------------------------------------------------------------------------------
 *
 * This event is fired whenever a variant is added to the cart through a form selector (product page, quick
 * view...). This event DOES NOT include any change done through the cart on an existing variant. For that,
 * please refer to the "cart:updated" event.
 *
 * Example:
 *
 * document.addEventListener('variant:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 * });
 *
 * ------------------------------------------------------------------------------------------------------------
 * BEING NOTIFIED WHEN THE CART CONTENT HAS CHANGED
 * ------------------------------------------------------------------------------------------------------------
 *
 * This event is fired whenever the cart content has changed (if the quantity of a variant has changed, if a variant
 * has been removed, if the note has changed...). This event will also be emitted when a new variant has been
 * added (so you will receive both "variant:added" and "cart:updated"). Contrary to the variant:added event,
 * this event will give you the complete details of the cart.
 *
 * Example:
 *
 * document.addEventListener('cart:updated', function(event) {
 *   var cart = event.detail.cart; // Get the updated content of the cart
 * });
 *
 * ------------------------------------------------------------------------------------------------------------
 * REFRESH THE CART/MINI-CART
 * ------------------------------------------------------------------------------------------------------------
 *
 * If you are adding variants to the cart and would like to instruct the theme to re-render the cart, you cart
 * send the cart:refresh event, as shown below:
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 *
 * ------------------------------------------------------------------------------------------------------------
 * USAGE OF CUSTOM ELEMENTS
 * ------------------------------------------------------------------------------------------------------------
 *
 * Our theme makes extensive use of HTML custom elements. Custom elements are an awesome way to extend HTML
 * by creating new elements that carry their own JavaScript for adding new behavior. The theme uses a large
 * number of custom elements, but the two most useful are drawer and popover. Each of those components add
 * a "open" attribute that you can toggle on and off. For instance, let's say you would like to open the cart
 * drawer, whose id is "mini-cart", you simply need to retrieve it and set its "open" attribute to true (or
 * false to close it):
 *
 * document.getElementById('mini-cart').open = true;
 *
 * Thanks to the power of custom elements, the theme will take care automagically of trapping focus, maintaining
 * proper accessibility attributes...
 *
 * If you would like to create your own drawer, you can re-use the <drawer-content> content. Here is a simple
 * example:
 *
 * // Make sure you add "aria-controls", "aria-expanded" and "is" HTML attributes to your button:
 * <button type="button" is="toggle-button" aria-controls="id-of-drawer" aria-expanded="false">Open drawer</button>
 *
 * <drawer-content id="id-of-drawer">
 *   Your content
 * </drawer-content>
 *
 * The nice thing with custom elements is that you do not actually need to instantiate JavaScript yourself: this
 * is done automatically as soon as the element is inserted to the DOM.
 *
 * ------------------------------------------------------------------------------------------------------------
 * THEME DEPENDENCIES
 * ------------------------------------------------------------------------------------------------------------
 *
 * While the theme tries to keep outside dependencies as small as possible, the theme still uses third-party code
 * to power some of its features. Here is the list of all dependencies:
 *
 * "vendor.js":
 *
 * The vendor.js contains required dependencies. This file is loaded in parallel of the theme file.
 *
 * - custom-elements polyfill (used for built-in elements on Safari - v1.0.0): https://github.com/ungap/custom-elements
 * - web-animations-polyfill (used for polyfilling WebAnimations on Safari 12, this polyfill will be removed in 1 year - v2.3.2): https://github.com/web-animations/web-animations-js
 * - instant-page (v5.1.0): https://github.com/instantpage/instant.page
 * - tocca (v2.0.9); https://github.com/GianlucaGuarini/Tocca.js/
 * - seamless-scroll-polyfill (v2.0.0): https://github.com/magic-akari/seamless-scroll-polyfill
 *
 * "flickity.js": v2.2.0 (with the "fade" package). Flickity is only loaded on demand if there is a product image
 * carousel on the page. Otherwise it is not loaded.
 *
 * "photoswipe": v4.1.3. PhotoSwipe is only loaded on demand to power the zoom feature on product page. If the zoom
 * feature is disabled, then this script is never loaded.
 */


// Updating the RMA language depending on the selected language
function updateLinkRMA(languageSelector) {
  const selectedLanguage = languageSelector.querySelector('[name="locale_code"]').value;
  const rmaButton = document.querySelector('.order-foot__rma-button');
  console.log('rmaButton', rmaButton)
  console.log('selectedLanguage', selectedLanguage)
  if(rmaButton) {
    const orderToken = rmaButton.dataset.orderToken;
    const customerEmail = rmaButton.dataset.customerEmail;
    rmaButton.setAttribute('href', `https://rma.obsequ.de?token=${orderToken}&email=${customerEmail}&lang=${selectedLanguage}`);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const languageSelector = document.querySelector('#header-localization-form');
  if (languageSelector) {
    updateLinkRMA(languageSelector)
    languageSelector.addEventListener('change', updateLinkRMA(languageSelector));
  }
})

// Updating the Wholesale Cart Save app's page layout
let saveCartAppObserver = new MutationObserver(() => {
  const addToCartBtn = document.querySelector('.aod_btn.btn-success');
  const addNewProductBtn = document.querySelector('.aod_add_new_prd_btn');
  const row = addNewProductBtn.closest('.row');
  const mainRow = addNewProductBtn.closest('.flex-row-reverse');
  const subtotalText = document.querySelector('.aodsubtotalText');

  subtotalText.innerHTML = "MY SAVED CART:";
  row.insertBefore(addToCartBtn, addNewProductBtn);
  addToCartBtn.style.background = '#282828';
  addToCartBtn.style.borderColor = '#282828';
  mainRow.insertBefore(subtotalText, row);
  row.style.flexDirection = 'row-reverse';
  mainRow.style.justifyContent = 'space-between';
  mainRow.classList.remove('flex-row-reverse');
});

window.addEventListener('DOMContentLoaded', () => {
  const saveCartAppLoader = document.querySelector('#aod_loader');

  if(saveCartAppLoader){
    saveCartAppObserver.observe(saveCartAppLoader, {
      attributes: true
    });
  }
})

// Updating header dropdowns classnames
const headerDropdowns = document.querySelectorAll('.nav-bar .desktop-menu--wrapper')

if (headerDropdowns.length) {
  headerDropdowns.forEach(function (element, index) {
    const dropdownColumnsLength = element.querySelectorAll('.navigation__item').length

    if (dropdownColumnsLength === 1) {
      element.closest('.nav-bar__item').classList.add('js-single-column')
    }
  })
}

// Mobile menu
const openPanelElems = document.querySelectorAll('[data-action="open-panel"]');
openPanelElems.forEach(elem => {
  elem.addEventListener('click', (e) => {
    e.target.setAttribute('aria-expanded', 'true');
    document.querySelector("#".concat(e.target.getAttribute('aria-controls'))).classList.add('is-open');

  })
})
const closePanelElems = document.querySelectorAll('[data-action="close-panel"]');
closePanelElems.forEach(elem => {
  elem.addEventListener('click', (e) => {
    // We first get the panel to be closed
    const panelToClose = e.target.closest('.mobile-menu__panel.is-open');
    panelToClose.classList.remove('is-open'); // Then update the ARIA attributes for button that control it

    document.querySelector("[aria-controls=\"".concat(panelToClose.id, "\"]")).setAttribute('aria-expanded', 'false');
  })
})

// Collection view buttons observer
let collectionViewButtonsObserver = new MutationObserver((changes) => {
  if (changes.some(change => change.target.id === 'gf-products')) {
    const productItemElems = document.querySelector('.product-list__inner');

    if (productItemElems) {
      const collectionLayout = sessionStorage.getItem('collectionLayout');
      const defaultView = window.themeVariables.settings.collectionLayout;

      collectionLayout === 'grid' || defaultView === 'grid' ?
        productItemElems.classList.remove('product-list__inner--list') :
        productItemElems.classList.add('product-list__inner--list');
    }
  }
  if (changes.some(change => change.target.id === 'gf-grid')) {
    const productItemElems = document.querySelector('.product-list__inner');
    const collectionViewButtons = document.querySelectorAll('.collection__layout-button');
    const collectionLayout = sessionStorage.getItem('collectionLayout');

    collectionViewButtons.forEach(button => {
      const buttonView = button.dataset.layoutMode;
      const defaultView = window.themeVariables.settings.collectionLayout;
      if (collectionLayout === buttonView || defaultView === buttonView) {
        button.classList.add('is-selected');
      } else {
        button.classList.remove('is-selected');
      }

      button.addEventListener('click', () => {
        sessionStorage.setItem('collectionLayout', buttonView);
        buttonView == 'grid' ?
          productItemElems.classList.remove('product-list__inner--list') :
          productItemElems.classList.add('product-list__inner--list');

        collectionViewButtons.forEach(button => {
          button.classList.remove('is-selected');
        })

        button.classList.add('is-selected');
      })

    });
  }
});

const productList = document.querySelector('.product-list');
if (productList) {
  collectionViewButtonsObserver.observe(productList, {
    childList: true,
    subtree: true
  });
}
